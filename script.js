const gameBoard = (function() {
    const gameBoardArr = ["I", "I", "I", "I", "I", "I", "I", "I", "I"];
    const gameIDArr = ["I", "I", "I", "I", "I", "I", "I", "I", "I"];
    const spliceGameBoard = function(id, marker) {
        gameBoardArr.splice(id, 1, marker);
    }
    const spliceIDArr = function(id, marker) {
        gameIDArr.splice(id, 1, [id, marker]);
    }
    return {gameBoardArr, gameIDArr, spliceGameBoard, spliceIDArr};
})();

const PlayerFactory = (marker, target) => {
    const setPlayerOneName = function() {
        const name = prompt("Please enter player one's name");
        if (name == "") {
            target.textContent = "Player One";
        } else {target.textContent = name;}
    }
    const setPlayerTwoName = function() {
        const name = prompt("Please enter player two's name");
        if (name == "") {
            target.textContent = "Player Two";
        } else {target.textContent = name;}
    }
    return {marker, target, setPlayerOneName, setPlayerTwoName};
}

const playerOne = PlayerFactory("X", document.getElementById("player-one"));
const playerTwo = PlayerFactory("O", document.getElementById("player-two"));
playerOne.setPlayerOneName(playerOne.target);
playerTwo.setPlayerTwoName(playerTwo.target);

const turn = (function() {
    const getTurn = function() {
        let playerOnesTurns = 0;
        let playerTwosTurns = 0;
        let whichMarker;
        for (let i = 0; i < gameBoard.gameBoardArr.length; i++) {
            if (gameBoard.gameBoardArr[i] === "X") {
                playerOnesTurns++;
            } else if (gameBoard.gameBoardArr[i] === "O") {
                playerTwosTurns++;
            }
        } if ((playerTwosTurns === 0 && playerOnesTurns === 0) || playerTwosTurns === playerOnesTurns) {
            whichMarker = "X";
            playerTwo.target.setAttribute('style', 'background-color: #A6DADC; color:  black; padding: .2em; padding-left: 1em; \
            padding-right: 1em; border-radius: 10%; padding-bottom: .3em; box-shadow: 5px 5px 5px #CFA4A4');
            playerOne.target.setAttribute('style', 'color:  #E0C7C7; background-color: #311B1B; box-shadow: none');

        } else if (playerOnesTurns > playerTwosTurns) {
            whichMarker = "O";
            playerOne.target.setAttribute('style', 'background-color: #A6DADC; color:  black; padding: .2em; padding-left: 1em; \
                                padding-right: 1em; border-radius: 10%; padding-bottom: .3em; box-shadow: 5px 5px 5px #CFA4A4');
            playerTwo.target.setAttribute('style', 'color:  #E0C7C7; background-color: #311B1B; box-shadow: none');
        }
        return whichMarker; 
    }
    return {getTurn};  
})();

const displayControl = (function() {
    const playerOneSelections = [];
    const playerTwoSelections = [];
    const gridBoxes = document.querySelectorAll(".game-grid");
    const pushIntoArr = function(e) {
        let boxID = e.target.id;
        let box = document.getElementById(boxID);
        let boxIDNum = Number(boxID);
        let boxMarker = turn.getTurn();
        box.textContent = boxMarker;
        box.style.color = '#311B1B';
        gameBoard.spliceGameBoard(boxIDNum, boxMarker);
        gameBoard.spliceIDArr(boxIDNum, boxMarker);
        box.removeEventListener('click', pushIntoArr);
        gameStatus.getGameStatus(boxMarker);
    };
    gridBoxes.forEach(
        function(box) {
            box.addEventListener('click', pushIntoArr);
    });
    const playerOnePush = function(arrItem) {
        playerOneSelections.push(arrItem);
    }
    const playerTwoPush = function(arrItem) {
        playerTwoSelections.push(arrItem);
    }
    return {playerOnePush, playerTwoPush, playerOneSelections, playerTwoSelections};
})();

const gameStatus = (function() {
    const gameOver = document.querySelector("#game-over-screen");
    const gameOverWinner = gameOver.querySelector("#winning-player");
    const getGameStatus = function(marker) {    
        const winningArrs = [[[0, marker], [1, marker], [2, marker]], [[3, marker], [4, marker], [5, marker]],
                        [[6, marker], [7, marker], [8, marker]], [[0, marker], [3, marker], [6, marker]],
                        [[1, marker], [4, marker], [7, marker]], [[2, marker], [5, marker], [8, marker]],
                        [[0, marker], [4, marker], [8, marker]], [[2, marker], [4, marker], [6, marker]]];
        for (let i = 0; i < winningArrs.length; i++) {
            for (let j = 0; j < winningArrs[i].length; j++) {
                for (let k = 0; k < gameBoard.gameIDArr.length; k++) {
                    if (((gameBoard.gameIDArr[k]).toString()) == ((winningArrs[i][j]).toString())) {
                        if (marker === "X") { displayControl.playerOnePush(gameBoard.gameIDArr[k]); } 
                        else if (marker === "O") { displayControl.playerTwoPush(gameBoard.gameIDArr[k]); }
                        gameBoard.gameIDArr.splice(k, 1);
                    }
                }
                if (displayControl.playerOneSelections.toString() == (winningArrs[i]).toString()) { 
                    gameOver.style.display = 'block';
                    gameOverWinner.textContent = 'Player One';
                }
                if (displayControl.playerTwoSelections.toString() == (winningArrs[i]).toString()) { 
                    gameOver.style.display = 'block';
                    gameOverWinner.textContent = 'Player Two';
                }  
            }   
        }
    }
    return {getGameStatus};
})();

