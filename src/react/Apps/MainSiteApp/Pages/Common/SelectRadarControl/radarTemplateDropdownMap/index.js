import React from 'react';
import { Link } from 'react-router-dom';

export const radarTemplateDropdownMap = (handleDropdownSelection) => {
  return [
    {
      key: 'dropdownItem',
      render: (rowData, index) => {
          return <a key = { index } className="dropdown-item" onClick = {(event) => handleDropdownSelection(rowData) } title={ rowData.name }>{ rowData.name }</a>;
      },
    },
  ];
};