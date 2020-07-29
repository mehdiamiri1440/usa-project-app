import React, { useState, useEffect } from 'react'
import { Text, View } from 'react-native'
import { Button } from 'native-base';

const First = props => {


    return (
        <View
            style={{ flex: 1 }}>
            <Text>first</Text>
            <Button
                onPress={() => props.setStep(2)}
            >
                <Text>next</Text>
            </Button>
        </View>
    )
}

export default First