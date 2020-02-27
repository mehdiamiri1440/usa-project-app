import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
class Requests extends React.Component {

    render() {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
                <Text>Register product index</Text>
            </TouchableOpacity>
        )
    }
}

export default Requests