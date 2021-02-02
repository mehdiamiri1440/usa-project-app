import actionTypes from './actionTypes';
const INITIAL_STATE = {
    commentsLoading: false,
    commentsFailed: false,
    commentsError: false,
    commentsMessage: null,
    commentsList: [],
    commentsAndRatings: {},

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
        default:
            return state
    }
};