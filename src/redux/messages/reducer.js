import actionTypes from './actionTypes';
const INITIAL_STATE = {
    contactsListLoading: false,
    contactsListFailed: false,
    contactsListError: false,
    contactsListMessage: null,
    contactsList: [],
    contactsListData: {},


    userChatHistoryLoading: false,
    userChatHistoryFailed: false,
    userChatHistoryError: false,
    userChatHistoryMessage: null,
    isSenderVerified: false,
    userChatHistory: [],
    userChatHistoryData: {},


    sendPrivateMessageLoading: false,
    sendPrivateMessageFailed: false,
    sendPrivateMessageError: false,
    sendPrivateMessageMessage: null,


    userProfilePhotoLoading: false,
    userProfilePhotoFailed: false,
    userProfilePhotoError: false,
    userProfilePhotoMessage: null,


    channelDataLoading: false,
    channelDataFailed: false,
    channelDataError: false,
    channelDataMessage: null,
    channelData: {},

    violationReportReasonsLoading: false,
    violationReportReasonsFailed: false,
    violationReportReasonsError: false,
    violationReportReasonsMessage: null,
    violationReportReasons: [],

    sendReportLoading: false,
    sendReportFailed: false,
    sendReportError: false,
    sendReportMessage: null,
    sendReport: {},

    newMessage: false,

};
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {


        case actionTypes.FETCH_ALL_CONTACTS_LIST_LOADING: {
            return {
                ...state,
                contactsList: [],
                contactsListLoading: true,
                contactsListFailed: false,
                contactsListError: false,
                contactsListMessage: null,
                contactsListData: {}
            };
        };
        case actionTypes.FETCH_ALL_CONTACTS_LIST_SUCCESSFULLY: {
            return {
                ...state,
                contactsList: [...action.payload.contact_list],
                contactsListLoading: false,
                contactsListFailed: false,
                contactsListError: false,
                contactsListData: { ...action.payload },
                contactsListMessage: null,
            };
        };
        case actionTypes.FETCH_ALL_CONTACTS_LIST_FAILED: {
            return {
                ...state,
                contactsList: [],
                contactsListLoading: false,
                contactsListData: {},
                contactsListFailed: true,
                contactsListError: false,
                contactsListMessage: null
            };
        };
        case actionTypes.FETCH_ALL_CONTACTS_LIST_REJECT: {
            return {
                ...state,
                contactsList: [],
                contactsListLoading: false,
                contactsListFailed: false,
                contactsListData: {},
                contactsListError: true,
                contactsListMessage: null
            };
        };



        case actionTypes.FETCH_USER_CHAT_HISTORY_LOADING: {
            return {
                ...state,
                userChatHistory: [],
                userChatHistoryData: {},
                userChatHistoryLoading: true,
                isSenderVerified: false,
                userChatHistoryFailed: false,
                userChatHistoryError: false,
                userChatHistoryMessage: null
            };
        };
        case actionTypes.FETCH_USER_CHAT_HISTORY_SUCCESSFULLY: {
            const {
                payload = {}
            } = action;

            const {
                messages = [],
                is_verified
            } = payload;

            return {
                ...state,
                userChatHistory: [...messages],
                userChatHistoryData: { ...payload },
                isSenderVerified: is_verified == 1 ? true : false,
                userChatHistoryLoading: false,
                userChatHistoryFailed: false,
                userChatHistoryError: false,
                userChatHistoryMessage: null,
            };
        };
        case actionTypes.FETCH_USER_CHAT_HISTORY_FAILED: {
            return {
                ...state,
                userChatHistory: [],
                userChatHistoryData: {},
                isSenderVerified: false,
                userChatHistoryLoading: false,
                userChatHistoryFailed: true,
                userChatHistoryError: false,
                userChatHistoryMessage: null
            };
        };
        case actionTypes.FETCH_USER_CHAT_HISTORY_REJECT: {
            return {
                ...state,
                userChatHistory: [],
                userChatHistoryData: {},
                userChatHistoryLoading: false,
                userChatHistoryFailed: false,
                isSenderVerified: false,
                userChatHistoryError: true,
                userChatHistoryMessage: null
            };
        };




        case actionTypes.SEND_PRIVATE_MESSAGE_LOADING: {
            return {
                ...state,
                sendPrivateMessageLoading: true,
                sendPrivateMessageFailed: false,
                sendPrivateMessageError: false,
                sendPrivateMessageMessage: null
            };
        };
        case actionTypes.SEND_PRIVATE_MESSAGE_SUCCESSFULLY: {
            return {
                ...state,
                sendPrivateMessageLoading: false,
                sendPrivateMessageFailed: false,
                sendPrivateMessageError: false,
                sendPrivateMessageMessage: null,
            };
        };
        case actionTypes.SEND_PRIVATE_MESSAGE_FAILED: {
            return {
                ...state,
                sendPrivateMessageLoading: false,
                sendPrivateMessageFailed: true,
                sendPrivateMessageError: false,
                sendPrivateMessageMessage: null
            };
        };
        case actionTypes.SEND_PRIVATE_MESSAGE_REJECT: {
            return {
                ...state,
                sendPrivateMessageLoading: false,
                sendPrivateMessageFailed: false,
                sendPrivateMessageError: true,
                sendPrivateMessageMessage: null
            };
        };

        case actionTypes.FETCH_USER_PROFILE_PHOTO_LOADING: {
            return {
                ...state,
                userProfilePhotoLoading: true,
                userProfilePhotoFailed: false,
                userProfilePhotoError: false,
                userProfilePhotoMessage: null,
                profile_photo: ''
            };
        };
        case actionTypes.FETCH_USER_PROFILE_PHOTO_SUCCESSFULLY: {
            return {
                ...state,
                userProfilePhotoLoading: false,
                userProfilePhotoFailed: false,
                userProfilePhotoError: false,
                userProfilePhotoMessage: null,
                profile_photo: action.payload.profile_photo
            };
        };
        case actionTypes.FETCH_USER_PROFILE_PHOTO_FAILED: {
            return {
                ...state,
                userProfilePhotoLoading: false,
                userProfilePhotoFailed: true,
                userProfilePhotoError: false,
                userProfilePhotoMessage: null,
                profile_photo: ''
            };
        };
        case actionTypes.FETCH_USER_PROFILE_PHOTO_REJECT: {
            return {
                ...state,
                userProfilePhotoLoading: false,
                userProfilePhotoFailed: false,
                userProfilePhotoError: true,
                userProfilePhotoMessage: null,
                profile_photo: ''
            };
        };




        case actionTypes.FETCH_TOTAL_UNDREAD_MESSAGES_LOADING: {
            return {
                ...state,
                totalUnreadMessagesLoading: true,
                totalUnreadMessagesFailed: false,
                totalUnreadMessagesError: false,
                totalUnreadMessagesMessage: null,
                totalUnreadMessages: {}
            };
        };
        case actionTypes.FETCH_TOTAL_UNDREAD_MESSAGES_SUCCESSFULLY: {
            return {
                ...state,
                totalUnreadMessagesLoading: false,
                totalUnreadMessagesFailed: false,
                totalUnreadMessagesError: false,
                totalUnreadMessagesMessage: null,
                totalUnreadMessages: action.payload.msg_count,
            };
        };
        case actionTypes.FETCH_TOTAL_UNDREAD_MESSAGES_FAILED: {
            return {
                ...state,
                totalUnreadMessagesLoading: false,
                totalUnreadMessagesFailed: true,
                totalUnreadMessagesError: false,
                totalUnreadMessagesMessage: null,
                totalUnreadMessages: {},
            };
        };
        case actionTypes.FETCH_TOTAL_UNDREAD_MESSAGES_REJECT: {
            return {
                ...state,
                totalUnreadMessagesLoading: false,
                totalUnreadMessagesFailed: false,
                totalUnreadMessagesError: true,
                totalUnreadMessagesMessage: null,
                totalUnreadMessages: {},
            };
        };






        case actionTypes.FETCH_CHANNEL_DATA_LOADING: {
            return {
                ...state,
                channelDataLoading: true,
                channelDataFailed: false,
                channelDataError: false,
                channelDataMessage: null,
                channelData: {}
            };
        };
        case actionTypes.FETCH_CHANNEL_DATA_SUCCESSFULLY: {
            return {
                ...state,
                channelDataLoading: false,
                channelDataFailed: false,
                channelDataError: false,
                channelDataMessage: null,
                channelData: { ...action.payload },
            };
        };
        case actionTypes.FETCH_CHANNEL_DATA_FAILED: {
            return {
                ...state,
                channelDataLoading: false,
                channelDataFailed: true,
                channelDataError: false,
                channelDataMessage: null,
                channelData: {},
            };
        };
        case actionTypes.FETCH_CHANNEL_DATA_REJECT: {
            return {
                ...state,
                channelDataLoading: false,
                channelDataFailed: false,
                channelDataError: true,
                channelDataMessage: null,
                channelData: {},
            };
        };




        case actionTypes.FETCH_VIOLATION_REPORT_REASONS_LOADING: {
            return {
                ...state,
                violationReportReasonsLoading: true,
                violationReportReasonsFailed: false,
                violationReportReasonsError: false,
                violationReportReasonsMessage: null,
                violationReportReasons: []
            };
        };
        case actionTypes.FETCH_VIOLATION_REPORT_REASONS_SUCCESSFULLY: {
            return {
                ...state,
                violationReportReasonsLoading: false,
                violationReportReasonsFailed: false,
                violationReportReasonsError: false,
                violationReportReasonsMessage: null,
                violationReportReasons: [...action.payload.options],
            };
        };
        case actionTypes.FETCH_VIOLATION_REPORT_REASONS_FAILED: {
            return {
                ...state,
                violationReportReasonsLoading: false,
                violationReportReasonsFailed: true,
                violationReportReasonsError: false,
                violationReportReasonsMessage: null,
                violationReportReasons: [],
            };
        };
        case actionTypes.FETCH_VIOLATION_REPORT_REASONS_REJECT: {
            return {
                ...state,
                violationReportReasonsLoading: false,
                violationReportReasonsFailed: false,
                violationReportReasonsError: true,
                violationReportReasonsMessage: null,
                violationReportReasons: [],
            };
        };






        case actionTypes.SEND_REPORT_LOADING: {
            return {
                ...state,
                sendReportLoading: true,
                sendReportFailed: false,
                sendReportError: false,
                sendReportMessage: null,
                sendReport: {}
            };
        };
        case actionTypes.SEND_REPORT_SUCCESSFULLY: {
            return {
                ...state,
                sendReportLoading: false,
                sendReportFailed: false,
                sendReportError: false,
                sendReportMessage: null,
                sendReport: { ...action.payload },
            };
        };
        case actionTypes.SEND_REPORT_FAILED: {
            return {
                ...state,
                sendReportLoading: false,
                sendReportFailed: true,
                sendReportError: false,
                sendReportMessage: null,
                sendReport: {},
            };
        };
        case actionTypes.SEND_REPORT_REJECT: {
            return {
                ...state,
                sendReportLoading: false,
                sendReportFailed: false,
                sendReportError: true,
                sendReportMessage: null,
                sendReport: {},
            };
        };



        case actionTypes.NEW_MESSAGE_RECEIVED: {
            return {
                ...state,
                newMessage: action.payload
            }
        }

        default:
            return state
    }
};