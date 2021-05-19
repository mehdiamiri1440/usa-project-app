import React, { useState, useEffect } from 'react'
import { Text, View } from 'react-native'
import { Button } from 'native-base';

const First = props => {


    return (
        <View
            style={{ flex: 1 }}>
            <Text
                style={{
                    fontFamily: 'IRANSansWeb(FaNum)_Light',
                }}
            >first</Text>
            <Button
                onPress={() => props.setStep(2)}
            >
                <Text
                    style={{
                        fontFamily: 'IRANSansWeb(FaNum)_Light',
                    }}
                >next</Text>
            </Button>
        </View>
    )
}

export default First