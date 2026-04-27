'use strict'
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from 'react-router-dom'
import { RadarRepository } from 'Repositories/RadarRepository'
import { addRadarsToState } from 'Redux/RadarReducer'
import { isValid } from 'Apps/Common/Utilities'
import CompleteRadarManager from '../CompleteRadarManager'
import RadarSvg from './components/RadarSvg';
import SingleQuadrantLegend from './components/SingleQuadrantLegend';
import LoadingComponent from 'SharedComponents/LoadingComponent';

export const RadarViewControl = ({ handleClickRadarItem, isPublic, userId  }) => {
    const [radarData, setRadarData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const currentRadar = useSelector((state) => state.radarReducer.currentRadar);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (isValid(currentRadar) && isValid(currentRadar.id)) {
            fetchRadarData(currentRadar);
        }
    }, [currentRadar, isPublic, userId]);

    const handleQuadrantTitleClick = (quadrantName) => {
        const baseUrl = isPublic ? "/public/home" : "/home";
        const radarId = currentRadar.id;
        navigate(`${baseUrl}/user/${userId}/radar/${radarId}/quadrant/${quadrantName}`);
    };

    const fetchRadarData = (sourceRadar) => {
        setIsLoading(true);
        let radarRepository = new RadarRepository();
        if (sourceRadar.id > 0) {
            radarRepository.getByUserIdAndRadarId(isPublic, userId, sourceRadar.id, handleGetRadarResponse);
        } else {
            let completeRadarManager = new CompleteRadarManager();
            if (completeRadarManager.isRadarTheCompleteView(sourceRadar.id, sourceRadar.name)) {
                radarRepository.getFullView(isPublic, userId, sourceRadar.radarTemplate.id, handleGetRadarResponse);
            }
        }
    };

    const handleGetRadarResponse = (wasSuccessful, data) => {
        setIsLoading(false);
        if (wasSuccessful === true) {
            setRadarData(data);
        }
    };

    const getRadarArcs = (sourceRadar) => {
        var retVal = [];
        if (isValid(sourceRadar) && sourceRadar.radarArcs) {
            for (var i = 0; i < sourceRadar.radarArcs.length; i++) {
                retVal.push({
                    "r": sourceRadar.rangeWidth * (i + 1), 
                    "name": sourceRadar.radarArcs[i].radarRing.name
                });
            }
        }
        return retVal;
    };

    if (isLoading) {
        return <LoadingComponent />;
    }

    if (!radarData) {
        return (
            <div className="alert alert-info">
                Please select a radar to view the visualization.
            </div>
        );
    }

    // Process quadrants to assign correct starting numbers for blips
    let blipCounter = 1;
    const enrichedQuadrants = radarData.quadrants.map((q) => {
        const start = blipCounter;
        blipCounter += q.items.length;
        return { ...q, blipStartNumber: start };
    });

    const arcs = getRadarArcs(radarData);

    // Group quadrants by side for the layout
    // Left side: Q2 (90), Q3 (180)
    // Right side: Q1 (0), Q4 (270)
    // Note: The backend logic might vary, so we'll use the 'left' coordinate as a hint
    const leftQuadrants = enrichedQuadrants.filter(q => q.left < radarData.width / 2);
    const rightQuadrants = enrichedQuadrants.filter(q => q.left >= radarData.width / 2);

    return (
        <div className="radar-view-container container-fluid">
            <div className="row">
                {/* Left Side Legends */}
                <div className="col-lg-2 order-2 order-lg-1">
                    {leftQuadrants.map((q, idx) => (
                        <SingleQuadrantLegend 
                            key={idx} 
                            quadrant={q} 
                            arcs={arcs} 
                            onClick={handleClickRadarItem} 
                            blipStartNumber={q.blipStartNumber} 
                            onTitleClick={handleQuadrantTitleClick}
                        />
                    ))}
                </div>

                {/* Center Radar SVG */}
                <div className="col-lg-8 order-1 order-lg-2 mb-4">
                    <div className="radar-canvas-wrapper" style={{ overflow: 'hidden' }}>
                        <RadarSvg 
                            h={radarData.height} 
                            w={radarData.width} 
                            quadrants={radarData.quadrants} 
                            arcs={arcs} 
                            onClick={handleClickRadarItem}
                        />
                    </div>
                </div>

                {/* Right Side Legends */}
                <div className="col-lg-2 order-3 order-lg-3">
                    {rightQuadrants.map((q, idx) => (
                        <SingleQuadrantLegend 
                            key={idx} 
                            quadrant={q} 
                            arcs={arcs} 
                            onClick={handleClickRadarItem} 
                            blipStartNumber={q.blipStartNumber} 
                            onTitleClick={handleQuadrantTitleClick}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default RadarViewControl;
