import {
    action,
    generateErrorAction
} from '../actions';
import actionTypes from './actionTypes';
import API from '../../apis'


export const fetchAllContactsList = () => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.messages
                .fetchAllContactsList()
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
