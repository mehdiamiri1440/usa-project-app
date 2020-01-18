import {
    action,
    generateErrorAction
} from '../actions';
import actionTypes from './actionTypes';

export const fetchUser = number => {
    const request = () => {
        return dispatch => dispatch(success(number));
    };
    const success = res => action(actionTypes.FETCH_USERS_SUCCESSY, res);
    return request();
};
