'use strict'
import jQuery from 'jquery';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import NavBarComponent from 'Components/NavbarComponent'
import { navBarElements } from './navBarElements';
import PageRouter from '../PageRouter'

class HeaderComponent extends React.Component{
    constructor(props){
        super(props);
         this.state = {
            currentPageParameter: jQuery("#currentPage").val()
        };
    }

    render() {
        const { currentPage, currentUser } = this.props;
        const { currentPageParameter } = this.state;

        return (
            <div>
                <NavBarComponent title="Technology Radar" navBarElements={ navBarElements() } currentPage= { currentPage } currentUser = { currentUser } />
            </div>
        );
    }
}

HeaderComponent.propTypes = {
    currentPage: PropTypes.string,
}

function mapStateToProps(state) {
  return {
        currentUser: state.userReducer.currentUser,
    };
}

export default connect(mapStateToProps, null)(HeaderComponent);