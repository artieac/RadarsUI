import jQuery from 'jquery';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux"
import ReactDOM from 'react-dom';
import { RadarTemplateRepository } from 'Repositories/RadarTemplateRepository'
import { RadarItemRepository } from 'Repositories/RadarItemRepository'
import DropdownComponent from 'SharedComponents/DropdownComponent'
import ListComponent from 'SharedComponents/ListComponent'
import { radarTemplateDropdownMap } from './radarTemplateDropdownMap'
import { radarCategoryDropdownMap } from './radarCategoryDropdownMap'
import { radarRingDropdownMap } from './radarRingDropdownMap'
import { searchResultsRowDefinition } from './searchResultsRowDefinition'
import { isValid } from 'Apps/Common/Utilities'

export const SearchPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [subjectName, setSubjectName] = useState("");
    const [sharedRadarTemplates, setSharedRadarTemplates] = useState([]);
    const [selectedSharedTemplate, setSelectedSharedTemplate] = useState({ name: "Select" } );
    const [userRadarTemplates, setUserRadarTemplates] = useState([]);
    const [selectedUserTemplate, setSelectedUserTemplate] = useState({ name: "Select" } );
    const [selectedTemplate, setSelectedTemplate] = useState({ radarRings: [], radarCategories: []});
    const [selectedRadarCategory, setSelectedRadarCategory] = useState( { name: "Select" });
    const [selectedRadarRing, setSelectedRadarRing] = useState( { name: "Select" });
    const [searchResults, setSearchResults] = useState([]);

    const loggedInUser = useSelector((state) => state.userReducer.currentUser);

    const dispatch = useDispatch();

     useEffect(() => {
        getSharedRadarTemplates(loggedInUser.id, getSharedRadarTemplatesResponse);
        getUserRadarTemplates(loggedInUser.id, getUserRadarTemplatesResponse);
    }, []);

    const getSharedRadarTemplates = () => {
         let radarTemplateRepository = new RadarTemplateRepository();
         radarTemplateRepository.getPublishedRadarTemplates(getSharedRadarTemplatesResponse);
    }

    const getSharedRadarTemplatesResponse = (wasSuccessful, data) => {
        if(wasSuccessful){
            setSharedRadarTemplates(data);
            setIsLoading(false);
        }
    }

    const getUserRadarTemplates = () => {
         let radarTemplateRepository = new RadarTemplateRepository();
         radarTemplateRepository.getPublishedRadarTemplates(getUserRadarTemplatesResponse);
    }

    const getUserRadarTemplatesResponse = (wasSuccessful, data) => {
        if(wasSuccessful){
            setUserRadarTemplates(data);
            setIsLoading(false);
        }
    }

    const handleSubjectNameChange = (event) => {
        setSubjectName(event.target.value);
    }

    const handleSharedRadarTemplateSelection = (template) => {
        setSelectedSharedTemplate(template);
        setSelectedTemplate(template);
    }

    const handleUserRadarTemplateSelection = (template) => {
        setSelectedUserTemplate(template);
        setSelectedTemplate(template);
    }

    const handleRadarCategorySelection = (category) => {
        setSelectedRadarCategory(category);
    }

    const handleRadarRingSelection = (ring) => {
        setSelectedRadarRing(ring);
    }

    const handleOnSearchClick = (event) => {
        let radarItemRepository = new RadarItemRepository();
        radarItemRepository.searchForRadarSubject(subjectName, selectedTemplate, selectedRadarCategory, selectedRadarRing, isValid(loggedInUser), handleSearchResponse);
    }

    const handleSearchResponse = (wasSuccessful, data) => {
        if(wasSuccessful==true){
            setSearchResults(data);
        }
    }

    const handleSearchResultsSelect = (event) => {
    }

    return (
        <div className="card">
            <div className="card panel-techradar" ng-form="searchInputForm">
                <div className="card-title panel-heading-techradar">Radar Subject</div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-3">
                            <label for="searchName">Name</label>
                            <input type="text" className="form-control" value = { subjectName } onChange = {(event) => handleSubjectNameChange(event) } />
                        </div>
                        <div className="col-md-3">
                            <div className="row">
                                <label for="searchName">Shared Templates</label>
                                <DropdownComponent title = { selectedSharedTemplate.name } data={ sharedRadarTemplates } itemMap = { radarTemplateDropdownMap(handleSharedRadarTemplateSelection) } />
                            </div>
                            <div className={ isValid(loggedInUser) ? "row" : "hidden"}>
                                <label for="userRadarTemplatesDropdown">My Templates</label>
                                <DropdownComponent title = { selectedUserTemplate.name } data={ userRadarTemplates } itemMap = { radarTemplateDropdownMap(handleUserRadarTemplateSelection) } />
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="dropdown pull-left">
                                <label for="radarCategoryDropdown">Category</label>
                                <DropdownComponent title = { selectedRadarCategory.name } data={ selectedTemplate.radarCategories } itemMap = { radarCategoryDropdownMap(handleRadarCategorySelection) } />
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="dropdown pull-left">
                                <label for="radarRingDropdown">Radar Ring:</label>
                                <DropdownComponent title = { selectedRadarRing.name } data={ selectedTemplate.radarRings } itemMap = { radarRingDropdownMap(handleRadarRingSelection) } />
                            </div>
                        </div>
                        <div className="col-md-2">
                            <button type="button" className="btn btn-techradar" onClick={ handleOnSearchClick }>Search</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card">
                <h3>Found Items</h3>
                <ListComponent id="searchResults" itemMap = { searchResultsRowDefinition(handleSearchResultsSelect) } data = { searchResults } />
            </div>
        </div>
    );
}

export default SearchPage;