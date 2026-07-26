'use strict'
import jQuery from 'jquery';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { connect, useSelector, useDispatch } from "react-redux"
import { useParams, useNavigate } from 'react-router-dom'
import { addRadarTemplatesToState} from 'Redux/RadarTemplateReducer'
import { RadarTemplateRepository } from 'Repositories/RadarTemplateRepository'
import { addRadarsToState, setCurrentRadarInstanceToState } from 'Redux/RadarReducer'
import { RadarRepository} from 'Repositories/RadarRepository'
import DropdownComponent from 'SharedComponents/DropdownComponent'
import { radarTemplateDropdownMap } from './radarTemplateDropdownMap'
import { isValid } from 'Apps/Common/Utilities'
import RadarSelectionComponent from './RadarSelectionComponent'
import ConfigurationSettings from 'Apps/Common/ConfigurationSettings'

export const SelectRadarControl = ({ radarViewParams }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [radarTemplates, setRadarTemplates] = useState([]);
    const [selectedRadarTemplate, setSelectedRadarTemplate] = useState({name: "Select"});
    const [mostRecentRadarsLink, setMostRecentRadarsLink] = useState("");
    const [targetedRadar, setTargetedRadar] = useState(null);
    // Incremented on every mount so the fetch effect always runs fresh,
    // even when subscriptionId hasn't changed (e.g. returning from account management).
    const [mountId, setMountId] = useState(0);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Always reset and refetch when the component mounts or the subscription changes.
    useEffect(() => {
        setRadarTemplates([]);
        setSelectedRadarTemplate({name: "Select"});
        setTargetedRadar(null);
        setMountId(id => id + 1);
    }, [radarViewParams.subscriptionIdParam]);

    useEffect(() => {
        if(isValid(radarTemplates) && radarTemplates.length > 0){
            let radarRepository = new RadarRepository();

            if(isValid(radarViewParams.radarIdParam) && radarViewParams.radarIdParam > 0){
                radarRepository.getByUserIdAndRadarId(radarViewParams.isPublic, radarViewParams.getSubscriptionIdToView(), radarViewParams.radarIdParam, getRadarResponseHandler);
            } else {
                if(radarViewParams.getMostRecent==true){
                    if(isValid(radarViewParams.radarTemplateIdParam) && radarViewParams.radarTemplateIdParam > 0){
                        radarRepository.getMostRecentRadarByTemplate(radarViewParams.isPublic, radarViewParams.getSubscriptionIdToView(), radarViewParams.radarTemplateIdParam, getRadarResponseHandler);
                    } else {
                        radarRepository.getMostRecentRadar(radarViewParams.isPublic, radarViewParams.getSubscriptionIdToView(), getRadarResponseHandler);
                    }
                } else {
                    if(radarViewParams.getFullView==true){
                        radarRepository.getFullView(radarViewParams.isPublic, radarViewParams.getSubscriptionIdToView(), radarViewParams.radarTemplateIdParam, getRadarResponseHandler);
                    }
                }
            }
        }
        else {
            let radarTemplateRepository = new RadarTemplateRepository();

            if(radarViewParams.isPublic){
                radarTemplateRepository.getPublicByUserId(radarViewParams.getSubscriptionIdToView(), getRadarTemplatesResponse);
            } else {
                radarTemplateRepository.getByUserId(radarViewParams.getSubscriptionIdToView(), getRadarTemplatesResponse);
            }
        }
    }, [radarTemplates, radarViewParams.radarIdParam, radarViewParams.radarTemplateIdParam, radarViewParams.getMostRecent, radarViewParams.getFullView, mountId]);

    const getRadarTemplatesResponse = (wasSuccessful, data) => {
        if(wasSuccessful){
            setRadarTemplates(data);
            dispatch(addRadarTemplatesToState(data));
        }
    }

    const getRadarResponseHandler = (wasSuccessful, data) =>{
        if(wasSuccessful){
            setTargetedRadar(data);

            for(var i = 0; i < radarTemplates.length; i++){
                if(radarTemplates[i].id==data.radarTemplate.id){
                    handleRadarTemplateSelection(radarTemplates[i]);
                    break;
                }
            }
        }
    }

    const handleRadarTemplateSelection = (targetRadarTemplate) => {
        setSelectedRadarTemplate(targetRadarTemplate);
        dispatch(setCurrentRadarInstanceToState(null));
        generateSharingLinks(targetRadarTemplate);
    }

    const onRadarTemplateSelectionChanged = (targetRadarTemplate) => {
        handleRadarTemplateSelection(targetRadarTemplate);

        let baseUrl = radarViewParams.isPublic ? "/public/home" : "/home";

        if(window.location.pathname.startsWith("/admin")){
            baseUrl = "/admin";
        }

        if (isValid(targetRadarTemplate) && targetRadarTemplate.id > 0) {
            navigate(`${baseUrl}/subscription/${radarViewParams.getSubscriptionIdToView()}/radartemplate/${targetRadarTemplate.id}/radars/mostRecent`);
        }
    }

    const generateSharingLinks = (radarTemplate) => {
        let configurationSettings = new ConfigurationSettings();

        if(isValid(radarTemplate) && isValid(radarTemplate.id)){
            setMostRecentRadarsLink(configurationSettings.getMainSiteUrlRoot() + "?userId=" + radarViewParams.getUserIdToView() + "&radarTemplateId=" + radarTemplate.id + "&mostRecent=true");
        }
        else {
            setMostRecentRadarsLink(configurationSettings.getMainSiteUrlRoot() + "?userId=" + radarViewParams.getUserIdToView());
        }
    }

    const getRadarTemplateName = ( radarTemplate ) => {
        if(isValid(radarTemplate) && isValid(radarTemplate.id)){
            return radarTemplate.name;
        }

        return "Select";
    }

    const getRadarIdParam = (testRadar) => {
        if(isValid(testRadar)){
            if(isValid(testRadar.id)){
                return testRadar.id;
            }

            if(isValid(testRadar.radarId)){
                return testRadar.radarId;
            }
        }

        return -1;
    }

    return (
        <div>
            <div className="row">
                <label>Select Radar Template:</label>
                <div className="row">
                    <div className="col-md-4">
                        <DropdownComponent title = { getRadarTemplateName(selectedRadarTemplate) } data={ radarTemplates } itemMap = { radarTemplateDropdownMap(onRadarTemplateSelectionChanged) } />
                    </div>
                    <div className="col-md-1">
                        <a href={ mostRecentRadarsLink }><img src="/images/LinkIcon.png" alt=""/></a>
                    </div>
                    <div className="col-md-7">
                        <div>{ selectedRadarTemplate.description }</div>
                    </div>
                </div>
            </div>
            <RadarSelectionComponent radarTemplate = { selectedRadarTemplate } subscriptionId = { radarViewParams.getSubscriptionIdToView() } radarIdParam = { getRadarIdParam(targetedRadar) } isPublic = { radarViewParams.isPublic} />
        </div>
    );
}

export default SelectRadarControl;