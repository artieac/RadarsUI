'use strict'
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux"
import { useParams, useNavigate } from 'react-router-dom'
import { RadarRepository } from 'Repositories/RadarRepository'
import { isValid } from 'Apps/Common/Utilities'
import RadarSvg from '../Common/RadarViewControl/components/RadarSvg';
import SingleQuadrantLegend from '../Common/RadarViewControl/components/SingleQuadrantLegend';
import LoadingComponent from 'SharedComponents/LoadingComponent';

const SingleQuadrantPage = ({ isPublic }) => {
    const [radarData, setRadarData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { subscriptionId, radarId, quadrantName } = useParams();
    
    const navigate = useNavigate();
    const authenticatedUser = useSelector((state) => state.userReducer.currentUser);

    useEffect(() => {
        fetchQuadrantData();
    }, [subscriptionId, radarId, quadrantName]);

    const fetchQuadrantData = () => {
        setIsLoading(true);
        let radarRepository = new RadarRepository();
        radarRepository.getQuadrant(isPublic, subscriptionId, radarId, quadrantName, (wasSuccessful, data) => {
            setIsLoading(false);
            if (wasSuccessful === true) {
                setRadarData(data);
            }
        });
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

    const handleBackClick = () => {
        const baseUrl = isPublic ? "/public/home" : "/home";
        navigate(`${baseUrl}/subscription/${subscriptionId}/radar/${radarId}`);
    };

    const handleClickRadarItem = (radarItem) => {
        // Navigate to details or handle as needed
        navigate(`/public/radarsubject/${radarItem.technology.id}`);
    };

    if (isLoading) {
        return <LoadingComponent />;
    }

    if (!radarData || radarData.quadrants.length === 0) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger">
                    Quadrant data not found. 
                    <button className="btn btn-link" onClick={handleBackClick}>Go Back</button>
                </div>
            </div>
        );
    }

    const quadrant = radarData.quadrants[0];
    const arcs = getRadarArcs(radarData);

    return (
        <div className="container-fluid mt-4">
            <div className="row mb-4">
                <div className="col-12">
                    <button className="btn btn-outline-secondary mb-3" onClick={handleBackClick}>
                        <i className="bi bi-arrow-left"></i> Back to Full Radar
                    </button>
                    <div className="contentPageTitle">
                        <label>{radarData.radarName} - {quadrantName}</label>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-8">
                    <div className="card">
                        <div className="card-body">
                            <RadarSvg 
                                h={radarData.height} 
                                w={radarData.width} 
                                quadrants={radarData.quadrants} 
                                arcs={arcs} 
                                onClick={handleClickRadarItem}
                            />
                        </div>
                    </div>
                </div>
                <div className="col-lg-4">
                    <SingleQuadrantLegend 
                        quadrant={quadrant} 
                        arcs={arcs} 
                        onClick={handleClickRadarItem} 
                        blipStartNumber={1} 
                    />
                </div>
            </div>
        </div>
    );
};

export default SingleQuadrantPage;
