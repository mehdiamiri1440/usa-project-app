import actionTypes from './actionTypes';
const INITIAL_STATE = {
    loginLoading: false,
    loginFailed: false,
    loginError: false,
    is_buyer: 0,
    is_seller: 0,
    loginMessage: null,
};
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case actionTypes.LOGIN_LOADING: {
            return {
                ...state,
                loginLoading: true,
                loginFailed: false,
                loginError: false,
                loginMessage: null
            };
        };
        case actionTypes.LOGIN_SUCCESS: {
            let { is_buyer, is_seller, msg, status } = action.payload
            return {
                ...state,
                loginLoading: false,
                loginFailed: false,
                loginError: status,
                loginMessage: msg,
                is_buyer,
                is_seller
            };
        };
        case actionTypes.LOGIN_FAILURE: {
            const { msg } = action.payload;
            return {
                ...state,
                loginLoading: false,
                loginFailed: true,
                loginError: false,
                loginMessage: msg
            };
        };
        case actionTypes.LOGIN_REJECT: {
            return {
                ...state,
                loginLoading: false,
                loginFailed: false,
                loginError: true,
                loginMessage: null
            };
        };
        default:
            return state
    }
};