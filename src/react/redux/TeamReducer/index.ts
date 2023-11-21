import * as actionTypes from './actionTypes';
import IReduxAction from '../IReduxAction'
import ITeamState from './ITeamState'

// src/js/reducers/index.js
const teamState: ITeamState = {
  userTeams: [],
  currentTeam: {}
};

export function addTeamsToState(userTeams: []){
    return {
        type: actionTypes.SETTEAMS,
        payload: userTeams
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
    case actionTypes.SETCURRENTTEAM:
        return Object.assign({}, state, {
            currentTeam: action.payload
        })
        break;
    default:
      return state;
  }
}