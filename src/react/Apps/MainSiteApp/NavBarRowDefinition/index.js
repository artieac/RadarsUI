'use strict'
import React from 'react';
import { isValid } from 'Apps/Common/Utilities'
import NavBarItem from 'SharedComponents/NavBarComponent/NavBarItem'

export const NavBarRowDefinition = (currentUser, currentPage) => {
   return (
   {
       metadata: [
        {
            label: 'Home',
            loggedInOnly: true,
            internal: true,
            roles: '',
            target: '/home/secureradar'
        },
        {
            label: 'Search',
            loggedInOnly: false,
            internal: true,
            roles: '',
            target: '/search',
        },
        {
            label: 'Manage Radars',
            loggedInOnly: true,
            roles: '',
            target: "http://manage.technologyradar.alwaysmoveforward.com"
        },
        {
            label: 'Admin',
            loggedInOnly: true,
            internal: false,
            roles: "ROLE_ADMIN",
            target: "http://admin.technologyradar.alwaysmoveforward.com"
        },
        {
            label: 'About',
            loggedInOnly: false,
            roles: '',
            target: '/about',
        }
       ],
       render: rowData => {
           return <NavBarItem rowData = { rowData } currentPage = { currentPage } currentUser = { currentUser }/>
       }
   });
};

export default NavBarRowDefinition;
