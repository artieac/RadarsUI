'use strict'
import React from 'react';
import { isValid } from 'Apps/Common/Utilities'
import NavBarItem from 'SharedComponents/NavBarComponent/NavBarItem'
import ConfigurationSettings from 'Apps/Common/ConfigurationSettings'

export const NavBarRowDefinition = (currentUser, currentPage) => {
    let configurationSettings = new ConfigurationSettings();

   return (
   {
       metadata: [
        {
            label: 'Home',
            loggedInOnly: true,
            internal: true,
            roles: '',
            target: configurationSettings.getMainSiteUrlRoot() + '/home/secureradar'
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
            target: configurationSettings.getManageRadarsUrlRoot()
        },
        {
            label: 'Admin',
            loggedInOnly: true,
            internal: false,
            roles: "ROLE_ADMIN",
            target: "/"
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
