import React from 'react';
import TableComponent from 'SharedComponents/TableComponent';
import { radarCategoryColumns } from './radarCategoryColumns';
import { radarRingColumns } from './radarRingColumns';
import { isValid } from 'Apps/Common/Utilities'

export const ViewRadarTemplateControl = ({ selectedTemplate }) => {
    return (
        <div className="row g-3">
            <div className="col-md-12">
                <div className="mb-4">
                    <label className="form-label fw-bold small text-uppercase text-muted border-bottom w-100 pb-1">Template Rings</label>
                    <div className="border rounded bg-white shadow-sm overflow-hidden">
                        <TableComponent 
                            data={selectedTemplate.radarRings} 
                            cols={ radarRingColumns() }
                            striped={true}
                            bordered={false}
                            hoverable={true}
                        />
                    </div>
                </div>
                <div>
                    <label className="form-label fw-bold small text-uppercase text-muted border-bottom w-100 pb-1">Template Categories</label>
                    <div className="border rounded bg-white shadow-sm overflow-hidden">
                        <TableComponent 
                            data = { selectedTemplate.radarCategories } 
                            cols= { radarCategoryColumns() }
                            striped={true}
                            bordered={false}
                            hoverable={true}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewRadarTemplateControl;