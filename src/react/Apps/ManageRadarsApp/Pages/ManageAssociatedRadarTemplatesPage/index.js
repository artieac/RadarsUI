import React, { useState, useEffect } from 'react';
import { connect, useSelector, useDispatch } from "react-redux"
import ViewRadarTemplateControl from './ViewRadarTemplateControl';
import { RadarTemplateRepository } from 'Repositories/RadarTemplateRepository';
import { UserRepository } from 'Repositories/UserRepository';
import DivTableComponent2 from 'SharedComponents/DivTableComponent2';
import { radarTemplateColumns } from './radarTemplateColumns';
import { RadarTemplateRowDefinition } from './RadarTemplateRowDefinition'
import { isValid } from 'Apps/Common/Utilities'

export const ManageAssociatedRadarTemplatesPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [selectedRadarTemplate, setSelectedRadarTemplate] = useState({});
    const [associatedTemplates, setAssociatedTemplates] = useState([]);
    const [sharedTemplates, setSharedTemplates] = useState([]);

    const dispatch = useDispatch();

    const authenticatedUser = useSelector((state) => state.userReducer.currentUser);

    useEffect(() => {
        let radarTemplateRepository = new RadarTemplateRepository();
        radarTemplateRepository.getAssociatedRadarTemplates(authenticatedUser.id, handleGetAssociatedRadarTemplatesResponse);
    }, []);

    const handleGetAssociatedRadarTemplatesResponse = (wasSuccessful, data) => {
        if(wasSuccessful==true){
            setAssociatedTemplates(data);
        }

        let radarTemplateRepository = new RadarTemplateRepository();
        radarTemplateRepository.getOtherUsersSharedRadarTemplates(authenticatedUser.id, handleGetOtherUsersSharedRadarTemplatesResponse);
    }

    const handleGetOtherUsersSharedRadarTemplatesResponse = (wasSuccessful, data) => {
        if(wasSuccessful==true){
            for(var i = 0; i < associatedTemplates.length; i++){
                var associatedRadarTemplate = associatedTemplates[i];
                var foundMatch = false;

                for(var j = 0; j < sharedRadarTemplates.length; j++){
                    if(associatedRadarTemplate.id == sharedRadarTemplates[j].id){
                        foundMatch = true;
                   }
                }

                if(foundMatch == false){
                    data.push(associatedRadarTemplate);
                }
            }

            setSharedTemplates(data);

            if(data.length > 0){
                setSelectedRadarTemplate(data[0]);
            }
        }
    }

    const handleViewTemplateClick = (rowData) => {
        setSelectedRadarTemplate(rowData);
    }

    return (
        <div className="bodyContent">
            <div className="contentPageTitle">
                <label>Associate Radar Templates From Others</label>
            </div>
            <p>Discover Radar Templates that others have created</p>
            <div className="row">
                <div className="col-md-6">
                    <DivTableComponent2
                        data={ sharedTemplates }
                        rowDefinition={ RadarTemplateRowDefinition(handleViewTemplateClick) } />
                </div>
                <div className="col-md-6">
                    { isValid(selectedRadarTemplate) && isValid(selectedRadarTemplate.id) ? <ViewRadarTemplateControl selectedTemplate = { selectedRadarTemplate } /> : <div/> }
                </div>
            </div>
        </div>
    );
};

export default ManageAssociatedRadarTemplatesPage;