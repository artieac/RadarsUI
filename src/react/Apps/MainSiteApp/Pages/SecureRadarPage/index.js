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
    const [radarIsLocked, setRadarIsLocked] = useState(false);

    let { userId } = useParams();
    let { radarTemplateId } = useParams();
    let { radarId } = useParams();

    const authenticatedUser = useSelector((state) => state.userReducer.currentUser);
    const currentRadar = useSelector((state) => state.radarReducer.currentRadar);

    // Only update lock state when a real radar is dispatched (has a valid id).
    // This prevents the transient null/sentinel dispatches from clearing the locked state.
    useEffect(() => {
        if (currentRadar && currentRadar.id && currentRadar.id > 0) {
            setRadarIsLocked(currentRadar.isLocked === true);
        }
    }, [currentRadar]);

    const handleShowAddItemPanel = () => {
        setSelectedRadarItem(null);
        setShowModifyItemsPanel(true);
    }

    const canAddItems = () => {
        if (!authenticatedUser || authenticatedUser.unloaded) return false;
        if (authenticatedUser.isSiteAdmin === true) return true;
        const role = authenticatedUser.subscriptionRoleName;
        return role === 'ROLE_EDITOR' || role === 'ROLE_ACCOUNT_ADMIN';
    }

    const handleCloseModifyItemsPanel = () => {
        setShowModifyItemsPanel(false);
        setSelectedRadarItem(null);
    }

    const handleClickRadarItem = (radarItem) => {
        setSelectedRadarItem(radarItem);
        setShowModifyItemsPanel(true);
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
                        { canAddItems() &&
                            <div className="col-md-3">
                                { radarIsLocked ? (
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <button
                                            id="btn-add-radar-item"
                                            className="btn btn-secondary"
                                            type="button"
                                            disabled
                                            style={{ opacity: 0.65, cursor: 'not-allowed' }}
                                        >
                                            Add Item
                                        </button>
                                        <span
                                            title="This Radar is locked and cannot be edited."
                                            role="img"
                                            aria-label="Radar is locked"
                                            style={{ color: '#dc3545', fontSize: '1.2rem', cursor: 'help' }}
                                        >
                                            ⚠
                                        </span>
                                    </span>
                                ) : (
                                    <button
                                        id="btn-add-radar-item"
                                        className="btn btn-techradar"
                                        type="button"
                                        onClick={ handleShowAddItemPanel }
                                    >
                                        Add Item
                                    </button>
                                )}
                            </div>
                        }
                    </div>
                </div>
            </div>
            <div className="card">
                <div className="card-body">
                    { showModifyItemsPanel==true ? (
                        <div className="row mb-4">
                            <div className="col-md-12">
                                <ModifyRadarItemsControl selectedRadarItem = { selectedRadarItem } closePanelHandler = { handleCloseModifyItemsPanel } radarIsLocked = { radarIsLocked }/>
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