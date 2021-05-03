import actionTypes from './actionTypes';
const INITIAL_STATE = {
    productsListLoading: false,
    productsListFailed: false,
    productsListError: false,
    productsListMessage: null,
    productsListObject: {},
    productsListArray: [],

    specialProductsListLoading: false,
    specialProductsListFailed: false,
    specialProductsListError: false,
    specialProductsListMessage: null,
    specialProductsListObject: {},
    specialProductsListArray: [],


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


    productDetailsInfoLoading: false,
    productDetailsInfo: [],
    productDetailsInfoFailed: false,
    productDetailsInfoError: false,
    productDetailsInfoMessage: null,

    updateProductsListFlag: false,


    sellerMobileNumberLoading: false,
    sellerMobileNumberFailed: false,
    sellerMobileNumberError: false,
    sellerMobileNumberMessage: null,
    sellerMobileNumber: {},
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
            const { msg = '' } = action.payload;
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




        case actionTypes.FETCH_ALL_SPECIAL_PRODUCTS_LIST_LOADING: {
            return {
                ...state,
                specialProductsListObject: {},
                specialProductsListArray: [],
                specialProductsListLoading: true,
                specialProductsListFailed: false,
                specialProductsListError: false,
                specialProductsListMessage: null
            };
        };
        case actionTypes.FETCH_ALL_SPECIAL_PRODUCTS_LIST_SUCCESSFULLY: {
            return {
                ...state,
                specialProductsListObject: { ...action.payload },
                specialProductsListArray: [...action.payload.products],
                specialProductsListLoading: false,
                specialProductsListFailed: false,
                specialProductsListError: false,
                specialProductsListMessage: null,
            };
        };
        case actionTypes.FETCH_ALL_SPECIAL_PRODUCTS_LIST_FAILED: {
            const { msg = '' } = action.payload;
            return {
                ...state,
                specialProductsListObject: {},
                specialProductsListArray: [],
                specialProductsListLoading: false,
                specialProductsListFailed: true,
                specialProductsListError: false,
                specialProductsListMessage: null
            };
        };
        case actionTypes.FETCH_ALL_SPECIAL_PRODUCTS_LIST_REJECT: {
            return {
                ...state,
                specialProductsListObject: {},
                specialProductsListArray: [],
                specialProductsListLoading: false,
                specialProductsListFailed: false,
                specialProductsListError: true,
                specialProductsListMessage: null
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
            const { msg = '' } = action.payload;
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
            const { msg = '' } = action.payload;
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
            const { msg = '' } = action.payload;
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
            const { msg = '' } = action.payload;
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
            const { msg = '' } = action.payload;
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


        case actionTypes.FETCH_ALL_PRODUCT_DETAILS_INFO_LOADING: {
            return {
                ...state,
                productDetailsInfoLoading: true,
                productDetailsInfo: [],
                productDetailsInfoFailed: false,
                productDetailsInfoError: false,
                productDetailsInfoMessage: null
            };
        };
        case actionTypes.FETCH_ALL_PRODUCT_DETAILS_INFO_SUCCESSFULLY: {
            return {
                ...state,
                productDetailsInfoLoading: false,
                productDetailsInfo: [...action.payload],
                productDetailsInfoFailed: false,
                productDetailsInfoError: false,
                productDetailsInfoMessage: null
            };
        };
        case actionTypes.FETCH_ALL_PRODUCT_DETAILS_INFO_FAILED: {
            return {
                ...state,
                productDetailsInfoLoading: false,
                productDetailsInfo: [],
                productDetailsInfoFailed: true,
                productDetailsInfoError: false,
                productDetailsInfoMessage: null
            };
        };
        case actionTypes.FETCH_ALL_PRODUCT_DETAILS_INFO_REJECT: {
            return {
                ...state,
                productDetailsInfoLoading: false,
                productDetailsInfo: [],
                productDetailsInfoFailed: false,
                productDetailsInfoError: true,
                productDetailsInfoMessage: null
            };
        };

        case actionTypes.UPDATE_PRODUCTS_LIST: {
            return {
                ...state,
                updateProductsListFlag: action.payload
            };
        };


        case actionTypes.FETCH_SELLER_MOBILE_NUMBER_LOADING: {
            return {
                ...state,
                sellerMobileNumber: {},
                sellerMobileNumberLoading: true,
                sellerMobileNumberFailed: false,
                sellerMobileNumberError: false,
                sellerMobileNumberMessage: null
            };
        };
        case actionTypes.FETCH_SELLER_MOBILE_NUMBER_SUCCESSFULLY: {
            let { msg = '' } = action.payload
            return {
                ...state,
                sellerMobileNumber: { ...action.payload },
                sellerMobileNumberLoading: false,
                sellerMobileNumberFailed: false,
                sellerMobileNumberError: false,
                sellerMobileNumberMessage: msg,
            };
        };
        case actionTypes.FETCH_SELLER_MOBILE_NUMBER_FAILED: {
            const { msg = '' } = action.payload;
            return {
                ...state,
                sellerMobileNumber: {},
                sellerMobileNumberLoading: false,
                sellerMobileNumberFailed: true,
                sellerMobileNumberError: false,
                sellerMobileNumberMessage: msg
            };
        };
        case actionTypes.FETCH_SELLER_MOBILE_NUMBER_REJECT: {
            return {
                ...state,
                sellerMobileNumber: {},
                sellerMobileNumberLoading: false,
                sellerMobileNumberFailed: false,
                sellerMobileNumberError: true,
                sellerMobileNumberMessage: ''
            };
        };

        default:
            return state
    }
};