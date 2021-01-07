// import react-native element
import React, { Component } from 'react';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { ActionSheet, Button } from 'native-base';
import {
    TouchableOpacity, BackHandler,
    Image, View, Text, StyleSheet
} from "react-native";
import { ScrollView } from 'react-native-gesture-handler';

import Entypo from 'react-native-vector-icons/dist/Entypo';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';

import { deviceWidth, deviceHeight } from '../../../utils/deviceDimenssions';
import { permissions } from '../../../utils';
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

    componentDidMount() {
        const { images } = this.props;
        this.setState({ images, loaded: true });
        BackHandler.addEventListener('hardwareBackPress', _ => {
            this.props.changeStep(3)
            return true;
        })
    }

    componentWillUnmount() {
        BackHandler.removeEventListener()
    }


    chooseProductImage = (index) => ActionSheet.show(
        {
            options: [locales('labels.camera'), locales('labels.gallery')],
        },
        buttonIndex => this.onActionSheetClicked(buttonIndex, index)
    )

    onActionSheetClicked = async (buttonIndex, index) => {
        const options = {
            width: 300,
            height: 400,
            maxWidth: 1024,
            maxHeight: 1024,
            quality: 1,
            title: 'عکس را انتخاب کنید',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        const prevImagePickerLibraryOptions = {
            width: 300,
            height: 400,
            cropping: true,
            mediaType: 'photo',
        };

        switch (buttonIndex) {
            case 0: {
                this.setState({ errorFlag: false });

                const isAllowedToOpenCamera = await permissions.requestCameraPermission();

                if (!isAllowedToOpenCamera)
                    return;

                launchCamera(options, image => {
                    if (image.didCancel)
                        return;
                    else if (image.error)
                        return;

                    if (image.fileSize > 5242880 || image.fileSize < 20480) {
                        return this.setState({ imageSizeError: true })
                    }
                    const source = { uri: image.uri };
                    this.setState(state => {
                        state.avatarSource = source;
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
                });
                break;
            }
            case 1: {
                this.setState({ errorFlag: false });
                launchImageLibrary(options, image => {
                    if (image.didCancel)
                        return;
                    else if (image.error)
                        return;

                    if (image.fileSize > 5242880 || image.fileSize < 20480) {
                        return this.setState({ imageSizeError: true })
                    }
                    const source = { uri: image.uri };
                    this.setState(state => {
                        state.avatarSource = source;
                        let resultObj = {
                            uri: image.uri,
                            type: image.type,
                            size: image.fileSize,
                            name: image.fileName
                        }


                        if (index >= 0)
                            state.images[index] = resultObj
                        else {
                            if (typeof state.images != 'object')
                                state.images = [];
                            state.images.push(resultObj)
                        }
                        return '';
                    }
                    )
                });
                break;
            }
            default:
                break;
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

        let { images } = this.state;
        return (
            <>
                <View
                    style={{ backgroundColor: 'white' }}
                >


                    <Text
                        style={{
                            marginVertical: 10,
                            color: '#666666',
                            fontSize: 20,
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            paddingHorizontal: 10
                        }}
                    >
                        {locales('labels.addProductImages')}
                    </Text>

                    <Text
                        style={{
                            color: 'red',
                            fontSize: 14,
                            paddingHorizontal: 10,
                            direction: 'rtl'
                        }}
                    >
                        {locales('labels.uploadProductImages')}
                    </Text>

                    {this.state.imageSizeError && <View style={styles.loginFailedContainer}>
                        <Text style={styles.loginFailedText}>{locales('errors.imageSizeError')}</Text>
                    </View>}
                    {this.state.errorFlag && <View style={styles.loginFailedContainer}>
                        <Text style={styles.loginFailedText}>{locales('errors.fieldNeeded', { fieldName: locales('titles.chooseImage') })}</Text>
                    </View>}
                    <ScrollView style={{
                        height: deviceHeight * 0.4,
                        paddingVertical: 10,
                        backgroundColor: '#eee'
                    }}>
                        <View style={{
                            width: deviceWidth,
                            flexDirection: 'row-reverse',
                            flexWrap: 'wrap',
                            paddingVertical: 10,

                        }}>


                            <TouchableOpacity
                                onPress={() => this.chooseProductImage()}
                                style={{
                                    flex: 3,
                                    marginHorizontal: 10,
                                    height: 100,
                                    minWidth: 100,
                                    maxWidth: 120,
                                    borderWidth: 1,
                                    borderRadius: 5,
                                    borderStyle: 'dashed',
                                    borderColor: '#707070',
                                    backgroundColor: '#fff',
                                    zIndex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                <Entypo name='plus' size={25} color='#00C569' />
                                <Text>{locales('labels.addImage')}</Text>
                            </TouchableOpacity>


                            {images.length ? images.map((image, index) => <TouchableOpacity
                                key={index}
                                onPress={() => this.chooseProductImage(index)}
                                style={{
                                    flex: 3,
                                    height: 100,
                                    minWidth: 100,
                                    maxWidth: 120,
                                    marginHorizontal: 10,
                                    marginBottom: 20,
                                    borderWidth: 1,
                                    position: 'relative',
                                    borderRadius: 5,
                                    borderStyle: 'dashed',
                                    borderColor: '#707070',
                                    zIndex: 999999,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                <TouchableOpacity
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
                                </TouchableOpacity>
                                <Image
                                    resizeMode="cover"
                                    style={{
                                        width: '100%', height: '100%',
                                        borderRadius: 5, alignContent: 'center',
                                        alignItems: 'center', justifyContent: 'center'
                                    }}
                                    source={{ uri: image.uri }} />
                                <TouchableOpacity
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
                                </TouchableOpacity>
                            </TouchableOpacity>

                            ) :
                                null
                            }

                        </View>
                    </ScrollView>
                </View>
                <View style={{ marginVertical: 20, paddingHorizontal: 10, flexDirection: 'row', width: deviceWidth, justifyContent: 'space-between' }}>
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
        width: '60%',
        textAlign: 'center'
    },
    backButtonContainer: {
        textAlign: 'center',
        margin: 10,
        width: deviceWidth * 0.4,
        backgroundColor: 'white',
        alignItems: 'center',
        borderRadius: 5,
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
        borderRadius: 5,
        alignSelf: 'flex-start',
        justifyContent: 'center'
    },
    loginButton: {
        textAlign: 'center',
        margin: 10,
        backgroundColor: '#00C569',
        width: deviceWidth * 0.4,
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
        fontSize: 20,
        padding: 20,
        textAlign: 'right',
        color: '#7E7E7E'
    }
});

export default ProductImages;