
import { 

GET_TASK,
REMOVE_TASK,
TASK_FAIL,
CHANGE_TASK,
CHANGE_TASK_FAIL

 } from "../actions/types";

const initialState = {
    todolist:{},
    todolists:[],
    loading: true,
    error: {}
};

export default function(state = initialState, action) {
    const { type, payload } = action;

    switch(type) {
        case GET_TASK:
             return {
                 ...state,
                 todolist: payload,
                 loading: false,
                 error: {}
             }
        case REMOVE_TASK:
            return {
                 ...state,
                 todolist: payload,
                 loading: false,
                 error:{}
            }
        case CHANGE_TASK:
             return {
                 ...state,
                 todolist: payload,
                 loading: false,
                 error:{}
             }
        case CHANGE_TASK_FAIL:
        case TASK_FAIL:
            {

            }
         default:
             return state;
        }
    }