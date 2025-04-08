
async function checkwords(woord) {
    
  try {
      let response = await fetch('http://localhost:3000/api/ENGWoordenlijstAI');

      if (!response.ok) throw new Error("Fout bij ophalen van gegevens");
      const data = await response.json();

      const bestaat = data.some(item => item.Woord.toLowerCase() === woord.toLowerCase());

      if (bestaat) {
          return('true');
      }
      else {
          return('false');
      }
  } catch (error) {
      console.error("Er ging iets mis", error.message);
  }
}

/*async function test() {  
  console.log(await checkwords('apple'));
  console.log(await checkwords('XAI'));
}

test();*/

async function checkwords1(woord) {
  
  try {
      let response = await fetch('http://localhost:3000/api/woordenENG');

      if (!response.ok) throw new Error("Fout bij ophalen van gegevens");
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
      console.error("Er ging iets mis", error.message);
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
    console.error("fout bij het ophalen van de woordenlijst", error.message);
    return null;
  }
}

/*async function test() {
  const woord = await GetAIWordlist();
  console.log("Gekozen woord:", woord);
}

test();*/

/*async function test1() {  
  console.log(await checkwords1('epple'));
  console.log(await checkwords1('telefoon'));
}

test1();*/

// DOM-elementen
let input = document.querySelector("#guess");
let knop = document.querySelector("#button");
let gok;

// CSS klasse wijzigen
function veranderKlasse(element, oud, nieuw) {
    element.className = element.className.replace(oud, nieuw);
}

// Alle indexen van een waarde in een array
function haalAlleIndexen(array, waarde) {
    let indexen = [];
    for (let i = 0; i < array.length; i++) {
        if (array[i] === waarde) indexen.push(i);
    }
    return indexen;
}

// Einde spel
function eindigSpel(bericht, extra) {
    document.querySelector("#msgBox").textContent = bericht;
    document.querySelector("#smallMsg").textContent = extra;
    veranderKlasse(knop, "invisible", "visible");
    input.readOnly = true;
}

// Reset spel
function opnieuwSpelen() {
    document.querySelector("#msgBox").textContent = "Raad het woord!";
    document.querySelector("#smallMsg").textContent = "Groen = juiste letter, Geel = verkeerde plek";
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

// Hoofdfunctie: spel starten
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

    document.querySelector(`#row${beurt}`).firstElementChild.textContent = woord[0];

    input.onkeypress = async function (event) {
        if (event.key === "Enter") {
            document.querySelector("#smallMsg").textContent = "Groen = juiste letter, Geel = verkeerde plek";
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
                return;
            }
              
              for (let i = 0; i < vakjes.length; i++) {
                if (gok[i] === woord[i]) {
                  veranderKlasse(vakjes[i], "default", "correct");
                    juistAantal++;
                }
            }
            // check op lengte
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
                if (beurt === 5) {
                eindigSpel("Je hebt het niet geraden :(", `Het woord was: ${woord}`);
                beurt++;
                huidigeRij = document.querySelector(`#row${beurt}`);
                vakjes = huidigeRij.querySelectorAll("div");
                huidigeRij.firstElementChild.textContent = woord[0];
                return;
                }
            // gewonnen?
            if (juistAantal === squaresize) {
                eindigSpel("Je hebt het woord geraden!", "Nog een ronde?");
                input.value = "";
                return;
            } else if (beurt === 5) {
                eindigSpel("Je hebt het niet geraden", `Het woord was: ${woord}`);
                input.value = "";
                return;
            }

            // verkeerde plek check
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
            
          }
        }
    };
startSpel();
