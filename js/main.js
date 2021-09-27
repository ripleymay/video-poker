/*----- constants -----*/
// CARD CONSTANTS - taken from class repo
const suits = ['s', 'c', 'd', 'h'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];
const masterDeck = buildMasterDeck();

const START_CREDS = 50;
const MAX_BET = 5;

const winLookup = [
    {name: 'Royal Flush', multiplier: 250},
    {name: 'Straight Flush', multiplier: 50},
    {name: 'Four of a Kind', multiplier: 25},
    {name: 'Full House', multiplier: 9},
    {name: 'Flush', multiplier: 6},
    {name: 'Straight', multiplier: 4},
    {name: 'Three of a Kind', multiplier: 3},
    {name: 'Two Pair', multiplier: 2},
    {name: 'Jacks or Better', multiplier: 1}
]


/*----- app's state (variables) -----*/
let deck, hand, credits, bet, msg, round;


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
    hand = [{face: 'back'}, {face: 'back'}, {face: 'back'}, 
      {face: 'back'}, {face: 'back'}];
    // hand = [];
    credits = START_CREDS;
    bet = 0;
    round = 1;
    msg = 'Welcome!';

    render();
}

function render() {
    renderScoreboard();
    renderHand();
    document.getElementById('message').innerHTML = `testing! round ${round}`;
    document.getElementById('bet').innerHTML = `Bet ${bet}`;
    document.getElementById('credits').innerHTML = `${credits} credits`;
    dealBtn.disabled = (!bet) ? true : false;
    betBtns.forEach(button => 
      button.disabled = (round === 2) ? true : false
    );
}

function renderScoreboard() {
  scoreElems.forEach(function(col, index) {
    col.style.backgroundColor = (index === bet - 1) ? 'rgba(255, 0, 0, 0.8)' : 'transparent';
  })
}

function renderHand() {
  let cardsHtml = '';
  hand.forEach(function(card, index) {
    let hold = (card.held) ? 'held' : '';
    cardsHtml += `<div id=${index} class="card ${card.face} ${hold}"></div>`;
  })
  handElem.innerHTML = cardsHtml;
}

function handleBet(evt) {
  // TO DO: alert player when they dont have enough credits to bet
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
  if (round === 1) {
    deck = getNewShuffledDeck();
    hand = deck.slice(0, 5);
    round++;

    checkForWin();
  } else if (round === 2) {
    hand.forEach(function(card, index) {
      if (!card.held) {
        hand[index] = deck.pop();
      }
    });
    round--;

    checkForWin();
    // add winnings to credits
    bet = 0;
  }

  render();
}

function handleHold(evt) {
  if (round != 2) return;
  hand[evt.target.id].held = !hand[evt.target.id].held;

  render();
}

function handleCashout() {

}

function checkForWin() {

}


// CARD FUNCTIONS - taken from class repo
function buildMasterDeck() {
    const deck = [];
    // Use nested forEach to generate card objects
    suits.forEach(function(suit) {
      ranks.forEach(function(rank) {
        deck.push({
          // The 'face' property maps to the library's CSS classes for cards
          face: `${suit}${rank}`,
          // Setting the 'value' property for game of blackjack, not war
          value: Number(rank) || (rank === 'A' ? 11 : 10),
          held: false
        });
      });
    });
    return deck;
  }

  function getNewShuffledDeck() {
    // Create a copy of the masterDeck (leave masterDeck untouched!)
    const tempDeck = [...masterDeck];
    const newShuffledDeck = [];
    while (tempDeck.length) {
      // Get a random index for a card still in the tempDeck
      const rndIdx = Math.floor(Math.random() * tempDeck.length);
      // Note the [0] after splice - this is because splice always returns an array and we just want the card object in that array
      newShuffledDeck.push(tempDeck.splice(rndIdx, 1)[0]);
    }
    return newShuffledDeck;
  }