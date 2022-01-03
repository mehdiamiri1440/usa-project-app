

import React, {
    Component
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    Text,
    View,
    Image,
    Pressable,
    Animated,
    LayoutAnimation,
    UIManager,
    Platform
} from 'react-native';
import { deviceHeight, deviceWidth } from '../../utils/deviceDimenssions';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path } from "react-native-svg";
import { responsiveHeight } from 'react-native-responsive-dimensions';

if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}


class Intro extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentSlide: 0
        }
    }

    dataArray = [
        <StepOne />,
        <StepTwo />,
        <StepThree />
    ];

    flatListRef = React.createRef();

    componentDidMount() {
        AsyncStorage.setItem('@isIntroductionSeen', JSON.stringify(true))
    };

    onViewableItemsChanged = ({ viewableItems, changed }) => {
        this.setState({ currentSlide: viewableItems[0].index })
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    };

    onNextButtonPressed = _ => {
        const {
            currentSlide
        } = this.state;

        if (currentSlide !== 3) {
            this.flatListRef?.current?.scrollToIndex({
                index: this.state.currentSlide + 1,
                animated: true,
            });
        }
        this.setState({ currentSlide: this.state.currentSlide + 1 });
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    };

    selectCurrentSlideText = _ => {

        const {
            currentSlide
        } = this.state;

        switch (currentSlide) {
            case 0:
                return locales('labels.welcomeToBiggestSellersAndBuyersSociety');
            case 1:
                return locales('labels.findBestSellersAndBuyers');
            case 2:
                return locales('labels.findBestPricesAllAroundTheCountry');
            default:
                break;
        }
    };

    renderItem = ({ item }) => {
        return (
            <View
                style={{
                    flex: 1,
                    alignSelf: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: deviceWidth
                }}
            >
                {item}
            </View>
        )
    };

    render() {
        const {
            currentSlide
        } = this.state;


        return (
            <LinearGradient
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={{
                    flex: 1
                }}
                colors={['#264653', 'rgba(38, 70, 83, 0.37)']}
            >
                <Animated.FlatList
                    style={{
                        flex: 1,
                        width: deviceWidth
                    }}
                    inverted
                    horizontal
                    onViewableItemsChanged={this.onViewableItemsChanged}
                    viewabilityConfig={{
                        itemVisiblePercentThreshold: 50
                    }}
                    pagingEnabled
                    ref={this.flatListRef}
                    renderItem={this.renderItem}
                    showsHorizontalScrollIndicator={false}
                    data={this.dataArray}
                    keyExtractor={(_, index) => index.toString()}
                />
                <View
                    style={{
                        position: 'absolute',
                        bottom: '30%',
                        left: '50%',
                        right: '50%',
                        flexDirection: 'row-reverse',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    {[1, 2, 3].map((_, index) => (
                        <View
                            key={index}
                            style={{
                                width: index == currentSlide ? 32 : 12,
                                height: 12,
                                borderRadius: 100,
                                marginHorizontal: 5,
                                backgroundColor: index == currentSlide ? '#FF9828' : 'white'
                            }}
                        ></View>
                    ))}
                </View>
                <Text
                    style={{
                        textAlign: 'center',
                        color: 'white',
                        fontSize: 16,
                        marginBottom: 40,
                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                    }}
                >
                    {this.selectCurrentSlideText()}
                </Text>
                {currentSlide >= 2 ?
                    <Pressable
                        onPress={() => this.props.navigation.navigate('Home', { screen: 'ProductsList' })}
                        style={{
                            flexDirection: 'row-reverse',
                            justifyContent: 'center',
                            alignSelf: 'center',
                            alignItems: 'center',
                            width: deviceWidth * 0.55,
                            borderRadius: 8,
                            padding: 10,
                            marginBottom: 40,
                            backgroundColor: '#FF9828'
                        }}
                    >
                        <Text
                            style={{
                                color: 'white',
                                fontFamily: 'IRANSansWeb(FaNum)',
                                fontSize: 16,
                                marginHorizontal: 5
                            }}
                        >
                            {locales('titles.letsStart')}
                        </Text>
                        <FontAwesome5
                            name='angle-left'
                            color='white'
                            size={20}
                        />
                    </Pressable>
                    : <View
                        style={{
                            flexDirection: 'row-reverse',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: deviceWidth,
                            marginTop: 10,
                            marginBottom: 40
                        }}
                    >
                        <Pressable
                            onPress={() => this.props.navigation.navigate('Home', { screen: 'ProductsList' })}
                            style={{
                                flexDirection: 'row-reverse',
                                alignItems: 'center',
                                width: '28%',
                                borderTopLeftRadius: 20,
                                borderBottomLeftRadius: 20,
                                padding: 7,
                                justifyContent: 'space-around',
                                backgroundColor: 'white'
                            }}
                        >
                            <Text
                                style={{
                                    color: '#FF6600',
                                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                    fontSize: 18
                                }}
                            >
                                {locales('titles.skip')}
                            </Text>
                        </Pressable>
                        <Pressable
                            onPress={this.onNextButtonPressed}
                            style={{
                                flexDirection: 'row-reverse',
                                alignItems: 'center',
                                width: '28%',
                                borderBottomRightRadius: 20,
                                borderTopRightRadius: 20,
                                padding: 7,
                                justifyContent: 'center',
                                backgroundColor: '#FF9828'
                            }}
                        >
                            <Text
                                style={{
                                    color: 'white',
                                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                    fontSize: 18,
                                    marginHorizontal: 10
                                }}
                            >
                                {locales('titles.next')}
                            </Text>
                            <FontAwesome5
                                name='arrow-left'
                                color='white'
                                size={16}
                            />
                        </Pressable>
                    </View>
                }
            </LinearGradient>
        )
    }
}
const StepOne = _ => {
    return (
        <View
            style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'space-between'
            }}
        >
            <View
                style={{
                    alignSelf: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                    top: -20,
                    width: deviceWidth * 1.06,
                    height: deviceWidth * 1.06,
                    borderWidth: 2,
                    borderColor: 'rgba(240, 243, 245, 0.1)',
                    borderRadius: 1000
                }}
            >
                <View
                    style={{
                        alignSelf: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: deviceWidth * 0.78,
                        height: deviceWidth * 0.78,
                        borderWidth: 2,
                        borderColor: 'rgba(240, 243, 245, 0.3)',
                        borderRadius: 1000
                    }}
                >
                    <View
                        style={{
                            alignSelf: 'center',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: deviceWidth * 0.45,
                            height: deviceWidth * 0.45,
                            borderWidth: 2,
                            borderColor: 'rgba(240, 243, 245, 0.6)',
                            borderRadius: 1000
                        }}
                    >
                        <View
                            style={{
                                alignSelf: 'center',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: deviceWidth * 0.25,
                                height: deviceWidth * 0.25,
                                borderWidth: 2,
                                borderColor: 'rgba(240, 243, 245, 0.9)',
                                borderRadius: 1000
                            }}
                        >
                            <Image
                                style={{
                                    width: deviceWidth * 0.15,
                                    height: deviceWidth * 0.15,
                                    borderRadius: 300
                                }}
                                source={require('../../../assets/images/7.jpg')}
                            />
                            <View
                                style={{
                                    backgroundColor: 'white',
                                    width: 13,
                                    height: 13,
                                    borderRadius: 100,
                                    position: 'absolute',
                                    left: '-7%',
                                    top: '46%'
                                }}
                            ></View>
                        </View>
                        <Svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="56"
                            height="77"
                            fill="none"
                            style={
                                {
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'absolute',
                                    left: deviceWidth * 0.356,
                                    top: deviceWidth * 0.08
                                }
                            }
                            viewBox="0 0 36 47"
                        >
                            <Path
                                fill="#F0F3F5"
                                d="M18 0c9.93 0 18 8.07 18 18 0 6.06-3.51 11.13-7.59 14.67-1.29 1.11-3.54 2.88-5.55 5.49-2.22 2.91-4.23 6.03-4.86 8.13-.63-2.1-2.64-5.22-4.86-8.13-2.01-2.61-4.26-4.38-5.55-5.49C3.51 29.13 0 24.06 0 18 0 8.07 8.07 0 18 0zm0 7.68a10.32 10.32 0 100 20.64 10.32 10.32 0 000-20.64z"
                            >
                            </Path>
                            <Image
                                style={{
                                    width: 34,
                                    height: 34,
                                    top: 12,
                                    borderRadius: 300,
                                    left: 11
                                }}
                                source={require('../../../assets/images/5.jpg')}
                            />
                        </Svg>
                        <View
                            style={{
                                backgroundColor: 'white',
                                width: 11,
                                height: 11,
                                borderRadius: 100,
                                position: 'absolute',
                                bottom: '-3.5%'
                            }}
                        ></View>
                    </View>
                    <Svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="43"
                        height="64"
                        fill="none"
                        style={
                            {
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'absolute',
                                left: deviceWidth * 0.05,
                                top: deviceWidth * 0.49
                            }
                        }
                        viewBox="0 0 36 47"
                    >
                        <Path
                            fill="#F0F3F5"
                            d="M18 0c9.93 0 18 8.07 18 18 0 6.06-3.51 11.13-7.59 14.67-1.29 1.11-3.54 2.88-5.55 5.49-2.22 2.91-4.23 6.03-4.86 8.13-.63-2.1-2.64-5.22-4.86-8.13-2.01-2.61-4.26-4.38-5.55-5.49C3.51 29.13 0 24.06 0 18 0 8.07 8.07 0 18 0zm0 7.68a10.32 10.32 0 100 20.64 10.32 10.32 0 000-20.64z"
                        >
                        </Path>
                        <Image
                            style={{
                                width: 25,
                                height: 25,
                                top: 12,
                                left: 9,
                                borderRadius: 200
                            }}
                            source={require('../../../assets/images/womane.jpg')}
                        />
                    </Svg>
                    <Svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="26"
                        height="47"
                        fill="none"
                        style={
                            {
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'absolute',
                                left: deviceWidth * 0.3,
                                top: -deviceWidth * 0.11
                            }
                        }
                        viewBox="0 0 36 47"
                    >
                        <Path
                            fill="#F0F3F5"
                            d="M18 0c9.93 0 18 8.07 18 18 0 6.06-3.51 11.13-7.59 14.67-1.29 1.11-3.54 2.88-5.55 5.49-2.22 2.91-4.23 6.03-4.86 8.13-.63-2.1-2.64-5.22-4.86-8.13-2.01-2.61-4.26-4.38-5.55-5.49C3.51 29.13 0 24.06 0 18 0 8.07 8.07 0 18 0zm0 7.68a10.32 10.32 0 100 20.64 10.32 10.32 0 000-20.64z"
                        >
                        </Path>
                        <Image
                            style={{
                                width: 16,
                                height: 16,
                                top: 11,
                                left: 5,
                                borderRadius: 300,
                            }}
                            source={require('../../../assets/images/WsA2B92zf0e8yijcmRiKDQ-001.jpg')}
                        />
                    </Svg>
                    <View
                        style={{
                            backgroundColor: 'white',
                            width: 7,
                            height: 7,
                            borderRadius: 100,
                            position: 'absolute',
                            left: '12%',
                            top: '15%'
                        }}
                    ></View>
                </View>
                <Svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="26"
                    height="47"
                    fill="none"
                    style={
                        {
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'absolute',
                            right: deviceWidth * 0.25,
                            top: deviceWidth * 0.88
                        }
                    }
                    viewBox="0 0 36 47"
                >
                    <Path
                        fill="#F0F3F5"
                        d="M18 0c9.93 0 18 8.07 18 18 0 6.06-3.51 11.13-7.59 14.67-1.29 1.11-3.54 2.88-5.55 5.49-2.22 2.91-4.23 6.03-4.86 8.13-.63-2.1-2.64-5.22-4.86-8.13-2.01-2.61-4.26-4.38-5.55-5.49C3.51 29.13 0 24.06 0 18 0 8.07 8.07 0 18 0zm0 7.68a10.32 10.32 0 100 20.64 10.32 10.32 0 000-20.64z"
                    >
                    </Path>
                    <Image
                        style={{
                            width: 16,
                            height: 16,
                            top: 11,
                            left: 5
                        }}
                        source={require('../../../assets/icons/young-man-1.png')}
                    />
                </Svg>
                <View
                    style={{
                        backgroundColor: 'white',
                        width: 9,
                        height: 9,
                        borderRadius: 100,
                        position: 'absolute',
                        left: '12%',
                        top: '83%'
                    }}
                ></View>
                <View
                    style={{
                        backgroundColor: 'white',
                        width: 9,
                        height: 9,
                        borderRadius: 100,
                        position: 'absolute',
                        right: '12%',
                        top: '15%'
                    }}
                ></View>
                <View
                    style={{
                        backgroundColor: 'white',
                        width: 9,
                        height: 9,
                        borderRadius: 100,
                        position: 'absolute',
                        right: '9.3%',
                        top: '80%'
                    }}
                ></View>
            </View>
        </View>
    )
};

const StepTwo = _ => {
    return (
        <View
            style={{
                width: deviceWidth,
                alignSelf: 'center',
                justifyContent: 'space-around',
                alignItems: 'center',
                flex: 1,
            }}
        >
            <Image
                style={{
                    width: deviceWidth,
                    height: responsiveHeight(25),
                }}
                source={require('../../../assets/images/hands.png')}
            />
        </View>
    )
};

const StepThree = _ => {
    return (
        <View
            style={{
                width: deviceWidth,
                alignSelf: 'center',
                justifyContent: 'space-around',
                alignItems: 'center',
                flex: 1
            }}
        >
            <Image
                style={{
                    width: '100%',
                    height: '65%',
                    resizeMode: 'contain'
                }}
                source={require('../../../assets/images/investment.png')}
            />
        </View>
    )
};

export default Intro;