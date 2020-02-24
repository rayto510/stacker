import React, { useState, useReducer } from 'react';
import useInterval from './useInterval.js';
import './App.css';

/** SETUP CONSTANTS **/
const ROWS = 12;
const COLUMNS = 7;
const LEFT = 0;
const RIGHT = 1;
const EMPTY = '.';
const ACTIVE = 'X';

function createBoard() {
  let board = [ROWS];
  for (let i = 0; i < ROWS; i++) {
    board[i] = [COLUMNS];
    for (let j = 0; j < COLUMNS; j++) {
      board[i][j] = EMPTY;
    }
  }
  return board;
}

function App() {
  const [activeRow, setActiveRow] = useState(ROWS - 1);
  const [activeColumns, setActiveColumns] = useState([0, 1, 2]);
  const [activeDirection, changeDirection] = useState(RIGHT);
  const [activeBlocks, setActiveBlocks] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [board, dispatch] = useReducer((board, action) => {
    switch (action.type) {
      case "update":
        return board.map((row, index) => index === activeRow ? row.map((cell, i) => activeColumns.includes(i) ? ACTIVE : EMPTY ) : row);
      case "reset":
        return createBoard();
      default:
        break;
    }
  }, createBoard());

  useInterval(() => {
    updatePosition();
    dispatch({ type: "update" });
  }, !gameOver ? 125 - (ROWS - activeRow)*0.4 : null);

  const updatePosition = () => {
    const leftPositions = Array.from(activeColumns, c => c - 1);
    const rightPositions = Array.from(activeColumns, c => c + 1);
    if (activeDirection === RIGHT) {
      if (activeColumns[activeColumns.length - 1] === COLUMNS - 1) {
        changeDirection(LEFT); // reached end of screen, go back
        setActiveColumns(leftPositions);
      } else {
        setActiveColumns(rightPositions);
      }
    } else if (activeDirection === LEFT) {
      if (activeColumns[0] === 0) {
        changeDirection(RIGHT);
        setActiveColumns(rightPositions);
      } else {
        setActiveColumns(leftPositions);
      }
    }
  }

  const userClick = () => {
    setActiveRow(activeRow - 1);
    if (activeRow > ROWS - 2) {
      setActiveBlocks(3);
    } else if (activeRow > ROWS - 5) {
      setActiveBlocks(2);
    } else {
      setActiveBlocks(1);
    }
    setActiveColumns(Array.from(activeColumns).slice(0, activeBlocks));
    if (activeRow === 0) {
      setGameOver(true);
      setActiveRow(ROWS);
      setActiveBlocks(3);
      alert('YOU WIN!');
    }
    if (activeRow < ROWS - 1) {
      for (let activeColumn of activeColumns) {
        if (board[activeRow][activeColumn] === ACTIVE && board[activeRow + 1][activeColumn] !== ACTIVE) {
          setGameOver(true);
          setActiveRow(ROWS);
          setActiveBlocks(3);
          setActiveColumns([0, 1, 2]);
          alert('YOU LOSE! BETTER LUCK NEXT TIME!');
          break;
        }
      }
    }
  }

  const resetGame = () => {
    setGameOver(false);
    dispatch({ type: "reset" });
  }

  return (
    <div onClick={() => userClick()}
      className="App">
      <h1 className="title">Stacker</h1>
      { gameOver ? <button onClick={() => resetGame()} className="restart">Restart</button> : null }
      {
        board.map((row, rowIndex) => {
          return (
            <div
              key={rowIndex}
              className="row"
            >
              {
                row.map((column, columnIndex) => {
                  return (
                    <div
                      key={`${rowIndex}-${columnIndex}`}
                      className="cell"
                      style={{ backgroundColor: column === ACTIVE ? 'red' : 'white' }}
                    >
                    </div>
                  );
                })
              }
            </div>
          )
        })
      }
    </div>
  );
}

export default App;
