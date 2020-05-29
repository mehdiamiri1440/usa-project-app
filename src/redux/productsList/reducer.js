import actionTypes from './actionTypes';
const INITIAL_STATE = {
    productsListLoading: false,
    productsListFailed: false,
    productsListError: false,
    productsListMessage: null,
    productsListObject: {},
    productsListArray: [],
};
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {


        case actionTypes.FETCH_ALL_PRODUCTS_LIST_LOADING: {
            return {
                ...state,
                productsListObject: {},
                productsListArray: [],
                productsListLoading: true,
                productsListFailed: false,
                productsListError: false,
                productsListMessage: null
            };
        };
        case actionTypes.FETCH_ALL_PRODUCTS_LIST_SUCCESSFULLY: {
            return {
                ...state,
                productsListObject: {...action.payload},
                productsListArray: [...action.payload.products],
                productsListLoading: false,
                productsListFailed: false,
                productsListError: false,
                productsListMessage: null,
            };
        };
        case actionTypes.FETCH_ALL_PRODUCTS_LIST_FAILED: {
            const { msg } = action.payload;
            return {
                ...state,
                productsListObject: {},
                productsListArray: [],
                productsListLoading: false,
                productsListFailed: true,
                productsListError: false,
                productsListMessage: null
            };
        };
        case actionTypes.FETCH_ALL_PRODUCTS_LIST_REJECT: {
            return {
                ...state,
                productsListObject: {},
                productsListArray:[],
                productsListLoading: false,
                productsListFailed: false,
                productsListError: true,
                productsListMessage: null
            };
        };


        default:
            return state
    }
};