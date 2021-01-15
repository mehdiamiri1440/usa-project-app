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
    goldenBuyAdsList: [],
    relatedBuyAdRequests: {},

    myRequestsLoading: false,
    myRequestsFailed: false,
    myRequestsError: false,
    myRequestsMessage: null,
    myRequestsList: [],
    myRequests: {},

    deleteBuyAdLoading: false,
    deleteBuyAdFailed: false,
    deleteBuyAdError: false,
    deleteBuyAdMessage: null,
    deleteBuyAd: {},

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
                goldenBuyAdsList: [],
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
                goldenBuyAdsList: [...action.payload.golden_buyAds] || [],
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
                goldenBuyAdsList: [],
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
                goldenBuyAdsList: [],
                relatedBuyAdRequests: {},
                relatedBuyAdRequestsLoading: false,
                relatedBuyAdRequestsFailed: false,
                relatedBuyAdRequestsError: true,
                relatedBuyAdRequestsMessage: ''
            };
        };


        case actionTypes.FETCH_MY_REQUESTS_LOADING: {
            return {
                ...state,
                myRequestsList: [],
                myRequests: {},
                myRequestsLoading: true,
                myRequestsFailed: false,
                myRequestsError: false,
                myRequestsMessage: null
            };
        };
        case actionTypes.FETCH_MY_REQUESTS_SUCCESSFULLY: {
            let { msg = '' } = action.payload
            return {
                ...state,
                myRequestsList: [...action.payload.buyAds],
                myRequests: { ...action.payload },
                myRequestsLoading: false,
                myRequestsFailed: false,
                myRequestsError: false,
                myRequestsMessage: msg,
            };
        };
        case actionTypes.FETCH_MY_REQUESTS_FAILED: {
            const { msg = '' } = action.payload;
            return {
                ...state,
                myRequestsList: [],
                myRequests: {},
                myRequestsLoading: false,
                myRequestsFailed: true,
                myRequestsError: false,
                myRequestsMessage: msg
            };
        };
        case actionTypes.FETCH_MY_REQUESTS_REJECT: {
            return {
                ...state,
                myRequestsList: [],
                myRequests: {},
                myRequestsLoading: false,
                myRequestsFailed: false,
                myRequestsError: true,
                myRequestsMessage: ''
            };
        };

        case actionTypes.DELETE_BUYAD_LOADING: {
            return {
                ...state,
                deleteBuyAd: {},
                deleteBuyAdLoading: true,
                deleteBuyAdFailed: false,
                deleteBuyAdError: false,
                deleteBuyAdMessage: null
            };
        };
        case actionTypes.DELETE_BUYAD_SUCCESSFULLY: {
            let { msg = '' } = action.payload
            return {
                ...state,
                deleteBuyAd: { ...action.payload },
                deleteBuyAdLoading: false,
                deleteBuyAdFailed: false,
                deleteBuyAdError: false,
                deleteBuyAdMessage: msg,
            };
        };
        case actionTypes.DELETE_BUYAD_FAILED: {
            const { msg = '' } = action.payload;
            return {
                ...state,
                deleteBuyAd: {},
                deleteBuyAdLoading: false,
                deleteBuyAdFailed: true,
                deleteBuyAdError: false,
                deleteBuyAdMessage: msg
            };
        };
        case actionTypes.DELETE_BUYAD_REJECT: {
            return {
                ...state,
                deleteBuyAd: {},
                deleteBuyAdLoading: false,
                deleteBuyAdFailed: false,
                deleteBuyAdError: true,
                deleteBuyAdMessage: ''
            };
        };

        default:
            return state
    }
};