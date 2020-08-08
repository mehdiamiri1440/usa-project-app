

import React, { Component } from 'react';
import { Text, View, StyleSheet, } from 'react-native';
import { Button, } from 'native-base';
import { deviceWidth, deviceHeight } from '../../utils/deviceDimenssions';
import { SliderBox } from "react-native-image-slider-box";


class SplashScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            images: [
                require('../../../assets/images/intro-slide1.jpg'),
                require('../../../assets/images/intro-slide2.jpg'),
                require('../../../assets/images/intro-slide3.jpg'),
            ]

        }
    }

    componentDidMount() {


    }

    render() {

        const {
            images
        } = this.state;


        return (
            <>
                <SliderBox
                    inactiveDotColor='#777777'
                    sliderBoxHeight={deviceHeight}
                    dotColor="#00C569"
                    dotStyle={{
                        bottom: 30, width: 11, height: 11, borderRadius: 10, marginHorizontal: -5,
                    }}
                    disableOnPress={true}
                    images={images}
                />
                <View style={styles.actionButtonWrapper}>
                    <Button style={styles.actionButton}>
                        <Text style={styles.actionButtonText}>
                            {locales('titles.skip')}
                        </Text>
                    </Button>
                    <Button style={styles.actionButton}>
                        <Text style={styles.actionButtonText}>
                            {locales('titles.next')}
                        </Text>
                    </Button>
                </View>
            </>
        )
    }
}



const styles = StyleSheet.create({
    actionButtonWrapper: {
        position: 'absolute',
        bottom: 20,
        width: '100%',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    actionButton: {
        backgroundColor: 'transparent',
        justifyContent: 'center',
        width: 80,
        borderWidth: 0,
        elevation: 0,

    },
    actionButtonText: {
        color: '#556080',
        fontSize: 18
    }
});



export default (SplashScreen)