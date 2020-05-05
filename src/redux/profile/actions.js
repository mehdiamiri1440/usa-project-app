import {
    action,
    generateErrorAction
} from '../actions';
import actionTypes from './actionTypes';
import API from '../../apis'


export const fetchUserProfile = () => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.profile
                .fetchUserProfile()
                .then(res => dispatch(success(res)))
                .catch(err => {
                    dispatch(generateErrorAction(err, {
                        failure: actionTypes.FETCH_USER_PROFILE_FAILED,
                        reject: actionTypes.FETCH_USER_PROFILE_REJECT
                    }));
                    throw err;
                });
        };
    };
    const loading = () => action(actionTypes.FETCH_USER_PROFILE_LOADING);
    const success = res => action(actionTypes.FETCH_USER_PROFILE_SUCCESSFULLY, res);

    return request();
};

export const isUserAllowedToSendMessage = (id) => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.profile
                .isUserAllowedToSendMessage(id)
                .then(res => dispatch(success(res)))
                .catch(err => {
                    dispatch(generateErrorAction(err, {
                        failure: actionTypes.IS_USER_ALLOWED_TO_SEND_MESSAGE_FAILED,
                        reject: actionTypes.IS_USER_ALLOWED_TO_SEND_MESSAGE_REJECT
                    }));
                    throw err;
                });
        };
    };
    const loading = () => action(actionTypes.IS_USER_ALLOWED_TO_SEND_MESSAGE_LOADING);
    const success = res => action(actionTypes.IS_USER_ALLOWED_TO_SEND_MESSAGE_SUCCESSFULLY, res);

    return request();
};
