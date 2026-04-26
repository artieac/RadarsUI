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
import HeaderComponent from 'Apps/Common/HeaderComponent'
import FooterComponent from 'Apps/Common/FooterComponent'
import HomePage from './Pages/HomePage'
import ManageUsersPage from './Pages/ManageUsersPage'
import NavBarRowDefinition from './NavBarRowDefinition'
import { isValid } from 'Apps/Common/Utilities'

const adminAppStore = createStore(combineReducers({userReducer, teamReducer}), applyMiddleware(thunk));

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
