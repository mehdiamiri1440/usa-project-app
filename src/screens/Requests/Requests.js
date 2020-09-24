import React, { PureComponent } from 'react';
import { Text, TouchableOpacity, View, SafeAreaView, FlatList, StyleSheet } from 'react-native';
import { Dialog, Portal, Paragraph } from 'react-native-paper';
import RBSheet from "react-native-raw-bottom-sheet";
import { Navigation } from 'react-native-navigation';
import analytics from '@react-native-firebase/analytics';
import { connect } from 'react-redux';
import { useScrollToTop } from '@react-navigation/native';
import { Button } from 'native-base';
import Jmoment from 'moment-jalaali';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import ContentLoader, { Rect } from "react-content-loader/native"
import AsyncStorage from '@react-native-community/async-storage';

import { deviceWidth, deviceHeight } from '../../utils/deviceDimenssions';
import * as profileActions from '../../redux/profile/actions';
import * as productActions from '../../redux/registerProduct/actions';
import * as buyAdRequestActions from '../../redux/buyAdRequest/actions';
import ChatModal from '../Messages/ChatModal';
import Entypo from 'react-native-vector-icons/dist/Entypo';

import BuyAdList from './BuyAdList';
import NoConnection from '../../components/noConnectionError';
import Filters from './Filters';

