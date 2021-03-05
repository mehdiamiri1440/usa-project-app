import {
    action,
    generateErrorAction
} from '../actions';
import actionTypes from './actionTypes';
import API from '../../apis'


export const fetchAllDashboardData = () => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.home
                .fetchAllDashboardData()
                .then(res => dispatch(success(res)))
                .catch(err => {
                    dispatch(generateErrorAction(err, {
                        failure: actionTypes.FETCH_ALL_DASHBOARD_DATA_FAILED,
                        reject: actionTypes.FETCH_ALL_DASHBOARD_DATA_REJECT
                    }));
                    throw err;
                });
        };
    };
    const loading = () => action(actionTypes.FETCH_ALL_DASHBOARD_DATA_LOADING);
    const success = res => action(actionTypes.FETCH_ALL_DASHBOARD_DATA_SUCCESSFULLY, res);

    return request();
};


export const fetchPackagesPrices = () => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.home
                .fetchPackagesPrices()
                .then(res => dispatch(success(res)))
                .catch(err => {
                    dispatch(generateErrorAction(err, {
                        failure: actionTypes.FETCH_PACKAGES_PRICES_FAILED,
                        reject: actionTypes.FETCH_PACKAGES_PRICES_REJECT
                    }));
                    throw err;
                });
        };
    };
    const loading = () => action(actionTypes.FETCH_PACKAGES_PRICES_LOADING);
    const success = res => action(actionTypes.FETCH_PACKAGES_PRICES_SUCCESSFULLY, res);

    return request();
};
