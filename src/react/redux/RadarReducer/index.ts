import * as actionTypes from './actionTypes';
import IReduxAction from '../IReduxAction'
import IRadarState from './IRadarState'

// src/js/reducers/index.js
const radarManagementState: IRadarState = {
  radars: [],
  currentRadar: {},
  sourceRadar: {},
  radarTemplates: [],
  selectedRadarItem: {},
  selectedRadarItemChanged: false
};

export function addRadarsToState(radars: []){
    return {
       type: actionTypes.SETRADARCOLLECTION,
       payload: radars
   };
}

export function addRadarTemplatesToState(radarTemplates: []){
    return {
       type: actionTypes.SETRADARTYPECOLLECTION,
       payload: radarTemplates
   };
}

export function setCurrentRadarInstanceToState(radarInstance: object) {
    return {
        type : actionTypes.SETCURRENTRADARINSTANCE,
        payload: radarInstance
    };
}

export function setSourceRadarInstanceToState(radarInstance: object) {
    return {
        type : actionTypes.SETSOURCERADARINSTANCE,
        payload: radarInstance
    };
}

export function setSelectedRadarItem(radarItem: object) {
    return {
        type : actionTypes.SETSELECTEDRADARITEM,
        payload: radarItem
    };
}

export function disableRadarItemChangedAlert(){
    return {
        type : actionTypes.SETSELECTEDRADARITEMCHANGED,
        payload: false
    };
}

export default function(state = radarManagementState, action: IReduxAction) {
 // alert(JSON.stringify(action));

  switch (action.type) {
    case actionTypes.SETRADARCOLLECTION:
        return Object.assign({}, state, {
            radars: action.payload
        })
        break;
    case actionTypes.SETCURRENTRADARINSTANCE:
        return Object.assign({}, state, {
            currentRadar: action.payload
        })
        break;
    case actionTypes.SETSOURCERADARINSTANCE:
        return Object.assign({}, state, {
            sourceRadar: action.payload
        })
        break;
    case actionTypes.SETRADARTYPECOLLECTION:
        return Object.assign({}, state, {
            radarTemplates: action.payload
        })
        break;
    case actionTypes.SETSELECTEDRADARITEM:
        return Object.assign({}, state, {
            selectedRadarItem: action.payload,
            selectedRadarItemChanged:true
        })
        break;
    case actionTypes.SETSELECTEDRADARITEMCHANGED:
        return Object.assign({}, state, {
            selectedRadarItemChanged: action.payload
        })
        break;
    default:
      return state;
  }
}

