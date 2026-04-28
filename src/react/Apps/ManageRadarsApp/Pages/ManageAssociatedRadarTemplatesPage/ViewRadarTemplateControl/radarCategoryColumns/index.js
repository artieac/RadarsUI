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
        return <span className="small fw-bold"> { rowData.name }</span>;
      },
    },
    {
        title: "Icon Color",
        key: "iconColor",
        render: rowData => {
            const colorInfo = colorMapLookup(rowData);
            return (
                <div className="d-flex align-items-center">
                    <div 
                        className="rounded-circle me-2" 
                        style={{ width: '12px', height: '12px', backgroundColor: colorInfo.value, border: '1px solid #ddd' }}
                    ></div>
                    <span className="small text-muted">{ colorInfo.name }</span>
                </div>
            );
        },
    }
  ];
};