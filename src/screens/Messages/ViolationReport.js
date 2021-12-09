import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import { View, Text, Modal, Pressable, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import ShadowView from '@vikasrg/react-native-simple-shadow-view'
import { Button, Textarea, InputGroup, Label } from 'native-base';

import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';

import { deviceHeight, deviceWidth, validator } from '../../utils';
import * as messageActions from '../../redux/messages/actions';

const ViolationReport = props => {

    useEffect(() => {
        props.fetchViolationReportReasons();
    }, [])

    const {
        visible,
        onRequestToClose = _ => { },
        contactId = '',

        violationReportReasonsLoading,
        violationReportReasons,

        sendReportLoading,
    } = props;

    const [showDescriptionModal, setShowDescriptionModal] = useState(false);

    const [description, setDescription] = useState('');

    const [submitModal, setSubmitModal] = useState(false);

    const [descriptionClicked, setDescriptionClicked] = useState(false);
    const [descriptionError, setDescriptionError] = useState('');

    const [reportObj, setReportObj] = useState({});


    const onDescriptionSubmit = field => {
        setDescription(field);
        setDescriptionClicked(!!field)
        setDescriptionError((!field || validator.isValidDescription(field)) ? '' : locales('errors.invalidDescription'));
    };

    const handleReasonSelection = (
        {
            is_description_needed,
            id
        }
    ) => {

        let reportObjectTemp = {
            option_id: id,
            reported_id: contactId,
        };

        if (!!is_description_needed) {
            setReportObj(reportObjectTemp)
            setShowDescriptionModal(true);
        }
        else {
            props.sendReportReason(reportObjectTemp).then(_ => {
                setShowDescriptionModal(true);
                setSubmitModal(true);
            });
        }
    };

    const onSubmit = _ => {
        if (!description) {
            setDescriptionClicked(true);
            setDescriptionError(locales('errors.fieldNeeded', { fieldName: locales('titles.headerDescription') }))
        }
        else if (descriptionError) {
            setDescriptionClicked(true);
            setDescriptionError(locales('errors.invalidDescription'))
        }
        else {
            props.sendReportReason({ ...reportObj, description }).then(_ => {
                setSubmitModal(true);
            });
        }
    };

    const renderItem = ({ item, index }) => {
        return (
            <Pressable
                android_ripple={{
                    color: '#ededed'
                }}
                onPress={_ => handleReasonSelection(item)}
                key={item}
                style={{
                    width: '100%',
                    padding: 15,
                    borderBottomColor: '#f0f0f0',
                    borderBottomWidth: index < violationReportReasons.length - 1 ? 0.8 : 0,
                    flexDirection: 'row-reverse',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}
            >
                <Text
                    style={{
                        fontSize: 16,
                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                        color: '#5b5b5b'
                    }}
                >
                    {item.option_text}
                </Text>
                <FontAwesome5
                    name='angle-left'
                    color='#777777'
                    size={25}
                />
            </Pressable>

        )
    }

    const renderKeyExtractor = item => item.id.toString();

    const renderListEmptyComponent = _ => {
        if (violationReportReasonsLoading)
            return null;
        return (
            <View style={{ flex: 1, height: deviceHeight, width: deviceWidth, justifyContent: 'center', alignItems: 'center' }}>
                <FontAwesome5
                    name='clipboard-list'
                    size={45}
                    color='#BEBEBE'
                />
                <Text
                    style={{ color: '#BEBEBE', fontSize: 20, fontFamily: 'IRANSansWeb(FaNum)_Bold' }}>
                    {locales('labels.emptyList')}
                </Text>
            </View>
        )
    };

    return (
        <Modal
            animationType="fade"
            transparent={false}
            visible={visible}
            onRequestClose={onRequestToClose}
        >

            <ShadowView style={{
                backgroundColor: 'white',
                flexDirection: 'row',
                alignContent: 'center',
                alignItems: 'center',
                height: 45,
                shadowColor: 'black',
                shadowOpacity: 0.13,
                shadowRadius: 1,
                shadowOffset: { width: 0, height: 2 },
                justifyContent: 'center'
            }}>
                <Pressable
                    android_ripple={{
                        color: '#ededed'
                    }}
                    style={{ width: 40, justifyContent: 'center', position: 'absolute', right: 0 }}
                    onPress={onRequestToClose}
                >
                    <FontAwesome5 name='times' size={25} color='#777777' />
                </Pressable>

                <View style={{
                    width: '100%',
                    alignItems: 'center'
                }}>
                    <Text
                        style={{ fontSize: 18, fontFamily: 'IRANSansWeb(FaNum)_Bold' }}
                    >
                        {submitModal ? locales('titles.reportSubmited') : locales('titles.violationReportReason')}
                    </Text>
                </View>
            </ShadowView>

            {!showDescriptionModal ?
                <FlatList
                    data={violationReportReasons}
                    renderItem={renderItem}
                    keyExtractor={renderKeyExtractor}
                    ListEmptyComponent={renderListEmptyComponent}
                />
                :
                (!submitModal ?
                    <View
                        style={{
                            flex: 1,
                            height: deviceHeight,
                            width: deviceWidth,
                            alignItems: 'center',
                            marginTop: 50
                        }}
                    >
                        <Text
                            style={{ fontSize: 18, fontFamily: 'IRANSansWeb(FaNum)_Bold' }}
                        >
                            {locales('titles.writeYourReportDescription')}
                        </Text>
                        <View style={styles.textInputPadding}>
                            {/* <Label style={{ color: 'black', fontFamily: 'IRANSansWeb(FaNum)_Bold', padding: 5, fontSize: 15, marginVertical: 5 }}>
                            {locales('titles.writeYourFinalDescription')}
                        </Label> */}
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
                                    placeholder={locales('titles.writeYourReport')}
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
                            <Label style={{
                                fontFamily: 'IRANSansWeb(FaNum)_Light',
                                height: 20, fontSize: 14, color: '#D81A1A', textAlign: 'center'
                            }}>
                                {!!descriptionError && descriptionError}
                            </Label>
                        </View>

                        <View
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: deviceWidth,
                            }}
                        >
                            <Button
                                onPress={() => !descriptionError && onSubmit()}
                                style={(descriptionError || !description) ? styles.disableLoginButton : styles.loginButton}
                                rounded
                            >
                                {!!sendReportLoading ?
                                    <ActivityIndicator
                                        size={14}
                                        color='white'
                                        style={{
                                            position: 'absolute',
                                            left: '10%'
                                        }}
                                        animating={!!sendReportLoading}
                                    />
                                    : null}
                                <Text style={styles.buttonText}>{locales('titles.submitReport')}</Text>
                            </Button>
                        </View>

                    </View>
                    :
                    <View
                        style={{
                            flex: 1,
                            height: deviceHeight,
                            width: deviceWidth,
                            alignItems: 'center',
                            marginTop: 70,
                            padding: 10
                        }}
                    >
                        <View
                            style={{
                                width: 100,
                                height: 100,
                                borderRadius: 50,
                                borderWidth: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderColor: '#00C569'
                            }}
                        >
                            <FontAwesome5
                                name='check'
                                size={70}
                                color='#00C569'
                            />
                        </View>
                        <Text
                            style={{
                                fontSize: 18, fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                textAlign: 'center', marginTop: 10
                            }}
                        >
                            {locales('titles.thanksForReporting')}
                        </Text>
                        <Text
                            style={{
                                fontSize: 16, fontFamily: 'IRANSansWeb(FaNum)_Light', color: '#777777',
                                textAlign: 'center', marginVertical: 30
                            }}
                        >
                            {locales('titles.reportHelpDescription')}
                        </Text>
                        <Button
                            onPress={onRequestToClose}
                            style={[styles.loginButton, { marginTop: 20 }]}
                            rounded
                        >
                            <Text style={styles.buttonText}>{locales('titles.close')}</Text>
                        </Button>
                    </View>
                )
            }

        </Modal>
    )
};




