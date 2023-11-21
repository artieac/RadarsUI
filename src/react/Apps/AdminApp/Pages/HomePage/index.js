'use strict'
import jQuery from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';

export const HomePage = ( {  }) => {
    return (
        <div>
            <div className="row">
                <div className="col-md-12">
                    <div className="contentPageTitle">
                        <label>Administration Tool</label>
                    </div>
                </div>
            </div>
             <div className="row">
                <div className="col-md-4">
                    <div className="panel panel-techradar adminMenuPanel">
                        <div className="panel-heading-techradar">Manage Your radartemplates</div>
                        <div id="ManageRadarTemplatesPanel" className="panel-body">
                            <p>Manage the users of this application</p>
                            <br/>
                            <Link to='/admin/manageusers'>
                                <button className="btn btn-techradar">Manage Users</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;