

import React, { Component } from "react";
import { Text, View, Image, StyleSheet } from "react-native";
import { Button, } from "native-base";
import { deviceWidth, deviceHeight } from "../../utils/deviceDimenssions";


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
                textAlign: "center"
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
                <Text style={{
                    position: "absolute",
                    bottom: 30,
                    width: "100%",
                    left: 0,
                    textAlign: "center",
                    color:  "#666666",
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