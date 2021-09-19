// HELPER FUNCTIONS
// make deck
var makeDeck = function () {
  // Initialise an empty cardDeck array
  var cardDeck = [];
  // Initialise an array of the 4 suits in our deck. We will loop over this array.
  var suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
  var names = ["Ace", 2, 3, 4, 5, 6, 7, 8, 9, 10, "Jack", "Queen", "King"];
  var values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];
  // Loop over the suits array
  for (var suitIndex = 0; suitIndex < suits.length; suitIndex += 1) {
    // Store the current suit in a variable
    var cardSuit = suits[suitIndex];
    // Loop over the card values
    for (var i = 0; i < names.length; i += 1) {
      var cardName = names[i];
      var cardValue = values[i];
      // Create a new card with the current name, suit and value
      var card = makeCard(cardName, cardSuit, cardValue);
      // Add the new card to the deck
      cardDeck.push(card);
    }
  }
  // Return the completed card deck array
  return cardDeck;
};
// make a card object
var makeCard = function (cardName, cardSuit, cardValue) {
  var cardObj = {
    name: cardName,
    suit: cardSuit,
    value: cardValue,
  };
  return cardObj;
};
// shuffle deck
// get a random index ranging from 0 (inclusive) to max (exclusive)
var getRandomIndex = function (max) {
  return Math.floor(Math.random() * max);
};
// shuffle elements in the cardDeck array. Return the shuffled deck.
var shuffleCards = function (cardDeck) {
  var shuffledDeck = [];
  for (var i = 0; i < 52; i += 1) {
    var randomIndex = getRandomIndex(cardDeck.length);
    randomCardArray = cardDeck.splice(randomIndex, 1);
    shuffledDeck.push(randomCardArray[0]);
  }
  // return shuffledDeck array with cardObjects
  return shuffledDeck;
};

// player has blackjack CLEAN THIS UP LATER
var checkPlayerBJ = function () {
  if (
    (playerCards[0].value == 1 &&
      (playerCards[1].value == 1 || playerCards[1].value == 10)) ||
    (playerCards[1].value == 1 &&
      (playerCards[0].value == 1 || playerCards[0].value == 10))
  ) {
    return true;
  } else {
    return false;
  }
};

// dealer has blackjack CLEAN THIS UP LATER
var checkDealerBJ = function () {
  if (
    (dealerCards[0].value == 1 &&
      (dealerCards[1].value == 1 || dealerCards[1].value == 10)) ||
    (dealerCards[1].value == 1 &&
      (dealerCards[0].value == 1 || dealerCards[0].value == 10))
  ) {
    return true;
  } else {
    return false;
  }
};

// player total value
var calcPlayerTotalValue = function () {
  var playerTotalValue = 0;
  for (var j = 0; j < playerCards.length; j += 1) {
    playerTotalValue += playerCards[j].value;
  }

  return playerTotalValue;
};

// dealer total value
var calcDealerTotalValue = function () {
  var dealerTotalValue = 0;
  for (var k = 0; k < dealerCards.length; k += 1) {
    dealerTotalValue += dealerCards[k].value;
  }
  return dealerTotalValue;
};

// GLOBAL VARIABLES
var playerCards = [];
var dealerCards = [];
var gameState = "waiting to deal";
var shuffledDeck = shuffleCards(makeDeck());

