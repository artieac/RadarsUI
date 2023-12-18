'use strict'
import React, { useState, useEffect } from 'react';
import { connect, useSelector, useDispatch } from "react-redux"
import { useParams } from 'react-router-dom'
import radarReducer from 'Redux/RadarReducer';
import { addRadarsToState, setSourceRadarInstanceToState, setCurrentRadarInstanceToState } from 'Redux/RadarReducer';
import { UserRepository } from 'Repositories/UserRepository';
import { RadarRepository } from 'Repositories/RadarRepository';
import DropdownComponent from 'SharedComponents/DropdownComponent'
import { dropdownItem } from 'SharedComponents/DropdownComponent/dropdownItem'
import { radarDropdownMap } from './radarDropdownMap';
import RadarCopyControl from './RadarCopyControl';
import ConfigurationSettings from 'Apps/Common/ConfigurationSettings'
import { isValid } from 'Apps/Common/Utilities'

export const AddFromPreviousRadarPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [sourceRadar, setSourceRadar] = useState({});
    const [destinationRadar, setDestinationRadar] = useState({});
    const [filteredRadarCollection, setFilteredRadarCollection] = useState([]);
    const [radarItemsToAdd, setRadarItemsToAdd] = useState([]);
    const [radarItemsToRemove, setRadarItemsToRemove] = useState([]);
    const dispatch = useDispatch();

    const userState = useSelector((state) => state.userReducer);
    const radarState = useSelector((state) => state.radarReducer);
    const radarTemplateState = useSelector((state) => state.radarTemplateReducer);

    const { destinationRadarId } = useParams();

    useEffect(() => {
        getCurrentRadarInstance(userState.currentUser.id, destinationRadarId);
    }, []);

    const getCurrentRadarInstance = (userId, radarId) => {
        let radarRepository = new RadarRepository();
        radarRepository.getByUserIdAndRadarId(false, userId, radarId, getRadarByUserIdAndRadarIdResponse);
    }

    const getRadarByUserIdAndRadarIdResponse = (wasSuccessful, data) => {
        if(wasSuccessful){
            setDestinationRadar(data);
            setIsLoading(false);
            getRadarCollectionByUserIdAndRadarTemplateId(userState.currentUser.id, data.radarTemplate.id);
        }
    }

    const handleSourceRadarSelection = (targetRadar) => {
        let radarRepository = new RadarRepository();
        radarRepository.getByUserIdAndRadarId(false, userState.currentUser.id, targetRadar.id, handleGetSourceRadarResponse);
    }

    const handleGetSourceRadarResponse = (wasSuccessful, data) => {
        if(wasSuccessful){
            setSourceRadar(data);
        }
    }

    const getRadarCollectionByUserIdAndRadarTemplateId = (userId, radarTemplateId) => {
        let radarRepository = new RadarRepository();
        radarRepository.getRadarsByUserIdAndRadarTemplateId(false, userId, radarTemplateId, getFilteredRadarsResponse);
    }

    const getFilteredRadarsResponse = (wasSuccessful, data) => {
        if(wasSuccessful==true){
            setFilteredRadarCollection(data);
        }
    }

    const handleAddRemoveItemsResponse = (wasSuccessful) =>{
        if(wasSuccessful==true){
            getCurrentRadarInstance(userState.currentUser.id, destinationRadarId);
        }
    }

    const handleAddItemsToRadarClick = (event, userId) => {
        let radarRepository = new RadarRepository();
        radarRepository.addItemsToRadar(userId, destinationRadarId, radarItemsToAdd, handleAddRemoveItemsResponse);
        setRadarItemsToAdd([]);
    }

    const handleRemoveItemsFromRadarClick = (event, userId) => {
        let radarRepository = new RadarRepository();
        radarRepository.removeItemsFromRadar(userId, destinationRadarId, radarItemsToRemove, handleAddRemoveItemsResponse);
        setRadarItemsToRemove([]);
    }

    const getDestinationRadarName = () => {
        var retVal = "";

        if(destinationRadar !== undefined){
            return getRadarNameAndDate(destinationRadar);
        }

        return retVal;
    }

    const getRadarNameAndDate = (radar) => {
        if(radar!=undefined && radar.radarName !== undefined){
            var parsedDate = new Date(radar.assessmentDate);
            return radar.radarName + " - " + (parsedDate.getMonth() + 1) + "-" + parsedDate.getUTCFullYear();
        }

        return "Select a source";
    }

    const createRadarItemForExistingTechnology = (assessmentItem) => {
        var radarItem = {};

        radarItem.radarCategory = assessmentItem.radarCategory.id;
        radarItem.radarRing = assessmentItem.radarRing.id;
        radarItem.confidenceLevel = assessmentItem.confidenceFactor;
        radarItem.assessmentDetails = assessmentItem.details;
        radarItem.technologyId = assessmentItem.technology.id;

        return radarItem;
    }

    const onHandleAddRadarItem = (event, assessmentItem) => {
        var filteredRadarItemsToAdd = [];

        if(isValid(radarItemsToAdd) && radarItemsToAdd.length > 0){
            filteredRadarItemsToAdd = radarItemsToAdd.filter(() => true);
        }

        if(event.target.checked==true){
            filteredRadarItemsToAdd.push(createRadarItemForExistingTechnology(assessmentItem));
            setRadarItemsToAdd(filteredRadarItemsToAdd);
        } else {
            filteredRadarItemsToAdd =
                filteredRadarItemsToAdd.filter(function( radarItem ) {
                    return radarItem.technologyId !== assessmentItem.technology.id;
                });
        }

        setRadarItemsToAdd(filteredRadarItemsToAdd);
    }

    const onHandleRemoveRadarItem = (event, assessmentItem) => {
        var filteredRadarItemsToRemove = [];

        if(radarItemsToRemove!=null && radarItemsToRemove!='undefined' && radarItemsToRemove.length==0){
            filteredRadarItemsToRemove = radarItemsToRemove.filter(() => true);
        }

        if(event.target.checked==true){
            filteredRadarItemsToRemove = filteredRadarItemsToRemove.concat(assessmentItem.id);
        } else {
            filteredRadarItemsToRemove =
                filteredRadarItemsToRemove.filter(function( radarItem ) {
                    return radarItem !== assessmentItem.id;
                });
        }

        setRadarItemsToRemove(filteredRadarItemsToRemove);
    }

    if(isLoading==true){
        return ( <div/> );
    } else {
        return (
            <div>
                <div className="row">
                    <div className="col-lg-6">
                        <label>Source Radar Instance</label>
                        <DropdownComponent title = { getRadarNameAndDate(sourceRadar) } data={ filteredRadarCollection } itemMap = { radarDropdownMap(handleSourceRadarSelection) } />
                        <button type="button" className="btn btn-techradar" onClick={ (event) => handleAddItemsToRadarClick(event, userState.currentUser.id) }>Add</button>
                    </div>
                    <div className="col-lg-6">
                        <div className="contentPageTitle">
                            <label>Add Past Radar Items to { getDestinationRadarName() } </label>
                            <button type="button" className="btn btn-techradar" onClick={(event) => handleRemoveItemsFromRadarClick(event, userState.currentUser.id) }>Remove</button>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <RadarCopyControl
                        sourceRadar = { sourceRadar }
                        destinationRadar = { destinationRadar }
                        handleAddRadarItem={onHandleAddRadarItem}
                        handleRemoveRadarItem={onHandleRemoveRadarItem}/>
                 </div>
            </div>
        );
    }
}

export default AddFromPreviousRadarPage;
