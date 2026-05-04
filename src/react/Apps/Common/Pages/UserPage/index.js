'use strict'
import jQuery from 'jquery';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux"
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import ConfigurationSettings from 'Apps/Common/ConfigurationSettings'
import { isValid } from 'Apps/Common/Utilities'
import { UserRepository } from 'Repositories/UserRepository'
import './UserPage.css';

export const UserPage = ({ authenticatedUser }) => {
    const onLogoutClick = () => {
        let configurationSettings = new ConfigurationSettings();
        window.open(configurationSettings.getWebServiceUrlRoot() + "/logout", "_self");
    }

    if(isValid(authenticatedUser)) {
        return (
            <div className="container user-page-container">
                <div className="user-card">
                    <div className="user-header">
                        <div className="user-email">
                            { authenticatedUser.email }
                        </div>
                        <a className="btn-logout" aria-current="page" onClick={ onLogoutClick } >Log Out</a>
                    </div>
                    
                    <div className="user-info-row">
                        <div className="user-info-label">User Type:</div>
                        <div className="user-info-value">{ authenticatedUser.userType.name }</div>
                    </div>
                    
                    <div className="user-info-row">
                        <div className="user-info-label"># Allowed Templates:</div>
                        <div className="user-info-value">{ authenticatedUser.canHaveNRadarTemplates }</div>
                    </div>
                    
                    <div className="user-info-row">
                        <div className="user-info-label"># Allowed Associated Templates:</div>
                        <div className="user-info-value">{ authenticatedUser.canHaveNAssociatedRadarTemplates }</div>
                    </div>
                </div>
            </div>
        );
    } else {
        return (<div className="container"/>);
    }
}

export default UserPage;