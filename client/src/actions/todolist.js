import React from 'react';
import axios from 'axios';
import { setAlert } from './alert';

import { 
    GET_TASK,
    REMOVE_TASK,
    TASK_FAIL,
    CHANGE_TASK_FAIL,
    CHANGE_TASK
 } from './types';


export const createTodo =  ( formData, history, edit=false ) => async dispatch => {

    try {
        const config = {
            'content-type': 'application/json'
        }

        const res = await axios.post('http://localhost:5000/api/todo',formData,config);

        dispatch({
            type: GET_TASK,
            payload: res.data
        });

        dispatch(setAlert(edit? 'Task Updated': 'Task Created'));

        if(!edit) {
            history.push('/dashboard');
        }
    }catch(error){

        const errors = error.response.data.errors;

        if(errors){
           errors.forEach((err) => dispatch(setAlert(err.message,'danger')));
        }

        dispatch({
            type: TASK_FAIL,
            payload: {
                msg: error.response.statusText, 
                status: error.response.status
            }
        });       
    }
}

export const changeStatus = ( formData, edit=false ) => async dispatch => {

console.log("change status called");

    try {
            const config = {
                'content-type': 'application/json'
            }

            const res = await axios.post('http://localhost:5000/api/todo/status',formData,config);

            dispatch({
                type: CHANGE_TASK,
                payload: res.data
            });

            dispatch(setAlert(edit? 'Task Updated': 'Task Created'));

            if(!edit) {
                //history.push('/dashboard');
            }
    }catch(error){
        console.log(error.message);
          const errors = error.response.data.errors;

        if(errors){
           errors.forEach((err) => dispatch(setAlert(err.message,'danger')));
        }

        dispatch({
            type: CHANGE_TASK_FAIL,
            payload: {
                msg: error.response.statusText, 
                status: error.response.status
            }
        });       
    }

}

export const removeTodo = () => async dispatch => {

}

export const getTodo = () => async dispatch => {

}