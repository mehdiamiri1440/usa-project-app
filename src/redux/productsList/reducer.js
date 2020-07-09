import actionTypes from './actionTypes';
const INITIAL_STATE = {
    productsListLoading: false,
    productsListFailed: false,
    productsListError: false,
    productsListMessage: null,
    productsListObject: {},
    productsListArray: [],


    relatedProductsLoading: false,
    relatedProductsFailed: false,
    relatedProductsError: false,
    relatedProductsMessage: null,
    relatedProductsObject: {},
    relatedProductsArray: [],

    myProductsLoading: false,
    myProductsFailed: false,
    myProductsError: false,
    myProductsMessage: null,
    myProductsObject: {},
    myProductsArray: [],

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

    productDetailsStatus: null,
    productDetails: {},
    productDetailsLoading: false,
    productDetailsFailed: false,
    productDetailsError: false,
    productDetailsMessage: null,

    productDetailsId: null

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




        case actionTypes.FETCH_ALL_RELATED_PRODUCTS_LIST_LOADING: {
            return {
                ...state,
                relatedProductsObject: {},
                relatedProductsArray: [],
                relatedProductsLoading: true,
                relatedProductsFailed: false,
                relatedProductsError: false,
                relatedProductsMessage: null
            };
        };
        case actionTypes.FETCH_ALL_RELATED_PRODUCTS_LIST_SUCCESSFULLY: {
            return {
                ...state,
                relatedProductsObject: { ...action.payload },
                relatedProductsArray: [...action.payload.related_products],
                relatedProductsLoading: false,
                relatedProductsFailed: false,
                relatedProductsError: false,
                relatedProductsMessage: null,
            };
        };
        case actionTypes.FETCH_ALL_RELATED_PRODUCTS_LIST_FAILED: {
            const { msg } = action.payload;
            return {
                ...state,
                relatedProductsObject: {},
                relatedProductsArray: [],
                relatedProductsLoading: false,
                relatedProductsFailed: true,
                relatedProductsError: false,
                relatedProductsMessage: null
            };
        };
        case actionTypes.FETCH_ALL_RELATED_PRODUCTS_LIST_REJECT: {
            return {
                ...state,
                relatedProductsObject: {},
                relatedProductsArray: [],
                relatedProductsLoading: false,
                relatedProductsFailed: false,
                relatedProductsError: true,
                relatedProductsMessage: null
            };
        };



        case actionTypes.FETCH_ALL_MY_PRODUCTS_LOADING: {
            return {
                ...state,
                myProductsObject: {},
                myProductsArray: [],
                myProductsLoading: true,
                myProductsFailed: false,
                myProductsError: false,
                myProductsMessage: null
            };
        };
        case actionTypes.FETCH_ALL_MY_PRODUCTS_SUCCESSFULLY: {
            return {
                ...state,
                myProductsObject: { ...action.payload },
                myProductsArray: [...action.payload.products],
                myProductsLoading: false,
                myProductsFailed: false,
                myProductsError: false,
                myProductsMessage: null,
            };
        };
        case actionTypes.FETCH_ALL_MY_PRODUCTS_FAILED: {
            const { msg } = action.payload;
            return {
                ...state,
                myProductsObject: {},
                myProductsArray: [],
                myProductsLoading: false,
                myProductsFailed: true,
                myProductsError: false,
                myProductsMessage: null
            };
        };
        case actionTypes.FETCH_ALL_MY_PRODUCTS_REJECT: {
            return {
                ...state,
                myProductsObject: {},
                myProductsArray: [],
                myProductsLoading: false,
                myProductsFailed: false,
                myProductsError: true,
                myProductsMessage: null
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



        case actionTypes.FETCH_PRODUCT_DETAILS_LOADING: {
            return {
                ...state,
                productDetailsStatus: action.payload.status,
                productDetails: {},
                productDetailsLoading: true,
                productDetailsFailed: false,
                productDetailsError: false,
                productDetailsMessage: null,
            };
        };
        case actionTypes.FETCH_PRODUCT_DETAILS_SUCCESSFULLY: {
            return {
                ...state,
                productDetailsStatus: action.payload.status,
                productDetails: { ...action.payload.product },
                productDetailsLoading: false,
                productDetailsFailed: false,
                productDetailsError: false,
                productDetailsMessage: action.payload.msg,
            };
        };
        case actionTypes.FETCH_PRODUCT_DETAILS_FAILED: {
            const { msg } = action.payload;
            return {
                ...state,
                productDetailsLoading: false,
                productDetailsStatus: action.payload.status,
                productDetails: {},
                productDetailsFailed: true,
                productDetailsError: false,
                productDetailsMessage: null
            };
        };
        case actionTypes.FETCH_PRODUCT_DETAILS_REJECT: {
            return {
                ...state,
                productDetailsStatus: action.payload.status,
                productDetails: {},
                productDetailsLoading: false,
                productDetailsFailed: false,
                productDetailsError: true,
                productDetailsMessage: 'محصول موجود نیست و یا  قبلا حذف شده‌است'
            };
        };


        case actionTypes.SET_PRODUCT_DETAILS_ID_LOADING: {
            return {
                ...state,
                productDetailsId: null
            };
        };
        case actionTypes.SET_PRODUCT_DETAILS_ID_SUCCESSFULLY: {
            return {
                ...state,
                productDetailsId: action.payload
            };
        };
        case actionTypes.SET_PRODUCT_DETAILS_ID_FAILED: {
            return {
                ...state,
                productDetailsId: null
            };
        };
        case actionTypes.SET_PRODUCT_DETAILS_ID_REJECT: {
            return {
                ...state,
                productDetailsId: null
            };
        };


        default:
            return state
    }
};