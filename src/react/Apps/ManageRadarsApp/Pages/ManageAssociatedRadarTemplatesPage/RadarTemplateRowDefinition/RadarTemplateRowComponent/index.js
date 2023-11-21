 import React, { useState, useEffect } from 'react';
 import ReactDOM from 'react-dom';
 import { connect, useSelector, useDispatch } from "react-redux";
 import { isValid } from 'Apps/Common/Utilities';
 import { addSelectedRadarTemplateToState } from 'Redux/RadarTemplateReducer';

 export const RadarTemplateRowComponent = ({ rowData, handleViewClick, rowAlternating }) => {
     const loggedInUser = useSelector((state) => state.userReducer.currentUser);
     const associatedTemplates = useSelector((state) => state.radarTemplateReducer.associatedRadarTemplates);

     const isAssociatedToUser = (rowData) =>{
        if(associatedTemplates.length > 0){
            for(var i = 0; i < associatedTemplates.length; i++){
                if(associatedTemplates[i].id==rowData.id){
                    return true;
                    break;
                }
            }
        }

        return false;
     }

     const canAssociateRadarTemplates = (currentUser) => {
        if(isValid(currentUser) && isValid(associatedTemplates)){
            if(associatedTemplates.length < currentUser.canHaveNAssociatedRadarTemplates){
                return true;
            }
        }

        return false;
     }

     const handleAssociateRadarTemplateChange = (event, rowData) => {
        if(event.target.checked==true){
            if(canAssociateRadarTemplates(loggedInUser, associatedTemplates)==true){
                let radarTemplateRepository = new RadarTemplateRepository();
                radarTemplateRepository.associateRadarTemplate(loggedInUser.id, rowData.id, true, handleAssociatedRadarTemplateResponse);
            }
            else{
                alert("You are only allowed to use " + loggedInUser.canHaveNAssociatedRadarTemplates + " types from other users.  Please uncheck another before trying to add this one.");
            }
        } else {
            let radarTemplateRepository = new RadarTemplateRepository();
            radarTemplateRepository.associateRadarTemplate(loggedInUser.id, rowData.id, false, handleAssociateRadarTemplateResponse);
        }
    }

    const handleAssociateRadarTemplateResponse = (wasSuccessful) => {
        let radarTemplateRepository = new RadarTemplateRepository();
        radarTemplateRepository.getAssociatedRadarTemplates(loggedInUser.id, handleGetAssociatedRadarTemplatesResponse);
    }

    const handleGetAssociatedRadarTemplatesResponse = (wasSuccessful, data) => {
        if(wasSuccessful==true){
            dispatch(addAssociatedRadarTemplatesToState(data));
        }
    }

    return (
        <div className={ rowAlternating }>
            <div className="col-md-4">{rowData.name}</div>
            <div className="col-md-4">
                <span className={ loggedInUser.id == rowData.radarUserId ? 'hidden' : ''}>
                      <input type="checkbox" checked={isAssociatedToUser(rowData)} onChange = {(event) => handleAssociateClick(event, rowData) }/>
                </span>
            </div>
            <div className="col-md-4">
                <img src="/images/arrow_right.png" onClick = {(event) => handleViewClick(rowData) }/>
            </div>
        </div>
     );
}

export default RadarTemplateRowComponent;
