import React from 'react';
import { useSelector, useDispatch } from "react-redux";
import { isValid } from 'Apps/Common/Utilities';
import { addAssociatedRadarTemplatesToState } from 'Redux/RadarTemplateReducer';
import { AccountAdminRepository } from 'Repositories/AccountAdminRepository';

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

    // Checkbox is disabled when at the limit AND this template is not already associated
    const isCheckboxDisabled = () => !canAssociateRadarTemplates() && !isAssociatedToUser();

    const handleAssociateRadarTemplateChange = (event) => {
        if (isCheckboxDisabled()) return;
        const shouldAssociate = event.target.checked;
        const repo = new AccountAdminRepository();

        if (shouldAssociate) {
            repo.associateRadarTemplate(authenticatedUser.id, rowData.id, true, handleAssociateRadarTemplateResponse);
        } else {
            repo.associateRadarTemplate(authenticatedUser.id, rowData.id, false, handleAssociateRadarTemplateResponse);
        }
    }

    const handleAssociateRadarTemplateResponse = (wasSuccessful) => {
        if (wasSuccessful) {
            const repo = new AccountAdminRepository();
            repo.getAssociatedRadarTemplates(authenticatedUser.id, (success, data) => {
                if (success) {
                    dispatch(addAssociatedRadarTemplatesToState(data));
                }
            });
        }
    }

    const limitMessage = `You are only allowed ${authenticatedUser?.canHaveNAssociatedRadarTemplates} associated templates on your current subscription. Uncheck another before adding this one.`;

    return (
        <div className={rowAlternating}>
            <div className={isMyShared ? "col-md-9 d-flex align-items-center" : "col-md-5 d-flex align-items-center"}>
                <span className="text-truncate" title={rowData.name}>{rowData.name}</span>
            </div>
            {!isMyShared && (
                <div className="col-md-4 d-flex align-items-center justify-content-center gap-2">
                    <input 
                        type="checkbox" 
                        className="form-check-input"
                        checked={isAssociatedToUser()} 
                        onChange={handleAssociateRadarTemplateChange}
                        disabled={isCheckboxDisabled()}
                        title={isCheckboxDisabled() ? limitMessage : ""}
                    />
                    { isCheckboxDisabled() && (
                        <span
                            title={ limitMessage }
                            style={{ color: '#dc3545', fontSize: '1.1rem', cursor: 'help' }}
                            role="img"
                            aria-label="At association limit"
                        >
                            ⚠
                        </span>
                    )}
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