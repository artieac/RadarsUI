'use strict'
import jQuery from 'jquery'
import React from 'react'
import ReactDOM from 'react-dom'
import { connect, useSelector } from "react-redux"
import LinkActionCardComponent from 'SharedComponents/LinkActionCardComponent'

const HomePage = ( {  }) => {
    const userState = useSelector((state) => state.userReducer);

    const shouldShowTeamManagement = () => {
        if(userState.currentUser!=null && userState.currentUser!='undefined'){
            return userState.currentUser.allowTeamMembersToManageRadars;
        }

        return false;
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="contentPageTitle">
                        <label>Manage your Technology Radar</label>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="card-group">
                    <LinkActionCardComponent
                        title="Manage Your Radar Templates"
                        description = "A Radar Templates defines how you will classify and rate your topics."
                        linkTarget="/manageradars/radarTemplates"
                        buttonText="Radar Templates"/>
                    <LinkActionCardComponent
                        title="Associate Radar Templates"
                        description = "See other\'s Radar Templates and mark them so you can also use them."
                        linkTarget="/manageradars/associatedRadarTemplates"
                        buttonText="AssociatedRadarTemplates"/>
                    <LinkActionCardComponent
                        title="Manage your Radars"
                        description = "Once you have Radar Templates defined go here to create an instance of a Template."
                        linkTarget="/manageradars/radars"
                        buttonText="Your Radars"/>
                </div>
            </div>
            <div className="row">
                <div className="card-group">
                    <div className={ shouldShowTeamManagement()==true ? "col-md-4" : "col-md-4 hidden"}>
                        <LinkActionCardComponent
                            title="Manage your Teams"
                            description = "Create teams to allow others to manage some of your radars."
                            linkTarget="/manageradars/teams"
                            buttonText="Your Teams"/>
                    </div>
                </div>
            </div>
        </div>
    );
}

const mapDispatchToProps = dispatch => {
  return {
    }
}

function mapStateToProps(state) {
  return {
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);