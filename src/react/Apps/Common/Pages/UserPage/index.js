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

const formatRoleName = (roleName) => {
    if (!roleName) return '—';
    switch (roleName) {
        case 'ROLE_SITE_ADMIN':    return 'Site Admin';
        case 'ROLE_ACCOUNT_ADMIN': return 'Account Admin';
        case 'ROLE_EDITOR':        return 'Radar Editor';
        case 'ROLE_READONLY':      return 'Read Only';
        default:                   return roleName;
    }
}

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
                        <div className="user-info-label">Subscription Tier</div>
                        <div className="user-info-value">{ authenticatedUser.subscriptionTierName || '—' }</div>
                    </div>
                    <div className="user-info-row">
                        <div className="user-info-label">Subscription Role</div>
                        <div className="user-info-value">{ formatRoleName(authenticatedUser.subscriptionRoleName) }</div>
                    </div>
                </div>
            </div>
        );
    } else {
        return (<div className="container"/>);
    }
}

export default UserPage;