import { requester } from '../utils';


export const fetchAllContactsList = (from, to) => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `get_contact_list`,
                method: 'POST',
                // data: {
                //     from,
                //     to
                // },
                withAuth: true,
            })
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                if (err && !err.response)
                    // return reject(err.response);
                    return reject(err);

            });
    });
};



export const fetchAllGroupList = () => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `group/get_groups_list`,
                method: 'POST',
                withAuth: true,
            })
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                if (err && !err.response)
                    // return reject(err.response);
                    return reject(err);

            });
    });
};


export const fetchUserChatHistory = (userId, msgCount = 10) => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `get_user_chat_history`,
                method: 'POST',
                data: {
                    msg_count: msgCount,
                    user_id: userId
                },
                withAuth: true,
            })
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                if (err && !err.response)
                    // return reject(err.response);
                    return reject(err);

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
                withAuth: true,
            })
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                if (err && !err.response)
                    // return reject(err.response);
                    return reject(err);

            });
    });
};



export const sendMessage = (msgObject, buyAdId) => {
    return new Promise((resolve, reject) => {

        if (buyAdId != undefined) {
            requester
                .fetchAPI({
                    route: `send_reply_to_buyAd`,
                    method: 'POST',
                    data: {
                        buy_ad_id: buyAdId,
                        text: msgObject.text
                    },
                    withAuth: true,
                })
                .then(result => {
                    resolve(result);
                })
                .catch(err => {
                    if (err && !err.response)
                        // return reject(err.response);
                        return reject(err);

                });
        }
        else {
            requester
                .fetchAPI({
                    route: `messanger/send_message`,
                    method: 'POST',
                    data: msgObject,
                    withAuth: true,
                })
                .then(result => {
                    resolve(result);
                })
                .catch(err => {
                    if (err && !err.response)
                        // return reject(err.response);
                        return reject(err);

                });
        }



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
                withAuth: true,
            })
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                if (err && !err.response)
                    // return reject(err.response);
                    return reject(err);

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
                withAuth: true,
            })
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                if (err && !err.response)
                    // return reject(err.response);
                    return reject(err);

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
                withAuth: true,
            })
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                if (err && !err.response)
                    // return reject(err.response);
                    return reject(err);

            });
    });
};




export const fetchTotalUnreadMessages = () => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `get_total_unread_messages_for_current_user`,
                method: 'POST',
                withAuth: true,
            })
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                if (err && !err.response)
                    // return reject(err.response);
                    return reject(err);

            });
    });
};



export const fetchChannelData = (page = 1) => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `get_channel_contents`,
                method: 'POST',
                data: {
                    page
                },
                withAuth: true,
            })
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                if (err && !err.response)
                    // return reject(err.response);
                    return reject(err);

            });
    });
};




export const fetchViolationReportReasons = _ => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `get_report_options`,
                method: 'POST',
                withAuth: true,
            })
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                if (err && !err.response)
                    // return reject(err.response);
                    return reject(err);

            });
    });
};




export const sendReportReason = reportObj => {
    return new Promise((resolve, reject) => {
        requester
            .fetchAPI({
                route: `send_user_report`,
                method: 'POST',
                data: reportObj,
                withAuth: true,
            })
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                if (err && !err.response)
                    // return reject(err.response);
                    return reject(err);

            });
    });
};

