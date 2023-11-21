'use strict'
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from "react-redux";
import { UserRepository } from 'Repositories/UserRepository';
import { TeamRepository } from 'Repositories/TeamRepository';

export const ManageTeamRadarsPage = () => {
    return (
        <div className="container">
            <div className="contentPageTitle">
                <label>Manage Team Radars</label>
            </div>
            <p>Choose which radars this team can edit.</p>
        </div>
    );
};

export default ManageTeamRadarsPage;