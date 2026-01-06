const db = require('./database');

class User {
  static create(phoneNumber, timezone = 'America/New_York') {
    const stmt = db.prepare('INSERT INTO users (phone_number, timezone) VALUES (?, ?)');
    const result = stmt.run(phoneNumber, timezone);
    return this.findById(result.lastInsertRowid);
  }

  static findById(id) {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id);
  }

  static findByPhoneNumber(phoneNumber) {
    const stmt = db.prepare('SELECT * FROM users WHERE phone_number = ?');
    return stmt.get(phoneNumber);
  }

  static getOrCreate(phoneNumber, timezone = 'America/New_York') {
    let user = this.findByPhoneNumber(phoneNumber);
    if (!user) {
      user = this.create(phoneNumber, timezone);
    }
    return user;
  }

  static setDigestTime(userId, time) {
    const stmt = db.prepare('UPDATE users SET digest_time = ? WHERE id = ?');
    stmt.run(time, userId);
    return this.findById(userId);
  }

  static setPaused(userId, isPaused) {
    const stmt = db.prepare('UPDATE users SET is_paused = ? WHERE id = ?');
    stmt.run(isPaused ? 1 : 0, userId);
    return this.findById(userId);
  }

  static getAll() {
    const stmt = db.prepare('SELECT * FROM users WHERE is_paused = 0');
    return stmt.all();
  }
}

module.exports = User;
