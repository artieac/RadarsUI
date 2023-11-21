import React from 'react';
import RadarRingComponent from '../RadarRingComponent'

export const radarRingRowDefinition = ( { editMode } ) => {
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
            }
        ],
        render: rowData => {
            return <RadarRingComponent rowData = { rowData } editMode = { editMode } />
        }
    });
};