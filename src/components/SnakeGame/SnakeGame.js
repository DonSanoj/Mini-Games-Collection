'use client'

import { useEffect, useRef, useState } from "react";

export default function SnakeGame() {
    const canvasRef = useRef(null);
    const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
    const [food, setFood] = useState({ x: 15, y: 15 });
    const [bombs, setBombs] = useState([{ x: 5, y: 5 }]);  // Start with one bomb
    const [direction, setDirection] = useState({ x: 1, y: 0 });
    const [speed, setSpeed] = useState(80);  // Adjusted for smoother movement
    const [gameOver, setGameOver] = useState(false);
    const gridSize = 25;
    const cellSize = 15;  // Increased cell size for larger snake, food, and bombs
    const maxBombs = 7;

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        const updateGame = () => {
            if (gameOver) return;

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
            context.fillStyle = "green";
            context.fillRect(0, 0, canvas.width, canvas.height);

            // Draw the snake
            context.fillStyle = "blue";
            newSnake.forEach(segment => {
                context.fillRect(segment.x * cellSize, segment.y * cellSize, cellSize, cellSize);
            });

            // Draw the food
            context.fillStyle = "yellow";
            context.fillRect(food.x * cellSize, food.y * cellSize, cellSize, cellSize);

            // Draw the bombs
            context.fillStyle = "red";
            bombs.forEach(bomb => {
                context.fillRect(bomb.x * cellSize, bomb.y * cellSize, cellSize, cellSize);
            });
        };

        const intervalId = setInterval(updateGame, speed);

        return () => clearInterval(intervalId);
    }, [snake, direction, food, bombs, gameOver, speed]);

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
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [direction]);

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <canvas
                ref={canvasRef}
                width={gridSize * cellSize}  // Larger canvas size to accommodate larger grid cells
                height={gridSize * cellSize}
                className="border border-gray-500"
            />
            {gameOver && (
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
                            }}
                        >
                            Restart Game
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
