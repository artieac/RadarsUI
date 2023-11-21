import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from "react-redux";
import radarTemplateReducer from  '../../redux/RadarTemplateReducer';

export default class WarningListItem extends React.Component{
    constructor(props){
        super(props);
         this.state = {
        };

    }

    render() {
        if(typeof this.props.warning !== 'undefined'){
            return (
                <div className="row">
                    <div className="col-md-12">{this.props.warning } </div>
                </div>
            );
        }
        else{
            return( <div></div>);
        }
    }
};