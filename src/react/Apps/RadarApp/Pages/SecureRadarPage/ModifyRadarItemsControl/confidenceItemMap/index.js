import React from 'react';
import { Link } from 'react-router-dom';

export const confidenceOptions = () => {
    return [
       {
            id: 2,
            text: "Not Very Well"
       },
       {
            id: 5,
            text: "As Expected"
       },
       {
            id:7,
            text: "Very Well"
       }
    ]
};

export const confidenceItemMap = (handleSelection) => {
  return [
    {
      key: 'dropdownItem',
      render: (rowData, index) => {
          return <a key = { index } className="dropdown-item" onClick = {(event) => handleSelection(rowData) } title={ rowData.text }>{ rowData.text }</a>;
      },
    },
  ];
};