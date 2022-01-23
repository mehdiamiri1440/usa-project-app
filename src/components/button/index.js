import React from 'react';
import {
    TouchableOpacity,
    Text
} from 'react-native';

export default props => {

    const {
        style = {},
        onPress = _ => { },
        children
    } = props;

    return (
        <TouchableOpacity
            style={style}
            onPress={onPress}
        >
            {children}
        </TouchableOpacity>
    )
}