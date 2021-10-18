import React, { useEffect, useState } from 'react';
import { Text, View, ActivityIndicator, Modal } from 'react-native';

const Loading = props => {

    const [visible, setVisible] = useState();

    useEffect(() => {
        setTimeout(() => {
            setVisible(false)
        }, 1200);
    }, []);


    return (
        <Modal
            animationType="fade"
            transparent={false}
            visible={visible}
            onRequestClose={() => setVisible(false)}
        >

            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                {/* <Text
                    style={{
                        width: '100%', textAlign: 'center',
                        marginTop: 15,
                        fontSize: 24, fontFamily: 'IRANSansWeb(FaNum)_Bold', color: '#00C569'
                    }}>
                    {locales('labels.redirecting')}
                </Text> */}
                <View style={{ flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center' }}>
                    <Text
                        style={{
                            textAlign: 'center',
                            marginTop: 15,
                            fontSize: 24, fontFamily: 'IRANSansWeb(FaNum)_Medium', color: '#00C569'
                        }}>
                        {locales('labels.pleaseWait')}
                    </Text>
                    <ActivityIndicator size='large' color='#00C569' />
                </View>

            </View>
        </Modal>
    )
}
export default Loading