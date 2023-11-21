import React from 'react';

export const radarRingColumns = () => {
  return [
    {
      title: 'Name',
      key: 'name',
      render: rowData => {
        return <span> { rowData.name }</span>;
      },
    },
    {
        title: "Sort Order",
        key: "sortOrder",
        render: rowData => {
            return <span>{ rowData.displayOption } </span>;
        },
    }
  ];
};