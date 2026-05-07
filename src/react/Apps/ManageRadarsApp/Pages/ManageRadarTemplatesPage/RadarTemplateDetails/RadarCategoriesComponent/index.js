import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { connect, useDispatch, useSelector } from "react-redux";
import TableComponent2 from 'SharedComponents/TableComponent2'
import { radarCategoryRowDefinition } from './radarCategoryRowDefinition'
import { isValid } from 'Apps/Common/Utilities'
import { addSelectedRadarTemplateToState } from 'Redux/RadarTemplateReducer'

export const RadarCategoriesComponent = ({ editMode, canAdd, canDelete }) => {
    const [reRender, setReRender] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const [selectedColor, setSelectedColor] = useState(null);

    const dispatch = useDispatch();

    const selectedTemplate = useSelector((state) => state.radarTemplateReducer.selectedRadarTemplate);

    const handleDeleteClick = (event, rowData) => {
        if(isValid(selectedTemplate.radarCategories)){
            for(var i = 0; i < selectedTemplate.radarCategories.length; i++){
                if(selectedTemplate.radarCategories[i].id==rowData.id){
                    selectedTemplate.radarCategories.splice(i, 1);
                    dispatch(addSelectedRadarTemplateToState(selectedTemplate));
                    setIsDeleted(!isDeleted);
                    break;
                }
            }
        }
    }

    const handleAddClick = (event) => {
        if(!isValid(selectedTemplate.radarCategories)){
            selectedTemplate.radarCategories = [];
        }

        let newId = -1;
        if(selectedTemplate.radarCategories.length > 0){
            for(let i = 0; i < selectedTemplate.radarCategories.length; i++){
                if(selectedTemplate.radarCategories[i].id <= newId){
                    newId = selectedTemplate.radarCategories[i].id - 1;
                }
            }
        }

        selectedTemplate.radarCategories.push({
            id: newId,
            name: "New Category",
            displayOption: "#000000"
        });

        dispatch(addSelectedRadarTemplateToState(selectedTemplate));
        setIsDeleted(!isDeleted);
    }

    return (
        <div className="row">
            <div className="col-md-12">
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <div className="row">
                            <div className="col-md-6 text-start">Categories</div>
                            <div className="col-md-6 text-end">
                                <button className={canAdd ? "btn btn-techradar btn-sm" : "hidden"} onClick={handleAddClick}>Add Category</button>
                            </div>
                        </div>
                    </div>
                    <TableComponent2 data={ selectedTemplate.radarCategories } rowDefinition={radarCategoryRowDefinition({ editMode, canDelete, onDeleteClick: handleDeleteClick }) } hoverable striped={false} bordered={false} />
                </div>
            </div>
        </div>
    );
};

export default RadarCategoriesComponent;
