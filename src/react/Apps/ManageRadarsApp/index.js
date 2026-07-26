'use strict'
import jQuery from 'jquery'
import React, { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter, Route, Routes, Navigate, useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from "react-redux"
import { appsProviderStore } from 'Apps/Common/ProviderStore'
import HeaderComponent from 'Apps/Common/HeaderComponent'
import FooterComponent from 'Apps/Common/FooterComponent'
import AddFromPreviousRadarPage from './Pages/AddFromPreviousRadarPage'
import UserPage from 'Apps/Common/Pages/UserPage'
import AccountManagementLayout from './AccountManagementLayout'
import NavBarRowDefinition from './NavBarRowDefinition'
import { isValid } from 'Apps/Common/Utilities'
import { setViewedSubscription } from 'Redux/UserReducer'

/**
 * Inner component that reads :subscriptionId from the URL, syncs it to Redux
 * if it has changed, then renders AccountManagementLayout.
 *
 * This is the core of Fix C: every account management URL now carries the
 * subscriptionId so the browser URL is the source of truth for which
 * subscription is being managed.  The NavBar green check mark works because
 * getCurrentViewedSubscriptionId() matches /account/{id}/.
 */
const AccountManagementWithSubscription = () => {
    const { subscriptionId } = useParams();
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.userReducer.currentUser);

    useEffect(() => {
        // If the URL's subscriptionId differs from what Redux currently has,
        // update Redux.  This handles deep-links and back/forward navigation.
        const urlSubId = parseInt(subscriptionId, 10);
        if (isValid(currentUser) && currentUser.subscriptionId !== urlSubId) {
            // We don't have the full subscription tier data here, so just
            // patch the subscriptionId.  HeaderComponent's A2 fix will have
            // already dispatched setViewedSubscription with full data on mount;
            // this handles the edge case of URL-driven navigation changing sub.
            dispatch(setViewedSubscription({
                ...currentUser,
                subscriptionId: urlSubId,
            }));
        }
    }, [subscriptionId]);

    return <AccountManagementLayout />;
};

/**
 * Redirect component: when the user hits the root of the manage site with no
 * subscription in the URL, redirect to /account/{subscriptionId}/ using the
 * subscriptionId that HeaderComponent resolved via Fix A2.
 *
 * Falls back to /account/0/ (which will render the Access Restricted view)
 * if no subscription is available yet.
 */
const DefaultSubscriptionRedirect = () => {
    const currentUser = useSelector((state) => state.userReducer.currentUser);

    if (!isValid(currentUser) || isValid(currentUser.unloaded)) {
        // Still loading — don't redirect yet, render nothing
        return <div />;
    }

    const subId = currentUser.subscriptionId || 0;
    return <Navigate to={`/account/${subId}/`} replace />;
};

export default function ManageRadarsApp() {
    const [isLoading, setIsLoading] = useState(false);

    const currentUser = useSelector((state) => state.userReducer.currentUser);
    const currentPage = "";

    const handleDoneLoading = () => {
        setIsLoading(false)
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
                        {/* Fix C: subscription ID is now in the URL.
                            /account/:subscriptionId/* catches all sub-paths. */}
                        <Route path="/account/:subscriptionId/*" element={ <AccountManagementWithSubscription /> } />
                        <Route path="/radars/user/:userId/radar/:destinationRadarId/addfromprevious" element={ <AddFromPreviousRadarPage /> } />
                        <Route path="/userDetails" element={ <UserPage authenticatedUser={ currentUser } /> } />
                        {/* Redirect root and any unmatched path to the default subscription */}
                        <Route path="/*" element={ <DefaultSubscriptionRedirect /> } />
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