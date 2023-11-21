'use strict'
import jQuery from 'jquery'
import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { connect, useSelector } from "react-redux"
import ManageRadarTemplatesPage from './Pages/ManageRadarTemplatesPage'
import ManageAssociatedRadarTemplatesPage from './Pages/ManageAssociatedRadarTemplatesPage'
import ManageRadarsPage from './Pages/ManageRadarsPage'
import AddFromPreviousRadarPage from './Pages/AddFromPreviousRadarPage'
import ManageTeamsPage from './Pages/ManageTeamsPage'
import HomePage from './Pages/HomePage'
import { appsProviderStore } from '../Common/ProviderStore'
import { StaticDataLoader } from 'Apps/Common/StaticDataLoader'

export default function ManageRadarsApp() {
    const [isLoading, setIsLoading] = useState(true);

    const loggedInUser = useSelector((state) => state.userReducer.currentUser);

    const handleDoneLoading = () => {
        setIsLoading(false);
    }

    return (
        <div>
            <StaticDataLoader doneLoadingNotifier = { handleDoneLoading }/>
            {isLoading
                ? <div/>
                : <Routes>
                    <Route path="/manageradars/index" element={ <HomePage />} />
                    <Route path="/manageradars/radarTemplates" element={ <ManageRadarTemplatesPage />} />
                    <Route path="/manageradars/associatedRadarTemplates" element={ <ManageAssociatedRadarTemplatesPage />} />
                    <Route path="/manageradars/radars" element={ <ManageRadarsPage loggedInUser = { loggedInUser } /> } />
                    <Route path="/manageradars/user/:userId/radar/:destinationRadarId/addfromprevious" element={ <AddFromPreviousRadarPage />} />
                    <Route path="/manageradars/teams" element={ <ManageTeamsPage /> } />
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