const styles = StyleSheet.create({
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
        textAlign: 'center',
        width: '90%',
        fontFamily: 'IRANSansWeb(FaNum)_Bold'
    },
    backButtonText: {
        color: '#7E7E7E',
        fontFamily: 'IRANSansWeb(FaNum)_Light',
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
        elevation: 0,
        width: '37%',
        color: 'white',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: '#B5B5B5',
        alignSelf: 'center',
        justifyContent: 'center'
    },
    loginButton: {
        textAlign: 'center',
        elevation: 0,
        backgroundColor: '#FF9828',
        borderRadius: 5,
        width: '37%',
        color: 'white',
        alignItems: 'center',
        alignSelf: 'center',
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
        messagesReducer
    } = state;

    const {
        violationReportReasonsLoading,
        violationReportReasonsFailed,
        violationReportReasonsError,
        violationReportReasonsMessage,
        violationReportReasons,


        sendReportLoading,
        sendReportFailed,
        sendReportError,
        sendReportMessage,
        sendReport,
    } = messagesReducer;

    return {
        violationReportReasonsLoading,
        violationReportReasonsFailed,
        violationReportReasonsError,
        violationReportReasonsMessage,
        violationReportReasons,


        sendReportLoading,
        sendReportFailed,
        sendReportError,
        sendReportMessage,
        sendReport,
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
        fetchViolationReportReasons: _ => dispatch(messageActions.fetchViolationReportReasons()),
        sendReportReason: reportObj => dispatch(messageActions.sendReportReason(reportObj)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ViolationReport);