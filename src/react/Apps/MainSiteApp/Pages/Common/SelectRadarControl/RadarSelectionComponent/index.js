'use strict'
import jQuery from 'jquery';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { connect, useSelector, useDispatch } from "react-redux"
import { useNavigate } from 'react-router-dom'
import { addRadarsToState, setCurrentRadarInstanceToState } from 'Redux/RadarReducer'
import { RadarRepository} from 'Repositories/RadarRepository'
import DropdownComponent from 'SharedComponents/DropdownComponent'
import { radarDropdownMap } from './radarDropdownMap'
import { isValid } from 'Apps/Common/Utilities'
import CompleteRadarManager from '../../CompleteRadarManager'
import ConfigurationSettings from 'Apps/Common/ConfigurationSettings'

export const RadarSelectionComponent = ({ radarTemplate, subscriptionId, radarIdParam, isPublic }) => {
    const [radars, setRadars] = useState([]);
    const [selectedRadarDropdownItem, setSelectedRadarDropdownItem] = useState({name: "Select"});
    const [publicRadarLink, setPublicRadarLink] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const authenticatedUser = useSelector((state) => state.userReducer.currentUser);

    const canSeeFullView = () => {
        return authenticatedUser && authenticatedUser.canSeeFullView >= 1;
    }

    useEffect(() => {
        generateSharingLinks(null);

        if(isValid(radarTemplate) && isValid(radarTemplate.id)){
            let radarRepository = new RadarRepository();
            radarRepository.getRadarsBySubscriptionIdAndRadarTemplateId(isPublic, subscriptionId, radarTemplate.id, handleGetRadarsResponse);
        }
    }, [radarTemplate]);

    useEffect(() => {
        if(isValid(radars) && radars.length > 0){
            let completeRadarManager = new CompleteRadarManager();
            if(isValid(radarIdParam) && (radarIdParam==completeRadarManager.completeRadarId || radarIdParam > 0)){
                for(var i = 0; i < radars.length; i++){
                    if(radars[i].id==radarIdParam){
                        if(selectedRadarDropdownItem.id !== radars[i].id) {
                            setSelectedRadarDropdownItem(radars[i]);
                            dispatch(setCurrentRadarInstanceToState(radars[i]));
                            generateSharingLinks(radars[i]);
                        }
                        break;
                    }
                }
            }
        }
    }, [radarIdParam, radars]);

    const handleGetRadarsResponse = (wasSuccessful, data) => {
        if(wasSuccessful==true){
            let completeRadarManager = new CompleteRadarManager();
            
            data.sort((a, b) => {
                return b.id - a.id;
            });

            // Only add Complete View if the user's subscription grants CanSeeFullView >= 1
            if (canSeeFullView()) {
                data.unshift(completeRadarManager.generateCompleteViewDropdownItem(subscriptionId, radarTemplate));
            }

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

    const onRadarSelectionChanged = (targetRadar) => {
        handleRadarSelection(targetRadar);

        let baseUrl = isPublic ? "/public/home" : "/home";

        if(window.location.pathname.startsWith("/admin")){
            baseUrl = "/admin";
        }

        let completeRadarManager = new CompleteRadarManager();

        if (isValid(targetRadar) && targetRadar.id > 0) {
            navigate(`${baseUrl}/subscription/${subscriptionId}/radar/${targetRadar.id}`);
        } else if (canSeeFullView() && isValid(targetRadar) && targetRadar.id === completeRadarManager.completeRadarId) {
            navigate(`${baseUrl}/subscription/${subscriptionId}/radartemplate/${radarTemplate.id}/radars/fullView`);
        }
    }

    const generateSharingLinks = (targetRadar) => {
        let configurationSettings = new ConfigurationSettings();

        if(isValid(targetRadar) && isValid(targetRadar.id)){
            setPublicRadarLink(configurationSettings.getMainSiteUrlRoot() + "?subscriptionId=" + subscriptionId + "&radarId=" + targetRadar.id);
        }
        else {
            setPublicRadarLink(configurationSettings.getMainSiteUrlRoot() + "?subscriptionId=" + subscriptionId + "&mostRecent=true");
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
                        <DropdownComponent title = { getRadarName(selectedRadarDropdownItem) } data={ radars } itemMap = { radarDropdownMap(onRadarSelectionChanged) } />
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