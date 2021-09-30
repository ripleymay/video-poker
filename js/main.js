/*----- constants -----*/
// CARD CONSTANTS - taken from class repo
const suits = ['s', 'c', 'd', 'h'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];
const valueLookup = { 'A': 1, 'J': 11, 'Q': 12, 'K': 13 };
const masterDeck = buildMasterDeck();

const START_CREDS = 50;
const MAX_BET = 5;

const winLookup = [
  {name: 'Royal Flush', multiplier: 250 },
  {name: 'Straight Flush', multiplier: 50 },
  {name: 'Four of a Kind', multiplier: 25, sequence: '14444'},
  {name: 'Full House', multiplier: 9, sequence: '22333'},
  {name: 'Flush', multiplier: 6},
  {name: 'Straight', multiplier: 4},
  {name: 'Three of a Kind', multiplier: 3, sequence: '11333'},
  {name: 'Two Pair', multiplier: 2, sequence: '12222'},
  {name: 'Jacks or Better', multiplier: 1, sequence: '11122'}
]


/*----- app's state (variables) -----*/
let deck, hand, win, credits, bet, round, sound, msg;


/*----- cached element references -----*/
const winElems = [...document.getElementById('win-names').getElementsByTagName('li')];
const scoreElems = [...document.querySelectorAll('#pay-table > ol.values')];
const handElem = document.getElementById('hand');
const betBtns = document.querySelectorAll('button.bet');
const dealBtn = document.getElementById('deal-draw');
const bgSound = document.getElementById('bg');
const soundBtn = document.getElementById('sound');


/*----- event listeners -----*/
betBtns.forEach(button =>
  button.addEventListener("click", handleBet)
);
dealBtn.addEventListener('click', handleDeal);
handElem.addEventListener('click', handleHold);
soundBtn.addEventListener('click', toggleSound);
document.getElementById('restart').addEventListener('click', init);


/*----- functions -----*/
init();

function init() {
  initHand();
  credits = START_CREDS;
  bet = 0;
  win = 0;
  round = 0;
  sound = false;
  msg = 'Welcome!';
  render();
}

function initHand() {
  hand = [{ face: 'back'}, { face: 'back'}, { face: 'back'}, { face: 'back'}, { face: 'back'}];
}


function render() {
  renderWinTable();
  renderHand();
  document.getElementById('message').innerHTML = `${msg}`;
  document.getElementById('bet').innerHTML = `Bet ${bet}`;
  document.getElementById('credits').innerHTML = `${credits} credits`;
  dealBtn.disabled = (!round) ? true : false;
  dealBtn.textContent = (round === 2) ? 'Draw' : 'Deal';
  betBtns.forEach(button =>
    button.disabled = (round === 2 || !credits) ? true : false
  );
  renderSound();
}

function renderWinTable() {
  winElems.forEach(function (name, index) {
    name.style.color = (index === win - 1) ? 'red' : 'black';
  });
  scoreElems.forEach(function(col, colIdx) {
    col.style.backgroundColor = (colIdx === bet - 1) ? 'rgba(255, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.25)';
  });
}

function renderHand() {
  let cardsHtml = '';
  hand.forEach(function (card, index) {
    let hold = (card.held) ? ' held' : '';
    let stale = (!round) ? ' stale' : '';
    cardsHtml += `<div id=${index} class="card ${card.face}${hold}${stale}"></div>`;
  })
  handElem.innerHTML = cardsHtml;
}

function renderSound() {
  if (sound) {
    bgSound.play();
    soundBtn.innerHTML = '<i class="glyphicon glyphicon-pause"></i>';
  } else {
    bgSound.pause();
    soundBtn.innerHTML = '<i class="glyphicon glyphicon-music"></i>';
  }
}


function toggleSound() {
  sound = !sound;
  render();
}

