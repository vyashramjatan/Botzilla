const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();


// Initialize botzilla database
const db = new sqlite3.Database('./mydb.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Database connected!');
  }
});

// POST request to check if username exists
router.post('/CheckUsername', (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: 'Username is required!' });
  }

  try {
    const query = 'SELECT COUNT(*) AS count FROM users WHERE username = ?';
    db.get(query, [username], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Database error' });
      }

      if (result.count > 0) {
        res.json({ exists: true });
      } else {
        res.json({ exists: false });
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
