

import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { Text, View, StyleSheet, } from 'react-native';
import { Button, } from 'native-base';
import { deviceWidth, deviceHeight } from '../../utils/deviceDimenssions';
import SliderBox from "../../components/SnapCarousel";



class Intro extends Component {
    constructor(props) {
        super(props)
        this.state = {
            nextButton: false,
            selectedIndex: 0,
            images: [
                require('../../../assets/images/intro-slide1.jpg'),
                require('../../../assets/images/intro-slide2.jpg'),
                require('../../../assets/images/intro-slide3.jpg'),
            ]

        }
    }

    componentDidMount() {
        // AsyncStorage.setItem('@isIntroductionSeen', JSON.stringify(true))
    }

    render() {

        const {
            images,
            nextButton,
            selectedIndex
        } = this.state;


        return (
            <>
                <SliderBox
                    currentImageEmitter={(index) => this.setState({ selectedIndex: index })}
                    inactiveDotColor='#777777'
                    sliderBoxHeight={deviceHeight}
                    nextButton={nextButton}
                    currenImage={2}
                    dotColor="#00C569"
                    dotStyle={{
                        bottom: 30, width: 11, height: 11, borderRadius: 10, marginHorizontal: -5,
                    }}
                    // currentImageEmitter={index => this.setState({ selectedIndex: index })}
                    disableOnPress={true}
                    images={images}
                />
                <View style={styles.actionButtonWrapper}>
                    <Button
                        onPress={() => this.props.navigation.navigate('SignUp')}
                        style={styles.actionButton}>
                        <Text style={styles.actionButtonText}>
                            {locales('titles.skip')}
                        </Text>
                    </Button>
                    <Button
                        onPress={() => {
                            if (selectedIndex == images.length - 1) {
                                return this.props.navigation.navigate('SignUp')
                            }
                            else {
                                this.setState({ nextButton: true }, () => this.setState({ nextButton: false }))
                            }
                        }}
                        style={styles.actionButton}>
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



export default (Intro)