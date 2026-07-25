'use strict'
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { addRadarsToState } from 'Redux/RadarReducer'
import { RadarRepository } from 'Repositories/RadarRepository'
import { RadarTemplateRepository } from 'Repositories/RadarTemplateRepository'
import DropdownComponent from 'SharedComponents/DropdownComponent'
import { dropdownItem } from 'SharedComponents/DropdownComponent/dropdownItem'
import { isValid } from 'Apps/Common/Utilities'

const AddRadarComponent = () => {
    const [radarTemplates, setRadarTemplates] = useState([]);
    const [radarName, setRadarName] = useState("");
    const [selectedTemplate, setSelectedTemplate] = useState({ name: "Select Template"});

    const dispatch = useDispatch();
    const authenticatedUser = useSelector((state) => state.userReducer.currentUser);
    const userRadars = useSelector((state) => state.radarReducer.radars);

    useEffect(() => {
        if (isValid(authenticatedUser) && isValid(authenticatedUser.id)) {
            let radarTemplateRepository = new RadarTemplateRepository();
            radarTemplateRepository.getOwnedAndAssociatedByUserId(authenticatedUser.id, (wasSuccessful, data) => {
                if (wasSuccessful) {
                    setRadarTemplates(data);
                }
            });
        }
    }, [authenticatedUser]);

    const canAddRadar = () => {
        if (!isValid(authenticatedUser)) return false;
        const limit = authenticatedUser.canHaveNRadars;
        if (limit === -1) return true; // unlimited
        const current = isValid(userRadars) ? userRadars.length : 0;
        return current < limit;
    }

    const handleRadarNameChanged = (event) => {
        setRadarName(event.target.value);
    }

    const handleSelectedTemplateChanged = (template) => {
        if (radarName === "" || radarName === selectedTemplate.name) {
            setRadarName(template.name);
        }
        setSelectedTemplate(template);
    }

    const handleAddRadar = (e)  => {
        e.preventDefault();
        if (!canAddRadar()) return;
        if (radarName.trim() === "") {
            alert("You must enter a name for the radar.");
            return;
        }
        if (!selectedTemplate.id) {
            alert("You must select a template.");
            return;
        }

        let radarRepository = new RadarRepository();
        radarRepository.addRadar(authenticatedUser.id, radarName, selectedTemplate, (wasSuccessful, data) => {
            if (wasSuccessful) {
                dispatch(addRadarsToState(data));
                setRadarName("");
                setSelectedTemplate({ name: "Select Template" });
            }
        });
    }

    const limitMessage = `You are only allowed ${authenticatedUser?.canHaveNRadars} Radars on your current subscription. Delete an existing Radar to create a new one.`;

    return (
        <div className="card mb-4">
            <div className="card-header bg-techradar text-white">
                Create a New Radar
            </div>
            <div className="card-body">
                <form onSubmit={handleAddRadar} className="row g-3 align-items-end">
                    <div className="col-md-5">
                        <label className="form-label">Radar Name</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="e.g. Q2 2026 Tech Radar"
                            value={radarName}
                            onChange={handleRadarNameChanged}
                            disabled={!canAddRadar()}
                            required
                        />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Template</label>
                        <div>
                            <DropdownComponent 
                                title={ selectedTemplate.name }  
                                itemMap={ dropdownItem(handleSelectedTemplateChanged, "description", "name") } 
                                data={radarTemplates}
                                disabled={!canAddRadar()}
                            />
                        </div>
                    </div>
                    <div className="col-md-3 d-flex align-items-center gap-2">
                        <button
                            type="submit"
                            id="btn-add-radar"
                            className={ canAddRadar() ? "btn btn-techradar w-100" : "btn btn-secondary w-100" }
                            disabled={!canAddRadar()}
                            title={ canAddRadar() ? "Add a new Radar" : "" }
                        >
                            Add Radar
                        </button>
                        { !canAddRadar() && (
                            <span
                                title={ limitMessage }
                                style={{ color: '#dc3545', fontSize: '1.3rem', cursor: 'help', flexShrink: 0 }}
                                role="img"
                                aria-label="At radar limit"
                            >
                                ⚠
                            </span>
                        )}
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddRadarComponent;
