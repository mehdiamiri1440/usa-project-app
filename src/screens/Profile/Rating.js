import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Button, Textarea, InputGroup, Label } from 'native-base';
import { Dialog, Portal, Paragraph } from 'react-native-paper';
import { connect } from 'react-redux';

import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import Feather from 'react-native-vector-icons/dist/Feather';

import { deviceWidth, deviceHeight } from '../../utils/deviceDimenssions';
import * as CommentsAndRatingsActions from '../../redux/commentsAndRatings/actions';
import * as profileActions from '../../redux/profile/actions';
import { validator } from '../../utils';

const Rating = props => {

    const {
        userId,

        userAuthorityToPostCommentLoading,
        userAuthorityToPostCommentAndRatings = {},

        rateSubmissionLoading,

        userName = '',
    } = props;

    const descriptionRef = useRef();

    const [description, setDescription] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const [descriptionClicked, setDescriptionClicked] = useState(false);
    const [descriptionVisibility, setDescriptionVisibility] = useState(false);

    const [showModal, setShowModal] = useState(false);

    const [selectedStar, setSelectedStar] = useState({});
    const [stars, setStars] = useState(
        [
            {
                number: 1,
                color: '#BDC4CC',
            },
            {
                number: 2,
                color: '#BDC4CC',
            },
            {
                number: 3,
                color: '#BDC4CC',
            },
            {
                number: 4,
                color: '#BDC4CC',
            },
            {
                number: 5,
                color: '#BDC4CC',
            },
        ]
    );

    useEffect(_ => {
        if (userId)
            props.checkUserAutorityToPostComment(userId)
    }, [userId]);

    const onStarsPressed = (selectedItem) => {
        let tempStars = [...stars]
        tempStars.forEach(item => {
            if (item.number <= selectedItem.number)
                item.color = '#FFBB00';
            else
                item.color = '#BDC4CC';
        });
        setStars(tempStars);
        setSelectedStar(selectedItem);
        setDescriptionVisibility(true);
    };


    const onDescriptionSubmit = field => {
        setDescription(field);
        setDescriptionClicked(!!field);
        setDescriptionError(!field || validator.isValidDescription(field) ? '' : locales('errors.invalidDescription'));
    };


    const submitRating = _ => {
        let rateObj = {
            user_id: userId,
            rating_score: selectedStar.number
        }

        if (description && description.length)
            rateObj.text = description;

        props.submitRating(rateObj).then(_ => {
            setShowModal(true);
        })
    };

    const closeModal = _ => {
        setShowModal(false);
        props.fetchAllProfileInfo(userName);
    };

    if (userAuthorityToPostCommentLoading)
        return (<ActivityIndicator size={50} style={{ marginTop: 20 }} color='#00C569' animating={userAuthorityToPostCommentLoading} />)

    if (userAuthorityToPostCommentAndRatings && userAuthorityToPostCommentAndRatings.is_allowed)
        return (
            <>

                <Portal
                    style={{
                        padding: 0,
                        margin: 0

                    }}>
                    <Dialog
                        visible={showModal}
                        style={styles.dialogWrapper}
                    >
                        <Dialog.Actions
                            style={styles.dialogHeader}
                        >
                            <Button
                                onPress={() => closeModal()}
                                style={styles.closeDialogModal}>
                                <FontAwesome5 name="times" color="#777" solid size={18} />
                            </Button>
                            <Paragraph style={styles.headerTextDialogModal}>
                                {locales('titles.sendComment')}
                            </Paragraph>
                        </Dialog.Actions>
                        <View
                            style={{
                                width: '100%',
                                alignItems: 'center'
                            }}>

                            <Feather name="check" color="#a5dc86" size={70} style={[styles.dialogIcon, {
                                borderColor: '#edf8e6',
                            }]} />

                        </View>
                        <Dialog.Actions style={styles.mainWrapperTextDialogModal}>

                            <Text style={styles.mainTextDialogModal}>
                                {locales('titles.sendCommentDescription')}
                            </Text>

                        </Dialog.Actions>
                        <Dialog.Actions style={{
                            justifyContent: 'center',
                            width: '100%',
                            padding: 0
                        }}>
                            <Button
                                style={styles.modalCloseButton}
                                onPress={() => closeModal()}>

                                <Text style={styles.closeButtonText}>{locales('titles.gotIt')}
                                </Text>
                            </Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>


                <View
                    style={{
                        backgroundColor: '#F6FBFF',
                        padding: 20,
                        borderRadius: 5,
                        borderWidth: 1,
                        borderColor: '#F2F2F2',
                        width: deviceWidth * 0.9,
                        alignSelf: 'center'
                    }}
                >
                    <Text
                        style={{
                            color: '#474747',
                            textAlign: 'center',
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            fontSize: 16
                        }}
                    >
                        {locales('titles.enterYourRate')}
                    </Text>
                    <View
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'row-reverse',
                            marginTop: 5,
                            marginBottom: 20,
                        }}
                    >
                        {stars.map((item) => (
                            <TouchableOpacity
                                style={{ marginHorizontal: 2 }}
                                activeOpacity={1}
                                onPress={_ => onStarsPressed(item)}
                            >
                                <FontAwesome5
                                    name='star'
                                    key={item.number}
                                    color={item.color}
                                    size={40}
                                    solid
                                />
                                <Text
                                    style={{
                                        position: 'absolute',
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                        fontSize: 14,
                                        color: '#777777',
                                        left: item.number <= 1 ? 19 : 18,
                                        top: 12
                                    }}
                                >
                                    {item.number}
                                </Text>
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                        fontSize: 12,
                                        position: 'absolute',
                                        bottom: -25,
                                        width: 55,
                                        right: -5,
                                        color: '#BEBEBE',
                                    }}
                                >
                                    {item.number == 1 ? locales('titles.veryBad') : item.number == 5 ? locales('titles.veryGood') : null}
                                </Text>
                            </TouchableOpacity>
                        )
                        )
                        }
                    </View>
                    {descriptionVisibility ?
                        <>
                            <View style={styles.textInputPadding, { width: '100%', marginTop: 20 }}>
                                <Label style={{
                                    color: '#777777', fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                    fontSize: 15, marginVertical: 5
                                }}
                                >
                                    {locales('titles.putyourCommentHere')}
                                </Label>
                                <InputGroup
                                    regular
                                    style={{
                                        borderRadius: 4,
                                        borderColor: description ? descriptionError ? '#E41C38' : '#00C569' :
                                            descriptionClicked ? '#E41C38' : '#666',
                                        paddingLeft: 15,
                                        paddingHorizontal: 10,
                                        backgroundColor: '#FBFBFB'
                                    }}>
                                    <FontAwesome5 name={
                                        description ? descriptionError ? 'times-circle' : 'check-circle' : descriptionClicked
                                            ? 'times-circle' : 'edit'}
                                        color={description ? descriptionError ? '#E41C38' : '#00C569'
                                            : descriptionClicked ? '#E41C38' : '#BDC4CC'}
                                        size={16}
                                        solid
                                        style={{ position: 'absolute', top: 10, left: 10 }}
                                    />
                                    <Textarea
                                        onChangeText={onDescriptionSubmit}
                                        error=''
                                        value={description}
                                        autoCapitalize='none'
                                        autoCompleteType='off'
                                        autoCorrect={false}
                                        placeholderTextColor='#777777'
                                        placeholder={locales('titles.commentDescriptionWithExample')}
                                        ref={descriptionRef}
                                        style={{
                                            fontFamily: 'IRANSansWeb(FaNum)_Light',
                                            paddingTop: 10,
                                            direction: 'rtl',
                                            textAlign: 'right',
                                            width: '100%'
                                        }}
                                        rowSpan={5}
                                    />
                                </InputGroup>
                                <Label style={{ height: 20, fontSize: 14, color: '#D81A1A' }}>
                                    {!!descriptionError && descriptionError}
                                </Label>
                            </View>
                            <Button
                                onPress={submitRating}
                                style={{
                                    textAlign: 'center',
                                    zIndex: 10005,
                                    borderRadius: 5,
                                    elevation: 0,
                                    padding: 25,
                                    marginBottom: 10,
                                    backgroundColor: '#00C886',
                                    width: '60%',
                                    color: 'white',
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                    justifyContent: 'center',
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold'
                                }}
                                rounded
                            >
                                <View
                                    style={{
                                        flexDirection: 'row', justifyContent: 'center',
                                        alignItems: 'center', width: '100%'
                                    }}>
                                    {rateSubmissionLoading || userAuthorityToPostCommentLoading ?
                                        <ActivityIndicator size="small" color="white" animating={rateSubmissionLoading || userAuthorityToPostCommentLoading} />
                                        : null}
                                    <Text
                                        style={{
                                            color: 'white',
                                            textAlign: 'center',
                                            fontSize: 20,
                                            marginHorizontal: 3,
                                            marginTop: 2,
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold'
                                        }}>{locales('titles.postComment')}</Text>
                                    <FontAwesome5
                                        name='star'
                                        color='#FFBB00'
                                        size={22}
                                        solid
                                    />
                                </View>
                            </Button>
                        </>
                        : null}
                </View>
            </>
        )

    return null;
};




