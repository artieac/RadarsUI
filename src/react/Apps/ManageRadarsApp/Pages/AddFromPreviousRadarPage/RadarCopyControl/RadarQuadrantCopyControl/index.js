'use strict'
/// <reference path="../ChartSummaryTable/ChartSummaryRow.js" />
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from "react-redux";
import TableComponent from "SharedComponents/TableComponent";
import { quadrantItemColumns } from "./quadrantItemColumns";

export default class RadarQuadrantCopyControl extends React.Component{
    constructor(props){
        super(props);
         this.state = {
        };

        this.handleCheckboxClick = this.handleCheckboxClick.bind(this);
    }

    handleCheckboxClick(event){

    }

    getSourceQuadrantItems(sourceQuadrant) {
        if( sourceQuadrant !== undefined  && sourceQuadrant.items !== undefined){
            return sourceQuadrant.items;
        }

        return new Array();
    }

    render(){
        const { sourceQuadrant, destinationQuadrant } = this.props;

        return(
            <div className="row">
                <div className="col-lg-12">
                    <div className="row">
                        <div className="col-lg-6">
                            <h3>{ destinationQuadrant.quadrant }</h3>
                        </div>
                        <div className="col-lg-6">
                            <h3>{ destinationQuadrant.quadrant }</h3>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-6">
                            <TableComponent
                                hideHeader={true}
                                bordered={false}
                                striped={true}
                                data = { this.getSourceQuadrantItems(sourceQuadrant) }
                                cols= { quadrantItemColumns(this.props.handleAddRadarItem) } />
                        </div>
                        <div className="col-lg-6">
                            <TableComponent
                                hideHeader={true}
                                bordered={false}
                                striped={true}
                                data = { destinationQuadrant.items }
                                cols= { quadrantItemColumns(this.props.handleRemoveRadarItem) } />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}