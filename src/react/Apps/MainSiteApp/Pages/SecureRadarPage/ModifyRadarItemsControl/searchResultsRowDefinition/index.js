import React from 'react';
import { Link } from 'react-router-dom';

export const searchResultsRowDefinition = (handleSelection) => {
    return (
      {
        key: 'dropdownItem',
        render: rowData => {
            return (
                <li key = { rowData.id } className="list-group-item" onClick = { (event) => handleSelection(rowData) }>{rowData.name}</li>
            )
        }
      }
    );
};