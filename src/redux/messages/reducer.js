import actionTypes from './actionTypes';
const INITIAL_STATE = {
    contactsListLoading: false,
    contactsListFailed: false,
    contactsListError: false,
    contactsListMessage: null,
    contactsList: [],
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


        default:
            return state
    }
};