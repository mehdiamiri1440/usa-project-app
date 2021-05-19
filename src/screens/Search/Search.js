import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
class Requests extends React.Component {

    render() {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
                <Text
                    style={{
                        fontFamily: 'IRANSansWeb(FaNum)_Light'
                    }}
                >Search index</Text>
            </TouchableOpacity>
        )
    }
}

export default Requests