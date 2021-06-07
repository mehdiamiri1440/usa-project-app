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

export const submitRating = submitRating => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.commentsAndRatings
                .submitRating(submitRating)
                .then(res => dispatch(success(res)))
                .catch(err => {
                    dispatch(generateErrorAction(err, {
                        failure: actionTypes.SUBMIT_RATING_FAILED,
                        reject: actionTypes.SUBMIT_RATING_REJECT
                    }));
                    throw err;
                });
        };
    };
    const loading = () => action(actionTypes.SUBMIT_RATING_LOADING);
    const success = res => action(actionTypes.SUBMIT_RATING_SUCCESSFULLY, res);

    return request();
};

export const checkUserAuthorityToPostComment = userId => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.commentsAndRatings
                .checkUserAuthorityToPostComment(userId)
                .then(res => dispatch(success(res)))
                .catch(err => {
                    dispatch(generateErrorAction(err, {
                        failure: actionTypes.CHECK_USER_AUTHORITY_TO_POST_COMMENT_FAILED,
                        reject: actionTypes.CHECK_USER_AUTHORITY_TO_POST_COMMENT_REJECT
                    }));
                    throw err;
                });
        };
    };
    const loading = () => action(actionTypes.CHECK_USER_AUTHORITY_TO_POST_COMMENT_LOADING);
    const success = res => action(actionTypes.CHECK_USER_AUTHORITY_TO_POST_COMMENT_SUCCESSFULLY, res);

    return request();
};

export const likeOrDisLikeComment = likingObj => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.commentsAndRatings
                .likeOrDisLikeComment(likingObj)
                .then(res => dispatch(success(res)))
                .catch(err => {
                    dispatch(generateErrorAction(err, {
                        failure: actionTypes.LIKE_OR_DISLIKE_COMMENT_FAILED,
                        reject: actionTypes.LIKE_OR_DISLIKE_COMMENT_REJECT
                    }));
                    throw err;
                });
        };
    };
    const loading = () => action(actionTypes.LIKE_OR_DISLIKE_COMMENT_LOADING);
    const success = res => action(actionTypes.LIKE_OR_DISLIKE_COMMENT_SUCCESSFULLY, res);

    return request();
};

export const deleteComment = id => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.commentsAndRatings
                .deleteComment(id)
                .then(res => dispatch(success(res)))
                .catch(err => {
                    dispatch(generateErrorAction(err, {
                        failure: actionTypes.DELETE_COMMENT_FAILED,
                        reject: actionTypes.DELETE_COMMENT_REJECT
                    }));
                    throw err;
                });
        };
    };
    const loading = () => action(actionTypes.DELETE_COMMENT_LOADING);
    const success = res => action(actionTypes.DELETE_COMMENT_SUCCESSFULLY, res);

    return request();
};
