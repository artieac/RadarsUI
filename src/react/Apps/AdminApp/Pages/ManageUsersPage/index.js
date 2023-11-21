'use strict'
import React, { useState, useEffect } from 'react';
import { connect, useSelector, useDispatch } from "react-redux"
import { addUsersToState, addRolesToState} from 'redux/UserReducer';
import { UserRepository } from 'Repositories/UserRepository'
import UserTableBody from './UserTableBody';
import { RoleRepository } from 'Repositories/RoleRepository'
import TableComponent from 'SharedComponents/TableComponent'

const ManageUsersPage = () => {
    const dispatch = useDispatch();

    const userState = userSelector(state.userReducer);

    useEffect(() => {
        let roleRepository = new RoleRepository();
        roleRepository.getAll(handleGetAllRolesResponse);
    }, []);

    const handleGetAllRolesResponse = (wasSuccessful, roles) => {
        if(wasSuccessful==true){
            dispatch(addRolesToState(roles));
        }

        let userRepository = new UserRepository();
        userRepository.getAll(handleGetAllUsersResponse);
    }

    const handleGetAllUsersResponse = (wasSuccessful, users) =>{
        if(wasSuccessful==true){
            dispatch(addUsersToState(users));
        }
    }

    return (
        <div className="bodyContent">
            <div className="contentPageTitle">
                <label>Manage Radar Users</label>
            </div>
            <p>Work with the users of this site.</p>
           <TableComponent
               data={ userState.users }
               cols={ teamColumnMap(userState.roles)}
               hoverable
               striped
               bordered={false}/>
        </div>
    );
};