'use strict'
import React from 'react';
import { isValid } from 'Apps/Common/Utilities'
import NavBarItem from 'SharedComponents/NavBarComponent/NavBarItem'
import ConfigurationSettings from 'Apps/Common/ConfigurationSettings'

export const NavBarRowDefinition = (currentUser, currentPage) => {
    let configurationSettings = new ConfigurationSettings();

   return (
   {
       title: "Manage Radars",
       loginUrl: configurationSettings.getWebServiceUrlRoot() + "/login",
       userDetailsRoute: "/userDetails",
       metadata: [
        {
            label: 'View Radars',
            loggedInOnly: false,
            internal: false,
            roles: '',
            target: configurationSettings.getMainSiteUrlRoot()
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
            roles: "ROLE_ADMIN",
            target: configurationSettings.getAdminRadarsUrlRoot()
        },
        {
            label: 'Search',
            loggedInOnly: false,
            internal: false,
            roles: '',
            target: configurationSettings.getMainSiteUrlRoot() + '/search',
        },
        {
            label: 'About',
            internal: false,
            loggedInOnly: false,
            roles: '',
            target: configurationSettings.getMainSiteUrlRoot() + '/about',
        }
       ],
       render: rowData => {
           return <NavBarItem rowData = { rowData } currentPage = { currentPage } currentUser = { currentUser }/>
       }
   });
};

export default NavBarRowDefinition;
