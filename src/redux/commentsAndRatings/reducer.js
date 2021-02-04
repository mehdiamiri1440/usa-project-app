import actionTypes from './actionTypes';
const INITIAL_STATE = {
    commentsLoading: false,
    commentsFailed: false,
    commentsError: false,
    commentsMessage: null,
    commentsList: [],
    commentsAndRatings: {},

    rateSubmissionLoading: false,
    rateSubmissionFailed: false,
    rateSubmissionError: false,
    rateSubmissionMessage: null,
    rateSubmissionAndRatings: {},

    userAuthorityToPostCommentLoading: false,
    userAuthorityToPostCommentFailed: false,
    userAuthorityToPostCommentError: false,
    userAuthorityToPostCommentMessage: null,
    userAuthorityToPostCommentAndRatings: {},

    likeOrDislikeCommentLoading: false,
    likeOrDislikeCommentFailed: false,
    likeOrDislikeCommentError: false,
    likeOrDislikeCommentMessage: null,
    likeOrDislikeComment: {},

    deleteCommentLoading: false,
    deleteCommentFailed: false,
    deleteCommentError: false,
    deleteCommentMessage: null,
    deleteComment: {},

};
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {


        case actionTypes.FETCH_ALL_COMMENTS_LOADING: {
            return {
                ...state,
                commentsList: [],
                commentsAndRatings: {},
                commentsLoading: true,
                commentsFailed: false,
                commentsError: false,
                commentsMessage: null
            };
        };
        case actionTypes.FETCH_ALL_COMMENTS_SUCCESSFULLY: {
            let { msg = '' } = action.payload
            return {
                ...state,
                commentsList: [...action.payload.comments],
                commentsAndRatings: { ...action.payload },
                commentsLoading: false,
                commentsFailed: false,
                commentsError: false,
                commentsMessage: msg,
            };
        };
        case actionTypes.FETCH_ALL_COMMENTS_FAILED: {
            const { msg = '' } = action.payload;
            return {
                ...state,
                commentsList: [],
                commentsAndRatings: {},
                commentsLoading: false,
                commentsFailed: true,
                commentsError: false,
                commentsMessage: msg
            };
        };
        case actionTypes.FETCH_ALL_COMMENTS_REJECT: {
            return {
                ...state,
                commentsList: [],
                commentsAndRatings: {},
                commentsLoading: false,
                commentsFailed: false,
                commentsError: true,
                commentsMessage: ''
            };
        };


        case actionTypes.SUBMIT_RATING_LOADING: {
            return {
                ...state,
                rateSubmissionAndRatings: {},
                rateSubmissionLoading: true,
                rateSubmissionFailed: false,
                rateSubmissionError: false,
                rateSubmissionMessage: null
            };
        };
        case actionTypes.SUBMIT_RATING_SUCCESSFULLY: {
            let { msg = '' } = action.payload
            return {
                ...state,
                rateSubmissionAndRatings: { ...action.payload },
                rateSubmissionLoading: false,
                rateSubmissionFailed: false,
                rateSubmissionError: false,
                rateSubmissionMessage: msg,
            };
        };
        case actionTypes.SUBMIT_RATING_FAILED: {
            const { msg = '' } = action.payload;
            return {
                ...state,
                rateSubmissionAndRatings: {},
                rateSubmissionLoading: false,
                rateSubmissionFailed: true,
                rateSubmissionError: false,
                rateSubmissionMessage: msg
            };
        };
        case actionTypes.SUBMIT_RATING_REJECT: {
            return {
                ...state,
                rateSubmissionAndRatings: {},
                rateSubmissionLoading: false,
                rateSubmissionFailed: false,
                rateSubmissionError: true,
                rateSubmissionMessage: ''
            };
        };


        case actionTypes.CHECK_USER_AUTHORITY_TO_POST_COMMENT_LOADING: {
            return {
                ...state,
                userAuthorityToPostCommentAndRatings: {},
                userAuthorityToPostCommentLoading: true,
                userAuthorityToPostCommentFailed: false,
                userAuthorityToPostCommentError: false,
                userAuthorityToPostCommentMessage: null
            };
        };
        case actionTypes.CHECK_USER_AUTHORITY_TO_POST_COMMENT_SUCCESSFULLY: {
            let { msg = '' } = action.payload
            return {
                ...state,
                userAuthorityToPostCommentAndRatings: { ...action.payload },
                userAuthorityToPostCommentLoading: false,
                userAuthorityToPostCommentFailed: false,
                userAuthorityToPostCommentError: false,
                userAuthorityToPostCommentMessage: msg,
            };
        };
        case actionTypes.CHECK_USER_AUTHORITY_TO_POST_COMMENT_FAILED: {
            const { msg = '' } = action.payload;
            return {
                ...state,
                userAuthorityToPostCommentAndRatings: {},
                userAuthorityToPostCommentLoading: false,
                userAuthorityToPostCommentFailed: true,
                userAuthorityToPostCommentError: false,
                userAuthorityToPostCommentMessage: msg
            };
        };
        case actionTypes.CHECK_USER_AUTHORITY_TO_POST_COMMENT_REJECT: {
            return {
                ...state,
                userAuthorityToPostCommentAndRatings: {},
                userAuthorityToPostCommentLoading: false,
                userAuthorityToPostCommentFailed: false,
                userAuthorityToPostCommentError: true,
                userAuthorityToPostCommentMessage: ''
            };
        };


        case actionTypes.LIKE_OR_DISLIKE_COMMENT_LOADING: {
            return {
                ...state,
                likeOrDislikeComment: {},
                likeOrDislikeCommentLoading: true,
                likeOrDislikeCommentFailed: false,
                likeOrDislikeCommentError: false,
                likeOrDislikeCommentMessage: null
            };
        };
        case actionTypes.LIKE_OR_DISLIKE_COMMENT_SUCCESSFULLY: {
            let { msg = '' } = action.payload
            return {
                ...state,
                likeOrDislikeComment: { ...action.payload },
                likeOrDislikeCommentLoading: false,
                likeOrDislikeCommentFailed: false,
                likeOrDislikeCommentError: false,
                likeOrDislikeCommentMessage: msg,
            };
        };
        case actionTypes.LIKE_OR_DISLIKE_COMMENT_FAILED: {
            const { msg = '' } = action.payload;
            return {
                ...state,
                likeOrDislikeComment: {},
                likeOrDislikeCommentLoading: false,
                likeOrDislikeCommentFailed: true,
                likeOrDislikeCommentError: false,
                likeOrDislikeCommentMessage: msg
            };
        };
        case actionTypes.LIKE_OR_DISLIKE_COMMENT_REJECT: {
            return {
                ...state,
                likeOrDislikeComment: {},
                likeOrDislikeCommentLoading: false,
                likeOrDislikeCommentFailed: false,
                likeOrDislikeCommentError: true,
                likeOrDislikeCommentMessage: ''
            };
        };


        case actionTypes.DELETE_COMMENT_LOADING: {
            return {
                ...state,
                deleteComment: {},
                deleteCommentLoading: true,
                deleteCommentFailed: false,
                deleteCommentError: false,
                deleteCommentMessage: null
            };
        };
        case actionTypes.DELETE_COMMENT_SUCCESSFULLY: {
            let { msg = '' } = action.payload
            return {
                ...state,
                deleteComment: { ...action.payload },
                deleteCommentLoading: false,
                deleteCommentFailed: false,
                deleteCommentError: false,
                deleteCommentMessage: msg,
            };
        };
        case actionTypes.DELETE_COMMENT_FAILED: {
            const { msg = '' } = action.payload;
            return {
                ...state,
                deleteComment: {},
                deleteCommentLoading: false,
                deleteCommentFailed: true,
                deleteCommentError: false,
                deleteCommentMessage: msg
            };
        };
        case actionTypes.DELETE_COMMENT_REJECT: {
            return {
                ...state,
                deleteComment: {},
                deleteCommentLoading: false,
                deleteCommentFailed: false,
                deleteCommentError: true,
                deleteCommentMessage: ''
            };
        };


        default:
            return state
    }
};