import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Card, CardItem, Body, } from 'native-base';
import { REACT_APP_API_ENDPOINT } from 'react-native-dotenv';
import { connect } from 'react-redux';
import * as messagesActions from '../../redux/messages/actions';
import { ScrollView } from 'react-native-gesture-handler';
import { deviceWidth, deviceHeight } from '../../utils/deviceDimenssions';
import moment from 'moment';
import Jmoment from 'moment-jalaali';
import ChatModal from './ChatModal';


class ContactsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalFlag: false,
            selectedContact: {
                first_name: '',
                last_name: '',
                id: null
            }
        }
    }



    render() {

        let { contactsList } = this.props;
        let { modalFlag, selectedContact } = this.state;

        return (
            <View

                style={{ height: deviceHeight * 0.6 }}>
                <ScrollView
                    keyboardShouldPersistTaps='handled'
                    keyboardDismissMode='on-drag'
                    style={{ padding: 5 }}>

                    {modalFlag && <ChatModal
                        transparent={false}
                        visible={modalFlag}
                        contact={selectedContact}
                        onRequestClose={() => this.setState({ modalFlag: false })}
                    />}

                    <Card>
                        <CardItem>
                            <Body>
                                {
                                    contactsList.map((contact, index) => (
                                        <TouchableOpacity
                                            onPress={() => this.setState({ modalFlag: true, selectedContact: contact })}
                                            key={contact.contact_id}
                                            style={{
                                                borderBottomColor: '#DDDDDD', paddingVertical: 12,
                                                flexDirection: 'row-reverse', width: '100%',
                                                borderBottomWidth: index < contactsList.length - 1 ? 1 : 0
                                            }}
                                        >

                                            <Image
                                                style={{
                                                    borderRadius: deviceWidth * 0.06,
                                                    width: deviceWidth * 0.12, height: deviceWidth * 0.12
                                                }}
                                                source={contact.profile_photo ?
                                                    { uri: `${REACT_APP_API_ENDPOINT}/storage/${contact.profile_photo}` }
                                                    : require('../../../assets/icons/user.png')}
                                            />

                                            <View>
                                                <View
                                                    style={{
                                                        width: (deviceWidth - (deviceWidth * 0.28)), paddingHorizontal: 10,
                                                        flexDirection: 'row-reverse',
                                                        justifyContent: 'space-between',
                                                    }}
                                                >
                                                    <Text style={{ color: '#666666', fontSize: 16, fontFamily: 'Vazir-Bold-FD' }}>
                                                        {`${contact.first_name} ${contact.last_name}`}
                                                    </Text>
                                                    <Text style={{ color: '#666666' }}>
                                                        {Jmoment(contact.last_msg_time_date.split(" ")[0]).format('jYYYY/jM/jD')}
                                                    </Text>
                                                </View>


                                                <View
                                                    style={{
                                                        width: (deviceWidth - (deviceWidth * 0.28)), paddingHorizontal: 10,
                                                        flexDirection: 'row-reverse',
                                                        justifyContent: 'space-between',
                                                    }}
                                                >
                                                    <Text style={{ color: '#666666', flexWrap: 'wrap', textAlign: 'right', width: '85%' }} numberOfLines={1}>
                                                        {contact.last_msg.last_msg_text}
                                                    </Text>
                                                    {contact.unread_msgs_count > 0 && <Text style={{
                                                        color: 'white', backgroundColor: '#00C569', width: 30, height: 30,
                                                        borderRadius: 15, textAlign: 'center', textAlignVertical: 'center'
                                                    }}>
                                                        {contact.unread_msgs_count}
                                                    </Text>}
                                                </View>

                                            </View>


                                        </TouchableOpacity>
                                    ))
                                }
                            </Body>
                        </CardItem>
                    </Card>

                </ScrollView>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        // contactsList: state.messagesReducer.contactsList,
        // contactsListMessage: state.messagesReducer.contactsListMessage,
        // contactsListError: state.messagesReducer.contactsListError,
        // contactsListFailed: state.messagesReducer.contactsListFailed,
        // contactsListLoading: state.messagesReducer.contactsListLoading,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        // fetchAllContactsList: () => dispatch(messagesActions.fetchAllContactsList())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ContactsList)