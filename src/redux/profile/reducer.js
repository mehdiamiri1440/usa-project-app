import actionTypes from './actionTypes';
const INITIAL_STATE = {
    userProfileLoading: false,
    userProfileFailed: false,
    userProfileError: false,
    userProfileMessage: null,
    userProfile: {},

    isUserAllowedToSendMessageLoading: false,
    isUserAllowedToSendMessageFailed: false,
    isUserAllowedToSendMessageError: false,
    isUserAllowedToSendMessageMessage: null,
    isUserAllowedToSendMessage: {},

    profileStatisticsLoading: false,
    profileStatisticsFailed: false,
    profileStatisticsError: false,
    profileStatisticsMessage: null,
    profileStatistics: {},

    profileByUserNameLoading: false,
    profileByUserNameFailed: false,
    profileByUserNameError: false,
    profileByUserNameMessage: null,
    profileByUserName: {},

    productsListByUserNameLoading: false,
    productsListByUserNameFailed: false,
    productsListByUserNameError: false,
    productsListByUserNameMessage: null,
    productsListByUserName: {},

    editProfileLoading: false,
    editProfileFailed: false,
    editProfileError: false,
    editProfileMessage: null,
    editProfile: {},

    accountBalanceLoading: false,
    accountBalanceFailed: false,
    accountBalanceError: false,
    accountBalanceMessage: null,
    accountBalance: {},

    phoneNumberViewPermissionLoading: false,
    phoneNumberViewPermissionFailed: false,
    phoneNumberViewPermissionError: false,
    phoneNumberViewPermissionMessage: null,
    phoneNumberViewPermission: {},

    userContactInfoViewersLoading: false,
    userContactInfoViewersFailed: false,
    userContactInfoViewersError: false,
    userContactInfoViewersMessage: null,
    userContactInfoViewers: {},
    userContactInfoViewersList: [],

    walletElevatorPayLoading: false,
    walletElevatorPayFailed: false,
    walletElevatorPayError: false,
    walletElevatorPayMessage: null,
    walletElevatorPay: {},

    uploadUserContactsLoading: false,
    uploadUserContactsFailed: false,
    uploadUserContactsError: false,
    uploadUserContactsMessage: null,
    uploadUserContacts: {},

    profileInfoLoading: false,
    profileInfoFailed: false,
    profileInfoError: false,
    profileInfoMessage: null,
    profileInfo: [],

};
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {


        case actionTypes.FETCH_USER_PROFILE_LOADING: {
            return {
                ...state,
                userProfile: {},
                userProfileLoading: true,
                userProfileFailed: false,
                userProfileError: false,
                userProfileMessage: null
            };
        };
        case actionTypes.FETCH_USER_PROFILE_SUCCESSFULLY: {
            let { msg = '', user_info = {} } = action.payload
            return {
                ...state,
                userProfile: { ...action.payload },
                userProfileLoading: false,
                userProfileFailed: false,
                userProfileError: false,
                userProfileMessage: msg,
            };
        };
        case actionTypes.FETCH_USER_PROFILE_FAILED: {
            const { msg = '' } = action.payload;
            return {
                ...state,
                userProfile: {},
                userProfileLoading: false,
                userProfileFailed: true,
                userProfileError: false,
                userProfileMessage: msg
            };
        };
        case actionTypes.FETCH_USER_PROFILE_REJECT: {
            let { phone = '' } = action.payload;
            return {
                ...state,
                userProfile: {},
                userProfileLoading: false,
                userProfileFailed: false,
                userProfileError: true,
                userProfileMessage: phone
            };
        };


        case actionTypes.IS_USER_ALLOWED_TO_SEND_MESSAGE_LOADING: {
            return {
                ...state,
                isUserAllowedToSendMessage: {},
                isUserAllowedToSendMessageLoading: true,
                isUserAllowedToSendMessageFailed: false,
                isUserAllowedToSendMessageError: false,
                isUserAllowedToSendMessageMessage: null
            };
        };
        case actionTypes.IS_USER_ALLOWED_TO_SEND_MESSAGE_SUCCESSFULLY: {
            return {
                ...state,
                isUserAllowedToSendMessagePermission: { ...action.payload },
                isUserAllowedToSendMessageLoading: false,
                isUserAllowedToSendMessageFailed: false,
                isUserAllowedToSendMessageError: false,
                isUserAllowedToSendMessageMessage: false,
            };
        };
        case actionTypes.IS_USER_ALLOWED_TO_SEND_MESSAGE_FAILED: {
            const { status } = action.payload;
            return {
                ...state,
                isUserAllowedToSendMessage: {},
                isUserAllowedToSendMessageLoading: false,
                isUserAllowedToSendMessageFailed: true,
                isUserAllowedToSendMessageError: false,
                isUserAllowedToSendMessageMessage: status
            };
        };
        case actionTypes.IS_USER_ALLOWED_TO_SEND_MESSAGE_REJECT: {
            let { phone = '' } = action.payload;
            return {
                ...state,
                isUserAllowedToSendMessage: {},
                isUserAllowedToSendMessageLoading: false,
                isUserAllowedToSendMessageFailed: false,
                isUserAllowedToSendMessageError: true,
                isUserAllowedToSendMessageMessage: phone
            };
        };


        case actionTypes.FETCH_PROFILE_STATISTICS_LOADING: {
            return {
                ...state,
                profileStatistics: {},
                profileStatisticsLoading: true,
                profileStatisticsFailed: false,
                profileStatisticsError: false,
                profileStatisticsMessage: null
            };
        };
        case actionTypes.FETCH_PROFILE_STATISTICS_SUCCESSFULLY: {
            return {
                ...state,
                profileStatistics: { ...action.payload.statistics },
                profileStatisticsLoading: false,
                profileStatisticsFailed: false,
                profileStatisticsError: false,
                profileStatisticsMessage: false,
            };
        };
        case actionTypes.FETCH_PROFILE_STATISTICS_FAILED: {
            const { status } = action.payload;
            return {
                ...state,
                profileStatistics: {},
                profileStatisticsLoading: false,
                profileStatisticsFailed: true,
                profileStatisticsError: false,
                profileStatisticsMessage: status
            };
        };
        case actionTypes.FETCH_PROFILE_STATISTICS_REJECT: {
            let { phone = '' } = action.payload;
            return {
                ...state,
                profileStatistics: {},
                profileStatisticsLoading: false,
                profileStatisticsFailed: false,
                profileStatisticsError: true,
                profileStatisticsMessage: phone
            };
        };

        case actionTypes.FETCH_PROFILE_BY_USERNAME_LOADING: {
            return {
                ...state,
                profileByUserName: {},
                profileByUserNameLoading: true,
                profileByUserNameFailed: false,
                profileByUserNameError: false,
                profileByUserNameMessage: null
            };
        };
        case actionTypes.FETCH_PROFILE_BY_USERNAME_SUCCESSFULLY: {
            return {
                ...state,
                profileByUserName: { ...action.payload },
                profileByUserNameLoading: false,
                profileByUserNameFailed: false,
                profileByUserNameError: false,
                profileByUserNameMessage: false,
            };
        };
        case actionTypes.FETCH_PROFILE_BY_USERNAME_FAILED: {
            const { status } = action.payload;
            return {
                ...state,
                profileByUserName: {},
                profileByUserNameLoading: false,
                profileByUserNameFailed: true,
                profileByUserNameError: false,
                profileByUserNameMessage: status
            };
        };
        case actionTypes.FETCH_PROFILE_BY_USERNAME_REJECT: {
            return {
                ...state,
                profileByUserName: {},
                profileByUserNameLoading: false,
                profileByUserNameFailed: false,
                profileByUserNameError: true,
                profileByUserNameMessage: action.payload
            };
        };

        case actionTypes.FETCH_PRODUCTS_LIST_BY_USERNAME_LOADING: {
            return {
                ...state,
                productsListByUserName: {},
                productsListByUserNameLoading: true,
                productsListByUserNameFailed: false,
                productsListByUserNameError: false,
                productsListByUserNameMessage: null
            };
        };
        case actionTypes.FETCH_PRODUCTS_LIST_BY_USERNAME_SUCCESSFULLY: {
            return {
                ...state,
                productsListByUserName: { ...action.payload },
                productsListByUserNameLoading: false,
                productsListByUserNameFailed: false,
                productsListByUserNameError: false,
                productsListByUserNameMessage: false,
            };
        };
        case actionTypes.FETCH_PRODUCTS_LIST_BY_USERNAME_FAILED: {
            const { status } = action.payload;
            return {
                ...state,
                productsListByUserName: {},
                productsListByUserNameLoading: false,
                productsListByUserNameFailed: true,
                productsListByUserNameError: false,
                productsListByUserNameMessage: status
            };
        };
        case actionTypes.FETCH_PRODUCTS_LIST_BY_USERNAME_REJECT: {
            let { phone = '' } = action.payload;
            return {
                ...state,
                productsListByUserName: {},
                productsListByUserNameLoading: false,
                productsListByUserNameFailed: false,
                productsListByUserNameError: true,
                productsListByUserNameMessage: phone
            };
        };

        case actionTypes.EDIT_PROFILE_LOADING: {
            return {
                ...state,
                editProfile: {},
                editProfileLoading: true,
                editProfileFailed: false,
                editProfileError: false,
                editProfileMessage: null
            };
        };
        case actionTypes.EDIT_PROFILE_SUCCESSFULLY: {
            return {
                ...state,
                editProfile: { ...action.payload },
                editProfileLoading: false,
                editProfileFailed: false,
                editProfileError: false,
                editProfileMessage: null,
            };
        };
        case actionTypes.EDIT_PROFILE_FAILED: {
            return {
                ...state,
                editProfile: {},
                editProfileLoading: false,
                editProfileFailed: true,
                editProfileError: false,
                editProfileMessage: null
            };
        };
        case actionTypes.EDIT_PROFILE_REJECT: {

            const { response = {} } = action.payload;
            const { data = {} } = response;
            const { errors = {} } = data;
            const { description = [] } = errors;
            return {
                ...state,
                editProfile: {},
                editProfileLoading: false,
                editProfileFailed: false,
                editProfileError: true,
                editProfileMessage: [...description]
            };
        };


        case actionTypes.FETCH_ACCOUNT_BALANCE_LOADING: {
            return {
                ...state,
                accountBalance: {},
                accountBalanceLoading: true,
                accountBalanceFailed: false,
                accountBalanceError: false,
                accountBalanceMessage: null
            };
        };
        case actionTypes.FETCH_ACCOUNT_BALANCE_SUCCESSFULLY: {
            return {
                ...state,
                accountBalance: { ...action.payload },
                accountBalanceLoading: false,
                accountBalanceFailed: false,
                accountBalanceError: false,
                accountBalanceMessage: null,
            };
        };
        case actionTypes.FETCH_ACCOUNT_BALANCE_FAILED: {
            return {
                ...state,
                accountBalance: {},
                accountBalanceLoading: false,
                accountBalanceFailed: true,
                accountBalanceError: false,
                accountBalanceMessage: null
            };
        };
        case actionTypes.FETCH_ACCOUNT_BALANCE_REJECT: {

            const { response = {} } = action.payload;
            const { data = {} } = response;
            const { errors = {} } = data;
            const { description = [] } = errors;
            return {
                ...state,
                accountBalance: {},
                accountBalanceLoading: false,
                accountBalanceFailed: false,
                accountBalanceError: true,
                accountBalanceMessage: [...description]
            };
        };


        case actionTypes.SET_PHONE_NUMBER_VIEW_PERMISSION_LOADING: {
            return {
                ...state,
                phoneNumberViewPermission: {},
                phoneNumberViewPermissionLoading: true,
                phoneNumberViewPermissionFailed: false,
                phoneNumberViewPermissionError: false,
                phoneNumberViewPermissionMessage: null
            };
        };
        case actionTypes.SET_PHONE_NUMBER_VIEW_PERMISSION_SUCCESSFULLY: {
            return {
                ...state,
                phoneNumberViewPermission: { ...action.payload },
                phoneNumberViewPermissionLoading: false,
                phoneNumberViewPermissionFailed: false,
                phoneNumberViewPermissionError: false,
                phoneNumberViewPermissionMessage: null,
            };
        };
        case actionTypes.SET_PHONE_NUMBER_VIEW_PERMISSION_FAILED: {
            return {
                ...state,
                phoneNumberViewPermission: {},
                phoneNumberViewPermissionLoading: false,
                phoneNumberViewPermissionFailed: true,
                phoneNumberViewPermissionError: false,
                phoneNumberViewPermissionMessage: null
            };
        };
        case actionTypes.SET_PHONE_NUMBER_VIEW_PERMISSION_REJECT: {

            const { response = {} } = action.payload;
            const { data = {} } = response;
            const { errors = {} } = data;
            const { description = [] } = errors;
            return {
                ...state,
                phoneNumberViewPermission: {},
                phoneNumberViewPermissionLoading: false,
                phoneNumberViewPermissionFailed: false,
                phoneNumberViewPermissionError: true,
                phoneNumberViewPermissionMessage: [...description]
            };
        };




        case actionTypes.FETCH_USER_CONTACT_INFO_VIEWERS_LOADING: {
            return {
                ...state,
                userContactInfoViewers: {},
                userContactInfoViewersList: [],
                userContactInfoViewersLoading: true,
                userContactInfoViewersFailed: false,
                userContactInfoViewersError: false,
                userContactInfoViewersMessage: null
            };
        };
        case actionTypes.FETCH_USER_CONTACT_INFO_VIEWERS_SUCCESSFULLY: {
            return {
                ...state,
                userContactInfoViewers: { ...action.payload },
                userContactInfoViewersList: [...action.payload.users],
                userContactInfoViewersLoading: false,
                userContactInfoViewersFailed: false,
                userContactInfoViewersError: false,
                userContactInfoViewersMessage: null,
            };
        };
        case actionTypes.FETCH_USER_CONTACT_INFO_VIEWERS_FAILED: {
            return {
                ...state,
                userContactInfoViewers: {},
                userContactInfoViewersList: [],
                userContactInfoViewersLoading: false,
                userContactInfoViewersFailed: true,
                userContactInfoViewersError: false,
                userContactInfoViewersMessage: null
            };
        };
        case actionTypes.FETCH_USER_CONTACT_INFO_VIEWERS_REJECT: {

            const { response = {} } = action.payload;
            const { data = {} } = response;
            const { errors = {} } = data;
            const { description = [] } = errors;
            return {
                ...state,
                userContactInfoViewers: {},
                userContactInfoViewersList: [],
                userContactInfoViewersLoading: false,
                userContactInfoViewersFailed: false,
                userContactInfoViewersError: true,
                userContactInfoViewersMessage: [...description]
            };
        };

        case actionTypes.WALLET_ELEVATOR_PAY_LOADING: {
            return {
                ...state,
                walletElevatorPay: {},
                walletElevatorPayLoading: true,
                walletElevatorPayFailed: false,
                walletElevatorPayError: false,
                walletElevatorPayMessage: null
            };
        };
        case actionTypes.WALLET_ELEVATOR_PAY_SUCCESSFULLY: {
            return {
                ...state,
                walletElevatorPay: { ...action.payload },
                walletElevatorPayLoading: false,
                walletElevatorPayFailed: false,
                walletElevatorPayError: false,
                walletElevatorPayMessage: null,
            };
        };
        case actionTypes.WALLET_ELEVATOR_PAY_FAILED: {
            return {
                ...state,
                walletElevatorPay: {},
                walletElevatorPayLoading: false,
                walletElevatorPayFailed: true,
                walletElevatorPayError: false,
                walletElevatorPayMessage: null
            };
        };
        case actionTypes.WALLET_ELEVATOR_PAY_REJECT: {

            const { response = {} } = action.payload;
            const { data = {} } = response;
            const { errors = {} } = data;
            const { description = [] } = errors;
            return {
                ...state,
                walletElevatorPay: {},
                walletElevatorPayLoading: false,
                walletElevatorPayFailed: false,
                walletElevatorPayError: true,
                walletElevatorPayMessage: [...description]
            };
        };

        case actionTypes.UPLOAD_USER_CONTACTS_LOADING: {
            return {
                ...state,
                uploadUserContacts: {},
                uploadUserContactsLoading: true,
                uploadUserContactsFailed: false,
                uploadUserContactsError: false,
                uploadUserContactsMessage: null
            };
        };
        case actionTypes.UPLOAD_USER_CONTACTS_SUCCESSFULLY: {
            return {
                ...state,
                uploadUserContacts: { ...action.payload },
                uploadUserContactsLoading: false,
                uploadUserContactsFailed: false,
                uploadUserContactsError: false,
                uploadUserContactsMessage: null,
            };
        };
        case actionTypes.UPLOAD_USER_CONTACTS_FAILED: {
            return {
                ...state,
                uploadUserContacts: {},
                uploadUserContactsLoading: false,
                uploadUserContactsFailed: true,
                uploadUserContactsError: false,
                uploadUserContactsMessage: null
            };
        };
        case actionTypes.UPLOAD_USER_CONTACTS_REJECT: {

            const { response = {} } = action.payload;
            const { data = {} } = response;
            const { errors = {} } = data;
            const { description = [] } = errors;
            return {
                ...state,
                uploadUserContacts: {},
                uploadUserContactsLoading: false,
                uploadUserContactsFailed: false,
                uploadUserContactsError: true,
                uploadUserContactsMessage: [...description]
            };
        };


        case actionTypes.FETCH_ALL_PROFILE_INFO_LOADING: {
            return {
                ...state,
                profileInfo: [],
                profileInfoLoading: true,
                profileInfoFailed: false,
                profileInfoError: false,
                profileInfoMessage: null
            };
        };
        case actionTypes.FETCH_ALL_PROFILE_INFO_SUCCESSFULLY: {
            return {
                ...state,
                profileInfo: [...action.payload],
                profileInfoLoading: false,
                profileInfoFailed: false,
                profileInfoError: false,
                profileInfoMessage: false,
            };
        };
        case actionTypes.FETCH_ALL_PROFILE_INFO_FAILED: {
            return {
                ...state,
                profileInfo: [],
                profileInfoLoading: false,
                profileInfoFailed: true,
                profileInfoError: false,
                profileInfoMessage: ''
            };
        };
        case actionTypes.FETCH_ALL_PROFILE_INFO_REJECT: {
            return {
                ...state,
                profileInfo: [],
                profileInfoLoading: false,
                profileInfoFailed: false,
                profileInfoError: true,
                profileInfoMessage: ''
            };
        };

        default:
            return state
    }
};