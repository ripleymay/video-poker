# Video Poker Psuedocode

1. Define required constants
* const _winningHands_ 

2. Define required variables used to track the state of the game
* let _cards_ (if the cards are face-down or face-up, and in that case, their value)
* let _credits_ (how many credits the player has)
* let _win_ (if the player has a winning hand)

3. Store elements on the page that will be accessed in code more than once in variables to make code more concise, readable and performant.
* const Cards = document.querySelectorAll('card');

4. Upon loading the app should:
* Initialize the state variables
* Render those values to the page
* Wait for the user to click a bet button

5. Handle a player clicking a button

6. Handle a player clicking the replay button