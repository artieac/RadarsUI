'use strict'
import jQuery from 'jquery';
import React, { useState, useLayoutEffect, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux"
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import NavBarComponent from 'SharedComponents/NavBarComponent'
import { UserRepository } from 'Repositories/UserRepository'
import { setCurrentUser } from 'Redux/UserReducer'
import NavBarRowDefinition from './NavBarRowDefinition'
import { RestClient } from 'Repositories/RestClient'

export const HeaderComponent = ({ doneLoadingNotifier }) => {
    const dispatch = useDispatch();

    const currentUser = useSelector((state) => state.userReducer.currentUser);
    const currentPage = "";

    useEffect(() => {
        let userRepository = new UserRepository();
        userRepository.getUser(getUserResponseHandler);
    }, []);

    const getUserResponseHandler = (wasSuccessful, data) => {
        if(wasSuccessful==true){
            dispatch(setCurrentUser(data));
        }

        doneLoadingNotifier();
    }

    const buildLoginUrl = (loginUrl) => {
        let restClient = new RestClient();
        return restClient.webServiceUrlRoot + loginUrl;
    }

    return (
        <div>
            <NavBarComponent title="Technology Radar" navBarRowDefinition={ NavBarRowDefinition(currentUser, currentPage) } currentUser = { currentUser } loginUrl= { buildLoginUrl("/login") }  />
        </div>
    );
};

export default HeaderComponent;