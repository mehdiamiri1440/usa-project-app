import React, { useState, useEffect } from 'react'
import { Text, View } from 'react-native'
import { Button } from 'native-base';

const Second = props => {


    return (
        <View
            style={{ flex: 1 }}>
            <Text>second</Text>
            <Button
                onPress={() => props.setStep(3)}
            >
                <Text>next</Text>
            </Button>
            <Button
                onPress={() => props.setStep(1)}
            >
                <Text>prev</Text>
            </Button>
        </View>
    )
}

export default Second