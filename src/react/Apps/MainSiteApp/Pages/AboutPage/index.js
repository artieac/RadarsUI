'use strict'
import jQuery from 'jquery';
import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux"
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

export const AboutPage = () => {
    return (
        <div className="container">
            <div className="heroTitle">
                About
            </div>
            <div className="copy">
               <p>
                    This site started off from <a href="http://nealford.com/memeagora/2013/05/28/build_your_own_technology_radar.html">Neil Ford's original post</a> about building your own technology radar.  I liked the idea, but
                    I thought that working directly with the Json data was a pain.  I also didn't like there there wasn't any historical data to work with to see how things changed over time.</p>
                <p>
                    So I decided to take what he had started and back it with a data store for historical searching (much like Thoughtworks has on their site).
                </p>
                <p>
                    The code for this is open sourced and can be found at <a href="https://github.com/artieac/technologyradar">GitHub</a> if you're interested in checking it out.
                </p>
            </div>
        </div>
    );
}

export default AboutPage;