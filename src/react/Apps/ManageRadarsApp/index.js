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
import NavBarRowDefinition from './NavBarRowDefinition'

export default function ManageRadarsApp() {
    const [isLoading, setIsLoading] = useState(false);

    const authenticatedUser = useSelector((state) => state.userReducer.currentUser);
    const currentPage = "";

    const handleDoneLoading = () => {
        setIsLoading(false);
    }

    return (
        <div>
            <HeaderComponent doneLoadingNotifier = { handleDoneLoading } navBarRowDefinition = { NavBarRowDefinition(authenticatedUser, currentPage) }/>
            {isLoading
                ? <div/>
                : <Routes>
                    <Route path="/" element={ <HomePage />} />
                    <Route path="/radarTemplates" element={ <ManageRadarTemplatesPage />} />
                    <Route path="/associatedRadarTemplates" element={ <ManageAssociatedRadarTemplatesPage />} />
                    <Route path="/radars" element={ <ManageRadarsPage authenticatedUser = { authenticatedUser } /> } />
                    <Route path="/user/:userId/radar/:destinationRadarId/addfromprevious" element={ <AddFromPreviousRadarPage />} />
                    <Route path="/teams" element={ <ManageTeamsPage /> } />
                </Routes>
            }
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