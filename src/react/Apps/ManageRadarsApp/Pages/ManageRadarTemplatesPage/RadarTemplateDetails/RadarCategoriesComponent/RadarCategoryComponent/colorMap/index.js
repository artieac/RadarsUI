import React from 'react';

export const colorMap = (handleDropdownSelection, radarCategoryItem) => {
  return [
    {
      key: 'dropdownItem',
      render: rowData => {
        return <a onClick ={(event) => handleDropdownSelection( rowData.value )}>{ rowData.name }</a>;
      },
    },
  ];
};