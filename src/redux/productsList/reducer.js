import actionTypes from './actionTypes';
const INITIAL_STATE = {
    productsListLoading: false,
    productsListFailed: false,
    productsListError: false,
    productsListMessage: null,
    productsListObject: {},
    productsListArray: [],

    editProductLoading: false,
    editProductFailed: false,
    editProductError: false,
    editProductStatus: null,
    editProductMessage: null,

    deleteProductStatus: null,
    deleteProductLoading: false,
    deleteProductFailed: false,
    deleteProductError: false,
    deleteProductMessage: null,
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
                productsListObject: { ...action.payload },
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
                productsListArray: [],
                productsListLoading: false,
                productsListFailed: false,
                productsListError: true,
                productsListMessage: null
            };
        };


        case actionTypes.EDIT_PRODUCT_LOADING: {
            return {
                ...state,
                editProductLoading: true,
                editProductFailed: false,
                editProductStatus: null,
                editProductError: false,
                editProductMessage: null
            };
        };
        case actionTypes.EDIT_PRODUCT_SUCCESSFULLY: {
            return {
                ...state,
                editProductLoading: false,
                editProductFailed: false,
                editProductError: false,
                editProductStatus: action.payload.status,
                editProductMessage: action.payload.msg,
            };
        };
        case actionTypes.EDIT_PRODUCT_FAILED: {
            const { msg } = action.payload;
            return {
                ...state,
                editProductLoading: false,
                editProductFailed: true,
                editProductError: false,
                editProductMessage: null,
                editProductStatus: null
            };
        };
        case actionTypes.EDIT_PRODUCT_REJECT: {
            return {
                ...state,
                editProductLoading: false,
                editProductFailed: false,
                editProductError: true,
                editProductMessage: action.payload.msg,
                editProductStatus: action.payload.status
            };
        };



        case actionTypes.DELETE_PRODUCT_LOADING: {
            return {
                ...state,
                deleteProductStatus: null,
                deleteProductLoading: true,
                deleteProductFailed: false,
                deleteProductError: false,
                deleteProductMessage: null
            };
        };
        case actionTypes.DELETE_PRODUCT_SUCCESSFULLY: {
            return {
                ...state,
                deleteProductStatus: action.payload.status,
                deleteProductLoading: false,
                deleteProductFailed: false,
                deleteProductError: false,
                deleteProductMessage: action.payload.msg,
            };
        };
        case actionTypes.DELETE_PRODUCT_FAILED: {
            const { msg } = action.payload;
            return {
                ...state,
                deleteProductLoading: false,
                deleteProductStatus: null,
                deleteProductFailed: true,
                deleteProductError: false,
                deleteProductMessage: null
            };
        };
        case actionTypes.DELETE_PRODUCT_REJECT: {
            return {
                ...state,
                deleteProductLoading: false,
                deleteProductStatus: false,
                deleteProductFailed: false,
                deleteProductError: true,
                deleteProductMessage: 'محصول موجود نیست و یا  قبلا حذف شده‌است'
            };
        };


        default:
            return state
    }
};