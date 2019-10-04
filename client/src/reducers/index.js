import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import profile from './profile';
import todo from './todo';

export default combineReducers({
  alert,
  auth,
  profile,
  todo
});