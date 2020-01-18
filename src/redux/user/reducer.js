import actionTypes from './actionTypes';
const INITIAL_STATE = {
    loading: false,
    failed: false,
    error: false,
    message: null
};
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case actionTypes.FETCH_USERS_SUCCESSY: {
            return {
                ...state,
                loading: action.payload
            }
        }
        default:
            return state
    }
};