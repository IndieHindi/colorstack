'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ColorBlock as ColorBlockType } from '../types';

interface ColorBlockProps {
    block: ColorBlockType;
    onClick?: () => void;
    isDraggable?: boolean;
    index?: number;
}

const ColorBlock: React.FC<ColorBlockProps> = ({
    block,
    onClick,
    isDraggable = false,
    index = 0
}) => {
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
            className={`w-16 h-16 rounded-lg shadow-md cursor-pointer ${colorClasses[block.color]}`}
            whileHover={{ scale: isDraggable ? 1.1 : 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            initial={{ opacity: 0, y: 20 }}
            animate={{
                opacity: 1,
                y: 0,
                transition: { delay: index * 0.1 }
            }}
            drag={isDraggable}
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.2}
            dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
            data-color={block.color}
            data-id={block.id}
        />
    );
};

export default ColorBlock; 