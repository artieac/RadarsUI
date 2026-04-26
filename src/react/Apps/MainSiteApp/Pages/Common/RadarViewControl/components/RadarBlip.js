'use strict'
import React from 'react';

const RadarBlip = ({ item, color, w, h, onClick, index }) => {
    // polar_to_cartesian logic (adapted for SVG origin at center)
    // pc.t is degrees, pc.r is radius
    const radians = (item.pc.t * Math.PI) / 180;
    const cx = w / 2 + item.pc.r * Math.cos(radians);
    const cy = h / 2 - item.pc.r * Math.sin(radians);

    const isMoving = item.movement === 't';
    const blipSize = item.blipSize !== undefined ? item.blipSize : 10; // SVG radii are smaller than Protovis sizes

    const handleClick = (e) => {
        e.preventDefault();
        if (onClick) {
            onClick(item.assessmentItem);
        }
    };

    return (
        <g 
            className="radar-blip" 
            style={{ cursor: 'pointer' }} 
            onClick={handleClick}
        >
            <title>{`${item.name}\n${item.assessmentItem.details}`}</title>
            {isMoving ? (
                <path
                    d={`M ${cx} ${cy - 8} L ${cx - 7} ${cy + 5} L ${cx + 7} ${cy + 5} Z`}
                    fill={color}
                    stroke={color}
                    strokeWidth="1"
                />
            ) : (
                <circle
                    cx={cx}
                    cy={cy}
                    r={7}
                    fill={color}
                    stroke={color}
                    strokeWidth="1"
                />
            )}
            <text
                x={cx}
                y={cy}
                textAnchor="middle"
                dominantBaseline="central"
                fill="white"
                fontSize="8px"
                fontWeight="bold"
                pointerEvents="none"
            >
                {index}
            </text>
        </g>
    );
};

export default RadarBlip;
