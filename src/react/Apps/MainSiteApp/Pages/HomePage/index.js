'use strict'
import jQuery from 'jquery';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux"
import { Link, useLocation, useNavigate, useSearchParams  } from 'react-router-dom';
import { isValid } from 'Apps/Common/Utilities'
import ConfigurationSettings from 'Apps/Common/ConfigurationSettings'
import './HomePage.css';

export const HomePage = () => {
    const [searchParams] = useSearchParams();

    const navigate = useNavigate();

    let configurationSettings = new ConfigurationSettings();

    useEffect(() => {
        const userId = searchParams.get('userId');
        const radarTemplateId = searchParams.get('radarTemplateId');
        const radarId = searchParams.get('radarId');
        const fullView = searchParams.get('fullView');
        const mostRecent = searchParams.get('mostRecent');

        if(isValid(userId) && userId > 0){
            if(isValid(radarId) && radarId > 0){
                navigate('/home/user/' + userId + '/radar/' + radarId);
            } else {
                if(isValid(radarTemplateId) && radarTemplateId > 0){
                    if(isValid(fullView) && fullView=="true"){
                        navigate('/home/user/' + userId + '/radartemplate/' + radarTemplateId + '/radars/fullView');
                    } else {
                        if(isValid(mostRecent) && mostRecent=="true"){
                            navigate('/home/user/' + userId + '/radartemplate/' + radarTemplateId + '/radars/mostRecent');
                        } else {
                            navigate('/home/user/' + userId + '/radartemplate/' + radarTemplateId + '/radars');
                        }
                    }
                } else {
                    if(isValid(mostRecent) && mostRecent=="true"){
                        navigate('/home/user/' + userId + '/radar?mostRecent=true');
                    } else {
                        navigate('/home/user/' + userId + '/radars');
                    }
                }
            }
        }
    });

    return (
        <div className="home-page-container">
            <div className="hero-section modern centered">
                <div className="container">
                    <h1 className="hero-heading modern">Your World, Mapped.</h1>
                    <div className="hero-subheading modern">
                        <p>A versatile tool for visualizing your evolving perspectives on everything that matters.</p>
                        <p>Inspired by the <a href="https://www.thoughtworks.com/radar/byor" target="_blank" rel="noopener noreferrer">Thoughtworks Technology Radar</a>, this platform lets you track assessments, opinions, and trends across any domain you can imagine.</p>
                    </div>
                    <div>
                        <a href="/login" className="btn-modern btn-primary-modern">Get Started</a>
                        <a href="https://www.thoughtworks.com/radar/byor" className="btn-modern btn-secondary-modern" target="_blank" rel="noopener noreferrer">Learn the Concept</a>
                    </div>
                </div>
            </div>

            <div className="section-modern">
                <div className="container">
                    <div className="section-title-group">
                        <h2 className="section-heading modern centered">Navigate Change with Confidence</h2>
                        <div className="section-subheading modern center">
                            In a fast-moving world, standing still means falling behind. This platform helps you assess risks, rewards, and trends across any domain. Manage your own radar to map out your strategic landscape and never lose sight of what's next.
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-4">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <img src="images/social-01-white.svg" alt="" />
                                </div>
                                <h3>Track Your Evolution</h3>
                                <p>Your opinions aren't static. Visualize how your interests and assessments shift over time. Use your radar history to visualize your growth and share your journey with others.</p>
                            </div>
                        </div>
                        <div className="col-md-6 mb-4">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <img src="images/social-25-white.svg" alt="" />
                                </div>
                                <h3>Share Your Vision</h3>
                                <p>Keep it private or go public. Share your radars to showcase your expertise, spark conversations, and let the world see how your thinking has evolved.</p>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-4">
                        <div className="col-md-6 mb-4">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <img src="images/feather2-17-white.svg" alt="" />
                                </div>
                                <h3>Collaborative Insights</h3>
                                <p>Learn from the community. See how others are evaluating the same trends and technologies, and gain new perspectives from a diverse group of users.</p>
                            </div>
                        </div>
                        <div className="col-md-6 mb-4">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <img src="images/social-25-white.svg" alt="" />
                                </div>
                                <h3>Unlimited Possibilities</h3>
                                <p>Beyond technology. Apply the radar concept to anything - books, travel, hobbies, or business strategy. If you can categorize it, you can radar it.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="cta-section">
                <div className="container">
                    <h2>Ready to Explore?</h2>
                    <p>Dive into existing insights or start building your own radar today.</p>
                    <div className="text-center">
                        <Link className="btn-modern btn-primary-modern" aria-current="page" to="/home/user/1/radarTemplate/3/radars/fullView">Explore My Public Radar</Link>
                        <a href="/login" className="btn-modern btn-secondary-modern">Sign In to Create Yours</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;