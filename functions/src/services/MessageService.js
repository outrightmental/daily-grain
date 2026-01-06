const User = require('../models/User');
const Habit = require('../models/Habit');
const UserState = require('../models/UserState');
const HabitService = require('./HabitService');
const DigestService = require('./DigestService');

class MessageService {
  static async handleIncomingMessage(phoneNumber, messageBody) {
    // Get or create user
    const user = await User.getOrCreate(phoneNumber);
    const message = messageBody.trim();

    // Check for STOP command (SMS compliance)
    if (message.toUpperCase() === 'STOP' || message.toUpperCase() === 'UNSUBSCRIBE') {
      await User.setPaused(user.id, true);
      return "You've been unsubscribed. Text START to resume.";
    }

    // Check for START command
    if (message.toUpperCase() === 'START') {
      await User.setPaused(user.id, false);
      return "Welcome back to Daily Grain. You'll receive your daily check-in at " + (user.digestTime || '09:00') + ".";
    }

    // Check for STATUS command
    if (message.toUpperCase() === 'STATUS') {
      return await DigestService.generateStatusReport(user.id);
    }

    // Check for PAUSE command
    if (message.toUpperCase() === 'PAUSE') {
      await User.setPaused(user.id, true);
      return "Daily check-ins paused. Text RESUME to continue.";
    }

    // Check for RESUME command
    if (message.toUpperCase() === 'RESUME') {
      await User.setPaused(user.id, false);
      return "Daily check-ins resumed. You'll receive your next check-in at " + (user.digestTime || '09:00') + ".";
    }

    // Check for TIME command
    if (message.toUpperCase().startsWith('TIME ')) {
      return await this.handleSetTime(user, message);
    }

    // Check for REMOVE command
    if (message.toUpperCase().startsWith('REMOVE ')) {
      return await this.handleRemoveHabit(user, message);
    }

    // Check for ADD command
    if (message.toUpperCase().startsWith('ADD ')) {
      return await this.handleAddHabit(user, message);
    }

    // Check for LIST command
    if (message.toUpperCase() === 'LIST') {
      return await DigestService.generateDailyDigest(user.id);
    }

    // Check for HELP command
    if (message.toUpperCase() === 'HELP') {
      return this.getHelpMessage();
    }

    // Check if in a conversation flow (must come before Y/N checking)
    const userState = await UserState.getState(user.id);
    if (userState) {
      return await this.handleStateMessage(user, userState, message);
    }

    // Check for Y/N reply logging
    if (this.isYesNoReply(message)) {
      return await this.handleYesNoLogHabits(user, message);
    }

    // Check for habit logging (numbers) - backward compatibility
    if (/^\d+(\s+\d+)*$/.test(message)) {
      return await this.handleLogHabits(user, message);
    }

    // Default: show help
    return this.getHelpMessage();
  }

  static isYesNoReply(message) {
    // Check if message contains only Y/N/yes/no/yep variations
    const tokens = message.toUpperCase().split(/\s+/);
    return tokens.every(token => 
      ['Y', 'N', 'YES', 'NO', 'YEP', 'NOPE'].includes(token)
    );
  }

  static async handleYesNoLogHabits(user, message) {
    const habits = await Habit.findByUserId(user.id);
    
    if (habits.length === 0) {
      return "You don't have any habits yet. Reply with 'ADD [habit name]' to create one.";
    }

    const tokens = message.toUpperCase().split(/\s+/);
    const today = new Date().toISOString().split('T')[0];
    const logged = [];
    const skipped = [];

    for (let index = 0; index < tokens.length; index++) {
      if (index >= habits.length) break;
      
      const token = tokens[index];
      const habit = habits[index];
      const isYes = ['Y', 'YES', 'YEP'].includes(token);
      const isNo = ['N', 'NO', 'NOPE'].includes(token);
      
      // Only process if it's a valid Y or N response
      if (!isYes && !isNo) continue;
      
      if (isYes) {
        await HabitService.logHabit(habit.id, today, 1);
        logged.push(habit.name);
      } else {
        skipped.push(habit.name);
      }
    }

    if (logged.length === 0) {
      return "No habits logged today. That's okay—tomorrow is a fresh start.";
    }

    return `Logged: ${logged.join(', ')}\nText STATUS anytime for details.`;
  }

