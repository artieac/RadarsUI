import React from 'react';
import { colorMapData } from '../../../../components/colorMapData'

export const radarCategoryColumns = () => {
    const colorMapLookup = (colorValue) => {
        if(colorValue !== undefined){
            for(var i = 0; i < colorMapData().length; i++){
                if(colorMapData()[i].value===colorValue.displayOption){
                    return colorMapData()[i];
                }
            }
        }
        return colorMapData()[0];
    };

  return [
    {
      title: 'Name',
      key: 'name',
      render: rowData => {
        return <span> { rowData.name }</span>;
      },
    },
    {
        title: "Icon Color",
        key: "iconColor",
        render: rowData => {
            return <span>{ colorMapLookup(rowData).name } </span>;
        },
    }
  ];
};