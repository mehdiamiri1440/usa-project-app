import React from 'react'
import { Text, StyleSheet, View, TouchableOpacity, Image } from 'react-native'
import RNPickerSelect from 'react-native-picker-select';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { Button, Item, Label, Radio } from 'native-base';
import { connect } from 'react-redux'
import { Dropdown } from 'react-native-material-dropdown';
import { deviceHeight, deviceWidth } from '../../../utils/index'
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import { validator } from '../../../utils';
import OutlinedTextField from '../../../components/floatingInput';
import * as authActions from '../../../redux/auth/actions'
import Spin from '../../../components/loading/loading'
import ENUMS from '../../../enums';


class UserActivity extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activityZone: '',
            activityZoneError: '',
            loaded: false,
            activityTypeError: '',
            activityType: '',
            selectedCategoryId: null
        }
    }
    activityZone = React.createRef();

    componentDidMount() {
        this.props.fetchAllActivityZones();
    }


    componentDidUpdate(prevProps, prevState) {
        if (prevState.loaded == false && Object.entries(this.props.activityZones).length) {
            const { activityZones, activityType, activityZone } = this.props;
            this.setState({ activityType, selectedCategoryId: activityZone, loaded: true })
        }
    }

    onSubmit = () => {
        let { selectedCategoryId, activityType } = this.state;

        let activityZoneError, activityTypeError, isActivityZoneValid, isActivityTypeValid;

        if (!selectedCategoryId) {
            activityZoneError = locales('errors.fieldNeeded', { fieldName: locales('labels.activityZone') });
            isActivityZoneValid = false;
        }
        else {
            activityZoneError = ''
            isActivityZoneValid = true;
        }

        if (!activityType) {
            activityTypeError = locales('errors.fieldNeeded', { fieldName: locales('labels.activityType') });
            isActivityTypeValid = false;
        }
        else {
            activityTypeError = '';
            isActivityTypeValid = true;
        }

        if (isActivityTypeValid && isActivityZoneValid) {

            this.props.setActivityZoneAndType(selectedCategoryId, activityType, false);
        }
        else {
            this.setState({ activityTypeError, activityZoneError });
        }
    }

    onActivityZoneSubmit = (value) => {
        this.setState({ selectedCategoryId: value, activityZoneError: '' })
    };


    render() {
        let { message, failed, loading, error, activityZones } = this.props
        let { selectedCategoryId, activityType, activityZoneError, activityTypeError } = this.state

        activityZones = activityZones.map(item => ({ ...item, value: item.category_name }));

        return (
            <Spin spinning={loading} >
                <View>
                    <Text style={styles.userText}>
                        {locales('messages.userActivityZone')}
                    </Text>
                    <View style={[styles.textInputPadding, {
                        marginTop: -20,
                        alignItems: 'center', flexDirection: 'row', justifyContent: 'space-around'
                    }]}>
                        <TouchableOpacity
                            onPress={() => this.setState({ activityType: 'buyer', activityTypeError: '' })}
                            style={{
                                width: deviceWidth * 0.4,
                                borderWidth: 1, borderColor: activityTypeError ? '#D50000' : (activityType == 'buyer' ? '#00C569' : '#BDC4CC'),
                                padding: 20, borderRadius: 5,
                                flexDirection: 'row-reverse',
                                justifyContent: 'space-between',
                                marginHorizontal: 10,
                            }}>
                            <Radio
                                onPress={() => this.setState({ activityType: 'buyer', activityTypeError: '' })}
                                selected={activityType === 'buyer'}
                                color={"#BEBEBE"}
                                style={{ marginHorizontal: 10 }}
                                selectedColor={"#00C569"}
                            />
                            <View style={{ flexDirection: 'row-reverse' }}>
                                <Image
                                    source={require('../../../../assets/icons/buyer.png')}
                                    style={{
                                        marginHorizontal: 5,
                                        alignSelf: "center",
                                    }}
                                />
                                <Text style={{ marginHorizontal: 5, fontSize: 14 }}>{locales('labels.buyer')}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                width: deviceWidth * 0.4,
                                borderWidth: 1, borderColor: activityTypeError ? '#D50000' : (activityType == 'seller' ? '#00C569' : '#BDC4CC'),
                                padding: 20, borderRadius: 5, flexDirection: 'row-reverse'
                                , justifyContent: 'space-between'
                            }}
                            onPress={() => this.setState({ activityType: 'seller', activityTypeError: '' })}
                        >
                            <Radio
                                onPress={() => this.setState({ activityType: 'seller', activityTypeError: '' })}
                                selected={activityType === 'seller'}
                                color={"#BEBEBE"}
                                style={{ marginHorizontal: 10 }}
                                selectedColor={"#00C569"}
                            />
                            <View style={{ flexDirection: 'row-reverse' }}>
                                <Image
                                    source={require('../../../../assets/icons/seller.png')}
                                    style={{
                                        marginHorizontal: 5,
                                        alignSelf: "center",
                                    }}
                                />
                                <Text style={{ marginHorizontal: 5, fontSize: 14 }}>{locales('labels.seller')}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    {!!activityTypeError && <Label style={{ fontSize: 14, color: '#D81A1A', textAlign: 'center', width: deviceWidth * 0.9 }}>
                        {activityTypeError}</Label>}

                    <View style={styles.labelInputPadding}>
                        <Label style={{ color: 'black', fontFamily: 'IRANSansWeb(FaNum)_Bold', padding: 5 }}>
                            {locales('labels.selectActivityZone')}
                        </Label>
                        <Item regular
                            style={{
                                width: deviceWidth * 0.9,
                                borderRadius: 5,
                                alignSelf: 'center',
                                borderColor: selectedCategoryId ? '#00C569' : activityZoneError ? '#D50000' : '#a8a8a8'
                            }}
                        >
                            <RNPickerSelect
                                Icon={() => <Ionicons name='ios-arrow-down' size={25} color='gray' />}
                                useNativeAndroidPickerStyle={false}
                                onValueChange={(category) => this.onActivityZoneSubmit(category)}
                                style={styles}
                                value={selectedCategoryId}
                                placeholder={{
                                    label: locales('labels.activityZone'),
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                }}
                                items={[...activityZones.map(item => ({
                                    label: item.category_name, value: item.id
                                }))]}
                            />
                        </Item>
                        {!!activityZoneError && <Label style={{ fontSize: 14, color: '#D81A1A', textAlign: 'center', width: deviceWidth * 0.9 }}>
                            {activityZoneError}</Label>}
                    </View>
                    {/* 
                <View style={styles.textInputPadding}>
                    <Dropdown
                        onChangeText={(value, index) => this.onActivityZoneSubmit(value, index)}
                        label={locales('labels.selectActivityZone')}
                        data={activityZones}
                        containerStyle={{
                            paddingHorizontal: 20
                        }}
                    />
                </View> */}
                    <View style={{ flexDirection: 'row', width: deviceWidth, justifyContent: 'space-between' }}>
                        <Button
                            onPress={() => this.onSubmit()}
                            style={!selectedCategoryId || !activityType.length ? styles.disableLoginButton : styles.loginButton}
                            rounded
                        >
                            <Text style={styles.buttonText}>{locales('titles.submitSignUp')}</Text>
                        </Button>
                        <Button
                            onPress={() => {
                                this.props.setActivityZoneAndType(selectedCategoryId ? selectedCategoryId : '', activityType ? activityType : '', true);
                                this.props.changeStep(5);
                            }}
                            style={styles.backButtonContainer}
                            rounded
                        >
                            <Text style={styles.backButtonText}>{locales('titles.previousStep')}</Text>
                            <AntDesign name='arrowright' size={25} color='#7E7E7E' />
                        </Button>
                    </View>

                </View>
            </Spin>
        )
    }
}
const styles = StyleSheet.create({
    backButtonText: {
        color: '#7E7E7E',
        width: '60%',
        textAlign: 'center'
    },
    backButtonContainer: {
        textAlign: 'center',
        borderRadius: 5,
        margin: 10,
        width: deviceWidth * 0.4,
        backgroundColor: 'white',
        alignItems: 'center',
        alignSelf: 'flex-end',
        justifyContent: 'center'
    },
    loginFailedContainer: {
        backgroundColor: '#D4EDDA',
        padding: 10,
        borderRadius: 5
    },
    loginFailedText: {
        textAlign: 'center',
        width: deviceWidth,
        color: '#155724'
    },
    container: {
        flex: 1,
    },
    scrollContainer: {
        flex: 1,
        paddingHorizontal: 15,
    },
    scrollContentContainer: {
        paddingTop: 40,
        paddingBottom: 10,
    },
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        fontFamily: 'IRANSansWeb(FaNum)_Light',
        paddingVertical: 8,
        height: 60,
        width: deviceWidth * 0.9,
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    iconContainer: {
        left: 30,
        top: 17,
    },
    buttonText: {
        color: 'white',
        width: '100%',
        textAlign: 'center'
    },
    labelInputPadding: {
        paddingVertical: 5,
        paddingHorizontal: 20
    },
    disableLoginButton: {
        textAlign: 'center',
        margin: 10,
        borderRadius: 5,
        backgroundColor: '#B5B5B5',
        width: deviceWidth * 0.4,
        color: 'white',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center'
    },
    loginButton: {
        textAlign: 'center',
        margin: 10,
        backgroundColor: '#00C569',
        borderRadius: 5,
        width: deviceWidth * 0.4,
        color: 'white',
        alignItems: 'center',
        alignSelf: 'center',
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
        textAlign: 'center',
        color: '#7E7E7E'
    }
});
const mapStateToProps = state => {
    return {
        loading: state.authReducer.fetchAllActivityZonesLoading,
        error: state.authReducer.fetchAllActivityZonesError,
        failed: state.authReducer.fetchAllActivityZonesFailed,
        message: state.authReducer.fetchAllActivityZonesMessage,
        activityZones: state.authReducer.activityZones,
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllActivityZones: () => dispatch(authActions.fetchAllActivityZones()),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(UserActivity)