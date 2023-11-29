import React, { useState, useEffect } from 'react'
import { connect, useSelector, useDispatch } from "react-redux"
import { Link } from 'react-router-dom'
import { addRadarsToState } from 'Redux/RadarReducer'
import { setCurrentUser } from 'Redux/UserReducer'
import { RadarRepository } from 'Repositories/RadarRepository'
import { RadarTemplateRepository } from 'Repositories/RadarTemplateRepository'
import DropdownComponent from 'SharedComponents/DropdownComponent'
import { dropdownItem } from 'SharedComponents/DropdownComponent/dropdownItem'
import { isValid } from 'Apps/Common/Utilities'

export const InsertRadarRowComponent = ({ rowData }) => {
    const [radarTemplates, setRadarTemplates] = useState([]);
    const [radarName, setRadarName] = useState("");
    const [selectedTemplate, setSelectedTemplate] = useState({ name: "Select"});

    const dispatch = useDispatch();

    const userRadars = useSelector((state) => state.radarReducer.radars);
    const authenticatedUser = useSelector((state) => state.userReducer.currentUser);

    useEffect(() => {
        getRadarTemplates(authenticatedUser);
    }, []);

    const getRadarTemplates = (user) => {
        if(isValid(user) && isValid(user.id)){
            let radarTemplateRepository = new RadarTemplateRepository();
            radarTemplateRepository.getOwnedAndAssociatedByUserId(user.id, getRadarTemplatesResponse) ;
        }
    }

    const getRadarTemplatesResponse = (wasSuccessful, data) => {
        if(wasSuccessful){
            setRadarTemplates(data);
        }
    }

    const handleRadarNameChanged = (event) => {
        setRadarName(event.target.value);
    }

    const handleSelectedTemplateChanged = (template) => {
        setSelectedTemplate(template);
    }

    const handleAddRadar = ()  => {
        if(radarName!=""){
            let radarRepository = new RadarRepository();
            radarRepository.addRadar(authenticatedUser.id, radarName, selectedTemplate, handleAddRadarResponse );
        }
        else{
            alert("You must enter a name for the radar.");
        }
    }

    const handleAddRadarResponse = (wasSuccessful, data) => {
        if(wasSuccessful==true){
            dispatch(addRadarsToState(data));
        }
    }

    return (
        <tr>
            <td>
                <input type="text" name="input" className="formControl" required="required" onBlur={(event) => handleRadarNameChanged(event)}/>
            </td>
            <td>
                <DropdownComponent title= { selectedTemplate.name }  itemMap= { dropdownItem(handleSelectedTemplateChanged, "description", "name") } data={radarTemplates}/>
            </td>
            <td><span>&nbsp;</span></td>
            <td><span>&nbsp;</span></td>
            <td><span>&nbsp;</span></td>
            <td>
                <input type="button" className="btn btn-techradar" value="Add Radar" onClick={handleAddRadar} />
            </td>
        </tr>
    )
}

export default InsertRadarRowComponent;