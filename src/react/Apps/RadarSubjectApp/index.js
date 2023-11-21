import jQuery from 'jquery';
import React, { useRouteMatch, useState} from 'react';
import ReactDOM from 'react-dom';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SearchPage from './Pages/SearchPage'
import DetailsPage from './Pages/DetailsPage'
import ErrorBoundaryComponent from 'SharedComponents/ErrorBoundaryComponent'
import { appsProviderStore } from '../Common/ProviderStore'
import { StaticDataLoader } from '../Common/StaticDataLoader'

export default function RadarSubjectApp() {
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
                      <Route path="/public/radarsubject/search" element={ <SearchPage /> } />
                      <Route path="/public/radarsubject/:subjectId" element={ <DetailsPage /> } />
                  </Routes>
            }
        </div>
    );
}

ReactDOM.render(
    <Provider store={ appsProviderStore }>
        <BrowserRouter>
            <RadarSubjectApp/>
        </BrowserRouter>
    </Provider>,
    document.getElementById("radarSubjectAppContent")
);