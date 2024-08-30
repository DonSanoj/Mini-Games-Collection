'use client'

import { useState } from "react";
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

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
        }}>
            {!gameStarted ? (
                <div>

                </div>
            ) : (
                <div>

                </div>
            )}
        </div>
    );
}