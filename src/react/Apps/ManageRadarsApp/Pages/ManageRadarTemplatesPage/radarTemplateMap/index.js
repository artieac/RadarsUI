import React from 'react';
import { Link } from 'react-router-dom';

export const radarTemplateMap = (handleViewClick, handleDeleteClick) => {
  return [
    {
      title: 'Name',
      key: 'name',
      render: rowData => {
        return <span>{rowData.name}</span>;
      },
    },
    {
        title: 'Actions',
        key: 'actions',
        render: rowData => {
            return (
                <span>
                    <img src="/images/arrow_right.png" onClick = {(event) => handleViewClick(event, rowData) }/>
                    <img src="/images/action_delete.png" onClick = {(event) => handleDeleteClick(event, rowData) }/>
                </span>
        );},
    },
  ];
};