const User = require('../models/User');
const Habit = require('../models/Habit');
const HabitLog = require('../models/HabitLog');

class HabitService {
  static createHabit(userId, name, frequencyType, targetCount = 1) {
    // Validate frequency type
    const validTypes = ['daily', 'multiple_per_day', 'x_per_week'];
    if (!validTypes.includes(frequencyType)) {
      throw new Error(`Invalid frequency type. Must be one of: ${validTypes.join(', ')}`);
    }

    return Habit.create(userId, name, frequencyType, targetCount);
  }

  static getUserHabits(userId) {
    return Habit.findByUserId(userId);
  }

  static logHabit(habitId, date = null, count = 1) {
    if (!date) {
      date = new Date().toISOString().split('T')[0];
    }
    return HabitLog.log(habitId, date, count);
  }

  static getHabitStats(habitId) {
    const habit = Habit.findById(habitId);
    if (!habit) return null;

    const streak = HabitLog.getCurrentStreak(habitId);
    const stats30 = HabitLog.getCompletionStats(habitId, 30);
    const stats7 = HabitLog.getCompletionStats(habitId, 7);

    return {
      habit,
      streak,
      last30Days: stats30,
      last7Days: stats7
    };
  }

  static getAllUserStats(userId) {
    const habits = this.getUserHabits(userId);
    return habits.map(habit => this.getHabitStats(habit.id));
  }
}

module.exports = HabitService;
