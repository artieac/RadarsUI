import * as actionTypes from './actionTypes';

// src/js/reducers/index.js
const navBarState = {
  currentPage: "",
  pageHistory: []
};

export function setCurrentPage(currentPage){
    return{
        type: actionTypes.SETCURRENTPAGE,
        payload: currentPage
    };
}

export function addPageToHistory(pageHistory){
    return {
       type: actionTypes.ADDPAGETOHISTORY,
       payload: pageHistory
   };
}

export default function(state = errorState, action) {
 // alert(JSON.stringify(action));

  switch (action.type) {
    case actionTypes.SETERRORS:
        return Object.assign({}, state, {
            currentPage: action.payload
        })
        break;
    case actionTypes.ADDPAGETOHISTORY:
        return Object.assign({}, state, {
            pageHistory: action.payload
        })
        break;
    default:
      return state;
  }
}

