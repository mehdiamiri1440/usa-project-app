import React, { Component } from 'react';
import { Text, StyleSheet, Image, View, FlatList, ActivityIndicator, ScrollView, BackHandler } from 'react-native';
import { Button } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { Dialog, Portal, Paragraph } from 'react-native-paper';

import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import { formatter } from '../../utils';
import { deviceWidth, deviceHeight } from '../../utils/deviceDimenssions';
import * as productActions from '../../redux/registerProduct/actions';
import * as registerProductActions from '../../redux/registerProduct/actions';
import ChatModal from '../Messages/ChatModal';
import { TouchableOpacity } from 'react-native-gesture-handler';

class RegisterProductSuccessfully extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subCategoryId: null,
            modalFlag: false,
            selectedBuyAdId: -1,
            showGoldenModal: false,
            selectedContact: {},
            subCategoryName: '',
            loaded: false
        }
    }

    componentDidMount() {
        if (this.props.route && this.props.route.params && this.props.route.params.needToRefreshKey) {
            this.props.fetchBuyAdsAfterPayment();
        }
        // BackHandler.addEventListener('hardwareBackPress', _ => {
        //     this.props.resetRegisterProduct(true)
        //     return false;
        // });
    }

    componentWillUnmount() {
        // BackHandler.removeEventListener('hardwareBackPress');
    }
    // componentDidUpdate(prevProps, prevState) {
    //     console.log('the', this.state.loaded, prevState.loaded)
    //     if (this.state.loaded == false && this.props.route && this.props.route.params && this.props.route.params.needToRefreshKey) {
    //         console.log('called update')
    //         this.props.fetchBuyAdsAfterPayment().then(_ => {
    //             this.setState({ loaded: true })
    //         })
    //     }
    // }

    renderItem = ({ item, index }) => {

        const { selectedButton, userProfile = {}, isUserAllowedToSendMessageLoading } = this.props;
        const { user_info = {} } = userProfile;
        const { active_pakage_type } = user_info;

        return (

            <View
                style={{
                    backgroundColor: index % 2 == 0 ? item.is_golden && active_pakage_type == 0 ? '#FFFFFF' : '#F7FCFF' : '#FFFFFF',
                    width: '100%',
                    padding: 20,
                    borderColor: !!item.is_golden ? '#c7a84f' : '#BEBEBE',
                    borderWidth: 0.5,
                }}
                key={item.id}
            >

                {item.is_golden && active_pakage_type == 0 ?

                    <View style={{
                        minHeight: 90,
                        marginTop: -5,
                        marginLeft: -20
                    }}>

                        <Image source={require('../../../assets/images/blur-items-2.jpg')}
                            style={{
                                zIndex: 0,
                                width: deviceWidth,
                                height: '100%',
                                position: 'absolute',
                                left: 0,
                                top: '35%'
                            }}
                        />
                        <View
                            style={{
                                alignItems: 'center',
                                marginVertical: 10,
                                right: 0,

                                flexDirection: 'row-reverse'
                            }}
                        >

                            <FontAwesome5
                                solid
                                name='user-circle'
                                color='#adadad'
                                size={16}
                            />
                            <Text
                                style={{
                                    marginHorizontal: 5,
                                    color: '#adadad',
                                    fontSize: 16,
                                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                }}
                            >
                                {`${item.first_name} ${item.last_name}`}
                            </Text>
                        </View>
                        <View
                            style={{
                                top: 0,
                                zIndex: 1000,
                                width: deviceWidth,
                                alignItems: 'center',
                                justifyContent: 'center',
                                left: 0,
                                right: 0,
                                marginVertical: 5,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                    textAlign: 'center',
                                    fontSize: 18,
                                    color: '#777777'
                                }}
                            >
                                {locales('labels.buyer')}
                                <Text
                                    style={{
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                        fontSize: 18,
                                        color: '#556083',
                                        marginHorizontal: 2
                                    }}
                                >
                                    {` ${item.subcategory_name} `}
                                </Text>
                                <Text
                                    style={{
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                        fontSize: 18,
                                        marginHorizontal: 2,
                                        color: '#777777'
                                    }}
                                >
                                    {locales('labels.fromType')}
                                </Text>
                                <Text
                                    style={{
                                        color: '#556083',
                                        fontSize: 18,
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                        marginHorizontal: 2
                                    }}
                                >
                                    {` ${item.name} `}
                                </Text>
                                <Text
                                    style={{
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                        fontSize: 18,
                                        marginHorizontal: 2,
                                        color: '#777777'
                                    }}
                                >
                                    {locales('labels.is')}
                                </Text>
                            </Text>

                        </View>
                    </View>

                    : null}

                {item.is_golden && active_pakage_type == 0 ? null : <View
                    style={{
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        marginVertical: 10,
                        flexDirection: 'row-reverse'
                    }}
                >

                    <FontAwesome5
                        solid
                        name='user-circle'
                        color='#adadad'
                        size={16}
                    />
                    <Text
                        style={{
                            marginHorizontal: 5,
                            color: '#adadad',
                            fontSize: 16,
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                        }}
                    >
                        {`${item.first_name} ${item.last_name}`}
                    </Text>
                </View>}

                {item.is_golden && active_pakage_type == 0 ?
                    null
                    :
                    <View
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'row-reverse',
                            marginVertical: 10,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                fontSize: 18,
                                color: '#777777',
                                textAlign: 'center'
                            }}
                        >
                            {locales('labels.buyer')}
                            <Text
                                style={{
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                    fontSize: 18,
                                    color: '#556083',
                                    marginHorizontal: 2
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                        fontSize: 18,
                                        color: '#e41c38',
                                        marginHorizontal: 2
                                    }}
                                > {formatter.convertedNumbersToTonUnit(item.requirement_amount)}</Text> {`${item.subcategory_name} `}
                            </Text>
                            <Text
                                style={{
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                    fontSize: 18,
                                    marginHorizontal: 2,
                                    color: '#777777'
                                }}
                            >
                                {locales('labels.fromType')}
                            </Text>
                            <Text
                                style={{
                                    color: '#556083',
                                    fontSize: 18,
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                    marginHorizontal: 2
                                }}
                            >
                                {` ${item.name} `}
                            </Text>
                            <Text
                                style={{
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                    fontSize: 18,
                                    marginHorizontal: 2,
                                    color: '#777777'
                                }}
                            >
                                {locales('labels.is')}
                            </Text>
                        </Text>

                    </View>
                }

                <View style={{ marginVertical: 15 }}>

                    <Button
                        small
                        onPress={event => {
                            event.preventDefault();
                            event.stopPropagation();
                            this.openChat(event, item)
                        }}
                        style={{
                            borderColor: !!item.is_golden ? '#c7a84f' : '#00C569',
                            width: "80%",
                            position: 'relative',
                            zIndex: 10000,
                            alignSelf: 'center',

                        }}
                    >
                        <LinearGradient
                            start={{ x: 0, y: 0.51, z: 1 }}
                            end={{ x: 0.8, y: 0.2, z: 1 }}
                            colors={!item.is_golden ? ['#00C569', '#00C569', '#00C569'] : ['#c7a84f', '#f9f29f', '#c7a84f']}
                            style={{
                                width: '100%',
                                paddingHorizontal: 10,
                                flexDirection: 'row-reverse',
                                alignItems: 'center',
                                textAlign: 'center',
                                justifyContent: 'center',
                                height: 45,
                                borderRadius: 6,

                            }}
                        >

                            <MaterialCommunityIcons
                                onPress={event => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    this.openChat(event, item)
                                }}
                                name='message' color={!item.is_golden ? 'white' : '#333'} size={16} />
                            <Text
                                onPress={event => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    this.openChat(event, item)
                                }}
                                style={{
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                    fontSize: 18,
                                    color: !item.is_golden ? 'white' : '#333',
                                    paddingHorizontal: 3
                                }}>
                                {locales('labels.messageToBuyer')}


                            </Text>
                            <ActivityIndicator size={20} color={!item.is_golden ? 'white' : '#333'}
                                animating={selectedButton == item.id &&
                                    !!isUserAllowedToSendMessageLoading}
                                style={{
                                    position: 'relative',
                                    width: 10, height: 10, borderRadius: 5,
                                    marginLeft: -10,
                                    marginRight: 5
                                }}
                            />
                        </LinearGradient>

                    </Button>

                </View>
            </View>

        )
    };

    renderListFooterComponent = _ => {
        const {
            route = {},
        } = this.props;

        const {
            params = {}
        } = route;

        let {
            subCategoryId,
            subCategoryName
        } = params;

        return (

            <TouchableOpacity
                onPress={() => {
                    this.props.navigation.navigate('Requests', { subCategoryId, subCategoryName })
                }} style={{
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
                    {locales('titles.otherRelatedBuyads')}

                </Text>
                <Text style={{
                    top: 3
                }}>
                    <FontAwesome5
                        size={15}
                        name='arrow-left'
                        color='#1DA1F2'

                    />
                </Text>
            </TouchableOpacity>

        )
    };

    renderListHeaderComponent = _ => {
        return (
            <View
                style={{
                    padding: 20, marginVertical: 0,
                    backgroundColor: 'white'
                }}
            >
                <Text
                    style={{
                        color: 'black',
                        fontSize: 22,
                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                    }}
                >
                    {locales('labels.buyers')}
                </Text>

                <Text
                    style={{
                        color: '#777777',
                        fontSize: 16,
                        marginVertical: 10,
                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                    }}
                >
                    {locales('labels.suggestedBuyersForYou')} <Text
                        style={{
                            color: '#21AD93',
                            fontSize: 16,
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                        }}
                    >
                        {locales('titles.buskool')}
                    </Text>
                    <Text
                        style={{
                            color: '#777777',
                            fontSize: 16,
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                        }}
                    >
                        {locales('labels.forYourProduct')}
                    </Text>
                </Text>

            </View>

        )
    }

    chooseBuyadsList = (buyAds, buyAdsFromParams, buyAdsAfterPaymentList) => {
        let buyAdsList = [];
        buyAdsList = buyAdsAfterPaymentList.length ? [...buyAdsAfterPaymentList] : buyAds.length ? [...buyAds] : [...buyAdsFromParams];
        return buyAdsList
    };

    openChat = (event, item) => {
        let { userProfile = {} } = this.props;
        const { user_info = {} } = userProfile;
        const { active_pakage_type } = user_info;
        event.stopPropagation()
        event.preventDefault();
        if (!item.is_golden || (item.is_golden && active_pakage_type > 0)) {
            this.setState({ selectedButton: item.id })

            this.setState({
                modalFlag: true,
                selectedBuyAdId: item.id,
                selectedContact: {
                    contact_id: item.myuser_id,
                    first_name: item.first_name,
                    last_name: item.last_name,
                }
            });
            // .catch(_ => this.setState({ showModal: true }));
        }
        else {
            this.setState({ showGoldenModal: true });
        }
    };


    render() {

        const {
            route = {},
            buyAds = [],
            buyAdsAfterPaymentList = [],
            buyAdsAfterPaymentLoading
        } = this.props;

        const {
            params = {}
        } = route;

        let {
            subCategoryId,
            subCategoryName,
            buyAds: buyAdsFromParams = [],
        } = params;

        const {
            modalFlag,
            selectedBuyAdId,
            showGoldenModal,
            selectedContact
        } = this.state;

        subCategoryId = subCategoryId || this.props.subCategoryId;
        subCategoryName = subCategoryName || this.props.subCategoryName;


        return (
            <>



                <Portal
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
                            style={{ fontFamily: 'IRANSansWeb(FaNum)_Bold', color: '#e41c38', paddingHorizontal: 15, textAlign: 'center' }}>
                            {locales('labels.icreaseToSeeGoldens')}
                        </Paragraph>
                        <View style={{
                            width: '100%',
                            textAlign: 'center',
                            alignItems: 'center'
                        }}>
                            <Button
                                style={[styles.modalButton, styles.greenButton, { elevation: 0 }]}
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


                {modalFlag && <ChatModal
                    transparent={false}
                    {...this.props}
                    visible={modalFlag}
                    buyAdId={selectedBuyAdId}
                    contact={{ ...selectedContact }}
                    onRequestClose={() => this.setState({ modalFlag: false })}
                />}
                <ScrollView
                    style={{
                        marginTop: -4,
                        backgroundColor: 'white'
                    }}
                >
                    {buyAdsAfterPaymentList.length ? null :
                        <View
                            style={{
                                backgroundColor: 'rgba(237,248,230,0.6)',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: 20,
                            }}
                        >
                            <View
                                style={{
                                    backgroundColor: 'white',
                                    borderRadius: deviceWidth * 0.1,
                                    height: deviceWidth * 0.2,
                                    width: deviceWidth * 0.2,
                                    borderWidth: 1,
                                    borderColor: 'white',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                <FontAwesome
                                    name='check'
                                    size={50}
                                    color='#21ad93'
                                />
                            </View>
                            <Text
                                style={{
                                    marginVertical: 10,
                                    textAlign: 'center',
                                    color: '#21ad93',
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                    fontSize: 20
                                }}
                            >
                                {locales('titles.productRegisteredSuccessfully')}
                            </Text>
                            <Text
                                style={{
                                    textAlign: 'center',
                                    color: '#21AD93',
                                    paddingHorizontal: 10,
                                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                    fontSize: 16
                                }}
                            >
                                {locales('titles.productdAccepted')}
                            </Text>
                        </View>}

                    <ActivityIndicator size={30} color='#00C569' animating={buyAdsAfterPaymentLoading} />

                    {this.chooseBuyadsList(buyAds, buyAdsFromParams, buyAdsAfterPaymentList).length ?
                        <FlatList
                            keyExtractor={item => item.id.toString()}
                            renderItem={this.renderItem}
                            data={this.chooseBuyadsList(buyAds, buyAdsFromParams, buyAdsAfterPaymentList)}
                            ListHeaderComponent={this.renderListHeaderComponent}
                            ListFooterComponent={this.renderListFooterComponent}
                        />
                        :
                        <View>
                            <Text
                                style={{
                                    color: '#e51c38',
                                    textAlign: 'center',
                                    fontSize: 20,
                                    marginVertical: 10,
                                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                }}
                            >
                                {locales('titles.whoWantsWhat')}
                            </Text>
                            <Button
                                style={[styles.loginButton, {
                                    justifyContent: 'center', width: '75%',
                                    alignItems: 'center', alignSelf: 'center', marginVertical: 20
                                }]}
                                onPress={() => {
                                    this.props.navigation.navigate('Requests', { subCategoryId, subCategoryName })
                                }}
                            >
                                <Text style={styles.buttonText}>
                                    {locales('titles.seeBuyAds')}</Text>
                            </Button>
                        </View>
                    }
                </ScrollView>
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

    greenButton: {
        backgroundColor: '#00C569',
    },
    redButton: {
        backgroundColor: '#E41C39',
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
        alignSelf: 'center',
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
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
        width: '100%',
        textAlign: 'center'
    },
    disableLoginButton: {
        textAlign: 'center',
        margin: 10,
        width: deviceWidth * 0.8,
        color: 'white',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center'
    },
    loginButton: {
        textAlign: 'center',
        margin: 10,
        borderRadius: 4,
        backgroundColor: '#00C569',
        width: '82%',
        height: 60,
        color: 'white',
    },
    forgotContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    forgotPassword: {
        textAlign: 'center',
        color: '#777777',
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
        color: '#777777'
    }
});

const mapDispatchToProps = (dispatch) => {
    return {
        fetchBuyAdsAfterPayment: _ => dispatch(registerProductActions.fetchBuyAdsAfterPayment()),
        resetRegisterProduct: resetTab => dispatch(productActions.resetRegisterProduct(resetTab)),
    }
};
const mapStateToProps = (state) => {
    const {
        buyAdsAfterPaymentLoading,
        buyAdsAfterPaymentFailed,
        buyAdsAfterPaymentError,
        buyAdsAfterPaymentMessage,
        buyAdsAfterPaymentList,
        buyAdsAfterPayment
    } = state.registerProductReducer;

    const {
        userProfile
    } = state.profileReducer;


    return {
        buyAdsAfterPaymentLoading,
        buyAdsAfterPaymentFailed,
        buyAdsAfterPaymentError,
        buyAdsAfterPaymentMessage,
        buyAdsAfterPaymentList,
        buyAdsAfterPayment,

        userProfile
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterProductSuccessfully)