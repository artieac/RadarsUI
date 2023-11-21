'use strict'
import jQuery from 'jquery'
import React, { useState, useEffect } from 'react'
import { connect, useSelector, useDispatch } from "react-redux"
import ReactDOM from 'react-dom'
import { isValid } from 'Apps/Common/Utilities'
import { useParams } from 'react-router-dom'
import { searchResultsRowDefinition } from './searchResultsRowDefinition'
import { nameIdValueDropdownMap } from './nameIdValueDropdownMap'
import { confidenceItemMap, confidenceOptions } from './confidenceItemMap'
import DropdownComponent from 'SharedComponents/DropdownComponent'
import ListComponent from 'SharedComponents/ListComponent'
import { RadarItemRepository } from 'Repositories/RadarItemRepository.js'
import { setSelectedRadarItem,disableRadarItemChangedAlert, setCurrentRadarInstanceToState } from 'Redux/RadarReducer'

export const ModifyRadarItemsControl = ({ selectedRadarItem } ) => {
    const [isSaving, setIsSaving] = useState(false);
    const [subjectSearchField, setSubjectSearchField] = useState("");
    const [subjectSearchResults, setSubjectSearchResults] = useState([]);
    const [subjectId, setSubjectId] = useState(null);
    const [subjectUrl, setSubjectUrl] = useState("");
    const [currentEditItemId, setCurrentEditItemId] = useState(null);
    const [radarCategory, setRadarCategory] = useState({name: "Select"});
    const [radarRing, setRadarRing] = useState({name: "Select"});
    const [confidenceLevel, setConfidenceLevel] = useState({text: "Select"});
    const [assessmentDetails, setAssessmentDetails] = useState("");

    const loggedInUser = useSelector((state) => state.userReducer.currentUser);
    const radarState = useSelector((state) => state.radarReducer);
    const selectedRadar = useSelector((state) => state.radarReducer.currentRadar);

    const dispatch = useDispatch();

    useEffect(() => {
        if(isValid(selectedRadarItem)==true){
            setCurrentEditItemId(selectedRadarItem.id);
            setRadarCategory(selectedRadarItem.radarCategory);
            setRadarRing(selectedRadarItem.radarRing);
            setSubjectId(selectedRadarItem.technology.id);
            setSubjectSearchField(selectedRadarItem.technology.name);
            setSubjectUrl(selectedRadarItem.technology.url);
            setAssessmentDetails(selectedRadarItem.details);

            let options = confidenceOptions();
            let confidenceLevel = options[1];

            options.forEach((item, index) => {
                  if(item.value==selectedRadarItem.confidenceLevel){
                    confidenceLevel = item;
                  }
              });

            setConfidenceLevel(confidenceLevel);
        }
    },[selectedRadarItem]);

    const handleSubjectNameChange = (event) => {
        setSubjectSearchField(event.target.value);
    }

    const handleSubjectSearchClick = () => {
        setSubjectId(null);

        let radarItemRepository = new RadarItemRepository();
        radarItemRepository.searchForRadarSubject(subjectSearchField, null, null, null, true, handleSubjectSearchResults);
    }

    const handleSubjectSearchResults = (wasSuccessful, data) => {
        if(wasSuccessful==true){
            setSubjectSearchResults(data);
        }
    }

    const handleSearchResultsSelect = (subject) => {
        if(isValid(subject)){
            setSubjectId(subject.id);
            setSubjectSearchField(subject.name);
            setSubjectUrl(subject.url);
            setSubjectSearchResults([]);
        }
    }

    const handleSubjectUrlChange = (event) => {
        setSubjectUrl(event.target.value);
    }

    const handleSelectRadarCategory = (radarCategory) => {
        setRadarCategory(radarCategory);
    }

    const handleSelectRadarRing = (radarRing) => {
        setRadarRing(radarRing);
    }

    const handleSelectConfidence = (confidence) => {
        setConfidenceLevel(confidence);
    }

    const handleAddRadarItem = () => {
        setIsSaving(true);
        let radarItemRepository = new RadarItemRepository();

        let radarSubject = { id: subjectId, name: subjectSearchField, url: subjectUrl };

        if (!isValid(currentEditItemId)){
            if (isValid(radarSubjectId) && isValid(radarSubject.id) && radarSubject.id > 0){
                radarItemRepository.addRadarItemExistingSubject(loggedInUser.id,
                   selectedRadar.id,
                   radarCategory,
                   radarRing,
                   confidenceLevel,
                   assessmentDetails,
                   radarSubject,
                   saveRadarItemResponseHandler);
            }
            else{
                radarItemRepository.addRadarItemNewSubject(loggedInUser.id,
                   selectedRadar.id,
                   radarCategory,
                   radarRing,
                   confidenceLevel,
                   assessmentDetails,
                   subjectSearchField,
                   radarSubject.url,
                   saveRadarItemResponseHandler);
            }
        } else {

        }
    }

    const saveRadarItemResponseHandler = (wasSuccessful, data) => {
        if(wasSuccessful == true){
            dispatch(setCurrentRadarInstanceToState(data));
        }
    }

    const handleRemoveRadarItem = () => {
        let radarItemRepository = new RadarItemRepository();
        radarItemRepository.deleteRadarItem(loggedInUser.id, selectedRadar.id, currentEditItemId, handleRemoveRadarItemResponse)
    }

    const handleRemoveRadarItemResponse = (wasSuccessful, userId, radarId) => {
        if(wasSuccessful){
            // tbd, refresh radar
        }
    }

    const handleClearForm = () => {
        let radarItemRepository = new RadarItemRepository();
        let clearRadarItem = radarItemRepository.createRadarItemForNewSubject(null, null, null, "", "");
        dispatch(setSelectedRadarItem(clearRadarItem));

        setCurrentEditItemId(null);
        setRadarCategory({ name: "Select"});
        setRadarRing({ name: "Select"});
        setSubjectId(null);
        setSubjectSearchField("");
        setSubjectUrl("");
        setAssessmentDetails("");
    }

    const canAddRadarItem = () => {
        if((isValid(subjectId) ||
            (isValid(subjectSearchField) && subjectSearchField != "" && isValid(subjectUrl) && subjectUrl != "")) &&
           isValid(radarCategory) && isValid(radarCategory.id) &&
           isValid(radarRing) && isValid(radarRing.id) &&
           isValid(confidenceLevel) &&
           assessmentDetails != ""){
            return true;
       }

       return false;
    }

    const isExistingRadarItemSelected = () => {
        var retVal = false;

        if(isValid(selectedRadarItem) &&
           isValid(selectedRadarItem.id) &&
           isValid(currentEditItemId) &&
           selectedRadarItem.id==currentEditItemId){
            retVal = true;
        }

        return retVal;
    }

    const handleAssessmentDetailsChange = (event) => {
        setAssessmentDetails(event.target.value);
    }

    return (
       <div>
           <div className="card panel-techradar">
               <div className="card-title panel-heading-techradar">Radar Item</div>
               <div id="assessmentDetailsPanel" className="card-body">
                   <div className="row">
                       <label>Radar Category:</label>
                        <DropdownComponent title = { radarCategory.name } itemMap = { nameIdValueDropdownMap(handleSelectRadarCategory) } data = { radarState.currentRadar.radarTemplate.radarCategories } />
                   </div>
                   <div className="row">
                       <label>Name</label>
                       <div className="input-group">
                           <input type="text" id="subjectName" name="subjectName" defaultValue = { subjectSearchField } value={ subjectSearchField } onChange = { handleSubjectNameChange }/>
                           <div className="input-group-btn">
                               <button className="btn btn-techradar" type="submit" onClick= { handleSubjectSearchClick }><i className="bi bi-search"></i></button>
                           </div>
                           <ListComponent id="searchResults" itemMap = { searchResultsRowDefinition(handleSearchResultsSelect) } data = { subjectSearchResults } />
                       </div>
                   </div>
                   <div className="row">
                       <label>Url</label>
                       <div className="input-group">
                           <input type="text" id="subjectUrl" name="subjectUrl" defaultValue={ subjectUrl } value={ subjectUrl } onChange={ handleSubjectUrlChange }/>
                           <div className="input-group-btn">
                               <button type="button" className="btn btn-techradar"><a href={ subjectUrl } target="_blank"><i className="bi bi-eye-fill"></i></a></button>
                           </div>
                       </div>
                   </div>
                   <div className="row">
                       <label>Radar Ring:</label>
                       <DropdownComponent title = { radarRing.name } itemMap = { nameIdValueDropdownMap(handleSelectRadarRing) } data = { radarState.currentRadar.radarTemplate.radarRings } />
                   </div>
                   <div className="row hidden">
                       <div className="dropdown pull-left">
                           <label>How well is it going so far?</label>
                           <DropdownComponent title = { confidenceLevel.text } itemMap = { confidenceItemMap(handleSelectConfidence) } data = { confidenceOptions() } />
                       </div>
                   </div>
                   <div className="row">
                       <label>Details</label>
                       <textarea rows="10" id="subjectDetails" name="subjectDetails" defaultValue = { assessmentDetails } value={ assessmentDetails } onChange = { handleAssessmentDetailsChange } />
                   </div>
                   <div className="row">
                       <div className="col-md-3">
                           <button type="button" className="btn btn-techradar" onClick = { handleClearForm }>Clear</button>
                       </div>
                       <div className="col-md-3">
                           <button type="button" className="btn btn-techradar" onClick = { handleAddRadarItem } disabled= { !canAddRadarItem() }>Save</button>
                       </div>
                       <div className="col-md-3">
                           <button type="button" className="btn btn-techradar" onClick = { handleRemoveRadarItem } disabled={ !isExistingRadarItemSelected() }>Delete</button>
                       </div>
                   </div>
               </div>
           </div>
       </div>
    );
}

export default ModifyRadarItemsControl;