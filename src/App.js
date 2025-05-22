import { useState } from "react";

function Square({ value, onSquareClick, className }) {
  return (
    <button className={className} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    const nextSquares = squares.slice();

    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }

    const x = i % 3;
    const y = Math.floor(i / 3);
    onPlay(nextSquares, x, y);
  }

  const winnerData = calculateWinner(squares);
  const winner = winnerData?.winner;
  const squaresWins = winnerData?.line;
  const isDraw = !winner && squares.every((square) => square !== null);

  const status = winner
    ? `Winner: ${winner}`
    : isDraw
    ? "Draw!"
    : `Next player: ${xIsNext ? "X" : "O"}`;

  const rows = [];
  for (let i = 0; i < squares.length; i += 3) {
    const grupo = squares.slice(i, i + 3).map((val, j) => ({
      index: i + j,
      value: val,
    }));
    rows.push(grupo);
  }

  const board = [0, 1, 2].map((row) => (
    <div key={row} className="board-row">
      {[0, 1, 2].map((col) => {
        const index = row * 3 + col;
        return (
          <Square
            key={index}
            value={squares[index]}
            onSquareClick={() => handleClick(index)}
            className={squaresWins?.includes(index) ? "square win" : "square"}
          />
        );
      })}
    </div>
  ));

  return (
    <>
      <div className="status">{status}</div>

      {board}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [location, setLocation] = useState([]);

  function handlePlay(nextSquares, x, y) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    const nextLocation = [...location.slice(0, currentMove + 1), `(${x},${y})`];
    setLocation(nextLocation);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    const winnerData = calculateWinner(squares);
    const winner = winnerData?.winner;
    const isDraw = !winner && squares.every((square) => square !== null);
    if (move > 0 && move != currentMove) {
      description = "Go to move #" + move + " location: " + location[move];
    } else if (move == currentMove && (winnerData || isDraw)) {
      description = "Game finished location: " + location[move];
    } else if (move > 0 && move == currentMove) {
      description = "";
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        {description ? (
          <button onClick={() => jumpTo(move)}>{description}</button>
        ) : (
          <span>
            <strong>You are at move #{move}</strong>
          </span>
        )}
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}
