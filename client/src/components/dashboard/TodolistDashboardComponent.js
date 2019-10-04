import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { changeStatus } from '../../actions/todolist';

const TodolistDashboardComponent = ({ changeStatus, todolist }) => {

  const [formData, setFormData ] = useState({
        title:'',
        description:'',
        status:'Working',
        newstatus: 'Working',
    });

    const options = [
        {
            name: "Working",
            value:"Working"
        },
          {
            name: "Cancel Task",
            value:"Cancel Task"
        },
          {
            name: "Finished",
            value: "Finished"
        },
        {
            name: "Delete",
            value: "Delete"
        }

    ];

    const [selectedOption, setSelectedOption] = useState(options[0].value);

  const handleChange = (option,title,desc,status) => { 

      console.log("onchange dtata");
      console.log(option);
      console.log(title);
      console.log(desc);
      console.log(status);
      setFormData({ ...formData, title:title, description: desc,status:status, newstatus: option}) ;
      setSelectedOption(option);

      changeStatus({title:title,description:desc,status:status,newstatus:option});

  };

    const todolists = todolist.map((item) => (
        <tr key={item._id} className="dropdown">
            <td className="hide-sm">{item.title}</td>
            <td className="hide-smd">{item.description}</td>
            <td className="hide-sm">{item.status}</td>
            <td className="hide-sm btn dropdown-toggle" type="button" data-toggle="dropdown"><span className="caret"></span>
            <ul className="dropdown-menu">
                <select value={selectedOption}
                    onChange={e => handleChange(e.target.value,item.title,item.description, item.status)}>
                    {options.map(o => (
                    <option value={o.value}>{o.name}</option>
                    ))}
                </select>
            </ul>
          </td>
              </tr>
    ));
    return (
        <div className="Container">
            <table className="centered">
                <thead className="thead">
                    <tr className="trows">
                        <th className="hide-sm">Title </th>
                        <th className="hide-sm">Description</th>
                        <th className="hide-sm">Status</th>
                        <th className="hide-sm">Actions</th>
                    </tr> 
                </thead>                
                <tbody>
                { todolists }
                <div className="createtodo">
                    <Link to="/create-todo" className="btn btn-primary my-1">Create</Link>
                </div>                
                </tbody>
            </table>
        </div>
    )
}

TodolistDashboardComponent.propTypes = {
    todolist: PropTypes.array.isRequired,
    changeStatus: PropTypes.func.isRequired
};


export default connect(null,{changeStatus})(TodolistDashboardComponent);
