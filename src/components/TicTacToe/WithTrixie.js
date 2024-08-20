'use client'

import { useState, useEffect } from 'react';

export default function WithTrixie() {

    const [board, setBoard] = useState(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);
    const [player, setPlayer] = useState(null);
    const [opponent, setOpponent] = useState(null);
    const [winner, setWinner] = useState(null);

    useEffect(() => {
        if (player && !isXNext && !winner && !isBoardFull(board)) {
            const timeoutId = setTimeout(() => aiMove(), 500);
            return () => clearTimeout(timeoutId);
        }
    }, [isXNext, player, board, winner]);

    useEffect(() => {
        const gameWinner = calculateWinner(board);
        if (gameWinner) {
            setWinner(gameWinner);
        } else if (isBoardFull(board)) {
            setWinner('Draw');
        }
    }, [board]);

    const handleClick = (index) => {
        if (board[index] || winner || !player) return;

        const newBoard = [...board];
        newBoard[index] = isXNext ? player : opponent;
        setBoard(newBoard);
        setIsXNext(!isXNext);
    };

    const aiMove = () => {
        const newBoard = [...board];
        const availableMoves = newBoard
            .map((cell, index) => (cell === null ? index : null))
            .filter(val => val !== null);

        if (availableMoves.length === 0) return;

        const move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        newBoard[move] = isXNext ? player : opponent;
        setBoard(newBoard);
        setIsXNext(!isXNext);
    };

    const handlePlayerChoice = (choice) => {
        setPlayer(choice);
        setOpponent(choice === 'X' ? 'O' : 'X');
        setIsXNext(true);
        setWinner(null); // Reset winner
    };

    const handleRestart = () => {
        setBoard(Array(9).fill(null));
        setIsXNext(true);
        setPlayer(null);
        setOpponent(null);
        setWinner(null);
    };

    return (
        <div className="flex flex-col items-center mt-10">
            {!player ? (
                <div className="flex flex-col items-center">
                    <h2 className="text-5xl font-bold mb-4">Choose Your Symbol</h2>
                    <div className="flex space-x-4">
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded font-semibold text-4xl"
                            onClick={() => handlePlayerChoice('X')}
                        >
                            X
                        </button>
                        <button
                            className="px-4 py-2 bg-red-500 text-white rounded font-semibold text-4xl"
                            onClick={() => handlePlayerChoice('O')}
                        >
                            O
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-3 gap-2 w-64 mx-auto mt-6">
                        {board.map((cell, index) => (
                            <button
                                key={index}
                                className="w-20 h-20 text-3xl font-bold flex items-center justify-center bg-white border-2 border-gray-400"
                                onClick={() => handleClick(index)}
                            >
                                {cell}
                            </button>
                        ))}
                    </div>
                    <div className="mt-4 text-xl">
                        {winner
                            ? winner === 'Draw'
                                ? "Match is Draw!"
                                : `Winner: ${winner}`
                            : `Next Player: ${isXNext ? player : opponent}`}
                    </div>
                    {winner && (
                        <button
                            className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
                            onClick={handleRestart}
                        >
                            Start Again
                        </button>
                    )}
                </>
            )}
        </div>
    );
}

function calculateWinner(board) {
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
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
}

function isBoardFull(board) {
    return board.every(cell => cell !== null);
}
