import {
    action,
    generateErrorAction
} from '../actions';
import actionTypes from './actionTypes';
import API from '../../apis'


export const fetchAllContactsList = () => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.messages
                .fetchAllContactsList()
                .then(res => dispatch(success(res)))
                .catch(err => {
                    dispatch(generateErrorAction(err, {
                        failure: actionTypes.FETCH_ALL_CONTACTS_LIST_FAILED,
                        reject: actionTypes.FETCH_ALL_CONTACTS_LIST_REJECT
                    }));
                    throw err;
                });
        };
    };
    const loading = () => action(actionTypes.FETCH_ALL_CONTACTS_LIST_LOADING);
    const success = res => action(actionTypes.FETCH_ALL_CONTACTS_LIST_SUCCESSFULLY, res);

    return request();
};


export const fetchUserChatHistory = (userId) => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.messages
                .fetchUserChatHistory(userId)
                .then(res => dispatch(success(res)))
                .catch(err => {
                    dispatch(generateErrorAction(err, {
                        failure: actionTypes.FETCH_USER_CHAT_HISTORY_FAILED,
                        reject: actionTypes.FETCH_USER_CHAT_HISTORY_REJECT
                    }));
                    throw err;
                });
        };
    };
    const loading = () => action(actionTypes.FETCH_USER_CHAT_HISTORY_LOADING);
    const success = res => action(actionTypes.FETCH_USER_CHAT_HISTORY_SUCCESSFULLY, res);

    return request();
};


export const sendMessage = (msgObject) => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.messages
                .sendMessage(msgObject)
                .then(res => dispatch(success(res)))
                .catch(err => {
                    dispatch(generateErrorAction(err, {
                        failure: actionTypes.SEND_PRIVATE_MESSAGE_FAILED,
                        reject: actionTypes.SEND_PRIVATE_MESSAGE_REJECT
                    }));
                    throw err;
                });
        };
    };
    const loading = () => action(actionTypes.SEND_PRIVATE_MESSAGE_LOADING);
    const success = res => action(actionTypes.SEND_PRIVATE_MESSAGE_SUCCESSFULLY, res);

    return request();
};


export const fetchUserProfilePhoto = (userId) => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.messages
                .fetchUserProfilePhoto(userId)
                .then(res => dispatch(success(res)))
                .catch(err => {
                    dispatch(generateErrorAction(err, {
                        failure: actionTypes.FETCH_USER_PROFILE_PHOTO_FAILED,
                        reject: actionTypes.FETCH_USER_PROFILE_PHOTO_REJECT
                    }));
                    throw err;
                });
        };
    };
    const loading = () => action(actionTypes.FETCH_USER_PROFILE_PHOTO_LOADING);
    const success = res => action(actionTypes.FETCH_USER_PROFILE_PHOTO_SUCCESSFULLY, res);

    return request();
};
