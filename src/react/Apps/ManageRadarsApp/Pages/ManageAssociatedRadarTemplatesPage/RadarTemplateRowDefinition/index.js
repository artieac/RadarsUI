import React from 'react';
import DropdownComponent from 'SharedComponents/DropdownComponent'
import RadarTemplateRowComponent from './RadarTemplateRowComponent'

export const RadarTemplateRowDefinition = ( handleViewTemplateClick ) => {
  return (
    {
        metadata: [
            {
              title: 'Name',
              key: 'name',
            },
            {
              title: 'Use This?',
              key: 'useThis',
            },
            {
                title: 'Actions',
                key: 'actions',
            },
        ],
        render: ( rowData, rowAlternating ) => {
            return <RadarTemplateRowComponent rowData = { rowData } handleViewClick = { handleViewTemplateClick } rowAlternating = { rowAlternating }/>
        }
    });
};