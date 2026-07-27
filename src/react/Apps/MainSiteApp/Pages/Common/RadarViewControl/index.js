'use strict'
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from 'react-router-dom'
import { RadarRepository } from 'Repositories/RadarRepository'
import { setCurrentDiagramToState } from 'Redux/RadarReducer'
import { isValid } from 'Apps/Common/Utilities'
import CompleteRadarManager from '../CompleteRadarManager'
import RadarSvg from './components/RadarSvg';
import SingleQuadrantLegend from './components/SingleQuadrantLegend';
import LoadingComponent from 'SharedComponents/LoadingComponent';

export const RadarViewControl = ({ handleClickRadarItem, isPublic, subscriptionId  }) => {
    const [isLoading, setIsLoading] = useState(false);

    // currentRadar: simple radar selection ({ id, name }) — written only by RadarSelectionComponent.
    // Used solely to trigger a fetch when the selected radar changes. Never used for rendering.
    const currentRadar = useSelector((state) => state.radarReducer.currentRadar);
    // currentDiagram: the full DiagramPresentation returned by the API.
    // The single source of truth for rendering. Written here after a fetch, and by
    // saveRadarItemResponseHandler in ModifyRadarItemsControl after adding/editing an item.
    const currentDiagram = useSelector((state) => state.radarReducer.currentDiagram);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Tracks the radar id of the last initiated fetch so we don't re-fetch the same radar.
    const lastFetchedRadarIdRef = useRef(null);

    useEffect(() => {
        const incomingId = currentRadar && currentRadar.id;
        if (!isValid(currentRadar) || !isValid(incomingId)) return;
        if (incomingId !== lastFetchedRadarIdRef.current) {
            lastFetchedRadarIdRef.current = incomingId;
            fetchRadarData(currentRadar);
        }
    }, [currentRadar, isPublic, subscriptionId]);

    const handleQuadrantTitleClick = (quadrantName) => {
        let baseUrl = isPublic ? "/public/home" : "/home";

        if (window.location.pathname.startsWith("/admin")) {
            baseUrl = "/admin";
        }

        // Use currentDiagram.radarId — it is always the canonical DiagramPresentation id.
        const radarId = currentDiagram && currentDiagram.radarId;
        navigate(`${baseUrl}/subscription/${subscriptionId}/radar/${radarId}/quadrant/${quadrantName}`);
    };

    const fetchRadarData = (sourceRadar) => {
        setIsLoading(true);
        let radarRepository = new RadarRepository();
        // sourceRadar is always the simple selection object ({ id, name, ... }).
        const sourceRadarId = sourceRadar.id;
        if (sourceRadarId > 0) {
            radarRepository.getByUserIdAndRadarId(isPublic, subscriptionId, sourceRadarId, handleGetRadarResponse);
        } else {
            let completeRadarManager = new CompleteRadarManager();
            if (completeRadarManager.isRadarTheCompleteView(sourceRadarId, sourceRadar.name)) {
                // The synthetic "Complete View" item carries radarTemplate from the template dropdown.
                radarRepository.getFullView(isPublic, subscriptionId, sourceRadar.radarTemplate.id, handleGetRadarResponse);
            }
        }
    };

    const handleGetRadarResponse = (wasSuccessful, data) => {
        setIsLoading(false);
        if (wasSuccessful === true) {
            // Dispatch to currentDiagram only — currentRadar stays as the simple selection.
            dispatch(setCurrentDiagramToState(data));
        }
    };

    const getRadarArcs = (diagram) => {
        var retVal = [];
        if (isValid(diagram) && diagram.radarArcs) {
            for (var i = 0; i < diagram.radarArcs.length; i++) {
                retVal.push({
                    "r": diagram.rangeWidth * (i + 1),
                    "name": diagram.radarArcs[i].radarRing.name
                });
            }
        }
        return retVal;
    };

    if (isLoading) {
        return <LoadingComponent />;
    }

    if (!currentDiagram) {
        return (
            <div className="alert alert-info">
                Please select a radar to view the visualization.
            </div>
        );
    }

    // Process quadrants to assign correct starting numbers for blips.
    let blipCounter = 1;
    const enrichedQuadrants = currentDiagram.quadrants.map((q) => {
        const start = blipCounter;
        blipCounter += q.items.length;
        return { ...q, blipStartNumber: start };
    });

    const arcs = getRadarArcs(currentDiagram);

    // Group quadrants by side for the layout.
    // Left side: Q2 (90°), Q3 (180°) — right side: Q1 (0°), Q4 (270°).
    const leftQuadrants = enrichedQuadrants.filter(q => q.left < currentDiagram.width / 2);
    const rightQuadrants = enrichedQuadrants.filter(q => q.left >= currentDiagram.width / 2);

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
                            h={currentDiagram.height}
                            w={currentDiagram.width}
                            quadrants={currentDiagram.quadrants}
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
