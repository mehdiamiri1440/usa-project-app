import actionTypes from './actionTypes';
const INITIAL_STATE = {
    uploadPercentage: 0
};
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case actionTypes.FETCH_UPLOAD_PERCENTAGE: {
            return {
                ...state,
                uploadPercentage: action.payload
            };
        };
        default:
            return state
    }
};