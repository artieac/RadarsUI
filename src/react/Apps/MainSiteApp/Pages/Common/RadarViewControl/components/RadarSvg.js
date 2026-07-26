'use strict'
import React from 'react';
import RadarRing from './RadarRing';
import RadarQuadrant from './RadarQuadrant';

const RadarSvg = ({ h, w, quadrants, arcs, onClick }) => {
    let blipCounter = 0;

    if (!arcs || arcs.length === 0) {
        return null;
    }

    // Default full view
    let viewBox = `0 0 ${w} ${h}`;
    let isSingleQuadrant = quadrants.length === 1;

    if (isSingleQuadrant) {
        const q = quadrants[0];
        // quadrants are 0, 90, 180, 270. 
        // We zoom into the relevant corner.
        const halfW = w / 2;
        const halfH = h / 2;
        const padding = 20;

        if (q.left > halfW && q.top < halfH) { // Q1: Top-Right
            viewBox = `${halfW - padding} 0 ${halfW + padding} ${halfH + padding}`;
        } else if (q.left < halfW && q.top < halfH) { // Q2: Top-Left
            viewBox = `0 0 ${halfW + padding} ${halfH + padding}`;
        } else if (q.left < halfW && q.top > halfH) { // Q3: Bottom-Left
            viewBox = `0 ${halfH - padding} ${halfW + padding} ${halfH + padding}`;
        } else { // Q4: Bottom-Right
            viewBox = `${halfW - padding} ${halfH - padding} ${halfW + padding} ${halfH + padding}`;
        }
    }

    return (
        <svg 
            width="100%" 
            height="auto" 
            viewBox={viewBox} 
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
