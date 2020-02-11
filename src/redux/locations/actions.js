import {
    action,
    generateErrorAction
} from '../actions';
import actionTypes from './actionTypes';
import API from '../../apis'
export const fetchAllProvinces = provinceId => {
    const request = () => {
        return dispatch => {
            if (!provinceId) {
                dispatch(loading());
                return API.locations
                    .fetchAllProvinces()
                    .then(res => dispatch(success(res)))
                    .catch(err => {
                        dispatch(generateErrorAction(err, {
                            failure: actionTypes.FETCH_ALL_PROVINCES_FAILED,
                            reject: actionTypes.FETCH_ALL_PROVINCES_REJECT
                        }));
                        throw err;
                    });
            }
            else {
                dispatch(loading(provinceId));
                return API.locations
                    .fetchAllProvinces(provinceId)
                    .then(res => dispatch(success(res, provinceId)))
                    .catch(err => {
                        dispatch(generateErrorAction(err, {
                            failure: actionTypes.FETCH_ALL_CITIES_FAILED,
                            reject: actionTypes.FETCH_ALL_CITIES_REJECT
                        }));
                        throw err;
                    });
            }
        };
    };
    const loading = (provinceId) => {
        if (!provinceId) return action(actionTypes.FETCH_ALL_PROVINCES_LOADING);
        return action(actionTypes.FETCH_ALL_CITIES_LOADING);
    }
    const success = (res, provinceId) => {
        if (!provinceId) return action(actionTypes.FETCH_ALL_PROVINCES_SUCCESSFULLY, res);
        return action(actionTypes.FETCH_ALL_CITIES_SUCCESSFULLY, res);
    }

    return request();
};