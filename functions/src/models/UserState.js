const { db, admin } = require('./firestore');

class UserState {
  static async setState(userId, state, stateData = null) {
    const stateRef = db.collection('userStates').doc(userId);
    
    await stateRef.set({
      state,
      stateData: stateData || null,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
  }

  static async getState(userId) {
    const stateDoc = await db.collection('userStates').doc(userId).get();
    
    if (!stateDoc.exists) return null;
    return { userId: stateDoc.id, ...stateDoc.data() };
  }

  static async clearState(userId) {
    await db.collection('userStates').doc(userId).delete();
  }
}

module.exports = UserState;
