'use strict'
import jQuery from 'jquery';
import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux"
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

export const AboutPage = () => {
    return (
        <div className="container">
            <h1 className="heroTitle">
                About
            </h1>
            <div className="copy">
                <p>
                    This site started from an interest in the technology radar as originally described by <a href="http://nealford.com/memeagora/2013/05/28/build_your_own_technology_radar.html">Neal Ford's original post</a>.
                    However, I realized that a static, one-time view from a Google Sheet didn't tell enough of the story.
                    I really wanted to see the history of changes over time.
                </p>
                <p>
                    Often tech goes through a cycle where it's not good, potentially grows to something you should be using, and all too often again becomes something you shouldn't use because something better came along.
                    A classic example is <strong>EJB (Enterprise JavaBeans)</strong>; once a dominant standard, it was eventually replaced by easier to use systems like SpringBoot as the industry evolved.  Another example is postback style web architectures.  Years ago they were the standard, now SPA is the norm.  Software is always changing.
                </p>
                <p>
                    Once I had this going, I realized that you could use this type of format to keep track of a lot of things.
                    You didn't have to be limited to just one set of rings or quadrants; you could have N rings or Y quadrants, tailored to how you thought of the world in whatever context you wanted.
                </p>
                <p>
                    I took that and ran with it to make this overall radars tool. For example, I built some Disney radars to show how I feel about Disney.
                    Come to think of it, I just had an idea for a yearly ranking of NHL teams...
                </p>
                <p>
                    The code for this is open sourced and can be found at <a href="https://github.com/artieac/RadarsUI">GitHub</a> if you're interested in checking it out.
                </p>
            </div>
        </div>
    );
}

export default AboutPage;