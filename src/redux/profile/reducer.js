import actionTypes from './actionTypes';
const INITIAL_STATE = {
    userProfileLoading: false,
    userProfileFailed: false,
    userProfileError: false,
    userProfileMessage: null,
    userProfile: {},

    isUserAllowedToSendMessageLoading: false,
    isUserAllowedToSendMessageFailed: false,
    isUserAllowedToSendMessageError: false,
    isUserAllowedToSendMessageMessage: null,
    isUserAllowedToSendMessage: {},

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


        case actionTypes.IS_USER_ALLOWED_TO_SEND_MESSAGE_LOADING: {
            return {
                ...state,
                isUserAllowedToSendMessage: {},
                isUserAllowedToSendMessageLoading: true,
                isUserAllowedToSendMessageFailed: false,
                isUserAllowedToSendMessageError: false,
                isUserAllowedToSendMessageMessage: null
            };
        };
        case actionTypes.IS_USER_ALLOWED_TO_SEND_MESSAGE_SUCCESSFULLY: {
            return {
                ...state,
                isUserAllowedToSendMessage: { ...action.payload },
                isUserAllowedToSendMessageLoading: false,
                isUserAllowedToSendMessageFailed: false,
                isUserAllowedToSendMessageError: false,
                isUserAllowedToSendMessageMessage: false,
            };
        };
        case actionTypes.IS_USER_ALLOWED_TO_SEND_MESSAGE_FAILED: {
            const { status } = action.payload;
            return {
                ...state,
                isUserAllowedToSendMessage: {},
                isUserAllowedToSendMessageLoading: false,
                isUserAllowedToSendMessageFailed: true,
                isUserAllowedToSendMessageError: false,
                isUserAllowedToSendMessageMessage: status
            };
        };
        case actionTypes.IS_USER_ALLOWED_TO_SEND_MESSAGE_REJECT: {
            let { phone } = action.payload.data.errors;
            return {
                ...state,
                isUserAllowedToSendMessage: {},
                isUserAllowedToSendMessageLoading: false,
                isUserAllowedToSendMessageFailed: false,
                isUserAllowedToSendMessageError: true,
                isUserAllowedToSendMessageMessage: phone
            };
        };

        default:
            return state
    }
};