import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Dialog, Portal, Paragraph, Button } from 'react-native-paper';
import { connect } from 'react-redux';
import Jmoment from 'moment-jalaali';

import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';

import * as commentsActions from '../../redux/commentsAndRatings/actions';
import * as profileActions from '../../redux/profile/actions';
import { deviceWidth, deviceHeight } from '../../utils/deviceDimenssions';
import StarRating from '../../components/StarRating';

const Comments = props => {

    const {
        userId,
        loggedInUserId,
        commentsAndRatings = {},
        fullName = '',
        userName = '',

        deleteCommentLoading,
        commentsLoading
    } = props;

    const [commentsList, setCommentsList] = useState([]);
    const [commentsListSliceToShow, setCommentsListSliceToShow] = useState(3);
    const [showModal, setShowModal] = useState(false);
    const [selectedCommentId, setSelectedCommentId] = useState(null);

    useEffect(_ => {
        if (userId)
            props.fetchAllComments(userId).then(result => {
                setCommentsList([...result.payload.comments]);
            });
    }, [userId]);


    const renderListHeaderComponent = _ => {
        if (commentsList && commentsList.length)
            return (
                <View
                    style={{
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                        width: deviceWidth,
                        padding: 20,
                    }}
                >
                    <Text
                        style={{
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            fontSize: 18,
                            color: '#666666'
                        }}
                    >
                        {locales('titles.usersComments')}
                    </Text>
                </View>
            )
        return null;
    };

    const handleShowMore = _ => {
        setCommentsListSliceToShow(commentsListSliceToShow == commentsList.length ? 3 : commentsList.length);
    };

    const renderListFooterComponent = _ => {
        if (commentsList && commentsList.length > 3)
            return (
                <TouchableOpacity
                    onPress={handleShowMore}
                    style={{
                        marginTop: 50,
                        paddingBottom: 50,
                        flexDirection: 'row-reverse',
                        width: deviceWidth,
                        justifyContent: 'center',
                        backgroundColor: 'white',

                    }}>
                    <Text style={{
                        color: '#1da6f4',
                        fontSize: 16,
                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                        marginLeft: 5,
                    }}>
                        {commentsListSliceToShow != commentsList.length ? locales('titles.showAllComments') : locales('titles.close')}
                    </Text>
                    <FontAwesome5
                        size={15}
                        style={{ top: 3 }}
                        name={commentsListSliceToShow != commentsList.length ? 'arrow-down' : 'arrow-up'}
                        color='#1DA1F2'

                    />
                </TouchableOpacity>
            )
        return null;
    };

    const handleLikeChange = id => {
        let tempCommentsList = [...commentsList];
        let selectedComment = tempCommentsList.find(item => item.c_id == id)
        selectedComment.likes = !selectedComment.already_liked ? selectedComment.likes + 1 : selectedComment.likes - 1;
        selectedComment.already_liked = !selectedComment.already_liked;
        setCommentsList(tempCommentsList);

        const likingObj = {
            comment_id: selectedComment.c_id,
            action: selectedComment.already_liked
        };
        props.likeOrDisLikeComment(likingObj);
    };

    const renderItemSeparatorComponent = _ => {
        return (
            <View
                style={{
                    marginVertical: 10
                }}
            >
            </View>
        )
    };

    const deleteComment = _ => {
        props.deleteComment(selectedCommentId).then(_ => {
            setShowModal(false);
            props.fetchAllProfileInfo(userName);
        });
    };

    const renderListEmptyComponent = _ => {
        if (fullName && userId && commentsAndRatings.deleted_count > 0)
            return null;
        return (
            <View style={{
                alignSelf: 'center', justifyContent: 'flex-start',
                alignContent: 'center', alignItems: 'center', width: deviceWidth * 0.93,

            }}>
                <FontAwesome5 name='comment-alt' solid size={80} color='#BEBEBE' />
                <Text style={{
                    color: '#7E7E7E', fontFamily: 'IRANSansWeb(FaNum)_Bold',
                    fontSize: 17, padding: 15, textAlign: 'center'
                }}
                >
                    {locales('titles.noComment')}</Text>
            </View>
        )
    };

    const renderItem = ({ item }) => {
        return (
            <View
                style={{
                    elevation: 0,
                    width: deviceWidth * 0.95,
                    alignSelf: 'center',
                    borderWidth: 1,
                    borderRadius: 6,
                    borderColor: '#BDC4CC',
                }}
            >
                <View
                    style={{
                        borderBottomColor: '#BDC4CC',
                        borderBottomWidth: 1,
                        width: '100%',
                        flexDirection: 'row-reverse',
                        justifyContent: 'space-between',
                        paddingHorizontal: 10,
                        paddingVertical: 10
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row-reverse',
                        }}
                    >
                        <Text
                            numberOfLines={1}
                            style={{
                                color: '#313A43',
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                fontSize: 16,
                                maxWidth: '60%',
                                textAlign: 'right'
                            }}
                        >
                            {`${item.first_name} ${item.last_name}`}
                        </Text>

                        <Text
                            numberOfLines={1}
                            style={{
                                color: '#777777',
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                fontSize: 14,
                                marginHorizontal: 10,
                                marginTop: 2,
                                maxWidth: '50%',
                                textAlign: 'center'
                            }}
                        >
                            {`${item.province}-${item.city}`}
                        </Text>
                    </View>

                    <Text
                        numberOfLines={1}
                        style={{
                            color: '#BDC4CC',
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            fontSize: 13,
                            textAlign: 'right'
                        }}
                    >
                        {Jmoment(item.created_at).format('jYYYY/jMM/jDD')}
                    </Text>
                </View>
                <View
                    style={{ padding: 10 }}>
                    <View
                        style={{
                            width: '100%',
                            flexDirection: 'row-reverse',
                            paddingVertical: 10
                        }}
                    >
                        <StarRating
                            starsCount={5}
                            defaultRate={item.rating_score}
                            showNumbers
                            disable={true}
                            color='#FFBB00'
                            size={26}
                        />
                    </View>
                    <Text
                        style={{
                            fontSize: 14,
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            color: '#777777',
                            textAlign: 'right',
                            marginVertical: 10,
                            width: '100%'

                        }}
                    >
                        {item.text}
                    </Text>
                    <TouchableOpacity
                        onPress={_ => handleLikeChange(item.c_id)}
                        style={{
                            flexDirection: 'row-reverse',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%'
                        }}
                    >
                        <Text
                            style={{
                                color: item.already_liked ? '#00C569' : '#1DA1F2',
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                marginHorizontal: 3
                            }}
                        >
                            {item.likes}
                        </Text>
                        <FontAwesome5
                            name='thumbs-up'
                            size={18}
                            solid={!!item.already_liked}
                            color={item.already_liked ? '#00C569' : '#1DA1F2'}
                        />
                        <Text
                            style={{
                                color: item.already_liked ? '#666666' : '#1DA1F2',
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                marginHorizontal: 3
                            }}
                        >
                            {locales(item.already_liked ? 'titles.likedIt' : 'titles.likeIt')}
                        </Text>
                    </TouchableOpacity>
                    {loggedInUserId == userId ? <Text
                        onPress={_ => {
                            setSelectedCommentId(item.c_id);
                            setShowModal(true);
                        }}
                        style={{
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            fontSize: 16,
                            width: '100%',
                            marginVertical: 10,
                            textAlign: 'center',
                            color: '#E41C38'
                        }}
                    >
                        {locales('titles.deleteComment')}
                    </Text> : null}
                </View>
            </View>
        )
    };

    if (commentsLoading)
        return (<ActivityIndicator size={50} color='#00C569' style={{ marginTop: 50 }} />)

    return (
        <View>

            <Portal
                style={{
                    padding: 0,
                    margin: 0

                }}>
                <Dialog
                    visible={showModal}
                    onDismiss={_ => setShowModal(false)}
                    style={styles.dialogWrapper}
                >
                    <Dialog.Actions
                        style={styles.dialogHeader}
                    >
                        <Button
                            onPress={() => setShowModal(false)}
                            style={styles.closeDialogModal}>
                            <FontAwesome5 name="times" color="#777" solid size={18} />
                        </Button>
                        <Paragraph style={styles.headerTextDialogModal}>
                            {locales('titles.deleteCommentTitle')}
                        </Paragraph>
                    </Dialog.Actions>
                    <View
                        style={{
                            width: '100%',
                            alignItems: 'center'
                        }}>

                        <AntDesign name="exclamation" color="#f8bb86" size={70} style={[styles.dialogIcon, {
                            borderColor: '#facea8',
                        }]} />

                    </View>
                    <Dialog.Actions style={styles.mainWrapperTextDialogModal}>

                        <Text style={styles.mainTextDialogModal}>
                            {locales('labels.deleteCommentDescription')}
                        </Text>

                    </Dialog.Actions>
                    <Dialog.Actions style={{
                        justifyContent: 'center',
                        width: '100%',
                        padding: 0
                    }}>
                        <Button
                            style={[styles.modalButton, styles.redButton]}
                            onPress={() => deleteComment()}
                        >

                            <Text style={styles.buttonText}>
                                {locales('titles.deleteIt')}
                            </Text>

                            <ActivityIndicator animating={deleteCommentLoading} color='white' size={15} />
                        </Button>
                    </Dialog.Actions>

                    <Dialog.Actions style={{
                        justifyContent: 'center',
                        width: '100%',
                        padding: 0
                    }}>
                        <Button
                            style={styles.modalCloseButton}
                            onPress={_ => setShowModal(false)}
                        >

                            <Text style={styles.closeButtonText}>{locales('titles.close')}
                            </Text>
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal >


            {fullName && userId && commentsAndRatings.deleted_count > 0 ? <Text
                style={{
                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                    fontSize: 18,
                    width: '100%',
                    marginBottom: 10,
                    marginTop: 30,
                    textAlign: 'center',
                    color: '#E41C38'
                }}
            >
                {locales('titles.countOfDeletedComments', { count: commentsAndRatings.deleted_count, name: fullName })}
            </Text> : null}
            <FlatList
                renderItem={renderItem}
                ListHeaderComponent={renderListHeaderComponent}
                ListFooterComponent={renderListFooterComponent}
                ListEmptyComponent={renderListEmptyComponent}
                data={commentsList.slice(0, commentsListSliceToShow)}
                ItemSeparatorComponent={renderItemSeparatorComponent}
                keyExtractor={(_, index) => index.toString()}
            />
        </View>
    )
};



