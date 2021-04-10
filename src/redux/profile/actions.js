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

export const fetchAllProfileInfo = (user_name) => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return Promise.all([
                API.profile.fetchProfileStatistics(user_name),
                API.profile.fetchProfileByUserName(user_name),
                API.profile.fetchProductsListByUserName(user_name, false),
            ])
                .then(res => dispatch(success(res)))
                .catch(err => {
                    dispatch(generateErrorAction(err, {
                        failure: actionTypes.FETCH_ALL_PROFILE_INFO_FAILED,
                        reject: actionTypes.FETCH_ALL_PROFILE_INFO_REJECT
                    }));
                    throw err;
                });
        };
    };
    const loading = () => action(actionTypes.FETCH_ALL_PROFILE_INFO_LOADING);
    const success = res => action(actionTypes.FETCH_ALL_PROFILE_INFO_SUCCESSFULLY, res);

    return request();
};

export const fetchAccountBalance = () => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.profile
                .fetchAccountBalance()
                .then(res => dispatch(success(res)))
                .catch(err => {
                    dispatch(generateErrorAction(err, {
                        failure: actionTypes.FETCH_ACCOUNT_BALANCE_FAILED,
                        reject: actionTypes.FETCH_ACCOUNT_BALANCE_REJECT
                    }));
                    throw err;
                });
        };
    };
    const loading = () => action(actionTypes.FETCH_ACCOUNT_BALANCE_LOADING);
    const success = res => action(actionTypes.FETCH_ACCOUNT_BALANCE_SUCCESSFULLY, res);

    return request();
};

export const setPhoneNumberViewPermission = permission => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.profile
                .setPhoneNumberViewPermission(permission)
                .then(res => dispatch(success(res)))
                .catch(err => {
                    dispatch(generateErrorAction(err, {
                        failure: actionTypes.SET_PHONE_NUMBER_VIEW_PERMISSION_FAILED,
                        reject: actionTypes.SET_PHONE_NUMBER_VIEW_PERMISSION_REJECT
                    }));
                    throw err;
                });
        };
    };
    const loading = () => action(actionTypes.SET_PHONE_NUMBER_VIEW_PERMISSION_LOADING);
    const success = res => action(actionTypes.SET_PHONE_NUMBER_VIEW_PERMISSION_SUCCESSFULLY, res);

    return request();
};

export const fetchUserContactInfoViewers = _ => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.profile
                .fetchUserContactInfoViewers()
                .then(res => dispatch(success(res)))
                .catch(err => {
                    dispatch(generateErrorAction(err, {
                        failure: actionTypes.FETCH_USER_CONTACT_INFO_VIEWERS_FAILED,
                        reject: actionTypes.FETCH_USER_CONTACT_INFO_VIEWERS_REJECT
                    }));
                    throw err;
                });
        };
    };
    const loading = () => action(actionTypes.FETCH_USER_CONTACT_INFO_VIEWERS_LOADING);
    const success = res => action(actionTypes.FETCH_USER_CONTACT_INFO_VIEWERS_SUCCESSFULLY, res);

    return request();
};

export const walletElevatorPay = id => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.profile
                .walletElevatorPay(id)
                .then(res => dispatch(success(res)))
                .catch(err => {
                    dispatch(generateErrorAction(err, {
                        failure: actionTypes.WALLET_ELEVATOR_PAY_FAILED,
                        reject: actionTypes.WALLET_ELEVATOR_PAY_REJECT
                    }));
                    throw err;
                });
        };
    };
    const loading = () => action(actionTypes.WALLET_ELEVATOR_PAY_LOADING);
    const success = res => action(actionTypes.WALLET_ELEVATOR_PAY_SUCCESSFULLY, res);

    return request();
};