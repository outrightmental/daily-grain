const User = require('../models/User');
const Habit = require('../models/Habit');
const HabitLog = require('../models/HabitLog');
const HabitService = require('./HabitService');

class DigestService {
  static async generateDailyDigest(userId) {
    const user = await User.findById(userId);
    if (!user) return null;

    const habits = await Habit.findByUserId(userId);
    if (habits.length === 0) {
      return "You don't have any habits yet. Reply with 'ADD [habit name]' to create your first habit.";
    }

    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    let message = "Daily Check-in:\n\n";

    for (const habit of habits) {
      const yesterdayLog = await HabitLog.getLog(habit.id, yesterday);
      const streak = await HabitLog.getCurrentStreak(habit.id);
      const stats7 = await HabitLog.getCompletionStats(habit.id, 7);
      
      let statusLine = `${habit.name} (${this.formatFrequency(habit)}): `;
      
      if (streak > 0) {
        statusLine += `${streak}-day streak`;
      } else if (!yesterdayLog) {
        statusLine += `missed yesterday`;
      } else {
        statusLine += `starting fresh`;
      }

      // For weekly habits, show weekly progress
      if (habit.frequencyType === 'x_per_week') {
        statusLine += `, ${stats7.completedDays} of ${habit.targetCount} this week`;
      }

      message += statusLine + '\n';
    }

    message += "\nReply: Y N Y";
    message += "\nText STATUS anytime for details.";

    return message;
  }

  static formatFrequency(habit) {
    switch (habit.frequencyType) {
      case 'daily':
        return 'Daily';
      case 'multiple_per_day':
        return `${habit.targetCount}x/day`;
      case 'x_per_week':
        return `${habit.targetCount}x/week`;
      default:
        return 'Daily';
    }
  }

  static async generateStatusReport(userId) {
    const user = await User.findById(userId);
    if (!user) return null;

    const stats = await HabitService.getAllUserStats(userId);
    if (stats.length === 0) {
      return "You don't have any habits tracked yet.";
    }

    let message = "Status Report:\n\n";

    stats.forEach((stat, index) => {
      if (!stat) return;
      
      const { habit, streak, last7Days, last30Days } = stat;
      message += `${habit.name}\n`;
      message += `Current streak: ${streak} days\n`;
      message += `Last 7 days: ${last7Days.completionRate}% (${last7Days.completedDays}/${last7Days.totalDays})\n`;
      message += `Last 30 days: ${last30Days.completionRate}% (${last30Days.completedDays}/${last30Days.totalDays})\n\n`;
    });

    return message.trim();
  }
}

module.exports = DigestService;
