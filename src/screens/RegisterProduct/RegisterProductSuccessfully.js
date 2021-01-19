import React, { Component } from 'react';
import { Text, StyleSheet, Image, View, FlatList, ActivityIndicator, ScrollView } from 'react-native';
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
import * as registerProductActions from '../../redux/registerProduct/actions';
import ChatModal from '../Messages/ChatModal';

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
                    padding: 20,
                    backgroundColor: index % 2 == 0 ? '#F7FCFF' : '#FFFFFF',
                    width: '100%',
                    borderColor: !!item.is_golden ? '#c7a84f' : '#BEBEBE',
                    borderWidth: 0.5,
                }}
                key={item.id}
            >

                {item.is_golden && active_pakage_type == 0 ?

                    <View style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        left: 0,
                        top: 0,
                        zIndex: 1
                    }}>

                        <Image source={require('../../../assets/images/blur-items-2.jpg')}
                            style={{
                                width: deviceWidth,
                            }}
                        />
                        <View
                            style={{
                                alignItems: 'center',
                                marginVertical: 10,
                                right: -25,
                                position: 'absolute',
                                flexDirection: 'row-reverse'
                            }}
                        >

                            <FontAwesome
                                name='user-circle'
                                color='#adadad'
                                size={20}
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
                        <Text
                            style={{
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                position: 'absolute',
                                top: 50,
                                textAlign: 'center',
                                left: item.name ? deviceWidth * 0.21 : deviceWidth * 0.25,
                                fontSize: 18,
                                color: '#7e7e7e'
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
                                    color: '#7e7e7e'
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
                                    color: '#7e7e7e'
                                }}
                            >
                                {locales('labels.is')}
                            </Text>
                        </Text>

                    </View>

                    : null}

                <View
                    style={{
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        marginVertical: 10,
                        flexDirection: 'row-reverse'
                    }}
                >

                    <FontAwesome
                        name='user-circle'
                        color='#adadad'
                        size={20}
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

                {item.is_golden && active_pakage_type == 0 ?
                    <Text style={{ textAlign: 'center' }}>...</Text>
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
                                color: '#7e7e7e'
                            }}
                        >
                            {locales('labels.buyer')}
                            <Text
                                style={{
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                    fontSize: 18,
                                    color: '#e41c38',
                                    marginHorizontal: 2
                                }}
                            >
                                {` ${formatter.convertedNumbersToTonUnit(item.requirement_amount)} ${item.subcategory_name} `}
                            </Text>
                            <Text
                                style={{
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                    fontSize: 18,
                                    marginHorizontal: 2,
                                    color: '#7e7e7e'
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
                                    color: '#7e7e7e'
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
                                elevation: 2
                            }}
                        >

                            <MaterialCommunityIcons
                                onPress={event => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    this.openChat(event, item)
                                }}
                                name='message' color={!item.is_golden ? 'white' : '#333'} size={14} />
                            <Text
                                onPress={event => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    this.openChat(event, item)
                                }}
                                style={{
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                    fontSize: 16,
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
            <View
                style={{
                    alignSelf: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    width: deviceWidth,
                    flexDirection: 'row-reverse',
                }
                }>
                <Text
                    onPress={() => {
                        this.props.navigation.navigate('Requests', { subCategoryId, subCategoryName })
                    }} style={[styles.buttonText, {
                        color: '#1da6f4', marginTop: 50,
                        paddingBottom: 50, width: '80%',
                        fontFamily: 'IRANSansWeb(FaNum)_Light',
                    }]}>
                    {locales('titles.otherRelatedBuyads')}</Text>
                <FontAwesome5
                    size={17}
                    name='arrow-left'
                    color='#1DA1F2'
                />

            </View>
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
    }
});

const mapDispatchToProps = (dispatch) => {
    return {
        fetchBuyAdsAfterPayment: _ => dispatch(registerProductActions.fetchBuyAdsAfterPayment())
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