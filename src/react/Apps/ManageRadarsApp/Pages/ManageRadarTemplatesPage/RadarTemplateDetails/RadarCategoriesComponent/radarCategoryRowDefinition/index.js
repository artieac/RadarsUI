import React from 'react';
import DropdownComponent from 'SharedComponents/DropdownComponent'
import RadarCategoryComponent from '../RadarCategoryComponent'

export const radarCategoryRowDefinition = ( { editMode } ) => {
  return (
    {
        metadata: [
            {
                title: 'Name',
                key: 'name',
            },
            {
                title: "Icon Color",
                key: "iconColor",
            }
        ],
        render: rowData => {
            return <RadarCategoryComponent rowData = { rowData } editMode = { editMode } />
        }
    });
};