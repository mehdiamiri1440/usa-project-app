

import React, { Component } from "react";
import { Text, View, Image, StyleSheet } from "react-native";
import { Button, } from "native-base";
import { deviceWidth, deviceHeight } from "../../utils/deviceDimenssions";
import LinearGradient from "react-native-linear-gradient";


class SplashScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {


        }
    }

    componentDidMount() {


    }

    render() {

        return (

            <View style={{
                flex: 1,
                alignContent: "center",
                justifyContent: "center",
                textAlign: "center",
                paddingHorizontal: 15
            }}>
                <View style={{
                    width: "100%",
                    textAlign: "center",
                    alignItems: "center"
                }}>
                    <Image
                        style={{
                            width: 84,
                            height: 97,
                        }}
                        source={require("../../../assets/icons/main-logo.png")} />
                </View>

                <View style={{
                    backgroundColor: '#fff',
                    elevation: 1,
                    borderRadius: 12,

                    marginTop: 20
                }}>
                    <Text style={{
                        backgroundColor: '#F6F8FE',
                        width: '100%',
                        textAlign: 'center',
                        fontFamily: "IRANSansWeb(FaNum)_Medium",
                        color: '#313A43',
                        paddingVertical: 7


                    }}>
                        درحال بروز رسانی
                     </Text>
                    <View
                        style={{
                            marginTop: 7,
                            marginBottom: 15,
                            paddingHorizontal: 15
                        }}>
                        <Text
                            style={{
                                fontFamily: "IRANSansWeb(FaNum)_Medium",
                                color: '#21AD93',
                                textAlign: 'center'
                            }}>
                            80%
                        </Text>
                        <View style={{
                            width: '100%',
                            height: 7
                        }}>
                            <View
                                style={{
                                    backgroundColor: '#DDDDDD',
                                    borderRadius: 15,
                                    height: 7,
                                    width: '100%',
                                    position: 'absolute'

                                }}
                            ></View>
                            <LinearGradient
                                start={{ x: 0, y: 1 }}
                                end={{ x: 0.8, y: 0.2 }}
                                colors={['#00C569', '#21AD93']}
                                style={{
                                    position: 'absolute',
                                    height: 7,
                                    width: '80%',
                                    right: 0,
                                    borderRadius: 10
                                }}
                            >

                            </LinearGradient>
                        </View>
                    </View>
                </View>


                <Text style={{
                    position: "absolute",
                    bottom: 30,
                    width: "100%",
                    left: 15,
                    textAlign: "center",
                    color: "#666666",
                    fontFamily: "IRANSansWeb(FaNum)_Bold",
                    fontSize: 23,
                }}>
                    {locales("titles.buskool")}
                </Text>
            </View>
        )
    }
}





export default (SplashScreen)