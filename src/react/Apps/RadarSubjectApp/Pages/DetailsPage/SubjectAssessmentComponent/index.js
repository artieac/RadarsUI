import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { connect, useSelector, useDispatch } from "react-redux";
import { isValid } from 'Apps/Common/Utilities';
import Moment from 'moment'

export const SubjectAssessmentComponent = ({ rowData }) => {
    const loggedInUser = useSelector((state) => state.userReducer.currentUser);

    const dispatch = useDispatch();

    const formatDate = (dateValue) => {
        return Moment(dateValue).format('MM/DD/yyyy');
    }

    return (
        <div>
            <div className="row">
                { isValid(loggedInUser) && loggedInUser.id==rowData.assessmentUser.id ?
                    <h4>
                        <a href={ "/home/secureradar/" + rowData.assessmentId }>{ rowData.assessmentName}</a> - { formatDate(rowData.assessmentDate) }
                    </h4>
                    :
                    <h4>
                        <a href={ "/public/home/user/" + rowData.assessmentUser.id + "/radar/" + rowData.assessmentId }>{ rowData.assessmentName}</a> - { formatDate(rowData.assessmentDate) }
                    </h4>
                }
            </div>
            <div className="row">
                <h4>Category: { rowData.assessmentCategory.name}</h4>
            </div>
            <div className="row">
                <h4>Ring: { rowData.assessmentRing.name}</h4>
            </div>
            <div className="row">
                <div className="col-lg-9">
                    <p>{rowData.assessmentDetails}</p>
                </div>
            </div>
        </div>
    );
}

export default SubjectAssessmentComponent;