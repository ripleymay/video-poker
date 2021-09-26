/*----- constants -----*/
// from card repo
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
let deck, hand, credits, bet, round;


/*----- cached element references -----*/
const scoreElems = [...document.querySelectorAll('#scoreboard > ol.values')];
const handElem = document.getElementById('hand');


/*----- event listeners -----*/
document.querySelectorAll('button.bet').forEach(button => 
  button.addEventListener("click", handleBet)
);
// not sure if this will work - should maybe be all?
document.getElementById('deal-draw').addEventListener('click', handleDeal);
document.getElementById('cash-out').addEventListener('click', handleCashout);

handElem.addEventListener('click', handleHold);


/*----- functions -----*/
init();

function init() {
    hand = [{face: 'back'}, {face: 'back'}, {face: 'back'}, 
      {face: 'back'}, {face: 'back'}];
    credits = START_CREDS;
    bet = 0;
    round = 0;

    render();
}

function render() {
    renderScoreboard();
    renderHand();
    document.getElementById('bet').innerHTML = `Bet ${bet}`;
    document.getElementById('credits').innerHTML = `${credits} credits`;
}

function renderScoreboard() {
  // hightlight correct bet column
  scoreElems.forEach(function(col, index) {
    col.style.backgroundColor = (index === bet - 1) ? 'rgba(255, 0, 0, 0.8)' : 'transparent';
  })
}

function renderHand() {
  let cardsHtml = '';
  hand.forEach(function(card) {
    cardsHtml += `<div class="card ${card.face}"></div>`;
  })
  handElem.innerHTML = cardsHtml;
}

function handleBet(evt) {
  // TO DO: somehow reset credits when bet is reset
  // and alert player when they dont have enough credits to bet

  if (evt.target.id === 'one') {
    bet = (bet >= MAX_BET) ? 1 : ++bet;
    credits--;
  } else if (evt.target.id === 'max') {
    bet = MAX_BET;
    credits -= MAX_BET;
  }

  render();
}

function handleDeal() {
  // if (!round) return; 

  deck = getNewShuffledDeck();
  for (let i = 0; i < 5; i++) {
    hand[i] = deck[i];
  }
  console.log(hand);
  checkForWin();
  render();
}

function handleCashout() {

}

function handleHold(evt) {
  console.log(evt.target);
}

function checkForWin() {

}

// card functions
function buildMasterDeck() {
    const deck = [];
    // Use nested forEach to generate card objects
    suits.forEach(function(suit) {
      ranks.forEach(function(rank) {
        deck.push({
          // The 'face' property maps to the library's CSS classes for cards
          face: `${suit}${rank}`,
          // Setting the 'value' property for game of blackjack, not war
          value: Number(rank) || (rank === 'A' ? 11 : 10)
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