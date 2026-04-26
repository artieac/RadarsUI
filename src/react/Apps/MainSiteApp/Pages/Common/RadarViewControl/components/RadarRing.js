'use strict'
import React from 'react';

const RadarRing = ({ arc, w, h }) => {
    return (
        <g className="radar-ring">
            <circle
                cx={w / 2}
                cy={h / 2}
                r={arc.r}
                fill="none"
                stroke="#ccc"
                strokeWidth="1"
            />
            <text
                x={w / 2}
                y={h / 2 - arc.r + 15}
                textAnchor="middle"
                fill="#999"
                fontSize="12px"
                fontWeight="bold"
            >
                {arc.name}
            </text>
        </g>
    );
};

export default RadarRing;
