'use strict'
import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from "react-redux"
import { isValid } from 'Apps/Common/Utilities'
import { RadarRowComponent } from './RadarRowDefinition/RadarRowComponent'
import { AccountAdminRepository } from 'Repositories/AccountAdminRepository'
import { addRadarsToState } from 'Redux/RadarReducer'
import AddRadarComponent from './AddRadarComponent'
import LoadingComponent from 'SharedComponents/LoadingComponent'
import DropdownComponent from 'SharedComponents/DropdownComponent'
import { dropdownItem } from 'SharedComponents/DropdownComponent/dropdownItem'

export const ManageRadarsPage = ({ authenticatedUser }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [selectedFilterTemplate, setSelectedFilterTemplate] = useState({ name: "All Types", id: -1 });

    const dispatch = useDispatch();

    const userRadars = useSelector((state) => state.radarReducer.radars);

    useEffect(() => {
        getUserRadars(authenticatedUser);
    }, [authenticatedUser.subscriptionId]);

    const getUserRadars = (user) => {
        if(isValid(user) && isValid(user.currentlyViewedSubscriptionId)){
            let repo = new AccountAdminRepository();
            repo.getRadars(user.currentlyViewedSubscriptionId, handleGetUserRadarResponse);
        }
    }

    const handleGetUserRadarResponse = (wasSuccessful, data) => {
        if(wasSuccessful==true){
            dispatch(addRadarsToState(data));
            setIsLoading(false);
        }
    }

    const uniqueTemplates = useMemo(() => {
        if (!userRadars) return [];
        const templates = [{ name: "All Types", id: -1 }];
        const seenIds = new Set();
        userRadars.forEach(radar => {
            if (radar.radarTemplate && !seenIds.has(radar.radarTemplate.id)) {
                seenIds.add(radar.radarTemplate.id);
                templates.push({ name: radar.radarTemplate.name, id: radar.radarTemplate.id });
            }
        });
        return templates;
    }, [userRadars]);

    const filteredRadars = useMemo(() => {
        if (!userRadars) return [];
        if (selectedFilterTemplate.id === -1) return userRadars;
        return userRadars.filter(radar => radar.radarTemplate && radar.radarTemplate.id === selectedFilterTemplate.id);
    }, [userRadars, selectedFilterTemplate]);

    const handleFilterChange = (template) => {
        setSelectedFilterTemplate(template);
    }

    return (
        <div className="container">
            <div className="contentPageTitle mb-3">
                <h2 className="text-start">Manage Your Radars</h2>
            </div>
            
            <AddRadarComponent />

            <div className="row mt-4">
                <div className="col-md-12">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="mb-0">Existing Radars</h4>
                        <div className="d-flex align-items-center">
                            <label className="me-2 fw-bold small">Filter by Type:</label>
                            <DropdownComponent 
                                title={selectedFilterTemplate.name} 
                                data={uniqueTemplates} 
                                itemMap={dropdownItem(handleFilterChange, "name", "name")} 
                            />
                        </div>
                    </div>
                    {isLoading ? (
                        <LoadingComponent />
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover table-striped">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Date</th>
                                        <th>Type</th>
                                        <th>Published?</th>
                                        <th>Locked?</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRadars && filteredRadars.length > 0 ? (
                                        filteredRadars.map((radar) => (
                                            <RadarRowComponent key={radar.id} rowData={radar} />
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center">No radars found matching the filter.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageRadarsPage;