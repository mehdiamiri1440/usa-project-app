import {
    action,
    generateErrorAction
} from '../actions';
import actionTypes from './actionTypes';
import API from '../../apis'


export const fetchAllComments = userId => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.commentsAndRatings
                .fetchAllComments(userId)
                .then(res => dispatch(success(res)))
                .catch(err => {
                    dispatch(generateErrorAction(err, {
                        failure: actionTypes.FETCH_ALL_COMMENTS_FAILED,
                        reject: actionTypes.FETCH_ALL_COMMENTS_REJECT
                    }));
                    throw err;
                });
        };
    };
    const loading = () => action(actionTypes.FETCH_ALL_COMMENTS_LOADING);
    const success = res => action(actionTypes.FETCH_ALL_COMMENTS_SUCCESSFULLY, res);

    return request();
};
