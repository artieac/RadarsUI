'use strict'
import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux"
import { useParams } from 'react-router-dom'
import SelectRadarControl from 'Apps/MainSiteApp/Pages/Common/SelectRadarControl'
import RadarViewControl from 'Apps/MainSiteApp/Pages/Common/RadarViewControl'
import { RadarViewParams } from 'Apps/MainSiteApp/Pages/Common/RadarViewParams';

export const AdminRadarPage = ({ mostRecent, fullView } ) => {
    let { userId } = useParams();
    let { radarTemplateId } = useParams();
    let { radarId } = useParams();

    const authenticatedUser = useSelector((state) => state.userReducer.currentUser);

    const handleClickRadarItem = (radarItem) => {
        // Pure read-only, possibly just show a tooltip or summary
    }

    // In Admin context, we want to view OTHER users' radars, but we use the "Secure" repository 
    // paths (isPublic = false) because the Admin HAS permission to see private data.
    const radarViewParams = new RadarViewParams(false, userId, authenticatedUser, radarTemplateId, radarId, mostRecent, fullView);

    return (
        <div className="card">
            <div className="card-title panel-heading-techradar">Admin View: User {userId} Radar</div>
            <div className="card-body">
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            <SelectRadarControl radarViewParams = { radarViewParams } />
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-12">
                                <RadarViewControl handleClickRadarItem = { handleClickRadarItem } userId = { radarViewParams.getUserIdToView() } isPublic = { false }/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminRadarPage;