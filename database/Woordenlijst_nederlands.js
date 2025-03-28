const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

// Stap 1: Database openen of aanmaken
const db = new sqlite3.Database('botzilla.db');

// Stap 2: Woordenlijst inlezen
const tekst = fs.readFileSync('../opentaal-wordlist-master/elements/basiswoorden-gekeurd.txt', 'utf-8');
const tekst1 = fs.readFileSync('../opentaal-wordlist-master/elements/basiswoorden-ongekeurd.txt', 'utf-8');
const tekst2 = fs.readFileSync('../opentaal-wordlist-master/elements/flexies-ongekeurd.txt', 'utf-8');
const tekst3 = fs.readFileSync('../opentaal-wordlist-master/elements/romeinse-cijfers.txt', 'utf-8');
const tekst4 = fs.readFileSync('../opentaal-wordlist-master/elements/wordlist-ascii.txt', 'utf-8');
const tekst5 = fs.readFileSync('../opentaal-wordlist-master/elements/wordlist-non-ascii.txt', 'utf-8');

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

  const woorden3 = tekst3
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
  .filter(w => w.length > 0);

// Stap 3: Alles uitvoeren binnen een snelle transactie
db.serialize(() => {
  db.run('DROP TABLE IF EXISTS woordenNL');
  db.run('CREATE TABLE IF NOT EXISTS woordenNL (id INTEGER PRIMARY KEY AUTOINCREMENT, basiswoorden_gekeurd TEXT, basiswoorden_ongekeurd TEXT, flexies_ongekeurd TEXT, romeinse_cijfers TEXT, ascii TEXT, non_ascii TEXT)');

  // 🟢 Start transactie
  db.run('BEGIN TRANSACTION');

  const stmt = db.prepare('INSERT INTO woordenNL (basiswoorden_gekeurd, basiswoorden_ongekeurd, flexies_ongekeurd, romeinse_cijfers, ascii, non_ascii) VALUES (?, ?, ?, ?, ?, ?)');

  const aantal = Math.max(woorden.length, woorden1.length, woorden2.length, woorden3.length, woorden4.length, woorden5.length);

  for (let i = 0; i < aantal; i++) {
    const gekeurd = woorden[i] || null;
    const ongekeurd = woorden1[i] || null;
    const flexies = woorden2[i] || null;
    const romeinCijf = woorden3[i] || null;
    const ascii = woorden4[i] || null;
    const nonAscii = woorden5[i] || null;
    stmt.run(gekeurd, ongekeurd, flexies, romeinCijf, ascii, nonAscii);
}


  stmt.finalize(err => {
    if (err) {
      console.error('❌ Fout bij finalize:', err);
      return;
    }

    // 🟢 Sluit transactie af
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

