import React from 'react';
import { View, Text, Image } from 'react-native';
import { Card, CardItem, Body, } from 'native-base';
import { REACT_APP_API_ENDPOINT } from 'react-native-dotenv';
import { connect } from 'react-redux';
import * as messagesActions from '../../redux/messages/actions';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { deviceWidth } from '../../utils/deviceDimenssions';
import moment from 'moment';
import Jmoment from 'moment-jalaali';


class ContactsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }


    componentDidMount() {
        // this.props.fetchAllContactsList();
    }

    render() {
        let { contactsList } = this.props;
        console.warn(contactsList)
        return (
            <ScrollView style={{ padding: 5 }}>
                <Card>
                    <CardItem>
                        <Body>
                            {
                                contactsList.map((contact, index) => (
                                    <TouchableOpacity
                                        key={contact.contact_id}
                                        style={{
                                            borderBottomColor: '#DDDDDD', paddingVertical: 15,
                                            flexDirection: 'row-reverse', width: '100%',
                                            borderBottomWidth: index < contactsList.length - 1 ? 1 : 0
                                        }}
                                    >
                                        <Image
                                            style={{
                                                borderRadius: deviceWidth * 0.08,
                                                width: deviceWidth * 0.16, height: deviceWidth * 0.16
                                            }}
                                            source={contact.profile_photo ?
                                                { uri: `${REACT_APP_API_ENDPOINT}/storage/${contact.profile_photo}` }
                                                : require('../../../assets/icons/user.png')}
                                        />
                                        <View
                                            style={{
                                                width: (deviceWidth - (deviceWidth * 0.28)), paddingHorizontal: 6,
                                                flexDirection: 'row-reverse',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <Text style={{ color: '#666666', fontSize: 16, fontFamily: 'Vazir-Bold-FD' }}>
                                                {`${contact.first_name} ${contact.last_name}`}
                                            </Text>
                                            <Text style={{ color: '#666666', fontSize: 16, fontFamily: 'Vazir-Bold-FD' }}>
                                                {Jmoment(contact.last_msg_time_date.split(" ")[0]).format('jYYYY/jM/jD')}
                                            </Text>


                                        </View>
                                    </TouchableOpacity>
                                ))
                            }
                        </Body>
                    </CardItem>
                </Card>

            </ScrollView>
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