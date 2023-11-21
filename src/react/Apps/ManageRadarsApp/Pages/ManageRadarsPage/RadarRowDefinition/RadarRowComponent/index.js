import React, { useState,useEffect } from 'react'
import { connect, useSelector, useDispatch } from "react-redux"
import { Link } from 'react-router-dom'
import { addRadarsToState } from 'Redux/RadarReducer'
import { setCurrentUser } from 'Redux/UserReducer'
import { RadarRepository } from 'Repositories/RadarRepository'
import { isValid } from 'Apps/Common/Utilities'

export const RadarRowComponent = ({ rowData }) => {
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [isPublished, setIsPublished] = useState(false);
    const [isLocked, setIsLocked] = useState(false);

    const loggedInUser = useSelector((state) => state.userReducer.currentUser);

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
           if(isValid(loggedInUser) && (loggedInUser.howManyRadarsCanShare <= loggedInUser.numberOfSharedRadars)){
               if(!confirm('You can only have ' + loggedInUser.numberOfSharedRadars + '.  This will overwrite that selection.  Do you want to proceed?')){
                   shouldProcess = false;
                }
            }
        }

        if(shouldProcess==true){
           setIsPublished(event.target.checked);
           let radarRepository = new RadarRepository();
           radarRepository.publishRadar(loggedInUser.id, rowData.id, event.target.checked,  handleRadarChangeResponse);
        }
    }

    const handleRadarChangeResponse = (wasSuccessful) => {
        if(wasSuccessful==true){
            let radarRepository = new RadarRepository();
            radarRepository.getByUserId(loggedInUser.id, true, handleGetUserRadarResponse);
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
        radarRepository.lockRadar(loggedInUser.id, rowData.id, event.target.checked, handleRadarChangeResponse);
    }

    const handleDeleteClick = (event) => {
        let radarRepository = new RadarRepository();
        radarRepository.deleteRadar(loggedInUser.id, rowData.id, handleRadarChangeResponse);
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
                <span>
                    <img src="/images/action_delete.png" disabled={(rowData.isPublished==true) || (rowData.isLocked==true)} onClick = {(event) =>  handleDeleteClick(event, rowData.id)} alt="Delete radar"/>
                    <Link to={ "/manageradars/user/" + loggedInUser.id + "/radar/" + rowData.id + "/addfromprevious"}>
                        <img src="/images/action_add.PNG" disabled={(rowData.isPublished==true) || (rowData.isLocked==true)}/>
                    </Link>
                    <a href={ "/home/secureradar/" + rowData.id}><img src="/images/arrow_right.png" alt="Go to radar"/></a>
                </span>
            </td>
        </tr>
    );
}

export default RadarRowComponent;