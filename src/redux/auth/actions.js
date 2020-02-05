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
                    console.warn('action error===>', err)
                    dispatch(generateErrorAction(err, { failure: actionTypes.LOGIN_FAILURE, reject: actionTypes.LOGIN_REJECT }));
                    throw err;
                });
        };
    };
    const loading = () => action(actionTypes.LOGIN_LOADING);
    const success = res => action(actionTypes.LOGIN_SUCCESS, res);

    return request();
};


export const checkAlreadySingedUpMobileNumber = (mobileNumber) => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.auth
                .checkAlreadySingedUpMobileNumber(mobileNumber)
                .then(res => dispatch(success(res)))
                .catch(err => {
                    dispatch(generateErrorAction(err, { failure: actionTypes.CHECK_ALREADY_SIGNEDUP_MOBILE_NUMBER_FAILED, reject: actionTypes.CHECK_ALREADY_SIGNEDUP_MOBILE_NUMBER_REJECT }));
                    throw err;
                });
        };
    };
    const loading = () => action(actionTypes.CHECK_ALREADY_SIGNEDUP_MOBILE_NUMBER_LOADING);
    const success = res => action(actionTypes.CHECK_ALREADY_SIGNEDUP_MOBILE_NUMBER_SUCCESSFULLY, res);

    return request();
};


export const checkActivisionCode = (code) => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.auth
                .checkActivisionCode(code)
                .then(res => dispatch(success(res)))
                .catch(err => {
                    dispatch(generateErrorAction(err, {
                        failure: actionTypes.CHECK_ACTIVISION_CODE_FAILED,
                        reject: actionTypes.CHECK_ACTIVISION_CODE_REJECT
                    }));
                    throw err;
                });
        };
    };
    const loading = () => action(actionTypes.CHECK_ACTIVISION_CODE_LOADING);
    const success = res => action(actionTypes.CHECK_ACTIVISION_CODE_SUCCESSFULLY, res);

    return request();
};
