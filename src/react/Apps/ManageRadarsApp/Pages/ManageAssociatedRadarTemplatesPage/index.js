import React, { useState, useEffect } from 'react';
import { connect, useSelector, useDispatch } from "react-redux"
import ViewRadarTemplateControl from './ViewRadarTemplateControl';
import { AccountAdminRepository } from 'Repositories/AccountAdminRepository';
import DivTableComponent2 from 'SharedComponents/DivTableComponent2';
import { RadarTemplateRowDefinition } from './RadarTemplateRowDefinition'
import { isValid } from 'Apps/Common/Utilities'
import { addAssociatedRadarTemplatesToState } from 'Redux/RadarTemplateReducer'

export const ManageAssociatedRadarTemplatesPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [selectedRadarTemplate, setSelectedRadarTemplate] = useState({});
    const [mySharedTemplates, setMySharedTemplates] = useState([]);
    const [templatesFromOthers, setTemplatesFromOthers] = useState([]);

    const dispatch = useDispatch();

    const authenticatedUser = useSelector((state) => state.userReducer.currentUser);

    useEffect(() => {
        if (!authenticatedUser || !authenticatedUser.subscriptionId) return;
        const subscriptionId = authenticatedUser.subscriptionId;
        let repo = new AccountAdminRepository();
        
        // Fetch User's templates to identify which are shared
        repo.getRadarTemplates(subscriptionId, (wasSuccessful, data) => {
            if (wasSuccessful) {
                setMySharedTemplates(data.filter(t => t.isPublished));
            }
        });

        // Fetch templates shared by others
        repo.getSharedRadarTemplates(authenticatedUser.id, (wasSuccessful, data) => {
            if (wasSuccessful) {
                setTemplatesFromOthers(data);
                if (data.length > 0 && !selectedRadarTemplate.id) {
                    setSelectedRadarTemplate(data[0]);
                }
            }
            setIsLoading(false);
        });

        // Also fetch currently associated templates to keep state in sync
        repo.getAssociatedRadarTemplates(subscriptionId, (wasSuccessful, data) => {
            if (wasSuccessful) {
                dispatch(addAssociatedRadarTemplatesToState(data));
            }
        });
    }, [authenticatedUser.subscriptionId]);

    const handleViewTemplateClick = (rowData) => {
        setSelectedRadarTemplate(rowData);
    }

    return (
        <div className="bodyContent">
            <div className="contentPageTitle mb-3">
                <h2 className="text-start">Associate Radar Templates From Others</h2>
            </div>
            
            <div className="row">
                <div className="col-md-6">
                    <div className="card mb-4 border-0">
                        <div className="card-header bg-techradar text-white fw-bold">
                            Shared by You
                        </div>
                        <div className="card-body p-0 border border-top-0">
                            <DivTableComponent2
                                data={ mySharedTemplates }
                                rowDefinition={ RadarTemplateRowDefinition(handleViewTemplateClick, true) } />
                            {mySharedTemplates.length === 0 && <div className="p-3 text-center text-muted">You haven't shared any templates yet.</div>}
                        </div>
                    </div>

                    <div className="card border-0">
                        <div className="card-header bg-techradar text-white fw-bold">
                            Shared by others
                        </div>
                        <div className="card-body p-0 border border-top-0">
                            <DivTableComponent2
                                data={ templatesFromOthers }
                                rowDefinition={ RadarTemplateRowDefinition(handleViewTemplateClick, false) } />
                            {templatesFromOthers.length === 0 && <div className="p-3 text-center text-muted">No templates available from other users.</div>}
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    { isValid(selectedRadarTemplate) && isValid(selectedRadarTemplate.id) ? (
                        <div className="card sticky-top border-0 shadow-sm" style={{ top: '20px' }}>
                            <div className="card-header bg-light fw-bold border">
                                Template Details: {selectedRadarTemplate.name}
                            </div>
                            <div className="card-body border border-top-0">
                                <ViewRadarTemplateControl selectedTemplate = { selectedRadarTemplate } />
                            </div>
                        </div>
                    ) : null }
                </div>
            </div>
        </div>
    );
};

export default ManageAssociatedRadarTemplatesPage;