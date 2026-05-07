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

export const SecureRadarPage = ({ mostRecent, fullView }) => {
    const [showModifyItemsPanel, setShowModifyItemsPanel] = useState(false);
    const [selectedRadarItem, setSelectedRadarItem] = useState(null);

    let { userId } = useParams();
    let { radarTemplateId } = useParams();
    let { radarId } = useParams();

    const authenticatedUser = useSelector((state) => state.userReducer.currentUser);
    const currentRadar = useSelector((state) => state.radarReducer.currentRadar);

    const shouldShowAddItemButton = (radar) => {
        let completeRadarManager = new CompleteRadarManager();

        if(isValid(radar) &&
            isValid(radar.id) &&
            !radar.isLocked &&
            !completeRadarManager.isRadarTheCompleteView(radar.id, radar.name)) {
            return true;
        }

        return false;
    }

    const toggleModifyItemsPanel = () => {
        setShowModifyItemsPanel(!showModifyItemsPanel);
    }

    const handleShowAddItemPanel = () => {
        setSelectedRadarItem(null);
        setShowModifyItemsPanel(true);
    }

    const handleCloseModifyItemsPanel = () => {
        setShowModifyItemsPanel(false);
        setSelectedRadarItem(null);
    }

    const handleClickRadarItem = (radarItem) => {
        if (shouldShowAddItemButton(currentRadar)) {
            setSelectedRadarItem(radarItem);
            setShowModifyItemsPanel(true);
        }
    }

    const radarViewParams = new RadarViewParams(false, userId, authenticatedUser, radarTemplateId, radarId, mostRecent, fullView);

    return (
        <div className="card">
            <div className="card-title panel-heading-techradar">Which Radar?</div>
            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-9">
                            <SelectRadarControl radarViewParams = { radarViewParams } />
                        </div>
                        <div className="col-md-3">
                            { shouldShowAddItemButton(currentRadar) ? (
                                <button className="btn btn-techradar" type="button" onClick= { handleShowAddItemPanel }>Add Item</button>
                            ) : null }
                        </div>
                    </div>
                </div>
            </div>
            <div className="card">
                <div className="card-body">
                    { showModifyItemsPanel==true ? (
                        <div className="row mb-4">
                            <div className="col-md-12">
                                <ModifyRadarItemsControl selectedRadarItem = { selectedRadarItem } closePanelHandler = { handleCloseModifyItemsPanel }/>
                            </div>
                        </div>
                    ) : null }
                    <div className="row">
                        <div className="col-md-12">
                            <RadarViewControl handleClickRadarItem = { handleClickRadarItem } isPublic={ false } userId = { radarViewParams.getUserIdToView() } />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SecureRadarPage;