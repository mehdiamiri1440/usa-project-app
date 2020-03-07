import actionTypes from './actionTypes';
const INITIAL_STATE = {
    categoriesLoading: false,
    categoriesFailed: false,
    categoriesError: false,
    categoriesMessage: null,
    categoriesList: [],
    categories: {},


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



        default:
            return state
    }
};