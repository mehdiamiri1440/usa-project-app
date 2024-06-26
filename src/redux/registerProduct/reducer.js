import actionTypes from './actionTypes';
const INITIAL_STATE = {
    categoriesLoading: false,
    categoriesFailed: false,
    categoriesError: false,
    categoriesMessage: null,
    categoriesList: [],
    categories: {},


    addNewProductLoading: false,
    addNewProductFailed: false,
    addNewProductError: false,
    addNewProductMessage: [],

    userPermissionToRegisterProductLoading: false,
    userPermissionToRegisterProductFailed: false,
    userPermissionToRegisterProductError: false,
    userPermissionToRegisterProductMessage: null,
    isUserLimitedToRegisterProduct: false,
    userPermissionToRegisterProductStatus: false,

    buyAdsAfterPaymentLoading: false,
    buyAdsAfterPaymentFailed: false,
    buyAdsAfterPaymentError: false,
    buyAdsAfterPaymentMessage: [],
    buyAdsAfterPaymentList: [],

    registerBuyAdRequestLoading: false,
    registerBuyAdRequestFailed: false,
    registerBuyAdRequestError: false,
    registerBuyAdRequestMessage: [],

    subCategoriesLoading: false,
    subCategoriesFailed: false,
    subCategoriesError: false,
    subCategoriesMessage: null,
    subCategoriesList: [],
    subCategories: {},

    subCategoryId: null,
    subCategoryName: null,

    products: [],
    product: {},
    buyAds: [],

    resetTab: false,
    resetrRegisterRequestTab: false
};
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {


        case actionTypes.FETCH_ALL_CATEGORIES_LOADING: {
            return {
                ...state,
                categoriesList: [],
                categories: {},
                categoriesLoading: true,
                categoriesFailed: false,
                categoriesError: false,
                categoriesMessage: null
            };
        };
        case actionTypes.FETCH_ALL_CATEGORIES_SUCCESSFULLY: {
            const {
                payload = {}
            } = action;

            const {
                msg = '',
            } = payload;

            const categories = payload.categories.filter(item => item.parent_id == null);

            return {
                ...state,
                categoriesList: [...categories],
                categories: { ...payload },
                categoriesLoading: false,
                categoriesFailed: false,
                categoriesError: false,
                categoriesMessage: msg,
            };
        };
        case actionTypes.FETCH_ALL_CATEGORIES_FAILED: {
            const { msg = '' } = action.payload;
            return {
                ...state,
                categoriesList: [],
                categories: {},
                categoriesLoading: false,
                categoriesFailed: true,
                categoriesError: false,
                categoriesMessage: msg
            };
        };
        case actionTypes.FETCH_ALL_CATEGORIES_REJECT: {
            return {
                ...state,
                categoriesList: [],
                categories: {},
                categoriesLoading: false,
                categoriesFailed: false,
                categoriesError: true,
                categoriesMessage: ''
            };
        };


        case actionTypes.FETCH_ALL_SUB_CATEGORIES_LOADING: {
            return {
                ...state,
                subCategoriesList: [],
                subCategories: {},
                subCategoriesLoading: true,
                subCategoriesFailed: false,
                subCategoriesError: false,
                subCategoriesMessage: null
            };
        };
        case actionTypes.FETCH_ALL_SUB_CATEGORIES_SUCCESSFULLY: {
            let { msg = '', status = true } = action.payload
            return {
                ...state,
                subCategoriesList: [...action.payload.categories],
                subCategories: { ...action.payload },
                subCategoriesLoading: false,
                subCategoriesFailed: false,
                subCategoriesError: false,
                subCategoriesMessage: msg,
            };
        };
        case actionTypes.FETCH_ALL_SUB_CATEGORIES_FAILED: {
            let { msg = '' } = action.payload
            return {
                ...state,
                subCategoriesList: [],
                subCategories: {},
                subCategoriesLoading: false,
                subCategoriesFailed: true,
                subCategoriesError: false,
                subCategoriesMessage: msg
            };
        };
        case actionTypes.FETCH_ALL_SUB_CATEGORIES_REJECT: {
            return {
                ...state,
                subCategoriesList: [],
                subCategories: {},
                subCategoriesLoading: false,
                subCategoriesFailed: false,
                subCategoriesError: true,
                subCategoriesMessage: ''
            };
        };




        case actionTypes.ADD_NEW_PRODUCT_LOADING: {
            return {
                ...state,
                addNewProductLoading: true,
                addNewProductFailed: false,
                buyAdsAfterPaymentList: [],
                addNewProductError: false,
                addNewProductMessage: [],
                product: {},
                buyAds: []
            };
        };
        case actionTypes.ADD_NEW_PRODUCT_SUCCESSFULLY: {
            let { buyAds = [], product = {} } = action.payload;
            return {
                ...state,
                addNewProductLoading: false,
                addNewProductFailed: false,
                addNewProductError: false,
                addNewProductMessage: [],
                buyAdsAfterPaymentList: [],
                product,
                buyAds
            };
        };
        case actionTypes.ADD_NEW_PRODUCT_FAILED: {
            let { msg = '' } = action.payload
            return {
                ...state,
                addNewProductLoading: false,
                addNewProductFailed: true,
                addNewProductError: false,
                addNewProductMessage: [],
                buyAdsAfterPaymentList: [],
                product: {},
                buyAds: []
            };
        };
        case actionTypes.ADD_NEW_PRODUCT_REJECT: {
            const { data = {} } = action.payload;
            const { errors = {} } = data;
            const errorsArray = Object.values(errors);

            return {
                ...state,
                addNewProductLoading: false,
                buyAdsAfterPaymentList: [],
                addNewProductFailed: false,
                addNewProductError: true,
                addNewProductMessage: errorsArray && errorsArray.length ? errorsArray : ['خطای سرور'],
                product: {},
                buyAds: []
            };
        };



        case actionTypes.CHECK_USER_PERMISSION_TO_REGISTER_PRODUCT_LOADING: {
            return {
                ...state,
                userPermissionToRegisterProductLoading: true,
                userPermissionToRegisterProductFailed: false,
                userPermissionToRegisterProductError: false,
                userPermissionToRegisterProductMessage: null,
                isUserLimitedToRegisterProduct: false,
                userPermissionToRegisterProductStatus: false,
                addNewProductLoading: false,
                addNewProductFailed: false,
                buyAdsAfterPaymentList: [],
                addNewProductError: false,
                addNewProductMessage: [],
                product: {},
                buyAds: []
            };
        };
        case actionTypes.CHECK_USER_PERMISSION_TO_REGISTER_PRODUCT_SUCCESSFULLY: {
            let { msg = '', status = true, is_limit = true } = action.payload
            return {
                ...state,
                userPermissionToRegisterProductLoading: false,
                userPermissionToRegisterProductFailed: false,
                userPermissionToRegisterProductError: false,
                userPermissionToRegisterProductMessage: msg,
                isUserLimitedToRegisterProduct: is_limit,
                userPermissionToRegisterProductStatus: status
            };
        };
        case actionTypes.CHECK_USER_PERMISSION_TO_REGISTER_PRODUCT_FAILED: {
            let { msg = '' } = action.payload
            return {
                ...state,
                userPermissionToRegisterProductLoading: false,
                userPermissionToRegisterProductFailed: true,
                userPermissionToRegisterProductError: false,
                userPermissionToRegisterProductMessage: msg,
                isUserLimitedToRegisterProduct: false,
                userPermissionToRegisterProductStatus: false
            };
        };
        case actionTypes.CHECK_USER_PERMISSION_TO_REGISTER_PRODUCT_REJECT: {
            return {
                ...state,
                userPermissionToRegisterProductLoading: false,
                userPermissionToRegisterProductFailed: false,
                userPermissionToRegisterProductError: true,
                userPermissionToRegisterProductMessage: '',
                isUserLimitedToRegisterProduct: false,
                userPermissionToRegisterProductStatus: false
            };
        };



        case actionTypes.REGISTER_BUYAD_REQUEST_LOADING: {
            return {
                ...state,
                registerBuyAdRequestLoading: true,
                registerBuyAdRequestFailed: false,
                registerBuyAdRequestError: false,
                registerBuyAdRequestMessage: [],
                products: [],
                registerBuyAdRequest: {}
            };
        };
        case actionTypes.REGISTER_BUYAD_REQUEST_SUCCESSFULLY: {
            let { msg = '', products = [] } = action.payload
            return {
                ...state,
                registerBuyAdRequestLoading: false,
                registerBuyAdRequestFailed: false,
                registerBuyAdRequestError: false,
                registerBuyAdRequestMessage: [],
                products,
                registerBuyAdRequest: { ...action.payload }
            };
        };
        case actionTypes.REGISTER_BUYAD_REQUEST_FAILED: {
            return {
                ...state,
                registerBuyAdRequestLoading: false,
                registerBuyAdRequestFailed: true,
                registerBuyAdRequestError: false,
                registerBuyAdRequestMessage: [],
                registerBuyAdRequest: {},
                products: []
            };
        };
        case actionTypes.REGISTER_BUYAD_REQUEST_REJECT: {
            const { response = {} } = action.payload;
            const { data = {} } = response;
            const { errors = {} } = data;
            const errorsArray = Object.values(errors);

            return {
                ...state,
                products: [],
                registerBuyAdRequestLoading: false,
                registerBuyAdRequestFailed: false,
                registerBuyAdRequestError: true,
                registerBuyAdRequestMessage: errorsArray && errorsArray.length ? errorsArray : ['خطای سرور'],
                registerBuyAdRequest: {}
            };
        };



        case actionTypes.BUYADS_AFTER_PAYMENT_LOADING: {
            return {
                ...state,
                buyAdsAfterPaymentLoading: true,
                buyAdsAfterPaymentFailed: false,
                buyAdsAfterPaymentError: false,
                buyAdsAfterPaymentMessage: [],
                buyAdsAfterPaymentList: [],
                buyAdsAfterPayment: {}
            };
        };
        case actionTypes.BUYADS_AFTER_PAYMENT_SUCCESSFULLY: {
            let { msg = '', products = [] } = action.payload
            return {
                ...state,
                buyAdsAfterPaymentLoading: false,
                buyAdsAfterPaymentFailed: false,
                buyAdsAfterPaymentError: false,
                buyAdsAfterPaymentMessage: [],
                buyAdsAfterPaymentList: [...action.payload.buyAds],
                buyAdsAfterPayment: { ...action.payload }
            };
        };
        case actionTypes.BUYADS_AFTER_PAYMENT_FAILED: {
            let { msg = '' } = action.payload
            return {
                ...state,
                buyAdsAfterPaymentLoading: false,
                buyAdsAfterPaymentFailed: true,
                buyAdsAfterPaymentError: false,
                buyAdsAfterPaymentMessage: [],
                buyAdsAfterPayment: {},
                buyAdsAfterPaymentList: []
            };
        };
        case actionTypes.BUYADS_AFTER_PAYMENT_REJECT: {
            const { response = {} } = action.payload;
            const { data = {} } = response;
            const { errors = {} } = data;
            const errorsArray = Object.values(errors);

            return {
                ...state,
                buyAdsAfterPaymentList: [],
                buyAdsAfterPaymentLoading: false,
                buyAdsAfterPaymentFailed: false,
                buyAdsAfterPaymentError: true,
                buyAdsAfterPaymentMessage: errorsArray && errorsArray.length ? errorsArray : ['خطای سرور'],
                buyAdsAfterPayment: {}
            };
        };


        case actionTypes.SET_PRODUCT_ID_FROM_REGISTER_PRODUCT: {
            return {
                ...state,
                subCategoryId: action.payload.id,
                subCategoryName: action.payload.name
            }
        }

        case actionTypes.RESET_REGISTER_PRODUCT_TAB: {
            return {
                ...state,
                resetTab: action.payload.resetTab,
                addNewProductLoading: false,
                addNewProductFailed: false,
                buyAdsAfterPaymentList: [],
                addNewProductError: false,
                addNewProductMessage: [],
                product: {},
                buyAds: []
            }
        }

        case actionTypes.RESET_REGISTER_REQUEST_TAB: {
            return {
                ...state,
                resetrRegisterRequestTab: action.payload.resetTab,
            }
        }
        default:
            return state
    }
};