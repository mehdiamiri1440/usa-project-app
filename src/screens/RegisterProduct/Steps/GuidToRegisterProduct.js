import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { Button } from 'native-base';
import { Navigation } from 'react-native-navigation';
import { connect } from 'react-redux';
import { Dialog, Portal, Paragraph } from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import analytics from '@react-native-firebase/analytics';


import * as registerProductActions from '../../../redux/registerProduct/actions';
import { deviceWidth, deviceHeight } from '../../../utils/deviceDimenssions';

class GuidToRegisterProduct extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false
        }
    }

    componentDidMount() {

        Navigation.events().registerComponentDidAppearListener(({ componentName, componentType }) => {
            if (componentType === 'Component') {
                analytics().setCurrentScreen(componentName, componentName);
            }
        });
        analytics().setCurrentScreen("GuidToRegisterProduct", "GuidToRegisterProduct");
    }

    onSubmit = () => {
        let { checkUserPermissionToRegisterProduct, changeStep } = this.props;
        checkUserPermissionToRegisterProduct().then((result) => {
            if (result.payload.status && !result.payload.is_limited) {
                changeStep(1);
            }
            else {
                this.setState({ showModal: true })
            }
        })
        // .catch(_ => this.props.setShowModal())
    };



    hideDialog = () => this.setState({ showModal: false });

    render() {

        let {
            userPermissionToRegisterProductLoading,
            userPermissionToRegisterProductError,
        } = this.props;
        let { showModal } = this.state;

        return (
            <>




                < Portal
                    style={{
                        padding: 0,
                        margin: 0

                    }}>
                    <Dialog
                        visible={showModal}
                        onDismiss={this.hideDialog}
                        style={styles.dialogWrapper}
                    >
                        <Dialog.Actions
                            style={styles.dialogHeader}
                        >
                            <Button
                                onPress={this.hideDialog}
                                style={styles.closeDialogModal}>
                                <FontAwesome5 name="times" color="#777" solid size={18} />
                            </Button>
                            <Paragraph style={styles.headerTextDialogModal}>
                                {locales('labels.registerProduct')}
                            </Paragraph>
                        </Dialog.Actions>



                        <View
                            style={{
                                width: '100%',
                                alignItems: 'center'
                            }}>

                            <AntDesign name="exclamation" color="#f8bb86" size={70} style={[styles.dialogIcon, {
                                borderColor: '#facea8',
                            }]} />

                        </View>
                        <Dialog.Actions style={styles.mainWrapperTextDialogModal}>

                            <Text style={styles.mainTextDialogModal}>
                                {locales('titles.maximumProductRegisteration')}
                            </Text>

                        </Dialog.Actions>

                        <View style={{
                            width: '100%',
                            textAlign: 'center',
                            alignItems: 'center'
                        }}>
                            <Button
                                style={[styles.modalButton, styles.greenButton]}
                                onPress={() => {
                                    this.hideDialog();
                                    this.props.navigation.navigate('ExtraProductCapacity');
                                }}
                            >

                                <Text style={styles.buttonText}>{locales('titles.increaseCapacity')}
                                </Text>
                            </Button>
                        </View>




                        <Dialog.Actions style={{
                            justifyContent: 'center',
                            width: '100%',
                            padding: 0
                        }}>
                            <Button
                                style={styles.modalCloseButton}
                                onPress={this.hideDialog}
                            >

                                <Text style={styles.closeButtonText}>{locales('titles.close')}
                                </Text>
                            </Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal >





                <View style={{ width: deviceWidth, paddingVertical: 40, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 28 }}>
                        {locales('labels.registerProduct')}
                    </Text>
                </View>
                <View style={{ backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>



                    <View
                        style={{
                            width: deviceWidth,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <Text
                            style={{
                                width: '70%',
                                fontSize: 16,
                                textAlign: 'center',
                                flexWrap: 'wrap'
                            }}
                        >
                            {locales('titles.sellerHintToRegisterProduct')}
                        </Text>
                    </View>


                    <View
                        style={{
                            width: deviceWidth,
                            alignSelf: 'center',
                            alignContent: 'center',
                            justifyContent: 'center',
                            paddingHorizontal: 40,
                            alignItems: 'center',
                            flexDirection: 'row-reverse'
                        }}
                    >
                        <Text

                            style={{
                                textAlignVertical: 'center',
                                color: 'red',
                                fontSize: 18,
                                // paddingHorizontal: 5,
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                textAlign: 'center',
                            }}
                        >
                            {locales('titles.only')}
                        </Text>
                        <Text
                            style={{
                                textAlign: 'center',
                                paddingTop: 20,
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                textAlignVertical: 'center',
                            }}
                        >
                            {locales('titles.registerProductHint')}
                        </Text>
                    </View>


                    <View
                        style={{
                            marginTop: 30,
                            width: deviceWidth,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <Text
                            style={{
                                width: '70%',
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                fontSize: 16,
                                textAlign: 'center',
                                flexWrap: 'wrap'
                            }}
                        >
                            {locales('titles.registerYourProductNow')}
                        </Text>
                    </View>



                    <Button
                        onPress={() => this.onSubmit()}
                        style={styles.loginButton}
                    >

                        <Text style={styles.buttonText}>{locales('titles.registerNewProduct')}</Text>
                        <ActivityIndicator size="small" color="white"
                            animating={!!userPermissionToRegisterProductLoading}
                            style={{
                                width: 30,
                                height: 30,
                                borderRadius: 15,
                                fontSize: 20,
                                marginLeft: -30
                            }}
                        />

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
        textAlign: 'center',
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
        fontSize: 20,
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
        justifyContent: 'center',
    },
    loginButton: {
        textAlign: 'center',
        margin: 10,
        backgroundColor: '#00C569',
        width: deviceWidth * 0.7,
        color: 'white',
        alignItems: 'center',
        borderRadius: 5,
        flexDirection: 'row-reverse',
        justifyContent: 'center',

    },
    dialogWrapper: {
        borderRadius: 12,
        padding: 0,
        margin: 0,
        overflow: "hidden"
    },
    dialogHeader: {
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5',
        padding: 0,
        margin: 0,
        position: 'relative',
    },
    closeDialogModal: {
        position: "absolute",
        top: 0,
        right: 0,
        padding: 15,
        height: '100%',
        backgroundColor: 'transparent',
        elevation: 0
    },
    headerTextDialogModal: {
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
        textAlign: 'center',
        fontSize: 17,
        paddingTop: 11,
        color: '#474747'
    },
    mainWrapperTextDialogModal: {
        width: '100%',
        marginBottom: 0
    },
    mainTextDialogModal: {
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
        color: '#777',
        textAlign: 'center',
        fontSize: 15,
        paddingHorizontal: 15,
        width: '100%'
    },
    modalButton: {
        textAlign: 'center',
        width: '100%',
        fontSize: 16,
        maxWidth: 145,
        marginVertical: 10,
        color: 'white',
        alignItems: 'center',
        borderRadius: 5,
        // alignSelf: 'flex-start',
        justifyContent: 'center',
    },
    modalCloseButton: {
        textAlign: 'center',
        width: '100%',
        fontSize: 16,
        color: 'white',
        alignItems: 'center',
        alignSelf: 'flex-start',
        justifyContent: 'center',
        elevation: 0,
        borderRadius: 0,
        backgroundColor: '#ddd',
        marginTop: 10
    },
    closeButtonText: {
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
        color: '#555',
    },
    dialogIcon: {

        height: 80,
        width: 80,
        textAlign: 'center',
        borderWidth: 4,
        borderRadius: 80,
        paddingTop: 5,
        marginTop: 20

    },
    greenButton: {
        backgroundColor: '#00C569',
    },
    redButton: {
        backgroundColor: '#E41C39',
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


const mapStateToProps = (state) => {
    return {
        userPermissionToRegisterProductLoading: state.registerProductReducer.userPermissionToRegisterProductLoading,
        userPermissionToRegisterProductMessage: state.registerProductReducer.userPermissionToRegisterProductMessage,
        userPermissionToRegisterProductError: state.registerProductReducer.userPermissionToRegisterProductError,
        userPermissionToRegisterProductFailed: state.registerProductReducer.userPermissionToRegisterProductFailed,
        isUserLimitedToRegisterProduct: state.registerProductReducer.isUserLimitedToRegisterProduct,
        userPermissionToRegisterProductStatus: state.registerProductReducer.userPermissionToRegisterProductStatus,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        checkUserPermissionToRegisterProduct: () => dispatch(registerProductActions.checkUserPermissionToRegisterProduct())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(GuidToRegisterProduct);