'use strict'
import jQuery from 'jquery';
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk'
import { Provider, connect, useSelector } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import userReducer from 'Redux/UserReducer';
import teamReducer from 'Redux/TeamReducer';
import radarReducer from 'Redux/RadarReducer';
import radarTemplateReducer from 'Redux/RadarTemplateReducer';
import HeaderComponent from 'Apps/Common/HeaderComponent'
import FooterComponent from 'Apps/Common/FooterComponent'
import HomePage from './Pages/HomePage'
import ManageUsersPage from './Pages/ManageUsersPage'
import AdminRadarPage from './Pages/AdminRadarPage'
import NavBarRowDefinition from './NavBarRowDefinition'
import { isValid } from 'Apps/Common/Utilities'

const adminAppStore = createStore(combineReducers({userReducer, teamReducer, radarReducer, radarTemplateReducer}), applyMiddleware(thunk));

export default function AdminApp() {
    const [isLoading, setIsLoading] = useState(false);

    const currentUser = useSelector((state) => state.userReducer.currentUser);
    const currentPage = "";

    const handleDoneLoading = () => {
        setIsLoading(false);
    }

    return (
        <div>
            <HeaderComponent doneLoadingNotifier = { handleDoneLoading } navBarRowDefinition = { NavBarRowDefinition(currentUser, currentPage) }/>
            {!isLoading && isValid(currentUser) && currentUser.isAuthenticated==true && isValid(currentUser.role) && currentUser.role.name=="ROLE_ADMIN"
                ? <Routes>
                    <Route path="/" element={ <HomePage authenticatedUser={ currentUser }/> } />
                    <Route path="/admin/manageusers" element={ <ManageUsersPage/> } />
                    <Route path="/admin/user/:userId/radars" element={ <AdminRadarPage mostRecent={ true } /> } />
                    <Route path="/admin/user/:userId/radar/:radarId" element={ <AdminRadarPage mostRecent={ true } /> } />
                    <Route path="/admin/user/:userId/radar/:radarId/quadrant/:quadrantName" element={ <AdminRadarPage mostRecent={ true } /> } />
                    <Route path="/admin/user/:userId/radartemplate/:radarTemplateId/radars" element={ <AdminRadarPage /> } />
                    <Route path="/admin/user/:userId/radartemplate/:radarTemplateId/radars/mostRecent" element={ <AdminRadarPage mostRecent={ true } /> } />
                    <Route path="/admin/user/:userId/radartemplate/:radarTemplateId/radars/fullView" element={ <AdminRadarPage fullView={ true } /> } />
                  </Routes>
                 : <div/>
             }
            <FooterComponent />
        </div>
    );
}

createRoot(document.getElementById("adminAppContent")).render(
    <Provider store={ adminAppStore }>
        <BrowserRouter>
            <AdminApp/>
        </BrowserRouter>
    </Provider>
);
