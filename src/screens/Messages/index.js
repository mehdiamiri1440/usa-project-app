import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { Container, Content, Tabs, Header, Button, Icon, InputGroup, Input } from 'native-base';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import { deviceWidth } from '../../utils/deviceDimenssions';
import * as messagesActions from '../../redux/messages/actions';
import ContactsList from './ContactsList';

class Messages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            contactsList: [],
            searchText: ''
        }
    }


    serachInputRef = React.createRef();

    componentDidMount() {
        this.props.fetchAllContactsList();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.loaded == false && this.props.contactsList.length)
            this.setState({ contactsList: this.props.contactsList, loaded: true })
    }


    clearSearchBar = () => {
        this.setState({ searchText: '', contactsList: [...this.props.contactsList] })
    };

    handleSearch = text => {
        this.setState(state => {
            state.searchText = text;
            state.contactsList = [...(this.props.contactsList.filter(item => item.first_name.includes(text) || item.last_name.includes(text)))];
            return '';
        })
    }

    render() {

        let { contactsList, searchText } = this.state

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
                        style={{ width: deviceWidth * 0.4, justifyContent: 'center', alignItems: 'flex-end', paddingHorizontal: 10 }}
                        onPress={() => this.props.navigation.goBack()}
                    >
                        <AntDesign name='arrowright' size={25} />
                    </TouchableOpacity>
                    <View style={{
                        width: deviceWidth * 0.55,
                        alignItems: 'flex-end'
                    }}>
                        <Text
                            style={{ fontSize: 18 }}
                        >
                            {locales('labels.messages')}
                        </Text>
                    </View>
                </View>


                <View style={{ padding: 20 }}>
                    <InputGroup rounded style={{ backgroundColor: 'white' }}>
                        <Icon name='ios-close' style={{ color: '#7E7E7E', marginHorizontal: 5, fontSize: 30 }} onPress={this.clearSearchBar} />
                        <Input value={searchText}
                            ref={this.serachInputRef}
                            onChangeText={this.handleSearch}
                            style={{ fontFamily: 'Vazir' }}
                            placeholder={locales('labels.searchContacts')} />
                        <Icon name='ios-search' style={{ color: '#7E7E7E', marginHorizontal: 5 }} />
                    </InputGroup>
                </View>

                {contactsList.length
                    ? <ContactsList
                        contactsList={contactsList}
                    />
                    : <>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Entypo size={135} name='message' color='#BEBEBE' />
                            <Text style={{ fontSize: 20, fontFamily: 'Vazir-Bold-FD', color: '#7E7E7E' }}>{locales('labels.noChatFound')}</Text>
                        </View>
                    </>
                }
            </>

        )
    }
}

const mapStateToProps = (state) => {
    return {
        contactsList: state.messagesReducer.contactsList,
        contactsListMessage: state.messagesReducer.contactsListMessage,
        contactsListError: state.messagesReducer.contactsListError,
        contactsListFailed: state.messagesReducer.contactsListFailed,
        contactsListLoading: state.messagesReducer.contactsListLoading,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllContactsList: () => dispatch(messagesActions.fetchAllContactsList())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Messages)