import React from 'react';
import PropTypes from 'prop-types'
import "./component.css"
import { Link } from 'react-router-dom';

const LinkActionCardComponent = ({ title, description, linkTarget, buttonText}) => {
    return (
        <div className="card card-admin text-center" style={{width: "18rem"}}>
            <div className="card-body">
                <h5 className="card-title">{ title }</h5>
                <p className="card-text">{ description }</p>
            </div>
            <div className="card-footer">
                <Link to={ linkTarget }>
                    <button className="btn btn-techradar">{ buttonText }</button>
                </Link>
            </div>
        </div>
    );
}

export default LinkActionCardComponent;