'use client'

import WithFriends from "@/components/TicTacToe/WithFriends";
import WithTrixie from "@/components/TicTacToe/WithTrixie";
import Link from "next/link";
import { useState } from "react";

export default function ticTacToe() {

    const [gameMode, setGameMode] = useState(null);

    const handleGameModeChange = (mode) => {
        setGameMode(mode);
    }

    return (
        <div className="flex flex-col items-center justify-center mt-10">
            {gameMode === null ? (
                <div className="flex flex-col items-center justify-center">
                    <h2 className="text-6xl font-bold mb-8">Choose Game Mode</h2>
                    <div className="flex space-x-4">
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded text-3xl"
                            onClick={() => handleGameModeChange('AI')}
                        >
                            Play with Trixie
                        </button>
                        <button
                            className="px-4 py-2 bg-green-500 text-white rounded text-3xl"
                            onClick={() => handleGameModeChange('Friend')}
                        >
                            Play with Friends
                        </button>
                    </div>

                    <Link
                        href={'/'}
                        className="mt-6 px-4 py-2 bg-[#eee] text-black rounded text-xl"
                    >
                        Go Back
                    </Link>
                </div>
            ) : gameMode === 'AI' ? (
                <WithTrixie />
            ) : (
                <WithFriends />
            )}
        </div>
    );
}