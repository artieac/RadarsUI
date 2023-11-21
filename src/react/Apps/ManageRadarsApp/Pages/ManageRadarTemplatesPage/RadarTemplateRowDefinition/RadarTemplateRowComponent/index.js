import React, { useState,useEffect } from 'react'
import { connect, useSelector, useDispatch } from "react-redux"
import { Link } from 'react-router-dom'
import { isValid } from 'Apps/Common/Utilities'

export const RadarTemplateRowComponent = ({ rowData, handleViewClick, handleDeleteClick }) => {

    const loggedInUser = useSelector((state) => state.userReducer.currentUser);

    return (
        <tr key={ rowData.id } >
            <td>{rowData.name}</td>
            <td>
                <span>
                    <img src="/images/arrow_right.png" onClick = {(event) => handleViewClick(rowData) }/>
                    <img src="/images/action_delete.png" onClick = {(event) => handleDeleteClick(rowData) }/>
                </span>
            </td>
        </tr>
    );
}

export default RadarTemplateRowComponent;