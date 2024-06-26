import {
    action,
    generateErrorAction
} from '../actions';
import actionTypes from './actionTypes';
import API from '../../apis'


export const fetchAllContactsList = (from, to) => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.messages
                .fetchAllContactsList(from, to)
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


export const fetchUserChatHistory = (userId, from, to) => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.messages
                .fetchUserChatHistory(userId, from, to)
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


export const sendMessage = (msgObject, buyAdId, productId) => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.messages
                .sendMessage(msgObject, buyAdId, productId)
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


export const fetchTotalUnreadMessages = () => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.messages
                .fetchTotalUnreadMessages()
                .then(res => dispatch(success(res)))
                .catch(err => {
                    dispatch(generateErrorAction(err, {
                        failure: actionTypes.FETCH_TOTAL_UNDREAD_MESSAGES_FAILED,
                        reject: actionTypes.FETCH_TOTAL_UNDREAD_MESSAGES_REJECT
                    }));
                    throw err;
                });
        };
    };
    const loading = () => action(actionTypes.FETCH_TOTAL_UNDREAD_MESSAGES_LOADING);
    const success = res => action(actionTypes.FETCH_TOTAL_UNDREAD_MESSAGES_SUCCESSFULLY, res);

    return request();
};


export const fetchChannelData = (page) => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.messages
                .fetchChannelData(page)
                .then(res => dispatch(success(res)))
                .catch(err => {
                    dispatch(generateErrorAction(err, {
                        failure: actionTypes.FETCH_CHANNEL_DATA_FAILED,
                        reject: actionTypes.FETCH_CHANNEL_DATA_REJECT
                    }));
                    throw err;
                });
        };
    };
    const loading = () => action(actionTypes.FETCH_CHANNEL_DATA_LOADING);
    const success = res => action(actionTypes.FETCH_CHANNEL_DATA_SUCCESSFULLY, res);

    return request();
};



export const fetchViolationReportReasons = () => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.messages
                .fetchViolationReportReasons()
                .then(res => dispatch(success(res)))
                .catch(err => {
                    dispatch(generateErrorAction(err, {
                        failure: actionTypes.FETCH_VIOLATION_REPORT_REASONS_FAILED,
                        reject: actionTypes.FETCH_VIOLATION_REPORT_REASONS_REJECT
                    }));
                    throw err;
                });
        };
    };
    const loading = () => action(actionTypes.FETCH_VIOLATION_REPORT_REASONS_LOADING);
    const success = res => action(actionTypes.FETCH_VIOLATION_REPORT_REASONS_SUCCESSFULLY, res);

    return request();
};


export const sendReportReason = reportObj => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.messages
                .sendReportReason(reportObj)
                .then(res => dispatch(success(res)))
                .catch(err => {
                    dispatch(generateErrorAction(err, {
                        failure: actionTypes.SEND_REPORT_FAILED,
                        reject: actionTypes.SEND_REPORT_REJECT
                    }));
                    throw err;
                });
        };
    };
    const loading = () => action(actionTypes.SEND_REPORT_LOADING);
    const success = res => action(actionTypes.SEND_REPORT_SUCCESSFULLY, res);

    return request();
};


export const newMessageReceived = (message) => {
    return dispatch => dispatch(action(actionTypes.NEW_MESSAGE_RECEIVED, message));
};
