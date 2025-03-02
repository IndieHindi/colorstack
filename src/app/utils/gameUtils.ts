import { v4 as uuidv4 } from 'uuid';
import { Color, ColorBlock, Level, Pattern, Tube, GameDifficulty } from '../types';

// Generate a random color from the available colors
export const getRandomColor = (availableColors: Color[]): Color => {
    const randomIndex = Math.floor(Math.random() * availableColors.length);
    return availableColors[randomIndex];
};

// Create a new color block with a unique ID
export const createColorBlock = (color: Color): ColorBlock => {
    return {
        id: uuidv4(),
        color,
    };
};

// Create a new empty tube with a specified capacity
export const createTube = (capacity: number): Tube => {
    return {
        id: uuidv4(),
        blocks: [],
        capacity,
    };
};

// Check if a tube is full
export const isTubeFull = (tube: Tube): boolean => {
    return tube.blocks.length >= tube.capacity;
};

// Add a block to a tube if it's not full
export const addBlockToTube = (tube: Tube, block: ColorBlock): Tube | null => {
    if (isTubeFull(tube)) {
        return null;
    }

    return {
        ...tube,
        blocks: [...tube.blocks, block],
    };
};

// Remove the top block from a tube
export const removeTopBlock = (tube: Tube): { updatedTube: Tube; removedBlock: ColorBlock | null } => {
    if (tube.blocks.length === 0) {
        return { updatedTube: tube, removedBlock: null };
    }

    const newBlocks = [...tube.blocks];
    const removedBlock = newBlocks.pop()!;

    return {
        updatedTube: {
            ...tube,
            blocks: newBlocks,
        },
        removedBlock,
    };
};

// Check if the pattern matches the tube's top blocks
export const checkPatternMatch = (tube: Tube, pattern: Pattern): boolean => {
    if (tube.blocks.length < pattern.colors.length) {
        return false;
    }

    // Get the top N blocks from the tube, where N is the pattern length
    const topBlocks = tube.blocks.slice(tube.blocks.length - pattern.colors.length);

    // Check if the colors match the pattern
    for (let i = 0; i < pattern.colors.length; i++) {
        if (topBlocks[i].color !== pattern.colors[i]) {
            return false;
        }
    }

    return true;
};

// Remove matched pattern blocks from the tube
export const removeMatchedPattern = (tube: Tube, patternLength: number): Tube => {
    if (tube.blocks.length < patternLength) {
        return tube;
    }

    return {
        ...tube,
        blocks: tube.blocks.slice(0, tube.blocks.length - patternLength),
    };
};

// Generate a level based on difficulty
export const generateLevel = (levelNumber: number, difficulty: GameDifficulty): Level => {
    let availableColors: Color[] = ['red', 'blue', 'green', 'yellow'];
    let patternLength = 3;
    let tubeCapacity = 8;
    let timeLimit = 60;

    if (difficulty === GameDifficulty.MEDIUM || levelNumber > 5) {
        availableColors.push('purple');
        patternLength = 4;
        tubeCapacity = 10;
        timeLimit = 90;
    }

    if (difficulty === GameDifficulty.HARD || levelNumber > 10) {
        availableColors.push('orange');
        patternLength = 5;
        tubeCapacity = 12;
        timeLimit = 120;
    }

    // Generate patterns
    const patterns: Pattern[] = [];
    const numPatterns = Math.min(3, 1 + Math.floor(levelNumber / 3));

    for (let i = 0; i < numPatterns; i++) {
        const patternColors: Color[] = [];
        for (let j = 0; j < patternLength; j++) {
            patternColors.push(getRandomColor(availableColors));
        }
        patterns.push({ colors: patternColors });
    }

    return {
        id: levelNumber,
        patterns,
        availableColors,
        tubeCapacity,
        timeLimit,
    };
};

// Calculate score based on time remaining and level
export const calculateScore = (timeRemaining: number, levelNumber: number): number => {
    const baseScore = 100;
    const timeBonus = timeRemaining * 5;
    const levelMultiplier = 1 + (levelNumber * 0.1);

    return Math.floor((baseScore + timeBonus) * levelMultiplier);
};

// Shuffle an array using Fisher-Yates algorithm
export const shuffleArray = <T>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

// Generate a new pattern with random colors
export const generateNewPattern = (availableColors: Color[], length: number): Pattern => {
    const colors: Color[] = [];
    for (let i = 0; i < length; i++) {
        colors.push(getRandomColor(availableColors));
    }
    return { colors };
};

// Shuffle patterns after a match
export const shufflePatterns = (level: Level): Level => {
    const newPatterns: Pattern[] = level.patterns.map(pattern => {
        return generateNewPattern(level.availableColors, pattern.colors.length);
    });

    return {
        ...level,
        patterns: newPatterns,
    };
}; 