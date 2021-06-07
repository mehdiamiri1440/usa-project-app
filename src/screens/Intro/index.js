

import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { Text, View, StyleSheet, } from 'react-native';
import { Button, } from 'native-base';
import { deviceWidth, deviceHeight } from '../../utils/deviceDimenssions';
import SliderBox from "../../components/SnapCarousel";
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';




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
        AsyncStorage.setItem('@isIntroductionSeen', JSON.stringify(true))
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
                    sliderBoxWidth={deviceWidth}
                    nextButton={nextButton}
                    currenImage={2}
                    dotColor="#00C569"
                    dotStyle={{
                        bottom: 30,
                        width: selectedIndex == 2 ? 0 : 11,
                        height: selectedIndex == 2 ? 0 : 11,
                        borderRadius: 10, marginHorizontal: -5,

                    }}
                    // currentImageEmitter={index => this.setState({ selectedIndex: index })}
                    disableOnPress
                    resizeMode={'stretch'}
                    images={images}
                />
                {selectedIndex == 2 ? <View style={[styles.actionButtonWrapper, { justifyContent: 'center', bottom: 70 }]}>

                    <Button
                        onPress={() => {
                            if (selectedIndex == images.length - 1) {
                                return this.props.navigation.navigate('SignUp')
                            }
                            else {
                                this.setState({ nextButton: true }, () => this.setState({ nextButton: false }))
                            }
                        }}
                        style={{
                            backgroundColor: 'none',
                            elevation: 0,
                        }}>
                        <View style={{

                            paddingVertical: 10,
                            paddingHorizontal: 65,
                            backgroundColor: '#00c569',
                            borderRadius: 6,
                            flexDirection: 'row',
                            justifyContent: 'center'
                        }}>
                            <Text style={{
                                color: '#fff',
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                fontSize: 20,
                            }}>
                                {locales('titles.startIt')}
                            </Text>
                            <FontAwesome5 style={{
                                color: '#fff',
                                fontSize: 18,
                                top: 4,
                                left: 7
                            }} name="arrow-right" solid />
                        </View>
                    </Button>

                </View> : <View style={styles.actionButtonWrapper}>
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
                }
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
        fontSize: 18,
        fontFamily: 'IRANSansWeb(FaNum)_Light'
    }
});



export default (Intro)