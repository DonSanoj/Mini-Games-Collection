'use client'

import React, { useEffect, useRef, useState } from "react";

export default function SnakeGame() {
    const canvasRef = useRef(null);
    const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
    const [food, setFood] = useState({ x: 15, y: 15 });
    const [bombs, setBombs] = useState([{ x: 5, y: 5 }]);  // Start with one bomb
    const [direction, setDirection] = useState({ x: 1, y: 0 });
    const [speed, setSpeed] = useState(80);  // Adjusted for smoother movement
    const [gameOver, setGameOver] = useState(false);
    const [difficulty, setDifficulty] = useState(null);
    const [gameStarted, setGameStarted] = useState(false);

    const [gridSize, setGridSize] = useState(25);
    const [cellSize, setCellSize] = useState(15);
    const [maxBombs, setMaxBombs] = useState(6);

    //Time and marks
    const [startTime, setStartTime] = useState(null);
    const [marks, setMarks] = useState(0);

    const [hasWon, setHasWon] = useState(false);
    const [winningMarks, setWinningMarks] = useState(100);

    //Floating Status Box Start
    const [showFloatingBox, setShowFloatingBox] = useState(true);
    const [position, setPosition] = useState({ top: '20px', left: '20px' });
    const [dragging, setDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const handleMouseDown = (event) => {
        setDragging(true);
        setOffset({
            x: event.clientX - parseInt(position.left, 10),
            y: event.clientY - parseInt(position.top, 10)
        });
    };

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
    };

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
        };
    }, [dragging, offset]);
    //Floating Status Box End

    useEffect(() => {
        if (!gameStarted) return;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        const updateGame = () => {
            if (gameOver || hasWon) return;

            const newSnake = [...snake];
            const head = { ...newSnake[0] };
            head.x += direction.x;
            head.y += direction.y;

            // Check for collisions with walls, self, or bombs
            if (
                head.x < 0 ||
                head.x >= gridSize ||
                head.y < 0 ||
                head.y >= gridSize ||
                newSnake.some(segment => segment.x === head.x && segment.y === head.y)
            ) {
                setGameOver(true);
                return;
            }

            // Check if snake hits a bomb
            const bombHit = bombs.some(bomb => bomb.x === head.x && bomb.y === head.y);
            if (bombHit) {
                setGameOver(true);
                return;
            }

            newSnake.unshift(head);

            // Check if snake has eaten the food
            if (head.x === food.x && head.y === food.y) {
                setFood({
                    x: Math.floor(Math.random() * gridSize),
                    y: Math.floor(Math.random() * gridSize)
                });

                //Update marks
                setMarks(marks => {
                    const newMarks = marks + 2;
                    if (newMarks >= winningMarks) {
                        setHasWon(true);
                        setGameOver(true);
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    }
                    return newMarks;
                })

                // Generate new bombs
                const newBombs = [];
                const newBombCount = Math.min(bombs.length + 1, maxBombs);
                for (let i = 0; i < newBombCount; i++) {
                    newBombs.push({
                        x: Math.floor(Math.random() * gridSize),
                        y: Math.floor(Math.random() * gridSize)
                    });
                }
                setBombs(newBombs);

                setSpeed(speed => Math.max(speed - 2, 40));  // Slightly faster after eating food
            } else {
                newSnake.pop();
            }

            setSnake(newSnake);

            // Clear canvas and fill with background color
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.fillStyle = "#A8C9A7";
            context.fillRect(0, 0, canvas.width, canvas.height);

            // Draw the snake
            newSnake.forEach((segment, index) => {
                context.fillStyle = index === 0 ? "darkblue" : "blue"; // Different color for head
                context.fillRect(segment.x * cellSize, segment.y * cellSize, cellSize, cellSize);
                if (index === 0) {
                    context.fillStyle = "white"; // Add eyes for the snake head
                    context.fillRect(segment.x * cellSize + 3, segment.y * cellSize + 3, 2, 2); // Left eye
                    context.fillRect(segment.x * cellSize + 10, segment.y * cellSize + 3, 2, 2); // Right eye
                }
            });

            // Draw the food
            context.fillStyle = "red";
            context.beginPath();
            context.arc(food.x * cellSize + cellSize / 2, food.y * cellSize + cellSize / 2, cellSize / 2, 0, Math.PI * 2, false);
            context.closePath();
            context.fill();

            // Draw the apple stem
            context.fillStyle = "green";
            context.fillRect(food.x * cellSize + cellSize / 2 - 2, food.y * cellSize - 4, 4, 8); // Stem

            // Draw the bombs
            context.fillStyle = "black";
            bombs.forEach(bomb => {
                context.beginPath();
                context.arc(bomb.x * cellSize + cellSize / 2, bomb.y * cellSize + cellSize / 2, cellSize / 2, 0, 2 * Math.PI);
                context.fill();
            });
        };

        const intervalId = setInterval(updateGame, speed);

        return () => clearInterval(intervalId);
    }, [snake, direction, food, bombs, gameOver, speed, gridSize, cellSize, maxBombs, gameStarted]);

    const handleKeyDown = (e) => {
        switch (e.key) {
            case "ArrowUp":
                if (direction.y === 0) setDirection({ x: 0, y: -1 });
                break;
            case "ArrowDown":
                if (direction.y === 0) setDirection({ x: 0, y: 1 });
                break;
            case "ArrowLeft":
                if (direction.x === 0) setDirection({ x: -1, y: 0 });
                break;
            case "ArrowRight":
                if (direction.x === 0) setDirection({ x: 1, y: 0 });
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        if (gameStarted) {
            window.addEventListener("keydown", handleKeyDown);
            return () => window.removeEventListener("keydown", handleKeyDown);
        }
    }, [direction, gameStarted]);

    //Game Mode [Easy, Normal, Hard]
    const startGame = (selectedDifficulty) => {
        setDifficulty(selectedDifficulty);
        switch (selectedDifficulty) {
            case "easy":
                setGridSize(30);
                setCellSize(15);
                setMaxBombs(4);
                setWinningMarks(100);
                break;

            case "normal":
                setGridSize(25);
                setCellSize(18);
                setMaxBombs(6);
                setWinningMarks(50);
                break;

            case "hard":
                setGridSize(20);
                setCellSize(20);
                setMaxBombs(8);
                setWinningMarks(25)
                break;

            default:
                break;
        }

        setGameStarted(true);
        setStartTime(new Date());
    };

    //Calculate the elapsed time
    const getElapsedTime = () => {
        if (startTime) {
            const now = new Date();
            const diff = now - startTime;
            const seconds = Math.floor(diff / 1000);
            const minutes = Math.floor(seconds / 60);
            return `${minutes}m ${seconds % 60}s`
        }

        return "0s";
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            {!gameStarted ? (
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Select Difficulty:</h1>
                    <div className="flex flex-col space-y-2">
                        <button
                            className="px-4 py-2 bg-green-500 text-white rounded"
                            onClick={() => startGame("easy")}
                        >
                            Easy
                        </button>
                        <button
                            className="px-4 py-2 bg-yellow-500 text-white rounded"
                            onClick={() => startGame("normal")}
                        >
                            Normal
                        </button>
                        <button
                            className="px-4 py-2 bg-red-500 text-white rounded"
                            onClick={() => startGame("hard")}
                        >
                            Hard
                        </button>
                    </div>
                </div>
            ) : (
                <div>
                    <canvas
                        ref={canvasRef}
                        width={gridSize * cellSize}
                        height={gridSize * cellSize}
                        className="border border-gray-500"
                    />

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
                            <p><strong>Time Played:</strong> {getElapsedTime()}</p>
                            <p><strong>Game Mode:</strong> {difficulty ? difficulty.charAt(0).toUpperCase() + difficulty.slice(1) : "N/A"}</p>
                            <p><strong>Marks:</strong> {marks}</p>
                        </div>
                    )}

                    {hasWon ? (
                        <div className="absolute top-3 left-0 w-full flex items-center justify-center bg-opacity-50 z-30 transition-transform duration-700 ease-in-out transform">
                            <div className="p-3 bg-[#eee] border rounded-lg shadow-xl text-center flex flex-row gap-4 items-center justify-center">
                                <h2 className="text-lg text-green-500 font-bold">You Win!</h2>
                            </div>
                        </div>
                    ) : gameOver && (
                        <div className={`absolute top-3 left-0 w-full flex items-center justify-center bg-opacity-50 z-30 transition-transform duration-700 ease-in-out transform`}>
                            <div className="p-3 bg-[#eee] border rounded-lg shadow-xl text-center flex flex-row gap-4 items-center justify-center">
                                <h2 className="text-lg text-red-500">Game Over</h2>
                                <button
                                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                                    onClick={() => {
                                        setSnake([{ x: 10, y: 10 }]);
                                        setFood({ x: 15, y: 15 });
                                        setBombs([{ x: 5, y: 5 }]);  // Reset to one bomb
                                        setDirection({ x: 1, y: 0 });
                                        setSpeed(80);  // Reset speed
                                        setGameOver(false);
                                        setMarks(0);
                                        setStartTime(new Date());
                                    }}
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