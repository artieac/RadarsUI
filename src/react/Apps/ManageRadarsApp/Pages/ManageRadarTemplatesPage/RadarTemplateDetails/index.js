import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { connect, useSelector, useDispatch } from "react-redux";
import { addRadarTemplatesToState, addSelectedRadarTemplateToState } from 'Redux/RadarTemplateReducer';
import { RadarTemplateRepository } from 'Repositories/RadarTemplateRepository';
import RadarRingsComponent from './RadarRingsComponent'
import RadarCategoriesComponent from './RadarCategoriesComponent'
import { isValid } from 'Apps/Common/Utilities'

export const RadarTemplateDetails = ({ editMode, selectedTemplate }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isPublished, setIsPublished] = useState(false);

    const loggedInUser = useSelector((state)=>state.userReducer.currentUser);

    const dispatch = useDispatch();

    useEffect(() => {
        if(isValid(selectedTemplate)){
            setName(selectedTemplate.name);
            setDescription(selectedTemplate.description);
            setIsPublished(selectedTemplate.isPublished);
        }
    },[selectedTemplate]);

    const handleNameChange = (event) => {
        setName(event.target.value);
        selectedTemplate.name = event.target.value;
        dispatch(addSelectedRadarTemplateToState(selectedTemplate));
    }

    const handleDescriptionChange = (event)=> {
        setDescription(event.target.value);
        selectedTemplate.description = event.target.value;
        dispatch(addSelectedRadarTemplateToState(selectedTemplate));
    }

    const handleIsPublishedChange = (event) => {
        setIsPublished(event.target.value);
        selectedTemplate.isPublished = event.target.value;
        dispatch(addSelectedRadarTemplateToState(selectedTemplate));
    }

    const handleSaveRadarTemplate = () => {
        if(!isValid(selectedTemplate.radarRings) || selectedTemplate.radarRings.length==0){
  //          this.forceUpdate();
        }
        else{
            let radarTemplateRepository = new RadarTemplateRepository();

            if(isValid(selectedTemplate.id) && selectedTemplate.id > 0){
                radarTemplateRepository.updateRadarTemplate(loggedInUser.id, selectedTemplate, handleEditChangeResponse);
            }
            else{
                radarTemplateRepository.addRadarTemplate(loggedInUser.id, selectedTemplate, handleEditChangeResponse);
            }
        }
    }

    const handleEditChangeResponse = (wasSuccessful, data) => {
        if(wasSuccessful==true){
            dispatch(addSelectedRadarTemplateToState(data));
            let radarTemplateRepository = new RadarTemplateRepository();
            radarTemplateRepository.getMostRecentByUserId(loggedInUser.id, handleGetRadarTemplatesResponse);
        }
    }

    const handleGetRadarTemplatesResponse = (wasSuccessful, data) =>{
        if(wasSuccessful==true){
            dispatch(addRadarTemplatesToState(data));
        }
    }

    const handleTextChange = (event)=> {}

    return (
        <div className="row">
            <div className="col-md-12">
                <div className='row'>
                    <div className="col-md-3">Name</div>
                    <div className="col-md-4">
                        <input type="text" defaultValue = { name } value = { name }  onChange = {(event) => handleNameChange(event)} readOnly={editMode ? '' : '"readonly"'}/>
                    </div>
                    <div className={editMode===true ? "col-md-3" : "hidden"}>
                       <input type="button" className='btn btn-techradar' disabled={editMode!==true} value="Save" onClick={(event) => handleSaveRadarTemplate(event) }/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3">Description</div>
                    <div className="col-md-6">
                        <div className="form-group">
                              <textarea className="form-control rounded-0" rows="3" defaultValue={description} value={description }  onChange = {(event) => handleDescriptionChange(event) } readOnly={editMode ? '' : '"readonly"'}></textarea>
                          </div>
                    </div>
                </div>
                <div className={ editMode===true ? "row" : "hidden"}>
                    <div className="col-md-3">Share with others?</div>
                    <div className="col-md-4">
                        <input type="checkbox" checked={ isPublished } onChange = {(event) => handleIsPublishedChange(event) } readOnly={editMode ? '' : '"readonly"'}/>
                    </div>
                    <div className="col-md-5"></div>
                </div>
                <RadarRingsComponent editMode={ editMode } canAddOrDelete={ selectedTemplate.id < 0} radarRings = { selectedTemplate.radarRings } />
                <RadarCategoriesComponent editMode={ editMode } canAddOrDelete={ selectedTemplate.id < 0} radarCategories = { selectedTemplate.radarCategories }/>
            </div>
        </div>
    );
};

export default RadarTemplateDetails;

