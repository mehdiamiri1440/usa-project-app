import React, { PureComponent, Component } from 'react';
import { Text, TouchableOpacity, View, SafeAreaView, FlatList, StyleSheet, Modal } from 'react-native';
import { Dialog, Portal, Paragraph, Snackbar, ActivityIndicator } from 'react-native-paper';
import RBSheet from "react-native-raw-bottom-sheet";
import { connect } from 'react-redux';
import { useScrollToTop } from '@react-navigation/native';
import { Button, Card, CardItem, Body, Toast } from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import Jmoment from 'moment-jalaali';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import { deviceWidth, deviceHeight } from '../../utils/deviceDimenssions';
import * as profileActions from '../../redux/profile/actions';
import * as buyAdRequestActions from '../../redux/buyAdRequest/actions';
import ChatModal from '../Messages/ChatModal';
import Entypo from 'react-native-vector-icons/dist/Entypo';

import BuyAdList from './BuyAdList';
import NoConnection from '../../components/noConnectionError';

Jmoment.locale('fa')
Jmoment.loadPersian({ dialect: 'persian-modern' });
class Requests extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            selectedButton: null,
            from: 0,
            to: 15,

            showToast: false,
            modalFlag: false,
            showDialog: false,
            selectedBuyAdId: -1,
            selectedContact: {},
            showModal: false
        }
    }

    requestsRef = React.createRef();
    updateFlag = React.createRef();

    componentDidMount() {
        this.initialCalls().catch(_ => this.setState({ showModal: true }))
    }
    componentWillUnmount() {
        this.updateFlag.current.close()
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     console.log('this.props', this.props, 'nextprops', nextProps, 'this.state', this.state, 'nexststate', nextState)
    //     if (this.props.isUserAllowedToSendMessageLoading || (this.props.buyAdRequestLoading && this.props.buyAdRequestsList.length) || this.props.buyAdRequestsList.length)
    //         return false;
    //     return true
    // }

    initialCalls = _ => {
        return new Promise((resolve, reject) => {
            this.props.fetchUserProfile().catch(error => reject(error));
            this.props.fetchAllBuyAdRequests().catch(error => reject(error));
        })

    }

    checkForSendingMessage = (item) => {

    };

    hideDialog = () => this.setState({ showDialog: false });

    openChat = (event, item) => {
        event.preventDefault();
        const { isUserAllowedToSendMessage } = this.props;
        this.setState({ selectedButton: item.id })
        isUserAllowedToSendMessage(item.id).then(() => {
            if (this.props.isUserAllowedToSendMessage) {
                this.setState({
                    modalFlag: true,
                    selectedBuyAdId: item.id,
                    selectedContact: {
                        contact_id: item.myuser_id,
                        first_name: item.first_name,
                        last_name: item.last_name,
                    }
                });
            }
            else {
                this.setState({ showDialog: true })
            }
        }).catch(_ => this.setState({ showModal: true }));
    };

    renderItem = ({ item, index, separators }) => {

        const { selectedButton } = this.state;
        const { isUserAllowedToSendMessageLoading, buyAdRequestsList } = this.props;

        return (
            <BuyAdList
                item={item}
                openChat={this.openChat}
                selectedButton={selectedButton}
                isUserAllowedToSendMessageLoading={isUserAllowedToSendMessageLoading}
                index={index}
                buyAdRequestsList={buyAdRequestsList}
                separators={separators}
            />
        )
    }

    closeModal = _ => {
        this.setState({ showModal: false });
        this.componentDidMount()
    }


    render() {

        let { buyAdRequestsList, userProfile: info, userProfileLoading, isUserAllowedToSendMessageLoading,
            isUserAllowedToSendMessage, buyAdRequestLoading } = this.props;
        let { user_info: userInfo = {} } = info;
        let { modalFlag, selectedContact, selectedButton, showDialog, selectedBuyAdId, from, to } = this.state;
        return (
            <>
                <NoConnection
                    showModal={this.state.showModal}
                    closeModal={this.closeModal}
                />

                {modalFlag && <ChatModal
                    transparent={false}
                    {...this.props}
                    visible={modalFlag}
                    buyAdId={selectedBuyAdId}
                    contact={{ ...selectedContact }}
                    onRequestClose={() => this.setState({ modalFlag: false })}
                />}

                <RBSheet
                    ref={this.updateFlag}
                    closeOnDragDown
                    closeOnPressMask
                    height={300}
                    animationType='slide'
                    customStyles={{
                        draggableIcon: {
                            backgroundColor: "#000"
                        },
                        container: {
                            borderTopLeftRadius: 12,
                            borderTopRightRadius: 12,
                            backgroundColor: '#FAFAFA'
                        }
                    }}
                >

                    <View
                        style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 10 }}
                    >
                        <Text style={{ textAlign: 'center', fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 16, color: 'black' }}>
                            {locales('titles.buyadRequestsWith')} <Text style={{ fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 16, color: '#E41C38' }}>{locales('titles.twoHoursDelay')}</Text> {locales('titles.youWillBeInformed')} .
                                </Text>
                        <Text style={{ textAlign: 'center', fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 16, color: 'black' }}>
                            {locales('titles.onTimeBuyAdRequestAndPromote')}
                        </Text>
                        <Button
                            onPress={() => {
                                this.updateFlag.current.close();
                                this.props.navigation.navigate('MyBuskool', { screen: 'PromoteRegistration' })
                            }}
                            style={{ borderRadius: 5, backgroundColor: '#00C569', alignSelf: 'center', margin: 10, width: deviceWidth * 0.3 }}
                        >
                            <Text style={{ color: 'white', textAlign: 'center', width: '100%' }}>{locales('titles.promoteRegistration')}</Text>
                        </Button>
                    </View>
                </RBSheet>


                < Portal >
                    <Dialog
                        visible={showDialog}
                        onDismiss={this.hideDialog}>
                        <Dialog.Content>
                            <Paragraph style={{ fontFamily: 'IRANSansWeb(FaNum)_Light', textAlign: 'center' }}>
                                {locales('titles.maximumBuyAdResponse')}
                            </Paragraph>
                            <Paragraph
                                style={{ fontFamily: 'IRANSansWeb(FaNum)_Bold', color: 'red' }}>
                                {locales('titles.icreaseYouRegisterRequstCapacity')}
                            </Paragraph>
                        </Dialog.Content>
                        <Dialog.Actions style={{
                            width: '100%',
                            justifyContent: 'space-between',
                            alignItems: 'space-between'
                        }}>
                            <Button
                                style={[styles.closeButton, { width: '30%' }]}
                                onPress={this.hideDialog}>
                                <Text style={styles.buttonText}>{locales('titles.close')}
                                </Text>
                            </Button>
                            <Button
                                style={[styles.loginButton, { width: '30%' }]}
                                onPress={() => {
                                    this.hideDialog();
                                    this.props.navigation.navigate('MyBuskool', { screen: 'ExtraBuyAdCapacity' });
                                }}>
                                <Text style={styles.buttonText}>
                                    {locales('titles.increaseCapacity')}
                                </Text>
                            </Button>

                        </Dialog.Actions>
                    </Dialog>
                </Portal>

                <View style={{
                    backgroundColor: 'white',
                    flexDirection: 'row',
                    alignContent: 'center',
                    alignItems: 'center',
                    height: 57,
                    elevation: 5,
                    justifyContent: 'center'
                }}>
                    <TouchableOpacity
                        style={{ width: 40, justifyContent: 'center', position: 'absolute', right: 0 }}
                        onPress={() => {
                            this.updateFlag.current.close(); this.props.navigation.goBack()
                        }}
                    >
                        <AntDesign name='arrowright' size={25} />
                    </TouchableOpacity>

                    <View style={{
                        width: '100%',
                        alignItems: 'center'
                    }}>
                        <Text
                            style={{ fontSize: 18, fontFamily: 'IRANSansWeb(FaNum)_Bold' }}
                        >
                            {locales('labels.buyRequests')}
                        </Text>
                    </View>
                </View>



                {userInfo.active_pakage_type == 0 && <View style={{
                    shadowOffset: { width: 20, height: 20 },
                    shadowColor: 'black',
                    shadowOpacity: 1.0,
                    elevation: 10, marginHorizontal: 10,
                    backgroundColor: 'white', borderRadius: 6, padding: 6, alignItems: 'center',
                    flexDirection: 'row-reverse', justifyContent: 'space-around', marginTop: 5
                }}
                >
                    <Text style={{ color: '#666666' }}>{locales('titles.requestTooOld')}</Text>
                    <Button
                        small
                        onPress={() => this.updateFlag.current.open()}
                        style={{ backgroundColor: '#E41C38', width: '30%', borderRadius: 6 }}
                    >
                        <Text style={{ color: 'white', textAlign: 'center', width: '100%' }}> {locales('titles.update')}</Text>
                    </Button>
                </View>}



                <SafeAreaView
                    // style={{ padding: 10, height: userInfo.active_pakage_type == 0 ? (deviceHeight * 0.783) : userInfo.active_pakage_type !== 3 ? (deviceHeight * 0.82) : (deviceHeight * 0.8) }}
                    style={{ height: '100%', paddingBottom: 60 }}
                >

                    <FlatList
                        ref={this.props.requestsRef}
                        refreshing={buyAdRequestLoading}
                        onRefresh={() => this.props.fetchAllBuyAdRequests()}
                        keyboardDismissMode='on-drag'
                        keyboardShouldPersistTaps='handled'
                        ListEmptyComponent={() => <View style={{
                            alignSelf: 'center', justifyContent: 'center',
                            alignContent: 'center', alignItems: 'center', width: deviceWidth * 0.9, height: deviceHeight * 0.7
                        }}>
                            <Entypo name='list' size={80} color='#BEBEBE' />
                            <Text style={{ textAlign: 'center', color: '#7E7E7E', fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 17, padding: 15, textAlign: 'center' }}>{locales('titles.noBuyAdFound')}</Text>
                        </View>
                        }
                        data={buyAdRequestsList}
                        extraData={this.state}
                        onEndReachedThreshold={0.2}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={this.renderItem} />

                </SafeAreaView>
            </>
        )
    }
}



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
        width: '80%',
        textAlign: 'center'
    },
    backButtonText: {
        color: '#7E7E7E',
        width: '60%',
        textAlign: 'center'
    },
    closeButton: {
        textAlign: 'center',
        margin: 10,
        backgroundColor: '#777777',
        width: deviceWidth * 0.5,
        color: 'white',
        alignItems: 'center',
        borderRadius: 5,
        alignSelf: 'flex-start',
        justifyContent: 'center'
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
        justifyContent: 'center'
    },
    loginButton: {
        textAlign: 'center',
        margin: 10,
        backgroundColor: '#00C569',
        width: deviceWidth * 0.5,
        color: 'white',
        alignItems: 'center',
        borderRadius: 5,
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
    }
});



const mapStateToProps = (state) => {
    return {
        buyAdRequestLoading: state.buyAdRequestReducer.buyAdRequestLoading,
        buyAdRequestsList: state.buyAdRequestReducer.buyAdRequestList,
        buyAdRequests: state.buyAdRequestReducer.buyAdRequest,


        userProfileLoading: state.profileReducer.userProfileLoading,
        userProfile: state.profileReducer.userProfile,

        isUserAllowedToSendMessage: state.profileReducer.isUserAllowedToSendMessage,
        isUserAllowedToSendMessageLoading: state.profileReducer.isUserAllowedToSendMessageLoading,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllBuyAdRequests: () => dispatch(buyAdRequestActions.fetchAllBuyAdRequests()),
        fetchUserProfile: () => dispatch(profileActions.fetchUserProfile()),
        isUserAllowedToSendMessage: (id) => dispatch(profileActions.isUserAllowedToSendMessage(id))
    }
}



const Wrapper = (props) => {
    const ref = React.useRef(null);

    useScrollToTop(ref);

    return <Requests {...props} requestsRef={ref} />;
}

export default connect(mapStateToProps, mapDispatchToProps)(Wrapper);