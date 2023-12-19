'use strict'
import jQuery from 'jquery';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'
import { Provider, connect, useSelector } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import userReducer from 'Redux/UserReducer';
import HeaderComponent from 'Apps/Common/HeaderComponent'
import FooterComponent from 'Apps/Common/FooterComponent'
import HomePage from './Pages/HomePage'
import NavBarRowDefinition from './NavBarRowDefinition'
import { isValid } from 'Apps/Common/Utilities'

const adminAppStore = createStore(combineReducers({userReducer}), applyMiddleware(thunk));

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
                  </Routes>
                 : <div/>
             }
            <FooterComponent />
        </div>
    );
}

ReactDOM.render(
    <Provider store={ adminAppStore }>
        <BrowserRouter>
            <AdminApp/>
        </BrowserRouter>
    </Provider>,
    document.getElementById("adminAppContent")
);
