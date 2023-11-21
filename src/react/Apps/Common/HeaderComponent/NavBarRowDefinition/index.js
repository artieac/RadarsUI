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
            target: '/',
            secureTarget: '/home/secureradar'
        },
        {
            label: 'Search',
            target: '/search',
            secureTarget: '/search'
        },
        {
            label: 'About',
            target: '/about',
            secureTarget: '/about'
        }
       ],
       render: rowData => {
           return <NavBarItem rowData = { rowData } currentPage = { currentPage } currentUser = { currentUser }/>
       }
   });
};

export default NavBarRowDefinition;
