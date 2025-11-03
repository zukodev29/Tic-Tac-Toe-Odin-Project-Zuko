document.addEventListener('DOMContentLoaded', () => {
// Grab elements from the page (safe after DOM is ready)
const player1Input = document.querySelector('#player1'); // name for X
const player2Input = document.querySelector('#player2'); // name for O
const startBtn = document.querySelector('.start-btn'); // start game button
const restartBtn = document.querySelector('.restart-btn'); // reset board button
const board = document.querySelector('.board');
/*All this consts get elements from html file */
//Cells will be stored array,that will contain all the divs inside board
  let cells = [];
  if (board) {
    cells = Array.from(board.querySelectorAll('.cell'));//Get all cells
    if (cells.length === 0) {
      cells = Array.from(board.querySelectorAll('div'));//It gets all divs inside board if there are no cells
    }
  }


  const statusEl = document.querySelector('.turn-info'); //Where we show messages
  const scoreContainer = document.querySelector('.game-info'); //Where we show scores

  // Simple game state
  let boardState = Array(9).fill(null); //Stores 'X', 'O' or null
  let currentPlayer = 'X'; //Whose turn it is
  let running = false; //Iis the game active?
  let xWins = 0, oWins = 0, draws = 0; //Score tracking

  //Small element to show scores
  const scoreDiv = document.createElement('div');//Create a div element
  scoreDiv.className = 'results';//Assign class name

  //Show text in the status area
  function updateStatus(text) {
    if (statusEl) statusEl.textContent = text;
  }
  //Its show which turn it is

  // Check if there is a winner and return 'X' or 'O' or null
  function checkWinner() {
    const wins = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
  //Combinations of winning


 //Function loops through all winning combinations
    for (const [a,b,c] of wins) {
      if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
        return boardState[a];
      }
    }
    return null;
  }

  // Reset board visuals and state(but keep scores)
  function resetBoard() {
    boardState.fill(null);
    cells.forEach(cell => {
      cell.textContent = '';
      cell.style.color = '';
    });
    currentPlayer = 'X';
    running = false;
    updateStatus('Press Start Game to play');
  }

  //Start a new round (clears board, sets running)
  function startGame() {
    boardState.fill(null);
    cells.forEach(cell => {
      cell.textContent = '';
      cell.style.color = '';
    });
    currentPlayer = 'X';
    running = true;
    updateStatus(`${player1Input?.value || 'Player X'}'s turn (X)`);
  }

  //End the round and update scores
  function endRound(winner) {
    running = false;
    if (winner === 'X') {
      xWins++;
      updateStatus(`${player1Input?.value || 'Player X'} wins!`);
    } else if (winner === 'O') {
      oWins++;
      updateStatus(`${player2Input?.value || 'Player O'} wins!`);
    } else {
      draws++;
      updateStatus('Draw!');
    }
    renderScore();
  }

  //Show current scores
  function renderScore() {
    scoreDiv.textContent = `X: ${xWins} • O: ${oWins} • Draws: ${draws}`;
    if (scoreContainer && !scoreContainer.contains(scoreDiv)) scoreContainer.appendChild(scoreDiv);
  }

  //Handle clicks on the board
  function onBoardClick(e) {
    if (!running) return; // ignore clicks when not running
    const clicked = e.target;
    const index = cells.indexOf(clicked);
    if (index === -1) return; // not a cell
    if (boardState[index]) return; // already filled

    //Mark state and UI
    boardState[index] = currentPlayer;
    clicked.textContent = currentPlayer;
    clicked.style.color = currentPlayer === 'X' ? '#00E5FF' : '#FF4D4D';

    //Check results
    const winner = checkWinner();
    if (winner) {
      endRound(winner);
      return;
    }

    //Draw check
    if (boardState.every(Boolean)) {
      endRound(null);
      return;
    }

    //Switch player and update status
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateStatus(`${currentPlayer === 'X' ? (player1Input?.value || 'Player X') : (player2Input?.value || 'Player O')}'s turn (${currentPlayer})`);
  }

  //Wire buttons and board
  if (startBtn) startBtn.addEventListener('click', startGame);
  if (restartBtn) restartBtn.addEventListener('click', resetBoard);
  if (board) board.addEventListener('click', onBoardClick);

  //Initialize UI
  resetBoard();
  renderScore();
});
