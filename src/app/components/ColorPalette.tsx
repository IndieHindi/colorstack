'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Color } from '../types';
import { createColorBlock } from '../utils/gameUtils';

interface ColorPaletteProps {
    availableColors: Color[];
    onColorSelect: (color: Color) => void;
}

const ColorPalette: React.FC<ColorPaletteProps> = ({ availableColors, onColorSelect }) => {
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
            className="flex flex-wrap justify-center gap-3 p-4 bg-gray-800 bg-opacity-30 rounded-xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
        >
            {availableColors.map((color, index) => (
                <motion.div
                    key={color}
                    className={`w-14 h-14 rounded-lg cursor-pointer shadow-lg ${colorClasses[color]}`}
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    onClick={() => onColorSelect(color)}
                    drag
                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    dragElastic={0.5}
                    dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
                />
            ))}
        </motion.div>
    );
};

export default ColorPalette; 