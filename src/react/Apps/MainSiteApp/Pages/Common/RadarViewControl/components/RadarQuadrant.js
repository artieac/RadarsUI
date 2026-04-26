'use strict'
import React from 'react';
import RadarBlip from './RadarBlip';

const RadarQuadrant = ({ quadrant, w, h, onClick, blipOffset }) => {
    return (
        <g className={`radar-quadrant-${quadrant.quadrant}`}>
            {quadrant.items.map((item, index) => (
                <RadarBlip 
                    key={index} 
                    item={item} 
                    color={quadrant.color} 
                    w={w} 
                    h={h} 
                    onClick={onClick}
                    index={blipOffset + index + 1}
                />
            ))}
        </g>
    );
};

export default RadarQuadrant;
