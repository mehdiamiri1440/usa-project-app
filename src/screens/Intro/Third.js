import React, { useState, useEffect } from 'react'
import { Text, View } from 'react-native';
import { Button } from 'native-base';

const Third = props => {


    return (
        <View
            style={{ flex: 1 }}>
            <Text>third</Text>
            <Button
                onPress={() => props.submit()}
            >
                <Text>next</Text>
            </Button>
            <Button
                onPress={() => props.setStep(2)}
            >
                <Text>prev</Text>
            </Button>
        </View>
    )
}

export default Third