// MAIN FUNCTION
var main = function (input) {
  // deals cards
  if (gameState == "waiting to deal") {
    playerCards.push(shuffledDeck.pop());
    dealerCards.push(shuffledDeck.pop());
    playerCards.push(shuffledDeck.pop());
    dealerCards.push(shuffledDeck.pop());

    // check if player or dealer has blackjack
    if (checkPlayerBJ() && checkDealerBJ()) {
      var myOutputValue = `wow, you guys both got Black Jack!`;
    }
    if (checkPlayerBJ() && !checkDealerBJ()) {
      myOutputValue = `you win, you've got Black Jack! <br><br>
        you drew ${playerCards[0].name} of ${playerCards[0].suit} and ${playerCards[1].name} of ${playerCards[1].suit}.`;
      return myOutputValue;
    }
    if (!checkPlayerBJ() && checkDealerBJ()) {
      myOutputValue = `you lose, dealer has Black Jack. <br><br>
        you drew ${playerCards[0].name} of ${playerCards[0].suit} and ${playerCards[1].name} of ${playerCards[1].suit}.`;
      return myOutputValue;
    } else {
      gameState = "player move";
      var playerTotalValue = calcPlayerTotalValue();
      myOutputValue = `you drew <br>
      ${playerCards[0].name} of ${playerCards[0].suit}<br>
      ${playerCards[1].name} of ${playerCards[1].suit}<br><br>
      
      your total value is ${playerTotalValue}`;
      return myOutputValue;
    }
  }

  // player decides to "hit" or "stand"
  if (gameState == "player move") {
    myOutputValue = `you drew <br>
    ${playerCards[0].name} of ${playerCards[0].suit}<br>
    ${playerCards[1].name} of ${playerCards[1].suit}<br>`;

    if (input == "hit") {
      // deal player another card
      playerCards.push(shuffledDeck.pop());
      playerTotalValue = calcPlayerTotalValue();

      // output every new card drawn
      for (var l = 2; l < playerCards.length; l += 1) {
        myOutputValue += `${playerCards[l].name} of ${playerCards[l].suit}<br>`;
      }
      myOutputValue += `<br> your total value is ${playerTotalValue} <br>`;

      // check if player goes bust
      if (calcPlayerTotalValue() > 21) {
        myOutputValue += `you lose!`;
        // NEED A RESET GAME STATE FUNCTION HERE
      }
      return myOutputValue;
    }

    if (input == "stand") {
      playerTotalValue = calcPlayerTotalValue();
      myOutputValue = `you drew <br>`;
      for (var m = 0; m < playerCards.length; m += 1) {
        myOutputValue += `${playerCards[m].name} of ${playerCards[m].suit}<br>`;
      }
      myOutputValue += `<br> your total value is ${playerTotalValue} <br><br>`;
      gameState = "dealer move";
      var dealerTotalValue = calcDealerTotalValue();
      while (dealerTotalValue < 17) {
        dealerCards.push(shuffledDeck.pop());
        dealerTotalValue = calcDealerTotalValue();
      }
      myOutputValue += `dealer's turn. <br>
      type "reveal" to view dealer's hand.`;
    } else {
      myOutputValue = `please enter "hit" to deal another card or "stand" to pass.`;
    }
    return myOutputValue;
  }

  if (gameState == "dealer move") {
    playerTotalValue = calcPlayerTotalValue();
    myOutputValue = `you drew <br>`;
    for (var n = 0; n < playerCards.length; n += 1) {
      myOutputValue += `${playerCards[n].name} of ${playerCards[n].suit}<br>`;
    }
    myOutputValue += `<br> your total value is ${playerTotalValue} <br><br>`;

    if (input == "reveal") {
      dealerTotalValue = calcDealerTotalValue();
      myOutputValue += `dealer drew <br>`;
      for (var o = 0; o < dealerCards.length; o += 1) {
        myOutputValue += `${dealerCards[o].name} of ${dealerCards[o].suit}<br>`;
      }
      myOutputValue += `<br> dealer's total value is ${dealerTotalValue} <br><br>`;
    }
    // check if dealer goes
    if (dealerTotalValue > 21 || dealerTotalValue < playerTotalValue) {
      myOutputValue += `you win!`;
    } else if (dealerTotalValue == playerTotalValue) {
      myOutputValue += `you drew.`;
    } else if (dealerTotalValue > playerTotalValue) {
      myOutputValue += `you lose.`;
    }
    return myOutputValue;
  }

  return myOutputValue;
};

// There will be only two players. One human and one computer.
// The computer will always be the dealer. The dealer has to hit if their hand is below 17.
// The player who is closer to 21 wins the hand. Aces can be 1 or 11.

// Deck is shuffled.
// User clicks Submit to deal cards.
// The cards are analysed for game winning conditions, e.g. Blackjack.
// The cards are displayed to the user.
// The user decides whether to hit or stand, using the submit button to submit their choice.
// The user's cards are analysed for winning or losing conditions.
// The computer decides to hit or stand automatically based on game rules.
// The game either ends or continues.

/* 
refactor:
- making output messages modular/better
- variable ace value
- reset game state

bonus:
- nicer ui
*/
