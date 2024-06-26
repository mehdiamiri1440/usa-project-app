import actionTypes from './actionTypes';
const INITIAL_STATE = {
    loginLoading: false,
    loginFailed: false,
    loggedInUserId: null,
    loginError: false,
    is_buyer: 0,
    is_seller: 0,
    loginMessage: null,

    checkAlreadySignedUpMobileNumberLoading: false,
    checkAlreadySignedUpMobileNumberFailed: false,
    checkAlreadySignedUpMobileNumberError: false,
    checkAlreadySignedUpMobileNumberMessage: null,


    checkActivisionCodeLoading: false,
    checkActivisionCodeFailed: false,
    checkActivisionCodeError: false,
    checkActivisionCodeMessage: null,

    submitRegisterLoading: false,
    submitRegisterFailed: false,
    submitRegisterError: false,
    submitRegisterMessage: null,

    changeRoleLoading: false,
    changeRoleFailed: false,
    changeRoleError: false,
    changeRoleMessage: null,
    changeRoleObject: {},

    logOutLoading: false,
    logOutFailed: false,
    logOutError: false,
    logOutMessage: null,

    setEvidencesLoading: false,
    setEvidencesFailed: false,
    setEvidencesError: false,
    setEvidencesMessage: null,
    setEvidencesObject: {},


    fetchAllActivityZonesLoading: false,
    fetchAllActivityZonesFailed: false,
    fetchAllActivityZonesError: false,
    fetchAllActivityZonesMessage: null,
    activityZones: []
};
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case actionTypes.LOGIN_LOADING: {
            return {
                ...state,
                loginLoading: true,
                loginFailed: false,
                loginError: false,
                loggedInUserId: null,
                loginMessage: null
            };
        };
        case actionTypes.LOGIN_SUCCESS: {
            let { is_buyer, is_seller, msg, status, id } = action.payload
            return {
                ...state,
                loginLoading: false,
                loginFailed: false,
                loggedInUserId: id,
                loginError: status,
                loginMessage: msg,
                is_buyer,
                is_seller
            };
        };
        case actionTypes.LOGIN_FAILURE: {
            const { msg } = action.payload;
            return {
                ...state,
                checkAlreadySignedUpMobileNumberLoading: false,
                loginLoading: false,
                loginFailed: true,
                loginError: false,
                loggedInUserId: null,
                loginMessage: msg
            };
        };
        case actionTypes.LOGIN_REJECT: {
            return {
                ...state,
                loginLoading: false,
                loginFailed: false,
                checkAlreadySignedUpMobileNumberLoading: false,
                loggedInUserId: null,
                loginError: true,
                loginMessage: null
            };
        };


        case actionTypes.CHECK_ALREADY_SIGNEDUP_MOBILE_NUMBER_LOADING: {
            return {
                ...state,
                checkAlreadySignedUpMobileNumberLoading: true,
                checkAlreadySignedUpMobileNumberFailed: false,
                checkAlreadySignedUpMobileNumberError: false,
                checkAlreadySignedUpMobileNumberMessage: null
            };
        };
        case actionTypes.CHECK_ALREADY_SIGNEDUP_MOBILE_NUMBER_SUCCESSFULLY: {
            let { msg, status } = action.payload
            return {
                ...state,
                checkAlreadySignedUpMobileNumberLoading: false,
                checkAlreadySignedUpMobileNumberFailed: false,
                checkAlreadySignedUpMobileNumberError: false,
                checkAlreadySignedUpMobileNumberMessage: msg,
            };
        };
        case actionTypes.CHECK_ALREADY_SIGNEDUP_MOBILE_NUMBER_FAILED: {
            const { msg = '' } = action.payload;
            return {
                ...state,
                checkAlreadySignedUpMobileNumberLoading: false,
                checkAlreadySignedUpMobileNumberFailed: true,
                checkAlreadySignedUpMobileNumberError: false,
                checkAlreadySignedUpMobileNumberMessage: msg
            };
        };
        case actionTypes.CHECK_ALREADY_SIGNEDUP_MOBILE_NUMBER_REJECT: {
            let { phone = '' } = action.payload
            return {
                ...state,
                checkAlreadySignedUpMobileNumberLoading: false,
                checkAlreadySignedUpMobileNumberFailed: false,
                checkAlreadySignedUpMobileNumberError: true,
                checkAlreadySignedUpMobileNumberMessage: phone
            };
        };


        case actionTypes.CHECK_ACTIVISION_CODE_LOADING: {
            return {
                ...state,
                checkActivisionCodeLoading: true,
                checkActivisionCodeFailed: false,
                checkActivisionCodeError: false,
                checkActivisionCodeMessage: null
            };
        };
        case actionTypes.CHECK_ACTIVISION_CODE_SUCCESSFULLY: {
            let { msg = '', status = true } = action.payload
            return {
                ...state,
                checkActivisionCodeLoading: false,
                checkActivisionCodeFailed: false,
                checkActivisionCodeError: false,
                checkActivisionCodeMessage: msg,
            };
        };
        case actionTypes.CHECK_ACTIVISION_CODE_FAILED: {
            const { msg = '' } = action.payload;
            return {
                ...state,
                checkActivisionCodeLoading: false,
                checkActivisionCodeFailed: true,
                checkActivisionCodeError: false,
                checkActivisionCodeMessage: msg
            };
        };
        case actionTypes.CHECK_ACTIVISION_CODE_REJECT: {
            let { phone = '' } = action.payload
            return {
                ...state,
                checkActivisionCodeLoading: false,
                checkActivisionCodeFailed: false,
                checkActivisionCodeError: true,
                checkActivisionCodeMessage: phone
            };
        };


        case actionTypes.FETCH_ALL_ACTIVITIY_ZONE_LOADING: {
            return {
                ...state,
                fetchAllActivityZonesLoading: true,
                fetchAllActivityZonesFailed: false,
                fetchAllActivityZonesError: false,
                fetchAllActivityZonesMessage: null
            };
        };
        case actionTypes.FETCH_ALL_ACTIVITIY_ZONE_SUCCESSFULLY: {
            return {
                ...state,
                fetchAllActivityZonesLoading: false,
                fetchAllActivityZonesFailed: false,
                fetchAllActivityZonesError: false,
                fetchAllActivityZonesMessage: null,
                activityZones: [...(action.payload.categories)]
            };
        };
        case actionTypes.FETCH_ALL_ACTIVITIY_ZONE_FAILED: {
            const { msg } = action.payload;
            return {
                ...state,
                fetchAllActivityZonesLoading: false,
                fetchAllActivityZonesFailed: true,
                fetchAllActivityZonesError: false,
                fetchAllActivityZonesMessage: msg
            };
        };
        case actionTypes.FETCH_ALL_ACTIVITIY_ZONE_REJECT: {
            return {
                ...state,
                fetchAllActivityZonesLoading: false,
                fetchAllActivityZonesFailed: false,
                fetchAllActivityZonesError: true,
                fetchAllActivityZonesMessage: action.payload.msg
            };
        };

        case actionTypes.SUBMIT_REGISTER_LOADING: {
            return {
                ...state,
                submitRegisterLoading: true,
                submitRegisterFailed: false,
                submitRegisterError: false,
                submitRegisterMessage: null
            };
        };
        case actionTypes.SUBMIT_REGISTER_SUCCESSFULLY: {
            return {
                ...state,
                submitRegisterLoading: false,
                submitRegisterFailed: false,
                submitRegisterError: false,
                submitRegisterMessage: null,
            };
        };
        case actionTypes.SUBMIT_REGISTER_FAILED: {
            const { msg } = action.payload;
            return {
                ...state,
                submitRegisterLoading: false,
                submitRegisterFailed: true,
                submitRegisterError: false,
                submitRegisterMessage: msg
            };
        };
        case actionTypes.SUBMIT_REGISTER_REJECT: {
            let { phone = '' } = action.payload
            return {
                ...state,
                submitRegisterLoading: false,
                submitRegisterFailed: false,
                submitRegisterError: true,
                submitRegisterMessage: phone
            };
        };


        case actionTypes.CHANGE_ROLE_LOADING: {
            return {
                ...state,
                changeRoleLoading: true,
                changeRoleFailed: false,
                changeRoleError: false,
                changeRoleObject: {},
                changeRoleMessage: null
            };
        };
        case actionTypes.CHANGE_ROLE_SUCCESSFULLY: {
            return {
                ...state,
                changeRoleLoading: false,
                changeRoleFailed: false,
                changeRoleError: false,
                changeRoleMessage: null,
                changeRoleObject: { ...action.payload },

            };
        };
        case actionTypes.CHANGE_ROLE_FAILED: {
            const { msg } = action.payload;
            return {
                ...state,
                changeRoleLoading: false,
                changeRoleFailed: true,
                changeRoleError: false,
                changeRoleMessage: msg,
                changeRoleObject: {},
            };
        };
        case actionTypes.CHANGE_ROLE_REJECT: {
            let { phone = '' } = action.payload
            return {
                ...state,
                changeRoleLoading: false,
                changeRoleFailed: false,
                changeRoleError: true,
                changeRoleMessage: phone,
                changeRoleObject: {},
            };
        };


        case actionTypes.LOGOUT_LOADING: {
            return {
                ...state,
                logOutLoading: true,
                logOutFailed: false,
                loggedInUserId: null,
                logOutError: false,
                logOutMessage: null
            };
        };
        case actionTypes.LOGOUT_SUCCESSFULLY: {
            return {
                ...state,
                logOutLoading: false,
                logOutFailed: false,
                logOutError: false,
                logOutMessage: null,
                loggedInUserId: null,
            };
        };
        case actionTypes.LOGOUT_FAILED: {
            const { msg } = action.payload;
            return {
                ...state,
                logOutLoading: false,
                logOutFailed: true,
                loggedInUserId: null,
                logOutError: false,
                logOutMessage: msg
            };
        };
        case actionTypes.LOGOUT_REJECT: {
            return {
                ...state,
                loggedInUserId: null,
                logOutLoading: false,
                logOutFailed: false,
                logOutError: true,
                logOutMessage: null
            };
        };

        case actionTypes.SET_EVIDENCES_LOADING: {
            return {
                ...state,
                setEvidencesLoading: true,
                setEvidencesFailed: false,
                setEvidencesError: false,
                setEvidencesMessage: null,
                setEvidencesObject: {}
            };
        };
        case actionTypes.SET_EVIDENCES_SUCCESSFULLY: {
            return {
                ...state,
                setEvidencesLoading: false,
                setEvidencesFailed: false,
                setEvidencesError: false,
                setEvidencesMessage: null,
                setEvidencesObject: { ...action.payload }
            };
        };
        case actionTypes.SET_EVIDENCES_FAILED: {
            const { msg = '' } = action.payload;
            return {
                ...state,
                setEvidencesLoading: false,
                setEvidencesFailed: true,
                setEvidencesError: false,
                setEvidencesMessage: msg,
                setEvidencesObject: {}
            };
        };
        case actionTypes.SET_EVIDENCES_REJECT: {
            return {
                ...state,
                setEvidencesLoading: false,
                setEvidencesFailed: false,
                setEvidencesError: true,
                setEvidencesMessage: null,
                setEvidencesObject: {}
            };
        };
        default:
            return state
    }
};