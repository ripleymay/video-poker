/*----- constants -----*/
// CARD CONSTANTS - taken from class repo
const suits = ['s', 'c', 'd', 'h'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];
const valueLookup = { 'A': 1, 'J': 11, 'Q': 12, 'K': 13 };
const masterDeck = buildMasterDeck();

const START_CREDS = 50;
const MAX_BET = 5;

const winLookup = [
  { name: 'Royal Flush', multiplier: 250 },
  { name: 'Straight Flush', multiplier: 50 },
  { name: 'Four of a Kind', multiplier: 25, sequence: '14444'},
  { name: 'Full House', multiplier: 9, sequence: '22333'},
  { name: 'Flush', multiplier: 6},
  { name: 'Straight', multiplier: 4},
  { name: 'Three of a Kind', multiplier: 3, sequence: '11333'},
  { name: 'Two Pair', multiplier: 2, sequence: '12222'},
  { name: 'Jacks or Better', multiplier: 1, sequence: '11122'}
]


/*----- app's state (variables) -----*/
let deck, hand, win, credits, bet, inPlay, msg;


/*----- cached element references -----*/
const scoreElems = [...document.querySelectorAll('#scoreboard > ol.values')];
const handElem = document.getElementById('hand');
const betBtns = document.querySelectorAll('button.bet');
const dealBtn = document.getElementById('deal-draw');
const cashBtn = document.getElementById('cash-out');


/*----- event listeners -----*/
betBtns.forEach(button =>
  button.addEventListener("click", handleBet)
);
dealBtn.addEventListener('click', handleDeal);
cashBtn.addEventListener('click', handleCashout);
handElem.addEventListener('click', handleHold);


/*----- functions -----*/
init();

function init() {
  initHand();
  credits = START_CREDS;
  bet = 0;
  win = 0;
  inPlay = false;
  msg = 'Welcome!';

  render();
}

function initHand() {
  hand = [{ face: 'back', value: NaN, held: false},
  { face: 'back', value: NaN, held: false},
  { face: 'back', value: NaN, held: false},
  { face: 'back', value: NaN, held: false},
  { face: 'back', value: NaN, held: false}];
}

function render() {
  renderScoreboard();
  renderHand();
  document.getElementById('message').innerHTML = `winner is... ${winLookup[win - 1].name}`;
  document.getElementById('bet').innerHTML = `Bet ${bet}`;
  document.getElementById('credits').innerHTML = `${credits} credits`;
  dealBtn.disabled = (!bet) ? true : false;
  betBtns.forEach(button =>
    button.disabled = inPlay ? true : false
  );
}

function renderScoreboard() {
  scoreElems.forEach(function (col, index) {
    col.style.backgroundColor = (index === bet - 1) ? 'rgba(255, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.25)';
  })
}

function renderHand() {
  let cardsHtml = '';
  hand.forEach(function (card, index) {
    let hold = (card.held) ? ' held' : '';
    cardsHtml += `<div id=${index} class="card ${card.face}${hold}"></div>`;
  })
  handElem.innerHTML = cardsHtml;
}

function handleBet(evt) {
  // TO DO: alert player when they dont have enough credits to bet
  initHand();
  win = 0;

  if (evt.target.id === 'one') {
    betOne();
  } else if (evt.target.id === 'max') {
    betMax();
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
  if (!inPlay) {
    deck = getNewShuffledDeck();
    hand = deck.slice(0, 5);
    // theres a bug here that sometimes deals already 'held' cards
    inPlay = true;

    win = checkForWin();
  } else if (inPlay) {
    hand.forEach(function (card, index) {
      if (!card.held) {
        hand[index] = deck.pop();
      }
    });
    inPlay = false;

    win = checkForWin();
    // add winnings to credits
    // reset bet but somehow keep column highlighted ?
  }

  render();
}

function handleHold(evt) {
  if (!inPlay) return;
  hand[evt.target.id].held = !hand[evt.target.id].held;

  render();
}

function handleCashout() {
  //
}

function checkForWin() {
  let handWins = [0];

  const handSuits = [...hand].map(card => card.face[0])
    .reduce(function (acc, suit) {
      return acc.includes(suit) ? acc : acc += suit;
    }, '');
  const handVals = [...hand].map(card => card.value).sort((card, nextCard) => card - nextCard);
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
    // there is no flush
    if (handVals.every((value, index) => value === handVals[0] + index)) {
      handWins.push(6);
    } else if (normalizedHandVals === '11122') {
      if (handVals.some((value, index) => (value >= 11 && (value === handVals[index = 1] || value === handVals[index - 1])))) handWins.push(9);
    } else {
      handWins.push(winLookup.findIndex(winner => winner.sequence === normalizedHandVals) + 1);
    }
  }

  return Math.min(...handWins);
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
    newShuffledDeck.push(tempDeck.splice(rndIdx, 1)[0]);
  }
  return newShuffledDeck;
}