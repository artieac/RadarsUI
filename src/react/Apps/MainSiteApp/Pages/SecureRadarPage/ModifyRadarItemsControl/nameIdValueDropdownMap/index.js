import React from 'react';
import { Link } from 'react-router-dom';

export const nameIdValueDropdownMap = (handleSelection) => {
    return [
      {
        key: 'dropdownItem',
        render: (rowData, index) => {
            return <a key = { index } className="dropdown-item" onClick = {(event) => handleSelection(rowData) } title={ rowData.name }>{ rowData.name }</a>;
        },
      },
    ];
};