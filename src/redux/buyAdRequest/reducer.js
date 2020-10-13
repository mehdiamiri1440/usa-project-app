import actionTypes from './actionTypes';
const INITIAL_STATE = {
    buyAdRequestLoading: false,
    buyAdRequestFailed: false,
    buyAdRequestError: false,
    buyAdRequestMessage: null,
    buyAdRequestList: [],
    buyAdRequest: {},

    relatedBuyAdRequestsLoading: false,
    relatedBuyAdRequestsFailed: false,
    relatedBuyAdRequestsError: false,
    relatedBuyAdRequestsMessage: null,
    relatedBuyAdRequestsList: [],
    relatedBuyAdRequests: {},

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


        case actionTypes.FETCH_RELATED_BUYAD_REQUESTS_LOADING: {
            return {
                ...state,
                relatedBuyAdRequestsList: [],
                relatedBuyAdRequests: {},
                relatedBuyAdRequestsLoading: true,
                relatedBuyAdRequestsFailed: false,
                relatedBuyAdRequestsError: false,
                relatedBuyAdRequestsMessage: null
            };
        };
        case actionTypes.FETCH_RELATED_BUYAD_REQUESTS_SUCCESSFULLY: {
            let { msg = '' } = action.payload
            return {
                ...state,
                relatedBuyAdRequestsList: [...action.payload.buyAds],
                relatedBuyAdRequests: { ...action.payload },
                relatedBuyAdRequestsLoading: false,
                relatedBuyAdRequestsFailed: false,
                relatedBuyAdRequestsError: false,
                relatedBuyAdRequestsMessage: msg,
            };
        };
        case actionTypes.FETCH_RELATED_BUYAD_REQUESTS_FAILED: {
            const { msg = '' } = action.payload;
            return {
                ...state,
                relatedBuyAdRequestsList: [],
                relatedBuyAdRequests: {},
                relatedBuyAdRequestsLoading: false,
                relatedBuyAdRequestsFailed: true,
                relatedBuyAdRequestsError: false,
                relatedBuyAdRequestsMessage: msg
            };
        };
        case actionTypes.FETCH_RELATED_BUYAD_REQUESTS_REJECT: {
            return {
                ...state,
                relatedBuyAdRequestsList: [],
                relatedBuyAdRequests: {},
                relatedBuyAdRequestsLoading: false,
                relatedBuyAdRequestsFailed: false,
                relatedBuyAdRequestsError: true,
                relatedBuyAdRequestsMessage: ''
            };
        };

        default:
            return state
    }
};