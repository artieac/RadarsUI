import React from 'react';
import { useSelector, useDispatch } from "react-redux";
import { isValid } from 'Apps/Common/Utilities';
import { addAssociatedRadarTemplatesToState } from 'Redux/RadarTemplateReducer';
import { RadarTemplateRepository } from 'Repositories/RadarTemplateRepository';

export const RadarTemplateRowComponent = ({ rowData, handleViewClick, rowAlternating, isMyShared }) => {
    const dispatch = useDispatch();
    const authenticatedUser = useSelector((state) => state.userReducer.currentUser);
    const associatedTemplates = useSelector((state) => state.radarTemplateReducer.associatedRadarTemplates);

    const isAssociatedToUser = () => {
        if (associatedTemplates && associatedTemplates.length > 0) {
            return associatedTemplates.some(t => t.id === rowData.id);
        }
        return false;
    }

    const canAssociateRadarTemplates = () => {
        if (isValid(authenticatedUser) && isValid(associatedTemplates)) {
            return associatedTemplates.length < authenticatedUser.canHaveNAssociatedRadarTemplates;
        }
        return false;
    }

    const handleAssociateRadarTemplateChange = (event) => {
        const shouldAssociate = event.target.checked;
        const radarTemplateRepository = new RadarTemplateRepository();

        if (shouldAssociate) {
            if (canAssociateRadarTemplates()) {
                radarTemplateRepository.associateRadarTemplate(authenticatedUser.id, rowData.id, true, handleAssociateRadarTemplateResponse);
            } else {
                alert("You are only allowed to use " + authenticatedUser.canHaveNAssociatedRadarTemplates + " types from other users. Please uncheck another before trying to add this one.");
            }
        } else {
            radarTemplateRepository.associateRadarTemplate(authenticatedUser.id, rowData.id, false, handleAssociateRadarTemplateResponse);
        }
    }

    const handleAssociateRadarTemplateResponse = (wasSuccessful) => {
        if (wasSuccessful) {
            const radarTemplateRepository = new RadarTemplateRepository();
            radarTemplateRepository.getAssociatedRadarTemplates(authenticatedUser.id, (success, data) => {
                if (success) {
                    dispatch(addAssociatedRadarTemplatesToState(data));
                }
            });
        }
    }

    return (
        <div className={rowAlternating}>
            <div className={isMyShared ? "col-md-9 d-flex align-items-center" : "col-md-5 d-flex align-items-center"}>
                <span className="text-truncate" title={rowData.name}>{rowData.name}</span>
            </div>
            {!isMyShared && (
                <div className="col-md-4 d-flex align-items-center justify-content-center">
                    <input 
                        type="checkbox" 
                        className="form-check-input"
                        checked={isAssociatedToUser()} 
                        onChange={handleAssociateRadarTemplateChange}
                    />
                </div>
            )}
            <div className="col-md-3 d-flex align-items-center justify-content-center">
                <button 
                    className="btn btn-sm btn-outline-techradar border-0" 
                    onClick={() => handleViewClick(rowData)}
                    title="View Details"
                >
                    <i className="bi bi-eye-fill fs-5"></i>
                </button>
            </div>
        </div>
    );
}

export default RadarTemplateRowComponent;