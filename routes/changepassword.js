const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../database/botzilla.db');  // Correct path to database

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log(`Database connected at: ${dbPath}`);
  }
});

router.post('/changepassword', (req, res) => {
  const { UserId, password } = req.body;

  //password is required
  if (!password) {
    return res.status(400).json({ message: 'Password is required!' });
  }

  // Update password in the database
  const queryChangepassword = 'UPDATE users SET password = ? WHERE id = ?';
  db.run(queryChangepassword, [password, UserId], function (err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Success
    res.json({ message: 'Password updated successfully' });
  });
});

module.exports = router;
