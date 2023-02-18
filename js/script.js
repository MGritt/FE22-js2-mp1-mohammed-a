import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore, collection, doc, addDoc, query, getDocs, limit, orderBy } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBqAKRV_BGR_9JRFh8eYeIbKJWI_G4ptt0",
  authDomain: "okay-f2fd0.firebaseapp.com",
  projectId: "okay-f2fd0",
  storageBucket: "okay-f2fd0.appspot.com",
  messagingSenderId: "14287196509",
  appId: "1:14287196509:web:1740950b72f4c60d6298b4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const wrapper = document.querySelector('#wrapper');
const userReg = document.querySelector('#userReg');
const play = document.querySelector('#play');
const name = document.querySelector('#name');
const hiscore = document.querySelector('#hiscore');
const status = document.querySelector('#status');
let streakEl = document.querySelector('#streak');

play.addEventListener('click', startGame);

function DOM(elData){
  for(let i=0; i<elData.length; i++){
    let el = null;
    let create = elData[i].create;
    let update = elData[i].update;
    let deleteAll = elData[i].deleteAll;
    let insertBefore = elData[i].insertBefore;
    if(create){
      el = document.createElement(elData[i].el);
    } else if (update){
      el = document.querySelector(elData[i].el);
    } else if (deleteAll){
      el = document.querySelectorAll(elData[i].el);
      el.forEach(xEl => {
        xEl.remove();
      });
    }
    if(elData[i].reselect){
      let reselect = `${(elData[i].let) ? 'let ' : ''}${elData[i].to} = document.querySelector('${elData[i].reselect}');`
      eval(reselect);
    }
    if(elData[i].text){
      el.innerText = elData[i].text;
    }
    if(elData[i].innerHTML){
      el.innerHTML = elData[i].innerHTML;
    }
    if(elData[i].id){
      el.id = elData[i].id;
    }
    if(elData[i].class){
      el.className = elData[i].class;
    }
    if(elData[i].value){
      el.value = elData[i].value;
    }
    if(create){
      if(insertBefore){
        let toEl = `${elData[i].to}.insertBefore(el, ${elData[i].to}.firstChild);`
        eval(toEl);
      }else {
        let toEl = `${elData[i].to}.append(el);`
        eval(toEl);
      }
    }
    if(elData[i].style){
      for(let x=0; x<elData[i].style.length; x++){
        let styleEl = `el.style.${elData[i].style[x].style} = '${elData[i].style[x].property}';`
        eval(styleEl);
      }
    }
    if(elData[i].eventListener){
        let eventListenerEl = `el.addEventListener('${elData[i].eventListener.type}', ${elData[i].eventListener.function});`;
        eval(eventListenerEl);
    }
  }
}

function startGame(event){
    event.preventDefault();
    userReg.remove();
    let elData = [{
        'create': true,
        'el':'div',
        'id': 'game',
        'to': 'wrapper',
        'insertBefore': true
      },
      {
        'create': true,
        'el':'h1',
        'id': 'welcome',
        'text': `Väkommen ${name.value}! Starta spelet genom att välja antingen sten, sax eller påse!`,
        'to': 'game',
        'reselect': '#game',
        'let': true
      },
      {
        'create': true,
        'el':'h1',
        'id':'user',
        'text': `User: `,
        'to': 'game',
        'reselect': '#game',
        'let': true
      },
      {
        'create': true,
        'el': 'p',
        'id': 'user',
        'style': [{
          'style': 'display',
          'property': 'inline'
        }],
        'text': `${name.value}`,
        'to': 'user'
      },
      {
        'create': true,
        'el':'h1',
        'id':'streak',
        'text':'Streak: ',
        'to': 'game',
        'reselect': '#game',
        'let': true
      },
      {
        'create': true,
        'el':'span',
        'id':'userStreak',
        'text':'0',
        'to': 'streakEl',
        'reselect': '#streak'
      }];
      const ssp = ['sten', 'sax', 'påse'];
      for(let i=0; i<ssp.length; i++){
        elData.push({
          'create': true,
          'el':'button',
          'id': ssp[i],
          'text': ssp[i],
          'to': 'game',
          'reselect': '#game',
          'let': true,
          'eventListener': {
            'type': 'click',
            'function': `function(){ SSP('${ssp[i]}'); }`
          }
        });
      }
      DOM(elData);
}

