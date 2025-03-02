'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Tube as TubeType } from '../types';
import ColorBlock from './ColorBlock';

interface TubeProps {
    tube: TubeType;
    onTubeClick: () => void;
    onBlockDrop: (blockId: string) => void;
}

const Tube: React.FC<TubeProps> = ({ tube, onTubeClick, onBlockDrop }) => {
    // Calculate the height of the tube based on its capacity
    const tubeHeight = tube.capacity * 68 + 20; // 68px per block + 20px padding

    // Handle drag end event
    const handleDragEnd = (e: any) => {
        // Check if the dragged block is over the tube
        const tubeRect = e.target.parentElement.getBoundingClientRect();
        const blockRect = e.target.getBoundingClientRect();

        const blockCenterX = blockRect.left + blockRect.width / 2;
        const blockCenterY = blockRect.top + blockRect.height / 2;

        const isOverTube =
            blockCenterX >= tubeRect.left &&
            blockCenterX <= tubeRect.right &&
            blockCenterY >= tubeRect.top &&
            blockCenterY <= tubeRect.bottom;

        if (isOverTube) {
            const blockId = e.target.getAttribute('data-id');
            onBlockDrop(blockId);
        }
    };

    return (
        <motion.div
            className="relative flex flex-col-reverse items-center justify-start bg-gray-200 bg-opacity-30 rounded-lg p-2"
            style={{
                width: '80px',
                height: `${tubeHeight}px`,
                border: '2px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), inset 0 0 10px rgba(255, 255, 255, 0.2)'
            }}
            onClick={onTubeClick}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            {tube.blocks.map((block, index) => (
                <div key={block.id} className="mb-1">
                    <ColorBlock
                        block={block}
                        index={index}
                        isDraggable={index === tube.blocks.length - 1} // Only the top block is draggable
                        onClick={() => {
                            if (index === tube.blocks.length - 1) {
                                onTubeClick();
                            }
                        }}
                    />
                </div>
            ))}
        </motion.div>
    );
};

export default Tube; 