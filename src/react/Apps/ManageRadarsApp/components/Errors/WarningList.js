import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from "react-redux";

import WarningListItem from './ErrorListItem';

class WarningList extends React.Component{
    constructor(props){
        super(props);
         this.state = {

        };
    }

    render() {
        if(this.props.warnings !== undefined && this.props.warnings.length > 0){
            return (
                <div>
                    <div className="contentPageTitle">
                        <label>Warnings</label>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                        {
                            this.props.warnings.map((currentRow, index) => {
                                return <WarningListItem key={index} warning={currentRow}  />
                            })
                        }
                        </div>
                    </div>
                </div>
            );
        }
        else{
            return (<div className="hidden"></div>);
        }
    }
};

function mapStateToProps(state) {
  return {
        warnings: state.errorReducer.warnings
    };
};

const mapDispatchToProps = dispatch => {
  return {
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(WarningList);