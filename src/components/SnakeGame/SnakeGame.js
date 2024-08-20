'use client'

import { useEffect, useRef, useState } from "react";

export default function SnakeGame() {
    const canvasRef = useRef(null);
    const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
    const [food, setFood] = useState({ x: 15, y: 15 });
    const [bombs, setBombs] = useState([
        { x: 5, y: 5 },
        { x: 25, y: 25 }
    ]);
    const [direction, setDirection] = useState({ x: 1, y: 0 });
    const [speed, setSpeed] = useState(100);  // Slightly faster for smoother movement
    const [gameOver, setGameOver] = useState(false);
    const gridSize = 40;  // Larger grid size for smoother movement

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
            if (bombHit && newSnake.length > 1) {
                newSnake.pop();  // Decrease snake length by one segment
            }

            newSnake.unshift(head);

            // Check if snake has eaten the food
            if (head.x === food.x && head.y === food.y) {
                setFood({
                    x: Math.floor(Math.random() * gridSize),
                    y: Math.floor(Math.random() * gridSize)
                });

                // Add a new bomb when food is eaten
                setBombs([...bombs, {
                    x: Math.floor(Math.random() * gridSize),
                    y: Math.floor(Math.random() * gridSize)
                }]);

                setSpeed(speed => Math.max(speed - 2, 50));  // Small speed increase
            } else {
                newSnake.pop();
            }

            setSnake(newSnake);

            // Draw the snake
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.fillStyle = "blue";
            newSnake.forEach(segment => {
                context.fillRect(segment.x * 10, segment.y * 10, 10, 10);  // Smaller grid cells
            });

            // Draw the food
            context.fillStyle = "green";
            context.fillRect(food.x * 10, food.y * 10, 10, 10);  // Smaller food size

            // Draw the bombs
            context.fillStyle = "red";
            bombs.forEach(bomb => {
                context.fillRect(bomb.x * 10, bomb.y * 10, 10, 10);  // Bomb size
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
                width="400"
                height="400"
                className="border border-gray-500"
            />
            {gameOver && (
                <div className="mt-4 text-center">
                    <h2 className="text-2xl text-red-500">Game Over</h2>
                    <button
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                        onClick={() => {
                            setSnake([{ x: 10, y: 10 }]);
                            setFood({ x: 15, y: 15 });
                            setBombs([{ x: 5, y: 5 }, { x: 25, y: 25 }]);
                            setDirection({ x: 1, y: 0 });
                            setSpeed(100);  // Reset speed
                            setGameOver(false);
                        }}
                    >
                        Restart Game
                    </button>
                </div>
            )}
        </div>
    );
}
