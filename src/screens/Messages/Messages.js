import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
class Messages extends React.Component {

    render() {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
                <Text>Messages index</Text>
            </TouchableOpacity>
        )
    }
}

export default Messages