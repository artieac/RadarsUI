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
                if(rowData.roles==currentUser.role.name){
                    return renderNavBarItem(rowData.label, rowData.target, rowData.internal);
                } else {
                    return null;
                }
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