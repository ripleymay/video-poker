# Video Poker Psuedocode

1. Define required constants
    * const _winningHands_ (holds all win hand combos in an object)

2. Define required variables used to track the state of the game
    * let _cards_ (if the cards are face-down or face-up, and in that case, their suit and rank)
    * let _credits_ (how many credits the player has)
    * let _bet_ (how much the player is betting on a round)
    * let _win_ (what winning hand the player has, if any)
    * let _round_ (determines if it's first deal or second draw)

3. Store elements on the page that will be accessed in code more than once in variables to make code more concise, readable and performant.
    * store the 5 card elements
    * store the 4 buttons

4. Upon loading the app should:
    1. Initialize the state variables
        * cards will be face down; none should be allowed to be 'held'
        * credits will start at 5?
        * win will be false or null
        * round will be 1
    2. Render those values to the page
    3. Wait for the user to click a bet button

5. Handle a player clicking a bet button
    * check what round it is. if it's the second round, do nothing because the player cannot change their bet. else if first round...
        * reduce credits by the correct amount
        * highlight the correct winnings column

6. Handle a player clicking the deal/draw button
    * check that they've bet something first
    * check what round it is. if first round...
        * deal five randomly drawn cards
        * check if those cards are a winning hand
            * take the top priority winning hand and highlight that hand name in the winnings board
        * let player 'hold' whatever cards they want

    * if it's the second round...
        * deal randomly drawn cards to all slots that arent held
        * check if those cards are a winning hand
            * take the top priority winning hand and highlight that hand name in the winnings board
            * display message telling player if they won or lost and how much
            * add respective winnings to the players credit

7. Handle a player clicking the cash out button
    * tell them their winnings, maybe some stats on how many rounds they played 
    * call the initialize function to reset all state variables

This video helped me learn how to play: https://www.youtube.com/watch?v=J89HlCYccds  
And I used this browser game as a model: https://www.freeslots.com/poker.htm
