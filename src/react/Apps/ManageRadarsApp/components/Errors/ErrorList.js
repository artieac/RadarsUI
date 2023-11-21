import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from "react-redux";
import ErrorListItem from './ErrorListItem';
import errorReducer from '../../redux/ErrorReducer';

class ErrorList extends React.Component{
    constructor(props){
        super(props);
         this.state = {

        };
    }

    render() {
        if(this.props.errors !== undefined && this.props.errors.length > 0){
            return (
                <div>
                    <div className="contentPageTitle">
                        <label>Errors</label>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                        {
                            this.props.errors.map((currentRow, index) => {
                                return <ErrorListItem key={index} error={currentRow}  />
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

const mapDispatchToProps = dispatch => {
  return {
    }
};


function mapStateToProps(state) {
  return {
    	errors: state.errorReducer.errors
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ErrorList);