import React, { useState, useEffect } from 'react'
import { Text, View } from 'react-native'

import First from './First';
import Second from './Second';
import Third from './Third';

const Intro = props => {

    let [step, setStep] = useState(1);

    const changeStep = step => {
        setStep(step);
    };

    const submit = _ => {
        props.navigation.navigate('SignUp')
    };

    const renderSteps = _ => {
        switch (step) {
            case 1:
                {
                    return <First
                        setStep={changeStep}
                        {...props}
                    />
                }
            case 2:
                {
                    return <Second
                        setStep={changeStep}
                        {...props}
                    />
                }
            case 3:
                {
                    return <Third
                        setStep={changeStep}
                        submit={submit}
                        {...props}
                    />
                }
        }
    }
    return (
        <View
            style={{ flex: 1 }}>
            {renderSteps()}
        </View>
    )
}

export default Intro