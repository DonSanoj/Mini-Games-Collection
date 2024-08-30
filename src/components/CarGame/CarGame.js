'use client';

import { useEffect, useState } from 'react';

export default function CarGame() {
    const [carPosition, setCarPosition] = useState({ x: 130, y: 250 });
    const [obstacles, setObstacles] = useState([]);
    const [isCollision, setIsCollision] = useState(false);

    // Function to generate a random position for the obstacle
    const generateRandomPosition = () => {
        const x = Math.floor(Math.random() * 27) * 10; // x position is fixed once generated
        const y = 0; // Start from the top of the screen
        return { x, y };
    };

    // Function to check for collision
    const checkCollision = (carPos, obstaclePos) => {
        return (
            carPos.x < obstaclePos.x + 30 &&
            carPos.x + 30 > obstaclePos.x &&
            carPos.y < obstaclePos.y + 30 &&
            carPos.y + 50 > obstaclePos.y
        );
    };

    // Move obstacles downwards
    const moveObstacles = () => {
        setObstacles(prevObstacles => {
            return prevObstacles
                .map(obstacle => ({
                    x: obstacle.x, // Keep the x position fixed
                    y: obstacle.y + 10, // Move the obstacle down by 10 pixels
                }))
                .filter(obstacle => obstacle.y < 290); // Remove obstacles that move off the screen
        });
    };

    useEffect(() => {
        // Set initial random positions for multiple obstacles
        const initialObstacles = Array.from({ length: 5 }, () => generateRandomPosition());
        setObstacles(initialObstacles);

        const handleKeyDown = (event) => {
            const { key } = event;

            setCarPosition((prev) => {
                const newPosition = { ...prev };
                if (key === 'ArrowUp') newPosition.y = Math.max(prev.y - 10, 0);
                if (key === 'ArrowDown') newPosition.y = Math.min(prev.y + 10, 290);
                if (key === 'ArrowLeft') newPosition.x = Math.max(prev.x - 10, 0);
                if (key === 'ArrowRight') newPosition.x = Math.min(prev.x + 10, 290);

                return newPosition;
            });
        };

        window.addEventListener('keydown', handleKeyDown);

        const obstacleInterval = setInterval(() => {
            moveObstacles();

            // Randomly generate new obstacles if fewer than 10 are present
            if (obstacles.length < 10) {
                setObstacles(prevObstacles => [
                    ...prevObstacles,
                    generateRandomPosition(),
                ]);
            }
        }, 100); // Adjusted obstacle movement speed

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            clearInterval(obstacleInterval);
        };
    }, [obstacles]);

    useEffect(() => {
        // Check for collisions with any of the obstacles
        for (let obstacle of obstacles) {
            if (checkCollision(carPosition, obstacle)) {
                setIsCollision(true);
                window.location.reload(); // Restart the game on collision
                break;
            }
        }
    }, [carPosition, obstacles]);

    return (
        <div className="flex justify-center items-center h-screen bg-gray-200">
            <div className="relative w-72 h-72 bg-gray-400 border-4 border-black overflow-hidden">
                <div
                    className={`absolute w-8 h-12 rounded ${isCollision ? 'bg-yellow-500' : 'bg-blue-500'
                        }`}
                    style={{ top: carPosition.y, left: carPosition.x }}
                />
                {obstacles.map((obstacle, index) => (
                    <div
                        key={index}
                        className="absolute w-8 h-8 bg-red-500 rounded"
                        style={{ top: obstacle.y, left: obstacle.x }}
                    />
                ))}
            </div>
        </div>
    );
}
