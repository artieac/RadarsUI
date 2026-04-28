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
                            required
                        />
                    </div>
                    <div className="col-md-5">
                        <label className="form-label">Template</label>
                        <div>
                            <DropdownComponent 
                                title={ selectedTemplate.name }  
                                itemMap={ dropdownItem(handleSelectedTemplateChanged, "description", "name") } 
                                data={radarTemplates}
                            />
                        </div>
                    </div>
                    <div className="col-md-2">
                        <button type="submit" className="btn btn-techradar w-100" title="Add a new Template to rate different types of things">Add Radar</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddRadarComponent;
