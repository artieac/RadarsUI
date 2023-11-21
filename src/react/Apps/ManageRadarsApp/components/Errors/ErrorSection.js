import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from "react-redux";
import ErrorList from './ErrorList';
import WarningList from './WarningList';

export default class ErrorSection extends React.Component{
    constructor(props){
        super(props);
         this.state = {
        };

    }

    componentDidMount(){
    }

    render() {
        return (
            <div className="bodyContent">
                <div className="row">
                    <div className="col-md-12">
                        <WarningList />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <ErrorList errors={this.props.errors}/>
                    </div>
                </div>
            </div>
        );
    }
};
