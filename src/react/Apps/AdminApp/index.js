'use strict'
import jQuery from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import userReducer from 'Redux/UserReducer';
import HomePage from './Pages/HomePage'

const adminAppStore = createStore(combineReducers({userReducer}), applyMiddleware(thunk));

class AdminApp extends React.Component{
    constructor(props){
        super(props);
         this.state = {
            userId: jQuery("#userId").val()
        };
    }

    render(){
        return (
            <div>
                <Routes>
                    <Route path="/" component={ <HomePage /> } />
                </Routes>
            </div>
        );
    }
}

ReactDOM.render(
    <Provider store={ adminAppStore }>
        <AdminApp/>
    </Provider>,
    document.getElementById("adminAppContent")
);

module.exports = AdminApp;