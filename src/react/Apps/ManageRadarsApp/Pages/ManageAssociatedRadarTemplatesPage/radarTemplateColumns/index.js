import React from 'react';
import { Link } from 'react-router-dom';

export const radarTemplateColumns = (currentUser, associatedRadarTemplates, handleViewClick, handleAssociateClick) => {
  const isAssociatedToUser = (rowData) =>{
        var retVal = false;

        if(associatedRadarTemplates.length > 0){
            for(var i = 0; i < associatedRadarTemplates.length; i++){
                if(associatedRadarTemplates[i].id==rowData.id){
                    retVal = true;
                    break;
                }
            }
        }

        return retVal;
    }

  return [
    {
      title: 'Name',
      key: 'name',
      render: rowData => {
        return <span>{rowData.name}</span>;
      },
    },
    {
      title: 'Use This?',
      key: 'useThis',
      render: rowData => {
        return (
            <span className={ currentUser.id == rowData.radarUserId ? 'hidden' : ''}>
                <input type="checkbox" checked={isAssociatedToUser(rowData)} onChange = {(event) => handleAssociateClick(event, rowData) }/>
            </span>
        );
      },
    },
    {
        title: 'Actions',
        key: 'actions',
        render: rowData => {
            return (
                <span>
                    <img src="/images/arrow_right.png" onClick = {(event) => handleViewClick(event, rowData) }/>
                </span>
        );},
    },
  ];
};