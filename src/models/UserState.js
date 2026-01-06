const db = require('./database');

class UserState {
  static setState(userId, state, stateData = null) {
    const stmt = db.prepare(`
      INSERT INTO user_state (user_id, state, state_data, updated_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id) 
      DO UPDATE SET state = excluded.state, state_data = excluded.state_data, updated_at = CURRENT_TIMESTAMP
    `);
    stmt.run(userId, state, stateData ? JSON.stringify(stateData) : null);
  }

  static getState(userId) {
    const stmt = db.prepare('SELECT * FROM user_state WHERE user_id = ?');
    const result = stmt.get(userId);
    if (result && result.state_data) {
      result.state_data = JSON.parse(result.state_data);
    }
    return result;
  }

  static clearState(userId) {
    const stmt = db.prepare('DELETE FROM user_state WHERE user_id = ?');
    stmt.run(userId);
  }
}

module.exports = UserState;
