const { db, admin } = require('./firestore');

class HabitLog {
  static async log(habitId, date, completedCount = 1) {
    // Use habitId_date as document ID for uniqueness
    const logId = `${habitId}_${date}`;
    const logRef = db.collection('habitLogs').doc(logId);
    
    const logDoc = await logRef.get();
    
    if (logDoc.exists) {
      // Update existing log
      await logRef.update({
        completedCount: admin.firestore.FieldValue.increment(completedCount),
        loggedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    } else {
      // Create new log
      await logRef.set({
        habitId,
        logDate: date,
        completedCount,
        loggedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    
    return true;
  }

  static async getLog(habitId, date) {
    const logId = `${habitId}_${date}`;
    const logDoc = await db.collection('habitLogs').doc(logId).get();
    
    if (!logDoc.exists) return null;
    return { id: logDoc.id, ...logDoc.data() };
  }

  static async getLogsForHabit(habitId, limit = 30) {
    const snapshot = await db.collection('habitLogs')
      .where('habitId', '==', habitId)
      .orderBy('logDate', 'desc')
      .limit(limit)
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  static async getCurrentStreak(habitId) {
    const logs = await this.getLogsForHabit(habitId, 365);
    if (logs.length === 0) return 0;

    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // Check if logged today or yesterday to start counting
    if (logs[0].logDate !== today && logs[0].logDate !== yesterday) {
      return 0;
    }

    let expectedDate = new Date();
    if (logs[0].logDate === yesterday) {
      expectedDate.setDate(expectedDate.getDate() - 1);
    }

    for (const log of logs) {
      const logDate = log.logDate;
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

  static async getCompletionStats(habitId, days = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const cutoffDateStr = cutoffDate.toISOString().split('T')[0];
    
    const snapshot = await db.collection('habitLogs')
      .where('habitId', '==', habitId)
      .where('logDate', '>=', cutoffDateStr)
      .get();
    
    const completedDays = snapshot.size;
    
    return {
      completedDays,
      totalDays: days,
      completionRate: ((completedDays / days) * 100).toFixed(1)
    };
  }
}

module.exports = HabitLog;
