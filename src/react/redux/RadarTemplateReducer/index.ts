import * as actionTypes from './actionTypes';
import IReduxAction from '../IReduxAction'
import IRadarTemplateState from './IRadarTemplateState'

// src/js/reducers/index.js
const radarTemplateManagementState: IRadarTemplateState = {
  radarTemplates: [],
  associatedRadarTemplates: [],
  sharedRadarTemplates: [],
  selectedRadarTemplate: null,
  showEdit: true,
};

export function setShowEdit(showEdit: boolean){
    return {
        type: actionTypes.SETSHOWEDIT,
        payload: showEdit
    };
}

export function addRadarTemplatesToState(radarTemplates: []){
    return {
       type: actionTypes.SETRADARTEMPLATECOLLECTION,
       payload: radarTemplates
   };
}

export function addSelectedRadarTemplateToState(selectedRadarTemplate: object){
    return {
       type: actionTypes.SETSELECTEDRADARTEMPLATE,
       payload: selectedRadarTemplate
   };
}

export function addSharedRadarTemplatesToState(sharedRadarTemplates: []){
    return {
       type: actionTypes.SETSHAREDRADARTEMPLATECOLLECTION,
       payload: sharedRadarTemplates
   };
}

export function addAssociatedRadarTemplatesToState(associatedRadarTemplates: []){
    return {
       type: actionTypes.SETASSOCIATEDRADARTEMPLATES,
       payload: associatedRadarTemplates
   };
}

export default function(state = radarTemplateManagementState, action: IReduxAction) {
 // alert(JSON.stringify(action));

  switch (action.type) {
    case actionTypes.SETSHOWEDIT:
        return Object.assign({}, state, {
            showEdit: action.payload
        })
        break;
    case actionTypes.SETSELECTEDRADARTEMPLATE:
        return Object.assign({}, state, {
            selectedRadarTemplate: action.payload
        })
        break;
    case actionTypes.SETSHAREDRADARTEMPLATECOLLECTION:
        return Object.assign({}, state, {
            sharedRadarTemplates: action.payload
        })
        break;
    case actionTypes.SETRADARTEMPLATECOLLECTION:
        return Object.assign({}, state, {
            radarTemplates: action.payload
        })
        break;
    case actionTypes.SETASSOCIATEDRADARTEMPLATES:
        return Object.assign({}, state, {
            associatedRadarTemplates: action.payload
        })
        break;
    default:
      return state;
  }
}
