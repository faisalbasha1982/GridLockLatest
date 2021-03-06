import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';

import { getTodo } from '../../actions/todolist';
import { getCurrentProfile } from '../../actions/profile';
import { DashboardActions } from './DashboardActions';
import TodolistDashboardComponent from './TodolistDashboardComponent';

const Dashboard = ({ getCurrentProfile, auth: { user }, profile: { profile, loading } }) => {
    
    useEffect(() => {   getCurrentProfile(); },[]);

    return loading && profile === null ? <Spinner />: 
            <Fragment>
                    <h1 className="large text-primary">Dashboard</h1>
            <div className="Container">
            <Fragment>
                <p className="lead">
                   <i className="fas fa-user" /> Welcome {user && user.name} !
                </p>
                {
                    (profile !== null)? 
                    (
                        <Fragment>
                            <TodolistDashboardComponent todolist={profile.todolist} />
                        </Fragment>
                    )
                     : (
                        <Fragment> 
                        <p> You have not yet setup a profile! Please add some info</p>
                        <Link to="/create-todo" className="btn btn-primary my-1">Create</Link>
                        <Link to="/edit-profile" className="btn btn-primary my-1">Edit</Link>
                        </Fragment>)
                }
            </Fragment>
            </div>                
            </Fragment>;
};

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile
});

export default connect(mapStateToProps, { getCurrentProfile })(Dashboard);
