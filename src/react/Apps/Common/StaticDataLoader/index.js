'use strict'
import React, { useState, useLayoutEffect, useEffect } from 'react';
import { connect, useSelector, useDispatch } from "react-redux"
import t from 'prop-types'
import { UserRepository } from 'Repositories/UserRepository'
import { setCurrentUser } from 'Redux/UserReducer'

export const StaticDataLoader = ({ doneLoadingNotifier }) => {
    const dispatch = useDispatch();

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

    return (
        <div className="d-none"/>
    );
};