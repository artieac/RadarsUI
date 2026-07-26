import * as actionTypes from './actionTypes';
import IReduxAction from '../IReduxAction'
import IUserState from './IUserState'

// src/js/reducers/index.js
const manageUserState: IUserState = {
    currentUser: {isAuthenticated: false, unloaded: true},
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

/**
 * Updates the current user's Redux state to reflect the subscription they just switched to.
 * Merges role, tier limits, and subscriptionId from the selected UserSubscriptionViewModel
 * so all downstream UI (navbar items, canAddItems, etc.) automatically reacts.
 */
export function setViewedSubscription(subscription: any){
    return{
        type: actionTypes.SET_VIEWED_SUBSCRIPTION,
        payload: subscription
    };
}

export default function(state = manageUserState, action: IReduxAction) {
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
    case actionTypes.SET_VIEWED_SUBSCRIPTION:
        // Merge subscription-context fields into currentUser without replacing identity fields
        return Object.assign({}, state, {
            currentUser: Object.assign({}, state.currentUser, {
                subscriptionRoleName: action.payload.roleName,
                subscriptionId: action.payload.subscriptionId,
                subscriptionTierName: action.payload.subscriptionTierName,
                canHaveNRadarTemplates: action.payload.canHaveNRadarTemplates,
                canHaveNAssociatedRadarTemplates: action.payload.canHaveNAssociatedRadarTemplates,
                canHaveNRadars: action.payload.canHaveNRadars,
                canSeeFullView: action.payload.canSeeFullView,
            })
        })
        break;
    default:
      return state;
  }
}
