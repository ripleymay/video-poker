/*----- constants -----*/
const suits = ['s', 'c', 'd', 'h'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];

const START_CREDS = 5;
const MAX_CREDS = 5;

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
let hand, credits, bet, round


/*----- cached element references -----*/
const scoreElems = [...document.querySelectorAll('#scoreboard > ol.winnings')];
const handElem = [...document.querySelectorAll('div.card')];


/*----- event listeners -----*/
document.querySelector('button.bet').addEventListener('click', handleBet);
// not sure if this will work - should maybe be all?
document.getElementById('deal-draw').addEventListener('click', handleDeal);
document.getElementById('cash-out').addEventListener('click', handleCashout);


/*----- functions -----*/
init();

function init() {
    hand = [null, null, null, null, null];
    credits = START_CREDS;
    bet = 0;
    round = 0;

    // shuffleDeck();

    render();
}

function render() {
    renderHand();
    document.getElementById('credits').innerHTML = `${credits} credits`;
}

function renderHand() {
    hand.forEach(function(card, index) {
        if (!card) handElem[index].classList.add('back');
    })

    /* or..
    handElem.forEach(function(cardElem, cardIdx) {
        let card = hand[cardIdx]
        if (!card) cardElem.classList.add("back-red");
    })
    */
}

function handleBet(evt) {

}

function handleDeal() {
    if (!round) return; 
    checkForWin();
}

function handleCashout() {

}

function checkForWin() {

}

// card functions
const masterDeck = buildMasterDeck();

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