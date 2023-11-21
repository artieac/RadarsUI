import React from 'react';
import ReactDOM, { useEffect } from 'react-dom';
import { connect } from "react-redux";
import { addRadarTemplatesToState } from 'Redux/RadarTemplateReducer';
import { RadarTemplateRepository } from 'Repositories/RadarTemplateRepository';
import { colorMapData } from '../../../components/colorMapData';
import TableComponent from 'SharedComponents/TableComponent';
import { radarCategoryColumns } from './radarCategoryColumns';
import { radarRingColumns } from './radarRingColumns';
import { isValid } from 'Apps/Common/Utilities'

export const ViewRadarTemplateControl = ({ selectedTemplate }) => {
    return (
        <div className="row">
            <div className="col-md-12">
                <div className='row'>
                    <div className="col-md-3">Name</div>
                    <div className="col-md-4">{selectedTemplate.name }</div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="panel panel-default">
                            <div className="panel-heading">Rings</div>
                            <div className="panel-body">
                                <TableComponent data={selectedTemplate.radarRings} cols={ radarRingColumns() }/>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="panel panel-default">
                            <div className="panel-heading">Categories</div>
                            <div className="panel-body">
                                <TableComponent data = { selectedTemplate.radarCategories } cols= { radarCategoryColumns() }/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewRadarTemplateControl;

