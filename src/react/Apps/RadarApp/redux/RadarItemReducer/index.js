import * as actionTypes from './actionTypes';

// src/js/reducers/index.js
const errorState = {
  selectedRadarItem: {}
};

export function setSelectedRadarItem(radarItem){
    return{
        type: actionTypes.SETSELECTEDRADARITEM,
        payload: radarItem
    };
}

export default function(state = errorState, action) {
 // alert(JSON.stringify(action));

  switch (action.type) {
    case actionTypes.SETSELECTEDRADARITEM:
        return Object.assign({}, state, {
            selectedRadarItem: action.payload
        })
        break;
    default:
      return state;
  }
}

