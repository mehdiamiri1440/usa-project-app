import actionTypes from './actionTypes';
const INITIAL_STATE = {
    loginLoading: false,
    loginFailed: false,
    loginError: false,
    firstName: '',
    lastName: '',
    loginMessage: null,
};
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case actionTypes.LOGIN_LOADING:
            return {
                ...state,
                loginLoading: true,
                loginFailed: false,
                loginError: false,
                loginMessage: null
            };
        case actionTypes.LOGIN_SUCCESS:
            const { firstName, lastName } = action.payload;
            return {
                ...state,
                loginLoading: false,
                loginFailed: false,
                loginError: false,
                loginMessage: null,
                firstName,
                lastName
            };
        case actionTypes.LOGIN_FAILURE:
            const { message } = action.payload;
            return {
                ...state,
                loginLoading: false,
                loginFailed: true,
                loginError: false,
                loginMessage: message
            };
        case actionTypes.LOGIN_REJECT:
            return {
                ...state,
                loginLoading: false,
                loginFailed: false,
                loginError: true,
                loginMessage: null
            };
        default:
            return state
    }
};