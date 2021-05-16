import React, { useState, useEffect } from 'react';
import { Text, FlatList, View, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { Card, CardItem, Body, Button } from 'native-base';
import { Dialog, Portal, Paragraph } from 'react-native-paper';
import Jmoment from 'moment-jalaali';

import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import Fontisto from 'react-native-vector-icons/dist/Fontisto';

import * as requestsActions from '../../../redux/buyAdRequest/actions';
import { deviceHeight, deviceWidth, formatter } from '../../../utils';
import Header from '../../../components/header';

const MyRequests = props => {

    const {
        myRequestsList,
        deleteBuyAdLoading,
        myRequestsLoading
    } = props;

    useEffect(_ => {
        props.fetchMyRequests();
    }, [])

    const [deleteModalFlag, setDeleteModalFlag] = useState(false);

    const deleteBuyAd = id => {
        setDeleteModalFlag(true);
        props.deleteBuyAd(id).then(_ => {
            props.fetchMyRequests();
            setDeleteModalFlag(false);
        })
            .catch(error => console.warn('err', error))
    };

    const renderItem = ({ item }) => {
        const {
            id = '',
            name = '',
            created_at = '',
            updated_at = '',
            requirement_amount = '',
            reply_capacity = '',
            subcategory_name = '',
        } = item;

        return (
            <>
                <Portal
                    style={{
                        padding: 0,
                        margin: 0

                    }}>
                    <Dialog
                        visible={deleteModalFlag}
                        onDismiss={_ => setDeleteModalFlag(false)}
                        style={styles.dialogWrapper}
                    >
                        <Dialog.Actions
                            style={styles.dialogHeader}
                        >
                            <Button
                                onPress={_ => setDeleteModalFlag(false)}
                                style={styles.closeDialogModal}>
                                <FontAwesome5 name="times" color="#777" solid size={18} />
                            </Button>
                            <Paragraph style={styles.headerTextDialogModal}>
                                {locales('labels.deleteBuyAd')}
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
                                {locales('titles.sureToDeleteBuyAd')}
                            </Text>

                        </Dialog.Actions>

                        <View style={{
                            width: '100%',
                            textAlign: 'center',
                            alignItems: 'center'
                        }}>
                            <Button
                                style={[styles.modalButton, styles.redButton, { width: '60%' }]}
                                onPress={_ => deleteBuyAd(id)}
                            >

                                <ActivityIndicator size={20} color='white'
                                    animating={!!deleteBuyAdLoading}
                                    style={{
                                        position: 'relative',
                                        width: 10, height: 10, borderRadius: 5,
                                        marginLeft: -10,
                                        marginRight: 10
                                    }}
                                />
                                <Text style={styles.buttonText}>{locales('titles.deleteIt')}</Text>
                            </Button>
                        </View>

                        <Dialog.Actions style={{
                            justifyContent: 'center',
                            width: '100%',
                            padding: 0
                        }}>
                            <Button
                                style={styles.modalCloseButton}
                                onPress={_ => setDeleteModalFlag(false)}
                            >

                                <Text style={styles.closeButtonText}>{locales('titles.close')}
                                </Text>
                            </Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal >

                <Card
                    style={{
                        borderTopColor: '#374761',
                        borderTopWidth: 5,
                        width: deviceWidth * 0.93,
                        alignSelf: 'center',
                        borderRadius: 7
                    }}
                >
                    <CardItem>
                        <Body>
                            {subcategory_name ? <View
                                style={{
                                    flexDirection: 'row-reverse',
                                    width: '100%',
                                    backgroundColor: 'white',
                                    padding: 10,
                                    justifyContent: 'flex-start',
                                    alignItems: 'center'
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                        color: '#777777',
                                        width: '40%',
                                        textAlign: 'right'
                                    }}
                                    numberOfLines={1}
                                >
                                    {locales('titles.category')}
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                        color: '#374761',
                                        width: '60%',
                                        textAlign: 'center'
                                    }}
                                    numberOfLines={1}
                                >
                                    {subcategory_name}
                                </Text>
                            </View>
                                : null
                            }
                            <View
                                style={{
                                    flexDirection: 'row-reverse',
                                    width: '100%',
                                    backgroundColor: '#F6FBFF',
                                    padding: 10,
                                    justifyContent: 'flex-start',
                                    alignItems: 'center'
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                        color: '#777777',
                                        width: '40%',
                                        textAlign: 'right'
                                    }}
                                    numberOfLines={1}
                                >
                                    {locales('titles.productType')}
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                        color: '#374761',
                                        width: '60%',
                                        textAlign: 'center'
                                    }}
                                    numberOfLines={1}
                                >
                                    {name || locales('labels.notSpecified')}
                                </Text>
                            </View>
                            {requirement_amount ? <View
                                style={{
                                    flexDirection: 'row-reverse',
                                    width: '100%',
                                    backgroundColor: 'white',
                                    padding: 10,
                                    justifyContent: 'flex-start',
                                    alignItems: 'center'
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                        color: '#777777',
                                        width: '40%',
                                        textAlign: 'right'
                                    }}
                                    numberOfLines={1}
                                >
                                    {locales('titles.amountNeeded')}
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                        color: '#374761',
                                        width: '60%',
                                        textAlign: 'center'
                                    }}
                                    numberOfLines={1}
                                >
                                    {formatter.convertedNumbersToTonUnit(requirement_amount)}
                                </Text>
                            </View>
                                : null
                            }
                            {created_at ?
                                <View
                                    style={{
                                        flexDirection: 'row-reverse',
                                        width: '100%',
                                        backgroundColor: '#F6FBFF',
                                        padding: 10,
                                        justifyContent: 'flex-start',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                            color: '#777777',
                                            width: '40%',
                                            textAlign: 'right'
                                        }}
                                        numberOfLines={1}
                                    >
                                        {locales('titles.createdAt')}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                            color: '#374761',
                                            width: '60%',
                                            textAlign: 'center'
                                        }}
                                        numberOfLines={1}
                                    >
                                        {Jmoment(created_at.split(" ")[0]).format('jYYYY/jM/jD')}
                                    </Text>
                                </View>
                                : null
                            }
                            {reply_capacity >= 0 ? <View
                                style={{
                                    flexDirection: 'row-reverse',
                                    width: '100%',
                                    backgroundColor: 'white',
                                    padding: 10,
                                    justifyContent: 'flex-start',
                                    alignItems: 'center'
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                        color: '#777777',
                                        width: '70%',
                                        textAlign: 'right'
                                    }}
                                    numberOfLines={1}
                                >
                                    {locales('titles.countOfRecievedReply')}
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                        color: '#374761',
                                        width: '30%',
                                        textAlign: 'right'
                                    }}
                                    numberOfLines={1}
                                >
                                    {reply_capacity}
                                </Text>
                            </View>
                                : null
                            }
                            {/* {updated_at ? <View
                                style={{
                                    flexDirection: 'row-reverse',
                                    width: '100%',
                                    backgroundColor: '#F6FBFF',
                                    padding: 10,
                                    justifyContent: 'flex-start',
                                    alignItems: 'center'
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                        color: '#777777',
                                        width: '40%',
                                        textAlign: 'right'
                                    }}
                                    numberOfLines={1}
                                >
                                    {locales('titles.status')}:
                            </Text>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                        color: '#374761',
                                        width: '60%',
                                        textAlign: 'center'
                                    }}
                                    numberOfLines={1}
                                >
                                    {updated_at}
                                </Text>
                            </View>
                                : null} */}
                            <TouchableOpacity
                                onPress={_ => setDeleteModalFlag(true)}
                                style={{
                                    flexDirection: 'row-reverse',
                                    width: '100%',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    paddingVertical: 20
                                }}
                            >
                                <FontAwesome5
                                    name='trash'
                                    color='#E61B33'
                                    size={20}
                                />
                                <Text
                                    style={{
                                        fontSize: 18,
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                        color: '#E61B33',
                                        marginHorizontal: 5,
                                        textAlign: 'center'
                                    }}
                                >
                                    {locales('labels.deleteThisRequest')}
                                </Text>
                            </TouchableOpacity>
                        </Body>
                    </CardItem>
                </Card>
            </>
        )
    };

    const renderListEmptyComponent = _ => {
        return (
            !myRequestsLoading ? <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignContent: 'center',
                    height: deviceHeight,
                    width: deviceWidth
                }}
            >
                <Fontisto size={35} name='list-1' color='#777777' />
                <Text
                    style={{
                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                        fontSize: 18,
                        marginTop: 10,
                        color: '#777777'
                    }}
                >
                    {locales('titles.noRequestFound')}.
                </Text>
            </View>
                : null
        )
    };

    const onRefresh = _ => {
        props.fetchMyRequests()
    };

    const renderItemSeparatorComponent = _ => {
        return (
            <View
                style={{
                    paddingVertical: 5
                }
                }>

            </View>
        )
    }

    return (
        <View
            style={{
                backgroundColor: 'white',
                flex: 1
            }}
        >

            <Header
                title={locales('labels.myRequests')}
                shouldShowAuthenticationRibbonFromProps
                {...props}
            />

            <FlatList
                style={{ marginTop: 10 }}
                data={myRequestsList}
                renderItem={renderItem}
                ItemSeparatorComponent={renderItemSeparatorComponent}
                keyExtractor={item => item.id.toString()}
                ListEmptyComponent={renderListEmptyComponent}
                refreshing={myRequestsLoading}
                onRefresh={onRefresh}
            />
        </View>
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
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
        fontSize: 20,
    },
    backButtonText: {
        color: '#7E7E7E',
        width: '60%',
        textAlign: 'center'
    },
    backButtonContainer: {
        textAlign: 'center',
        margin: 10,
        width: deviceWidth * 0.4,
        backgroundColor: 'white',
        alignItems: 'center',
        alignSelf: 'flex-end',
        justifyContent: 'center'
    },
    disableLoginButton: {
        textAlign: 'center',
        margin: 10,
        width: deviceWidth * 0.4,
        color: 'white',
        alignItems: 'center',
        backgroundColor: '#B5B5B5',
        alignSelf: 'flex-start',
        justifyContent: 'center',
    },
    loginButton: {
        textAlign: 'center',
        margin: 10,
        backgroundColor: '#00C569',
        width: deviceWidth * 0.7,
        color: 'white',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 5,
        flexDirection: 'row-reverse',
        justifyContent: 'center',

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
    }
});


const mapStateToProps = (state) => {
    const {
        myRequestsLoading,
        myRequestsFailed,
        myRequestsError,
        myRequestsMessage,
        myRequestsList,
        myRequests,

        deleteBuyAdLoading,
        deleteBuyAdFailed,
        deleteBuyAdError,
        deleteBuyAdMessage,
        deleteBuyAd
    } = state.buyAdRequestReducer;

    return {
        myRequestsLoading,
        myRequestsFailed,
        myRequestsError,
        myRequestsMessage,
        myRequestsList,
        myRequests,

        deleteBuyAdLoading,
        deleteBuyAdFailed,
        deleteBuyAdError,
        deleteBuyAdMessage,
        deleteBuyAd
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
        fetchMyRequests: _ => dispatch(requestsActions.fetchMyRequests()),
        deleteBuyAd: id => dispatch(requestsActions.deleteBuyAd(id))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(MyRequests)