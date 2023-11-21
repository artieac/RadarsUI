'use strict'
import React, { useState, useEffect } from 'react';
import { connect, useSelector, useDispatch } from "react-redux"
import { TeamRepository } from 'Repositories/TeamRepository'
import TableComponent from 'SharedComponents/TableComponent'
import teamColumnMap from './teamColumnMap'

export const ManageTeamsPage = () => {
    const [teams, setTeams] = useState([]);

    const loggedInUser = useSelector((state) => state.userReducer.currentUser);

    useDispatch();

    useEffect(() => {
        let teamRepository = new TeamRepository();
        teamRepository.getAllByUser(loggedInUser.id, handleGetTeamsResponse);
    }, []);

    const handleGetTeamsResponse = (wasSuccessful, data) => {
        if(wasSuccessful==true){
            setTeams(data);
        }
    }

    return (
        <div className="bodyContent">
            <div className="contentPageTitle">
                <label>Manage Teams</label>
            </div>
            <p>Add an instance of your technology radar to track any changes since the last time you did this</p>
            <TableComponent
                data={ teams }
                cols={ teamColumnMap()}
                hoverable
                striped
                bordered={false}/>
        </div>
    );
};

export default ManageTeamsPage;