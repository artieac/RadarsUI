'use strict'
import jQuery from 'jquery';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux"
import ReactDOM from 'react-dom';
import { Link, useLocation, useNavigate, useSearchParams  } from 'react-router-dom';
import { isValid } from 'Apps/Common/Utilities'

export const HomePage = () => {
    const [searchParams] = useSearchParams();

    const navigate = useNavigate();

    useEffect(() => {
        const userId = searchParams.get('userId');
        const radarTemplateId = searchParams.get('radarTemplateId');
        const radarId = searchParams.get('radarId');
        const fullView = searchParams.get('fullView');
        const mostRecent = searchParams.get('mostRecent');

        if(isValid(userId) && userId > 0){
            if(isValid(radarId) && radarId > 0){
                navigate('/public/home/user/' + userId + '/radar/' + radarId);
            } else {
                if(isValid(radarTemplateId) && radarTemplateId > 0){
                    if(isValid(fullView) && fullView=="true"){
                        navigate('/public/home/user/' + userId + '/radartemplate/' + radarTemplateId + '/radars/fullView');
                    } else {
                        if(isValid(mostRecent) && mostRecent=="true"){
                            navigate('/public/home/user/' + userId + '/radartemplate/' + radarTemplateId + '/radars/mostRecent');
                        } else {
                            navigate('/public/home/user/' + userId + '/radartemplate/' + radarTemplateId + '/radars');
                        }
                    }
                } else {
                    if(isValid(mostRecent) && mostRecent=="true"){
                        navigate('/public/home/user/' + userId + '/radar?mostRecent=true');
                    } else {
                        navigate('/public/home/user/' + userId + '/radars');
                    }
                }
            }
        }
    });

    return (
        <div>
            <div className="hero-section centered">
                <div data-ix="new-interaction" className="container">
                    <h1 data-ix="fade-in-bottom-page-loads" className="hero-heading">This is Your Radar</h1>
                    <div data-ix="fade-in-bottom-page-loads" className="hero-subheading">
                        <p>A free tool for tracking how much you like or dislike different things.</p>
                        <p>This site got it's start from <a href="https://www.thoughtworks.com/radar/byor">Thoughtworks Technology Radar</a> and I used it to track my technology assessments and usage.  However the more I used it the more I got ideas for other things I could categorize with this same concept.</p>
                    </div>
                    <div data-ix="fade-in-bottom-page-loads"><a href="/login" className="button">sign up</a><a href="https://www.thoughtworks.com/radar/byor" className="button all-caps" target="_blank">Learn more</a></div>
                </div>
            </div>
            <div className="section">
                <div className="container">
                    <div className="section-title-group">
                        <h2 className="section-heading centered">Why Is This Important?</h2>
                        <div className="section-subheading center">If you don&#x27;t pay attention to changing technology you can quickly find yourself falling behind the industry. We all need to pay attention to changes and continuously evaluate those shifts to see if industry changes help or hurt us. <a href="https://www.thoughtworks.com">Thoughtworks</a> came up with a great concept, the Technology Radar to help keep track of this.  A technology radar lets you keep track of your assessments of the risks and rewards of various areas of technology, and by joining this site you can manage your own technology radar.</div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="white-box">
                                <img src="images/social-01-white.svg" alt="" className="grid-image"/>
                                <h3>Have Multiple Versions</h3>
                                <p>Your opinion of things can and should change over time. Keep track
                                    of how your interests and opinions change over time. Your radar
                                    history lets you and others see how your opinion has changed.
                                </p>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="white-box">
                                <img src="images/social-25-white.svg" width="210" alt="" className="grid-image"/>
                                <h3>Share your radars</h3>
                                <p>Your radar can be kept private or published to be visible to
                                    anyone on the internet.  Sharing it lets others see what you're
                                    interested in, and how your opinions and how they have evolved.
                                </p>
                            </div>
                        </div>
                    </div>
                    <br/>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="white-box">
                                <img src="images/feather2-17-white.svg" alt="" className="grid-image"/>
                                <h3>See what others think</h3>
                                <p>As other people enter in their own evaluations of things you&#x27;ll be able to see what they have learned about the same things you are you are interested in.</p>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="white-box">
                                <img src="images/social-25-white.svg" width="210" alt="" className="grid-image"/>
                                <h3>Create and share radar types</h3>
                                <p>This radar concept can be applied to other things also.  Use your imagination and create your own radars to share your opinions.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="section">
                <div className="container">
                    <div className="section-title-group">
                        <h2 className="section-heading centered">Curious?</h2>
                        <div className="section-subheading center">Please check out my current Public Radars. or Sign in and Try creating your own</div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <Link className="button" aria-current="page" to="/public/home/user/1/radarTemplate/3/radars/fullView" >My Public Radar</Link>
                        </div>
                        <div className="col-md-6"><a href="/login" className="button">Sign in</a></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;