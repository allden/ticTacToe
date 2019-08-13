let box = document.querySelectorAll('.box');
let playerTrack = document.querySelector('.playerTurn');
let startBtn = document.querySelector('.start');
let robotBtn = document.querySelector('.robot-start');
let gameState = false;    
let initialStart = false;
let robotMode = false;
let playerTurn = 1;
let board = [0,1,2,3,4,5,6,7,8];
let playerOne = 'X';
let playerTwo = 'O';
let move = 0;
// functions
const game = (() => {
    // player / AI movement
    const playerMove = (e) => {
        if(gameState !== false) {
            if(playerTurn % 2 !== 0) {
                if(e.target.classList.contains('full')) {
                    showAlert('Select a different spot.');
                } else {        
                    if(robotMode === true && gameState !== false) {
                        setTimeout(robotMove, 1000);
                    }
                    e.target.textContent = playerOne;
                    boardTranscribe(e.target, playerOne);
                    playerTrack.textContent = `${playerTwo}'s Turn`;
                    e.target.classList.add('full');
                    playerTurn++;
                    
                    victory();
                }

            } else if(playerTurn % 2 === 0 && robotMode === false) {
                if(e.target.classList.contains('full')) {
                    showAlert('Select a different spot.');
                } else {        
                    e.target.textContent = playerTwo;
                    playerTrack.textContent = `${playerOne}'s Turn`;
                    boardTranscribe(e.target, playerTwo);
                    e.target.classList.add('full');
                    playerTurn++;
                    victory();
                }
            }
            
        } else if(gameState == false && initialStart !== false) {
            showAlert('Press "Restart" to play again.');
        } else {
            showAlert('Press "Start" to begin.');
        }
    }
    const boardTranscribe = (obj, player) => {
        if(obj.classList.contains('space-1')) {
            board[0] = player;
        } else if(obj.classList.contains('space-2')) {
            board[1] = player;
        }
        else if(obj.classList.contains('space-3')) {
            board[2] = player;
        }
        else if(obj.classList.contains('space-4')) {
            board[3] = player;
        }
        else if(obj.classList.contains('space-5')) {
            board[4] = player;
        }
        else if(obj.classList.contains('space-6')) {
            board[5] = player;
        }
        else if(obj.classList.contains('space-7')) {
            board[6] = player;
        }
        else if(obj.classList.contains('space-8')) {
            board[7] = player;
        }
        else {
            board[8] = player;
        } 
    }

    const minimax = (newBoard, player) => {
        //available spots
        var availSpots = emptyIndexies(newBoard);

        // checks for the terminal states such as win, lose, and tie and returning a value accordingly
        if (checkBoard(newBoard, playerOne)){
            return {score:-10};
        } else if (checkBoard(newBoard, playerTwo)){
            return {score:10};
        } else if (availSpots.length === 0){
            return {score:0};
        }

        // an array to collect all the objects
        var moves = [];

        // loop through available spots
        for (var i = 0; i < availSpots.length; i++){
        //create an object for each and store the index of that spot that was stored as a number in the object's index key
        var move = {};
        move.index = newBoard[availSpots[i]];

        // set the empty spot to the current player
        newBoard[availSpots[i]] = player;

        //if collect the score resulted from calling minimax on the opponent of the current player
        if (player == playerTwo){
        var result = minimax(newBoard, playerOne);
        move.score = result.score;
        }
        else{
        var result = minimax(newBoard, playerTwo);
        move.score = result.score;
        }

        //reset the spot to empty
        newBoard[availSpots[i]] = move.index;

        // push the object to the array
        moves.push(move);
        }

        var bestMove;
        if(player === playerTwo){
            var bestScore = -10000;
            for(var i = 0; i < moves.length; i++){
                if(moves[i].score > bestScore){
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }else{

        // else loop over the moves and choose the move with the lowest score
            var bestScore = 10000;
            for(var i = 0; i < moves.length; i++){
            if(moves[i].score < bestScore){
                bestScore = moves[i].score;
                bestMove = i;
            }
            }
        }

        return moves[bestMove];
    }

    const emptyIndexies = (board) => {
        return board.filter(empty => empty !== playerOne && empty !== playerTwo)
    }

    const robotMove = () => {
        if(gameState !== false) {
            let bestSpot = minimax(board, playerTwo);
            console.log(bestSpot.index);
            box[bestSpot.index].textContent = playerTwo;
            boardTranscribe(box[bestSpot.index], playerTwo);
            playerTrack.textContent = `${playerOne}'s Turn`;
            box[bestSpot.index].classList.add('full');
            playerTurn++;
            victory();
        }
    }
    // based on the current iteration of i, insert it into a string for the row/column/diag then put it into list
    // if we end up with 'xxx' or 'ooo' inside of the list, the game is won
    const checkBoard = (board, player) => {
        if(
            (board[0] === player && board[1] === player && board[2] === player) ||
            (board[3] === player && board[4] === player && board[5] === player) ||
            (board[6] === player && board[7] === player && board[8] === player) ||
            (board[0] === player && board[3] === player && board[6] === player) ||
            (board[1] === player && board[4] === player && board[7] === player) ||
            (board[2] === player && board[5] === player && board[8] === player) ||
            (board[0] === player && board[4] === player && board[8] === player) ||
            (board[2] === player && board[4] === player && board[6] === player)
        ) {
            return true;
        } else {
            return false;
        }
    }
    // win condition
    const victory = () => {
        if(checkBoard(board, playerOne) === true) {
            showAlert(`${playerOne} wins!`);
            gameState = false;
        } else if(checkBoard(board, playerTwo) === true) {
            showAlert(`${playerTwo} wins!`);
            gameState = false;
        } else if(emptyIndexies(board).length === 0) {
            showAlert(`It's a tie!`);
            gameState = false;
        }
    }
    // game start (start, restart, robotStart);
    const restart = () => {
        box.forEach((element) => {
            element.classList.remove('full');
            element.textContent = '';
        });
        board = [0,1,2,3,4,5,6,7,8];
        playerTurn = 1;
        gameState = true;
        boardFull = false;
    }

    const start = () => {
        restart();
        robotMode = false;
        initialStart = true;
        startBtn.value = 'Restart';
        startBtn.removeEventListener('click', game.start);
        startBtn.addEventListener('click', restart);
        robotBtn.value = "Play with AI";
        robotBtn.removeEventListener('click', start);
        robotBtn.addEventListener('click', robotStart);
    }

    const robotStart = () => {
        restart();
        initialStart = true;
        robotMode = true;
        startBtn.value = 'Restart';
        startBtn.removeEventListener('click', game.start);
        startBtn.addEventListener('click', restart);
        robotBtn.value = "Play with a person";
        robotBtn.removeEventListener('click', robotStart);
        robotBtn.addEventListener('click', start);
    }
    // pop-up boxes
    const showAlert = (msg) => {
        let myAlert = document.createElement('div');
        myAlert.appendChild(document.createTextNode(msg));
        myAlert.style.padding = '1rem';
        myAlert.style.color = 'var(--light-color)';
        myAlert.style.backgroundColor = 'var(--dark-color)';
        myAlert.style.fontSize = '1.5rem';
        myAlert.style.width = '300px';
        myAlert.style.marginBottom = '1rem';
        myAlert.style.borderRadius = '10px';
        myAlert.style.textAlign = 'center';
        myAlert.style.alignSelf = 'center';
        myAlert.classList.add('hide');
        let container = document.querySelector('.container');
        let center = document.querySelector('.center');
        container.insertBefore(myAlert, center);

        setTimeout(hideAlert, 2000);
    }

    const hideAlert = () => {
        let myAlert = document.querySelector('.hide');
        myAlert.remove();
    }

    return { playerMove, start, robotStart }
})();

for(i = 0; i < box.length; i++) {
    box[i].addEventListener('click', game.playerMove);
}

startBtn.addEventListener('click', game.start);
robotBtn.addEventListener('click', game.robotStart);