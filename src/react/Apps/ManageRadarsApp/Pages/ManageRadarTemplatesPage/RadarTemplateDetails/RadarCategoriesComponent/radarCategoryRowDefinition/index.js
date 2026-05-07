import React from 'react';
import DropdownComponent from 'SharedComponents/DropdownComponent'
import RadarCategoryComponent from '../RadarCategoryComponent'

export const radarCategoryRowDefinition = ({ editMode, canDelete, onDeleteClick }) => {
    return (
        {
            metadata: [
                {
                    title: 'Name',
                    key: 'name',
                },
                {
                    title: "Color",
                    key: "color",
                },
                {
                    title: "Action",
                    key: "id",
                }
            ],
            render: rowData => {
                return <RadarCategoryComponent rowData={rowData} editMode={editMode} canDelete={canDelete} onDeleteClick={onDeleteClick}/>
            }
        });
};