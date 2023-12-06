'use strict'
import jQuery from 'jquery';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useParams } from 'react-router-dom'
import { connect, useSelector, useDispatch } from "react-redux"
import ErrorBoundaryComponent from 'SharedComponents/ErrorBoundaryComponent';
import SelectRadarControl from '../Common/SelectRadarControl'
import RadarViewControl from '../Common/RadarViewControl'
import { StaticDataLoader } from 'Apps/Common/StaticDataLoader'
import ModifyRadarItemsControl from './ModifyRadarItemsControl'
import { setCurrentRadarInstanceToState } from 'Redux/RadarReducer'
import { isValid } from 'Apps/Common/Utilities'
import { RadarViewParams } from '../Common/RadarViewParams'
import CompleteRadarManager from '../Common/CompleteRadarManager'

export const SecureRadarPage = ({ mostRecent }) => {
    const [showModifyItemsPanel, setShowModifyItemsPanel] = useState(false);
    const [selectedRadarItem, setSelectedRadarItem] = useState(null);

    let { userId } = useParams();
    let { radarTemplateId } = useParams();
    let { radarId } = useParams();

    const authenticatedUser = useSelector((state) => state.userReducer.currentUser);
    const currentRadar = useSelector((state) => state.radarReducer.currentRadar);

    const disableModifyRadarItemsButton = (radar) => {
        let completeRadarManager = new CompleteRadarManager();

        if(isValid(radar) &&
            isValid(radar.id) &&
            !radar.isLocked &&
            completeRadarManager.isRadarTheCompleteView(radarId, radar.name)) {
            return false;
        }

        return true;
    }

    const toggleModifyItemsPanel = () => {
        setShowModifyItemsPanel(!showModifyItemsPanel);
    }

    const handleShowModifyItemsPanel = () => {
        toggleModifyItemsPanel();
    }

    const handleCloseModifyItemsPanel = () => {
        setShowModifyItemsPanel(false);
    }

    const handleClickRadarItem = (radarItem) => {
        setSelectedRadarItem(radarItem);
    }

    return (
        <div className="card">
            <div className="card-title panel-heading-techradar">Which Radar?</div>
            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-9">
                            <SelectRadarControl radarViewParams = { new RadarViewParams(false, userId, authenticatedUser, radarTemplateId, radarId, mostRecent) } />
                        </div>
                        <div className="col-md-3">
                            <button className="btn btn-techradar" type="submit" onClick= { handleShowModifyItemsPanel } disabled= { disableModifyRadarItemsButton(currentRadar) }>Modify Items</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-9">
                            <RadarViewControl handleClickRadarItem = { handleClickRadarItem } isPublic={ false } userId = { authenticatedUser.id } />
                        </div>
                        <div className="col-md-3">
                            { showModifyItemsPanel==true ? <ModifyRadarItemsControl selectedRadarItem = { selectedRadarItem } closePanelHandler = { handleCloseModifyItemsPanel }/> : null }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SecureRadarPage;