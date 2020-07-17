import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { Button } from 'native-base';
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
        }).catch(_ => this.props.setShowModal())
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
                            <Paragraph style={{ minHeight: 100, fontFamily: 'IRANSansWeb(FaNum)_Light', textAlign: 'center' }}>
                                {locales('titles.maximumProductRegisteration')}</Paragraph>
                        </Dialog.Content>
                        <Dialog.Actions style={{
                            width: '100%',
                            flexDirection: 'row-reverse',
                            justifyContent: 'space-between',
                            alignItems: 'space-between',
                            flex: 1
                        }}>
                            <Button
                                style={[styles.loginButton, { flex: 1 }]}
                                onPress={() => {
                                    this.hideDialog();
                                    this.props.navigation.navigate('PromoteRegistration');
                                }}>
                                <Text style={styles.buttonText}>
                                    {locales('titles.promoteRegistration')}
                                </Text>
                            </Button>
                            <Button
                                style={[styles.loginButton, { flex: 1, backgroundColor: '#556080' }]}
                                onPress={this.hideDialog}>
                                <Text style={styles.buttonText}>{locales('titles.gotIt')}
                                </Text>
                            </Button>

                        </Dialog.Actions>
                    </Dialog>
                </Portal>


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
                            marginTop: 70,
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


                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        flex: 1,
                        justifyContent: 'center'
                    }}>
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