import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { connect, useSelector, useDispatch } from "react-redux";
import TableComponent2 from 'SharedComponents/TableComponent2'
import { radarRingRowDefinition } from './radarRingRowDefinition';
import { isValid } from 'Apps/Common/Utilities';
import { addSelectedRadarTemplateToState } from 'Redux/RadarTemplateReducer';

export const RadarRingsComponent = ({ editMode, radarRings, canAdd, canDelete }) => {
    const [isDeleted, setIsDeleted] = useState(false);

    const selectedTemplate = useSelector((state) => state.radarTemplateReducer.selectedRadarTemplate);

    const dispatch = useDispatch();

    const handleDeleteClick = (event, rowData) => {
        if(isValid(radarRings)){
            for(var i = 0; i < radarRings.length; i++){
                if(radarRings[i].id==rowData.id){
                    selectedTemplate.radarRings.splice(i, 1);
                    dispatch(addSelectedRadarTemplateToState(selectedTemplate));
                    setIsDeleted(true);
                    break;
                }
            }
        }
    }

    const handleAddClick = (event) => {
        if(!isValid(selectedTemplate.radarRings)){
            selectedTemplate.radarRings = [];
        }

        let newId = -1;
        if(selectedTemplate.radarRings.length > 0){
            for(let i = 0; i < selectedTemplate.radarRings.length; i++){
                if(selectedTemplate.radarRings[i].id <= newId){
                    newId = selectedTemplate.radarRings[i].id - 1;
                }
            }
        }

        selectedTemplate.radarRings.push({
            id: newId,
            name: "New Ring",
            displayOption: (selectedTemplate.radarRings.length + 1).toString()
        });

        dispatch(addSelectedRadarTemplateToState(selectedTemplate));
        setIsDeleted(!isDeleted);
    }

    return (
        <div className="row">
            <div className="col-md-12">
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <div className="row">
                            <div className="col-md-6 text-start">Rings</div>
                            <div className="col-md-6 text-end">
                                <button className={canAdd ? "btn btn-techradar btn-sm" : "hidden"} onClick={handleAddClick}>Add Ring</button>
                            </div>
                        </div>
                    </div>
                    <TableComponent2 data={ radarRings } rowDefinition={radarRingRowDefinition({ editMode, canDelete, onDeleteClick: handleDeleteClick })} hoverable striped bordered={false} />
                </div>
            </div>
        </div>
    );
};


export default RadarRingsComponent;

