import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types'
import { connect, useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { isValid } from 'Apps/Common/Utilities'
import ConfigurationSettings from 'Apps/Common/ConfigurationSettings'
import { UserRepository } from 'Repositories/UserRepository'
import { setViewedSubscription } from 'Redux/UserReducer'
import "./component.css"

const NavBarComponent = ({ navBarRowDefinition, currentUser, loginUrl }) => {
    const [profileOpen, setProfileOpen] = useState(false);
    const [subscriptions, setSubscriptions] = useState([]);
    const [subsLoaded, setSubsLoaded] = useState(false);
    const dropdownRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const isUserLoggedIn = () => {
        if(isValid(currentUser) && isValid(currentUser.id) && currentUser.id > 0){
            return true;
        }
        return false;
    }

    const onSignInClick = () => {
        window.open(navBarRowDefinition.loginUrl, "_self");
    }

    const getUserLabel = (currentUser) => {
        if(isUserLoggedIn(currentUser)){
            if(isValid(currentUser.name) && currentUser.name.length > 0){
                return currentUser.name;
            } else if(isValid(currentUser.email) && currentUser.email.length > 0){
                return currentUser.email;
            }
        }
        return "anonymous";
    }

    // Detect current subscription from URL (e.g. /home/subscription/:subscriptionId/...)
    const getCurrentViewedSubscriptionId = () => {
        const match = location.pathname.match(/\/subscription\/(\d+)\//);
        return match ? parseInt(match[1], 10) : null;
    }

    const toggleProfile = () => {
        const next = !profileOpen;
        setProfileOpen(next);
        if (next && !subsLoaded && isUserLoggedIn()) {
            let userRepo = new UserRepository();
            userRepo.getUserSubscriptions((success, data) => {
                if (success && Array.isArray(data)) {
                    setSubscriptions(data);
                }
                setSubsLoaded(true);
            });
        }
    }

    const onLogoutClick = () => {
        // loginUrl is API_ROOT/login — swap to /logout
        const logoutUrl = loginUrl.replace(/\/login$/, '/logout');
        window.open(logoutUrl, '_self');
    }

    const onSubscriptionClick = (sub) => {
        // Update Redux with the new subscription's role and tier limits
        dispatch(setViewedSubscription(sub));
        // Close dropdown
        setProfileOpen(false);
        // Navigate to the new subscription's radar view
        navigate(`/home/subscription/${sub.subscriptionId}/radars`);
    }

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getRoleBadgeClass = (roleName) => {
        if (!roleName) return 'badge-role-readonly';
        if (roleName.includes('ACCOUNT_ADMIN')) return 'badge-role-admin';
        if (roleName.includes('EDITOR')) return 'badge-role-editor';
        if (roleName.includes('SITE_ADMIN')) return 'badge-role-site';
        return 'badge-role-readonly';
    }

    const getRoleLabel = (roleName) => {
        if (!roleName) return 'Read Only';
        if (roleName.includes('SITE_ADMIN')) return 'Site Admin';
        if (roleName.includes('ACCOUNT_ADMIN')) return 'Account Admin';
        if (roleName.includes('EDITOR')) return 'Radar Editor';
        return 'Read Only';
    }

    const renderProfileDropdown = () => {
        if (!isUserLoggedIn()) return null;
        const currentViewedSubscriptionId = getCurrentViewedSubscriptionId();

        return (
            <div className="profile-dropdown-wrapper" ref={dropdownRef}>
                <button
                    className="nav-link profile-trigger"
                    id="profile-menu-btn"
                    aria-haspopup="true"
                    aria-expanded={profileOpen}
                    onClick={toggleProfile}
                >
                    <i className="bi bi-person-circle me-1"></i>
                    {getUserLabel(currentUser)}
                    <i className={`bi bi-chevron-${profileOpen ? 'up' : 'down'} ms-1 profile-chevron`}></i>
                </button>

                {profileOpen && (
                    <div className="profile-popover" role="menu">
                        {/* Header */}
                        <div className="profile-header">
                            <div className="profile-avatar">
                                <i className="bi bi-person-circle"></i>
                            </div>
                            <div className="profile-identity">
                                <div className="profile-name">{getUserLabel(currentUser)}</div>
                                {currentUser.email && currentUser.name && (
                                    <div className="profile-email">{currentUser.email}</div>
                                )}
                                <div className="profile-badges">
                                    {currentUser.isSiteAdmin === true && (
                                        <span className="profile-badge badge-role-site">
                                            <i className="bi bi-shield-fill-check me-1"></i>Site Admin
                                        </span>
                                    )}
                                    {currentUser.subscriptionRoleName && (
                                        <span className={`profile-badge ${getRoleBadgeClass(currentUser.subscriptionRoleName)}`}>
                                            {getRoleLabel(currentUser.subscriptionRoleName)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Subscriptions */}
                        <div className="profile-section-label">Subscriptions</div>
                        <div className="profile-subscriptions">
                            {!subsLoaded && (
                                <div className="profile-subs-loading">
                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                    Loading…
                                </div>
                            )}
                            {subsLoaded && subscriptions.length === 0 && (
                                <div className="profile-subs-empty">No subscriptions found.</div>
                            )}
                            {subsLoaded && subscriptions.map((sub, idx) => {
                                const isCurrent = currentViewedSubscriptionId &&
                                    sub.subscriptionId === currentViewedSubscriptionId;
                                const displayName = sub.owningUserName || sub.owningUserEmail || `Subscription ${sub.subscriptionId}`;
                                return (
                                    <button
                                        key={idx}
                                        className={`profile-sub-item${isCurrent ? ' profile-sub-current' : ''}`}
                                        onClick={() => onSubscriptionClick(sub)}
                                        style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                                    >
                                        <div className="profile-sub-info">
                                            <span className="profile-sub-name">
                                                {isCurrent && <i className="bi bi-check-circle-fill me-1 text-success"></i>}
                                                {displayName}
                                            </span>
                                            <span className="profile-sub-tier">{sub.subscriptionTierName}</span>
                                        </div>
                                        <span className={`profile-badge ${getRoleBadgeClass(sub.roleName)}`}>
                                            {getRoleLabel(sub.roleName)}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                        {/* Logout footer */}
                        <div className="profile-footer">
                            <button className="profile-logout-btn" onClick={onLogoutClick}>
                                <i className="bi bi-box-arrow-right me-2"></i>Log Out
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    const renderNavBarItems = (navBarRowDefinition) => {
        if(navBarRowDefinition.metadata!=undefined){
            return(
                navBarRowDefinition.metadata.map((item, index) => (
                    navBarRowDefinition.render(item)
                ))
            );
        }
    }

    return (
        <nav className="navbar navbar-default navbar-expand">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">{ navBarRowDefinition.title }</a>
                <div className="navbar navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav nav me-auto mb-2 mb-lg-0" id="navbarSupportedContent">
                        { renderNavBarItems(navBarRowDefinition) }
                        <li className="nav-item">
                            { isUserLoggedIn()
                                ? renderProfileDropdown()
                                : <a className="nav-link" aria-current="page" onClick={ onSignInClick }>Log In</a>
                            }
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

NavBarComponent.propTypes = {
    title: PropTypes.string,
    navBarElements: PropTypes.array,
    currentPage: PropTypes.string,
    currentUser: PropTypes.object
}

export default connect(null, null)(NavBarComponent);