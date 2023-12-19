'use strict'
import jQuery from 'jquery';
import React, { useRouteMatch, useState} from 'react';
import ReactDOM from 'react-dom';
import { Provider, useSelector } from 'react-redux';
import { BrowserRouter, Route, DefaultRoute, Routes } from 'react-router-dom'
import HeaderComponent from 'Apps/Common/HeaderComponent'
import FooterComponent from 'Apps/Common/FooterComponent'
import HomePage from './Pages/HomePage'
import PublicRadarPage from './Pages/PublicRadarPage'
import SecureRadarPage from './Pages/SecureRadarPage'
import SearchPage from './Pages/SearchPage'
import DetailsPage from './Pages/DetailsPage'
import AboutPage from './Pages/AboutPage'
import UserPage from 'Apps/Common/Pages/UserPage'
import ErrorBoundaryComponent from 'SharedComponents/ErrorBoundaryComponent'
import { appsProviderStore } from 'Apps/Common/ProviderStore'
import { StaticDataLoader } from 'Apps/Common/StaticDataLoader'
import NavBarRowDefinition from './NavBarRowDefinition'
import { isValid } from 'Apps/Common/Utilities'

export default function MainSiteApp() {
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
            <HeaderComponent doneLoadingNotifier = { handleDoneLoading } navBarRowDefinition = { NavBarRowDefinition(currentUser, currentPage) } userDetailsRoute="/userDetails"/>
            {isUserLoaded(currentUser)
                ? isUserLoggedIn(currentUser)
                    ? <Routes>
                          <Route path="/" element={ <HomePage /> } />
                          <Route path="/home/user/:userId/radars" element={ <SecureRadarPage mostRecent={ true } /> } />
                          <Route path="/home/user/:userId/radars?mostrecent=true" element={ <SecureRadarPage mostRecent={ true } /> } />
                          <Route path="/home/user/:userId/radar/:radarId" element={ <SecureRadarPage mostRecent={ true }/> } />
                          <Route path="/home/user/:userId/radartemplate/:radarTemplateId/radars" element={ <SecureRadarPage /> } />
                          <Route path="/home/user/:userId/radartemplate/:radarTemplateId/radars/fullView" element={ <SecureRadarPage fullView={true}/> } />
                          <Route path="/home/user/:userId/radartemplate/:radarTemplateId/radars/mostRecent" element={ <SecureRadarPage mostRecent={true}/> } />
                          <Route path="/search" element={ <SearchPage /> } />
                          <Route path="/public/radarsubject/:subjectId" element={ <DetailsPage /> } />
                          <Route path="/about" element={ <AboutPage /> } />
                          <Route path="/userDetails" element= { <UserPage authenticatedUser={ currentUser } /> } />
                      </Routes>
                    : <Routes>
                            <Route path="/" element={ <HomePage /> } />
                          <Route path="/home/user/:userId/radars" element={ <PublicRadarPage mostRecent={ true } /> } />
                          <Route path="/home/user/:userId/radars?mostrecent=true" element={ <PublicRadarPage mostRecent={ true } /> } />
                          <Route path="/home/user/:userId/radar/:radarId" element={ <PublicRadarPage mostRecent={ true }/> } />
                          <Route path="/home/user/:userId/radartemplate/:radarTemplateId/radars" element={ <PublicRadarPage /> } />
                          <Route path="/home/user/:userId/radartemplate/:radarTemplateId/radars/fullView" element={ <PublicRadarPage fullView={true}/> } />
                          <Route path="/home/user/:userId/radartemplate/:radarTemplateId/radars/mostRecent" element={ <PublicRadarPage mostRecent={true}/> } />
                          <Route path="/search" element={ <SearchPage /> } />
                          <Route path="/public/radarsubject/:subjectId" element={ <DetailsPage /> } />
                          <Route path="/about" element={ <AboutPage /> } />
                          <Route path="/userDetails" element= { <UserPage authenticatedUser={ currentUser } /> } />
                     </Routes>
              : <div/>
            }
            <FooterComponent />
        </div>
    );
}

ReactDOM.render(
    <Provider store={ appsProviderStore }>
        <BrowserRouter>
            <MainSiteApp/>
        </BrowserRouter>
    </Provider>,
    document.getElementById("radarAppContent")
);