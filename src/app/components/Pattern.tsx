'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pattern as PatternType } from '../types';

interface PatternProps {
    pattern: PatternType;
    index: number;
    key?: string | number;
}

const Pattern: React.FC<PatternProps> = ({ pattern, index }) => {
    const [isShuffling, setIsShuffling] = useState(false);
    const [patternKey, setPatternKey] = useState(`pattern-${index}-${Date.now()}`);

    // Update the key when the pattern changes to trigger animation
    useEffect(() => {
        setIsShuffling(true);
        setPatternKey(`pattern-${index}-${Date.now()}`);

        const timer = setTimeout(() => {
            setIsShuffling(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [pattern, index]);

    const colorClasses = {
        red: 'bg-red-500',
        blue: 'bg-blue-500',
        green: 'bg-green-500',
        yellow: 'bg-yellow-500',
        purple: 'bg-purple-500',
        orange: 'bg-orange-500',
    };

    return (
        <motion.div
            className="flex flex-col-reverse items-center p-2 bg-gray-800 bg-opacity-40 rounded-lg"
            initial={{ opacity: 0, x: -50 }}
            animate={{
                opacity: 1,
                x: 0,
                rotate: isShuffling ? [0, -5, 5, -5, 0] : 0,
                scale: isShuffling ? [1, 1.05, 1] : 1,
            }}
            transition={{
                duration: 0.5,
                delay: index * 0.2,
                rotate: { duration: 0.5 },
                scale: { duration: 0.5 }
            }}
        >
            <div className="text-xs text-white mb-1 font-semibold">Target {index + 1}</div>
            <AnimatePresence mode="wait">
                <motion.div
                    key={patternKey}
                    className="flex flex-col-reverse"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {pattern.colors.map((color, colorIndex) => (
                        <motion.div
                            key={`${patternKey}-${colorIndex}`}
                            className={`w-10 h-10 rounded-lg mb-1 ${colorClasses[color]}`}
                            initial={{ scale: 0, rotate: 180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                                delay: index * 0.2 + colorIndex * 0.1,
                                duration: 0.3,
                                type: "spring",
                                stiffness: 200
                            }}
                        />
                    ))}
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
};

export default Pattern; 