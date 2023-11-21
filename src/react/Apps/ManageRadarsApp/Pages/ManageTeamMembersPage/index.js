'use strict'
import React, { useState, useEffect } from 'react';
import { connect, useSelector, useDispatch } from "react-redux"
import { useParams } from 'react-router-dom'
import { addTeamsToState, addCurrentTeamToState } from 'Redux/TeamReducer';
import { TeamRepository } from 'Repositories/TeamRepository';

const ManageTeamMembersPage = () => {

    const teamState = useSelector(state.teamReducer);

    const { userId, teamId } = useParams();

    const dispatch = useDispatch();

    useEffect(() => {
        let teamRepository = new TeamRepository();
        teamRepository.getTeam(userId, teamId, handleGetTeamResponse);
    }, []);

    const handleGetTeamResponse = (wasSuccessful, team) => {
        dispatch(addCurrentTeamToState(team));
    }

    return (
        <div className="bodyContent">
            <div className="contentPageTitle">
                <label>Manage { teamState.currentTeam.name } Team Members</label>
            </div>
            <p>Add other users to your team.  This will allow them to edit selected Radars.</p>
        </div>
    );
};

