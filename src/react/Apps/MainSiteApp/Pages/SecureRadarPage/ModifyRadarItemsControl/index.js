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

    const authenticatedUser = useSelector((state) => state.userReducer.currentUser);
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
        } else {
            setCurrentEditItemId(null);
            setRadarCategory({name: "Select"});
            setRadarRing({name: "Select"});
            setSubjectId(null);
            setSubjectSearchField("");
            setSubjectUrl("");
            setAssessmentDetails("");
            setConfidenceLevel({text: "Select"});
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

    const handleSaveRadarItem = () => {
        setIsSaving(true);
        let radarItemRepository = new RadarItemRepository();

        let radarSubject = { id: subjectId, name: subjectSearchField, url: subjectUrl };

        if (!isValid(currentEditItemId)){
            if (isValid(radarSubject) && isValid(radarSubject.id) && radarSubject.id > 0){
                radarItemRepository.addRadarItemExistingSubject(authenticatedUser.id,
                   selectedRadar.id,
                   radarCategory,
                   radarRing,
                   confidenceLevel,
                   assessmentDetails,
                   radarSubject,
                   saveRadarItemResponseHandler);
            }
            else{
                radarItemRepository.addRadarItemNewSubject(authenticatedUser.id,
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
            radarItemRepository.updateRadarItem(authenticatedUser.id,
                selectedRadar.id,
                selectedRadarItem.id,
                radarCategory,
                radarRing,
                confidenceLevel,
                assessmentDetails,
                radarSubject,
                saveRadarItemResponseHandler);
        }
    }

    const saveRadarItemResponseHandler = (wasSuccessful, data) => {
        if(wasSuccessful == true){
            dispatch(setCurrentRadarInstanceToState(data));
        }
    }

    const handleRemoveRadarItem = () => {
        let radarItemRepository = new RadarItemRepository();
        radarItemRepository.deleteRadarItem(authenticatedUser.id, selectedRadar.id, currentEditItemId, handleRemoveRadarItemResponse)
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
       <div className="card mb-3">
           <div className="card-body p-3">
               <div className="container-fluid p-0">
                   <div className="row g-3 align-items-end">
                       <div className="col-md-3">
                           <label className="form-label mb-1 small fw-bold">Name & Search</label>
                           <div className="input-group input-group-sm">
                               <input type="text" className="form-control" id="subjectName" name="subjectName" value={ subjectSearchField } onChange = { handleSubjectNameChange } placeholder="Search or Enter Name"/>
                               <button className="btn btn-techradar" type="button" onClick= { handleSubjectSearchClick }><i className="bi bi-search"></i></button>
                           </div>
                           <div style={{ position: 'absolute', zIndex: 1000, width: '20%' }}>
                                <ListComponent id="searchResults" itemMap = { searchResultsRowDefinition(handleSearchResultsSelect) } data = { subjectSearchResults } />
                           </div>
                       </div>
                       <div className="col-md-2">
                           <label className="form-label mb-1 small fw-bold">Category</label>
                           <DropdownComponent title = { radarCategory.name } itemMap = { nameIdValueDropdownMap(handleSelectRadarCategory) } data = { radarState.currentRadar.radarTemplate.radarCategories } />
                       </div>
                       <div className="col-md-2">
                           <label className="form-label mb-1 small fw-bold">Ring</label>
                           <DropdownComponent title = { radarRing.name } itemMap = { nameIdValueDropdownMap(handleSelectRadarRing) } data = { radarState.currentRadar.radarTemplate.radarRings } />
                       </div>
                       <div className="col-md-3">
                           <label className="form-label mb-1 small fw-bold">URL</label>
                           <div className="input-group input-group-sm">
                               <input type="text" className="form-control" id="subjectUrl" name="subjectUrl" value={ subjectUrl } onChange={ handleSubjectUrlChange } placeholder="http://..."/>
                               <a className="btn btn-techradar" href={ subjectUrl } target="_blank"><i className="bi bi-eye-fill"></i></a>
                           </div>
                       </div>
                       <div className="col-md-2">
                           <div className="d-flex gap-1">
                               <button type="button" className="btn btn-sm btn-outline-secondary w-100" title="Clear Form" onClick = { handleClearForm }>Clear</button>
                               <button type="button" className="btn btn-sm btn-techradar w-100" title="Save Item" onClick = { handleSaveRadarItem } disabled= { !canAddRadarItem() }>Save</button>
                               <button type="button" className="btn btn-sm btn-danger w-100" title="Delete Item" onClick = { handleRemoveRadarItem } disabled={ !isExistingRadarItemSelected() }>Delete</button>
                           </div>
                       </div>
                   </div>
                   <div className="row mt-3">
                       <div className="col-12">
                           <label className="form-label mb-1 small fw-bold">Assessment Details</label>
                           <textarea rows="2" className="form-control form-control-sm" id="subjectDetails" name="subjectDetails" value={ assessmentDetails } onChange = { handleAssessmentDetailsChange } placeholder="Enter assessment notes here..." style={{ resize: 'none' }}/>
                       </div>
                   </div>
               </div>
           </div>
       </div>
    );
}

export default ModifyRadarItemsControl;