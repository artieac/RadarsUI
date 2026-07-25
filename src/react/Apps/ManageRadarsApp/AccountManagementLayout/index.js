'use strict'
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import ManageRadarTemplatesPage from '../Pages/ManageRadarTemplatesPage';
import ManageAssociatedRadarTemplatesPage from '../Pages/ManageAssociatedRadarTemplatesPage';
import ManageRadarsPage from '../Pages/ManageRadarsPage';
import './AccountManagementLayout.css';

const NAV_ITEMS = [
    { id: 'templates',    label: 'Manage Templates',     icon: '📐' },
    { id: 'associated',   label: 'Associated Templates', icon: '🔗' },
    { id: 'radars',       label: 'Manage Radars',        icon: '📡' },
];

const AccountManagementLayout = () => {
    const [activeSection, setActiveSection] = useState('templates');
    const currentUser = useSelector((state) => state.userReducer.currentUser);

    const renderContent = () => {
        switch (activeSection) {
            case 'templates':  return <ManageRadarTemplatesPage />;
            case 'associated': return <ManageAssociatedRadarTemplatesPage />;
            case 'radars':     return <ManageRadarsPage authenticatedUser={currentUser} />;
            default:           return null;
        }
    };

    return (
        <div className="acct-layout">
            <nav className="acct-sidenav">
                <div className="acct-sidenav-header">
                    <span className="acct-sidenav-icon">⚙</span>
                    <span>Account Management</span>
                </div>
                <ul className="acct-sidenav-items">
                    {NAV_ITEMS.map(item => (
                        <li key={item.id}>
                            <button
                                id={`nav-acct-${item.id}`}
                                className={
                                    'acct-sidenav-link' +
                                    (activeSection === item.id ? ' acct-sidenav-link--active' : '')
                                }
                                onClick={() => setActiveSection(item.id)}
                            >
                                <span className="acct-sidenav-link-icon">{item.icon}</span>
                                {item.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
            <main className="acct-content">
                {renderContent()}
            </main>
        </div>
    );
};

export default AccountManagementLayout;
