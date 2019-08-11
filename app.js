let box = document.querySelectorAll('.box');
let playerTrack = document.querySelector('.playerTurn');
let startBtn = document.querySelector('.start');
let robotBtn = document.querySelector('.robot-start');
let boardFull = false;
let gameState = false;    
let initialStart = false;
let robotMode = false;
let playerTurn = 1;

const game = (() => {
    // player / AI movement
    const playerMove = (e) => {
        if(gameState !== false) {
            if(playerTurn % 2 !== 0) {
                if(e.target.classList.contains('full')) {
                    game.showAlert('Select a different spot.');
                } else {
                    e.target.textContent = "X";
                    playerTrack.textContent = `O's Turn`;
                    e.target.classList.add('full');
                    playerTurn++;
                    
                    game.victory();
                    if(robotMode === true && gameState !== false) {
                        setTimeout(robotMove, 1000);
                    }
                }

            } else if(playerTurn % 2 === 0 && robotMode === false) {
                if(e.target.classList.contains('full')) {
                    game.showAlert('Select a different spot.');
                } else {
                    e.target.textContent = "O";
                    playerTrack.textContent = `X's Turn`;
                    e.target.classList.add('full');
                    playerTurn++;
                    game.victory();
                }
            }
            
        } else if(gameState == false && initialStart !== false) {
            game.showAlert('Press "Restart" to play again.');
        } else {
            game.showAlert('Press "Start" to begin.');
        }
    }
    
    const robotMove = () => {
        let randMove = Math.floor(Math.random()*9);
        if(box[randMove].classList.contains('full') === true && boardFull === false && gameState !== false) {
            robotMove();
            return;
        } else if(boardFull === false && gameState !== false) {
            box[randMove].textContent = "O";
            playerTrack.textContent = `X's Turn`;
            box[randMove].classList.add('full');
            playerTurn++;
            game.victory();
        } else {
            console.log('Stops working..');
        }
    }
    // based on the current iteration of i, insert it into a string for the row/column/diag then put it into list
    // if we end up with 'xxx' or 'ooo' inside of the list, the game is won
    const checkBoard = () => {
        let list = '';
        let row = '';
        let row1 = '';
        let row2 = '';
        let col = '';
        let col1 = '';
        let col2 = '';
        let diag = '';
        let counterDiag = '';
        let fullBoxes = 0;
        for(i = 0; i < box.length; i++) {
            if(i === 0 || i === 1 || i === 2) {
                row += box[i].textContent;
            }
            if(i === 3 || i === 4 || i === 5) {
                row1 += box[i].textContent;
            }
            if(i === 6 || i === 7 || i === 8) {
                row2 += box[i].textContent;
            }
            if(i === 0 || i === 3 || i === 6) {
                col += box[i].textContent;
            }
            if(i === 1 || i === 4 || i === 7) {
                col1 += box[i].textContent;
            }
            if(i === 2 || i === 5 || i === 8) {
                col2 += box[i].textContent;
            }
            if(i === 0 || i === 4 || i === 8) {
                diag += box[i].textContent;
            }
            if(i === 6 || i === 4 || i === 2) {
                counterDiag += box[i].textContent;
            }
            if(box[i].textContent !== '') {
                fullBoxes++;
                if(fullBoxes === 9) {
                    boardFull = true;
                    fullBoxes = 0;
                }
            }
        }
        list = `${row}, ${row1}, ${row2}, ${col}, ${col1}, ${col2}, ${diag}, ${counterDiag}`;
        return list.toLowerCase();
    }
    // win condition
    const victory = () => {
        let currentState = game.checkBoard();
        if(currentState.indexOf('xxx') > -1) {
            showAlert('X Wins!');
            gameState = false;
        } else if (currentState.indexOf('ooo') > -1) {
            showAlert('O Wins!');
            gameState = false;
        } else if (currentState.indexOf('ooo') == -1 && currentState.indexOf('xxx') == -1 && boardFull == true) {
            showAlert('It\'s a draw!');
            gameState = false;
        }
    }
    // game start (start, restart, robotStart);
    const restart = () => {
        box.forEach((element) => {
            element.classList.remove('full');
            element.textContent = '';
        });
        playerTurn = 1;
        gameState = true;
        boardFull = false;
    }

    const start = () => {
        restart();
        robotMode = false;
        gameState = true;
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
        gameState = true;
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

    return { playerMove, checkBoard, victory, showAlert, hideAlert, start, robotStart, robotMove }
})();

for(i = 0; i < box.length; i++) {
    box[i].addEventListener('click', game.playerMove);
}

startBtn.addEventListener('click', game.start);
robotBtn.addEventListener('click', game.robotStart);