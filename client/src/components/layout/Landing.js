import React from 'react'
import { Link,Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const Landing = ({ isAuthenticated }) => {

  if(isAuthenticated){
    return <Redirect to="/Dashboard" />
  }

    return (
<section className="landing">
      <div className="dark-overlay">
        <div className="landing-inner">
          <h1 className="x-large">GridTask Systems</h1>
          <p className="lead">
             Create Tasks and Maintain them Add, Delete & Modify.
          </p>
          <div className="buttons">
            <Link to='/register' className="btn btn-primary">Sign Up</Link>
            <Link to='/login' className="btn btn-light">Login</Link>
          </div>
        </div>
      </div>
    </section>    )
}

Landing.propTypes = {
  isAuthenticated: PropTypes.bool,
  auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
})

export default connect(mapStateToProps)(Landing)
