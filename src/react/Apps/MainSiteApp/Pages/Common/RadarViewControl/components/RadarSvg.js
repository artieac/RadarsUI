'use strict'
import React from 'react';
import RadarRing from './RadarRing';
import RadarQuadrant from './RadarQuadrant';

const RadarSvg = ({ h, w, quadrants, arcs, onClick }) => {
    let blipCounter = 0;

    return (
        <svg 
            width="100%" 
            height="auto" 
            viewBox={`0 0 ${w} ${h}`} 
            style={{ backgroundColor: '#fff', display: 'block', margin: '0 auto' }}
        >
            {/* Background Axes */}
            <line x1={w / 2} y1={h / 2 - arcs[arcs.length - 1].r} x2={w / 2} y2={h / 2 + arcs[arcs.length - 1].r} stroke="#bbb" strokeWidth="1" />
            <line x1={w / 2 - arcs[arcs.length - 1].r} y1={h / 2} x2={w / 2 + arcs[arcs.length - 1].r} y2={h / 2} stroke="#bbb" strokeWidth="1" />

            {/* Rings */}
            {arcs.map((arc, index) => (
                <RadarRing key={index} arc={arc} w={w} h={h} />
            ))}

            {/* Quadrants and Blips */}
            {quadrants.map((quadrant, index) => {
                const currentOffset = blipCounter;
                blipCounter += quadrant.items.length;
                return (
                    <RadarQuadrant 
                        key={index} 
                        quadrant={quadrant} 
                        w={w} 
                        h={h} 
                        onClick={onClick}
                        blipOffset={currentOffset}
                    />
                );
            })}
        </svg>
    );
};

export default RadarSvg;
