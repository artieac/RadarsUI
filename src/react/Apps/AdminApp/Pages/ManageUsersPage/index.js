'use strict'
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux"
import { addUsersToState, addRolesToState} from 'Redux/UserReducer';
import { UserRepository } from 'Repositories/UserRepository'
import { RoleRepository } from 'Repositories/RoleRepository'
import TableComponent from 'SharedComponents/TableComponent'
import userColumnMap from './usersColumnMap'

const ManageUsersPage = () => {
    const dispatch = useDispatch();

    const userState = useSelector((state) => state.userReducer);

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
            <div className="row">
                <div className="col-md-12">
                    <div className="contentPageTitle">
                        <label>Manage Radar Users</label>
                    </div>
                </div>
            </div>
            <p>Work with the users of this site.</p>
           <TableComponent
               data={ userState.users }
               cols={ userColumnMap(userState.roles)}
               hoverable
               striped
               bordered={false}/>
        </div>
    );
};

export default ManageUsersPage;
