import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { connect, useSelector, useDispatch } from "react-redux";
import TableComponent2 from 'SharedComponents/TableComponent2'
import { radarRingRowDefinition } from './radarRingRowDefinition';
import { isValid } from 'Apps/Common/Utilities';
import { addSelectedRadarTemplateToState } from 'Redux/RadarTemplateReducer';

export const RadarRingsComponent = ({ editMode, radarRings }) => {
    const [isDeleted, setIsDeleted] = useState(false);

    const selectedTemplate = useSelector((state) => state.radarTemplateReducer.selectedRadarTemplate);

    const dispatch = useDispatch();

    const handleDeleteClick = (event, rowData) => {
        if(isValid(radarRings)){
            for(var i = 0; i < radarRings.length; i++){
                if(radarRings[i].id==rowData.id){
                    selectedTemplate.radarRings.splice(i, 1);
                    selectedTemplate(selectedRadarTemplate);
                    setIsDeleted(true);
                    break;
                }
            }
        }
    }

    return (
        <div className="row">
            <div className="col-md-12">
                <div className="panel panel-default">
                    <div className="panel-heading">Rings</div>
                    <TableComponent2 data={ radarRings } rowDefinition={radarRingRowDefinition(editMode)} hoverable striped bordered={false} />
                </div>
            </div>
        </div>
    );
};


export default RadarRingsComponent;

