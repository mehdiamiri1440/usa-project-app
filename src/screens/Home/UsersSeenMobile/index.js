import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { View, Text, FlatList } from 'react-native';
import { Button, Toast } from 'native-base';
import Jmoment from 'moment-jalaali';

import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';

import * as profileActions from '../../../redux/profile/actions';
import { deviceWidth, deviceHeight, dataGenerator } from '../../../utils';
import Header from '../../../components/header';

const UsersSeenMobile = props => {

    useEffect(() => {
        props.fetchUserContactInfoViewers();
    }, []);

    const {
        userContactInfoViewersLoading,
        userContactInfoViewersList,
    } = props;

    const renderItem = ({ item, index }) => {
        const {
            id,
            first_name,
            last_name,
            user_name,
            is_verified,
            is_free,
            created_at
        } = item;

        const contact = {
            first_name,
            last_name,
            user_name,
            is_verified,
            contact_id: id
        };
        const prevMessage = userContactInfoViewersList[index == 0 ? 0 : index - 1];

        const style = {
            backgroundColor: '#E9ECEF',
            fontSize: 14,
            fontFamily: 'IRANSansWeb(FaNum)_Bold',
            color: '#555555',
            borderRadius: 19,
        };

        const shouldShowDate = index == 0 || (created_at && prevMessage.created_at &&
            Jmoment(created_at).format('jYYYY/jMM/jDD') != Jmoment(prevMessage.created_at).format('jYYYY/jMM/jDD'))

        return (
            <>
                {shouldShowDate ? <Text
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '40%',
                        marginVertical: 10,
                        textAlign: 'center',
                        padding: 5,
                        margin: 5,
                        elevation: 1,
                        alignSelf: 'center',
                        backgroundColor: '#E9ECEF',
                        fontSize: 14,
                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                        color: '#555555',
                        borderRadius: 19,
                    }}
                >
                    {Jmoment(created_at).format('jYYYY/jMM/jDD')}
                </Text>
                    : null}

                <View
                    style={{
                        borderRadius: 19,
                        backgroundColor: index % 2 == 0 ? '#F9FAF5' : '#ffffff',
                        width: deviceWidth * 0.93,
                        alignSelf: 'center',
                        borderWidth: 1,
                        borderColor: '#E9ECEF',
                        paddingVertical: 10,
                        paddingHorizontal: 7,
                        marginVertical: 10,
                        flexDirection: 'row-reverse',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row-reverse',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            width: '50%'
                        }}
                    >
                        <FontAwesome5
                            name='user-circle'
                            color='#777777'
                            solid
                            size={24}
                        />
                        <Text
                            numberOfLines={1}
                            style={{
                                fontSize: 16,
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                color: '#313A43',
                                marginHorizontal: 10,
                            }}
                        >
                            {`${first_name} ${last_name}`}
                        </Text>
                    </View>
                    {!!!is_free ?
                        <FontAwesome5
                            name='dollar-sign'
                            color='#556080'
                            solid
                            size={20}
                            onPress={() => Toast.show({
                                text: locales('titles.dollarDescription'),
                                position: "bottom",
                                style: { borderRadius: 10, bottom: 100, width: '90%', alignSelf: 'center', textAlign: 'center' },
                                textStyle: { fontFamily: 'IRANSansWeb(FaNum)_Light', textAlign: 'center' },
                                duration: 3000
                            })}
                        />
                        : null}
                    <Button
                        onPress={_ => props.navigation.navigate('Chat', { contact })}
                        style={{
                            borderRadius: 12,
                            width: deviceWidth * 0.3,
                            justifyContent: 'center',
                            height: 40,
                            alignItems: 'center',
                            flexDirection: 'row-reverse',
                            backgroundColor: '#FF9828'
                        }}
                    >
                        <FontAwesome5
                            solid
                            name='comment-alt'
                            color='white'
                            size={16}
                        />
                        <Text
                            style={{
                                fontSize: 15,
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                color: 'white',
                                marginHorizontal: 5,
                                textAlign: 'center'
                            }}
                        >
                            {locales('titles.sendMessage')}
                        </Text>
                    </Button>
                </View>
            </>
        )
    };

    const renderListHeaderComponent = _ => {
        return (
            <Text
                style={{
                    marginVertical: 30,
                    fontSize: 16,
                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                    color: '#404B55',
                    textAlign: 'center'
                }}
            >
                {locales('labels.recentlyUsersSeenMobile')}
            </Text>
        )
    };

    const renderListEmptyComponent = _ => {
        return (
            <View
                style={{
                    flex: 1,
                    height: deviceHeight * 0.5,
                    width: deviceWidth,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <FontAwesome5
                    color='#777'
                    size={50}
                    name='users'
                />
                <Text
                    style={{
                        marginTop: 10,
                        fontSize: 18,
                        color: '#777',
                        fontFamily: 'IRANSansWeb(FaNum)_Bold'
                    }}
                >
                    {locales('labels.emptySeenUsersList')}
                </Text>

                <Button
                    onPress={_ => props.navigation.navigate('ContactInfoGuid')}
                    style={{
                        borderRadius: 12,
                        width: '70%',
                        justifyContent: 'center',
                        height: 50,
                        marginTop: 20,
                        padding: 10,
                        alignItems: 'center',
                        alignSelf: 'center',
                        flexDirection: 'row-reverse',
                        backgroundColor: '#FF9828'
                    }}
                >
                    <Text
                        style={{
                            fontSize: 15,
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            color: 'white',
                            marginHorizontal: 5,
                            textAlign: 'center'
                        }}
                    >
                        {locales('labels.contactInfoShowingGuid')}
                    </Text>
                </Button>

            </View>
        )
    };

    const onRefresh = _ => {
        props.fetchUserContactInfoViewers();
    };

    const renderKeyExtractor = item => `${item.id.toString()}_${dataGenerator.generateKey('item_index')}`;


    return (
        <View
            style={{
                backgroundColor: 'white',
                flex: 1
            }}
        >
            <Header
                title={locales('titles.users')}
                shouldShowAuthenticationRibbonFromProps
                {...props}
            />

            <FlatList
                refreshing={userContactInfoViewersLoading}
                onRefresh={onRefresh}
                data={userContactInfoViewersList}
                renderItem={renderItem}
                ListHeaderComponent={renderListHeaderComponent}
                keyExtractor={renderKeyExtractor}
                ListEmptyComponent={!userContactInfoViewersLoading && renderListEmptyComponent}
            />
        </View>
    )
}

const mapStateToProps = state => {
    const {
        profileReducer
    } = state;

    const {
        userContactInfoViewersLoading,
        userContactInfoViewers,
        userContactInfoViewersList,
    } = profileReducer;

    return {
        userContactInfoViewersLoading,
        userContactInfoViewers,
        userContactInfoViewersList,
    }
};
const mapDispatchToProps = dispatch => {
    return {
        fetchUserContactInfoViewers: _ => dispatch(profileActions.fetchUserContactInfoViewers()),
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(UsersSeenMobile);