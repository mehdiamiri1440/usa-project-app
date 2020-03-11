// import react-native element
import React, { Component } from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import { ActionSheet, Button } from 'native-base';
import {
    TouchableOpacity,
    Image, View, Text, StyleSheet
} from "react-native";
import { connect } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';
import { deviceWidth, deviceHeight } from '../../../utils/deviceDimenssions';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';

class ProductImages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            images: []
        }
    }
    chooseProductImage = (index) => ActionSheet.show(
        {
            options: [locales('labels.camera'), locales('labels.gallery')],
        },
        buttonIndex => this.onActionSheetClicked(buttonIndex, index)
    )

    onActionSheetClicked = (buttonIndex, index) => {
        switch (buttonIndex) {
            case 0:
                ImagePicker.openCamera({
                    width: 300,
                    height: 400,
                    cropping: true,
                    mediaType: 'photo'
                }).then(image => {
                    this.setState(state => {
                        if (index >= 0) {
                            state.images[index] = image.path
                        }
                        else {
                            state.images.push(image.path)
                        }
                        return '';
                    }
                    )
                });
                break;
            case 1:
                ImagePicker.openPicker({
                    width: 300,
                    height: 400,
                    cropping: true,
                    mediaType: 'photo',
                }).then(image => {
                    this.setState(state => {
                        if (index >= 0)
                            state.images[index] = image.path
                        else
                            state.images.push(image.path)
                        return '';
                    }
                    )
                });
                break;
            default:
                break;
        }

    };




    onSubmit = () => {
        this.props.setProductImages(this.state.images)
    }


    render() {

        let { images } = this.state;
        return (
            <ScrollView>
                <View
                    style={{ backgroundColor: 'white' }}
                >


                    <Text
                        style={{
                            marginVertical: 10,
                            color: '#666666',
                            fontSize: 20,
                            paddingHorizontal: 10
                        }}
                    >
                        {locales('labels.addProductImages')}
                    </Text>

                    <Text
                        style={{
                            color: 'red',
                            fontSize: 14,
                            paddingHorizontal: 10
                        }}
                    >
                        {locales('labels.uploadProductImages')}
                    </Text>


                    <View style={{
                        width: deviceWidth, flexDirection: 'row-reverse',
                        flexWrap: 'wrap'
                    }}>
                        {images.length ? images.map((image, index) => <TouchableOpacity
                            onPress={() => this.chooseProductImage(index)}
                            style={{
                                width: 150,
                                padding: 20,
                                height: 150,
                                margin: 20,
                                borderWidth: 1,
                                borderRadius: 5,
                                borderStyle: 'dashed',
                                borderColor: '#707070',
                                zIndex: 999999,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <Image
                                resizeMode="cover"
                                key={index}
                                style={{
                                    width: 150, height: 150,
                                    borderRadius: 5, alignContent: 'center',
                                    alignItems: 'center', justifyContent: 'center'
                                }}
                                source={{ uri: image }} />
                        </TouchableOpacity>
                        ) : null}
                        <View style={{
                            flexDirection: 'row-reverse',
                            padding: 20
                        }}>
                            <TouchableOpacity
                                onPress={() => this.chooseProductImage()}
                                style={{
                                    width: 150,
                                    padding: 20,
                                    height: 150,
                                    borderWidth: 1,
                                    borderRadius: 5,
                                    borderStyle: 'dashed',
                                    borderColor: '#707070',
                                    zIndex: 999999,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                <Entypo name='plus' size={25} color='#00C569' />
                                <Text>{locales('labels.addImage')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{ marginVertical: 20, flexDirection: 'row', width: deviceWidth, justifyContent: 'space-between' }}>
                        <Button
                            onPress={() => this.onSubmit()}
                            style={!images.length ? styles.disableLoginButton : styles.loginButton}
                            rounded
                        >
                            <AntDesign name='arrowleft' size={25} color='white' />
                            <Text style={styles.buttonText}>{locales('titles.nextStep')}</Text>
                        </Button>
                        <Button
                            onPress={() => this.props.changeStep(3)}
                            style={styles.backButtonContainer}
                            rounded
                        >
                            <Text style={styles.backButtonText}>{locales('titles.previousStep')}</Text>
                            <AntDesign name='arrowright' size={25} color='#7E7E7E' />
                        </Button>
                    </View>

                </View>
            </ScrollView>
        )
    }
}



const styles = StyleSheet.create({
    loginFailedContainer: {
        backgroundColor: '#F8D7DA',
        padding: 10,
        borderRadius: 5
    },
    loginFailedText: {
        textAlign: 'center',
        width: deviceWidth,
        color: '#761C24'
    },
    buttonText: {
        color: 'white',
        width: '60%',
        textAlign: 'center'
    },
    backButtonText: {
        color: '#7E7E7E',
        width: '60%',
        textAlign: 'center'
    },
    backButtonContainer: {
        textAlign: 'center',
        margin: 10,
        width: deviceWidth * 0.4,
        backgroundColor: 'white',
        alignItems: 'center',
        alignSelf: 'flex-end',
        justifyContent: 'center'
    },
    disableLoginButton: {
        textAlign: 'center',
        margin: 10,
        width: deviceWidth * 0.4,
        color: 'white',
        alignItems: 'center',
        backgroundColor: '#B5B5B5',
        alignSelf: 'flex-start',
        justifyContent: 'center'
    },
    loginButton: {
        textAlign: 'center',
        margin: 10,
        backgroundColor: '#00C569',
        width: deviceWidth * 0.4,
        color: 'white',
        alignItems: 'center',
        alignSelf: 'flex-start',
        justifyContent: 'center'
    },
    forgotContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    forgotPassword: {
        marginTop: 10,
        textAlign: 'center',
        color: '#7E7E7E',
        fontSize: 16,
        padding: 10,
    },
    enterText: {
        marginTop: 10,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#00C569',
        fontSize: 20,
        padding: 10,
    },
    linearGradient: {
        height: deviceHeight * 0.15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTextStyle: {
        color: 'white',
        position: 'absolute',
        textAlign: 'center',
        fontSize: 26,
        bottom: 40
    },
    textInputPadding: {
        padding: 20,
    },
    userText: {
        flexWrap: 'wrap',
        paddingTop: '3%',
        fontSize: 20,
        padding: 20,
        textAlign: 'right',
        color: '#7E7E7E'
    }
});

export default ProductImages;