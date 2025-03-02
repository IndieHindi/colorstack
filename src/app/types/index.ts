export type Color = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange';

export interface ColorBlock {
    id: string;
    color: Color;
}

export interface Tube {
    id: string;
    blocks: ColorBlock[];
    capacity: number;
}

export interface Pattern {
    colors: Color[];
}

export interface Level {
    id: number;
    patterns: Pattern[];
    availableColors: Color[];
    tubeCapacity: number;
    timeLimit: number; // in seconds
}

export interface GameState {
    level: Level;
    tubes: Tube[];
    score: number;
    timeRemaining: number;
    isGameOver: boolean;
    isPaused: boolean;
}

export enum GameDifficulty {
    EASY = 'easy',
    MEDIUM = 'medium',
    HARD = 'hard',
} 