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
import { setCurrentRadarInstanceToState, setCurrentDiagramToState } from 'Redux/RadarReducer'

import { isValid } from 'Apps/Common/Utilities'
import { RadarViewParams } from '../Common/RadarViewParams'
import CompleteRadarManager from '../Common/CompleteRadarManager'
import { UserRepository } from 'Repositories/UserRepository'
import { setViewedSubscription } from 'Redux/UserReducer'

export const SecureRadarPage = ({ mostRecent, fullView }) => {
    const [showModifyItemsPanel, setShowModifyItemsPanel] = useState(false);
    const [selectedRadarItem, setSelectedRadarItem] = useState(null);
    const [radarIsLocked, setRadarIsLocked] = useState(false);

    let { subscriptionId } = useParams();
    let { radarTemplateId } = useParams();
    let { radarId } = useParams();

    const authenticatedUser = useSelector((state) => state.userReducer.currentUser);
    const currentRadar = useSelector((state) => state.radarReducer.currentRadar);
    const currentDiagram = useSelector((state) => state.radarReducer.currentDiagram);
    const dispatch = useDispatch();


    // Sync Redux subscription context whenever the URL subscription changes.
    // This handles direct navigation (bookmarks, nav links) where setViewedSubscription
    // was never dispatched, ensuring canSeeFullView and tier limits are always correct.
    useEffect(() => {
        const urlSubId = parseInt(subscriptionId, 10);
        if (!urlSubId || authenticatedUser?.currentlyViewedSubscriptionId === urlSubId) return;
        const userRepo = new UserRepository();
        userRepo.getUserSubscriptions((success, data) => {
            if (success && Array.isArray(data)) {
                const sub = data.find(s => s.subscriptionId === urlSubId);
                if (sub) dispatch(setViewedSubscription(sub));
            }
        });
    }, [subscriptionId]);

    // Clear both the simple selection and the rendered diagram whenever the subscription changes.
    // Without this, RadarViewControl remounts (due to key={subscriptionId}) and immediately
    // reads the previous subscription's diagram from Redux, causing RadarSvg to crash.
    useEffect(() => {
        dispatch(setCurrentRadarInstanceToState(null));
        dispatch(setCurrentDiagramToState(null));
    }, [subscriptionId]);

    // Update lock state from the currentDiagram (always a DiagramPresentation when set).
    useEffect(() => {
        if (currentDiagram && currentDiagram.radarId) {
            setRadarIsLocked(currentDiagram.isLocked === true);
        }
    }, [currentDiagram]);


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

    const radarViewParams = new RadarViewParams(false, subscriptionId, authenticatedUser, radarTemplateId, radarId, mostRecent, fullView);

    return (
        <div className="card">
            <div className="card-title panel-heading-techradar">Which Radar?</div>
            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-9">
                            <SelectRadarControl key={subscriptionId} radarViewParams = { radarViewParams } />
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
                                <ModifyRadarItemsControl selectedRadarItem = { selectedRadarItem } subscriptionId = { subscriptionId } radarId = { currentRadar && currentRadar.id } closePanelHandler = { handleCloseModifyItemsPanel } radarIsLocked = { radarIsLocked }/>
                            </div>
                        </div>
                    ) : null }
                    <div className="row">
                        <div className="col-md-12">
                            <RadarViewControl key={subscriptionId} handleClickRadarItem = { handleClickRadarItem } isPublic={ false } subscriptionId = { radarViewParams.getSubscriptionIdToView() } />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SecureRadarPage;