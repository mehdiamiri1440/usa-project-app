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

export const fetchProfileStatistics = (userName) => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.profile
                .fetchProfileStatistics(userName)
                .then(res => dispatch(success(res)))
                .catch(err => {
                    dispatch(generateErrorAction(err, {
                        failure: actionTypes.FETCH_PROFILE_STATISTICS_FAILED,
                        reject: actionTypes.FETCH_PROFILE_STATISTICS_REJECT
                    }));
                    throw err;
                });
        };
    };
    const loading = () => action(actionTypes.FETCH_PROFILE_STATISTICS_LOADING);
    const success = res => action(actionTypes.FETCH_PROFILE_STATISTICS_SUCCESSFULLY, res);

    return request();
};

export const fetchProfileByUserName = (userName) => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.profile
                .fetchProfileByUserName(userName)
                .then(res => dispatch(success(res)))
                .catch(err => {
                    dispatch(generateErrorAction(err, {
                        failure: actionTypes.FETCH_PROFILE_BY_USERNAME_FAILED,
                        reject: actionTypes.FETCH_PROFILE_BY_USERNAME_REJECT
                    }));
                    throw err;
                });
        };
    };
    const loading = () => action(actionTypes.FETCH_PROFILE_BY_USERNAME_LOADING);
    const success = res => action(actionTypes.FETCH_PROFILE_BY_USERNAME_SUCCESSFULLY, res);

    return request();
};

export const fetchProductsListByUserName = (userName) => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.profile
                .fetchProductsListByUserName(userName)
                .then(res => dispatch(success(res)))
                .catch(err => {
                    dispatch(generateErrorAction(err, {
                        failure: actionTypes.FETCH_PRODUCTS_LIST_BY_USERNAME_FAILED,
                        reject: actionTypes.FETCH_PRODUCTS_LIST_BY_USERNAME_REJECT
                    }));
                    throw err;
                });
        };
    };
    const loading = () => action(actionTypes.FETCH_PRODUCTS_LIST_BY_USERNAME_LOADING);
    const success = res => action(actionTypes.FETCH_PRODUCTS_LIST_BY_USERNAME_SUCCESSFULLY, res);

    return request();
};

export const editProfile = (item) => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.profile
                .editProfile(item)
                .then(res => dispatch(success(res)))
                .catch(err => {
                    dispatch(generateErrorAction(err, {
                        failure: actionTypes.EDIT_PROFILE_FAILED,
                        reject: actionTypes.EDIT_PROFILE_REJECT
                    }));
                    throw err;
                });
        };
    };
    const loading = () => action(actionTypes.EDIT_PROFILE_LOADING);
    const success = res => action(actionTypes.EDIT_PROFILE_SUCCESSFULLY, res);

    return request();
};
