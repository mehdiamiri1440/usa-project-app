import actionTypes from './actionTypes';
const INITIAL_STATE = {
    fetchAllCitiesLoading: false,
    fetchAllCitiesFailed: false,
    fetchAllCitiesError: false,
    fetchAllCitiesMessage: null,


    fetchAllProvincesLoading: false,
    fetchAllProvincesFailed: false,
    fetchAllProvincesError: false,
    fetchAllProvincesMessage: null,
    allProvincesObject: {},

    fetchAllCitiesLoading: false,
    fetchAllCitiesFailed: false,
    fetchAllCitiesError: false,
    fetchAllCitiesMessage: null,
    allCitiesObject: {},
    provinces: []

};
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case actionTypes.FETCH_ALL_PROVINCES_LOADING: {
            return {
                ...state,
                fetchAllProvincesLoading: true,
                fetchAllProvincesFailed: false,
                fetchAllProvincesError: false,
                provinces: [],
                fetchAllProvincesMessage: null
            };
        };
        case actionTypes.FETCH_ALL_PROVINCES_SUCCESSFULLY: {
            return {
                ...state,
                fetchAllProvincesLoading: false,
                fetchAllProvincesFailed: false,
                fetchAllProvincesError: false,
                fetchAllProvincesMessage: null,
                allProvincesObject: action.payload,
                provinces: [...action.payload.provinces]
            };
        };
        case actionTypes.FETCH_ALL_PROVINCES_FAILED: {
            const { msg = '' } = action.payload;
            return {
                ...state,
                fetchAllProvincesLoading: false,
                fetchAllProvincesFailed: true,
                fetchAllProvincesError: false,
                fetchAllProvincesMessage: msg,
                provinces: []
            };
        };
        case actionTypes.FETCH_ALL_PROVINCES_REJECT: {
            return {
                ...state,
                fetchAllProvincesLoading: false,
                fetchAllProvincesFailed: false,
                fetchAllProvincesError: true,
                fetchAllProvincesMessage: null,
                provinces: []
            };
        };

        case actionTypes.FETCH_ALL_CITIES_LOADING: {
            return {
                ...state,
                fetchAllCitiesLoading: true,
                fetchAllCitiesFailed: false,
                fetchAllCitiesError: false,
                fetchAllCitiesMessage: null
            };
        };
        case actionTypes.FETCH_ALL_CITIES_SUCCESSFULLY: {
            return {
                ...state,
                fetchAllCitiesLoading: false,
                fetchAllCitiesFailed: false,
                fetchAllCitiesError: false,
                fetchAllCitiesMessage: null,
                allCitiesObject: action.payload
            };
        };
        case actionTypes.FETCH_ALL_CITIES_FAILED: {
            const { msg = '' } = action.payload;
            return {
                ...state,
                fetchAllCitiesLoading: false,
                fetchAllCitiesFailed: true,
                fetchAllCitiesError: false,
                fetchAllCitiesMessage: msg
            };
        };
        case actionTypes.FETCH_ALL_CITIES_REJECT: {
            return {
                ...state,
                fetchAllCitiesLoading: false,
                fetchAllCitiesFailed: false,
                fetchAllCitiesError: true,
                fetchAllCitiesMessage: null
            };
        };
        default:
            return state
    }
};