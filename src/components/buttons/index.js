import React from 'react';
import { TouchableWithoutFeedback, Button, View, Animated, Text, ActivityIndicator } from 'react-native';
import styles from '../../styles/index'
import colors from '../../styles/colors'
import units from '../../styles/fonts/units'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { deviceWidth } from '../../../src/utils';


export const Btn = (props) => {
    const {
        onPressIn = () => { },
        onPressOut = () => { },
        style = {},
        textStyle = {},
        iconStyle = {},
        animatedSpeed = 1,
        rightIcon = '',
        leftIcon = '',
        iconColor = 'white',
        iconSize = units.n16,
        loader = '',
        text = '',
        disabled = false,
    } = props;


    const animatedValue = new Animated.Value(animatedSpeed);
    const elevationValue = new Animated.Value(disabled ? units.n1 : units.n3);
    const heightValue = new Animated.Value(disabled ? 0 : units.n2);

    const animatedStyle = {
        transform: [{ scale: animatedValue }],
        elevation: elevationValue,
    }

    const hilightStyle = {
        height: heightValue,
    }

    const animatedConfig = {
        tension: 200,
        friction: 9
    }


    const handlePressIn = () => {
        Animated.spring(animatedValue, {
            toValue: disabled ? .995 : .99,
            tension: animatedConfig.tension,

        }).start()
        Animated.spring(elevationValue, {
            toValue: disabled ? units.n1 : units.n3,
            tension: animatedConfig.tension,
        }).start()
        Animated.spring(heightValue, {
            toValue: 1,
            tension: animatedConfig.tension,
        }).start()
        onPressIn()
    }

    const handlePressOut = () => {
        Animated.spring(animatedValue, {
            toValue: 1,
            friction: animatedConfig.friction,
            tension: animatedConfig.tension,
        }).start()
        Animated.spring(elevationValue, {
            toValue: disabled ? units.n1 : units.n3,
            friction: animatedConfig.friction,
            tension: animatedConfig.tension,
        }).start()
        Animated.spring(heightValue, {
            toValue: disabled ? units.n1 : units.n2,
            friction: animatedConfig.friction,
            tension: animatedConfig.tension,
        }).start()
        setTimeout(() => {
            onPressOut();
        }, 300)
    }


    return (
        <>
            <TouchableWithoutFeedback
                onPressIn={() => handlePressIn()}
                onPressOut={() => handlePressOut()}
            >
                <Animated.View style={[
                    disabled ? styles.bgGray3 : styles.bgGreen,
                    styles.radius,
                    styles.pv10,
                    styles.ph30,
                    styles.contentCenter,
                    { overflow: 'hidden' },
                    { ...style },
                    animatedStyle
                ]}

                >
                    <View style={[
                        styles.row,
                    ]}>

                        {loader !== '' ? <ActivityIndicator size="small" color="white"
                            animating={loader}
                            style={[styles.pRight7, {
                                marginLeft: -10,
                            }]}
                        /> : null}
                        {
                            leftIcon ? <FontAwesome5
                                name={leftIcon}
                                size={iconSize}
                                color={disabled ? colors.gray1 : iconColor}
                                style={[
                                    {
                                        paddingTop: units.n5,
                                        paddingRight: units.n10
                                    },
                                    { ...iconStyle }
                                ]}
                            /> : null
                        }
                        <Text style={[
                            styles.h4,
                            disabled ? styles.textGray1 : styles.textSecondary,
                            { ...textStyle }
                        ]}>
                            {
                                text
                            }
                        </Text>

                        {
                            rightIcon ? <FontAwesome5
                                name={rightIcon}
                                size={iconSize}
                                color={disabled ? colors.gray1 : iconColor}
                                style={[
                                    {
                                        paddingTop: units.n5,
                                        paddingLeft: units.n10
                                    },
                                    { ...iconStyle }
                                ]}
                            /> : null
                        }
                    </View>

                    <Animated.View style={[hilightStyle, {
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        left: 0,
                    }]} />
                </Animated.View>
            </TouchableWithoutFeedback>
        </>
    )
}


