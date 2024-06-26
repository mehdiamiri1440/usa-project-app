// import react-native element
import React, { Component } from 'react';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { ActionSheet, Button } from 'native-base';
import {
    Pressable, BackHandler,
    Image, View, Text, StyleSheet
} from "react-native";
import { ScrollView } from 'react-native-gesture-handler';


import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';

import { deviceWidth, deviceHeight, permissions } from '../../../utils';
import ChooseImage from '../../../components/cameraActionSheet';
class ProductImages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            images: [],
            avatarSource: '',
            errorFlag: false,
            imageSizeError: false,
            loaded: false
        }
    }

    isComponentMounted = false;
    componentDidMount() {
        this.isComponentMounted = true;
        if (this.isComponentMounted) {
            BackHandler.addEventListener('hardwareBackPress', this.handleHardWareBackButtonPressed);
            const { images } = this.props;
            this.setState({ images, loaded: true });
            // BackHandler.addEventListener('hardwareBackPress', _ => {
            //     this.props.changeStep(3)
            //     return false;
            // })
        }
    }

    componentWillUnmount() {
        this.isComponentMounted = false;
        BackHandler.removeEventListener('hardwareBackPress', this.handleHardWareBackButtonPressed);
        // BackHandler.removeEventListener()
    }


    handleHardWareBackButtonPressed = _ => {
        this.props.changeStep(4);
        return true;
    };

    chooseProductImage = async (index) => {
        try {
            const {
                images = []
            } = this.state;

            if (images && images.length >= 4)
                return;

            const image = await ChooseImage();
            if (!image)
                return;

            const source = { uri: image.uri };
            this.setState(state => {
                state.avatarSource = source;
                state.imageSizeError = false;
                let resultObj = {
                    uri: image.uri,
                    type: image.type,
                    size: image.fileSize,
                    name: image.fileName
                }


                if (index >= 0) {
                    state.images[index] = resultObj
                }
                else {
                    if (typeof state.images != 'object')
                        state.images = [];
                    state.images.push(resultObj)
                }
                return '';
            }
            )
        }
        catch (error) {
            if (error.error.id == 1)
                this.setState({ imageSizeError: true });
        }
    };

    onSubmit = () => {
        if (!this.state.images.length) {
            this.setState({ errorFlag: true })
        }
        else {
            this.props.setProductImages(this.state.images)
        }
    }


    deleteImage = index => {
        this.setState(state => {
            state.images = state.images.filter((item, ind) => ind !== index);
            return '';
        })
    }


    render() {

        let {
            images = []
        } = this.state;
        return (
            <>
                <ScrollView
                    contentContainerStyle={{ padding: 10 }}>

                    <Text
                        style={{
                            marginVertical: 10,
                            color: '#333',
                            fontSize: 20,
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            paddingHorizontal: 10
                        }}
                    >
                        {locales('labels.addProductImages')} <Text
                            style={{
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                color: '#D44546'
                            }}
                        >*</Text>
                    </Text>

                    <Text
                        style={{
                            color: '#777777',
                            fontSize: 16,
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            paddingHorizontal: 10,
                            direction: 'rtl'
                        }}
                    >
                        {locales('labels.uploadProductImages')}
                    </Text>

                    {this.state.imageSizeError ? <View style={styles.loginFailedContainer}>
                        <Text style={styles.loginFailedText}>{locales('errors.imageSizeError')}</Text>
                    </View> : null}
                    {this.state.errorFlag ? <View style={styles.loginFailedContainer}>
                        <Text style={styles.loginFailedText}>{locales('errors.fieldNeeded', { fieldName: locales('titles.chooseImage') })}</Text>
                    </View> : null}

                    <View style={{
                        width: deviceWidth * 0.94,
                        flexDirection: 'row-reverse',
                        flexWrap: 'wrap',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                    }}>
                        {images.length ? images.map((image, index) => <Pressable
                            android_ripple={{
                                color: '#ededed'
                            }}
                            key={index}
                            onPress={() => this.chooseProductImage(index)}
                            style={{
                                margin: 7,
                                height: deviceWidth / 2.4,
                                minWidth: deviceWidth / 2.4,
                                maxWidth: deviceWidth / 2.4,
                                borderWidth: 1,
                                borderRadius: 5,
                                borderStyle: 'dashed',
                                borderColor: '#707070',
                                backgroundColor: '#fff',
                                zIndex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <Pressable
                                android_ripple={{
                                    color: '#ededed'
                                }}
                                onPress={() => this.chooseProductImage(index)}
                                style={{
                                    position: 'absolute',
                                    opacity: 0.5,
                                    width: '100%',
                                    zIndex: 10,
                                    top: 0,
                                    justifyContent: 'flex-end',
                                    alignItems: 'center',
                                    backgroundColor: 'black',
                                }}
                            >
                                <FontAwesome name='pencil' size={25} color='white' />
                            </Pressable>
                            <Image
                                resizeMode="cover"
                                style={{
                                    width: '100%', height: '100%',
                                    borderRadius: 5, alignContent: 'center',
                                    alignItems: 'center', justifyContent: 'center'
                                }}
                                source={{ uri: image.uri }} />
                            <Pressable
                                android_ripple={{
                                    color: '#ededed'
                                }}
                                onPress={() => this.deleteImage(index)}
                                style={{
                                    position: 'absolute',
                                    opacity: 0.5,
                                    width: '100%',
                                    zIndex: 10,
                                    bottom: 0,
                                    justifyContent: 'flex-end',
                                    alignItems: 'center',
                                    backgroundColor: 'black',
                                }}
                            >
                                <FontAwesome name='trash' size={25} color='white' />
                            </Pressable>
                        </Pressable>

                        ) :
                            null
                        }

                        {images.length < 4 ?
                            <Pressable
                                android_ripple={{
                                    color: '#ededed'
                                }}
                                onPress={() => this.chooseProductImage()}
                                style={{
                                    margin: 7,
                                    height: deviceWidth / 2.4,
                                    minWidth: deviceWidth / 2.4,
                                    maxWidth: deviceWidth / 2.4,
                                    borderWidth: 1,
                                    borderRadius: 5,
                                    borderStyle: 'dashed',
                                    borderColor: '#707070',
                                    backgroundColor: '#fff',
                                    zIndex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>

                                <View>
                                    <View style={{
                                        backgroundColor: "white", width: 20, height: 20,
                                        borderWidth: 1, borderColor: 'white',
                                        position: 'absolute', top: -10, right: -10, borderBottomLeftRadius: 2, zIndex: 10,
                                        justifyContent: 'center'
                                    }}>
                                        <FontAwesome color='#00C569' name="plus-square" size={18} />
                                    </View>
                                    <FontAwesome5
                                        color='#323A42'
                                        name='camera' size={35} />
                                </View>

                                <Text
                                    style={{
                                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                        color: '#323A42'
                                    }}
                                >{locales('labels.addImage')}</Text>
                            </Pressable>
                            : null
                        }
                    </View>

                    <View style={{
                        marginVertical: 20,
                        paddingLeft: 10,
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}>
                        <Button
                            onPress={() => this.onSubmit()}
                            style={!images.length ? styles.disableLoginButton : styles.loginButton}
                            rounded
                        >
                            <FontAwesome5 name='arrow-left' style={{ marginRight: 10 }} size={14} color='white' />
                            <Text style={styles.buttonText}>{locales('titles.nextStep')}</Text>
                        </Button>
                        <Button
                            onPress={() => this.props.changeStep(4)}
                            style={styles.backButtonContainer}
                            rounded
                        >
                            <Text style={styles.backButtonText}>{locales('titles.previousStep')}</Text>
                            <FontAwesome5 name='arrow-right' style={{ marginLeft: 10 }} size={14} color='#7E7E7E' />
                        </Button>
                    </View>
                </ScrollView>

            </>
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
        fontFamily: 'IRANSansWeb(FaNum)_Light',
        width: deviceWidth,
        color: '#761C24'
    },
    buttonText: {
        color: 'white',
        width: '60%',
        textAlign: 'center',
        fontFamily: 'IRANSansWeb(FaNum)_Bold'
    },
    backButtonText: {
        color: '#7E7E7E',
        fontFamily: 'IRANSansWeb(FaNum)_Light',
        width: '60%',
        textAlign: 'center'
    },
    backButtonContainer: {
        textAlign: 'center',
        borderWidth: 1,
        borderColor: '#BDC4CC',
        backgroundColor: 'white',
        alignItems: 'center',
        borderRadius: 5,
        justifyContent: 'center',
        width: '37%',
        elevation: 0,
        margin: 10,
    },
    disableLoginButton: {
        textAlign: 'center',
        margin: 10,
        elevation: 0,
        width: '37%',
        color: 'white',
        alignItems: 'center',
        backgroundColor: '#B5B5B5',
        borderRadius: 5,
        alignSelf: 'flex-start',
        justifyContent: 'center'
    },
    loginButton: {
        textAlign: 'center',
        margin: 10,
        elevation: 0,
        backgroundColor: '#FF9828',
        width: '37%',
        borderRadius: 5,
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
        fontFamily: 'IRANSansWeb(FaNum)_Light',
        fontSize: 20,
        padding: 20,
        textAlign: 'right',
        color: '#7E7E7E'
    }
});

export default ProductImages;