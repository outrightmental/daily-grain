const Habit = require('../models/Habit');
const HabitLog = require('../models/HabitLog');

class HabitService {
  static async createHabit(userId, name, frequencyType, targetCount = 1) {
    // Validate frequency type
    const validTypes = ['daily', 'multiple_per_day', 'x_per_week'];
    if (!validTypes.includes(frequencyType)) {
      throw new Error(`Invalid frequency type. Must be one of: ${validTypes.join(', ')}`);
    }

    return await Habit.create(userId, name, frequencyType, targetCount);
  }

  static async getUserHabits(userId) {
    return await Habit.findByUserId(userId);
  }

  static async logHabit(habitId, date = null, count = 1) {
    if (!date) {
      date = new Date().toISOString().split('T')[0];
    }
    return await HabitLog.log(habitId, date, count);
  }

  static async getHabitStats(habitId) {
    const habit = await Habit.findById(habitId);
    if (!habit) return null;

    const streak = await HabitLog.getCurrentStreak(habitId);
    const stats30 = await HabitLog.getCompletionStats(habitId, 30);
    const stats7 = await HabitLog.getCompletionStats(habitId, 7);

    return {
      habit,
      streak,
      last30Days: stats30,
      last7Days: stats7
    };
  }

  static async getAllUserStats(userId) {
    const habits = await this.getUserHabits(userId);
    const statsPromises = habits.map(habit => this.getHabitStats(habit.id));
    return await Promise.all(statsPromises);
  }
}

module.exports = HabitService;
