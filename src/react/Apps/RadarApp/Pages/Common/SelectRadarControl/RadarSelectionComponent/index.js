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

export const RadarSelectionComponent = ({ radarTemplate, userId, radarIdParam, isPublic }) => {
    const [radars, setRadars] = useState([]);
    const [selectedRadar, setSelectedRadar] = useState({name: "Select"});
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
            setRadars(data);
            dispatch(addRadarsToState(data));
            handleRadarSelection({ name: "Select"});

            if(isValid(radarIdParam) && radarIdParam > 0){
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
        setSelectedRadar(targetRadar);
        dispatch(setCurrentRadarInstanceToState(targetRadar));
        generateSharingLinks(targetRadar);
    }

    const generateSharingLinks = (targetRadar) => {
        if(isValid(targetRadar) && isValid(targetRadar.id)){
            setPublicRadarLink("/public/home/user/" + userId + "/radar/" + targetRadar.id);
        }
        else {
            setPublicRadarLink("/public/home/user/" + userId + "/radars?mostrecent=true");
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
                        <DropdownComponent title = { getRadarName(selectedRadar) } data={ radars } itemMap = { radarDropdownMap(handleRadarSelection) } />
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