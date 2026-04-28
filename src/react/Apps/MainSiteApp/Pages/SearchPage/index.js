'use strict'
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux"
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
    const [radarTemplates, setRadarTemplates] = useState([]);
    const [selectedRadarTemplate, setSelectedRadarTemplate] = useState({ name: "Select", radarRings: [], radarCategories: [] } );
    const [selectedRadarCategory, setSelectedRadarCategory] = useState( { name: "Select" });
    const [selectedRadarRing, setSelectedRadarRing] = useState( { name: "Select" });
    const [searchResults, setSearchResults] = useState([]);

    const authenticatedUser = useSelector((state) => state.userReducer.currentUser);

    useEffect(() => {
        const radarTemplateRepository = new RadarTemplateRepository();
        
        if (isValid(authenticatedUser) && authenticatedUser.id > 0) {
            radarTemplateRepository.getOwnedAndAssociatedByUserId(authenticatedUser.id, (wasSuccessful, data) => {
                if (wasSuccessful) {
                    // Start with user's templates
                    let combinedTemplates = [...data];
                    
                    // Then add published ones that aren't already there
                    radarTemplateRepository.getPublishedRadarTemplates((pubSuccessful, pubData) => {
                        if (pubSuccessful) {
                            pubData.forEach(pubTemp => {
                                if (!combinedTemplates.find(t => t.id === pubTemp.id)) {
                                    combinedTemplates.push(pubTemp);
                                }
                            });
                        }
                        setRadarTemplates(combinedTemplates);
                        setIsLoading(false);
                    });
                } else {
                    fetchPublishedOnly(radarTemplateRepository);
                }
            });
        } else {
            fetchPublishedOnly(radarTemplateRepository);
        }
    }, [authenticatedUser]);

    const fetchPublishedOnly = (repository) => {
        repository.getPublishedRadarTemplates((wasSuccessful, data) => {
            if (wasSuccessful) {
                setRadarTemplates(data);
            }
            setIsLoading(false);
        });
    }

    const handleSubjectNameChange = (event) => {
        setSubjectName(event.target.value);
    }

    const handleRadarTemplateSelection = (template) => {
        setSelectedRadarTemplate(template);
        setSelectedRadarCategory({ name: "Select" });
        setSelectedRadarRing({ name: "Select" });
    }

    const handleRadarCategorySelection = (category) => {
        setSelectedRadarCategory(category);
    }

    const handleRadarRingSelection = (ring) => {
        setSelectedRadarRing(ring);
    }

    const handleOnSearchClick = () => {
        let radarItemRepository = new RadarItemRepository();
        radarItemRepository.searchForRadarSubject(subjectName, selectedRadarTemplate, selectedRadarCategory, selectedRadarRing, !isValid(authenticatedUser), handleSearchResponse);
    }

    const handleSearchResponse = (wasSuccessful, data) => {
        if(wasSuccessful === true){
            setSearchResults(data);
        }
    }

    const handleSearchResultsSelect = (event) => {
        // TBD
    }

    return (
        <div className="card">
            <div className="card panel-techradar">
                <div className="card-title panel-heading-techradar">Search Technologies</div>
                <div className="card-body">
                    <div className="row g-3 align-items-end">
                        <div className="col-md-3">
                            <label className="form-label fw-bold small">Technology Name</label>
                            <input type="text" className="form-control form-control-sm" placeholder="e.g. React" value={subjectName} onChange={handleSubjectNameChange} />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label fw-bold small">Radar Template</label>
                            <DropdownComponent title={selectedRadarTemplate.name} data={radarTemplates} itemMap={radarTemplateDropdownMap(handleRadarTemplateSelection)} />
                        </div>
                        <div className="col-md-2">
                            <label className="form-label fw-bold small">Category</label>
                            <DropdownComponent title={selectedRadarCategory.name} data={selectedRadarTemplate.radarCategories || []} itemMap={radarCategoryDropdownMap(handleRadarCategorySelection)} />
                        </div>
                        <div className="col-md-2">
                            <label className="form-label fw-bold small">Ring</label>
                            <DropdownComponent title={selectedRadarRing.name} data={selectedRadarTemplate.radarRings || []} itemMap={radarRingDropdownMap(handleRadarRingSelection)} />
                        </div>
                        <div className="col-md-2">
                            <button type="button" className="btn btn-techradar w-100" onClick={handleOnSearchClick}>
                                <i className="bi bi-search me-2"></i>Search
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            {searchResults.length > 0 && (
                <div className="card mt-4">
                    <div className="card-title panel-heading-techradar">Search Results</div>
                    <div className="card-body p-0">
                        <ListComponent id="searchResults" itemMap={searchResultsRowDefinition(handleSearchResultsSelect)} data={searchResults} />
                    </div>
                </div>
            )}
            
            {!isLoading && searchResults.length === 0 && subjectName !== "" && (
                <div className="text-center mt-4 text-muted">
                    <p>No items found matching your criteria.</p>
                </div>
            )}
        </div>
    );
}

export default SearchPage;