const styles = StyleSheet.create({
    cardWrapper: {
        width: deviceWidth,
        paddingHorizontal: deviceWidth * 0.025,
        alignSelf: 'center',
    },
    cardItemStyle: {
        borderRadius: 7,
        width: '100%',
        backgroundColor: '#fff',
        elevation: 0,
        borderWidth: 2,
    },
    loginFailedContainer: {
        backgroundColor: '#F8D7DA',
        padding: 10,
        borderRadius: 5
    },
    loginFailedText: {
        textAlign: 'center',
        width: deviceWidth,
        color: '#761C24'
    },
    deletationSuccessfullContainer: {
        backgroundColor: '#00C569',
        padding: 10,
        borderRadius: 5
    },
    deletationSuccessfullText: {
        textAlign: 'center',
        width: deviceWidth,
        color: 'white'
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
        width: '100%',
        textAlign: 'center',
    },
    disableLoginButton: {
        textAlign: 'center',
        margin: 10,
        width: '100%',
        color: 'white',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center'
    },
    loginButton: {
        textAlign: 'center',
        marginVertical: 10,
        width: '100%',
        height: 40,
        elevation: 0,
        borderRadius: 4,
        backgroundColor: '#FF9828',
        color: 'white',
    },
    dialogWrapper: {
        borderRadius: 12,
        padding: 0,
        margin: 0,
        overflow: "hidden"
    },
    dialogHeader: {
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5',
        padding: 0,
        margin: 0,
        position: 'relative',
    },
    closeDialogModal: {
        position: "absolute",
        top: -15,
        right: 0,
        padding: 15,
        height: '100%',
        backgroundColor: 'transparent',
        elevation: 0
    },
    headerTextDialogModal: {
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
        textAlign: 'center',
        fontSize: 17,
        paddingTop: 11,
        color: '#474747'
    },
    mainWrapperTextDialogModal: {
        width: '100%',
        marginBottom: 0
    },
    mainTextDialogModal: {
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
        color: '#777',
        textAlign: 'center',
        fontSize: 15,
        paddingHorizontal: 15,
        width: '100%'
    },
    modalButton: {
        textAlign: 'center',
        width: '100%',
        fontSize: 16,
        maxWidth: 145,
        marginVertical: 10,
        color: 'white',
        alignItems: 'center',
        borderRadius: 5,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    modalCloseButton: {
        textAlign: 'center',
        width: '100%',
        fontSize: 16,
        color: 'white',
        alignItems: 'center',
        alignSelf: 'flex-start',
        justifyContent: 'center',
        elevation: 0,
        borderRadius: 0,
        backgroundColor: '#ddd',
        marginTop: 10
    },
    closeButtonText: {
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
        color: '#555',
    },
    dialogIcon: {

        height: 80,
        width: 80,
        textAlign: 'center',
        borderWidth: 4,
        borderRadius: 80,
        paddingTop: 5,
        marginTop: 20

    },
    greenButton: {
        backgroundColor: '#00C569',
    },
    redButton: {
        backgroundColor: '#E41C39',
    },
    forgotContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    forgotPassword: {
        textAlign: 'center',
        color: '#7E7E7E',
        fontSize: 16,
        padding: 10,
    },
    linearGradient: {
        height: deviceHeight * 0.15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTextStyle: {
        color: 'white',
        position: 'absolute',
        textAlign: 'center',
        fontSize: 26,
        bottom: 40
    },
    textInputPadding: {
        paddingVertical: 5,
    },
    userText: {
        flexWrap: 'wrap',
        paddingTop: '3%',
        fontSize: 20,
        padding: 20,
        textAlign: 'center',
        color: '#7E7E7E'
    },
    fontAwesomeEnvelope: {
        color: "#fff",
        margin: '15px'
    },
    textWhite: {
        color: "#fff"
    },
    textCenterView: {
        justifyContent: 'center',
        flexDirection: "row-reverse",
    },
    textBold: {
        fontFamily: 'IRANSansWeb(FaNum)_Bold'
    },
    actionsWrapper: {
        flexDirection: 'row-reverse',
        flex: 1,
        justifyContent: 'center',

    },
    elevatorIcon: {
        backgroundColor: '#7E7E7E',
        padding: 10,
        borderRadius: 4,
        height: 40,
        marginTop: 10,
        marginRight: 15
    },
    marginTop5: {
        marginTop: 5
    },
    marginTop10: {
        marginTop: 10
    },
    margin5: {
        margin: 5
    },
    margin10: {
        margin: 10
    },
    textSize18: {
        fontSize: 18
    }
});


const mapStateToProps = (state) => {
    const {
        commentsList,
        commentsAndRatings,
        commentsLoading,
        commentsFailed,
        commentsError,
        commentsMessage,

        deleteComment,
        deleteCommentLoading,
        deleteCommentFailed,
        deleteCommentError,
        deleteCommentMessage,
    } = state.commentsAndRatingsReducer;

    const {
        loggedInUserId
    } = state.authReducer
    return {
        commentsList,
        commentsAndRatings,
        commentsLoading,
        commentsFailed,
        commentsError,
        commentsMessage,

        loggedInUserId,


        deleteComment,
        deleteCommentLoading,
        deleteCommentFailed,
        deleteCommentError,
        deleteCommentMessage,
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllComments: userId => dispatch(commentsActions.fetchAllComments(userId)),
        likeOrDisLikeComment: likingObj => dispatch(commentsActions.likeOrDisLikeComment(likingObj)),
        deleteComment: id => dispatch(commentsActions.deleteComment(id)),
        fetchAllProfileInfo: userName => dispatch(profileActions.fetchAllProfileInfo(userName)),
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(Comments);