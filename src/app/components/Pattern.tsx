'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Pattern as PatternType } from '../types';

interface PatternProps {
    pattern: PatternType;
    index: number;
}

const Pattern: React.FC<PatternProps> = ({ pattern, index }) => {
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
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2, duration: 0.5 }}
        >
            <div className="text-xs text-white mb-1 font-semibold">Target {index + 1}</div>
            {pattern.colors.map((color, colorIndex) => (
                <motion.div
                    key={colorIndex}
                    className={`w-10 h-10 rounded-lg mb-1 ${colorClasses[color]}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.2 + colorIndex * 0.1, duration: 0.3 }}
                />
            ))}
        </motion.div>
    );
};

export default Pattern; 