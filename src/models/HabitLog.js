const db = require('./database');

class HabitLog {
  static log(habitId, date, completedCount = 1) {
    const stmt = db.prepare(`
      INSERT INTO habit_logs (habit_id, log_date, completed_count)
      VALUES (?, ?, ?)
      ON CONFLICT(habit_id, log_date) 
      DO UPDATE SET completed_count = completed_count + excluded.completed_count
    `);
    const result = stmt.run(habitId, date, completedCount);
    return result.changes > 0;
  }

  static getLog(habitId, date) {
    const stmt = db.prepare('SELECT * FROM habit_logs WHERE habit_id = ? AND log_date = ?');
    return stmt.get(habitId, date);
  }

  static getLogsForHabit(habitId, limit = 30) {
    const stmt = db.prepare(
      'SELECT * FROM habit_logs WHERE habit_id = ? ORDER BY log_date DESC LIMIT ?'
    );
    return stmt.all(habitId, limit);
  }

  static getCurrentStreak(habitId) {
    const logs = this.getLogsForHabit(habitId, 365);
    if (logs.length === 0) return 0;

    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // Check if logged today or yesterday to start counting
    if (logs[0].log_date !== today && logs[0].log_date !== yesterday) {
      return 0;
    }

    let expectedDate = new Date();
    if (logs[0].log_date === yesterday) {
      expectedDate.setDate(expectedDate.getDate() - 1);
    }

    for (const log of logs) {
      const logDate = log.log_date;
      const expectedDateStr = expectedDate.toISOString().split('T')[0];

      if (logDate === expectedDateStr) {
        streak++;
        expectedDate.setDate(expectedDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }

  static getCompletionStats(habitId, days = 30) {
    const stmt = db.prepare(`
      SELECT COUNT(*) as completed_days
      FROM habit_logs
      WHERE habit_id = ? 
      AND log_date >= date('now', '-' || ? || ' days')
    `);
    const result = stmt.get(habitId, days);
    return {
      completedDays: result.completed_days,
      totalDays: days,
      completionRate: ((result.completed_days / days) * 100).toFixed(1)
    };
  }
}

module.exports = HabitLog;
