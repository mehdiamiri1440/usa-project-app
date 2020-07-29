import React, { Component } from 'react';
import { Text, View, BackHandler } from 'react-native';
import { connect } from 'react-redux';
import { Button } from 'native-base';

import * as authActions from '../../../redux/auth/actions';
import * as profileActions from '../../../redux/profile/actions';

class ChangeRole extends Component {

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.navigate('MyBuskool', { screen: 'HomeIndex' })
        })
    }

    componentWillUnmount() {
        BackHandler.removeEventListener();
    }

    changeRole = _ => {
        this.props.changeRole().then(_ => {
            this.props.fetchUserProfile().then(_ => {
                this.props.navigation.navigate('MyBuskool', { screen: 'HomeIndex' })
            });
        })
    }

    render() {
        const { userProfile = {}, changeRoleLoading } = this.props;
        const { user_info = {} } = userProfile;
        let { is_seller } = user_info;

        is_seller = is_seller == 0 ? false : true;


        return (
            <>
                {changeRoleLoading ? <Text>loading</Text> :
                    <View>
                        <Text> your usage activity is {is_seller ? 'seller' : 'buyer'}
                to see recieved notification please swtich the user activity
                </Text>
                        <Button onPress={this.changeRole}>
                            <Text>switch to {is_seller ? 'buyer' : 'seller'}</Text>
                        </Button>
                    </View>
                }
            </>
        )
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        changeRole: _ => dispatch(authActions.changeRole()),
        fetchUserProfile: () => dispatch(profileActions.fetchUserProfile()),
    }
}
const mapStateToProps = (state, ownProps) => {

    return {
        userProfile: state.profileReducer.userProfile,
        changeRoleLoading: state.authReducer.changeRoleLoading,
        changeRoleObject: state.authReducer.changeRoleObject,
        userProfileLoading: state.profileReducer.userProfileLoading,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangeRole)