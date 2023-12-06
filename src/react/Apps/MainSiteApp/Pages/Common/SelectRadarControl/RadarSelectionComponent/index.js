'use strict'
import jQuery from 'jquery';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { connect, useSelector, useDispatch } from "react-redux"
import { addRadarsToState, setCurrentRadarInstanceToState } from 'Redux/RadarReducer'
import { RadarRepository} from 'Repositories/RadarRepository'
import DropdownComponent from 'SharedComponents/DropdownComponent'
import { radarDropdownMap } from './radarDropdownMap'
import { isValid } from 'Apps/Common/Utilities'
import CompleteRadarManager from '../../CompleteRadarManager'

export const RadarSelectionComponent = ({ radarTemplate, userId, radarIdParam, isPublic }) => {
    const [radars, setRadars] = useState([]);
    const [selectedRadarDropdownItem, setSelectedRadarDropdownItem] = useState({name: "Select"});
    const [publicRadarLink, setPublicRadarLink] = useState("");

    const dispatch = useDispatch();

    useEffect(() => {
        generateSharingLinks(null);

        if(isValid(radarTemplate) && isValid(radarTemplate.id)){
            let radarRepository = new RadarRepository();
            radarRepository.getRadarsByUserIdAndRadarTemplateId(isPublic, userId, radarTemplate.id, handleGetRadarsResponse);
        }
    }, [radarTemplate]);

    const handleGetRadarsResponse = (wasSuccessful, data) => {
        if(wasSuccessful==true){
            let completeRadarManager = new CompleteRadarManager();
            data.unshift(completeRadarManager.generateCompleteViewDropdownItem(userId, radarTemplate));
            setRadars(data);
            dispatch(addRadarsToState(data));

            handleRadarSelection({ name: "Select"});

            if(isValid(radarIdParam) &&
               (radarIdParam==completeRadarManager.completeRadarId || radarIdParam > 0)){
                for(var i = 0; i < data.length; i++){
                    if(data[i].id==radarIdParam){
                        handleRadarSelection(data[i]);
                        break;
                    }
                }
            }
       }
    }

    const handleRadarSelection = (targetRadar) => {
        setSelectedRadarDropdownItem(targetRadar);
        dispatch(setCurrentRadarInstanceToState(targetRadar));
        generateSharingLinks(targetRadar);
    }

    const generateSharingLinks = (targetRadar) => {
        if(isValid(targetRadar) && isValid(targetRadar.id)){
            setPublicRadarLink("?userId=" + userId + "&radarId=" + targetRadar.id);
        }
        else {
            setPublicRadarLink("?userId=" + userId + "&mostRecent=true");
        }
    }

    const getRadarName = ( radar ) => {
        if(isValid(radar) && isValid(radar.id)){
            return radar.name + " - " + radar.formattedAssessmentDate;
        }

        return "Select";
    }

    return (
        <div>
            <div className="row">
                <label>Select Radar:</label>
                <div className="row">
                    <div className="col-md-4">
                        <DropdownComponent title = { getRadarName(selectedRadarDropdownItem) } data={ radars } itemMap = { radarDropdownMap(handleRadarSelection) } />
                    </div>
                    <div className="col-md-1">
                        <a href={ publicRadarLink } ><img src="/images/LinkIcon.png" alt=""/></a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RadarSelectionComponent;