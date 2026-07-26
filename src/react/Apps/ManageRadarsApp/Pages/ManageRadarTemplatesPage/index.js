import React, { useState, useLayoutEffect, useEffect } from 'react';
import { connect, useSelector, useDispatch } from "react-redux"
import { setCurrentUser} from 'Redux/UserReducer'
import { AccountAdminRepository } from 'Repositories/AccountAdminRepository'
import RadarTemplateRowDefinition from './RadarTemplateRowDefinition'
import { addRadarTemplatesToState, addSelectedRadarTemplateToState, setShowEdit } from 'Redux/RadarTemplateReducer'
import { addRadarsToState } from 'Redux/RadarReducer'
import RadarTemplateDetails from './RadarTemplateDetails'
import TableComponent2 from 'SharedComponents/TableComponent2'
import { isValid } from 'Apps/Common/Utilities'

export const ManageRadarTemplatesPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [showEdit, setShowEdit] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    const dispatch = useDispatch();

    const authenticatedUser = useSelector((state) => state.userReducer.currentUser);
    const currentlyViewedSubscriptionId = authenticatedUser?.currentlyViewedSubscriptionId;
    const radarTemplates = useSelector((state) => state.radarTemplateReducer.radarTemplates);

    useEffect(() => {
        let repo = new AccountAdminRepository();
        repo.getRadarTemplates(currentlyViewedSubscriptionId, handleGetRadarTemplatesByUserIdResponse);
        repo.getRadars(currentlyViewedSubscriptionId, handleGetUserRadarResponse);
    },[]);

    const handleGetUserRadarResponse = (wasSuccessful, data) => {
        if(wasSuccessful==true){
            dispatch(addRadarsToState(data));
        }
    }

    const handleGetRadarTemplatesByUserIdResponse = (wasSuccessful, radarTemplates) => {
        if(wasSuccessful==true){
            dispatch(addRadarTemplatesToState(radarTemplates));
            setIsLoading(false);
        }
    }

    const canAddRadarTemplates = () => {
        if(isValid(authenticatedUser)){
            if(isValid(radarTemplates)){
                if(isLoading==false){
                    if(radarTemplates.length < authenticatedUser.canHaveNRadarTemplates){
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
            let repo = new AccountAdminRepository();
            repo.deleteRadarTemplate(currentlyViewedSubscriptionId, radarTemplate.id, handleDeleteResponse);
        }
    }

    const handleDeleteResponse = (wasSuccessful) => {
        if(wasSuccessful==true){
            let repo = new AccountAdminRepository();
            repo.getRadarTemplates(currentlyViewedSubscriptionId, handleGetRadarTemplatesByUserIdResponse);
        }
    }

    const handleAddRadarTemplate = () => {
        if (!canAddRadarTemplates()) return;
        const repo = new AccountAdminRepository();
        let newRadarTemplate = repo.createDefaultRadarTemplate({});
        setSelectedTemplate(newRadarTemplate);
        dispatch(addSelectedRadarTemplateToState(newRadarTemplate));
    }

    const limitMessage = `You are only allowed ${authenticatedUser?.canHaveNRadarTemplates} Radar Templates. If you want a new one you need to delete one of your existing Radar Templates.`;

    return (
        <div className="bodyContent">
            <div className="contentPageTitle mb-3">
                <h2 className="text-start">Manage Your Radar Templates</h2>
            </div>
            <div className="row">
                <div className="col-md-4">
                    <div className="row mb-2">
                        <div className="col-auto d-flex align-items-center gap-2">
                            <input
                                type="button"
                                id="btn-add-radar-template"
                                className={ canAddRadarTemplates() ? "btn btn-techradar" : "btn btn-secondary" }
                                value="Add Radar Template"
                                onClick={ handleAddRadarTemplate }
                                disabled={ !canAddRadarTemplates() }
                                title={ canAddRadarTemplates() ? "Add a new Template to rate different types of things" : "" }
                            />
                            { !canAddRadarTemplates() && (
                                <span
                                    className="template-limit-warning"
                                    role="img"
                                    aria-label="At template limit"
                                    title={ limitMessage }
                                    style={{ color: '#dc3545', fontSize: '1.3rem', cursor: 'help' }}
                                >
                                    ⚠
                                </span>
                            )}
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