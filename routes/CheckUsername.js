const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();


const path = require('path');
const dbPath = path.join(__dirname, '../database/botzilla.db');  // Correct pad naar database

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log(`Database connected at: ${dbPath}`);
  }
});


// POST request to check if username exists
router.post('/CheckUsername', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required!' });
  }

  try {
    const query = 'SELECT id, username FROM users WHERE username = ? and password=?';
    db.get(query, [username, password], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Database error' });
      }

      if (result) {
        res.json({ exists: true, user: {id: result.id, username: result.username} });

        console.log("Database query result:", result);


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
