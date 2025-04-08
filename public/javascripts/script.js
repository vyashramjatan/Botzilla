
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

    const woorden = data.map(item => item.Woord.toUpperCase());
    const filtered = woorden.filter(w => w.length === lengte);

    const randomwoord = Math.floor(Math.random() * filtered.length);
    return filtered[randomwoord];
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

/*var input = document.getElementById('guess'); // the input box
var button = document.getElementById('button'); // the button
var guess;

// verander css klasse
var changeClass = function(cng, old, newClass){
  cng.className = cng.className.replace(old, newClass);
}

// game loop
var gameloop = function(){
  // pick a random word
  var rand = quicklist[Math.floor(Math.random() * quicklist.length)].toUpperCase();
  var hasDuplicates = (/([a-zA-Z]).*?\1/).test(rand); // if multiple insances of a letter in the word
  
  var pressn = 1; // turn number
  
  // get all indexes of a given value in an array
  var getAllIndexes = function(arr, val) {
    var indexes = [], i;
    for(i = 0; i < arr.length; i++)
        if (arr[i] === val)
            indexes.push(i);
    return indexes;
  }
  
  // geef de eerste letter weer
  document.getElementById("row1").firstElementChild.innerHTML=rand[0];
  
  // spelen
  input.onkeypress = function(event) {
    if (event.key == "Enter" || event.keyCode == 13) {
      document.getElementById('smallMsg').innerHTML = "Green = correct letter, Yellow = wrong place"; // reset bericht
      guess = input.value.toUpperCase();
      
      var current = "row" + pressn;
      // huidige rij
      var childDivs = document.getElementById(current).getElementsByTagName('div');
      var c = 0; // correct count
      
      // Niet het juiste aantal letters
      if(guess.length !== 5){
        document.getElementById('smallMsg').innerHTML = "Must be a 5 letter word!";
        if(pressn===5){
          end("You couldn't crack it :(", "Correct word: " + rand);
        }
        pressn++;
        document.getElementById(current).firstElementChild.innerHTML=rand[0];
        return; // move down
      }

      // check for correctness
      for(var i=0; i<childDivs.length; i++) {
        childDivs[i].innerHTML = guess[i];
        
        // als letter op de juiste plaats staat
        if(guess[i] == rand[i]){
          changeClass(childDivs[i], 'default', 'correct');
          c++;
        } 
        // als letter bestaat maar op de verkeerde plaats staat
        
        input.value = ""; // input box legen
        
        if(c===5) { // als alles de juiste letter heeft
          end("You cracked it!!", "Another round?");
        } //if
        else if (pressn === 5){ // if they're out of tries
          end("You couldn't crack it", "Correct word: " + rand);
        } //else if
      } //for (check for correctness loop)
      
      // check voor juiste plaats letters
      for(var i=0; i<childDivs.length; i++) {
        if(rand.indexOf(guess[i])!=-1){
          if(hasDuplicates === false && childDivs[rand.indexOf(guess[i])].className != "square correct"){
            changeClass(childDivs[i], 'default', 'wrongplace');
          }
          // als er dubbele letters zijn
          else if(hasDuplicates === true){
            var ind = getAllIndexes(rand, guess[i]);
            if (ind.length > 1){
              for (var j=0; j<ind.length; j++){
                if(childDivs[ind[j]].className != "square correct" && childDivs[i].className != "square wrongplace"){
                  changeClass(childDivs[i], 'default', 'wrongplace');
                } //if
              } //for
            } //if
            else if (childDivs[rand.indexOf(guess[i])].className != "square correct"){
              changeClass(childDivs[i], 'default', 'wrongplace');
            } //else if
          } //else if(hasDuplicates === true)
        } //else if
      }

      pressn++; // inc number of guesses
    } //if (key = 'enter')
  } //input 
} //gameloop

// einde
var end = function(msg, smallmsg){
  document.getElementById('msgBox').innerHTML = msg;
  document.getElementById('smallMsg').innerHTML = smallmsg;
  changeClass(button, "invisible", "visible");
  document.getElementById('guess').readOnly = true;
}

// resetten
var playagain = function(){
  document.getElementById('msgBox').innerHTML="Guess the word!"; // main message
  document.getElementById('smallMsg').innerHTML = "Green = correct letter, Yellow = wrong place"; // small message
  document.getElementById('guess').readOnly = false;
  changeClass(button, "visible", "invisible");
  
  // letters leegmaken
  for(var i=1;i<6;i++){
    var resets = document.getElementById('row'+i).getElementsByTagName('div');
    for(var j=0;j<5;j++){
      resets[j].innerHTML="";
      if(resets[j].className == "square correct" || resets[j].className == "square wrongplace"){
        changeClass(resets[j], "correct", "default");
        changeClass(resets[j], "wrongplace", "default");
      } //if
    } //for
  } //for
  // loop opnieuw beginnen
  gameloop();
};

*/

