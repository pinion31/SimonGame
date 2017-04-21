$(function() {


  const blue  = document.getElementById("blue");
  blue.addEventListener("click", selectSquare);

  const red = document.getElementById("red");
  red.addEventListener("click", selectSquare);

  const green = document.getElementById("green");
  green.addEventListener("click", selectSquare);

  const yellow = document.getElementById("yellow");
  yellow.addEventListener("click", selectSquare);

  const countDisplay = document.getElementById("count");

  const startButton = document.getElementById("startButton");
  startButton.addEventListener("click", startGame);

  const checkBox = document.getElementById("strictBox");

  const colorKey = {"blue":1, "red":2, "green":3, "yellow":4};
  const buttonKey = {1:blue, 2:red, 3:green, 4:yellow};

  //color of buttons when they are selected
  const brightColors = {1:"rgb(133,133,255)", 2:"rgb(255,133,133)",
                        3:"rgb(133,255,133)", 4:"rgb(234,255,133)"};



//closure that adds new number to sequence
  let sequence = function() {
      let numbers = [];

      return function(num)  {

        //only adds to sequence if num exists; otherwise, just returns
        //sequence
        if (arguments.length > 0 && num !== 0) {
            numbers.push(num);
        }

        //erases sequence for restart of round
        if (num === -1) {
            numbers = [];
        }

        //console.log(numbers);
        return numbers;
      }
  }

const game = {
    won:false,
    playerTurn:false,
    gameStarted:false,
    strict:false

}

//player object
const player = {
    addToSequence:sequence()
};

//computer object
var computer = {
    addToSequence:sequence(),
    play:playSequence,
    count:addToCount()
};

//toggles strict mode depending on player selection
function updateStrictMode(){
    checkBox.checked? game.strict = true:game.strict = false;
}

//plays audio from buttons
function playAudio() {
    this.firstChild.play();
}

//starts game
function startGame(playerClient=player, computerClient=computer) {
    resetGame();
    switchToComputerTurn(game);
    computerClient.play();
    countDisplay.innerHTML= "Count: " + computerClient.count(1);

}

//checks if player has reach count of 20; if so, player wins
function checkWin() {
    if (computer.count() >= 20) {
        alert("You Win! Press Start to Play Again");
        resetGame();
        return true;
    }
    else {
        return false;
    }
}

//adds to computer sequence count
function addToCount() {
    var counter = 0;
    return (num=0) => {
        counter += num;

        if (num === -1) {
           counter = 0;
        }
        return counter;
    }
}
//allow player to play
function switchToPlayerTurn(gameObj) {
    gameObj.playerTurn = true;
}

//disabled play for player while computer plays sequence
function switchToComputerTurn(gameObj) {
    gameObj.playerTurn = false;
}

//adds button to computer sequence
function addToSequenceForComputer(computerClient) {
    switchToComputerTurn(game);
    countDisplay.innerHTML= "Count: " + computerClient.count(1);
    computerClient.play();
}

//generates random number for random color button selection
function getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
 }

function playSequence(num=-1) {
    var increment = 750;
    var interval = 0;
    var arr;

    if (num === -1 ) { //if intent to add one to sequence
        // add another button to computer sequence
        arr = this.addToSequence(getRandomIntInclusive(1,4));
    }
    else { //if intent to just play sequence without adding one
        arr = this.addToSequence(0);
    }

    // plays sequence
    arr.forEach((value,key) => {

        setTimeout(() => {
            var button = buttonKey[value];
            blinkColor.call(button, button.style.backgroundColor,
            brightColors[value]);
            playAudio.call(button);
            button = null;


            if (key === arr.length-1){
                switchToPlayerTurn(game);
            }
        }, interval += increment);
    });
}

//flash of light to indicate color selection by player or computer
function blinkColor(origColor, selectedColor) {
    this.style.backgroundColor = selectedColor;
    this.style.boxShadow = "0px 0px 40px " + origColor;
    revertColor(origColor, this);
}

//check player selection to see if it matches computer sequence
function checkPlayerInput() {
    var playerArr = player.addToSequence();
    var compArr = computer.addToSequence();
    var hasLost = false;

    playerArr.forEach((value, key) => {
            if (value != compArr[key]) {
                hasLost = true;
                if (game.strict) {
                    alert("You Lost. Press Start to Play Again");
                }
                else {
                    alert("Try Again");
                }
            }
        });

    if (playerArr.length === compArr.length) {
        if (!hasLost) {
            if (!checkWin()) {
                addToSequenceForComputer(computer);
                player.addToSequence(-1); //erases player sequence
            }
           // checkWin();

        }
    }

    if (hasLost) {
        if (game.strict) {
                resetGame();
            }
            else {
                //console.log("hit");
                switchToComputerTurn(game);
                computer.play(0);
                player.addToSequence(-1);
                hasLost = false;
            }
    }
}

//restarts game
function resetGame() {
     player.addToSequence(-1);
     computer.addToSequence(-1);
     game.playerTurn = false;
     countDisplay.innerHTML= "Count: " + computer.count(-1);
     game.strict = false;
}

//for player selection of buttons
function selectSquare() {

        if (game.playerTurn) {
            updateStrictMode();
            playAudio.call(this);

            switch (this.id) {
                case "blue":
                    var prevColorBlue = this.style.backgroundColor;
                    blinkColor.call(this, prevColorBlue, brightColors[1]);
                    player.addToSequence(colorKey[this.id]);
                    break;
                case "red":
                    var prevColorRed = this.style.backgroundColor;
                    blinkColor.call(this, prevColorRed, brightColors[2]);
                    player.addToSequence(colorKey[this.id]);
                    break;
                case "green":
                    var prevColorGreen = this.style.backgroundColor;
                    blinkColor.call(this, prevColorGreen, brightColors[3]);
                    player.addToSequence(colorKey[this.id]);
                    break;
                case "yellow":
                    var prevColorYellow = this.style.backgroundColor;
                    blinkColor.call(this, prevColorYellow, brightColors[4]);
                    player.addToSequence(colorKey[this.id]);
                    break;
            }
            checkPlayerInput();
        }
}

//reverts color after color light up
function revertColor(colorValue, square) {

    setTimeout(function() { square.style.backgroundColor = colorValue;
        square.style.boxShadow = "none";
    }, 200);
}

});



