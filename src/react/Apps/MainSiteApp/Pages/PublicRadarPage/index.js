'use strict'
import jQuery from 'jquery';
import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux"
import ReactDOM from 'react-dom';
import { useParams } from 'react-router-dom'
import ErrorBoundaryComponent from 'SharedComponents/ErrorBoundaryComponent';
import SelectRadarControl from '../Common/SelectRadarControl'
import RadarViewControl from '../Common/RadarViewControl'
import { setCurrentRadarInstanceToState } from 'Redux/RadarReducer'
import { RadarViewParams } from '../Common/RadarViewParams';

export const PublicRadarPage = ({ mostRecent, fullView } ) => {
    const [radarViewParams, setRadarViewParams] = useState({});

    let { userId } = useParams();
    let { radarTemplateId } = useParams();
    let { radarId } = useParams();

    const authenticatedUser = useSelector((state) => state.userReducer.currentUser);

    const dispatch = useDispatch();

    const handleClickRadarItem = (radarItem) => {
        setShowSelectedRadarItem(radarItem);
    }

    return (
        <div className="card">
            <div className="card-title panel-heading-techradar">Which Radar?</div>
            <div className="card-body">
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            <SelectRadarControl radarViewParams = { new RadarViewParams(true, userId, authenticatedUser, radarTemplateId, radarId, mostRecent, fullView) } />
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-9">
                                <RadarViewControl handleClickRadarItem = { handleClickRadarItem } userId = { userId } isPublic = { true }/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PublicRadarPage;