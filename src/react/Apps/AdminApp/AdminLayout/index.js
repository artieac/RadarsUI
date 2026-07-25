'use strict'
import React from 'react';
import { NavLink } from 'react-router-dom';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
    return (
        <div className="admin-layout">
            <nav className="admin-sidenav">
                <div className="admin-sidenav-header">
                    <span className="admin-sidenav-icon">⚙</span>
                    <span className="admin-sidenav-title">Administration</span>
                </div>
                <ul className="admin-sidenav-items">
                    <li>
                        <NavLink
                            to="/admin/manageusers"
                            id="nav-manage-users"
                            className={({ isActive }) =>
                                'admin-sidenav-link' + (isActive ? ' admin-sidenav-link--active' : '')
                            }
                        >
                            <span className="admin-sidenav-link-icon">👥</span>
                            Manage Users
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/admin/subscriptiontiers"
                            id="nav-subscription-tiers"
                            className={({ isActive }) =>
                                'admin-sidenav-link' + (isActive ? ' admin-sidenav-link--active' : '')
                            }
                        >
                            <span className="admin-sidenav-link-icon">🏷</span>
                            Subscription Tiers
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/admin/subscriptions"
                            id="nav-subscriptions"
                            className={({ isActive }) =>
                                'admin-sidenav-link' + (isActive ? ' admin-sidenav-link--active' : '')
                            }
                        >
                            <span className="admin-sidenav-link-icon">📋</span>
                            Subscriptions
                        </NavLink>
                    </li>
                </ul>
            </nav>
            <main className="admin-content">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
