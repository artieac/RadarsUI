'use strict'
import React from 'react';
import { isValid } from 'Apps/Common/Utilities'
import NavBarItem from 'SharedComponents/NavBarComponent/NavBarItem'

export const NavBarRowDefinition = (currentUser, currentPage) => {
   return (
   {
       metadata: [
        {
            label: 'View Radars',
            loggedInOnly: false,
            internal: false,
            roles: '',
            target: "http://technologyradar.alwaysmoveforward.com"
        },
        {
            label: 'Manage Radars',
            loggedInOnly: true,
            internal: true,
            roles: '',
            target: "/"
        },
        {
            label: 'Admin',
            loggedInOnly: true,
            internal: false,
            roles: "Admin",
            target: "http://admin.technologyradar.alwaysmoveforward.com"
        },
        {
            label: 'Search',
            loggedInOnly: false,
            internal: false,
            roles: '',
            target: 'https://technologyradar.alwaysmoveforward.com/search',
        },
        {
            label: 'About',
            internal: false,
            loggedInOnly: false,
            roles: '',
            target: 'https://technologyradar.alwaysmoveforward.com/about',
        }
       ],
       render: rowData => {
           return <NavBarItem rowData = { rowData } currentPage = { currentPage } currentUser = { currentUser }/>
       }
   });
};

export default NavBarRowDefinition;
