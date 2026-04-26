'use strict'
import React from 'react';
import _ from 'lodash';

const SingleQuadrantLegend = ({ quadrant, arcs, onClick, blipStartNumber }) => {
    let localCounter = blipStartNumber;

    // Group items by ring for this quadrant
    const itemsByRing = _.groupBy(quadrant.items, (item) => {
        for (let i = 0; i < arcs.length; i++) {
            if (item.pc.r < arcs[i].r) return i;
        }
        return 0;
    });

    return (
        <div className="quadrant-legend mb-4">
            <h4 style={{ 
                color: quadrant.color, 
                borderBottom: `2px solid ${quadrant.color}`, 
                paddingBottom: '5px',
                textTransform: 'uppercase',
                fontSize: '1.1rem'
            }}>
                {quadrant.quadrant}
            </h4>
            {arcs.map((arc, aIndex) => {
                const ringItems = itemsByRing[aIndex] || [];
                if (ringItems.length === 0) return null;

                return (
                    <div key={aIndex} className="mt-2">
                        <h6 style={{ color: '#999', textTransform: 'uppercase', fontSize: '0.8rem', marginBottom: '4px' }}>
                            {arc.name}
                        </h6>
                        <ul className="list-unstyled">
                            {ringItems.map((item, iIndex) => {
                                const currentNumber = localCounter++;
                                const isMoving = item.movement === 't';
                                return (
                                    <li 
                                        key={iIndex} 
                                        style={{ cursor: 'pointer', padding: '3px 0', fontSize: '0.9rem' }}
                                        onClick={() => onClick(item.assessmentItem)}
                                        className="legend-item d-flex align-items-center"
                                        title={`${item.name}\n${item.assessmentItem.details}`}
                                    >
                                        <div className="me-2 d-flex align-items-center justify-content-center" style={{ width: '22px', height: '22px' }}>
                                            <svg width="22" height="22" viewBox="0 0 22 22">
                                                {isMoving ? (
                                                    <path
                                                        d="M 11 3 L 3 18 L 19 18 Z"
                                                        fill={quadrant.color}
                                                    />
                                                ) : (
                                                    <circle
                                                        cx="11"
                                                        cy="11"
                                                        r="9"
                                                        fill={quadrant.color}
                                                    />
                                                )}
                                                <text
                                                    x="11"
                                                    y={isMoving ? "14" : "11"}
                                                    textAnchor="middle"
                                                    dominantBaseline="central"
                                                    fill="white"
                                                    fontSize="9px"
                                                    fontWeight="bold"
                                                >
                                                    {currentNumber}
                                                </text>
                                            </svg>
                                        </div>
                                        <span style={{ flex: 1 }}>
                                            {item.name}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                );
            })}
        </div>
    );
};

export default SingleQuadrantLegend;
