import {
    action,
    generateErrorAction
} from '../actions';
import actionTypes from './actionTypes';
import API from '../../apis'


export const fetchAllBuyAdRequests = (data, isLoggedIn) => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.buyAdRequest
                .fetchAllBuyAdRequests(data, isLoggedIn)
                .then(res => dispatch(success(res)))
                .catch(err => {
                    dispatch(generateErrorAction(err, {
                        failure: actionTypes.FETCH_BUYAD_REQUEST_FAILED,
                        reject: actionTypes.FETCH_BUYAD_REQUEST_REJECT
                    }));
                    throw err;
                });
        };
    };
    const loading = () => action(actionTypes.FETCH_BUYAD_REQUEST_LOADING);
    const success = res => action(actionTypes.FETCH_BUYAD_REQUEST_SUCCESSFULLY, res);

    return request();
};

export const fetchRelatedRequests = () => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.buyAdRequest
                .fetchRelatedRequests()
                .then(res => dispatch(success(res)))
                .catch(err => {
                    dispatch(generateErrorAction(err, {
                        failure: actionTypes.FETCH_RELATED_BUYAD_REQUESTS_FAILED,
                        reject: actionTypes.FETCH_RELATED_BUYAD_REQUESTS_REJECT
                    }));
                    throw err;
                });
        };
    };
    const loading = () => action(actionTypes.FETCH_RELATED_BUYAD_REQUESTS_LOADING);
    const success = res => action(actionTypes.FETCH_RELATED_BUYAD_REQUESTS_SUCCESSFULLY, res);

    return request();
};

export const fetchMyRequests = () => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.buyAdRequest
                .fetchMyRequests()
                .then(res => dispatch(success(res)))
                .catch(err => {
                    dispatch(generateErrorAction(err, {
                        failure: actionTypes.FETCH_MY_REQUESTS_FAILED,
                        reject: actionTypes.FETCH_MY_REQUESTS_REJECT
                    }));
                    throw err;
                });
        };
    };
    const loading = () => action(actionTypes.FETCH_MY_REQUESTS_LOADING);
    const success = res => action(actionTypes.FETCH_MY_REQUESTS_SUCCESSFULLY, res);

    return request();
};

export const deleteBuyAd = (id) => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.buyAdRequest
                .deleteBuyAd(id)
                .then(res => dispatch(success(res)))
                .catch(err => {
                    dispatch(generateErrorAction(err, {
                        failure: actionTypes.DELETE_BUYAD_FAILED,
                        reject: actionTypes.DELETE_BUYAD_REJECT
                    }));
                    throw err;
                });
        };
    };
    const loading = () => action(actionTypes.DELETE_BUYAD_LOADING);
    const success = res => action(actionTypes.DELETE_BUYAD_SUCCESSFULLY, res);

    return request();
};

export const fetchBuyerMobileNumber = contactInfoObject => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.buyAdRequest
                .fetchBuyerMobileNumber(contactInfoObject)
                .then(res => dispatch(success(res)))
                .catch(err => {
                    dispatch(generateErrorAction(err, {
                        failure: actionTypes.FETCH_BUYER_MOBILE_NUMBER_FAILED,
                        reject: actionTypes.FETCH_BUYER_MOBILE_NUMBER_REJECT
                    }));
                    throw err;
                });
        };
    };
    const loading = () => action(actionTypes.FETCH_BUYER_MOBILE_NUMBER_LOADING);
    const success = res => action(actionTypes.FETCH_BUYER_MOBILE_NUMBER_SUCCESSFULLY, res);

    return request();
};
