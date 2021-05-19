import React, { useState, useEffect } from 'react'
import { Text, View } from 'react-native';
import { Button } from 'native-base';

const Third = props => {


    return (
        <View
            style={{ flex: 1 }}>
            <Text
                style={{
                    fontFamily: 'IRANSansWeb(FaNum)_Light',
                }}
            >third</Text>
            <Button
                onPress={() => props.submit()}
            >
                <Text
                    style={{
                        fontFamily: 'IRANSansWeb(FaNum)_Light',
                    }}
                >next</Text>
            </Button>
            <Button
                onPress={() => props.setStep(2)}
            >
                <Text
                    style={{
                        fontFamily: 'IRANSansWeb(FaNum)_Light',
                    }}
                >prev</Text>
            </Button>
        </View>
    )
}

export default Third