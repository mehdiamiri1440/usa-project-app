import actionTypes from './actionTypes';
const INITIAL_STATE = {
    buyAdRequestLoading: false,
    buyAdRequestFailed: false,
    buyAdRequestError: false,
    buyAdRequestMessage: null,
    buyAdRequestList: [],
    buyAdRequest: {},

};
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {


        case actionTypes.FETCH_BUYAD_REQUEST_LOADING: {
            return {
                ...state,
                buyAdRequestList: [],
                buyAdRequest: {},
                buyAdRequestLoading: true,
                buyAdRequestFailed: false,
                buyAdRequestError: false,
                buyAdRequestMessage: null
            };
        };
        case actionTypes.FETCH_BUYAD_REQUEST_SUCCESSFULLY: {
            let { msg = '' } = action.payload
            return {
                ...state,
                buyAdRequestList: [...action.payload.buyAds],
                buyAdRequest: { ...action.payload },
                buyAdRequestLoading: false,
                buyAdRequestFailed: false,
                buyAdRequestError: false,
                buyAdRequestMessage: msg,
            };
        };
        case actionTypes.FETCH_BUYAD_REQUEST_FAILED: {
            const { msg = '' } = action.payload;
            return {
                ...state,
                buyAdRequestList: [],
                buyAdRequest: {},
                buyAdRequestLoading: false,
                buyAdRequestFailed: true,
                buyAdRequestError: false,
                buyAdRequestMessage: msg
            };
        };
        case actionTypes.FETCH_BUYAD_REQUEST_REJECT: {
            return {
                ...state,
                buyAdRequestList: [],
                buyAdRequest: {},
                buyAdRequestLoading: false,
                buyAdRequestFailed: false,
                buyAdRequestError: true,
                buyAdRequestMessage: ''
            };
        };

        default:
            return state
    }
};