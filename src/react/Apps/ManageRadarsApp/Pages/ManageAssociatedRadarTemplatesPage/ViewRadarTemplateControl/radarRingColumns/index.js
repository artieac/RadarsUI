import React from 'react';

export const radarRingColumns = () => {
  return [
    {
      title: 'Name',
      key: 'name',
      render: rowData => {
        return <span className="small fw-bold"> { rowData.name }</span>;
      },
    },
    {
        title: "Sort Order",
        key: "sortOrder",
        render: rowData => {
            return <span className="small text-muted">{ rowData.displayOption } </span>;
        },
    }
  ];
};