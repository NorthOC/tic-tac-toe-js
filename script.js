const gameBoard = (() => {
    let board = [];

    //reset gameboard
    const reset = () => {
        board = [];
        for (let i = 0; i<9; i++){
            board.push(" ");
        }
    }

    //get board values
    const getBoard = () => board;
    reset();

    const setBoardValue = (symbol, idx) =>{
        if (board[idx] != ' '){
            return
        }
        board[idx] = symbol
        //console.log(board)
    }

    return {getBoard, setBoardValue, reset}
})()

const Player = (name, symbol) => {

    const getName = () => name;
    const getSymbol = () => symbol;

    return {getName, getSymbol}
}

const gameController = ((board) => {
    let playerOne = "";
    let playerTwo = "";
    let currentPlayer = "";
    const winConditions = ["123", "456", "789", "159", "357", "147", "258", "369"];

    const selectPlayerOne = () => {
        let playerName = document.getElementById("playerName").value;
        if (playerName == ""){
            playerName = document.getElementById("playerName").getAttribute("placeholder");
        }
        if (playerOne == "") {
            playerOne = Player(playerName, "X");
            currentPlayer = playerOne;
            startPlayerSelect("two");
        }
        else {
            playerTwo = Player(playerName, "O");

            let coinFlip = Math.round(Math.random());
            if (coinFlip){
                endTurn();
            }
            gameLoop();
        }
    }

    const startPlayerSelect = (num) => {
        let h2 = document.createElement("h2");
        h2.innerHTML = `Enter the name of player ${num}!`;
        let form = document.createElement("form");
        form.className = "fixed"
        let input = document.createElement("input");
        input.id = "playerName";
        input.placeholder = `Player ${num}`;
        input.type = "text";
        let btn = document.createElement("button");
        btn.innerHTML = "Submit";
        btn.type = "submit";
        form.appendChild(input);
        form.appendChild(btn);
        form.onsubmit = function(e){ 
            e.preventDefault;
            selectPlayerOne();
        }
    
        let gameDiv = document.getElementById("game");
        gameDiv.innerHTML = "";
        gameDiv.appendChild(h2)
        gameDiv.appendChild(form)
    }

    const endTurn = () => {
        if (currentPlayer == playerOne) {
            currentPlayer = playerTwo;
        } else{
            currentPlayer = playerOne;
        }
    }

    const checkForWin = () => {
        let boardState = board.getBoard()
        for(let condition of winConditions) {
            let cells = condition.split("");
            // indexes of board
            let cellOneIdx = parseInt(cells[0]) - 1;
            let cellTwoIdx = parseInt(cells[1]) - 1;
            let cellThreeIdx = parseInt(cells[2]) - 1;
            

            if (boardState[cellOneIdx] == currentPlayer.getSymbol() && boardState[cellTwoIdx] == currentPlayer.getSymbol() && boardState[cellThreeIdx] == currentPlayer.getSymbol()){
                return true
            }
        }
        return false
    }

    const gameLoop = () => {
        let didWin = checkForWin();
        let checkForTie = board.getBoard().indexOf(" ")

        let gameDiv = document.getElementById("game");
        gameDiv.innerHTML = ""

        let turnMessage = document.createElement("h2");
        turnMessage.id = "msg";

        if (didWin){
            turnMessage.innerHTML = `${currentPlayer.getName()} wins!`;
        } else if (checkForTie == -1) {
            turnMessage.innerHTML = `Tis a tie!`;
        }
        else{
            endTurn();
            turnMessage.innerHTML = `It is ${currentPlayer.getName()}\'s turn!`;
        }

        gameDiv.appendChild(turnMessage);

        let gridDiv = document.createElement("div")
        gridDiv.id = "grid";
        gameDiv.appendChild(gridDiv);

        let boardState = board.getBoard();
        let i = 0;
        for (let cell of boardState){
            let item = document.createElement("p");
            item.value = i;
            if (!didWin && checkForTie !== -1){
            item.onclick = () => {
                let prevBoardValue = board.getBoard()[item.value];
                board.setBoardValue(currentPlayer.getSymbol(), item.value);
                    if (prevBoardValue !== " "){
                        if (document.getElementById("err") == undefined){
                            let err = document.createElement("p");
                            err.innerHTML = "Please select a tile that is not already filled in!";
                            err.id = "err";
                            turnMessage.parentNode.insertBefore(err, turnMessage.nextSibling)
                        }
                    } else{
                        gameLoop();
                    }
                }
            }

            if (cell == "O"){
                item.className = "o-symbol";
            } else if (cell == "X"){
                item.className = "x-symbol";
            } else {
                item.innerHTML = cell;
            }
            gridDiv.appendChild(item);
            i+= 1;
        }
        if (didWin || checkForTie == -1){
            let restartButton = document.createElement("button");
            restartButton.id = "restart";
            restartButton.innerHTML = "Rematch!"
            restartButton.onclick = function(){
                document.getElementById("reset").remove()
                document.getElementById("restart").remove()
                board.reset();
                gameLoop();
            }

            
            let resetButton = document.createElement("button");
            resetButton.id = "reset";
            resetButton.innerHTML = "Reset"
            resetButton.onclick = function(){
                playerOne = "";
                playerTwo = "";
                board.reset();
                document.getElementById("reset").remove()
                document.getElementById("restart").remove()
                startPlayerSelect("one");
            }

            let title = document.getElementById("title")
            title.parentNode.insertBefore(resetButton, title.nextSibling);
            title.parentNode.insertBefore(restartButton, title.nextSibling);
        }
    }

    return {startPlayerSelect}

})(gameBoard)

// main game function
function runGame(){
    gameController.startPlayerSelect("one");
}

// copyright
var date = new Date().getFullYear();
document.getElementById("year").innerHTML = date;