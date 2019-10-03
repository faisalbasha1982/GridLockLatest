import React from 'react';
import axios from 'axios';
import { REGISTER_SUCCESS, 
    REGISTER_FAIL, 
    AUTH_ERROR,
    USER_LOADED, 
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    CLEAR_PROFILE
} from './types';
import { setAlert } from './alert';
import setAuthToken from '../utils/setAuthToken';

export const loadUser = () => async dispatch => {
  if(localStorage.token) {
      setAuthToken(localStorage.token);
  }

  console.log("load user called");

  try {

        const res = await axios.get('http://localhost:5000/api/auth');
        dispatch({
            type: USER_LOADED,
            payload: res.data
        });
  }catch(err) {
    dispatch({
        type: AUTH_ERROR
    });
  }
}

export const register = ({name, email, password }) => async dispatch => {

    const config = {
        headers: {
            'content-type':'application/json'
    }    
  }
  const body = JSON.stringify({name, email, password});

  try {
      const res = await axios.post('http://localhost:5000/api/users',body, config);
      dispatch({
          type: REGISTER_SUCCESS,
          payload: res.data
      });
      dispatch(loadUser());

  }catch(err) {
      const errors = err.response.data.errors;
      if(errors) {
          errors.forEach(error => dispatch(setAlert(error.msg,'danger')));
      }
    dispatch({
        type: REGISTER_FAIL,
    });
  }
}


export const login = ( email, password ) => async dispatch => {

    const config = {
        headers: {
            'content-type':'application/json'
    }    
  }
  const body = JSON.stringify({ email, password});

  try {
      const res = await axios.post('http://localhost:5000/api/auth',body, config);
      dispatch({
          type: LOGIN_SUCCESS,
          payload: res.data
      });

      dispatch(loadUser());

  }catch(err) {
      const errors = err.response.data.errors;
      if(errors) {
          errors.forEach(error => dispatch(setAlert(error.msg,'danger')));
      }
    dispatch({
        type: LOGIN_FAIL,
    });
  }
}

export const logout = () => dispatch => {

    dispatch({ type: LOGOUT});
    dispatch({ type: CLEAR_PROFILE});
}