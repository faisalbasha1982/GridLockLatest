import axios from 'axios';

// axios.defaults.baseURL = 'https://localhost:5000';

const setAuthToken = token => {
    if(token)
     {
         axios.defaults.headers.common['x-auth-token'] = token;
     }
     else {
         delete axios.defaults.headers.common['x-auth-token'];
     }
}

export default setAuthToken;