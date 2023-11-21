import React from 'react'
import { connect, useSelector, useDispatch } from "react-redux"
import { RadarTemplateRowComponent } from './RadarTemplateRowComponent'
import { isValid } from 'Apps/Common/Utilities'

export const RadarTemplateRowDefinition = (handleViewClick, handleDeleteClick) => {

    return (
    {
        metadata: [
            {
                title: 'Name',
                key: 'name',
            },
            {
                title: 'Actions',
                key: 'actions',
            },

        ],
        render: rowData => {
            return <RadarTemplateRowComponent rowData = { rowData } handleViewClick = { handleViewClick } handleDeleteClick = { handleDeleteClick } />
        }
    });
};

export default RadarTemplateRowDefinition;