'use strict'
import  React, { useState, useEffect } from 'react';
import { connect, useSelector, useDispatch } from "react-redux"
import { isValid } from 'Apps/Common/Utilities'
import { RadarRowComponent } from './RadarRowDefinition/RadarRowComponent'
import { RadarRepository } from 'Repositories/RadarRepository'
import { addRadarsToState } from 'Redux/RadarReducer'
import AddRadarComponent from './AddRadarComponent'
import LoadingComponent from 'SharedComponents/LoadingComponent'

export const ManageRadarsPage = ({ authenticatedUser }) => {
    const [isLoading, setIsLoading] = useState(true);

    const dispatch = useDispatch();

    const userRadars = useSelector((state) => state.radarReducer.radars);

    useEffect(() => {
        getUserRadars(authenticatedUser);
    }, []);

    const getUserRadars = (user) => {
        if(isValid(user) && isValid(user.id)){
            let radarRepository = new RadarRepository();
            radarRepository.getByUserId(user.id, true, handleGetUserRadarResponse);
        }
    }

    const handleGetUserRadarResponse = (wasSuccessful, data) => {
        if(wasSuccessful==true){
            dispatch(addRadarsToState(data));
            setIsLoading(false);
        }
    }

    return (
        <div className="container">
            <div className="contentPageTitle">
                <label>Manage Your Radars</label>
            </div>
            
            <AddRadarComponent />

            <div className="row mt-4">
                <div className="col-md-12">
                    <div className="contentPageTitle mb-3">
                        <h4>Existing Radars</h4>
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
                                    {userRadars && userRadars.length > 0 ? (
                                        userRadars.map((radar) => (
                                            <RadarRowComponent key={radar.id} rowData={radar} />
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center">No radars found. Create one above!</td>
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
