'use client'

import { useState, useEffect } from 'react';

const createTiles = () => {
    const tileImages = [];
    for (let i = 1; i <= 9; i++) {
        for (let j = 0; j < 4; j++) {
            // tiles.push(i);
            tileImages.push(`/tiles/${i}.png`)
        }
    }
    return tileImages;
};

const shuffleTiles = (tiles) => {
    for (let i = tiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }
    return tiles;
};

const Tile = ({ tileImage, number, onClick, isSelected }) => (
    <div
        onClick={onClick}
        style={{
            width: '50px',
            height: '70px',
            backgroundColor: '#b5651d',
            color: '#fff',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '5px',
            fontSize: '24px',
            cursor: 'pointer',
            borderRadius: '5px',
            boxShadow: '2px 2px 5px rgba(0,0,0,0.3)',
            transform: isSelected ? 'scale(1.1)' : 'scale(1)',
            transition: 'transform 0.2s, box-shadow 0.2s',
        }}
    >
        {/* {number} */}
        <img
            src={tileImage}
            alt='Mahjong Tile'
            style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '5px',
            }}
        />
    </div>
);

export default function Mahjong() {
    const [tiles, setTiles] = useState([]);
    const [selectedTiles, setSelectedTiles] = useState([]);

    useEffect(() => {
        const newTiles = shuffleTiles(createTiles());
        setTiles(newTiles);
    }, []);

    const handleTileClick = (index) => {
        if (selectedTiles.length === 2) {
            setSelectedTiles([index]);
        } else {
            const newSelectedTiles = [...selectedTiles, index];
            setSelectedTiles(newSelectedTiles);

            if (newSelectedTiles.length === 2) {
                const [firstIndex, secondIndex] = newSelectedTiles;
                if (tiles[firstIndex] === tiles[secondIndex]) {
                    const newTiles = [...tiles];
                    newTiles[firstIndex] = null;
                    newTiles[secondIndex] = null;
                    setTiles(newTiles);
                }

                setTimeout(() => {
                    setSelectedTiles([]);
                }, 500);
            }
        }
    };

    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(9, 60px)',
                gap: '10px',
                justifyContent: 'center',
                marginTop: '50px',
            }}
        >
            {tiles.map((tileImage, index) =>
                tileImage !== null ? (
                    <Tile
                        key={index}
                        // number={tile}
                        tileImage={tileImage}
                        onClick={() => handleTileClick(index)}
                        isSelected={selectedTiles.includes(index)}
                    />
                ) : (
                    <div key={index} style={{ width: '50px', height: '70px' }} />
                )
            )}
        </div>
    );
}
