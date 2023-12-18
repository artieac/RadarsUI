'use strict'
import jQuery from 'jquery'
import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { connect, useSelector } from "react-redux"
import { appsProviderStore } from 'Apps/Common/ProviderStore'
import HeaderComponent from 'Apps/Common/HeaderComponent'
import FooterComponent from 'Apps/Common/FooterComponent'
import HomePage from './Pages/HomePage'
import ManageRadarTemplatesPage from './Pages/ManageRadarTemplatesPage'
import ManageAssociatedRadarTemplatesPage from './Pages/ManageAssociatedRadarTemplatesPage'
import ManageRadarsPage from './Pages/ManageRadarsPage'
import AddFromPreviousRadarPage from './Pages/AddFromPreviousRadarPage'
import ManageTeamsPage from './Pages/ManageTeamsPage'
import UserPage from 'Apps/Common/Pages/UserPage'
import NavBarRowDefinition from './NavBarRowDefinition'
import { isValid } from 'Apps/Common/Utilities'

export default function ManageRadarsApp() {
    const [isLoading, setIsLoading] = useState(false);

    const currentUser = useSelector((state) => state.userReducer.currentUser);
    const currentPage = "";

    const handleDoneLoading = () => {
        setIsLoading(false);
    }

    const isUserLoaded = (testUser) => {
        if(isLoading==false && isValid(testUser) && !isValid(testUser.unloaded)){
            return true;
        }
        return false;
    }

    const isUserLoggedIn = (testUser) => {
        if(isUserLoaded(testUser) && testUser.isAuthenticated==true){
            return true;
        }

        return false;
    }

    return (
        <div>
            <HeaderComponent doneLoadingNotifier = { handleDoneLoading } navBarRowDefinition = { NavBarRowDefinition(currentUser, currentPage) } />
            {isUserLoggedIn(currentUser)
                ? <Routes>
                    <Route path="/" element={ <HomePage />} />
                    <Route path="/radarTemplates" element={ <ManageRadarTemplatesPage />} />
                    <Route path="/associatedRadarTemplates" element={ <ManageAssociatedRadarTemplatesPage />} />
                    <Route path="/radars" element={ <ManageRadarsPage authenticatedUser = { currentUser } /> } />
                    <Route path="/radars/user/:userId/radar/:destinationRadarId/addfromprevious" element={ <AddFromPreviousRadarPage />} />
                    <Route path="/teams" element={ <ManageTeamsPage /> } />
                    <Route path="/userDetails" element={ <UserPage authenticatedUser={ currentUser } />} />
                  </Routes>
                : <div/>
            }
            <FooterComponent/>
        </div>
    );
}

ReactDOM.render(
    <Provider store={ appsProviderStore }>
        <BrowserRouter>
            <ManageRadarsApp />
        </BrowserRouter>
    </Provider>,
    document.getElementById("manageRadarsAppContent")
);