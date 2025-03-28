const sqlite3 = require("sqlite3").verbose();

//opem of create database
const db = new sqlite3.Database("botzilla.db", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

// Create the 'users' table
db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )`,
    (err) => {
      if (err) {
        console.error("Error creating table:", err.message);
      } else {
        console.log("Table 'users' created or already exists.");
      }
    }
  );

  //10 dummy users met password = 1
  const users = [
    "alice", "bob", "charlie", "dave", "eve",
    "frank", "grace", "heidi", "ivan", "judy"
  ];

  const insertStmt = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)");

  users.forEach((username) => {
    insertStmt.run(username, "1", (err) => {
      if (err) {
        console.error(`Error inserting ${username}:`, err.message);
      } else {
        console.log(`Inserted user: ${username}`);
      }
    });
  });

  insertStmt.finalize();
});

// Close the database connection
db.close((err) => {
  if (err) {
    console.error("Error closing database:", err.message);
  } else {
    console.log("Database connection closed.");
  }
});
