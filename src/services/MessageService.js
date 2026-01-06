const User = require('../models/User');
const Habit = require('../models/Habit');
const UserState = require('../models/UserState');
const HabitService = require('./HabitService');
const DigestService = require('./DigestService');

class MessageService {
  static async handleIncomingMessage(phoneNumber, messageBody) {
    // Get or create user
    const user = User.getOrCreate(phoneNumber);
    const message = messageBody.trim();

    // Check for STATUS command
    if (message.toUpperCase() === 'STATUS') {
      return DigestService.generateStatusReport(user.id);
    }

    // Check for ADD command
    if (message.toUpperCase().startsWith('ADD ')) {
      return this.handleAddHabit(user, message);
    }

    // Check for LIST command
    if (message.toUpperCase() === 'LIST') {
      return DigestService.generateDailyDigest(user.id);
    }

    // Check for HELP command
    if (message.toUpperCase() === 'HELP') {
      return this.getHelpMessage();
    }

    // Check if in a conversation flow (must come before number checking)
    const userState = UserState.getState(user.id);
    if (userState) {
      return this.handleStateMessage(user, userState, message);
    }

    // Check for habit logging (numbers)
    if (/^\d+(\s+\d+)*$/.test(message)) {
      return this.handleLogHabits(user, message);
    }

    // Default: show help
    return this.getHelpMessage();
  }

  static handleAddHabit(user, message) {
    const habitName = message.substring(4).trim();
    
    if (!habitName) {
      return "Please provide a habit name. Example: 'ADD Morning run'";
    }

    // Set state to collect frequency
    UserState.setState(user.id, 'adding_habit', { name: habitName });
    
    return `Adding habit: "${habitName}"\n\nWhat's the frequency?\n1. Daily\n2. Multiple times per day\n3. X times per week\n\nReply with a number (1-3)`;
  }

  static handleStateMessage(user, userState, message) {
    if (userState.state === 'adding_habit') {
      const choice = message.trim();
      
      if (choice === '1') {
        // Daily habit
        HabitService.createHabit(user.id, userState.state_data.name, 'daily', 1);
        UserState.clearState(user.id);
        return `✓ Added daily habit: "${userState.state_data.name}"\n\nReply 'LIST' to see all habits.`;
      } else if (choice === '2') {
        // Multiple per day - ask for count
        UserState.setState(user.id, 'adding_habit_multiple', { name: userState.state_data.name });
        return "How many times per day? (Reply with a number)";
      } else if (choice === '3') {
        // X per week - ask for count
        UserState.setState(user.id, 'adding_habit_weekly', { name: userState.state_data.name });
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
      HabitService.createHabit(user.id, userState.state_data.name, 'multiple_per_day', count);
      UserState.clearState(user.id);
      return `✓ Added habit: "${userState.state_data.name}" (${count}x per day)\n\nReply 'LIST' to see all habits.`;
    }

    if (userState.state === 'adding_habit_weekly') {
      const count = parseInt(message.trim());
      if (isNaN(count) || count < 1 || count > 7) {
        return "Please reply with a number between 1 and 7";
      }
      HabitService.createHabit(user.id, userState.state_data.name, 'x_per_week', count);
      UserState.clearState(user.id);
      return `✓ Added habit: "${userState.state_data.name}" (${count}x per week)\n\nReply 'LIST' to see all habits.`;
    }

    UserState.clearState(user.id);
    return this.getHelpMessage();
  }

  static handleLogHabits(user, message) {
    const habits = Habit.findByUserId(user.id);
    
    if (habits.length === 0) {
      return "You don't have any habits yet. Reply 'ADD [habit name]' to create one.";
    }

    const numbers = message.split(/\s+/).map(n => parseInt(n)).filter(n => !isNaN(n));
    const today = new Date().toISOString().split('T')[0];
    const logged = [];

    for (const num of numbers) {
      if (num >= 1 && num <= habits.length) {
        const habit = habits[num - 1];
        HabitService.logHabit(habit.id, today, 1);
        logged.push(habit.name);
      }
    }

    if (logged.length === 0) {
      return `Invalid habit numbers. You have ${habits.length} habit(s). Reply 'LIST' to see them.`;
    }

    return `✓ Logged: ${logged.join(', ')}\n\nGreat work! Reply 'STATUS' to see your progress.`;
  }

  static getHelpMessage() {
    return `Welcome to Daily Grain! 🌾\n\nCommands:\n• ADD [name] - Add a new habit\n• LIST - See all your habits\n• STATUS - View streaks and stats\n• [numbers] - Log habits (e.g., '1 3')\n• HELP - Show this message`;
  }
}

module.exports = MessageService;