export const BtnSmall = (props) => {
    const {
        onPressIn = () => { },
        onPressOut = () => { },
        style = {},
        textStyle = {},
        iconStyle = {},
        animatedSpeed = 1,
        rightIcon = '',
        leftIcon = '',
        iconColor = 'white',
        iconSize = units.n14,
        loader = false,
        text = '',
        disabled = false,
    } = props;


    const animatedValue = new Animated.Value(animatedSpeed);
    const elevationValue = new Animated.Value(disabled ? units.n1 : units.n3);
    const heightValue = new Animated.Value(disabled ? units.n1 : units.n3);

    const animatedStyle = {
        transform: [{ scale: animatedValue }],
        elevation: elevationValue,
    }

    const hilightStyle = {
        height: heightValue,
    }

    const animatedConfig = {
        tension: 400,
        friction: 90
    }


    const handlePressIn = () => {
        Animated.spring(animatedValue, {
            toValue: disabled ? .995 : .99,
            tension: animatedConfig.tension,

        }).start()
        Animated.spring(elevationValue, {
            toValue: disabled ? units.n1 : units.n1,
            tension: animatedConfig.tension,
        }).start()
        Animated.spring(heightValue, {
            toValue: units.n2,
            tension: animatedConfig.tension,
        }).start()
        onPressIn()
    }

    const handlePressOut = () => {
        Animated.spring(animatedValue, {
            toValue: 1,
            friction: animatedConfig.friction,
            tension: animatedConfig.tension,
        }).start()
        Animated.spring(elevationValue, {
            toValue: disabled ? units.n1 : units.n3,
            friction: animatedConfig.friction,
            tension: animatedConfig.tension,
        }).start()
        Animated.spring(heightValue, {
            toValue: disabled ? units.n1 : units.n3,
            friction: animatedConfig.friction,
            tension: animatedConfig.tension,
        }).start()
        setTimeout(() => {
            onPressOut();
        }, 300)
    }


    return (
        <>
            <TouchableWithoutFeedback
                onPressIn={() => handlePressIn()}
                onPressOut={() => handlePressOut()}
            >
                <Animated.View style={[
                    disabled ? styles.bgGray3 : styles.bgGreen,
                    styles.radius,
                    styles.pv7,
                    styles.pBottom10,
                    styles.ph20,
                    styles.contentCenter,
                    { overflow: 'hidden' },
                    { ...style },
                    animatedStyle
                ]}

                >
                    <View style={[
                        styles.row,
                    ]}>

                        {loader ? <ActivityIndicator size="small" color="white"
                            animating={true}
                            style={[styles.pRight7, {
                                marginLeft: -10,
                            }]}
                        /> : null}
                        {
                            leftIcon ? <FontAwesome5
                                name={leftIcon}
                                size={iconSize}
                                color={disabled ? colors.gray1 : iconColor}
                                style={[
                                    {
                                        paddingTop: units.n5,
                                        paddingRight: units.n7
                                    },
                                    { ...iconStyle }
                                ]}
                            /> : null
                        }
                        <Text style={[
                            styles.smallTextBold,
                            styles.pTop2,
                            disabled ? styles.textGray1 : styles.textSecondary,
                            { ...textStyle }
                        ]}>
                            {
                                text
                            }
                        </Text>

                        {
                            rightIcon ? <FontAwesome5
                                name={rightIcon}
                                size={iconSize}
                                color={disabled ? colors.gray1 : iconColor}
                                style={[
                                    {
                                        paddingTop: units.n5,
                                        paddingLeft: units.n10
                                    },
                                    { ...iconStyle }
                                ]}
                            /> : null
                        }
                    </View>

                    <Animated.View style={[hilightStyle, {
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        left: 0,
                    }]} />
                </Animated.View>
            </TouchableWithoutFeedback>
        </>
    )
}