import actionTypes from './actionTypes';
const INITIAL_STATE = {
    userProfileLoading: false,
    userProfileFailed: false,
    userProfileError: false,
    userProfileMessage: null,
    userProfile: {},

};
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {


        case actionTypes.FETCH_USER_PROFILE_LOADING: {
            return {
                ...state,
                userProfile: {},
                userProfileLoading: true,
                userProfileFailed: false,
                userProfileError: false,
                userProfileMessage: null
            };
        };
        case actionTypes.FETCH_USER_PROFILE_SUCCESSFULLY: {
            let { msg, user_info } = action.payload
            return {
                ...state,
                userProfile: { ...action.payload },
                userProfileLoading: false,
                userProfileFailed: false,
                userProfileError: false,
                userProfileMessage: msg,
            };
        };
        case actionTypes.FETCH_USER_PROFILE_FAILED: {
            const { msg } = action.payload;
            return {
                ...state,
                userProfile: {},
                userProfileLoading: false,
                userProfileFailed: true,
                userProfileError: false,
                userProfileMessage: msg
            };
        };
        case actionTypes.FETCH_USER_PROFILE_REJECT: {
            let { phone } = action.payload.data.errors;
            return {
                ...state,
                userProfile: {},
                userProfileLoading: false,
                userProfileFailed: false,
                userProfileError: true,
                userProfileMessage: phone
            };
        };

        default:
            return state
    }
};