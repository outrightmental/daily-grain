const { db, admin } = require('./firestore');

class Habit {
  static async create(userId, name, frequencyType, targetCount = 1) {
    const habitRef = db.collection('habits').doc();
    const habitData = {
      userId,
      name,
      frequencyType,
      targetCount,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    await habitRef.set(habitData);
    const habitDoc = await habitRef.get();
    return { id: habitDoc.id, ...habitDoc.data() };
  }

  static async findById(id) {
    const habitDoc = await db.collection('habits').doc(id).get();
    if (!habitDoc.exists) return null;
    return { id: habitDoc.id, ...habitDoc.data() };
  }

  static async findByUserId(userId) {
    const snapshot = await db.collection('habits')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'asc')
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  static async update(id, name, frequencyType, targetCount) {
    await db.collection('habits').doc(id).update({
      name,
      frequencyType,
      targetCount
    });
    return await this.findById(id);
  }

  static async delete(id) {
    // Delete the habit
    await db.collection('habits').doc(id).delete();
    
    // Delete associated logs
    const logsSnapshot = await db.collection('habitLogs')
      .where('habitId', '==', id)
      .get();
    
    const batch = db.batch();
    logsSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    
    return true;
  }
}

module.exports = Habit;
