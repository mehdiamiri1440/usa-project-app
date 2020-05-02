import actionTypes from './actionTypes';
const INITIAL_STATE = {
    contactsListLoading: false,
    contactsListFailed: false,
    contactsListError: false,
    contactsListMessage: null,
    contactsList: [],


    userChatHistoryLoading: false,
    userChatHistoryFailed: false,
    userChatHistoryError: false,
    userChatHistoryMessage: null,
    userChatHistory: [],


    sendPrivateMessageLoading: false,
    sendPrivateMessageFailed: false,
    sendPrivateMessageError: false,
    sendPrivateMessageMessage: null,


    userProfilePhotoLoading: false,
    userProfilePhotoFailed: false,
    userProfilePhotoError: false,
    userProfilePhotoMessage: null,


    totalUnreadMessagesLoading: false,
    totalUnreadMessagesFailed: false,
    totalUnreadMessagesError: false,
    totalUnreadMessagesMessage: null,
    totalUnreadMessages: {},

    message: false
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
                contactsListMessage: null
            };
        };
        case actionTypes.FETCH_ALL_CONTACTS_LIST_SUCCESSFULLY: {
            return {
                ...state,
                contactsList: [...action.payload.contact_list],
                contactsListLoading: false,
                contactsListFailed: false,
                contactsListError: false,
                contactsListMessage: null,
            };
        };
        case actionTypes.FETCH_ALL_CONTACTS_LIST_FAILED: {
            return {
                ...state,
                contactsList: [],
                contactsListLoading: false,
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
                contactsListError: true,
                contactsListMessage: null
            };
        };



        case actionTypes.FETCH_USER_CHAT_HISTORY_LOADING: {
            return {
                ...state,
                userChatHistory: [],
                userChatHistoryLoading: true,
                userChatHistoryFailed: false,
                userChatHistoryError: false,
                userChatHistoryMessage: null
            };
        };
        case actionTypes.FETCH_USER_CHAT_HISTORY_SUCCESSFULLY: {
            return {
                ...state,
                userChatHistory: [...action.payload.messages],
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
                userChatHistoryLoading: false,
                userChatHistoryFailed: false,
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



        case actionTypes.NEW_MESSAGE_RECEIVED: {
            return {
                ...state,
                message: action.payload
            }
        }

        case actionTypes.EMPTY_MESSAGE_RECEIVED: {
            return {
                ...state,
                message: {}
            }
        }
        case actionTypes.IS_FROM_OUTSIDE: {
            return {
                ...state,
                isFromOutSide: action.payload
            }
        }

        default:
            return state
    }
};