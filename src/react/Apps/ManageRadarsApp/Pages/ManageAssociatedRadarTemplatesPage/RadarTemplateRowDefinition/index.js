'use strict'
import React from 'react';
import RadarTemplateRowComponent from './RadarTemplateRowComponent'

export const RadarTemplateRowDefinition = ( handleViewTemplateClick, isMyShared ) => {
  const metadata = [
    {
      title: 'Template Name',
      key: 'name',
    }
  ];

  if (!isMyShared) {
    metadata.push({
      title: 'Use This',
      key: 'useThis',
    });
  }

  metadata.push({
    title: 'Actions',
    key: 'actions',
  });

  return (
    {
        metadata: metadata,
        render: ( rowData, rowAlternating ) => {
            return <RadarTemplateRowComponent rowData = { rowData } handleViewClick = { handleViewTemplateClick } rowAlternating = { rowAlternating } isMyShared = { isMyShared }/>
        }
    });
};