const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// Configure Firestore settings
db.settings({
  timestampsInSnapshots: true
});

module.exports = { admin, db };