  static async handleSetTime(user, message) {
    const time = message.substring(5).trim();
    
    // Validate HH:MM or H:MM format
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(time)) {
      return "Please use time format (e.g., TIME 08:30 or TIME 8:30)";
    }

    await User.setDigestTime(user.id, time);
    return `Daily check-in time set to ${time}.`;
  }

  static async handleRemoveHabit(user, message) {
    const habitName = message.substring(7).trim().toLowerCase();
    
    if (!habitName) {
      return "Please specify a habit name. Example: 'REMOVE Morning run'";
    }

    const habits = await Habit.findByUserId(user.id);
    const habit = habits.find(h => h.name.toLowerCase() === habitName);
    
    if (!habit) {
      return `Habit "${habitName}" not found. Reply LIST to see your habits.`;
    }

    await Habit.delete(habit.id);
    return `Removed: ${habit.name}`;
  }

  static async handleAddHabit(user, message) {
    const habitName = message.substring(4).trim();
    
    if (!habitName) {
      return "Please provide a habit name. Example: 'ADD Morning run'";
    }

    // Set state to collect frequency
    await UserState.setState(user.id, 'adding_habit', { name: habitName });
    
    return `Adding habit: "${habitName}"\n\nWhat's the frequency?\n1. Daily\n2. Multiple times per day\n3. X times per week\n\nReply with a number (1-3)`;
  }

  static async handleStateMessage(user, userState, message) {
    if (userState.state === 'adding_habit') {
      const choice = message.trim();
      
      if (choice === '1') {
        // Daily habit
        await HabitService.createHabit(user.id, userState.stateData.name, 'daily', 1);
        await UserState.clearState(user.id);
        return `Added daily habit: "${userState.stateData.name}"\nReply LIST to see all habits.`;
      } else if (choice === '2') {
        // Multiple per day - ask for count
        await UserState.setState(user.id, 'adding_habit_multiple', { name: userState.stateData.name });
        return "How many times per day? (Reply with a number)";
      } else if (choice === '3') {
        // X per week - ask for count
        await UserState.setState(user.id, 'adding_habit_weekly', { name: userState.stateData.name });
        return "How many times per week? (Reply with a number)";
      } else {
        return "Please reply with 1, 2, or 3";
      }
    }

    if (userState.state === 'adding_habit_multiple') {
      const count = parseInt(message.trim());
      if (isNaN(count) || count < 1) {
        return "Please reply with a valid number (1 or more)";
      }
      await HabitService.createHabit(user.id, userState.stateData.name, 'multiple_per_day', count);
      await UserState.clearState(user.id);
      return `Added habit: "${userState.stateData.name}" (${count}x per day)\nReply LIST to see all habits.`;
    }

    if (userState.state === 'adding_habit_weekly') {
      const count = parseInt(message.trim());
      if (isNaN(count) || count < 1 || count > 7) {
        return "Please reply with a number between 1 and 7";
      }
      await HabitService.createHabit(user.id, userState.stateData.name, 'x_per_week', count);
      await UserState.clearState(user.id);
      return `Added habit: "${userState.stateData.name}" (${count}x per week)\nReply LIST to see all habits.`;
    }

    await UserState.clearState(user.id);
    return this.getHelpMessage();
  }

  static async handleLogHabits(user, message) {
    const habits = await Habit.findByUserId(user.id);
    
    if (habits.length === 0) {
      return "You don't have any habits yet. Reply 'ADD [habit name]' to create one.";
    }

    const numbers = message.split(/\s+/).map(n => parseInt(n)).filter(n => !isNaN(n));
    const today = new Date().toISOString().split('T')[0];
    const logged = [];

    for (const num of numbers) {
      if (num >= 1 && num <= habits.length) {
        const habit = habits[num - 1];
        await HabitService.logHabit(habit.id, today, 1);
        logged.push(habit.name);
      }
    }

    if (logged.length === 0) {
      return `Invalid habit numbers. You have ${habits.length} habit(s). Reply LIST to see them.`;
    }

    return `Logged: ${logged.join(', ')}\nText STATUS anytime for details.`;
  }

  static getHelpMessage() {
    return `Daily Grain\n\nCommands:\n• ADD [name] - Add a habit\n• REMOVE [name] - Remove a habit\n• LIST - See your habits\n• STATUS - View stats\n• TIME HH:MM - Set check-in time\n• PAUSE / RESUME - Pause/resume\n• STOP - Unsubscribe`;
  }
}

module.exports = MessageService;
