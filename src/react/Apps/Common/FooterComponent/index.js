'use strict'
import jQuery from 'jquery';
import React from 'react';
import PropTypes from 'prop-types';

export const FooterComponent = ({ mostRecent } ) => {
    return(
        <div className="section grey leftjustified">
            <div className="footer">
                <div className="w-container">
                    <div className="row">
                        <div className="col-md-4">
                            <h5>About Your Radars</h5>
                            <p>This site is a utility to let you manage and share your Radars.  Both current and historical.</p>
                        </div>
                        <div className="col-md-4">
                            <h5>useful links</h5>
                            <a href="https://alwaysmoveforward.com" className="footer-link" target="_blank" rel="noopener noreferrer" aria-label="Visit AlwaysMoveForward.com">AlwaysMoveForward.com</a>
                            <a href="https://blog.alwaysmoveforward.com" className="footer-link" target="_blank" rel="noopener noreferrer" aria-label="Visit the AlwaysMoveForward Blog">Blog</a>
                            <a href="https://radars.alwaysmoveforward.com" className="footer-link">Your Radars</a>
                        </div>
                        <div className="col-md-4">
                            <h5>social</h5>
                            <div className="footer-link-wrapper w-clearfix">
                                <img src="/images/social-09.svg" width="20" alt="" className="info-icon" role="presentation" />
                                <a href="https://www.linkedin.com/in/arthur--correa" className="footer-link with-icon" target="_blank" rel="noopener noreferrer" aria-label="Arthur Correa on LinkedIn">Linked In</a>
                            </div>
                            <div className="footer-link-wrapper w-clearfix">
                                <img src="/images/social-18.svg" width="20" alt="" className="info-icon" role="presentation" />
                                <a href="https://twitter.com/artieac" className="footer-link with-icon" target="_blank" rel="noopener noreferrer" aria-label="Arthur Correa on Twitter">Twitter</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FooterComponent;