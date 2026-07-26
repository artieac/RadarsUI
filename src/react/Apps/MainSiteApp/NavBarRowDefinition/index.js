'use strict'
import React from 'react';
import { isValid } from 'Apps/Common/Utilities'
import NavBarItem from 'SharedComponents/NavBarComponent/NavBarItem'
import ConfigurationSettings from 'Apps/Common/ConfigurationSettings'

export const NavBarRowDefinition = (currentUser, currentPage) => {
    let configurationSettings = new ConfigurationSettings();

   return (
   {
       title: "Radars",
       loginUrl: configurationSettings.getWebServiceUrlRoot() + "/login",
       userDetailsRoute: "/userDetails",
       metadata: [
        {
            label: 'Home',
            loggedInOnly: true,
            internal: true,
            roles: '',
            // Use subscriptionId-based URL; falls back gracefully if subscriptionId not yet loaded
            target: isValid(currentUser.currentlyViewedSubscriptionId) && currentUser.currentlyViewedSubscriptionId > 0
                ? '/home/subscription/' + currentUser.currentlyViewedSubscriptionId + '/radars'
                : '/'
        },
        {
            label: 'Search',
            loggedInOnly: false,
            internal: true,
            roles: '',
            target: '/search',
        },
        {
            label: 'Account Management',
            loggedInOnly: true,
            internal: false,
            roles: 'ROLE_ACCOUNT_ADMIN',
            target: configurationSettings.getManageRadarsUrlRoot()
        },
        {
            label: 'Admin',
            loggedInOnly: true,
            internal: false,
            roles: "ROLE_SITE_ADMIN",
            target: configurationSettings.getAdminRadarsUrlRoot()
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
