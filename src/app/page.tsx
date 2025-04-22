'use client';
import { useState, useEffect } from 'react';

const initialBoard = Array(9).fill(null);

export default function Home() {
  const [board, setBoard] = useState<(string | null)[]>(initialBoard);
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);
  const [mode, setMode] = useState<'pvp' | 'ai'>('pvp');

  useEffect(() => {
    const win = calculateWinner(board);
    if (win) {
      setWinner(win);
      setTimeout(() => {
        alert(`🎉 Winner: ${win}`);
      }, 100);
    } else if (board.every(Boolean)) {
      setWinner('Draw');
      setTimeout(() => {
        alert('😅 It\'s a draw!');
      }, 100);
    }

    // If playing with AI and it's AI's turn
    if (mode === 'ai' && !isXNext && !win && !board.every(Boolean)) {
      const bestMove = findBestMove(board);
      if (bestMove !== -1) {
        const newBoard = board.slice();
        newBoard[bestMove] = 'O';
        setTimeout(() => {
          setBoard(newBoard);
          setIsXNext(true);
        }, 500);
      }
    }
  }, [board, isXNext, mode]);

  const handleClick = (index: number) => {
    if (board[index] || winner || (mode === 'ai' && !isXNext)) return;
    const newBoard = board.slice();
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const resetGame = () => {
    setBoard(initialBoard);
    setIsXNext(true);
    setWinner(null);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-4">Tic-Tac-Toe</h1>

      <select
        value={mode}
        onChange={(e) => {
          setMode(e.target.value as 'pvp' | 'ai');
          resetGame();
        }}
        className="mb-4 p-2 rounded bg-gray-800 text-white"
      >
        <option value="pvp">👥 2 Players</option>
        <option value="ai">🤖 Play vs AI</option>
      </select>

      <div className="grid grid-cols-3 gap-2">
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className="w-24 h-24 text-3xl font-bold bg-gray-700 hover:bg-gray-600 flex items-center justify-center rounded"
          >
            {cell}
          </button>
        ))}
      </div>

      <div className="mt-4 text-xl">
        {winner
          ? winner === 'Draw'
            ? '😅 It\'s a draw!'
            : `🎉 Winner: ${winner}`
          : `Next turn: ${isXNext ? 'X' : 'O'}`}
      </div>

      <button
        onClick={resetGame}
        className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded"
      >
        Restart
      </button>
    </main>
  );
}

// Determine winner
// Determine winner
function calculateWinner(squares: (string | null)[]) {
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
  for (const [a, b, c] of lines) {  // Change `let` to `const`
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}


// AI (Minimax)
function findBestMove(board: (string | null)[]) {
  let bestScore = -Infinity;  // Use let instead of const
  let move = -1;

  for (let i = 0; i < board.length; i++) {
    if (!board[i]) {
      board[i] = 'O';
      const score = minimax(board, 0, false);
      board[i] = null;
      if (score > bestScore) {
        bestScore = score;  // Reassign bestScore here
        move = i;
      }
    }
  }
  return move;
}

function minimax(board: (string | null)[], depth: number, isMaximizing: boolean): number {
  const winner = calculateWinner(board);
  if (winner === 'O') return 10 - depth;
  if (winner === 'X') return depth - 10;
  if (board.every(Boolean)) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;  // Use let instead of const
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        board[i] = 'O';
        const score = minimax(board, depth + 1, false);
        board[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;  // Use let instead of const
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        board[i] = 'X';
        const score = minimax(board, depth + 1, true);
        board[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}
