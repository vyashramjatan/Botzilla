
async function checkwords(woord) {
    
  try {
      let response = await fetch('http://localhost:3000/api/ENGWoordenlijstAI');

      if (!response.ok) throw new Error("error loading data");
      const data = await response.json();

      const bestaat = data.some(item => item.Woord.toLowerCase() === woord.toLowerCase());

      if (bestaat) {
          return('true');
      }
      else {
          return('false');
      }
  } catch (error) {
      console.error("something went wrong", error.message);
  }
}

async function checkwords1(woord) {
  
  try {
      let response = await fetch('http://localhost:3000/api/woordenENG');

      if (!response.ok) throw new Error("error loading data");
      const data = await response.json();

      const bestaat = data.some(item => 
          [
              item.uk_us,
              item.words_aplha,
              item.words
          ].some(veld =>
              veld && veld.toLowerCase() === woord.toLowerCase()
          )
              
      );

      if (bestaat) {
          return('true');
      }
      else {
          return('false');
      }
  } catch (error) {
      console.error("something went wrong", error.message);
  }
}

async function GetAIWordlist(lengte) {
  try {
    let response = await fetch('http://localhost:3000/api/ENGWoordenlijstAI');
    let data = await response.json();

    const filtered = data.filter(w => w.Woord.length === lengte);

    const randomwoord = filtered[Math.floor(Math.random() * filtered.length)];
    return {ID: randomwoord.ID, Woord: randomwoord.Woord.toUpperCase()};
  }
  catch {
    console.error("error loading wordlist", error.message);
    return null;
  }
}

async function uitlegopvraag(ID) {
  try {
    let id = String(ID);
    let response = await fetch(`http://localhost:3000/api/ENGWoordenlijstAI/${id}`);
    let data = await response.json();
    
    let tekst = data.Uitleg;
    tekst = tekst.replace(/\?\?/g, "\n-");

    tekst = tekst.replace(/([.?!])\s*/g, "$1\n");

    tekst = tekst.replace(/^\?\s*$/gm, "*");
    return (tekst);
  }
  catch (error) {
    console.error("error loading uitleg", error.message);
    return null;
  }
}

async function hintopvraag(ID) {
  try {
    let id = String(ID);
    let response = await fetch(`http://localhost:3000/api/ENGWoordenlijstAI/${id}`);
    let data = await response.json();

    let tekst = data.Hint;
    
    return (tekst);
  }
  catch (error) {
    console.error("error loading hints", error.message);
    return null;
  }

}

async function toonHint(id) {
  document.getElementById("hint").textContent = await hintopvraag(id);
}

function formatUitlegTekst(tekst) {
  return tekst.replace(/([.?!])\s*/g, "$1\n");
}

async function toonUitleg(id) {
  document.getElementById("uitlegtekst").textContent = await uitlegopvraag(id);
}

let input = document.querySelector("#guess");
let knop = document.querySelector("#button");
let gok;

function veranderKlasse(element, oud, nieuw) {
    element.className = element.className.replace(oud, nieuw);
}
function haalAlleIndexen(array, waarde) {
    let indexen = [];
    for (let i = 0; i < array.length; i++) {
        if (array[i] === waarde) indexen.push(i);
    }
    return indexen;
}
function eindigSpel(bericht, extra) {
    document.querySelector("#msgBox").textContent = bericht;
    document.querySelector("#smallMsg").innerHTML = extra;
    veranderKlasse(knop, "invisible", "visible");
    input.readOnly = true;
}
function opnieuwSpelen() {
    document.querySelector("#msgBox").textContent = "Guess the word!";
    document.querySelector("#smallMsg").textContent = "Green  = correct letter, Yellow = wrong place";
    input.readOnly = false;
    veranderKlasse(knop, "visible", "invisible");

    for (let rij = 1; rij <= 5; rij++) {
        let vakjes = document.querySelector(`#row${rij}`).querySelectorAll("div");
        vakjes.forEach(vak => {
            vak.textContent = "";
            if (vak.classList.contains("correct")) veranderKlasse(vak, "correct", "default");
            if (vak.classList.contains("wrongplace")) veranderKlasse(vak, "wrongplace", "default");
        });
    }
    startSpel();
}

function randomsize() {

  const squares = Math.floor(Math.random() * 4) + 3;

  for (let i = 1; i <= 5; i++) {
    const row = document.getElementById(`row${i}`);

    row.innerHTML = "";

    for (let j = 0; j < squares; j++) {
      const square = document.createElement("div");
      square.classList.add("square", "default");
      row.appendChild(square);
    }
  }
  return (squares);
}

function showhintknop() {
  document.querySelector(".hintknop").classList.add("active");
}

function hidehintknop() {
  document.querySelector(".hintknop").classList.remove("active");
}

function showhint() {
  hidehintknop();
  document.querySelector(".hint").classList.add("active");
}

function hidehint() {
  document.querySelector(".hint").classList.remove("active");
}

function showuitleg() {
  document.querySelector(".uitleg").classList.add("active");
}

function hideuitleg() {
  document.querySelector(".uitleg").classList.remove("active");
}

function disableinput() {
  document.getElementById("guess").disabled = true;
}

function enableinput() {
  document.getElementById("guess").disabled = false;
}

function letter3plek() {
  document.getElementById("container").classList.add("active");
}

function letter3plekdis() {
  document.getElementById("container").classList.remove("active");
}

function letter4plek() {
  document.getElementById("container").classList.add("active1");
}

function letter4plekdis() {
  document.getElementById("container").classList.remove("active1");
}

