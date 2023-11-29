import React from 'react'
import { connect, useSelector, useDispatch } from "react-redux"
import { RadarRowComponent } from './RadarRowComponent'
import { InsertRadarRowComponent } from './InsertRadarRowComponent'
import { isValid } from 'Apps/Common/Utilities'
import './component.css';

export const RadarRowDefinition = (authenticatedUser) => {

    return (
    {
        metadata: [
            {
                title: 'Name',
                key: 'name',
            },
            {
                title: 'Date',
                key: 'date',
            },
            {
                title: 'Type',
                key: 'type',
            },
            {
                title: 'Published?',
                key: 'published',
            },
            {
                title: 'Locked?',
                key: 'locked',
            },
            {
                title: 'Actions',
                key: 'actions',
            },

        ],
        renderInsert(){
            return <InsertRadarRowComponent />;
        },
        render: rowData => {
            return <RadarRowComponent rowData = { rowData }  />
        }
    });
};
