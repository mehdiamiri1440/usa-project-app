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
    const success = res => action(actionTypes.LOGIN_SUCCESS, res);

    return request();
};



export const fastLogin = (payload) => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.auth
                .fastLogin(payload)
                .then(res => {
                    return dispatch(success(res))
                })
                .catch(err => {
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


export const checkActivisionCode = (code, mobileNumber) => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.auth
                .checkActivisionCode(code, mobileNumber)
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


export const fetchAllActivityZones = () => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.auth
                .fetchAllActivityZones()
                .then(res => dispatch(success(res)))
                .catch(err => {
                    dispatch(generateErrorAction(err, {
                        failure: actionTypes.FETCH_ALL_ACTIVITIY_ZONE_FAILED,
                        reject: actionTypes.FETCH_ALL_ACTIVITIY_ZONE_REJECT
                    }));
                    throw err;
                });
        };
    };
    const loading = () => action(actionTypes.FETCH_ALL_ACTIVITIY_ZONE_LOADING);
    const success = res => action(actionTypes.FETCH_ALL_ACTIVITIY_ZONE_SUCCESSFULLY, res);

    return request();
};


export const submitRegister = registerObject => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.auth
                .submitRegister(registerObject)
                .then(res => dispatch(success(res)))
                .catch(err => {
                    dispatch(generateErrorAction(err, {
                        failure: actionTypes.SUBMIT_REGISTER_FAILED,
                        reject: actionTypes.SUBMIT_REGISTER_REJECT
                    }));
                    throw err;
                });
        };
    };
    const loading = () => action(actionTypes.SUBMIT_REGISTER_LOADING);
    const success = res => action(actionTypes.SUBMIT_REGISTER_SUCCESSFULLY, res);

    return request();
};


export const changeRole = _ => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.auth
                .changeRole()
                .then(res => dispatch(success(res)))
                .catch(err => {
                    dispatch(generateErrorAction(err, {
                        failure: actionTypes.CHANGE_ROLE,
                        reject: actionTypes.CHANGE_ROLE_REJECT
                    }));
                    throw err;
                });
        };
    };
    const loading = () => action(actionTypes.CHANGE_ROLE_LOADING);
    const success = res => action(actionTypes.CHANGE_ROLE_SUCCESSFULLY, res);

    return request();
};


export const logOut = () => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.auth
                .logOut()
                .then(res => dispatch(success(res)))
                .catch(err => {
                    dispatch(generateErrorAction(err, {
                        failure: actionTypes.LOGOUT_FAILED,
                        reject: actionTypes.LOGOUT_REJECT
                    }));
                    throw err;
                });
        };
    };
    const loading = () => action(actionTypes.LOGOUT_LOADING);
    const success = res => action(actionTypes.LOGOUT_SUCCESSFULLY, res);

    return request();
};

export const setEvidences = (evidences) => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.auth
                .setEvidences(evidences)
                .then(res => dispatch(success(res)))
                .catch(err => {
                    dispatch(generateErrorAction(err, {
                        failure: actionTypes.SET_EVIDENCES_FAILED,
                        reject: actionTypes.SET_EVIDENCES_REJECT
                    }));
                    throw err;
                });
        };
    };
    const loading = () => action(actionTypes.SET_EVIDENCES_LOADING);
    const success = res => action(actionTypes.SET_EVIDENCES_SUCCESSFULLY, res);

    return request();
};
