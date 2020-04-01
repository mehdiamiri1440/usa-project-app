import { requester } from '../utils';


export const fetchAllContactsList = () => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `get_contact_list`,
                method: 'POST',
                withAuth: false,
            })
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                return reject(err.response);
            });
    });
};



export const fetchAllGroupList = () => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `group/get_groups_list`,
                method: 'POST',
                withAuth: false,
            })
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                return reject(err.response);
            });
    });
};


export const fetchUserChatHistory = (userId) => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `get_user_chat_history`,
                method: 'POST',
                data: {
                    user_id: userId
                },
                withAuth: false,
            })
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                return reject(err.response);
            });
    });
};



export const fetchGroupChats = (groupId, messageCount) => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `group/get_group_chats`,
                method: 'POST',
                data: {
                    group_id: groupId,
                    message_count: messageCount,
                },
                withAuth: false,
            })
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                return reject(err.response);
            });
    });
};



export const sendMessage = (msgObject) => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `messanger/send_message`,
                method: 'POST',
                data: msgObject,
                withAuth: false,
            })
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                return reject(err.response);
            });
    });
};


export const groupSendMessage = (msgObject) => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `group/send_message`,
                method: 'POST',
                data: {
                    msgObject
                },
                withAuth: false,
            })
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                return reject(err.response);
            });
    });
};



export const subscribeGroupForUser = (groupId) => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `group/subscribe_user`,
                method: 'POST',
                data: {
                    group_id: groupId
                },
                withAuth: false,
            })
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                return reject(err.response);
            });
    });
};



export const fetchUserProfilePhoto = (userId) => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `get_user_last_confirmed_profile_photo`,
                method: 'POST',
                data: {
                    user_id: userId
                },
                withAuth: false,
            })
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                return reject(err.response);
            });
    });
};

