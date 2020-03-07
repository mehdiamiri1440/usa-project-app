import {
    action,
    generateErrorAction
} from '../actions';
import actionTypes from './actionTypes';
import API from '../../apis'


export const fetchAllCategories = () => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.registerProduct
                .fetchAllCategories()
                .then(res => dispatch(success(res)))
                .catch(err => {
                    dispatch(generateErrorAction(err, {
                        failure: actionTypes.FETCH_ALL_CATEGORIES_FAILED,
                        reject: actionTypes.FETCH_ALL_CATEGORIES_REJECT
                    }));
                    throw err;
                });
        };
    };
    const loading = () => action(actionTypes.FETCH_ALL_CATEGORIES_LOADING);
    const success = res => action(actionTypes.FETCH_ALL_CATEGORIES_SUCCESSFULLY, res);

    return request();
};

export const fetchAllSubCategories = id => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.registerProduct
                .fetchAllSubCategories(id)
                .then(res => dispatch(success(res)))
                .catch(err => {
                    dispatch(generateErrorAction(err, {
                        failure: actionTypes.FETCH_ALL_SUB_CATEGORIES_FAILED,
                        reject: actionTypes.FETCH_ALL_SUB_CATEGORIES_REJECT
                    }));
                    throw err;
                });
        };
    };
    const loading = () => action(actionTypes.FETCH_ALL_SUB_CATEGORIES_LOADING);
    const success = res => action(actionTypes.FETCH_ALL_SUB_CATEGORIES_SUCCESSFULLY, res);

    return request();
};
