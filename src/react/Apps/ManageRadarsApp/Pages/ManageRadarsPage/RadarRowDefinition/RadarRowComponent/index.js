import React, { useState,useEffect } from 'react'
import { connect, useSelector, useDispatch } from "react-redux"
import { Link } from 'react-router-dom'
import { addRadarsToState } from 'Redux/RadarReducer'
import { setCurrentUser } from 'Redux/UserReducer'
import { RadarRepository } from 'Repositories/RadarRepository'
import { isValid } from 'Apps/Common/Utilities'
import ConfigurationSettings from 'Apps/Common/ConfigurationSettings'

export const RadarRowComponent = ({ rowData }) => {
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [isPublished, setIsPublished] = useState(false);
    const [isLocked, setIsLocked] = useState(false);

    const authenticatedUser = useSelector((state) => state.userReducer.currentUser);

    const dispatch = useDispatch();

    useEffect(() => {
        if(isInitialLoad==true){
            setIsPublished(rowData.isPublished);
            setIsLocked(rowData.isLocked);
        }

        setIsInitialLoad(false);
    }, []);

    const handleIsPublishedClick = (event) => {
       var shouldProcess = true;

       if(event.target.checked == true){
           if(isValid(authenticatedUser) && (authenticatedUser.howManyRadarsCanShare <= authenticatedUser.numberOfSharedRadars)){
               if(!confirm('You can only have ' + authenticatedUser.numberOfSharedRadars + '.  This will overwrite that selection.  Do you want to proceed?')){
                   shouldProcess = false;
                }
            }
        }

        if(shouldProcess==true){
           setIsPublished(event.target.checked);
           let radarRepository = new RadarRepository();
           radarRepository.publishRadar(authenticatedUser.id, rowData.id, event.target.checked,  handleRadarChangeResponse);
        }
    }

    const handleRadarChangeResponse = (wasSuccessful) => {
        if(wasSuccessful==true){
            let radarRepository = new RadarRepository();
            radarRepository.getByUserId(authenticatedUser.id, true, handleGetUserRadarResponse);
        }
    }

    const handleGetUserRadarResponse = (wasSuccessful, data) => {
        if(wasSuccessful==true){
           dispatch(addRadarsToState(data));
        }
    }

    const handleIsLockedClick = (event) => {
        setIsLocked(event.target.checked);
        let radarRepository = new RadarRepository();
        radarRepository.lockRadar(authenticatedUser.id, rowData.id, event.target.checked, handleRadarChangeResponse);
    }

    const handleDeleteClick = (event) => {
        let radarRepository = new RadarRepository();
        radarRepository.deleteRadar(authenticatedUser.id, rowData.id, handleRadarChangeResponse);
    }

    const getRadarViewLink = (authenticatedUser, rowData) => {
        let configurationSettings = new ConfigurationSettings();
        return configurationSettings.getMainSiteUrlRoot() + "?userId=" + authenticatedUser.id + "&radarId=" + rowData.id;
    }

    const renderActions = (rowData) => {
        if(!rowData.isLocked){
            return(
                <span>
                    <img src="/images/action_delete.png" disabled={(rowData.isPublished==true) || (rowData.isLocked==true)} visible={ rowData.isLocked==true } onClick = {(event) =>  handleDeleteClick(event, rowData.id)} alt="Delete radar"/>
                    <a href={ getRadarViewLink(authenticatedUser, rowData)}><img src="/images/pencil-square.svg" alt="Edit Radar"/></a>
                    <Link to={ "/radars/user/" + authenticatedUser.id + "/radar/" + rowData.id + "/addfromprevious"}>
                        <button className="btn btn-techradar">Add From Previous</button>
                    </Link>
                </span>
            );
        } else {
            return (
                <span>
                    <a href={ getRadarViewLink(authenticatedUser, rowData)}><img src="/images/eye.svg" alt="View Radar"/></a>
                </span>
            );
        }
    }

    return (
        <tr key={ rowData.id } >
            <td>{rowData.name}</td>
            <td>{rowData.formattedAssessmentDate}</td>
            <td>{rowData.radarTemplate.name}</td>
            <td>
                <input id={ "publishedCheckbox" + rowData.id } type="checkbox" checked={ isPublished } onChange = { handleIsPublishedClick }/>
            </td>
            <td>
                <input id={ "lockedCheckbox" + rowData.id } type="checkbox" checked={ isLocked } onChange = { handleIsLockedClick }/>
            </td>
            <td>
                { renderActions(rowData) }
            </td>
        </tr>
    );
}

export default RadarRowComponent;