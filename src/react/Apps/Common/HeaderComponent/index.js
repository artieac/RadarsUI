'use strict'
import jQuery from 'jquery';
import React, { useState, useLayoutEffect, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux"
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import NavBarComponent from 'SharedComponents/NavBarComponent'
import { UserRepository } from 'Repositories/UserRepository'
import { setCurrentUser, setViewedSubscription } from 'Redux/UserReducer'
import { RestClient } from 'Repositories/RestClient'

/**
 * Picks the best default subscription from the user's subscriptions list.
 *
 * Priority:
 *  1. The subscription whose id appears in the current URL path
 *     (matches /subscription/{id}/ or /account/{id}/)
 *  2. The first subscription where the user is AccountAdmin
 *  3. The first subscription in the list
 *
 * @param {Array} subscriptions - list of UserSubscriptionViewModel objects from /api/User/Subscriptions
 * @returns {object|null}
 */
function pickDefaultSubscription(subscriptions) {
    if (!subscriptions || subscriptions.length === 0) return null;

    // 1. Match URL
    const pathMatch = window.location.pathname.match(/\/(?:subscription|account)\/(\d+)(?:\/|$)/);
    if (pathMatch) {
        const urlSubId = parseInt(pathMatch[1], 10);
        const matched = subscriptions.find(s => s.subscriptionId === urlSubId);
        if (matched) return matched;
    }

    // 2. First AccountAdmin subscription
    const adminSub = subscriptions.find(s => s.roleName && s.roleName.includes('ACCOUNT_ADMIN'));
    if (adminSub) return adminSub;

    // 3. Fallback to first
    return subscriptions[0];
}

export const HeaderComponent = ({ doneLoadingNotifier, navBarRowDefinition }) => {
    const dispatch = useDispatch();

    const currentUser = useSelector((state) => state.userReducer.currentUser);
    const currentPage = "";

    useEffect(() => {
        let userRepository = new UserRepository();
        userRepository.getUser(getUserResponseHandler);
    }, []);

    const getUserResponseHandler = (wasSuccessful, data) => {
        if (wasSuccessful == true) {
            // Dispatch identity fields (name, email, id, isSiteAdmin, isAuthenticated).
            // Subscription context (subscriptionRoleName, canSeeFullView, tier limits) will
            // be set separately via setViewedSubscription so it always reflects the
            // *currently viewed* subscription, not just the owned one.
            dispatch(setCurrentUser(data));

            // Fix A2: immediately fetch all subscriptions the user belongs to and
            // initialise the viewed-subscription context from the best match.
            let userRepository = new UserRepository();
            userRepository.getUserSubscriptions((subsSuccess, subscriptions) => {
                if (subsSuccess && Array.isArray(subscriptions) && subscriptions.length > 0) {
                    const best = pickDefaultSubscription(subscriptions);
                    if (best) {
                        dispatch(setViewedSubscription(best));
                    }
                }
            });
        } else {
            dispatch(setCurrentUser({ isAuthenticated: false }));
        }

        doneLoadingNotifier();
    }

    const buildLoginUrl = (loginUrl) => {
        let restClient = new RestClient();
        return restClient.getWebServiceUrlRoot() + loginUrl;
    }

    return (
        <div>
            <NavBarComponent navBarRowDefinition={ navBarRowDefinition } currentUser = { currentUser } loginUrl= { buildLoginUrl("/login") }  />
        </div>
    );
};

export default HeaderComponent;