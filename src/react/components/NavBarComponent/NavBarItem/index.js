import React, { useState,useEffect } from 'react'
import { Link } from 'react-router-dom'
import { isValid } from 'Apps/Common/Utilities'

export const NavBarItem = ({ rowData, currentPage, currentUser }) => {
    const renderNavBarItem = (label, target, internal) => {
        if(rowData.internal==true){
            return (
                <li key={label} className={ label==currentPage ? "nav-item active" : "nav-item"}>
                     <Link className="nav-link" aria-current="page" to={ target } >{ label }</Link>
                </li>
            );
        } else {
            return (
                <li key={label} className={ label==currentPage ? "nav-item active" : "nav-item"}>
                     <a className="nav-link" aria-current="page" href={ target } >{ label }</a>
                </li>
            );
        }
    }

    const isAuthenticated = (currentUser) => {
        if(isValid(currentUser) && isValid(currentUser.id) && currentUser.id > 0){
            return true;
        }

        return false;
    }

    if(rowData.loggedInOnly){
        if(isAuthenticated(currentUser)){
            if(rowData.roles.length > 0){
                // Site-admin nav items gate on the IsSiteAdmin flag only
                if(rowData.roles === "ROLE_SITE_ADMIN"){
                    return currentUser.isSiteAdmin === true
                        ? renderNavBarItem(rowData.label, rowData.target, rowData.internal)
                        : null;
                }
                // All other role-gated items use the subscription role.
                // ROLE_ACCOUNT_ADMIN items are also visible to site admins.
                const roleMatches = currentUser.subscriptionRoleName === rowData.roles
                    || (rowData.roles === 'ROLE_ACCOUNT_ADMIN' && currentUser.isSiteAdmin === true);
                if(roleMatches){
                    return renderNavBarItem(rowData.label, rowData.target, rowData.internal);
                }
                return null;
            } else {
                return renderNavBarItem(rowData.label, rowData.target, rowData.internal);
            }
        } else {
            return null;
        }
    } else {
        return renderNavBarItem(rowData.label, rowData.target, rowData.internal);
    }
}

export default NavBarItem;