let userPoints = 0;
let cpuPoints = 0;

async function SSP(ssp){
    const cpuSSP = ['sten', 'sax', 'påse'];
    const random = Math.floor(Math.random() * cpuSSP.length);
    const cpuChoice = cpuSSP[random];
    const spanUPoints = document.querySelector('#userStreak');
    const spanCPoints = document.querySelector('#cpuPoints');
    const rank5 = document.querySelector('.rank5').value;

    console.log("CPU chose: "+cpuChoice);
    console.log("User chose: "+ssp);

    if (ssp == cpuChoice) {
      let elData = [{
        'create': true,
        'el':'h1',
        'class': 'gameStatus',
        'text': `${name.value} har valt ${ssp} och CPU har valt ${cpuChoice} det blir lika!`,
        'to': 'game',
        'reselect': '#game',
        'let': true
      }];
      DOM(elData);
    } else if (ssp == "sten" && cpuChoice == "sax" || ssp == "sax" && cpuChoice == "påse" || ssp == "påse" && cpuChoice == "sten") {
      userPoints++;
      spanUPoints.innerText = userPoints;
      let elData = [{
        'create': true,
          'el':'h1',
          'class': 'gameStatus',
          'text': `${name.value} har valt ${ssp} och CPU har valt ${cpuChoice} vinnaren blir ${name.value}!`,
          'to': 'game',
          'reselect': '#game',
          'let': true
        }];
        DOM(elData);
    } else {
      console.log("user lose");
      if(userPoints > 0){
        if(userPoints > rank5){
          await addDoc(collection(db, "hiscore"), {
            name: name.value,
            score: userPoints
          });
          getHS();
        }
      }
      let elData = [{
        'create': true,
          'el':'h1',
          'class': 'gameStatus',
          'text': `${name.value} har valt ${ssp} och CPU har valt ${cpuChoice} vinnaren blir CPU!`,
          'to': 'game',
          'reselect': '#game',
          'let': true
        }];
        DOM(elData);
        reset(ssp, cpuChoice, userPoints);
    }
}

function reset(userInput, cpuInput, streak){
  const rank5 = document.querySelector('.rank5').value;
  let elData = [{
      'update': true,
      'el': '#welcome',
      'text': `Du ${(streak == 0) ? 'förlora direkt!' : ''} ${(streak > 0) ? `vann ${streak} i rad
      ${(streak > rank5) ? 'och hamna i topplistan!' : `men det räckte inte för att hamna i topplistan där lägsta poäng är ${rank5}`}
      ` : ''} Starta nytt spel genom att antingen välja sten, sax eller påse!`
    },
    {
      'update': true,
      'el': '#userStreak',
      'text': `0`,
    },
    {
      'deleteAll': true,
      'el': '.gameStatus'
      }];
  DOM(elData);
  userPoints = 0;
}

async function getHS(){
  hiscore.innerHTML = "";
  let hiscoreData = await getDocs(query(collection(db, "hiscore"), orderBy("score", "desc"), limit(5)));
  let hsElData = [];
  let i = 0;
  hiscoreData.forEach((doc) => {
    i++;
    let dataArr = doc.data();
    hsElData.push({
      'create': true,
      'el':'p',
      'class': `rank${i}`,
      'text': `${dataArr.name} - ${dataArr.score} poäng`,
      'value': dataArr.score,
      'to': 'hiscore',
      'score': dataArr.score
    });
  });
  DOM(hsElData);
}

getHS();
