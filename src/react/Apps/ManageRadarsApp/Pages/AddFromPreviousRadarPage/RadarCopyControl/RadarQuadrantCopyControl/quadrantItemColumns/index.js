import React from 'react';
import { Link } from 'react-router-dom';

export const quadrantItemColumns = (handleCheckboxClickEvent) => {
  return [
    {
      title: '',
      key: 'inRadar',
      render: rowData => {
        return <span><input type="checkbox" onChange= {(event) => handleCheckboxClickEvent(event, rowData.assessmentItem) }/></span>;
      },
    },
    {
      title: 'Radar Ring',
      key: 'radarRingName',
      render: rowData => {
        return <span>{ rowData.assessmentItem.radarRing.name }</span>;
      },
    },
    {
      title: 'Name',
      key: 'name',
      render: rowData => {
        return <span>{ rowData.name}</span>;
      },
    },
  ];
};