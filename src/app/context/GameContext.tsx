'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import {
    GameState,
    Level,
    Tube,
    ColorBlock,
    Pattern,
    GameDifficulty
} from '../types';
import {
    createTube,
    generateLevel,
    addBlockToTube,
    removeTopBlock,
    checkPatternMatch,
    removeMatchedPattern,
    calculateScore,
    createColorBlock,
    shufflePatterns
} from '../utils/gameUtils';

// Define action types
type GameAction =
    | { type: 'START_GAME'; payload: { difficulty: GameDifficulty } }
    | { type: 'RESET_GAME' }
    | { type: 'PAUSE_GAME' }
    | { type: 'RESUME_GAME' }
    | { type: 'ADD_BLOCK_TO_TUBE'; payload: { tubeId: string; block: ColorBlock } }
    | { type: 'REMOVE_TOP_BLOCK'; payload: { tubeId: string } }
    | { type: 'CHECK_PATTERN_MATCHES' }
    | { type: 'TICK_TIMER' }
    | { type: 'NEXT_LEVEL' }
    | { type: 'SHUFFLE_PATTERNS' };

// Initial game state
const initialGameState: GameState = {
    level: {
        id: 0,
        patterns: [],
        availableColors: [],
        tubeCapacity: 0,
        timeLimit: 0,
    },
    tubes: [],
    score: 0,
    timeRemaining: 0,
    isGameOver: true,
    isPaused: false,
};

// Game reducer
const gameReducer = (state: GameState, action: GameAction): GameState => {
    switch (action.type) {
        case 'START_GAME': {
            const level = generateLevel(1, action.payload.difficulty);
            const mainTube = createTube(level.tubeCapacity);

            return {
                ...state,
                level,
                tubes: [mainTube],
                score: 0,
                timeRemaining: level.timeLimit,
                isGameOver: false,
                isPaused: false,
            };
        }

        case 'RESET_GAME':
            return initialGameState;

        case 'PAUSE_GAME':
            return {
                ...state,
                isPaused: true,
            };

        case 'RESUME_GAME':
            return {
                ...state,
                isPaused: false,
            };

        case 'ADD_BLOCK_TO_TUBE': {
            const { tubeId, block } = action.payload;
            const updatedTubes = state.tubes.map(tube => {
                if (tube.id === tubeId) {
                    const updatedTube = addBlockToTube(tube, block);
                    return updatedTube || tube;
                }
                return tube;
            });

            return {
                ...state,
                tubes: updatedTubes,
            };
        }

        case 'REMOVE_TOP_BLOCK': {
            const { tubeId } = action.payload;
            const updatedTubes = state.tubes.map(tube => {
                if (tube.id === tubeId) {
                    const { updatedTube } = removeTopBlock(tube);
                    return updatedTube;
                }
                return tube;
            });

            return {
                ...state,
                tubes: updatedTubes,
            };
        }

        case 'CHECK_PATTERN_MATCHES': {
            let updatedTubes = [...state.tubes];
            let additionalScore = 0;
            let patternMatched = false;

            // Check each tube against each pattern
            state.tubes.forEach((tube, tubeIndex) => {
                state.level.patterns.forEach(pattern => {
                    if (checkPatternMatch(tube, pattern)) {
                        // Pattern matched! Remove the matched blocks and add score
                        updatedTubes[tubeIndex] = removeMatchedPattern(tube, pattern.colors.length);
                        additionalScore += pattern.colors.length * 10;
                        patternMatched = true;
                    }
                });
            });

            if (!patternMatched) {
                return state;
            }

            // If a pattern was matched, shuffle the patterns
            const shuffledLevel = shufflePatterns(state.level);

            return {
                ...state,
                tubes: updatedTubes,
                score: state.score + additionalScore,
                level: shuffledLevel,
            };
        }

        case 'TICK_TIMER': {
            if (state.isPaused || state.isGameOver) {
                return state;
            }

            const newTimeRemaining = state.timeRemaining - 1;

            if (newTimeRemaining <= 0) {
                return {
                    ...state,
                    timeRemaining: 0,
                    isGameOver: true,
                };
            }

            return {
                ...state,
                timeRemaining: newTimeRemaining,
            };
        }

        case 'NEXT_LEVEL': {
            const nextLevelNumber = state.level.id + 1;
            const difficulty =
                nextLevelNumber <= 5 ? GameDifficulty.EASY :
                    nextLevelNumber <= 10 ? GameDifficulty.MEDIUM :
                        GameDifficulty.HARD;

            const nextLevel = generateLevel(nextLevelNumber, difficulty);
            const levelScore = calculateScore(state.timeRemaining, state.level.id);

            return {
                ...state,
                level: nextLevel,
                tubes: [createTube(nextLevel.tubeCapacity)],
                score: state.score + levelScore,
                timeRemaining: nextLevel.timeLimit,
            };
        }

        case 'SHUFFLE_PATTERNS': {
            const shuffledLevel = shufflePatterns(state.level);
            return {
                ...state,
                level: shuffledLevel,
            };
        }

        default:
            return state;
    }
};

// Create the context
interface GameContextType {
    state: GameState;
    dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Create a provider component
interface GameProviderProps {
    children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(gameReducer, initialGameState);

    // Set up the game timer
    useEffect(() => {
        if (state.isGameOver || state.isPaused) {
            return;
        }

        const timerId = setInterval(() => {
            dispatch({ type: 'TICK_TIMER' });
        }, 1000);

        return () => clearInterval(timerId);
    }, [state.isGameOver, state.isPaused]);

    // Check for pattern matches after each state update
    useEffect(() => {
        if (!state.isGameOver && !state.isPaused) {
            dispatch({ type: 'CHECK_PATTERN_MATCHES' });
        }
    }, [state.tubes]);

    return (
        <GameContext.Provider value={{ state, dispatch }}>
            {children}
        </GameContext.Provider>
    );
};

// Create a custom hook to use the game context
export const useGame = (): GameContextType => {
    const context = useContext(GameContext);

    if (context === undefined) {
        throw new Error('useGame must be used within a GameProvider');
    }

    return context;
}; 