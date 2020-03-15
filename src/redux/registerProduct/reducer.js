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
    addNewProductMessage: null,

    userPermissionToRegisterProductLoading: false,
    userPermissionToRegisterProductFailed: false,
    userPermissionToRegisterProductError: false,
    userPermissionToRegisterProductMessage: null,
    isUserLimitedToRegisterProduct: false,
    userPermissionToRegisterProductStatus: false,

    subCategoriesLoading: false,
    subCategoriesFailed: false,
    subCategoriesError: false,
    subCategoriesMessage: null,
    subCategoriesList: [],
    subCategories: {}
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
            let { msg, status } = action.payload
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
            const { msg } = action.payload;
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
            let { phone } = action.payload.data.errors;
            return {
                ...state,
                categoriesList: [],
                categories: {},
                categoriesLoading: false,
                categoriesFailed: false,
                categoriesError: true,
                categoriesMessage: phone
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
            let { msg, status } = action.payload
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
            const { msg } = action.payload;
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
            let { phone } = action.payload.data.errors;
            return {
                ...state,
                subCategoriesList: [],
                subCategories: {},
                subCategoriesLoading: false,
                subCategoriesFailed: false,
                subCategoriesError: true,
                subCategoriesMessage: phone
            };
        };




        case actionTypes.ADD_NEW_PRODUCT_LOADING: {
            return {
                ...state,
                addNewProductLoading: true,
                addNewProductFailed: false,
                addNewProductError: false,
                addNewProductMessage: null
            };
        };
        case actionTypes.ADD_NEW_PRODUCT_SUCCESSFULLY: {
            let { msg, status } = action.payload
            return {
                ...state,
                addNewProductLoading: false,
                addNewProductFailed: false,
                addNewProductError: false,
                addNewProductMessage: msg,
            };
        };
        case actionTypes.ADD_NEW_PRODUCT_FAILED: {
            const { msg } = action.payload;
            return {
                ...state,
                addNewProductLoading: false,
                addNewProductFailed: true,
                addNewProductError: false,
                addNewProductMessage: msg
            };
        };
        case actionTypes.ADD_NEW_PRODUCT_REJECT: {
            let { phone } = action.payload.data.errors;
            return {
                ...state,
                addNewProductLoading: false,
                addNewProductFailed: false,
                addNewProductError: true,
                addNewProductMessage: phone
            };
        };



        case actionTypes.CHECK_USER_PERMISSION_TO_REGISTER_PRODUCT_LOADING: {
            console.warn('in loading--->', action)
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
            console.warn('in success--->', action)
            let { msg, status, is_limit } = action.payload
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
            console.warn('in failed--->', action)
            const { msg } = action.payload;
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
            console.warn('in reject--->', action)
            let { phone } = action.payload.data.errors;
            return {
                ...state,
                userPermissionToRegisterProductLoading: false,
                userPermissionToRegisterProductFailed: false,
                userPermissionToRegisterProductError: true,
                userPermissionToRegisterProductMessage: phone,
                isUserLimitedToRegisterProduct: false,
                userPermissionToRegisterProductStatus: false
            };
        };



        default:
            return state
    }
};