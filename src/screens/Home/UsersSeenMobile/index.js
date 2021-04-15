import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Button } from 'native-base';

import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';

import * as profileActions from '../../../redux/profile/actions';
import { deviceWidth, deviceHeight } from '../../../utils';

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
            is_verified
        } = item;

        const contact = {
            first_name,
            last_name,
            user_name,
            is_verified,
            contact_id: id
        };

        return (
            <View
                style={{
                    borderRadius: 19,
                    backgroundColor: index % 2 == 0 ? '#FDFDFD' : '#ffffff',
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
                <Button
                    onPress={_ => props.navigation.navigate('Chat', { contact })}
                    style={{
                        borderRadius: 12,
                        width: deviceWidth * 0.3,
                        justifyContent: 'center',
                        height: 40,
                        alignItems: 'center',
                        flexDirection: 'row-reverse',
                        backgroundColor: '#00C569'
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
                    size={40}
                    name='list-alt'
                />
                <Text
                    style={{
                        marginTop: 10,
                        fontSize: 18,
                        color: '#777',
                        fontFamily: 'IRANSansWeb(FaNum)_Bold'
                    }}
                >
                    {locales('labels.emptyList')}
                </Text>
            </View>
        )
    };

    const onRefresh = _ => {
        props.fetchUserContactInfoViewers();
    };

    const renderKeyExtractor = item => item.id.toString();


    return (
        <View
            style={{
                backgroundColor: 'white',
                flex: 1
            }}
        >
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
                    onPress={() => props.navigation.goBack()}
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
                        {locales('titles.users')}
                    </Text>
                </View>
            </View>

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