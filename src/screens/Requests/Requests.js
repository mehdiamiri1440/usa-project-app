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



Jmoment.loadPersian({ dialect: 'persian-modern' });
class Requests extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalFlag: false
        }
    }

    componentDidMount() {
        this.props.fetchUserProfile();
        this.props.fetchAllBuyAdRequests();
    }



    render() {

        let { buyAdRequestsList, userProfile, userProfileLoading, buyAdRequestLoading } = this.props;

        let { modalFlag } = this.state;

        console.warn('buyadd-->', userProfile)
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
                        onPress={() => this.props.navigation.goBack()}
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




                <Spin spinning={buyAdRequestLoading || userProfileLoading}>



                    {userProfile.active_pakage_type == 2 && <View style={{
                        shadowOffset: { width: 20, height: 20 },
                        shadowColor: 'black',
                        shadowOpacity: 1.0,
                        elevation: 10, marginHorizontal: 10,
                        backgroundColor: 'white', borderRadius: 6, padding: 10, alignItems: 'center',
                        flexDirection: 'row-reverse', justifyContent: 'space-around', marginTop: 25
                    }}
                    >
                        <Text style={{ color: '#666666' }}>{locales('titles.requestTooOld')}</Text>
                        <Button
                            style={{ backgroundColor: '#E41C38', width: '30%', borderRadius: 6 }}
                        >
                            <Text style={{ color: 'white', textAlign: 'center', width: '100%' }}> {locales('titles.update')}</Text>
                        </Button>
                    </View>}



                    <SafeAreaView
                        style={{ padding: 10, height: deviceHeight * 0.67 }}
                    >
                        <ScrollView
                        >

                            {modalFlag && <ChatModal
                                transparent={false}
                                visible={modalFlag}
                                contact={selectedContact}
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
                                                        style={{
                                                            fontFamily: 'Vazir-Bold-FD', fontSize: 16, color: '#666666'
                                                        }}
                                                    >{`${buyAd.category_name} | ${buyAd.subcategory_name} | ${buyAd.name}`}</Text>
                                                    <Text
                                                        style={{ color: '#666666' }}
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
                                                        style={{ color: '#666666' }}
                                                    >{`${locales('titles.requirementQuantity')} : ${buyAd.requirement_amount} ${locales('labels.kiloGram')}`}
                                                    </Text>
                                                    <Button
                                                        onPress={() => this.setState({ modalFlag: true, selectedContact: contact })}
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

                                    </Body>
                                </CardItem>
                            </Card>
                        </ScrollView>
                    </SafeAreaView>


                </Spin>

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