function handleBet(evt) {
  if (!round) round++;
  win = 0;
  msg = 'Ready to deal?'
  initHand();

  if (evt.target.id === 'one') {
      betOne();
  } else if (evt.target.id === 'max') {
    if (credits + bet - MAX_BET < 0) {
      msg = 'You don\'t have enough credits.'
    } else {
      betMax();
    }
  }
  render();
}

function betOne() {
  if (bet >= MAX_BET) {
    bet = 1;
    credits = credits + MAX_BET - bet;
  } else {
    bet++;
    credits--;
  }
}

function betMax() {
  credits = credits + bet - MAX_BET;
  bet = MAX_BET;
}

function handleDeal() {
  if (round === 1) {
    deal();
    render();
  } else if (round === 2) {
    draw();
    render();
    bet = 0;
  }
}

function deal() {
  deck = getNewShuffledDeck();
  hand = deck.slice(0, 5);
  round++;
  win = checkForWin();
  msg = 'Hold the cards you\'d like to keep.';
  if (win) msg = `${winLookup[win - 1].name}! Hold your cards.`;
}

function draw() {
  hand.forEach(function (card, index) {
    if (!card.held) {
      hand[index] = deck.pop();
    }
  });
  round = 0;
  win = checkForWin();

  if (win) {
    credits += (bet * winLookup[win - 1].multiplier);
    msg = `You won ${(bet * winLookup[win - 1].multiplier)} credits with ${(winLookup[win - 1].name)}!`;
  } else {
    msg = 'Try again?';
  }
  if (!credits) msg = 'You\'re out of credits! Play again?'
}

function handleHold(evt) {
  if (round !== 2) return;
  hand[evt.target.id].held = !hand[evt.target.id].held;
  render();
}


function checkForWin() {
  let handWins = [];

  const handSuits = hand.map(card => card.face[0])
    .reduce(function (acc, suit) {
      return acc.includes(suit) ? acc : acc += suit;
    }, '');
  const handVals = hand.map(card => card.value).sort((card, nextCard) => card - nextCard);
  const normalizedHandVals = normalizeRanks(handVals);

  if (handSuits.length === 1) {
  // we have a flush
    if (handVals.every((value, index) => value === handVals[0] + index)) {
      handWins.push(2);
    } else if (handVals.includes(1) && handVals.includes(13) && handVals.slice(1).every((value, index) => value === handVals[1] + index)) {
      // probably not the most elegant way to do this ^
      handWins.push(1);
    } else {
      handWins.push(5);
    }

  } else {
    // there is no flush, check for a straight
    if (handVals.every((value, index) => value === handVals[0] + index)) {
      handWins.push(6);
    } else if (normalizedHandVals === '11122') {
      if (handVals.some((value, index) => ((value >= 11 || value === 1) && value === handVals[index + 1]))) handWins.push(9);
    } else {
      handWins.push(winLookup.findIndex(winner => winner.sequence === normalizedHandVals) + 1);
    }
  }
  return handWins.length ? Math.min(...handWins) : 0;
}

function normalizeRanks(rankArray) {
  let normalized = [];

  rankArray.forEach(function(rank) {
    let count = rankArray.reduce((acc, value) => (value === rank ? ++acc : acc), 0);
    normalized.push(count);
  })

  return normalized.sort().join('');
}


// CARD FUNCTIONS - taken from class repo
function buildMasterDeck() {
  const deck = [];
  suits.forEach(function (suit) {
    ranks.forEach(function (rank) {
      deck.push({
        face: `${suit}${rank}`,
        value: Number(rank) || valueLookup[rank],
        held: false
      });
    });
  });
  return deck;
}

function getNewShuffledDeck() {
  const tempDeck = [...masterDeck];
  const newShuffledDeck = [];
  while (tempDeck.length) {
    const rndIdx = Math.floor(Math.random() * tempDeck.length);
    const card = tempDeck.splice(rndIdx, 1)[0];
    card.held = false;
    newShuffledDeck.push(card);
  }
  return newShuffledDeck;
}