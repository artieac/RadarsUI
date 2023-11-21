import React, { useState,useEffect } from 'react'
import { Link } from 'react-router-dom'
import { isValid } from 'Apps/Common/Utilities'

export const NavBarItem = ({ rowData, currentPage, currentUser }) => {
    if(isValid(currentUser) && isValid(currentUser.id) && currentUser.id > 0){
         return (
             <li className={ rowData.label==currentPage ? "nav-item active" : "nav-item"}>
                 <Link className="nav-link" aria-current="page" to={ rowData.secureTarget } >{ rowData.label }</Link>
             </li>
         );
    }

    return (

        <li className={ rowData.label==currentPage ? "nav-item active" : "nav-item"}>
            <Link className="nav-link" aria-current="page" to={ rowData.target } >{ rowData.label }</Link>
        </li>
    );
}

export default NavBarItem;