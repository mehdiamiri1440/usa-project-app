import {
    action,
    generateErrorAction
} from '../actions';
import actionTypes from './actionTypes';
import API from '../../apis'


export const fetchAllProductsList = item => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.productsList
                .fetchAllProductsList(item)
                .then(res => dispatch(success(res)))
                .catch(err => {
                    dispatch(generateErrorAction(err, {
                        failure: actionTypes.FETCH_ALL_PRODUCTS_LIST_FAILED,
                        reject: actionTypes.FETCH_ALL_PRODUCTS_LIST_REJECT
                    }));
                    throw err;
                });
        };
    };
    const loading = () => action(actionTypes.FETCH_ALL_PRODUCTS_LIST_LOADING);
    const success = res => action(actionTypes.FETCH_ALL_PRODUCTS_LIST_SUCCESSFULLY, res);

    return request();
};
