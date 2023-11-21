import React, { useState, useLayoutEffect, useEffect } from 'react';
import { connect, useSelector, useDispatch } from "react-redux"
import { setCurrentUser} from 'Redux/UserReducer'
import { RadarTemplateRepository } from 'Repositories/RadarTemplateRepository'
import { UserRepository } from 'Repositories/UserRepository'
import RadarTemplateRowDefinition from './RadarTemplateRowDefinition'
import { addRadarTemplatesToState, addSelectedRadarTemplateToState, setShowEdit } from 'Redux/RadarTemplateReducer'
import RadarTemplateDetails from './RadarTemplateDetails'
import TableComponent2 from 'SharedComponents/TableComponent2'
import MessageComponent from 'SharedComponents/MessageComponent'
import { isValid } from 'Apps/Common/Utilities'

export const ManageRadarTemplatesPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [showEdit, setShowEdit] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    const dispatch = useDispatch();

    const loggedInUser = useSelector((state) => state.userReducer.currentUser);
    const radarTemplates = useSelector((state) => state.radarTemplateReducer.radarTemplates);

    useEffect(() => {
        let radarTemplateRepository = new RadarTemplateRepository();
        radarTemplateRepository.getMostRecentByUserId(loggedInUser.id, handleGetRadarTemplatesByUserIdResponse);
    },[]);

    const handleGetRadarTemplatesByUserIdResponse = (wasSuccessful, radarTemplates) => {
        if(wasSuccessful==true){
            dispatch(addRadarTemplatesToState(radarTemplates));
            setIsLoading(false);
        }
    }

    const canAddRadarTemplates = () => {
        if(isValid(loggedInUser)){
            if(isValid(radarTemplates)){
                if(isLoading==false){
                    if(radarTemplates.length < loggedInUser.canHaveNRadarTemplates){
                        return true;
                    }
                } else {
                    return true;
                }
            }
        }

        return false;
    }

   const handleViewClick = (radarTemplate) => {
        dispatch(addSelectedRadarTemplateToState(radarTemplate));
        setSelectedTemplate(radarTemplate);
        setShowEdit(true);
    }

    const handleDeleteClick = (radarTemplate) => {
        if(confirm("This will permanently remove all radars of this type.  Are you sure you want to proceed?")){
            let radarTemplateRepository = new RadarTemplateRepository();
            radarTemplateRepository.deleteRadarTemplate(loggedInUser.id, radarTemplate.id, handleDeleteResponse);
        }
    }

    const handleDeleteResponse = (wasSuccessful) => {
        if(wasSuccessful==true){
            let radarTemplateRepository = new RadarTemplateRepository();
            radarTemplateRepository.getByUserId(loggedInUser.id, false, handleGetRadarTemplatesByUserIdResponse);
        }
    }

    const handleAddRadarTemplate = () => {
        let radarTemplateRepository = new RadarTemplateRepository();
        let newRadarTemplate = radarTemplateRepository.createDefaultRadarTemplate({});
        setSelectedTemplate(newRadarTemplate);
        dispatch(addSelectedRadarTemplateToState(newRadarTemplate));
    }

    return (
        <div className="bodyContent">
            <div className="contentPageTitle">
                <label>Manage Your Radar Templates</label>
            </div>
            <p>Add a new Template to rate different types of things</p>
            <div className="row">
                <div className="col-md-4">
                    <div className="row">
                        <div className={ canAddRadarTemplates()==true ? "col-md-6" : "col-md-6 hidden"}>
                            <div className="row">
                                <div className="col-lg-1`">
                                    <input type="button" className="btn btn-techradar" value="Add Radar Template" onClick= { handleAddRadarTemplate } />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <MessageComponent
                                messageType="error"
                                message = "You are only allowed { this.props.currentUser.canHaveNRadarTemplates } Radar Templates.  If you want a new one you need to delete one of your existing Radar Tempalates."
                                show= {!canAddRadarTemplates()}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <TableComponent2 data={ radarTemplates } rowDefinition={RadarTemplateRowDefinition(handleViewClick, handleDeleteClick)} hoverable striped bordered={false} isLoading={isLoading} />
                         </div>
                    </div>
                </div>
                <div className={ showEdit==true ? "col-md-8" : "hidden"}>
                    { selectedTemplate != null ? <RadarTemplateDetails  editMode={ true } selectedTemplate = { selectedTemplate }/> : <div/> }
                </div>
            </div>
        </div>
    );
};


export default ManageRadarTemplatesPage;