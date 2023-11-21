import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { connect, useSelector, useDispatch } from "react-redux";
import { isValid } from 'Apps/Common/Utilities';
import { addSelectedRadarTemplateToState } from 'Redux/RadarTemplateReducer';

export const RadarRingComponent = ({ rowData, editMode }) => {
    const [name, setName] = useState("");
    const [sortOrder, setSortOrder] = useState("");

    const dispatch = useDispatch();

    useEffect(() => {
        if(isValid(rowData)){
            setName(rowData.name);
            setSortOrder(rowData.displayOption);
        }
    },[rowData]);

    const selectedTemplate = useSelector((state) => state.radarTemplateReducer.selectedRadarTemplate);

    const handleNameChange = (event) => {
        setName(event.target.value);

        if(isValid(selectedTemplate) && isValid(selectedTemplate.radarRings)){
            for(var i = 0; i < selectedTemplate.radarRings.length; i++){
                if(selectedTemplate.radarRings[i].id==rowData.id){
                    selectedTemplate.radarRings[i].name = event.target.value;
                    dispatch(addSelectedRadarTemplateToState(selectedTemplate));
                    break;
                }
            }
        }
    }

    const handleSortOrderChange = (event) => {
        setSortOrder(event.target.value);

        if(isValid(selectedTemplate) && isValid(selectedTemplate.radarRings)){
            for(var i = 0; i < selectedTemplate.radarRings.length; i++){
                if(selectedTemplate.radarRings[i].id==rowData.id){
                    selectedTemplate.radarRings[i].displayOption = event.target.value;
                    dispatch(addSelectedRadarTemplateToState(selectedTemplate));
                    break;
                }
            }
        }
    }

    return (
        <tr>
            <td>
                <input type="text" defaultValue = { name } value = { name } onChange={(event) => handleNameChange(event, rowData)} />
            </td>
            <td>
                <input type="text" defaultValue={ sortOrder } value={ sortOrder} onChange={(event) => handleSortOrderChange(event)} maxLength="2" size="2"/>
            </td>
        </tr>
    );
}

export default RadarRingComponent;