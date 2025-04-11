var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../database/botzilla.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Fout bij openen database", err.message);
    }
    else {
        console.log("Verbonden met botzilla.db")
    }
});

router.get('/', function(req, res) {
    db.all("SELECT * FROM ENGWoordenlijstAI", (err, rows) => {
        if (err) {
            console.error("Databasefout:", err.message);
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

router.get('/:ID', function(req, res) {
    const id = req.params.ID; // haal ID uit de URL

    db.get("SELECT * FROM ENGWoordenlijstAI WHERE ID = ?", [id], (err, row) => {
        if (err) {
            console.error("Databasefout:", err.message);
            res.status(500).json({ error: err.message });
        } else if (!row) {
            res.status(404).json({ error: "Woord niet gevonden" });
        } else {
            res.json(row);
        }
    });
});

module.exports = router;