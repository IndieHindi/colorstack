'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { useGame } from '../context/GameContext';
import { Color, GameDifficulty } from '../types';
import { createColorBlock } from '../utils/gameUtils';
import Tube from './Tube';
import Pattern from './Pattern';
import ColorPalette from './ColorPalette';

const GameUI: React.FC = () => {
    const { state, dispatch } = useGame();
    const [showConfetti, setShowConfetti] = useState(false);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
    const [prevScore, setPrevScore] = useState(0);

    // Update window size for confetti
    useEffect(() => {
        const updateWindowSize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        updateWindowSize();
        window.addEventListener('resize', updateWindowSize);

        return () => window.removeEventListener('resize', updateWindowSize);
    }, []);

    // Show confetti when score increases
    useEffect(() => {
        if (state.score > prevScore) {
            setShowConfetti(true);
            const timer = setTimeout(() => setShowConfetti(false), 3000);
            setPrevScore(state.score);

            return () => clearTimeout(timer);
        }
    }, [state.score, prevScore]);

    // Handle color selection
    const handleColorSelect = (color: Color) => {
        if (state.isGameOver || state.isPaused) return;

        const mainTube = state.tubes[0];
        if (!mainTube) return;

        const newBlock = createColorBlock(color);
        dispatch({
            type: 'ADD_BLOCK_TO_TUBE',
            payload: { tubeId: mainTube.id, block: newBlock },
        });
    };

    // Handle tube click (remove top block)
    const handleTubeClick = (tubeId: string) => {
        if (state.isGameOver || state.isPaused) return;

        dispatch({
            type: 'REMOVE_TOP_BLOCK',
            payload: { tubeId },
        });
    };

    // Handle block drop
    const handleBlockDrop = (blockId: string) => {
        // This would be implemented for multi-tube gameplay
        // For now, we're just using the color palette to add blocks
    };

    // Start a new game
    const startGame = (difficulty: GameDifficulty) => {
        dispatch({
            type: 'START_GAME',
            payload: { difficulty },
        });
    };

    // Format time remaining
    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="relative min-h-screen bg-gradient-to-b from-indigo-900 via-purple-800 to-pink-800 text-white">
            {showConfetti && (
                <Confetti
                    width={windowSize.width}
                    height={windowSize.height}
                    recycle={false}
                    numberOfPieces={200}
                />
            )}

            <div className="container mx-auto px-4 py-8">
                {/* Game header */}
                <motion.div
                    className="flex justify-between items-center mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div>
                        <h1 className="text-3xl font-bold">ColorStack</h1>
                        <p className="text-gray-300">Level: {state.level.id}</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="bg-gray-800 bg-opacity-50 p-2 rounded-lg">
                            <p className="text-sm">Time</p>
                            <p className="text-xl font-bold">{formatTime(state.timeRemaining)}</p>
                        </div>

                        <div className="bg-gray-800 bg-opacity-50 p-2 rounded-lg">
                            <p className="text-sm">Score</p>
                            <p className="text-xl font-bold">{state.score}</p>
                        </div>
                    </div>
                </motion.div>

                {/* Game content */}
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Patterns section */}
                    <motion.div
                        className="w-full md:w-1/4 flex flex-col gap-4"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <h2 className="text-xl font-semibold">Target Patterns</h2>
                        <div className="flex flex-col gap-4">
                            {state.level.patterns.map((pattern, index) => (
                                <Pattern key={index} pattern={pattern} index={index} />
                            ))}
                        </div>
                    </motion.div>

                    {/* Game area */}
                    <div className="w-full md:w-2/4 flex flex-col items-center justify-between gap-8">
                        {/* Tube */}
                        <div className="flex justify-center">
                            {state.tubes.map(tube => (
                                <Tube
                                    key={tube.id}
                                    tube={tube}
                                    onTubeClick={() => handleTubeClick(tube.id)}
                                    onBlockDrop={handleBlockDrop}
                                />
                            ))}
                        </div>

                        {/* Color palette */}
                        <ColorPalette
                            availableColors={state.level.availableColors}
                            onColorSelect={handleColorSelect}
                        />
                    </div>

                    {/* Game controls */}
                    <motion.div
                        className="w-full md:w-1/4 flex flex-col gap-4"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <h2 className="text-xl font-semibold">Game Controls</h2>
                        <div className="bg-gray-800 bg-opacity-40 p-4 rounded-lg">
                            {state.isGameOver ? (
                                <div className="flex flex-col gap-3">
                                    <h3 className="text-lg font-semibold">
                                        {state.level.id === 0 ? 'Start New Game' : 'Game Over'}
                                    </h3>

                                    {state.level.id > 0 && (
                                        <p className="text-gray-300">Final Score: {state.score}</p>
                                    )}

                                    <button
                                        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
                                        onClick={() => startGame(GameDifficulty.EASY)}
                                    >
                                        Easy
                                    </button>

                                    <button
                                        className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg transition-colors"
                                        onClick={() => startGame(GameDifficulty.MEDIUM)}
                                    >
                                        Medium
                                    </button>

                                    <button
                                        className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
                                        onClick={() => startGame(GameDifficulty.HARD)}
                                    >
                                        Hard
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    <h3 className="text-lg font-semibold">
                                        {state.isPaused ? 'Game Paused' : 'Game Controls'}
                                    </h3>

                                    {state.isPaused ? (
                                        <button
                                            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
                                            onClick={() => dispatch({ type: 'RESUME_GAME' })}
                                        >
                                            Resume Game
                                        </button>
                                    ) : (
                                        <button
                                            className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg transition-colors"
                                            onClick={() => dispatch({ type: 'PAUSE_GAME' })}
                                        >
                                            Pause Game
                                        </button>
                                    )}

                                    <button
                                        className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
                                        onClick={() => dispatch({ type: 'RESET_GAME' })}
                                    >
                                        End Game
                                    </button>
                                </div>
                            )}

                            <div className="mt-6">
                                <h3 className="text-lg font-semibold mb-2">How to Play</h3>
                                <ul className="text-sm text-gray-300 list-disc pl-5 space-y-1">
                                    <li>Drag colors from the palette to the tube</li>
                                    <li>Match the target patterns shown on the left</li>
                                    <li>Click the top block in the tube to remove it</li>
                                    <li>Complete patterns before time runs out</li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default GameUI; 