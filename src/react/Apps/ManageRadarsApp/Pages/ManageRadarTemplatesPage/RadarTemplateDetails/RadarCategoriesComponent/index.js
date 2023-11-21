import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { connect, useDispatch, useSelector } from "react-redux";
import TableComponent2 from 'SharedComponents/TableComponent2'
import { radarCategoryRowDefinition } from './radarCategoryRowDefinition'
import { isValid } from 'Apps/Common/Utilities'
import { addSelectedRadarTemplateToState } from 'Redux/RadarTemplateReducer'

export const RadarCategoriesComponent = ({ editMode }) => {
    const [reRender, setReRender] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const [selectedColor, setSelectedColor] = useState(null);

    const dispatch = useDispatch();

    const selectedTemplate = useSelector((state) => state.radarTemplateReducer.selectedRadarTemplate);

    return (
        <div className="row">
            <div className="col-md-12">
                <div className="panel panel-default">
                    <div className="panel-heading">Categories</div>
                    <TableComponent2 data={ selectedTemplate.radarCategories } rowDefinition={radarCategoryRowDefinition(editMode ) } hoverable striped={false} bordered={false} />
                </div>
            </div>
        </div>
    );
};

export default RadarCategoriesComponent;
