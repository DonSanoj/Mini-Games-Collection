'use client'

import React, { useEffect, useState } from "react";
import {
    FaChessKing,
    FaChessQueen,
    FaChessRook,
    FaChessBishop,
    FaChessKnight,
    FaChessPawn,
} from "react-icons/fa6";
import { IoIosCloseCircle } from "react-icons/io";

const initialBoardSetup = () => {
    const emptyRow = Array(8).fill(null);
    return [
        ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
        Array(8).fill('P'),
        ...Array(4).fill(emptyRow),
        Array(8).fill('p'),
        ['r', 'n', 'b', 'k', 'q', 'b', 'n', 'r'],
    ]
}

export default function Chess() {

    const [board, setBoard] = useState(initialBoardSetup());
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [turn, setTurn] = useState('white');
    const [playerSide, setPlayerSide] = useState(null);
    const [gameStarted, setGameStarted] = useState(false);

    const [whiteTime, setWhiteTime] = useState(15 * 60); // 15 minutes in seconds
    const [blackTime, setBlackTime] = useState(15 * 60); // 15 minutes in seconds
    const [moveCount, setMoveCount] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    //Floating status Box start 
    const [showFloatingBox, setShowFloatingBox] = useState(true);
    const [position, setPosition] = useState({ top: '20px', left: '20px' });
    const [dragging, setDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const handleMouseDown = (event) => {
        setDragging(true);
        setOffset({
            x: event.clientX - parseInt(position.left, 10),
            y: event.clientY - parseInt(position.top, 10)
        })
    }

    const handleMouseMove = (event) => {
        if (dragging) {
            setPosition({
                top: `${event.clientY - offset.y}px`,
                left: `${event.clientX - offset.x}px`
            });
        }
    };

    const handleMouseUp = () => {
        setDragging(false);
    }

    React.useEffect(() => {
        if (dragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }
    }, [dragging, offset]);

    const floatingBoxClose = () => {
        setShowFloatingBox(false);
    }
    //Floating status Box end 

    const renderPiece = (piece) => {
        if (!piece) return null;

        const pieceIconMap = {
            'P': <FaChessPawn />,
            'N': <FaChessKnight />,
            'B': <FaChessBishop />,
            'R': <FaChessRook />,
            'Q': <FaChessQueen />,
            'K': <FaChessKing />,
            'p': <FaChessPawn />,
            'n': <FaChessKnight />,
            'b': <FaChessBishop />,
            'r': <FaChessRook />,
            'q': <FaChessQueen />,
            'k': <FaChessKing />,
        };

        const isWhite = piece.toUpperCase() === piece;
        const color = isWhite ? 'white' : 'black';

        return (
            <span style={{ color, fontSize: '2vw' }}>
                {pieceIconMap[piece]}
            </span>
        );
    };

    const handleCellClick = (rowIndex, colIndex) => {
        if (turn !== playerSide || gameOver) return;

        if (selectedPosition) {
            const [selectedRow, selectedCol] = selectedPosition;
            const newBoard = board.map(row => [...row]);
            newBoard[rowIndex][colIndex] = board[selectedRow][selectedCol];
            newBoard[selectedRow][selectedCol] = null;
            setBoard(newBoard);
            setSelectedPosition(null);
            setTurn(playerSide === 'white' ? 'black' : 'white');
            setMoveCount(moveCount + 1);
        } else {
            setSelectedPosition([rowIndex, colIndex]);
        }
    };

    const aiMove = () => {
        const opponentSide = playerSide === 'white' ? 'black' : 'white';
        const pieces = [];

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (board[row][col] && board[row][col] === (opponentSide === 'white' ? board[row][col].toUpperCase() : board[row][col].toLowerCase())) {
                    pieces.push({ row, col });
                }
            }
        }

        if (pieces.length === 0) return;

        const pieceToMove = pieces[Math.floor(Math.random() * pieces.length)];

        const emptySquares = [];
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (!board[row][col]) {
                    emptySquares.push({ row, col });
                }
            }
        }

        if (emptySquares.length === 0) return;

        const randomSquare = emptySquares[Math.floor(Math.random() * emptySquares.length)];

        const newBoard = board.map(row => [...row]);
        newBoard[randomSquare.row][randomSquare.col] = newBoard[pieceToMove.row][pieceToMove.col];
        newBoard[pieceToMove.row][pieceToMove.col] = null;

        setBoard(newBoard);
        setTurn(playerSide);
        setMoveCount(moveCount + 1);
    };

    useEffect(() => {
        if (turn !== playerSide && gameStarted && !gameOver) {
            setTimeout(aiMove, 1000);
        }
    }, [turn, gameStarted, gameOver]);

    useEffect(() => {
        let interval;

        if (gameStarted && !gameOver) {
            interval = setInterval(() => {
                if (turn === 'white') {
                    setWhiteTime(prevTime => Math.max(prevTime - 1, 0));
                } else {
                    setBlackTime(prevTime => Math.max(prevTime - 1, 0));
                }
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [gameStarted, turn, gameOver]);

    useEffect(() => {
        if (whiteTime === 0 || blackTime === 0) {
            // alert("Time's up! The game is a draw.");
            setGameOver(true);
            setShowFloatingBox(true);
        }
    }, [whiteTime, blackTime]);

    const startGame = (side) => {
        setPlayerSide(side);
        setGameStarted(true);
        if (side === 'black') {
            setTurn('white');
            setTimeout(aiMove, 1000);
        }
    };

    const handleRestart = () => {
        setBoard(initialBoardSetup());
        setWhiteTime(15 * 60);
        setBlackTime(15 * 60);
        setMoveCount(0);
        setGameStarted(false);
        setGameOver(false);
        setSelectedPosition(null);
    };

    const renderBoard = () => {
        const displayBoard = playerSide === 'black' ? board : [...board].reverse();
        return displayBoard.map((row, rowIndex) => (
            <div key={rowIndex} style={{ display: 'flex' }}>
                {row.map((piece, colIndex) => {
                    const actualRowIndex = playerSide === 'black' ? rowIndex : 7 - rowIndex;
                    const isWhiteSquare = (actualRowIndex + colIndex) % 2 === 0;
                    const isSelected =
                        selectedPosition &&
                        selectedPosition[0] === actualRowIndex &&
                        selectedPosition[1] === colIndex;

                    return (
                        <div
                            key={colIndex}
                            style={{
                                width: '10vh',
                                height: '10vh',
                                maxWidth: '80px',
                                maxHeight: '80px',
                                backgroundColor: isSelected ? '#9CDBA6' : isWhiteSquare ? '#d8c4ac' : '#836252',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                cursor: 'pointer',
                            }}
                            onClick={() => handleCellClick(actualRowIndex, colIndex)}
                        >
                            {renderPiece(piece)}
                        </div>
                    );
                })}
            </div>
        ));
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
        }}>
            {!gameStarted ? (
                <div className=" p-5 flex flex-col">
                    <h2 className=" font-bold text-xl pb-10">Select your side:</h2>
                    <button
                        onClick={() => startGame('white')}
                        className="bg-[#eee] hover:bg-blue-500 hover:text-white p-5 w-full text-xl rounded-lg mb-5"
                    >
                        Play as White
                    </button>
                    <button
                        onClick={() => startGame('black')}
                        className="bg-[#eee] hover:bg-blue-500 hover:text-white p-5 w-full text-xl rounded-lg"
                    >
                        Play as Black
                    </button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                    {renderBoard()}

                    {showFloatingBox && (
                        <div
                            style={{
                                position: 'fixed',
                                top: position.top,
                                left: position.left,
                                backgroundColor: '#fff',
                                borderRadius: '10px',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                padding: '15px',
                                zIndex: 1000,
                                width: '250px',
                                maxWidth: '300px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                cursor: dragging ? 'grabbing' : 'grab',
                                userSelect: 'none'
                            }}
                            onMouseDown={handleMouseDown}
                        >
                            <button
                                onClick={floatingBoxClose}
                                style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#333',
                                    fontSize: '20px'
                                }}
                            >
                                <IoIosCloseCircle />
                            </button>
                            <div className=" mt-5">
                                <p>White Time: {Math.floor(whiteTime / 60)}:{String(whiteTime % 60).padStart(2, '0')}</p>
                                <p>Black Time: {Math.floor(blackTime / 60)}:{String(blackTime % 60).padStart(2, '0')}</p>
                                <p>Move Count: {moveCount}</p>
                                {gameOver}
                            </div>
                        </div>
                    )}

                    {gameOver && (
                        <div className={`absolute top-3 left-0 w-full flex items-center justify-center bg-opacity-50 z-30 transition-transform duration-700 ease-in-out transform`}>
                            <div className="p-3 bg-black border rounded-lg shadow-xl text-center flex flex-row gap-4 items-center justify-center">
                                <div className=" flex flex-col text-white items-start">
                                    <h3 className=" font-semibold text-lg">Game Over</h3>
                                    <p className=" text-md">The game ended in a draw due to time running out.</p>
                                </div>
                                <button
                                    onClick={handleRestart} className="bg-blue-500 text-white p-3 rounded-lg"
                                >
                                    Restart Game
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            )}
        </div>
    );
}