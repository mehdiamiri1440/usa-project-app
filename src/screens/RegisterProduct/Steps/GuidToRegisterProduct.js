import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { Button, Spinner } from 'native-base';
import { connect } from 'react-redux';
import { Dialog, Portal, Paragraph } from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import * as registerProductActions from '../../../redux/registerProduct/actions';
import { deviceWidth, deviceHeight } from '../../../utils/deviceDimenssions';

class GuidToRegisterProduct extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false
        }
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
                <Portal>
                    <Dialog
                        visible={showModal}
                        onDismiss={this.hideDialog}>
                        <Dialog.Content>
                            <Paragraph style={{ fontFamily: 'Vazir', textAlign: 'center' }}>
                                {locales('titles.maximumProductRegisteration')}</Paragraph>
                        </Dialog.Content>
                        <Dialog.Actions style={{
                            width: '100%',
                            justifyContent: 'space-between',
                            alignItems: 'space-between'
                        }}>
                            <Button
                                style={[styles.loginButton, { width: '30%' }]}
                                onPress={this.props.navigation.navigate('PromoteRegistration')}>
                                <Text style={styles.buttonText}>
                                    {locales('titles.promoteRegistration')}
                                </Text>
                            </Button>
                            <Button
                                style={[styles.loginButton, { width: '30%' }]}
                                onPress={this.hideDialog}>
                                <Text style={styles.buttonText}>{locales('titles.gotIt')}
                                </Text>
                            </Button>

                        </Dialog.Actions>
                    </Dialog>
                </Portal>
                <View style={{ backgroundColor: 'white', height: deviceHeight * 0.55 }}>
                    {userPermissionToRegisterProductError && <View style={styles.loginFailedContainer}>
                        <Text style={styles.loginFailedText}>
                            {message}
                        </Text>
                    </View>
                    }
                    <View
                        style={{
                            paddingVertical: 10,
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
                                paddingHorizontal: 5,
                                textAlign: 'center',
                            }}
                        >
                            {locales('titles.only')}
                        </Text>
                        <Text
                            style={{
                                textAlign: 'center',
                                paddingTop: 20,
                                fontFamily: 'Vazir-Bold-FD',
                                textAlignVertical: 'center',
                            }}
                        >
                            {locales('titles.registerProductHint')}
                        </Text>
                    </View>


                    <View
                        style={{
                            marginTop: 70,
                            width: deviceWidth,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <Text
                            style={{
                                width: '70%',
                                fontFamily: 'Vazir-Bold-FD',
                                fontSize: 16,
                                textAlign: 'center',
                                flexWrap: 'wrap'
                            }}
                        >
                            {locales('titles.registerYourProductNow')}
                        </Text>
                    </View>


                    <View style={{
                        marginVertical: 20, flexDirection: 'row',
                        alignItems: 'flex-end',
                        width: deviceWidth, justifyContent: 'center'
                    }}>
                        <Button
                            onPress={() => this.onSubmit()}
                            style={styles.loginButton}
                            rounded
                        >
                            <Text style={styles.buttonText}>{locales('titles.registerNewProduct')}</Text>
                            <AntDesign name='plus' size={25} color='white' />
                        </Button>
                    </View>
                    <Spinner animating={userPermissionToRegisterProductLoading} />

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
        width: '80%',
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
        width: deviceWidth * 0.5,
        color: 'white',
        alignItems: 'center',
        borderRadius: 5,
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