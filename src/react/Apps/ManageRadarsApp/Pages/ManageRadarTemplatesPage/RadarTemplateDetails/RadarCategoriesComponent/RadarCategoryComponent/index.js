import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { connect, useSelector, useDispatch } from "react-redux";
import { isValid } from 'Apps/Common/Utilities';
import { addSelectedRadarTemplateToState } from 'Redux/RadarTemplateReducer';
import { colorMapData } from '../../../../../components/colorMapData'
import { colorMap } from './colorMap';
import DropdownComponent from 'SharedComponents/DropdownComponent'

export const RadarCategoryComponent = ({ rowData, editMode }) => {
    const [name, setName] = useState("");
    const [iconColor, setIconColor] = useState("");

    const dispatch = useDispatch();

    useEffect(() => {
        if(isValid(rowData)){
            setName(rowData.name);
            setIconColor(rowData.displayOption);
        }
    },[rowData]);

    const selectedTemplate = useSelector((state) => state.radarTemplateReducer.selectedRadarTemplate);

    const colorMapLookup = (colorValue) => {
        if(colorValue !== undefined){
            for(var i = 0; i < colorMapData().length; i++){
                if(colorMapData()[i].value===colorValue){
                    return colorMapData()[i];
                }
            }
        }
        return colorMapData()[0];
    };

    const handleNameChange = (event) => {
        setName(event.target.value);

        if(isValid(selectedTemplate) && isValid(selectedTemplate.radarRings)){
            for(var i = 0; i < selectedTemplate.radarCategories.length; i++){
                if(selectedTemplate.radarCategories[i].id==rowData.id){
                    selectedTemplate.radarCategories[i].name = event.target.value;
                    dispatch(addSelectedRadarTemplateToState(selectedTemplate));
                    break;
                }
            }
        }
    }

    const handleColorChange = (colorValue) => {
        setIconColor(colorValue);

        if(isValid(selectedTemplate) && isValid(selectedTemplate.radarRings)){
            for(var i = 0; i < selectedTemplate.radarCategories.length; i++){
                if(selectedTemplate.radarCategories[i].id==rowData.id){
                    selectedTemplate.radarCategories[i].displayOption = colorValue;
                    dispatch(addSelectedRadarTemplateToState(selectedTemplate));
                    break;
                }
            }
        }
    }

    return (
        <tr>
            <td>
                <input type="text" className={ editMode===true ? '' : 'readonly="readonly"'} defaultValue={ name } value = { name } required="required"  onChange = {(event) => handleNameChange(event, rowData) }/>
            </td>
            <td>
                <DropdownComponent title= { colorMapLookup(iconColor).name } itemMap= { colorMap(handleColorChange, rowData) } data={colorMapData()}/>
            </td>
        </tr>
    );
}

export default RadarCategoryComponent;