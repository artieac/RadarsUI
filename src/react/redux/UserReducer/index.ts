import * as actionTypes from './actionTypes';
import IReduxAction from '../IReduxAction'
import IUserState from './IUserState'

// src/js/reducers/index.js
const manageUserState: IUserState = {
    currentUser: {},
    users: [],
    roles: [],
    manageUsersSelectedUser: {}
};

export function setCurrentUser(currentUser: object){
    return{
        type: actionTypes.SETCURRENTUSER,
        payload: currentUser
    };
}

export function addUsersToState(users: []){
    return{
        type: actionTypes.ADDUSERS,
        payload: users
    };
}

export function addRolesToState(roles: []){
    return{
        type: actionTypes.ADDROLES,
        payload: roles
    };
}

export function setSelectedUser(manageUsersSelectedUser: object){
    return{
        type: actionTypes.SETMANAGEUSERSSELECTEDUSER,
        payload: manageUsersSelectedUser
    };
}

export default function(state = manageUserState, action: IReduxAction) {
 // alert(JSON.stringify(action));

  switch (action.type) {
    case actionTypes.SETCURRENTUSER:
        return Object.assign({}, state, {
            currentUser: action.payload
        })
    case actionTypes.ADDUSERS:
        return Object.assign({}, state, {
            users: action.payload
        })
        break;
    case actionTypes.ADDROLES:
        return Object.assign({}, state, {
            roles: action.payload
        })
        break;
    case actionTypes.SETMANAGEUSERSSELECTEDUSER:
        return Object.assign({}, state, {
            manageUsersSelectedUser: action.payload
        })
        break;
    default:
      return state;
  }
}

