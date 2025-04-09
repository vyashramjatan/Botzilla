//Install Node.js
//Navigeer naar de map waar dit bestand in zit in cmd
//Run node Woordenlijst_import.js

const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('botzilla.db');

const tekst = fs.readFileSync('../English-Wordlist/words_alpha.txt', 'utf-8');
const tekst1 = fs.readFileSync('../English-Wordlist/uk-us-dict.txt', 'utf-8');
const tekst2 = fs.readFileSync('../English-Wordlist/words.txt', 'utf-8');
/*const tekst3 = fs.readFileSync('../opentaal-wordlist-master/elements/romeinse-cijfers.txt', 'utf-8');
const tekst4 = fs.readFileSync('../opentaal-wordlist-master/elements/wordlist-ascii.txt', 'utf-8');
const tekst5 = fs.readFileSync('../opentaal-wordlist-master/elements/wordlist-non-ascii.txt', 'utf-8');*/

const woorden = tekst
  .split('\n')
  .flatMap(r => r.split('\t'))
  .map(w =>
    w
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '')
  )
  .filter(w => w.length > 0);

  const woorden1 = tekst1
  .split('\n')
  .flatMap(r => r.split('\t'))
  .map(w =>
    w
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '')
  )
  .filter(w => w.length > 0);

  const woorden2 = tekst2
  .split('\n')
  .flatMap(r => r.split('\t'))
  .map(w =>
    w
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '')
  )
  .filter(w => w.length > 0);

  /*const woorden3 = tekst3
  .split('\n')
  .flatMap(r => r.split('\t'))
  .map(w =>
    w
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '')
  )
  .filter(w => w.length > 0);

  const woorden4 = tekst4
  .split('\n')
  .flatMap(r => r.split('\t'))
  .map(w =>
    w
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '')
  )
  .filter(w => w.length > 0);
  
  const woorden5 = tekst5
  .split('\n')
  .flatMap(r => r.split('\t'))
  .map(w =>
    w
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '')
  )
  .filter(w => w.length > 0); */

db.serialize(() => {
  db.run('DROP TABLE IF EXISTS woordenENG');
  db.run('CREATE TABLE IF NOT EXISTS woordenENG (id INTEGER PRIMARY KEY AUTOINCREMENT, uk_us TEXT, words_alpha TEXT, words TEXT)');

  db.run('BEGIN TRANSACTION');

  const stmt = db.prepare('INSERT INTO woordenENG (uk_us, words_alpha, words) VALUES (?, ?, ?)');

  const aantal = Math.max(woorden.length, woorden1.length, woorden2.length/*, woorden3.length, woorden4.length, woorden5.length*/);

  for (let i = 0; i < aantal; i++) {
    const ukus = woorden[i] || null;
    const wordsalpha = woorden1[i] || null;
    const words = woorden2[i] || null;
    /*const romeinCijf = woorden3[i] || null;
    const ascii = woorden4[i] || null;
    const nonAscii = woorden5[i] || null;*/
    stmt.run(ukus, wordsalpha, words/*, romeinCijf, ascii, nonAscii*/);
}


  stmt.finalize(err => {
    if (err) {
      console.error('❌ Fout bij finalize:', err);
      return;
    }

    db.run('COMMIT', err => {
      if (err) {
        console.error('❌ Fout bij commit:', err);
        return;
      }

      db.close(err => {
        if (err) {
          console.error('❌ Fout bij sluiten van database:', err);
        } else {
          console.log('📦 Database netjes afgesloten');
        }
      });
    });
  });
});

