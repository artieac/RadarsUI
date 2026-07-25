'use strict'
import jQuery from 'jquery';
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk'
import { Provider, useSelector } from 'react-redux';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import userReducer from 'Redux/UserReducer';
import radarReducer from 'Redux/RadarReducer';
import radarTemplateReducer from 'Redux/RadarTemplateReducer';
import HeaderComponent from 'Apps/Common/HeaderComponent'
import FooterComponent from 'Apps/Common/FooterComponent'
import ManageUsersPage from './Pages/ManageUsersPage'
import AdminRadarPage from './Pages/AdminRadarPage'
import SubscriptionTiersPage from './Pages/SubscriptionTiersPage'
import SubscriptionsPage from './Pages/SubscriptionsPage'
import AdminLayout from './AdminLayout'
import NavBarRowDefinition from './NavBarRowDefinition'
import { isValid } from 'Apps/Common/Utilities'

const adminAppStore = createStore(combineReducers({userReducer, radarReducer, radarTemplateReducer}), applyMiddleware(thunk));

export default function AdminApp() {
    const [isLoading, setIsLoading] = useState(false);

    const currentUser = useSelector((state) => state.userReducer.currentUser);
    const currentPage = "";

    const handleDoneLoading = () => {
        setIsLoading(false);
    }

    const isAdmin = !isLoading
        && isValid(currentUser)
        && currentUser.isAuthenticated === true
        && currentUser.isSiteAdmin === true;

    return (
        <div>
            <HeaderComponent doneLoadingNotifier={ handleDoneLoading } navBarRowDefinition={ NavBarRowDefinition(currentUser, currentPage) }/>
            {isAdmin
                ? <AdminLayout>
                    <Routes>
                        <Route path="/" element={ <Navigate to="/admin/manageusers" replace /> } />
                        <Route path="/admin/manageusers" element={ <ManageUsersPage/> } />
                        <Route path="/admin/subscriptiontiers" element={ <SubscriptionTiersPage/> } />
                        <Route path="/admin/subscriptions" element={ <SubscriptionsPage/> } />
                        <Route path="/admin/user/:userId/radars" element={ <AdminRadarPage mostRecent={ true } /> } />
                        <Route path="/admin/user/:userId/radar/:radarId" element={ <AdminRadarPage mostRecent={ true } /> } />
                        <Route path="/admin/user/:userId/radar/:radarId/quadrant/:quadrantName" element={ <AdminRadarPage mostRecent={ true } /> } />
                        <Route path="/admin/user/:userId/radartemplate/:radarTemplateId/radars" element={ <AdminRadarPage /> } />
                        <Route path="/admin/user/:userId/radartemplate/:radarTemplateId/radars/mostRecent" element={ <AdminRadarPage mostRecent={ true } /> } />
                        <Route path="/admin/user/:userId/radartemplate/:radarTemplateId/radars/fullView" element={ <AdminRadarPage fullView={ true } /> } />
                    </Routes>
                  </AdminLayout>
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
