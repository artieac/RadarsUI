'use strict'
import  React, { useState, useEffect } from 'react';
import { connect, useSelector, useDispatch } from "react-redux"
import AppendableTableComponent2 from 'SharedComponents/AppendableTableComponent2'
import { isValid } from 'Apps/Common/Utilities'
import { RadarRowDefinition } from './RadarRowDefinition'
import { RadarRepository } from 'Repositories/RadarRepository'
import { addRadarsToState } from 'Redux/RadarReducer'

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
                <label>Manage Technology Assessments</label>
            </div>
            <AppendableTableComponent2
                data={userRadars }
                rowDefinition={ RadarRowDefinition(authenticatedUser)}
                hoverable
                striped
                bordered={false}
                isLoading={isLoading}/>
        </div>
    );
};

export default ManageRadarsPage;