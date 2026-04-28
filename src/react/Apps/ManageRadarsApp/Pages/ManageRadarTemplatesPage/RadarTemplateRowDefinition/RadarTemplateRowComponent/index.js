import React, { useState,useEffect } from 'react'
import { connect, useSelector, useDispatch } from "react-redux"
import { Link } from 'react-router-dom'
import { isValid } from 'Apps/Common/Utilities'

export const RadarTemplateRowComponent = ({ rowData, handleViewClick, handleDeleteClick }) => {
    return (
        <tr key={ rowData.id } >
            <td>{rowData.name}</td>
            <td>
                <div className="d-flex align-items-center gap-2">
                    <button 
                        className="btn btn-sm btn-outline-techradar border-0 p-1" 
                        onClick={() => handleViewClick(rowData)}
                        title="View Details"
                    >
                        <i className="bi bi-eye-fill fs-5"></i>
                    </button>
                    <button 
                        className="btn btn-sm btn-outline-danger border-0 p-1" 
                        onClick={() => handleDeleteClick(rowData)}
                        title="Delete Template"
                    >
                        <img src="/images/action_delete.png" alt="Delete"/>
                    </button>
                </div>
            </td>
        </tr>
    );
}

export default RadarTemplateRowComponent;