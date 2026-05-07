import React from 'react';
import RadarRingComponent from '../RadarRingComponent'

export const radarRingRowDefinition = ( { editMode, canDelete, onDeleteClick } ) => {
  return (
    {
        metadata: [
            {
                title: 'Name',
                key: 'name',
            },
            {
                title: "Sort Order",
                key: "sortOrder",
            },
            {
                title: "Action",
                key: "id",
            }
        ],
        render: rowData => {
            return <RadarRingComponent rowData = { rowData } editMode = { editMode } canDelete={canDelete} onDeleteClick={onDeleteClick}/>
        }
    });
};