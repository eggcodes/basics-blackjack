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
  // if there is an ace and the total value does not exceed 21, count it as 11
  if (checkAce(cardsArray)) {
    totalValue += 10;
  }
  if (checkAce(cardsArray) && totalValue > 21) {
    totalValue -= 10;
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

// generate player output msg
var generatePlayerOutputMsg = function () {
  var playerTotalValue = calcTotalValue(playerCards);
  var PLAYER_OUTPUT_MSG = `<u>YOUR HAND</u><br>`;
  for (var i = 0; i < playerCards.length; i += 1) {
    PLAYER_OUTPUT_MSG += `${playerCards[i].name} of ${playerCards[i].suit}<br>`;
  }
  PLAYER_OUTPUT_MSG += `<b>Your hand totals to ${playerTotalValue}.</b><br><br>`;
  return PLAYER_OUTPUT_MSG;
};

// generate dealer output msg
var generateDealerOutputMsg = function () {
  var dealerTotalValue = calcTotalValue(dealerCards);
  var DEALER_OUTPUT_MSG = `<u>DEALER'S HAND</u><br>`;
  for (var i = 0; i < dealerCards.length; i += 1) {
    DEALER_OUTPUT_MSG += `${dealerCards[i].name} of ${dealerCards[i].suit}<br>`;
  }
  DEALER_OUTPUT_MSG += `<b> Dealer's hand totals to ${dealerTotalValue}.</b><br><br>`;
  return DEALER_OUTPUT_MSG;
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
      var myOutputValue =
        generatePlayerOutputMsg() +
        generateDealerOutputMsg() +
        `<hr><br><b>Wow, you guys both got Black Jack!</b>`;
      resetGameState();
      return myOutputValue;
    }
    if (checkBJ(playerCards) && !checkBJ(dealerCards)) {
      myOutputValue =
        generatePlayerOutputMsg() +
        generateDealerOutputMsg() +
        `<hr><br><b> You win, you've got Black Jack!</b>`;
      resetGameState();
      return myOutputValue;
    }
    if (!checkBJ(playerCards) && checkBJ(dealerCards)) {
      myOutputValue =
        generatePlayerOutputMsg() +
        generateDealerOutputMsg() +
        `<hr><br><b> You lose, Dealer has Black Jack.</b>`;
      resetGameState();
      return myOutputValue;
    }

    gameState = "player move";
    myOutputValue =
      generatePlayerOutputMsg() +
      `Please enter "hit" to deal another card or "stand" to pass.`;
    return myOutputValue;
  }

  // player decides to "hit" or "stand"
  if (gameState == "player move") {
    if (input == "hit") {
      // deal player another card
      playerCards.push(shuffledDeck.pop());
      myOutputValue = generatePlayerOutputMsg();

      // check if player goes bust
      if (calcTotalValue(playerCards) > 21) {
        myOutputValue += `<hr><br><b> You lose! Play again?</b>`;
        resetGameState();
      }
      return myOutputValue;
    }
    if (input == "stand") {
      myOutputValue = generatePlayerOutputMsg();

      gameState = "dealer move";
      while (calcTotalValue(dealerCards) < 17) {
        dealerCards.push(shuffledDeck.pop());
      }
      myOutputValue += `It's the Dealer's turn. <br>
      Type "reveal" to view dealer's hand.`;
    } else {
      myOutputValue =
        generatePlayerOutputMsg() +
        `Please enter "hit" to deal another card or "stand" to pass.`;
    }
    return myOutputValue;
  }

  if (gameState == "dealer move") {
    if (input == "reveal") {
      myOutputValue = generatePlayerOutputMsg() + generateDealerOutputMsg();
      var dealerTotalValue = calcTotalValue(dealerCards);
      var playerTotalValue = calcTotalValue(playerCards);
    }
    // check if dealer goes bust
    if (dealerTotalValue > 21 || dealerTotalValue < playerTotalValue) {
      myOutputValue += `<hr><br><b>You win! Play again?</b>`;
    } else if (dealerTotalValue == playerTotalValue) {
      myOutputValue += `<hr><br><b>It's a tie. Play Again?</b>`;
    } else if (dealerTotalValue > playerTotalValue) {
      myOutputValue += `<hr><br><b>You lose. Play Again?</b>`;
    }
    resetGameState();
    return myOutputValue;
  }

  return myOutputValue;
};

/* 
bonus:
- nicer ui
*/
