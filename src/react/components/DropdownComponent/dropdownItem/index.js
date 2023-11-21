'use strict'
import React from 'react';

export const dropdownItem = (handleDropdownSelection, titleField, nameField) => {
  return [
    {
      key: 'dropdownItem',
      render: (rowData, index) => {
        return <a key = { index } className="dropdown-item" onClick = {() => handleDropdownSelection(rowData) } title={ rowData[titleField] }>{ rowData[nameField] }</a>;
      },
    },
  ];
};