import {
    action,
    generateErrorAction
} from '../actions';
import actionTypes from './actionTypes';
import API from '../../apis'
export const login = (mobileNumber, password) => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.auth
                .login(mobileNumber, password)
                .then(res => dispatch(success(res)))
                .catch(err => {
                    dispatch(generateErrorAction(err, { failure: actionTypes.LOGIN_FAILURE, reject: actionTypes.LOGIN_REJECT }));
                    throw err;
                });
        };
    };
    const loading = () => action(actionTypes.LOGIN_LOADING);
    const success = res => action(actionTypes.LOGIN_SUCCESS, res.payload);

    return request();
};
