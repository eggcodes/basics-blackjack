// HELPER FUNCTIONS
// make deck
var makeDeck = function () {
  var cardDeck = [];
  var suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
  var names = ["Ace", 2, 3, 4, 5, 6, 7, 8, 9, 10, "Jack", "Queen", "King"];
  var values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];

  for (var suitIndex = 0; suitIndex < suits.length; suitIndex += 1) {
    var cardSuit = suits[suitIndex];
    for (var i = 0; i < names.length; i += 1) {
      var cardName = names[i];
      var cardValue = values[i];
      var card = makeCard(cardName, cardSuit, cardValue);
      cardDeck.push(card);
    }
  }
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

// start game: deal 2 cards to player and dealer
var startGame = function () {
  playerCards.push(shuffledDeck.pop());
  dealerCards.push(shuffledDeck.pop());
  playerCards.push(shuffledDeck.pop());
  dealerCards.push(shuffledDeck.pop());
};

// check if there's an ace in cards
var checkAce = function (cardsArray) {
  var aceInHand = cardsArray.some((card) => card.name == "Ace");
  return aceInHand; // true
};
// calculate total value of cards
var calcTotalValue = function (cardsArray) {
  var totalValue = cardsArray.reduce((a, b) => a + b.value, 0);
  // as long as there's 1 ace, count it as 11
  if (checkAce(cardsArray)) {
    totalValue += 10;
  }
  return totalValue;
};

// check if blackjack
var checkBJ = function (cardsArray) {
  if (calcTotalValue(cardsArray) == 21) {
    return true;
  }
  return false;
};

// reset gane state
var resetGameState = function () {
  playerCards = [];
  dealerCards = [];
  gameState = "waiting to deal";
  shuffledDeck = shuffleCards(makeDeck());
};

// GLOBAL VARIABLES
var playerCards = [];
var dealerCards = [];
var gameState = "waiting to deal";
var shuffledDeck = shuffleCards(makeDeck());

// MAIN FUNCTION
var main = function (input) {
  // deals cards to both players and dealers
  if (gameState == "waiting to deal") {
    // deal 2 cards to both player and dealer
    startGame();

    // check if player or dealer has blackjack
    if (checkBJ(playerCards) && checkBJ(dealerCards)) {
      var myOutputValue = `wow, you guys both got Black Jack!`;
      return myOutputValue;
    }
    if (checkBJ(playerCards) && !checkBJ(dealerCards)) {
      myOutputValue = `you win, you've got Black Jack! <br><br>
        you drew ${playerCards[0].name} of ${playerCards[0].suit} and ${playerCards[1].name} of ${playerCards[1].suit}.`;
      return myOutputValue;
    }
    if (!checkBJ(playerCards) && checkBJ(dealerCards)) {
      myOutputValue = `you lose, dealer has Black Jack. <br><br>
        you drew ${playerCards[0].name} of ${playerCards[0].suit} and ${playerCards[1].name} of ${playerCards[1].suit}.`;
      return myOutputValue;
    }

    gameState = "player move";
    var playerTotalValue = calcTotalValue(playerCards);
    myOutputValue = `you drew <br>
      ${playerCards[0].name} of ${playerCards[0].suit}<br>
      ${playerCards[1].name} of ${playerCards[1].suit}<br><br>
      
      your total value is ${playerTotalValue}`;

    return myOutputValue;
  }

  // player decides to "hit" or "stand"
  if (gameState == "player move") {
    myOutputValue = `you drew <br>
    ${playerCards[0].name} of ${playerCards[0].suit}<br>
    ${playerCards[1].name} of ${playerCards[1].suit}<br>`;

    if (input == "hit") {
      // deal player another card
      playerCards.push(shuffledDeck.pop());
      playerTotalValue = calcTotalValue(playerCards);

      // output every new card drawn
      for (var l = 2; l < playerCards.length; l += 1) {
        myOutputValue += `${playerCards[l].name} of ${playerCards[l].suit}<br>`;
      }
      myOutputValue += `<br> your total value is ${playerTotalValue} <br>`;

      // check if player goes bust
      if (calcTotalValue(playerCards) > 21) {
        myOutputValue += `you lose! play again?`;
        resetGameState();
      }
      return myOutputValue;
    }

    if (input == "stand") {
      playerTotalValue = calcTotalValue(playerCards);
      myOutputValue = `you drew <br>`;
      for (var m = 0; m < playerCards.length; m += 1) {
        myOutputValue += `${playerCards[m].name} of ${playerCards[m].suit}<br>`;
      }
      myOutputValue += `<br> your total value is ${playerTotalValue} <br><br>`;
      gameState = "dealer move";
      var dealerTotalValue = calcTotalValue(dealerCards);
      while (dealerTotalValue < 17) {
        dealerCards.push(shuffledDeck.pop());
        dealerTotalValue = calcTotalValue(dealerCards);
      }
      myOutputValue += `dealer's turn. <br>
      type "reveal" to view dealer's hand.`;
    } else {
      myOutputValue = `please enter "hit" to deal another card or "stand" to pass.`;
    }
    return myOutputValue;
  }

  if (gameState == "dealer move") {
    playerTotalValue = calcTotalValue(playerCards);
    myOutputValue = `you drew <br>`;
    for (var n = 0; n < playerCards.length; n += 1) {
      myOutputValue += `${playerCards[n].name} of ${playerCards[n].suit}<br>`;
    }
    myOutputValue += `<br> your total value is ${playerTotalValue} <br><br>`;

    if (input == "reveal") {
      dealerTotalValue = calcTotalValue(dealerCards);
      myOutputValue += `dealer drew <br>`;
      for (var o = 0; o < dealerCards.length; o += 1) {
        myOutputValue += `${dealerCards[o].name} of ${dealerCards[o].suit}<br>`;
      }
      myOutputValue += `<br> dealer's total value is ${dealerTotalValue} <br><br>`;
    }
    // check if dealer goes bust
    if (dealerTotalValue > 21 || dealerTotalValue < playerTotalValue) {
      myOutputValue += `you win!`;
    } else if (dealerTotalValue == playerTotalValue) {
      myOutputValue += `it's a tie.`;
    } else if (dealerTotalValue > playerTotalValue) {
      myOutputValue += `you lose.`;
    }
    resetGameState();
    return myOutputValue;
  }

  return myOutputValue;
};

/* 
refactor:
- making output messages modular/better
- reset game state

bonus:
- nicer ui
*/
