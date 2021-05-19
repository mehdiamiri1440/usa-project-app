import React from 'react';
import { Text, Linking } from 'react-native';
import { REACT_APP_API_ENDPOINT_RELEASE } from '@env';
class Terms extends React.Component {

    componentDidMount() {
        return Linking.canOpenURL(`${REACT_APP_API_ENDPOINT_RELEASE}/privacy-and-policy`).then(supported => {
            if (supported) {
                Linking.openURL(`${REACT_APP_API_ENDPOINT_RELEASE}/privacy-and-policy`);
            }
        });
    }
    render() {
        return <Text
            style={{
                fontFamily: 'IRANSansWeb(FaNum)_Light',
            }}
        >terms</Text>
    }
}
export default Terms