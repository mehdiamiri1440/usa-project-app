

import React, { Component } from "react";
import { Text, View, Image } from "react-native";
import RNFetchBlob from 'rn-fetch-blob';
import LinearGradient from "react-native-linear-gradient";
import * as versionData from '../../../version.json';
import { permissions } from "../../utils";

class UpgradeApp extends Component {
    constructor(props) {
        super(props)
        this.state = {
            appUpdateProgress: 0,
            downloadingUpdate: false
        }
    }

    async componentDidMount() {
        const isAllowedToWriteInExternalStorage = await permissions.requestWriteToExternalStoragePermission();
        if (!isAllowedToWriteInExternalStorage)
            return this.props.navigation.navigate('Home');
        return this.appUpdate();
    }



    appUpdate = () => {
        RNFetchBlob.config({
            path: RNFetchBlob.fs.dirs.DownloadDir + "/buskool.apk",
        })
            .fetch('GET', versionData.apkUrl)
            .progress({ interval: 100 }, (received, total) => {
                this.setState({
                    appUpdateProgress: Math.floor(received / total * 100)
                })
            })
            .then((res) => {
                return RNFetchBlob.android.actionViewIntent(res.path(), 'application/vnd.android.package-archive')
            })
    };


    render() {
        const {
            appUpdateProgress
        } = this.state;

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
                    elevation: 0,
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
                        {locales('labels.inUpdating')}
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
                                color: '#FF9828',
                                textAlign: 'center'
                            }}>
                            {appUpdateProgress}%
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
                                colors={['#FF9727', '#FF6701']}
                                style={{
                                    position: 'absolute',
                                    height: 7,
                                    width: `${appUpdateProgress}%`,
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
};

export default UpgradeApp;