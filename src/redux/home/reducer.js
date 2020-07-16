import actionTypes from './actionTypes';
const INITIAL_STATE = {
    dashboardLoading: false,
    dashboardFailed: false,
    dashboardError: false,
    dashboardMessage: null,
    dashboard: {},
};
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {


        case actionTypes.FETCH_ALL_DASHBOARD_DATA_LOADING: {
            return {
                ...state,
                dashboard: {},
                dashboardLoading: true,
                dashboardFailed: false,
                dashboardError: false,
                dashboardMessage: null
            };
        };
        case actionTypes.FETCH_ALL_DASHBOARD_DATA_SUCCESSFULLY: {
            return {
                ...state,
                dashboard: { ...action.payload },
                dashboardLoading: false,
                dashboardFailed: false,
                dashboardError: false,
                dashboardMessage: null,
            };
        };
        case actionTypes.FETCH_ALL_DASHBOARD_DATA_FAILED: {
            const { msg = '' } = action.payload;
            return {
                ...state,
                dashboard: {},
                dashboardLoading: false,
                dashboardFailed: true,
                dashboardError: false,
                dashboardMessage: null
            };
        };
        case actionTypes.FETCH_ALL_DASHBOARD_DATA_REJECT: {
            return {
                ...state,
                dashboard: {},
                dashboardLoading: false,
                dashboardFailed: false,
                dashboardError: true,
                dashboardMessage: null
            };
        };


        default:
            return state
    }
};