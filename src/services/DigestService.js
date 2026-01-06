const User = require('../models/User');
const Habit = require('../models/Habit');
const HabitLog = require('../models/HabitLog');
const HabitService = require('./HabitService');

class DigestService {
  static generateDailyDigest(userId) {
    const user = User.findById(userId);
    if (!user) return null;

    const habits = Habit.findByUserId(userId);
    if (habits.length === 0) {
      return "You don't have any habits yet! Reply with 'ADD [habit name]' to create your first habit.";
    }

    const today = new Date().toISOString().split('T')[0];
    let message = "Daily Habits Check-in:\n\n";

    habits.forEach((habit, index) => {
      const log = HabitLog.getLog(habit.id, today);
      const status = log ? '✓' : '○';
      const frequencyText = this.formatFrequency(habit);
      
      message += `${index + 1}. ${status} ${habit.name} (${frequencyText})\n`;
    });

    message += "\nReply with numbers to log (e.g., '1 3' for habits 1 and 3)";
    message += "\nReply 'STATUS' for detailed stats";
    message += "\nReply 'ADD [name]' to add a habit";

    return message;
  }

  static formatFrequency(habit) {
    switch (habit.frequency_type) {
      case 'daily':
        return 'daily';
      case 'multiple_per_day':
        return `${habit.target_count}x/day`;
      case 'x_per_week':
        return `${habit.target_count}x/week`;
      default:
        return 'daily';
    }
  }

  static generateStatusReport(userId) {
    const user = User.findById(userId);
    if (!user) return null;

    const stats = HabitService.getAllUserStats(userId);
    if (stats.length === 0) {
      return "You don't have any habits tracked yet.";
    }

    let message = "Habit Status Report:\n\n";

    stats.forEach((stat, index) => {
      if (!stat) return;
      
      const { habit, streak, last7Days, last30Days } = stat;
      message += `${index + 1}. ${habit.name}\n`;
      message += `   🔥 ${streak} day streak\n`;
      message += `   📊 7d: ${last7Days.completionRate}% (${last7Days.completedDays}/${last7Days.totalDays})\n`;
      message += `   📊 30d: ${last30Days.completionRate}% (${last30Days.completedDays}/${last30Days.totalDays})\n\n`;
    });

    return message.trim();
  }
}

module.exports = DigestService;
