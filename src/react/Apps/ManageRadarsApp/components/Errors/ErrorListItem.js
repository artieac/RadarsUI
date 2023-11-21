import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from "react-redux";

export default class ErrorListItem extends React.Component{
    constructor(props){
        super(props);
         this.state = {
        };

    }

    render() {
        if(typeof this.props.error !== 'undefined'){
            return (
                <div className="row">
                    <div className="col-md-12">{this.props.error } </div>
                </div>
            );
        }
        else{
            return( <div></div>);
        }
    }
};