let woordenlijst = new Set();

    async function laadWoordenlijst() {
      const res = await fetch('');
      const tekst = await res.text();
      woordenlijst = new Set(
        tekst.split('\n').map(w => w.trim().toLowerCase())
      );
    }

    async function checkWoord() {
      const input = document.getElementById('woordInput').value.toLowerCase();
      const resultaat = document.getElementById('resultaat');

      if (woordenlijst.size === 0) {
        await laadWoordenlijst(); // eerst laden als het nog niet is gedaan
      }

      if (woordenlijst.has(input)) {
        resultaat.textContent = `'${input}' is een geldig Nederlands woord.`;
      } else {
        resultaat.textContent = `'${input}' staat niet in de woordenlijst.`;
      }
    }