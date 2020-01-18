import React from 'react'
import { TouchableOpacity, Text } from 'react-native'
import * as userActions from '../redux/user/actions'
import { connect } from 'react-redux'
class Router extends React.Component {
    render() {
        return (
            <TouchableOpacity
                onPress={() => this.props.myUser()}>
                <Text>
                    hello mehdi amiri
                </Text>
            </TouchableOpacity>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        loading: state.userReducer.loading
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        myUser: () => dispatch(userActions.fetchUser(1))

    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Router)
