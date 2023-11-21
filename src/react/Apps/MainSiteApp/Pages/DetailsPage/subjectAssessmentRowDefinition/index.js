import React from 'react';
import SubjectAssessmentComponent from '../SubjectAssessmentComponent'

export const subjectAssessmentRowDefinition = () => {
  return (
    {
        metadata: [
            {
                title: 'Details',
                key: 'details',
            },
        ],
        render: rowData => {
            return <SubjectAssessmentComponent rowData = { rowData }  />
        }
    });
};