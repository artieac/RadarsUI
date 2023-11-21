import jQuery from 'jquery';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux"
import ReactDOM from 'react-dom';
import DivTableComponent2 from 'SharedComponents/DivTableComponent2'
import { RadarSubjectRepository } from 'Repositories/RadarSubjectRepository'
import { subjectAssessmentRowDefinition } from './subjectAssessmentRowDefinition'

export const DetailsPage = () => {
    const [subjectAssessments, setSubjectAssessments] = useState([]);

    let { subjectId } = useParams();

    const loggedInUser = useSelector((state) => state.userReducer.currentUser);

    const dispatch = useDispatch();

     useEffect(() => {
        let radarSubjectRepository = new RadarSubjectRepository();
        radarSubjectRepository.getRadarSubjectAssessments(subjectId, getRadarSubjectAssessmentsResponse);
    }, []);

    const getRadarSubjectAssessmentsResponse = (wasSuccessful, data) => {
        if(wasSuccessful){
            setSubjectAssessments(data);
        }
    }

    return (
        <div className="card">
            <div className="row">
                <div className="col-lg-6">
                    <div className="card panel-techradar">
                        <div className="card-title panel-heading-techradar">Your Assessments</div>
                        <div className="card-body">
                            <DivTableComponent2 data = { subjectAssessments.userItems } rowDefinition = { subjectAssessmentRowDefinition() }/>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="card panel-techradar">
                        <div className="card-title panel-heading-techradar">Other's Assessments</div>
                        <div className="card-body">
                            <DivTableComponent2 data = { subjectAssessments.otherUsersItems } rowDefinition = { subjectAssessmentRowDefinition() }/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetailsPage;