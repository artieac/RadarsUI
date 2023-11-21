import * as actionTypes from './actionTypes';
import IErrorState from './IErrorState'
import IReduxAction from '../IReduxAction'

// src/js/reducers/index.js
const errorState: IErrorState = {
  errors: [],
  warnings: []
};

export function addErrorsToState(errors: []){
    return{
        type: actionTypes.SETERRORS,
        payload: errors
    };
}

export function addWarningsToState(warnings: []){
    return {
       type: actionTypes.SETWARNINGS,
       payload: warnings
   };
}

export default function(state = errorState, action: IReduxAction) {
 // alert(JSON.stringify(action));

  switch (action.type) {
    case actionTypes.SETERRORS:
        return Object.assign({}, state, {
            errors: action.payload
        })
        break;
    case actionTypes.SETWARNINGS:
        return Object.assign({}, state, {
            warnings: action.payload
        })
        break;
    default:
      return state;
  }
}

