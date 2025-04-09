document.addEventListener('DOMContentLoaded', () => {
  const wordList = ["APPLE", "BRAVE", "CHESS", "STORM", "CLOUD", "PLANE", "WATCH", "SMILE", "PAUSE", "TRAIN"];
  const maxGuesses = 5;
  const wordLength = 5;

  let currentRow = 0;
  let currentCol = 0;
  let guesses = Array.from({ length: maxGuesses }, () => Array(wordLength).fill(''));
  let correctLetters = Array.from({ length: maxGuesses }, () => Array(wordLength).fill(null)); // Bewaar de juiste letters

  const container = document.getElementById('container');

  // 📦 Genereer 5x5 grid (25 cellen)
  for (let row = 0; row < maxGuesses; row++) {
    for (let col = 0; col < wordLength; col++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      container.appendChild(cell);
    }
  }

  const cells = container.querySelectorAll('.cell');
  const getCell = (row, col) => cells[row * wordLength + col];

  function updateBoard() {
    for (let row = 0; row < maxGuesses; row++) {
      for (let col = 0; col < wordLength; col++) {
        const cell = getCell(row, col);
        cell.textContent = guesses[row][col];
        cell.classList.remove('correct', 'wrongplace', 'incorrect');
      }
    }

    // Voeg de kleuren toe na elke poging
    for (let row = 0; row < currentRow; row++) {
      const guess = guesses[row].join('');
      const targetArr = targetWord.split('');
      const guessArr = guess.split('');
      const usedIndices = [];

      guessArr.forEach((letter, i) => {
        const cell = getCell(row, i);
        if (letter === targetArr[i]) {
          cell.classList.add('correct');
          usedIndices.push(i);
          correctLetters[row][i] = letter; // Bewaar correcte letter
        }
      });

      guessArr.forEach((letter, i) => {
        const cell = getCell(row, i);
        if (!cell.classList.contains('correct')) {
          const index = targetArr.findIndex((l, j) => l === letter && !usedIndices.includes(j));
          if (index !== -1) {
            cell.classList.add('wrongplace');
            usedIndices.push(index);
          } else {
            cell.classList.add('incorrect');
          }
        }
      });
    }
  }

  function checkWord() {
    const guess = guesses[currentRow].join('').toUpperCase();
    if (guess.length < wordLength) return;

    const targetArr = targetWord.split('');
    const guessArr = guess.split('');
    const usedIndices = [];

    // Eerste pass – juiste letter op juiste plek (groen)
    guessArr.forEach((letter, i) => {
      const cell = getCell(currentRow, i);
      if (letter === targetArr[i]) {
        cell.classList.add('correct');
        usedIndices.push(i);
        correctLetters[currentRow][i] = letter; // Bewaar correcte letter
      }
    });

    // Tweede pass – juiste letter verkeerde plek (geel) of niet aanwezig (blauw)
    guessArr.forEach((letter, i) => {
      const cell = getCell(currentRow, i);
      if (!cell.classList.contains('correct')) {
        const index = targetArr.findIndex((l, j) => l === letter && !usedIndices.includes(j));
        if (index !== -1) {
          cell.classList.add('wrongplace');
          usedIndices.push(index);
        } else {
          cell.classList.add('incorrect');
        }
      }
    });

    // Check op winst
    if (guess === targetWord) {
      document.getElementById('msgBox').textContent = "🎉 Goed gedaan!";
      document.getElementById('button').classList.remove('invisible');
      return;
    }

    // Volgende rij
    currentRow++;
    currentCol = 0;

    // Correcte letters automatisch invullen in de volgende rij
    if (currentRow < maxGuesses) {
      for (let i = 0; i < wordLength; i++) {
        if (correctLetters[currentRow - 1][i]) {
          guesses[currentRow][i] = correctLetters[currentRow - 1][i]; // Zet de correcte letters in de nieuwe rij
        }
      }
    }

    // Controleer of we de 5 pogingen hebben bereikt
    if (currentRow >= maxGuesses) {
      // Toon het modale venster met het juiste woord
      const modalMessage = `😢 Het woord was: ${targetWord}`; // Hier kun je het bericht aanpassen zonder dat je de taal hoeft te veranderen
      showModal(modalMessage); // Roep de functie aan om de pop-up weer te geven
      document.getElementById('button').classList.remove('invisible');
    }

    updateBoard();
  }

  // Kies een willekeurig woord uit de lijst
  let targetWord = wordList[Math.floor(Math.random() * wordList.length)];

  document.addEventListener('keydown', (e) => {
    if (currentRow >= maxGuesses) return;

    const key = e.key.toUpperCase();

    if (key === 'BACKSPACE' || key === 'DELETE') {
      if (currentCol > 0) {
        currentCol--;
        guesses[currentRow][currentCol] = '';
        updateBoard();
      }
    } else if (key === 'ENTER') {
      if (currentCol === wordLength) {
        checkWord();
      }
    } else if (/^[A-Z]$/.test(key)) {
      if (currentCol < wordLength) {
        guesses[currentRow][currentCol] = key;
        currentCol++;
        updateBoard();
      }
    }
  });

  // Bij het starten van een nieuw spel
  window.playagain = function () {
    currentRow = 0; // Reset de huidige rij
    currentCol = 0; // Reset de huidige kolom
    guesses = Array.from({ length: maxGuesses }, () => Array(wordLength).fill('')); // Reset de guesses
    correctLetters = Array.from({ length: maxGuesses }, () => Array(wordLength).fill(null)); // Reset correcte letters
    targetWord = wordList[Math.floor(Math.random() * wordList.length)]; // Kies een nieuw doelwoord
    document.getElementById('msgBox').innerHTML = "<img class='logoimg' src='/images/aingo_logo.png' alt='logo'>";
    updateBoard();
  };

  // Functie om het modale venster te tonen
  function showModal(message) {
    document.getElementById('modal').style.display = 'block'; 
    document.getElementById('modal-message').textContent = message;
  }

  updateBoard(); // Initialiseer bord
});
