import React, { useState ,Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createProfile } from '../../actions/profile';
import { createTodo } from '../../actions/todolist';
import { Link, withRouter } from 'react-router-dom';

const CreateTodo = ( { createTodo, history } ) => {

    const [formData, setFormData ] = useState({
        title:'',
        description:'',
        status:'Working'
    });

    const {title, description, status} = formData;

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value});

    const onSubmit = (e) => { 
      e.preventDefault();
      
      createTodo(formData,history);

     }

    return (
        <Fragment>
          <h1 className="large text-primary">Create Your Task</h1>
          <p className="lead">
            <i className="fas fa-user"></i> Let's get some information about your Task
          </p>
         <small>* = required field</small>
        <form className="form" onSubmit= { e => onSubmit(e) }>
           <div className="form-group">
              <input type="text" placeholder="Title" name="title" value={title} onChange={ e=> onChange(e)} />
              <small className="form-text">Title of your task</small>
            </div>
            <div className="form-group">
              <textarea placeholder="A Description of the task you want to create" value={description} name="description" onChange={ e=> onChange(e)}></textarea>
              <small className="form-text">A Description of the task</small>
            </div>       
            <input type="submit" className="btn btn-primary my-1" />
            <Link to="/dashboard" className="btn btn-light my-1">Go Back</Link>
      </form>
        </Fragment>
    )
}

CreateTodo.propTypes = {
  createTodo: PropTypes.func.isRequired,
}


export default connect(null,{createTodo})(withRouter(CreateTodo));
