import React from 'react';
import { Link } from 'react-router-dom';

export const radarDropdownMap = (handleDropdownSelection) => {
  const getDisplayName = (rowData) => {
    return rowData.name + " - " + rowData.formattedAssessmentDate;
  }

  return [
    {
      key: 'dropdownItem',
      render: (rowData, index) => {
          return <a key = { index } className="dropdown-item" onClick = {(event) => handleDropdownSelection(rowData) } title={ getDisplayName(rowData) }>{ getDisplayName(rowData) }</a>;
      },
    }
  ];
};