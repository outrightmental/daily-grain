const { db, admin } = require('./firestore');

class User {
  static async create(phoneNumber, timezone = 'America/New_York') {
    const userRef = db.collection('users').doc();
    const userData = {
      phoneNumber,
      timezone,
      digestTime: '09:00',
      isPaused: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    await userRef.set(userData);
    const userDoc = await userRef.get();
    return { id: userDoc.id, ...userDoc.data() };
  }

  static async findById(id) {
    const userDoc = await db.collection('users').doc(id).get();
    if (!userDoc.exists) return null;
    return { id: userDoc.id, ...userDoc.data() };
  }

  static async findByPhoneNumber(phoneNumber) {
    const snapshot = await db.collection('users')
      .where('phoneNumber', '==', phoneNumber)
      .limit(1)
      .get();
    
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }

  static async getOrCreate(phoneNumber, timezone = 'America/New_York') {
    let user = await this.findByPhoneNumber(phoneNumber);
    if (!user) {
      user = await this.create(phoneNumber, timezone);
    }
    return user;
  }

  static async setDigestTime(userId, time) {
    await db.collection('users').doc(userId).update({
      digestTime: time
    });
    return await this.findById(userId);
  }

  static async setPaused(userId, isPaused) {
    await db.collection('users').doc(userId).update({
      isPaused: isPaused
    });
    return await this.findById(userId);
  }

  static async getAll() {
    const snapshot = await db.collection('users')
      .where('isPaused', '==', false)
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }
}

module.exports = User;
