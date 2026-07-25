'use strict'
import jQuery from 'jquery'
import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useSelector } from "react-redux"
import { appsProviderStore } from 'Apps/Common/ProviderStore'
import HeaderComponent from 'Apps/Common/HeaderComponent'
import FooterComponent from 'Apps/Common/FooterComponent'
import AddFromPreviousRadarPage from './Pages/AddFromPreviousRadarPage'
import UserPage from 'Apps/Common/Pages/UserPage'
import AccountManagementLayout from './AccountManagementLayout'
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

    const isAccountAdmin = (testUser) => {
        if (!isUserLoggedIn(testUser)) return false;
        return testUser.subscriptionRoleName === 'ROLE_ACCOUNT_ADMIN' || testUser.isSiteAdmin === true;
    }

    return (
        <div>
            <HeaderComponent doneLoadingNotifier = { handleDoneLoading } navBarRowDefinition = { NavBarRowDefinition(currentUser, currentPage) } />
            {isUserLoggedIn(currentUser)
                ? isAccountAdmin(currentUser)
                    ? <Routes>
                        <Route path="/*" element={ <AccountManagementLayout /> } />
                        <Route path="/radars/user/:userId/radar/:destinationRadarId/addfromprevious" element={ <AddFromPreviousRadarPage /> } />
                        <Route path="/userDetails" element={ <UserPage authenticatedUser={ currentUser } /> } />
                      </Routes>
                    : <div className="container mt-5">
                        <div className="alert alert-warning" role="alert">
                            <h4 className="alert-heading">Access Restricted</h4>
                            <p>Account Management is only available to Account Admins. Please contact your account administrator if you believe you should have access.</p>
                        </div>
                      </div>
                : <div/>
            }
            <FooterComponent/>
        </div>
    );
}

createRoot(document.getElementById("manageRadarsAppContent")).render(
    <Provider store={ appsProviderStore }>
        <BrowserRouter>
            <ManageRadarsApp />
        </BrowserRouter>
    </Provider>
);