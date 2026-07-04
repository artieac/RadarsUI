import jQuery from 'jquery';
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux"
import { Helmet } from 'react-helmet-async';
import ReactDOM from 'react-dom';
import DivTableComponent2 from 'SharedComponents/DivTableComponent2'
import { RadarSubjectRepository } from 'Repositories/RadarSubjectRepository'
import { subjectAssessmentRowDefinition } from './subjectAssessmentRowDefinition'

export const DetailsPage = () => {
    const [subjectAssessments, setSubjectAssessments] = useState([]);

    let { subjectId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const returnPath = location.state?.returnPath;

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

    const handleBackClick = () => {
        if (returnPath) {
            navigate(returnPath);
        } else {
            navigate(-1); // Default browser back behavior if no state
        }
    }

    return (
        <div className="card">
            {subjectAssessments?.technology && (
                <Helmet>
                    <title>{subjectAssessments.technology.name} - Assessments | Technology Radar</title>
                    <meta name="description" content={`Community and personal assessments for ${subjectAssessments.technology.name}.`} />
                    <script type="application/ld+json">
                        {JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "ItemList",
                            "name": `Assessments for ${subjectAssessments.technology.name}`,
                            "itemListElement": []
                        })}
                    </script>
                </Helmet>
            )}
            <div className="card-header d-flex justify-content-between align-items-center bg-white border-bottom-0 pt-3">
                <button className="btn btn-sm btn-outline-secondary" onClick={handleBackClick}>
                    <i className="bi bi-arrow-left me-1"></i> Back to Radar
                </button>
            </div>
            <div className="card-body">
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
        </div>
    );
}

export default DetailsPage;