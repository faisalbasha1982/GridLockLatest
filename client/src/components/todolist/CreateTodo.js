import React, { useState ,Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const CreateTodo = props => {

    const [formData, setFormData ] = useState({
        title:'',
        description:'',
        status:''
    });

    const {title, description, status} = formData;

    return (
        <Fragment>
          <h1 className="large text-primary">Create Your Task</h1>
          <p className="lead">
            <i className="fas fa-user"></i> Let's get some information about your Task
          </p>
         <small>* = required field</small>
        <form className="form">
           <div className="form-group">
              <input type="text" placeholder="Title" name="title" />
              <small className="form-text">Title of your task</small>
            </div>
            <div className="form-group">
              <textarea placeholder="A Description of the task you want to create" name="description"></textarea>
              <small className="form-text">A Description of the task</small>
            </div>
            <div className="form-group">
              <select name="status">
                <option value="0">* Select Task Status</option>
                <option value="Working">Working</option>
                <option value="Finished">Finished</option>
                <option value="Cancel Task">Cancel Task</option>
                <option value="Delete">Delete</option>
              </select>
                <small className="form-text">Give us an idea of where you are at in your Task</small>
            </div>
      </form>
        </Fragment>
    )
}

CreateTodo.propTypes = {

}

export default CreateTodo
