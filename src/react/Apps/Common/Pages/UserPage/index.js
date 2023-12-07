'use strict'
import jQuery from 'jquery';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux"
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import ConfigurationSettings from 'Apps/Common/ConfigurationSettings'
import { isValid } from 'Apps/Common/Utilities'
import { UserRepository } from 'Repositories/UserRepository'

export const UserPage = ({ authenticatedUser }) => {
    const onLogoutClick = () => {
        let configurationSettings = new ConfigurationSettings();
        window.open(configurationSettings.getWebServiceUrlRoot() + "/logout", "_self");
    }

    if(isValid(authenticatedUser)) {
        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <div className="heroTitle">
                            { authenticatedUser.email }
                        </div>
                    </div>
                    <div className="col">
                         <a className="button" aria-current="page" onClick={ onLogoutClick } >Log Out</a>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <label>User Type: </label>
                    </div>
                    <div className="col">{ authenticatedUser.userType.name }</div>
                </div>
                <div className="row">
                    <div className="col">
                        <label># Allowed Templates: </label>
                    </div>
                    <div className="col">{ authenticatedUser.canHaveNRadarTemplates }</div>
                </div>
                <div className="row">
                    <div className="col">
                        <label># Allowed Associated Templates: </label>
                    </div>
                    <div className="col">{ authenticatedUser.canHaveNAssociatedRadarTemplates }</div>
                </div>
            </div>
        );
    } else {
        return (<div className="container"/>);
    }
}

export default UserPage;