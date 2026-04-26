import * as actionTypes from './actionTypes';
import IReduxAction from '../IReduxAction'
import ITeamState from './ITeamState'

// src/js/reducers/index.js
const teamState: ITeamState = {
  userTeams: [],
  memberTeams: [],
  currentTeam: null
};

export function addTeamsToState(userTeams: []){
    return {
        type: actionTypes.SETTEAMS,
        payload: userTeams
    };
}

export function addMemberTeamsToState(memberTeams: []){
    return {
        type: actionTypes.SETMEMBERTEAMS,
        payload: memberTeams
    };
}

export function addCurrentTeamToState(currentTeam: object | null){
    return {
        type: actionTypes.SETCURRENTTEAM,
        payload: currentTeam
    };
}

export default function(state = teamState, action: IReduxAction) {
  switch (action.type) {
    case actionTypes.SETTEAMS:
        return Object.assign({}, state, {
            userTeams: action.payload
        })
    case actionTypes.SETMEMBERTEAMS:
        return Object.assign({}, state, {
            memberTeams: action.payload
        })
    case actionTypes.SETCURRENTTEAM:
        return Object.assign({}, state, {
            currentTeam: action.payload
        })
    default:
      return state;
  }
}