Jmoment.locale('fa')
Jmoment.loadPersian({ dialect: 'persian-modern' });
class Requests extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            selectedButton: null,
            from: 0,
            to: 15,
            loaded: false,

            showToast: false,
            modalFlag: false,
            showDialog: false,
            selectedBuyAdId: -1,
            selectedContact: {},
            showFilters: false,
            showGoldenModal: false,
            showModal: false,
            selectedFilterName: ''
        }
    }

    requestsRef = React.createRef();
    updateFlag = React.createRef();

    is_mounted = false;

    componentDidMount() {
        Navigation.events().registerComponentDidAppearListener(({ componentName, componentType }) => {
            if (componentType === 'Component') {
                analytics().setCurrentScreen(componentName, componentName);
            }
        });
        analytics().setCurrentScreen("buyAds", "buyAds");

        this.is_mounted = true;
        if (this.is_mounted == true) {
            AsyncStorage.setItem('@registerProductParams', JSON.stringify({}))
            this.initialCalls()
            // .catch(_ => this.setState({ showModal: true }));
        }
    }

    componentWillUnmount() {
        this.is_mounted = false;
        this.updateFlag.current.close()
    }


    componentDidUpdate(prevProps, prevState) {
        if (prevState.loaded == false && this.props.buyAdRequestsList.length) {
            this.setState({ buyAdRequestsList: this.props.buyAdRequestsList, loaded: true })
        }
        if (this.props.route && this.props.route.params && prevProps.route && prevProps.route.params &&
            this.props.route.params.subCategoryId != prevProps.route.params.subCategoryId) {
            this.checkForFiltering()
        }
    }
    // shouldComponentUpdate(nextProps, nextState) {
    //     console.log('this.props', this.props, 'nextprops', nextProps, 'this.state', this.state, 'nexststate', nextState)
    //     if (this.props.isUserAllowedToSendMessageLoading || (this.props.buyAdRequestLoading && this.props.buyAdRequestsList.length) || this.props.buyAdRequestsList.length)
    //         return false;
    //     return true
    // }

    checkForFiltering = async () => {
        let isFilter = await this.checkForFilterParamsAvailability();
        if (isFilter) {
            this.selectedFilter(this.props.route.params.subCategoryId, this.props.route.params.subCategoryName)
        }
    }

    checkForFilterParamsAvailability = () => {
        return new Promise((resolve, reject) => {
            if (this.props.route.params.subCategoryId >= 0 && this.props.route.params.subCategoryName) {
                resolve(true)
            }
            else {
                resolve(false)
            }
        })
    }

    initialCalls = () => {
        return new Promise((resolve, reject) => {
            this.props.fetchAllBuyAdRequests().then(() => {
                this.checkForFiltering()
            }).catch(error => reject(error));
        })
    }

    checkForSendingMessage = (item) => {

    };

    hideDialog = () => this.setState({ showDialog: false });

    openChat = (event, item) => {
        let { userProfile = {} } = this.props;
        const { user_info = {} } = userProfile;
        const { active_pakage_type } = user_info;

        event.preventDefault();
        if (!item.is_golden || (item.is_golden && active_pakage_type > 0)) {
            this.setState({ selectedButton: item.id })
            this.props.isUserAllowedToSendMessage(item.id).then(() => {
                if (this.props.isUserAllowedToSendMessagePermission.permission) {
                    if (!item.is_golden && item.id) {
                        analytics().logEvent('chat_opened', {
                            buyAd_id: item.id
                        });
                    }
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
                    analytics().logEvent('permission_denied', {
                        golden: false
                    });
                    this.setState({ showDialog: true })
                }
            })
            // .catch(_ => this.setState({ showModal: true }));
        }
        else {
            analytics().logEvent('permission_denied', {
                golden: true
            });
            this.setState({ showGoldenModal: true });
        }
    };

    renderItem = ({ item, index, separators }) => {

        const { selectedButton, buyAdRequestsList } = this.state;
        const { isUserAllowedToSendMessageLoading } = this.props;


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

    closeFilters = _ => {
        this.setState({ showFilters: false }, () => {
            if (this.props.requestsRef && this.props.requestsRef != null && this.props.requestsRef != undefined &&
                this.props.requestsRef.current && this.props.requestsRef.current != null &&
                this.props.requestsRef.current != undefined && this.state.buyAdRequestsList.length > 0 && !this.props.buyAdRequestLoading)
                setTimeout(() => {
                    this.props.requestsRef.current.scrollToIndex({ animated: true, index: 0 });
                }, 300);
        })
    };

    selectedFilter = (id, name) => {
        analytics().logEvent('buyAd_filter', {
            category: name
        })
        this.setState({
            buyAdRequestsList: this.props.buyAdRequestsList.filter(item => item.category_id == id),
            selectedFilterName: name,
        })
    };


    render() {

        let {
            buyAdRequestLoading,
            userProfile = {} } = this.props;

        const { user_info = {} } = userProfile;
        const { active_pakage_type } = user_info;

        let { modalFlag, selectedContact,
            buyAdRequestsList,
            selectedButton, showDialog, selectedBuyAdId, from, to,
            showFilters, selectedFilterName, showGoldenModal } = this.state;
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





                < Portal
                    style={{
                        padding: 0,
                        margin: 0

                    }}>
                    <Dialog
                        visible={showDialog}
                        onDismiss={this.hideDialog}
                        style={styles.dialogWrapper}
                    >
                        <Dialog.Actions
                            style={styles.dialogHeader}
                        >
                            <Button
                                onPress={this.hideDialog}
                                style={styles.closeDialogModal}>
                                <FontAwesome5 name="times" color="#777" solid size={18} />
                            </Button>
                            <Paragraph style={styles.headerTextDialogModal}>
                                {locales('labels.buyRequests')}
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
                                {locales('titles.maximumBuyAdResponse')}
                            </Text>

                        </Dialog.Actions>
                        <Paragraph
                            style={{ fontFamily: 'IRANSansWeb(FaNum)_Bold', color: 'red', paddingHorizontal: 15, textAlign: 'center' }}>
                            {locales('titles.icreaseYouRegisterRequstCapacity')}
                        </Paragraph>
                        <View style={{
                            width: '100%',
                            textAlign: 'center',
                            alignItems: 'center'
                        }}>
                            <Button
                                style={[styles.modalButton, styles.greenButton]}
                                onPress={() => {
                                    this.hideDialog();
                                    this.props.navigation.navigate('MyBuskool', { screen: 'ExtraBuyAdCapacity' });
                                }}
                            >

                                <Text style={styles.buttonText}>{locales('titles.increaseCapacity')}
                                </Text>
                            </Button>
                        </View>




                        <Dialog.Actions style={{
                            justifyContent: 'center',
                            width: '100%',
                            padding: 0
                        }}>
                            <Button
                                style={styles.modalCloseButton}
                                onPress={this.hideDialog}
                            >

                                <Text style={styles.closeButtonText}>{locales('titles.close')}
                                </Text>
                            </Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal >





                < Portal
                    style={{
                        padding: 0,
                        margin: 0

                    }}>
                    <Dialog
                        visible={showGoldenModal}
                        onDismiss={() => { this.setState({ showGoldenModal: false }) }}
                        style={styles.dialogWrapper}
                    >
                        <Dialog.Actions
                            style={styles.dialogHeader}
                        >
                            <Button
                                onPress={() => { this.setState({ showGoldenModal: false }) }}
                                style={styles.closeDialogModal}>
                                <FontAwesome5 name="times" color="#777" solid size={18} />
                            </Button>
                            <Paragraph style={styles.headerTextDialogModal}>
                                {locales('labels.goldenRequests')}
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
                                {locales('labels.accessToGoldensDeined')}
                            </Text>

                        </Dialog.Actions>
                        <Paragraph
                            style={{ fontFamily: 'IRANSansWeb(FaNum)_Bold', color: 'red', paddingHorizontal: 15, textAlign: 'center' }}>
                            {locales('labels.icreaseToSeeGoldens')}
                        </Paragraph>
                        <View style={{
                            width: '100%',
                            textAlign: 'center',
                            alignItems: 'center'
                        }}>
                            <Button
                                style={[styles.modalButton, styles.greenButton]}
                                onPress={() => {
                                    this.setState({ showGoldenModal: false })
                                    this.props.navigation.navigate('MyBuskool', { screen: 'PromoteRegistration' });
                                }}
                            >

                                <Text style={styles.buttonText}>{locales('titles.promoteRegistration')}
                                </Text>
                            </Button>
                        </View>




                        <Dialog.Actions style={{
                            justifyContent: 'center',
                            width: '100%',
                            padding: 0
                        }}>
                            <Button
                                style={styles.modalCloseButton}
                                onPress={() => this.setState({ showGoldenModal: false })}
                            >

                                <Text style={styles.closeButtonText}>{locales('titles.close')}
                                </Text>
                            </Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal >



                <View style={{
                    backgroundColor: 'white',
                    flexDirection: 'row',
                    alignContent: 'center',
                    alignItems: 'center',
                    height: 45,
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



                {/* {userInfo.active_pakage_type == 0 && <View style={{
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
                </View>} */}


                {selectedFilterName ? <View style={{
                    backgroundColor: '#f6f6f6',
                    borderRadius: 6,
                    paddingVertical: 6,
                    paddingHorizontal: 15,
                    alignItems: 'center',
                    flexDirection: 'row-reverse',
                    justifyContent: 'space-around',
                    position: 'relative'
                }}
                >
                    <Button
                        small
                        onPress={() => this.setState({
                            buyAdRequestsList: this.props.buyAdRequestsList,
                            selectedFilterName: ''
                        })}
                        style={{
                            borderWidth: 1,
                            borderColor: '#E41C38',
                            borderRadius: 50,
                            maxWidth: 250,
                            backgroundColor: '#fff',
                            height: 35,
                        }}
                    >
                        <Text style={{
                            textAlign: 'center',
                            width: '100%',
                            color: '#777',
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            fontSize: 17
                        }}>
                            {locales('titles.selectedBuyAdFilter', { fieldName: selectedFilterName })}
                            {/* {selectedFilterName} */}
                        </Text>
                        <FontAwesome5 color="#E41C38" name="times" solid style={{
                            fontSize: 18,
                            position: 'absolute',
                            right: 20,
                        }} />

                    </Button>
                </View> : null}
                <View>
                    {/* 
                <Button
                            style={{
                                flex: 2,
                                justifyContent: 'center',
                                backgroundColor: '#e51c38',
                                marginRight: 15,
                                borderRadius: 4
                            }}
                            onPress={() => this.setState({ buyAdRequestsList: this.props.buyAdRequestsList })}>
                            <Text style={{
                                textAlign: 'center',
                                color: '#fff',
                            }}>
                                {locales('labels.deleteFilter')}
                            </Text>
                        </Button> */}
                </View>
                <SafeAreaView
                    // style={{ padding: 10, height: userInfo.active_pakage_type == 0 ? (deviceHeight * 0.783) : userInfo.active_pakage_type !== 3 ? (deviceHeight * 0.82) : (deviceHeight * 0.8) }}
                    style={{ height: '100%', paddingBottom: 60 }}
                >
                    {showFilters ? <Filters
                        selectedFilter={this.selectedFilter}
                        closeFilters={this.closeFilters}
                        showFilters={showFilters}
                    /> : null}
                    <FlatList
                        ref={this.props.requestsRef}
                        refreshing={buyAdRequestLoading}
                        onRefresh={() => {
                            this.props.fetchAllBuyAdRequests();
                        }}
                        keyboardDismissMode='on-drag'
                        keyboardShouldPersistTaps='handled'
                        ListEmptyComponent={() => !!buyAdRequestLoading ?
                            [1, 2, 3, 4, 5].map((_, index) =>
                                <View
                                    key={index}
                                    style={{
                                        backgroundColor: '#fff',
                                        paddingTop: 25,
                                        paddingBottom: 10,
                                        borderBottomWidth: 2,
                                        borderBottomColor: '#ddd'
                                    }}>
                                    <ContentLoader
                                        speed={2}
                                        width={deviceWidth}
                                        height={deviceHeight * 0.24}
                                        viewBox="0 0 340 160"
                                        backgroundColor="#f3f3f3"
                                        foregroundColor="#ecebeb"
                                    >
                                        <Rect x="50" y="37" rx="3" ry="3" width="242" height="20" />
                                        <Rect x="85" y="3" rx="3" ry="3" width="169" height="20" />
                                        <Rect x="22" y="119" rx="3" ry="3" width="299" height="30" />
                                        <Rect x="116" y="74" rx="3" ry="3" width="105" height="20" />
                                    </ContentLoader>
                                </View>)
                            : <View style={{
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
                        renderItem={this.renderItem}
                        windowSize={10}
                        initialNumToRender={3}
                        maxToRenderPerBatch={3}
                        style={{
                            // paddingHorizontal: 15,
                            marginBottom: selectedFilterName ? 92 : 45
                        }} />

                    <View style={{
                        position: 'absolute',
                        zIndex: 1,
                        bottom: selectedFilterName ? 92 : 45,
                        width: '100%',
                        righ: 0,
                        left: 0,
                        backgroundColor: '#fff',
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        padding: 7,
                        elevation: 5
                    }}>
                        <Button
                            style={{
                                flex: 3,
                                justifyContent: 'center',
                                backgroundColor: '#556080',
                                borderRadius: 4
                            }}
                            onPress={() => this.setState({ showFilters: true })}>
                            <Text style={{
                                textAlign: 'center',
                                color: '#fff',
                                flexDirection: 'row',
                                fontFamily: 'IRANSansWeb(FaNum)_Medium'
                            }}>
                                {locales('titles.categories')}
                            </Text>
                            <FontAwesome5 name="filter" solid color="#fff" style={{
                                marginHorizontal: 5
                            }} />

                        </Button>

                    </View>


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
        marginVertical: 10,
        color: 'white',
        alignItems: 'center',
        borderRadius: 5,
        // alignSelf: 'flex-start',
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
    return {
        buyAdRequestLoading: state.buyAdRequestReducer.buyAdRequestLoading,
        buyAdRequestsList: state.buyAdRequestReducer.buyAdRequestList,
        buyAdRequests: state.buyAdRequestReducer.buyAdRequest,
        userProfile: state.profileReducer.userProfile,
        isUserAllowedToSendMessage: state.profileReducer.isUserAllowedToSendMessage,
        isUserAllowedToSendMessagePermission: state.profileReducer.isUserAllowedToSendMessagePermission,
        isUserAllowedToSendMessageLoading: state.profileReducer.isUserAllowedToSendMessageLoading,

    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllBuyAdRequests: () => dispatch(buyAdRequestActions.fetchAllBuyAdRequests()),
        isUserAllowedToSendMessage: (id) => dispatch(profileActions.isUserAllowedToSendMessage(id)),
        setSubCategoryIdFromRegisterProduct: (id, name) => dispatch(productActions.setSubCategoryIdFromRegisterProduct(id, name))
    }
}



const Wrapper = (props) => {
    const ref = React.useRef(null);

    useScrollToTop(ref);

    return <Requests {...props} requestsRef={ref} />;
}

export default connect(mapStateToProps, mapDispatchToProps)(Wrapper);