function letter5plek() {
  document.getElementById("container").classList.add("active2");
}

function letter5plekdis() {
  document.getElementById("container").classList.remove("active2");
}

async function startSpel() {
  let squaresize = randomsize();
  document.getElementById("guess").maxLength = squaresize;
  let lijst = await GetAIWordlist(squaresize);
  let woord = lijst.Woord;
  console.log(woord);
  console.log(lijst.ID);
  let dubbeleLetters = (/([a-zA-Z]).*?\1/).test(woord);
  let beurt = 1;
  let huidigeRij = document.querySelector(`#row${beurt}`);
  let vakjes = huidigeRij.querySelectorAll("div");

  if (squaresize === 3) {
    letter3plek();
    letter4plekdis();
    letter5plekdis();
  } 
  if (squaresize === 4) {
    letter4plek();
    letter3plekdis();
    letter5plekdis();
  }
  if (squaresize === 5) {
    letter5plek();
    letter3plekdis();
    letter4plekdis();
  }
  if (squaresize === 6) {
    letter3plekdis();
    letter4plekdis();
    letter5plekdis();
  }

  hideuitleg();
  hidehint();
  showhintknop();
  enableinput();

  document.querySelector(`#row${beurt}`).firstElementChild.textContent = woord[0];

  toonUitleg(lijst.ID);
  toonHint(lijst.ID);

  input.onkeypress = async function (event) {
      if (event.key === "Enter") {
          disableinput();
          document.querySelector("#smallMsg").textContent = "Green  = correct letter, Yellow = wrong place";
          gok = input.value.toUpperCase();

          let juistAantal = 0;

          const checkPromise = (async () => {
            return (await checkwords1(gok) === "true" || await checkwords(gok) === "true");
          })();
          
          for (let i = 0; i < vakjes.length; i++) {
          await new Promise(resolve => {
            setTimeout(() => {
              vakjes[i].textContent = gok[i];
              resolve()
            }, 500);
          });
        }
        if (gok.length !== squaresize) {
          document.querySelector("#smallMsg").textContent = `Moet een ${squaresize}-letterwoord zijn!`;
          for (let i = 0; i < vakjes.length; i++){    
            veranderKlasse(vakjes[i], "default", "wrongword");
            }
        setTimeout (() => {
          input.value = "";
          vakjes.forEach(vakje => vakje.textContent = "");
          for (let i = 0; i < vakjes.length; i++){    
            veranderKlasse(vakjes[i], "wrongword", "default");
          document.querySelector(`#row${beurt}`).firstElementChild.textContent = woord[0];
        }
        }, 1000)
        enableinput();
        return;
      }

          const isGeldig = await checkPromise;

          if (!isGeldig){
            console.log("error");
            for (let i = 0; i < vakjes.length; i++){    
              veranderKlasse(vakjes[i], "default", "wrongword");
          }
          setTimeout (() => {
            input.value = "";
            vakjes.forEach(vakje => vakje.textContent = "");
            for (let i = 0; i < vakjes.length; i++){    
              veranderKlasse(vakjes[i], "wrongword", "default");
            document.querySelector(`#row${beurt}`).firstElementChild.textContent = woord[0];
          }
          }, 1000)
              enableinput();
              return;
          }
            
            for (let i = 0; i < vakjes.length; i++) {
              if (gok[i] === woord[i]) {
                veranderKlasse(vakjes[i], "default", "correct");
                  juistAantal++;
              }
          }
          if (gok.length !== squaresize) {
              document.querySelector("#smallMsg").textContent = `Moet een ${squaresize}-letterwoord zijn!`;
              for (let i = 0; i < vakjes.length; i++){    
                veranderKlasse(vakjes[i], "default", "wrongword");
                }
            setTimeout (() => {
              input.value = "";
              vakjes.forEach(vakje => vakje.textContent = "");
              for (let i = 0; i < vakjes.length; i++){    
                veranderKlasse(vakjes[i], "wrongword", "default");
              document.querySelector(`#row${beurt}`).firstElementChild.textContent = woord[0];
            }
            }, 1000)
          }
          if (juistAantal === squaresize) {
            showuitleg();
            hidehint();
            hidehintknop();
              eindigSpel("You guessed the word correctly!", "Another round?");
              input.value = "";
              enableinput();
              return;
          } else if (beurt === 5) {
            showuitleg();
            hidehint();
            hidehintknop();
            eindigSpel("You couldn't guess it :(", `The word was: <span class="rood">${woord}</span>`);
              input.value = "";
              enableinput();
              return;
          }
          for (let i = 0; i < vakjes.length; i++) {
              if (woord.includes(gok[i])) {
                  if (!dubbeleLetters && vakjes[woord.indexOf(gok[i])].className !== "square correct") {
                      veranderKlasse(vakjes[i], "default", "wrongplace");
                  } else if (dubbeleLetters) {
                      let indexen = haalAlleIndexen(woord, gok[i]);
                      for (let j = 0; j < indexen.length; j++) {
                          if (vakjes[indexen[j]].className !== "square correct" && vakjes[i].className !== "square wrongplace") {
                              veranderKlasse(vakjes[i], "default", "wrongplace");
                          }
                      }
                  }
              }
          }
          input.value = "";
          beurt++;
          huidigeRij = document.querySelector(`#row${beurt}`);
          vakjes = huidigeRij.querySelectorAll("div");
          huidigeRij.firstElementChild.textContent = woord[0];
          enableinput();
          
        }
      }
  };
startSpel();