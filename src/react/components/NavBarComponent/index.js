import React from 'react';
import PropTypes from 'prop-types'
import { connect, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { isValid } from 'Apps/Common/Utilities'
import ConfigurationSettings from 'Apps/Common/ConfigurationSettings'
import "./component.css"

const NavBarComponent = ({ navBarRowDefinition, currentUser, loginUrl }) => {
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

    const renderLoginElement = () => {
        if(isUserLoggedIn(currentUser)){
            return (
                <Link className="nav-link" aria-current="page" to={ navBarRowDefinition.userDetailsRoute } > { getUserLabel(currentUser) }</Link>
            );
        } else {
            return (
                <a className="nav-link" aria-current="page" onClick={ onSignInClick } >Log In</a>
            );
        }
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
                            { renderLoginElement() }
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