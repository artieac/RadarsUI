'use strict'
import jQuery from 'jquery';
import React, { useRouteMatch, useState} from 'react';
import ReactDOM from 'react-dom';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PublicRadarPage from './Pages/PublicRadarPage'
import SecureRadarPage from './Pages/SecureRadarPage'
import ErrorBoundaryComponent from 'SharedComponents/ErrorBoundaryComponent'
import { appsProviderStore } from '../Common/ProviderStore'
import { StaticDataLoader } from '../Common/StaticDataLoader'

export default function RadarApp() {
    const [isLoading, setIsLoading] = useState(true);

    const handleDoneLoading = () => {
        setIsLoading(false);
    }

    return (
        <div>
            <StaticDataLoader doneLoadingNotifier = { handleDoneLoading }/>
            {isLoading
                ? <div/>
                : <Routes>
                      <Route path="public/home/user/:userId/radars" element={ <PublicRadarPage mostRecent={ true } /> } />
                      <Route path="public/home/user/:userId/radars?mostrecent=true" element={ <PublicRadarPage mostRecent={ true } /> } />
                      <Route path="public/home/user/:userId/radar/:radarId" element={ <PublicRadarPage mostRecent={ true }/> } />
                      <Route path="/public/home/user/:userId/radartemplate/:radarTemplateId/radars" element={ <PublicRadarPage /> } />
                      <Route path="home/secureradar" element={ <SecureRadarPage /> } />
                      <Route path="home/secureradar/:radarId" element={ <SecureRadarPage /> } />
                  </Routes>
            }
        </div>
    );
}

ReactDOM.render(
    <Provider store={ appsProviderStore }>
        <BrowserRouter>
            <RadarApp/>
        </BrowserRouter>
    </Provider>,
    document.getElementById("radarAppContent")
);