const styles = StyleSheet.create({
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
        top: 0,
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
        color: 'white',
        alignItems: 'center',
        borderRadius: 5,
        alignSelf: 'flex-start',
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
        backgroundColor: '#ddd'
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
    buttonText: {
        color: 'white',
        width: '60%',
        textAlign: 'center',
        fontFamily: 'IRANSansWeb(FaNum)_Bold'
    },
    backButtonText: {
        color: '#7E7E7E',
        width: '60%',
        textAlign: 'center'
    },
    backButtonContainer: {
        textAlign: 'center',
        borderWidth: 1,
        borderColor: '#BDC4CC',
        backgroundColor: 'white',
        alignItems: 'center',
        borderRadius: 5,
        justifyContent: 'center',
        width: '37%',
        elevation: 0,
        margin: 10,
    },
    disableLoginButton: {
        textAlign: 'center',
        margin: 10,
        elevation: 0,
        width: '37%',
        color: 'white',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: '#B5B5B5',
        alignSelf: 'flex-start',
        justifyContent: 'center'
    },
    loginButton: {
        textAlign: 'center',
        margin: 10,
        elevation: 0,
        backgroundColor: '#00C569',
        borderRadius: 5,
        width: '37%',
        color: 'white',
        alignItems: 'center',
        alignSelf: 'flex-start',
        justifyContent: 'center'
    },
    forgotContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    forgotPassword: {
        marginTop: 10,
        textAlign: 'center',
        color: '#7E7E7E',
        fontSize: 16,
        padding: 10,
    },
    enterText: {
        marginTop: 10,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#00C569',
        fontSize: 20,
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
        padding: 20,
    },
    userText: {
        flexWrap: 'wrap',
        paddingTop: '3%',
        fontSize: 20,
        padding: 20,
        textAlign: 'right',
        color: '#7E7E7E'
    },
    labelInputPadding: {
        paddingVertical: 5,
        paddingHorizontal: 20
    }
});


const mapStateToProps = (state) => {
    const {
        rateSubmissionAndRatings,
        rateSubmissionLoading,
        rateSubmissionFailed,
        rateSubmissionError,
        rateSubmissionMessage,

        userAuthorityToPostCommentLoading,
        userAuthorityToPostCommentFailed,
        userAuthorityToPostCommentError,
        userAuthorityToPostCommentMessage,
        userAuthorityToPostCommentAndRatings
    } = state.commentsAndRatingsReducer;

    return {
        rateSubmissionAndRatings,
        rateSubmissionLoading,
        rateSubmissionFailed,
        rateSubmissionError,
        rateSubmissionMessage,

        userAuthorityToPostCommentLoading,
        userAuthorityToPostCommentFailed,
        userAuthorityToPostCommentError,
        userAuthorityToPostCommentMessage,
        userAuthorityToPostCommentAndRatings
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
        submitRating: (rateObj) => dispatch(CommentsAndRatingsActions.submitRating(rateObj)),
        checkUserAutorityToPostComment: (userId) => dispatch(CommentsAndRatingsActions.checkUserAuthorityToPostComment(userId)),
        fetchAllProfileInfo: userName => dispatch(profileActions.fetchAllProfileInfo(userName)),
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(Rating);