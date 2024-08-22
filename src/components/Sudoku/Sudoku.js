'use client';

import { useState, useRef } from "react";

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

const solveSudoku = (board, callback, delay = 0) => {
    const findEmptyCell = (board) => {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    return [row, col];
                }
            }
        }
        return null;
    };

    const isValidMove = (board, row, col, num) => {
        for (let i = 0; i < 9; i++) {
            if (board[row][i] === num || board[i][col] === num) {
                return false;
            }
        }

        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
        for (let i = startRow; i < startRow + 3; i++) {
            for (let j = startCol; j < startCol + 3; j++) {
                if (board[i][j] === num) {
                    return false;
                }
            }
        }

        return true;
    };

    const solve = (board, callback) => {
        const emptyCell = findEmptyCell(board);
        if (!emptyCell) {
            callback(board);
            return true;
        }

        const [row, col] = emptyCell;

        for (let num = 1; num <= 9; num++) {
            if (isValidMove(board, row, col, num)) {
                board[row][col] = num;
                callback(board);  // Update the board after placing a number

                if (solve(board, callback)) {
                    return true;
                }

                board[row][col] = 0;
                callback(board);  // Update the board after backtracking
            }
        }

        return false;
    };

    const animatedSolve = (board, callback, delay) => {
        let i = 0;
        const steps = [];

        const recordStep = (board) => {
            steps.push(JSON.parse(JSON.stringify(board)));
        };

        const executeStep = () => {
            if (i < steps.length) {
                callback(steps[i]);
                i++;
                setTimeout(executeStep, delay);
            }
        };

        solve(board, recordStep);
        executeStep();
    };

    animatedSolve(board, callback, delay);
};

export default function Sudoku() {
    const [board, setBoard] = useState(initialBoard);
    const [invalidCells, setInvalidCells] = useState({});
    const [isBlocked, setIsBlocked] = useState(false);
    const cellRefs = useRef([...Array(9)].map(() => Array(9).fill(null)));

    const isValidMove = (board, row, col, num) => {
        // Check the row
        for (let i = 0; i < 9; i++) {
            if (board[row][i] === num && i !== col) return false;
        }

        // Check the column
        for (let i = 0; i < 9; i++) {
            if (board[i][col] === num && i !== row) return false;
        }

        // Check the 3x3 subgrid
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
        for (let i = startRow; i < startRow + 3; i++) {
            for (let j = startCol; j < startCol + 3; j++) {
                if (board[i][j] === num && i !== row && j !== col) return false;
            }
        }

        return true;
    };

    const handleInputChange = (row, col, value) => {
        const newBoard = [...board];
        const newInvalidCells = { ...invalidCells };

        if (value >= 1 && value <= 9) {
            newBoard[row][col] = value;

            // Validate the move
            if (isValidMove(newBoard, row, col, value)) {
                delete newInvalidCells[`${row}-${col}`];
                setIsBlocked(false);  // Unlock all cells
            } else {
                newInvalidCells[`${row}-${col}`] = true;
                setIsBlocked(true);  // Block all cells except the invalid one
            }
        } else {
            newBoard[row][col] = 0;
            delete newInvalidCells[`${row}-${col}`];
            setIsBlocked(false);  // Unlock all cells if cleared
        }

        setBoard(newBoard);
        setInvalidCells(newInvalidCells);

        // Check if the board is complete and valid
        if (Object.keys(newInvalidCells).length === 0 && isBoardComplete(newBoard)) {
            alert("You Win!");
            window.location.reload(); // Refresh the page
        }
    };

    const handleKeyDown = (e, row, col) => {
        if (e.key === "ArrowUp" && row > 0) {
            cellRefs.current[row - 1][col].focus();
        } else if (e.key === "ArrowDown" && row < 8) {
            cellRefs.current[row + 1][col].focus();
        } else if (e.key === "ArrowLeft" && col > 0) {
            cellRefs.current[row][col - 1].focus();
        } else if (e.key === "ArrowRight" && col < 8) {
            cellRefs.current[row][col + 1].focus();
        }
    };

    const isBoardComplete = (board) => {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0 || invalidCells[`${row}-${col}`]) {
                    return false;
                }
            }
        }
        return true;
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="p-4 bg-white shadow-lg rounded-lg">
                <div className="grid grid-cols-9 gap-1">
                    {board.map((row, rowIndex) =>
                        row.map((cell, colIndex) => (
                            <input
                                key={`${rowIndex}-${colIndex}`}
                                value={cell || ""}
                                onChange={(e) =>
                                    handleInputChange(
                                        rowIndex,
                                        colIndex,
                                        parseInt(e.target.value) || 0
                                    )
                                }
                                onKeyDown={(e) =>
                                    handleKeyDown(e, rowIndex, colIndex)
                                }
                                ref={(el) =>
                                    (cellRefs.current[rowIndex][colIndex] = el)
                                }
                                className={`w-10 h-10 text-center border border-gray-300 rounded-lg ${invalidCells[`${rowIndex}-${colIndex}`]
                                    ? "bg-red-200"
                                    : "bg-white"
                                    }`}
                                disabled={
                                    isBlocked && !invalidCells[`${rowIndex}-${colIndex}`]
                                } // Disable valid cells unless it's the invalid one
                            />
                        ))
                    )}
                </div>
                <button
                    onClick={() => {
                        solveSudoku([...board], setBoard);
                    }}
                    className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                >
                    Solve with Trixie
                </button>
            </div>
        </div>
    );
}