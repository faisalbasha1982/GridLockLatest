import axios from 'axios';
import { setAlert } from './alert';

import {
    GET_PROFILE,
    PROFILE_ERROR
} from './types';

// Get Current Users Profile
export const getCurrentProfile = () => async dispatch => {
    try {
            const res = await axios.get('http://localhost:5000/api/profile/me');
            dispatch({
                type: GET_PROFILE,
                payload: res.data
            });
    } catch (error) {


        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: error.message,
                status: "500 profil error"
            }
        });

        
        console.log(error);
    }

}

export const createProfile = ( formData, history, edit=false ) => async dispatch => {

    try {
        const config = {
            'content-type': 'application/json'
        }
        const res = await axios.post('http://localhost:5000/api/profile',formData,config);

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });

        dispatch(setAlert(edit? 'profileUpdated': 'profile created'));

        if(!edit) {
            history.push('/dashboard');
        }
    }catch(error){

        const errors = error.response.data.errors;

        if(errors){
           errors.forEach((err) => dispatch(setAlert(err.message,'danger')));
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: error.response.statusText, 
                status: error.response.status
            }
        });       
    }
}