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

    registerBuyAdRequestLoading: false,
    registerBuyAdRequestFailed: false,
    registerBuyAdRequestError: false,
    registerBuyAdRequestMessage: null,
    products: [],

    subCategoriesLoading: false,
    subCategoriesFailed: false,
    subCategoriesError: false,
    subCategoriesMessage: null,
    subCategoriesList: [],
    subCategories: {},

    subCategoryId: null,
    subCategoryName: null,
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
            let { msg = '', status = true } = action.payload
            return {
                ...state,
                categoriesList: [...action.payload.categories],
                categories: { ...action.payload },
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
                addNewProductError: false,
                addNewProductMessage: []
            };
        };
        case actionTypes.ADD_NEW_PRODUCT_SUCCESSFULLY: {
            let { msg = '', status = true } = action.payload
            return {
                ...state,
                addNewProductLoading: false,
                addNewProductFailed: false,
                addNewProductError: false,
                addNewProductMessage: [],
            };
        };
        case actionTypes.ADD_NEW_PRODUCT_FAILED: {
            let { msg = '' } = action.payload
            return {
                ...state,
                addNewProductLoading: false,
                addNewProductFailed: true,
                addNewProductError: false,
                addNewProductMessage: []
            };
        };
        case actionTypes.ADD_NEW_PRODUCT_REJECT: {
            const { data = {} } = action.payload;
            const { errors = {} } = data;
            const errorsArray = Object.values(errors);

            return {
                ...state,
                addNewProductLoading: false,
                addNewProductFailed: false,
                addNewProductError: true,
                addNewProductMessage: errorsArray
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
                userPermissionToRegisterProductStatus: false
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
                registerBuyAdRequestMessage: null,
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
                registerBuyAdRequestMessage: msg,
                products,
                registerBuyAdRequest: { ...action.payload }
            };
        };
        case actionTypes.REGISTER_BUYAD_REQUEST_FAILED: {
            let { msg = '' } = action.payload
            return {
                ...state,
                registerBuyAdRequestLoading: false,
                registerBuyAdRequestFailed: true,
                registerBuyAdRequestError: false,
                registerBuyAdRequestMessage: msg,
                registerBuyAdRequest: {},
                products: []
            };
        };
        case actionTypes.REGISTER_BUYAD_REQUEST_REJECT: {
            return {
                ...state,
                products: [],
                registerBuyAdRequestLoading: false,
                registerBuyAdRequestFailed: false,
                registerBuyAdRequestError: true,
                registerBuyAdRequestMessage: '',
                registerBuyAdRequest: {}
            };
        };


        case actionTypes.SET_PRODUCT_ID_FROM_REGISTER_PRODUCT: {
            return {
                ...state,
                subCategoryId: action.payload.id,
                subCategoryName: action.payload.name
            }
        }
        default:
            return state
    }
};