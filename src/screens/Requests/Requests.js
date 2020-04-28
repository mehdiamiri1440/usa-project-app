import React from 'react';
import { Text, TouchableOpacity, View, SafeAreaView } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { Button, Card, CardItem, Body } from 'native-base';
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
            modalFlag: false,
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


    render() {

        let { buyAdRequestsList, userProfile: info, userProfileLoading, buyAdRequestLoading } = this.props;
        let { user_info: userInfo = {} } = info;
        let { modalFlag, updateFlag, selectedContact } = this.state;
        return (
            <>
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


                {!updateFlag ?
                    <Spin spinning={buyAdRequestLoading || userProfileLoading}>



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
                            style={{ padding: 10, height: userInfo.active_pakage_type == 0 ? (deviceHeight * 0.72) : userInfo.active_pakage_type !== 3 ? (deviceHeight * 0.82) : (deviceHeight * 0.8) }}
                        >
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
                            </ScrollView>
                        </SafeAreaView>


                    </Spin>
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


const mapStateToProps = (state) => {
    return {
        buyAdRequestLoading: state.buyAdRequestReducer.buyAdRequestLoading,
        buyAdRequestsList: state.buyAdRequestReducer.buyAdRequestList,
        buyAdRequests: state.buyAdRequestReducer.buyAdRequest,


        userProfileLoading: state.profileReducer.userProfileLoading,
        userProfile: state.profileReducer.userProfile
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllBuyAdRequests: () => dispatch(buyAdRequestActions.fetchAllBuyAdRequests()),
        fetchUserProfile: () => dispatch(profileActions.fetchUserProfile())
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Requests);