import React from 'react';
import { Text, TouchableOpacity, View, SafeAreaView, FlatList, StyleSheet, ToastAndroid } from 'react-native';
import { Dialog, Portal, Paragraph, Snackbar } from 'react-native-paper';
import { connect } from 'react-redux';
import { Button, Card, CardItem, Body, Toast } from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import Jmoment from 'moment-jalaali';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import { deviceWidth, deviceHeight } from '../../utils/deviceDimenssions';
import * as profileActions from '../../redux/profile/actions';
import * as buyAdRequestActions from '../../redux/buyAdRequest/actions';
import Spin from '../../components/loading/loading';
import ChatModal from '../Messages/ChatModal';


Jmoment.locale('fa')
Jmoment.loadPersian({ dialect: 'persian-modern' });
class Requests extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            updateFlag: false,
            showToast: false,
            modalFlag: false,
            showDialog: false,
            selectedBuyAdId: -1,
            selectedContact: {}
        }
    }

    componentDidMount() {
        this.props.fetchUserProfile();
        this.props.fetchAllBuyAdRequests();
    }
    componentWillUnmount() {
        this.setState({ updateFlag: false })
    }


    checkForSendingMessage = (item) => {
        this.props.isUserAllowedToSendMessage(item.id).then(() => {
            if (this.props.isUserAllowedToSendMessage) {
                this.setState({
                    modalFlag: true,
                    selectedBuyAdId: item.id,
                    selectedContact: {
                        contact_id: item.myuser_id,
                        first_name: item.first_name,
                        last_name: item.last_name
                    }
                });
            }
            else {
                this.setState({ showDialog: true })
            }
        });

    };

    hideDialog = () => this.setState({ showDialog: false });


    render() {

        let { buyAdRequestsList, userProfile: info, userProfileLoading, isUserAllowedToSendMessageLoading,
            isUserAllowedToSendMessage, buyAdRequestLoading } = this.props;
        let { user_info: userInfo = {} } = info;
        let { modalFlag, updateFlag, selectedContact, showToast, showDialog, selectedBuyAdId } = this.state;
        return (
            <>
                {/* <Snackbar
                    onDismiss={() => this.setState({ showToast: false })}
                    duration={2000}
                    style={{
                        backgroundColor: '#5D5D5D', direction: 'rtl',
                        flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
                    }}
                    children={<Text style={{ textAlign: 'center' }}>
                        {locales('titles.remianedCapacityToSendMessageToBuyer')}

                    </Text>}
                    visible={showToast}
                /> */}
                < Portal >
                    <Dialog
                        visible={showDialog}
                        onDismiss={this.hideDialog}>
                        <Dialog.Content>
                            <Paragraph style={{ fontFamily: 'Vazir', textAlign: 'center' }}>
                                {locales('titles.maximumBuyAdResponse')}
                            </Paragraph>
                            <Paragraph
                                style={{ fontFamily: 'Vazir-Bold-FD', color: 'red' }}>
                                {locales('titles.promoteForBuyAd')}
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
                                    this.props.navigation.navigate('PromoteRegistration');
                                }}>
                                <Text style={styles.buttonText}>
                                    {locales('titles.promoteRegistration')}
                                </Text>
                            </Button>

                        </Dialog.Actions>
                    </Dialog>
                </Portal>
                <View style={{
                    backgroundColor: 'white',
                    flexDirection: 'row-reverse',
                    alignContent: 'center',
                    alignItems: 'center',
                    height: 57,
                    shadowOffset: { width: 20, height: 20 },
                    shadowColor: 'black',
                    shadowOpacity: 1.0,
                    elevation: 5,
                    justifyContent: 'center'
                }}>
                    <TouchableOpacity
                        style={{ width: deviceWidth * 0.3, justifyContent: 'center', alignItems: 'flex-end', paddingHorizontal: 10, }}
                        onPress={() => {
                            this.setState({ updateFlag: false }); this.props.navigation.goBack()
                        }}
                    >
                        <AntDesign name='arrowright' size={25} />
                    </TouchableOpacity>
                    <View style={{
                        width: deviceWidth * 0.69,
                        alignItems: 'flex-end'
                    }}>
                        <Text
                            style={{ fontSize: 18 }}
                        >
                            {locales('labels.buyRequests')}
                        </Text>
                    </View>
                </View>


                {
                    !updateFlag ?
                        <Spin spinning={buyAdRequestLoading || userProfileLoading || isUserAllowedToSendMessageLoading}>



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
                                    onPress={() => this.setState({ updateFlag: true })}
                                    style={{ backgroundColor: '#E41C38', width: '30%', borderRadius: 6 }}
                                >
                                    <Text style={{ color: 'white', textAlign: 'center', width: '100%' }}> {locales('titles.update')}</Text>
                                </Button>
                            </View>}



                            <SafeAreaView
                                style={{ padding: 10, height: userInfo.active_pakage_type == 0 ? (deviceHeight * 0.783) : userInfo.active_pakage_type !== 3 ? (deviceHeight * 0.82) : (deviceHeight * 0.8) }}
                            >




                                <FlatList
                                    data={buyAdRequestsList}
                                    keyExtractor={(item) => item.id.toString()}
                                    renderItem={({ item, index, separators }) => (
                                        <View
                                            style={{
                                                padding: 10, backgroundColor: '#FFFFFF', marginVertical: 5,
                                                width: '100%', borderBottomColor: '#DDDDDD',
                                                borderBottomWidth: index < buyAdRequestsList.length - 1 ? 0.7 : 0
                                            }}
                                            key={item.id}
                                        >

                                            <View>
                                                <Text
                                                    numberOfLines={1}
                                                    style={{
                                                        marginVertical: 5,
                                                        flexWrap: 'wrap', width: '100%', textAlign: 'center',
                                                        fontFamily: 'Vazir-Bold-FD', fontSize: 16, color: '#333333'
                                                    }}
                                                >{`${item.category_name} | ${item.subcategory_name} | ${item.name}`}</Text>
                                            </View>


                                            <View>
                                                <Text
                                                    numberOfLines={1}
                                                    style={{
                                                        marginVertical: 5,
                                                        flexWrap: 'wrap', width: '100%', textAlign: 'center',
                                                        fontFamily: 'Vazir-Bold-FD', fontSize: 16, color: '#333333'
                                                    }}
                                                >{`${locales('titles.requirementQuantity')} : ${item.requirement_amount} ${locales('labels.kiloGram')}`}
                                                </Text>
                                            </View>

                                            <View>
                                                <Text
                                                    numberOfLines={1}
                                                    style={{
                                                        marginVertical: 5,
                                                        flexWrap: 'wrap', width: '100%', textAlign: 'center',
                                                        fontFamily: 'Vazir-Bold-FD', fontSize: 16, color: '#333333'
                                                    }}
                                                >
                                                    {Jmoment(item.created_at.split(" ")[0]).format('jD jMMMM , jYYYY')}
                                                </Text>
                                            </View>



                                            <View style={{
                                                marginVertical: 5,
                                                flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
                                            }}>
                                                <Text style={{ color: '#E41C38', fontFamily: 'Vazir-Bold-FD', fontSize: 16, }}>+{item.reply_capacity}</Text>
                                                <MaterialCommunityIcons
                                                    onPress={() => Toast.show({
                                                        text: locales('titles.remianedCapacityToSendMessageToBuyer'),
                                                        position: "bottom",
                                                        style: { borderRadius: 10, bottom: 100, width: '90%', alignSelf: 'center' },
                                                        textStyle: { fontFamily: 'Vazir' },
                                                        duration: 3000
                                                    })}
                                                    name='comment-alert' size={25} color={'#777777'} />
                                            </View>


                                            <View style={{ marginVertical: 5 }}>
                                                <Button
                                                    small
                                                    onPress={() => this.checkForSendingMessage(item)}
                                                    style={{
                                                        backgroundColor: '#00C569',
                                                        borderRadius: 6,
                                                        alignItems: 'center',
                                                        width: "85%",
                                                        alignSelf: 'center',
                                                        justifyContent: 'center',
                                                        paddingHorizontal: 10,
                                                        flexDirection: 'row-reverse'
                                                    }}
                                                >
                                                    <MaterialCommunityIcons name='message' color='white' size={14} />
                                                    <Text style={{
                                                        fontFamily: 'Vazir-Bold-FD', fontSize: 14,
                                                        color: 'white', paddingHorizontal: 3
                                                    }}>
                                                        {locales('labels.messageToBuyer')}
                                                    </Text>
                                                </Button>
                                            </View>
                                        </View>

                                    )} />



                                {modalFlag && <ChatModal
                                    transparent={false}
                                    {...this.props}
                                    visible={modalFlag}
                                    buyAdId={selectedBuyAdId}
                                    contact={{ ...selectedContact }}
                                    onRequestClose={() => this.setState({ modalFlag: false }, () => {
                                        this.props.fetchAllBuyAdRequests();
                                    })}
                                />}






                                {/* 




                            <ScrollView
                            >

                                {modalFlag && <ChatModal
                                    transparent={false}
                                    visible={modalFlag}
                                    contact={{ ...selectedContact }}
                                    onRequestClose={() => this.setState({ modalFlag: false })}
                                />}


                                <Card
                                >
                                    <CardItem>
                                        <Body>
                                            {buyAdRequestsList.map((buyAd, index, self) => (
                                                <View
                                                    style={{
                                                        padding: 10,
                                                        width: '100%', borderBottomColor: '#DDDDDD',
                                                        borderBottomWidth: index < self.length - 1 ? 0.7 : 0
                                                    }}
                                                    key={buyAd.id}
                                                >
                                                    <View
                                                        style={{
                                                            flexDirection: 'row-reverse',
                                                            alignItems: 'flex-start',
                                                            justifyContent: 'space-between',
                                                        }}
                                                    >
                                                        <Text
                                                            numberOfLines={1}
                                                            style={{
                                                                flexWrap: 'wrap', width: '75%',
                                                                fontFamily: 'Vazir-Bold-FD', fontSize: 16, color: '#666666'
                                                            }}
                                                        >{`${buyAd.category_name} | ${buyAd.subcategory_name} | ${buyAd.name}`}</Text>
                                                        <Text
                                                            numberOfLines={1}
                                                            style={{ color: '#666666', width: '40%', flexWrap: 'wrap' }}
                                                        >
                                                            {Jmoment(buyAd.created_at.split(" ")[0]).format('jD jMMMM , jYYYY')}
                                                        </Text>
                                                    </View>


                                                    <View
                                                        style={{
                                                            alignItems: 'center',
                                                            flexDirection: 'row-reverse',
                                                            justifyContent: 'space-between'
                                                        }}
                                                    >
                                                        <Text
                                                            numberOfLines={1}
                                                            style={{ color: '#666666', width: '70%' }}
                                                        >{`${locales('titles.requirementQuantity')} : ${buyAd.requirement_amount} ${locales('labels.kiloGram')}`}
                                                        </Text>
                                                        <Button
                                                            onPress={() => this.setState({
                                                                modalFlag: true,
                                                                selectedContact: {
                                                                    contact_id: buyAd.myuser_id,
                                                                    first_name: buyAd.first_name,
                                                                    last_name: buyAd.last_name
                                                                }
                                                            })}
                                                            small
                                                            style={{
                                                                backgroundColor: '#00C569',
                                                                borderRadius: 6,
                                                                paddingHorizontal: 10,
                                                                flexDirection: 'row-reverse'
                                                            }}
                                                        >
                                                            <MaterialCommunityIcons name='message' color='white' size={18} />
                                                            <Text style={{
                                                                color: 'white', paddingHorizontal: 3
                                                            }}>
                                                                {locales('labels.messageToBuyer')}
                                                            </Text>
                                                        </Button>
                                                    </View>
                                                </View>
                                         
                                         ))}

                                            {userInfo.active_pakage_type !== 3 && <View style={{ paddingTop: 5 }}>
                                                <Text style={{ textAlign: 'center', color: '#7E7E7E', fontFamily: 'Vazir-Bold-FD', fontSize: 18 }}>
                                                    {locales('titles.maxBuyAdRequestsShownToYou')}<Text style={{ color: 'red', fontFamily: 'Vazir-Bold-FD', fontSize: 18 }}> {userInfo.active_pakage_type < 3 ? ((userInfo.active_pakage_type + 1) * 5) : locales('titles.unlimited')} </Text>{locales('titles.is')}.
                            </Text>
                                                <Button
                                                    onPress={() => this.props.navigation.navigate('PromoteRegistration')}
                                                    style={{ borderRadius: 5, backgroundColor: '#00C569', alignSelf: 'center', margin: 10, width: deviceWidth * 0.3 }}
                                                >
                                                    <Text style={{ color: 'white', textAlign: 'center', width: '100%' }}>{locales('titles.promoteRegistration')}</Text>
                                                </Button>
                                            </View>}
                                        </Body>
                                    </CardItem>
                                </Card>
                            </ScrollView> */}

                            </SafeAreaView>


                        </Spin >
                        :
                        <View
                            style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 10 }}
                        >
                            <Card
                                style={{ width: '100%' }}
                            >
                                <CardItem>
                                    <Body>
                                        <Text style={{ textAlign: 'center', fontFamily: 'Vazir-Bold-FD', fontSize: 16, color: 'black' }}>
                                            {locales('titles.buyadRequestsWith')} <Text style={{ fontFamily: 'Vazir-Bold-FD', fontSize: 16, color: '#E41C38' }}>{locales('titles.twoHoursDelay')}</Text> {locales('titles.youWillBeInformed')} .
                                </Text>
                                        <Text style={{ textAlign: 'center', fontFamily: 'Vazir-Bold-FD', fontSize: 16, color: 'black' }}>
                                            {locales('titles.onTimeBuyAdRequestAndPromote')}
                                        </Text>
                                        <Button
                                            onPress={() => this.props.navigation.navigate('PromoteRegistration')}
                                            style={{ borderRadius: 5, backgroundColor: '#00C569', alignSelf: 'center', margin: 10, width: deviceWidth * 0.3 }}
                                        >
                                            <Text style={{ color: 'white', textAlign: 'center', width: '100%' }}>{locales('titles.promoteRegistration')}</Text>
                                        </Button>
                                    </Body>
                                </CardItem>
                            </Card>
                        </View>
                }

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
export default connect(mapStateToProps, mapDispatchToProps)(Requests);