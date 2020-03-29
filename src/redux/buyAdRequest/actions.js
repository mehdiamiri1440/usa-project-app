import {
    action,
    generateErrorAction
} from '../actions';
import actionTypes from './actionTypes';
import API from '../../apis'


export const fetchAllBuyAdRequests = () => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.buyAdRequest
                .fetchAllBuyAdRequests()
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
