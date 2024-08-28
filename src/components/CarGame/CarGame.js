'use client';

import { useRef, useEffect, useState } from 'react';

export default function CarGame() {

    const [carPosition, setCarPosition] = useState({ x: 50, y: 50 });
    const [obstaclePosition, setObstaclePosition] = useState({ x: 0, y: 0 });
    const [isCollision, setIsCollision] = useState(false);

    //Function to generate random position for the obstacle
    const generateRandomPosition = () => {
        const x = Math.floor(Math.random() * 27) * 10; // Multiplying by 10 to align with the grid
        const y = Math.floor(Math.random() * 27) * 10;

        return { x, y };
    };

    //Function to check for collision
    const checkCollision = (carPos, obstaclePos) => {
        return (
            carPos.x < obstaclePos.x + 30 &&
            carPos.x + 30 > obstaclePos.x &&
            carPos.y < obstaclePos.y + 30 &&
            carPos.y + 50 > obstaclePos.y
        );
    }

    useEffect(() => {

        //Set random position for the obstacle when the component mounts
        setObstaclePosition(generateRandomPosition());

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

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };

    }, []);

    useEffect(() => {
        if (checkCollision(carPosition, obstaclePosition)) {
            setIsCollision(true);
            // alert("Collision detected");
            window.location.reload();
        } else {
            setIsCollision(false);
        }
    }, [carPosition]);

    return (
        <div className="flex justify-center items-center h-screen bg-gray-200">
            <div className=' relative w-72 h-72 bg-gray-400 border-4 border-black'>
                <div
                    className={`absolute w-8 h-12 rounded ${isCollision ? 'bg-yellow-500' : 'bg-blue-500'
                        }`}
                    style={{ top: carPosition.y, left: carPosition.x }}
                />
                <div
                    className="absolute w-8 h-8 bg-red-500 rounded"
                    style={{ top: obstaclePosition.y, left: obstaclePosition.x }}
                />
            </div>
        </div>
    );
}
