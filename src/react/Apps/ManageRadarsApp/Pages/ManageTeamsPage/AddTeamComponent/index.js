'use strict'
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux"
import { Link } from 'react-router-dom';
import { TeamRepository } from 'Repositories/TeamRepository';
import { addTeamsToState } from 'Redux/TeamReducer';

const AddTeamComponent = (currentUser) => {
    const [teamName, setTeamName] = useState("");
    const dispatch = useDispatch();

    const handleTeamNameChange = (event) => {
        setTeamName(event.target.value);
    }

    const handleAddTeamClick = () => {
        if(teamName!=""){
            letTeamRepository = new TeamRepository();
            teamRepository.addTeam(currentUser.id, teamName, handleAddTeamResponse);
        }
        else{
            alert("You must enter a team name.");
        }
    }

    const handleAddTeamResponse = (wasSuccessful, teams) => {
        if(wasSuccessful==true){
            dispatch(addTeamsToState(teams));
        }
    }

    return(
        <div className="row">
            <div className="col-md-6">
                <input type="text" ref="teamName" required="required" onChange={(event) => { this.handleTeamNameChange(event)} } />
            </div>
            <div className="col-md-2">
                <input type="button" className="btn btn-techradar" value="Add Team" onClick={(event) => { this.handleAddTeam(event) } } />
            </div>
        </div>
    );
};