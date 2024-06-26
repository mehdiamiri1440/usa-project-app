import React from 'react';
import { Text } from 'react-native';

export default ({
    children,
    style,
    ...rest
}) => {

    if (Array.isArray(style))
        style.every(item => !item.fontFamily) ? style.push({ fontFamily: 'IRANSansWeb(FaNum)_Light' }) : null;
    else
        !style.hasOwnProperty('fontFamily') ? style.fontFamily = 'IRANSansWeb(FaNum)_Light' : null;

    return (
        <Text
            style={style}
            {...rest}
        >
            {children}
        </Text>
    )
};