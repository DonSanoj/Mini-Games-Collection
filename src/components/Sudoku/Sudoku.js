'use client'

import { useState } from "react";

const initialBoard = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9],
];

export default function Sudoku() {

    const [board, setBoard] = useState(initialBoard);

    const handleInputChange = (row, col, value) => {
        const newBoard = [...board];
        if (value >= 1 && value <= 9) {
            newBoard[row][col] = value;
        } else {
            newBoard[row][col] = 0;
        }

        setBoard(newBoard);
    };

    const checkBoard = () => {
        console.log(board);
    }

    return (
        <div className=" flex justify-center items-center min-h-screen bg-gray-100">
            <div className=" p-4 bg-white shadow-lg rounded-lg">
                <div className=" grid grid-cols-9 gap-1">
                    {board.map((row, rowIndex) =>
                        row.map((cell, colIndex) => (
                            <input
                                key={`${rowIndex}-${colIndex}`}
                                type="number"
                                min="1"
                                max="9"
                                value={cell || ""}
                                onChange={(e) =>
                                    handleInputChange(rowIndex, colIndex, parseInt(e.target.value) || 0)
                                }
                                className="w-10 h-10 text-center border border-gray-300 rounded-lg"
                            />
                        ))
                    )}
                </div>

                <button
                    onClick={checkBoard}
                    className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                >
                    Check Board
                </button>

            </div>
        </div>
    );
}