/* WOORDRAAD GAME */

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

// Hoofdfunctie: spel starten
async function startSpel() {
    let woord = await GetAIWordlist(5);
    console.log(woord);
    let dubbeleLetters = (/([a-zA-Z]).*?\1/).test(woord);
    let beurt = 1;
    let huidigeRij = document.querySelector(`#row${beurt}`);

    document.querySelector("#row1").firstElementChild.textContent = woord[0];

    input.onkeypress = async function (event) {
        if (event.key === "Enter") {
            document.querySelector("#smallMsg").textContent = "Groen = juiste letter, Geel = verkeerde plek";
            gok = input.value.toUpperCase();
            if (await checkwords1(gok) === "true" || await checkwords(gok) === "true"){
            let vakjes = huidigeRij.querySelectorAll("div");
            let juistAantal = 0;

            // check op lengte
            if (gok.length !== 5) {
                document.querySelector("#smallMsg").textContent = "Moet een 5-letterwoord zijn!";
                if (beurt === 5) eindigSpel("Je hebt het niet geraden :(", `Het woord was: ${woord}`);
                beurt++;
                huidigeRij.firstElementChild.textContent = woord[0];
                return;
            }

            // invullen + juiste positie check
            for (let i = 0; i < vakjes.length; i++) {
                vakjes[i].textContent = gok[i];
                if (gok[i] === woord[i]) {
                    veranderKlasse(vakjes[i], "default", "correct");
                    juistAantal++;
                }
            }

            // gewonnen?
            if (juistAantal === 5) {
                eindigSpel("Je hebt het woord geraden!", "Nog een ronde?");
                return;
            } else if (beurt === 5) {
                eindigSpel("Je hebt het niet geraden", `Het woord was: ${woord}`);
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
          }
            else {
              input.value = "";
              console.log("error");
              return;
              //huidigeRij.querySelector(`#row${beurt}`).classList.add(verkeerdwoord);
            }

            input.value = "";
            beurt++;
        }
    };
}
/* ~500 willekeurige 5-letter woorden
var quicklist = [
'about',
'Acryl',
'Affix',
'Aftyp',
'Ampex',
'Accus',
'Axels',
'Acces',
'Addax',
'Afbik',
'Afduw',
'Afhap',
'Afpik',
'Afwis',
'Afzag',
'Afzak',
'Afzeg',
'above',
'abuse',
'actor',
'acute',
'admit',
'adopt',
'adult',
'after',
'again',
'agent',
'agree',
'ahead',
'alarm',
'album',
'alert',
'alike',
'alive',
'allow',
'alone',
'along',
'alter',
'among',
'anger',
'Angle',
'angry',
'apart',
'apple',
'apply',
'arena',
'argue',
'arise',
'array',
'aside',
'asset',
'audio',
'audit',
'avoid',
'award',
'aware',
'badly',
'baker',
'bases',
'basic',
'basis',
'beach',
'began',
'begin',
'begun',
'being',
'below',
'bench',
'billy',
'birth',
'black',
'blame',
'blind',
'block',
'blood',
'board',
'boost',
'booth',
'bound',
'brain',
'brand',
'bread',
'break',
'breed',
'brief',
'bring',
'broad',
'broke',
'brown',
'build',
'built',
'buyer',
'cable',
'calif',
'carry',
'catch',
'cause',
'chain',
'chair',
'chart',
'chase',
'cheap',
'check',
'chest',
'chief',
'child',
'chose',
'civil',
'claim',
'class',
'clean',
'clear',
'click',
'clock',
'close',
'coach',
'coast',
'could',
'count',
'court',
'cover',
'craft',
'crash',
'cream',
'crime',
'cross',
'crowd',
'crown',
'curve',
'cycle',
'daily',
'dance',
'dated',
'dealt',
'death',
'debut',
'delay',
'depth',
'doing',
'doubt',
'dozen',
'draft',
'drama',
'drawn',
'dream',
'dress',
'drill',
'drink',
'drive',
'drove',
'dying',
'eager',
'early',
'earth',
'eight',
'elite',
'empty',
'enemy',
'enjoy',
'enter',
'entry',
'equal',
'error',
'event',
'every',
'exact',
'exist',
'extra',
'faith',
'false',
'fault',
'fiber',
'field',
'fifth',
'fifty',
'fight',
'final',
'first',
'fixed',
'flash',
'fleet',
'floor',
'fluid',
'focus',
'force',
'forth',
'forty',
'forum',
'found',
'frame',
'frank',
'fraud',
'fresh',
'front',
'fruit',
'fully',
'funny',
'giant',
'given',
'glass',
'globe',
'going',
'grace',
'grade',
'grand',
'grant',
'grass',
'great',
'green',
'gross',
'group',
'grown',
'guard',
'guess',
'guest',
'guide',
'happy',
'harry',
'heart',
'heavy',
'hence',
'henry',
'horse',
'hotel',
'house',
'human',
'ideal',
'image',
'index',
'inner',
'input',
'issue',
'joint',
'jewel',
'judge',
'known',
'label',
'large',
'laser',
'later',
'laugh',
'layer',
'learn',
'lease',
'least',
'leave',
'legal',
'level',
'light',
'limit',
'links',
'lives',
'local',
'logic',
'loose',
'lower',
'lucky',
'lunch',
'lying',
'magic',
'major',
'maker',
'march',
'maria',
'match',
'maybe',
'mayor',
'meant',
'media',
'metal',
'might',
'minor',
'minus',
'mixed',
'model',
'money',
'month',
'moral',
'motor',
'mount',
'mouse',
'mouth',
'movie',
'music',
'needs',
'never',
'night',
'noise',
'north',
'noted',
'novel',
'nurse',
'occur',
'ocean',
'offer',
'often',
'order',
'other',
'ought',
'paint',
'panel',
'paper',
'party',
'peace',
'peter',
'phase',
'phone',
'photo',
'piece',
'pilot',
'pitch',
'place',
'plain',
'plane',
'plant',
'plate',
'point',
'pound',
'power',
'press',
'price',
'pride',
'prime',
'print',
'prior',
'prize',
'proof',
'proud',
'prove',
'queen',
'quick',
'quest',
'quiet',
'quite',
'radio',
'raise',
'range',
'rapid',
'ratio',
'reach',
'ready',
'refer',
'right',
'rival',
'river',
'robin',
'rough',
'round',
'route',
'royal',
'rural',
'scale',
'scene',
'scope',
'score',
'sense',
'serve',
'seven',
'shall',
'shape',
'share',
'sharp',
'sheet',
'shelf',
'shell',
'shift',
'shirt',
'shock',
'shoot',
'short',
'shown',
'sight',
'since',
'sixth',
'sixty',
'sized',
'skill',
'sleep',
'slide',
'small',
'smart',
'smile',
'smith',
'smoke',
'solid',
'solve',
'sorry',
'sound',
'south',
'space',
'spare',
'speak',
'speed',
'spend',
'spent',
'split',
'spoke',
'sport',
'staff',
'stage',
'stake',
'stand',
'start',
'state',
'steam',
'steel',
'stick',
'still',
'stock',
'stone',
'stood',
'store',
'storm',
'story',
'strip',
'stuck',
'study',
'stuff',
'style',
'sugar',
'suite',
'super',
'sweet',
'table',
'taken',
'tarts',
'taste',
'taxes',
'teach',
'teeth',
'terry',
'texas',
'thank',
'theft',
'their',
'theme',
'there',
'these',
'thick',
'thing',
'think',
'third',
'those',
'three',
'threw',
'throw',
'tight',
'tipsy',
'times',
'tired',
'title',
'today',
'topic',
'total',
'touch',
'tough',
'tower',
'tools',
'topaz',
'track',
'trade',
'train',
'treat',
'trend',
'trial',
'tried',
'tries',
'truck',
'truly',
'trust',
'truth',
'twice',
'twist',
'under',
'undue',
'union',
'unity',
'until',
'upper',
'upset',
'urban',
'usage',
'usual',
'valid',
'value',
'video',
'virus',
'visit',
'vital',
'voice',
'waste',
'watch',
'water',
'wheel',
'where',
'which',
'while',
'white',
'whole',
'whose',
'woman',
'women',
'world',
'worry',
'worse',
'worst',
'worth',
'would',
'wound',
'write',
'wrong',
'wrote',
'yield',
'young',
'youth'];

// start loop
//gameloop();*/
startSpel();
