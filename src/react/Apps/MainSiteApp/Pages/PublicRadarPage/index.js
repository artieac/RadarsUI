'use strict'
import jQuery from 'jquery';
import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux"
import ReactDOM from 'react-dom';
import { useNavigate, useParams } from 'react-router-dom'
import ErrorBoundaryComponent from 'SharedComponents/ErrorBoundaryComponent';
import SelectRadarControl from '../Common/SelectRadarControl'
import RadarViewControl from '../Common/RadarViewControl'
import { setCurrentRadarInstanceToState } from 'Redux/RadarReducer'
import { RadarViewParams } from '../Common/RadarViewParams';

export const PublicRadarPage = ({ mostRecent, fullView } ) => {
    let { subscriptionId } = useParams();
    let { radarTemplateId } = useParams();
    let { radarId } = useParams();

    const authenticatedUser = useSelector((state) => state.userReducer.currentUser);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleClickRadarItem = (radarItem) => {
        navigate(`/public/radarsubject/${radarItem.technology.id}`);
    }

    return (
        <div className="card">
            <div className="card-title panel-heading-techradar">Which Radar?</div>
            <div className="card-body">
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-12">
                                <SelectRadarControl radarViewParams = { new RadarViewParams(true, subscriptionId, authenticatedUser, radarTemplateId, radarId, mostRecent, fullView) } />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-12">
                                <RadarViewControl handleClickRadarItem = { handleClickRadarItem } subscriptionId = { subscriptionId } isPublic = { true }/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PublicRadarPage;