'use strict'
/// <reference path="../ChartSummaryTable/ChartSummaryRow.js" />
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from "react-redux";
import RadarQuadrantCopyControl from './RadarQuadrantCopyControl';

export default class RadarCopyControl extends React.Component{
    constructor(props){
        super(props);
         this.state = {
        };
    }

    getSourceQuadrant(index) {
        const { sourceRadar } = this.props;

        if(sourceRadar!==undefined && sourceRadar.quadrants!==undefined){
            return sourceRadar.quadrants[index];
        }

        return {};
    }

    render(){
        const { sourceRadar, destinationRadar } = this.props;
        if(destinationRadar!==undefined){
            return(
                <div className="row">
                    { destinationRadar.quadrants.map(function (currentRow, index) {
                        return <RadarQuadrantCopyControl
                                    key={ index }
                                    destinationQuadrant = { currentRow }
                                    sourceQuadrant = { this.getSourceQuadrant(index) }
                                    handleAddRadarItem={this.props.handleAddRadarItem}
                                    handleRemoveRadarItem={this.props.handleRemoveRadarItem}/>
                    }.bind(this))}
                </div>
            );
        } else {
            return (
                <div className="row">
                </div>
            );
        }
    }
}