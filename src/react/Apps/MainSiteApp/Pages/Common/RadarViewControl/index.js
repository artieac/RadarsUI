'use strict'
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from 'react-router-dom'
import { RadarRepository } from 'Repositories/RadarRepository'
import { addRadarsToState, setCurrentRadarInstanceToState } from 'Redux/RadarReducer'
import { isValid } from 'Apps/Common/Utilities'
import CompleteRadarManager from '../CompleteRadarManager'
import RadarSvg from './components/RadarSvg';
import SingleQuadrantLegend from './components/SingleQuadrantLegend';
import LoadingComponent from 'SharedComponents/LoadingComponent';

export const RadarViewControl = ({ handleClickRadarItem, isPublic, subscriptionId  }) => {
    const [radarData, setRadarData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const currentRadar = useSelector((state) => state.radarReducer.currentRadar);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const lastFetchedRadarIdRef = useRef(null);

    useEffect(() => {
        const incomingId = currentRadar && (currentRadar.radarId || currentRadar.id);
        if (isValid(currentRadar) && isValid(incomingId) && incomingId !== lastFetchedRadarIdRef.current) {
            lastFetchedRadarIdRef.current = incomingId;
            fetchRadarData(currentRadar);
        }
    }, [currentRadar, isPublic, subscriptionId]);

    const handleQuadrantTitleClick = (quadrantName) => {
        let baseUrl = isPublic ? "/public/home" : "/home";

        if(window.location.pathname.startsWith("/admin")){
            baseUrl = "/admin";
        }

        const radarId = currentRadar.radarId || currentRadar.id;
        navigate(`${baseUrl}/subscription/${subscriptionId}/radar/${radarId}/quadrant/${quadrantName}`);
    };

    const fetchRadarData = (sourceRadar) => {
        setIsLoading(true);
        let radarRepository = new RadarRepository();
        const sourceRadarId = sourceRadar.radarId || sourceRadar.id;
        if (sourceRadarId > 0) {
            radarRepository.getByUserIdAndRadarId(isPublic, subscriptionId, sourceRadarId, handleGetRadarResponse);
        } else {
            let completeRadarManager = new CompleteRadarManager();
            if (completeRadarManager.isRadarTheCompleteView(sourceRadarId, sourceRadar.name)) {
                radarRepository.getFullView(isPublic, subscriptionId, sourceRadar.radarTemplate.id, handleGetRadarResponse);
            }
        }
    };

    const handleGetRadarResponse = (wasSuccessful, data) => {
        setIsLoading(false);
        if (wasSuccessful === true) {
            setRadarData(data);
            // Keep Redux currentRadar in sync with the displayed radar so that
            // ModifyRadarItemsControl always has access to radarTemplate.
            dispatch(setCurrentRadarInstanceToState(data));
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
