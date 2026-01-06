const db = require('./database');

class Habit {
  static create(userId, name, frequencyType, targetCount = 1) {
    const stmt = db.prepare(
      'INSERT INTO habits (user_id, name, frequency_type, target_count) VALUES (?, ?, ?, ?)'
    );
    const result = stmt.run(userId, name, frequencyType, targetCount);
    return this.findById(result.lastInsertRowid);
  }

  static findById(id) {
    const stmt = db.prepare('SELECT * FROM habits WHERE id = ?');
    return stmt.get(id);
  }

  static findByUserId(userId) {
    const stmt = db.prepare('SELECT * FROM habits WHERE user_id = ? ORDER BY id');
    return stmt.all(userId);
  }

  static update(id, name, frequencyType, targetCount) {
    const stmt = db.prepare(
      'UPDATE habits SET name = ?, frequency_type = ?, target_count = ? WHERE id = ?'
    );
    stmt.run(name, frequencyType, targetCount, id);
    return this.findById(id);
  }

  static delete(id) {
    const stmt = db.prepare('DELETE FROM habits WHERE id = ?');
    return stmt.run(id);
  }
}

module.exports = Habit;
