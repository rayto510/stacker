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
  const [activeColumn, setActiveColumn] = useState(Math.floor(Math.random() * COLUMNS));
  const [activeDirection, changeDirection] = useState(RIGHT);
  const [gameOver, setGameOver] = useState(false);
  const [board, dispatch] = useReducer((board, action) => {
    switch (action.type) {
      case "update":
        return board.map((row, index) => index === activeRow ? row.map((cell, i) => i === activeColumn ? ACTIVE : EMPTY ) : row);
      default:
        break;
    }
  }, createBoard());

  useInterval(() => {
    updatePosition();
    dispatch({ type: "update" });
  }, !gameOver ? 125 : null);

  const updatePosition = () => {
    if (activeDirection === RIGHT) {
      if (activeColumn === COLUMNS - 1) {
        changeDirection(LEFT); // reached end of screen, go back
        setActiveColumn(activeColumn - 1);
      } else {
        setActiveColumn(activeColumn + 1);
      }
    } else if (activeDirection === LEFT) {
      if (activeColumn === 0) {
        changeDirection(RIGHT);
        setActiveColumn(activeColumn + 1);
      } else {
        setActiveColumn(activeColumn - 1);
      }
    }
  }

  const userClick = () => {
    setActiveRow(activeRow - 1);
    if (activeRow === 0) {
      setGameOver(true);
      alert('YOU WIN!');
    }
    if (activeRow < ROWS - 1 && board[activeRow][activeColumn] === ACTIVE && board[activeRow + 1][activeColumn] !== ACTIVE) {
      setGameOver(true);
      alert('YOU LOSE! BETTER LUCK NEXT TIME!');
    }
  }

  return (
    <div onClick={() => userClick()}
      className="App">
      <h1 className="title">Stacker</h1>
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
