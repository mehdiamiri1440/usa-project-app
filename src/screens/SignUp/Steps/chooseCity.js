import React from 'react'
import { TouchableOpacity, Text, StyleSheet, View, I18nManager } from 'react-native'
import { Dropdown } from 'react-native-material-dropdown';
import { connect } from 'react-redux'
import RNPickerSelect from 'react-native-picker-select';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { Button, Item, Label } from 'native-base'
import { deviceHeight, deviceWidth } from '../../../utils/index'
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import { validator } from '../../../utils'
import * as authActions from '../../../redux/auth/actions'
import * as locationActions from '../../../redux/locations/actions'
import Spin from '../../../components/loading/loading'
import ENUMS from '../../../enums';
import RNRestart from 'react-native-restart';

class ChooseCity extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            province: '',
            provinceError: '',
            errorFlag: false,
            city: '',
            index: -1
        }
    }
    provinceRef = React.createRef();
    cityRef = React.createRef();

    componentDidMount() {
        this.props.fetchAllProvinces();
        // if (!I18nManager.isRTL) {
        //     RNRestart.Restart();
        //     console.warn('here')
        //     I18nManager.forceRTL(true);
        // }
    }

    componentWillUnmount() {
        // if (I18nManager.isRTL) {
        //     I18nManager.forceRTL(false);
        // }
    }

    onSubmit = () => {
        let { city, province } = this.state;

        let provinceError, cityError, isProvinceValid, isCityValid;

        if (!province) {
            provinceError = locales('errors.fieldNeeded', { fieldName: locales('labels.province') });
            isProvinceValid = false
        }
        else {
            provinceError = '';
            isProvinceValid = true
        }

        if (!city) {
            cityError = locales('errors.fieldNeeded', { fieldName: locales('labels.city') });
            isCityValid = false
        }
        else {
            cityError = '';
            isCityValid = true
        }

        if (isProvinceValid && isCityValid) {
            this.props.setCityAndProvice(city, province);
        }
        else {
            this.setState({ provinceError, cityError });
        }
    };

    setProvince = (value, index) => {
        let { provinces = [] } = this.props.allProvincesObject;
        if (provinces.length) {
            this.setState({ province: value, provinceError: '' })
            this.props.fetchAllProvinces(provinces[index].id)
        }
    };

    setCity = (value) => {
        this.setState({ city: value, cityError: '' })
    };

    render() {
        let {
            message,
            loading,
            error,
            allProvincesObject,
            fetchCitiesLoading,
            fetchCitiesError,
            fetchCitiesFailed,
            fetchCitiesMessage,
            allCitiesObject
        } = this.props;

        let {
            city,
            province,
            provinceError,
            cityError
        } = this.state;

        let { provinces = [] } = allProvincesObject;

        let cities = [];

        provinces = provinces.map(item => ({ ...item, value: item.province_name }));

        if (Object.entries(allCitiesObject).length) {
            cities = allCitiesObject.cities.map(item => ({ ...item, value: item.city_name }))
        }

        return (
            <Spin spinning={loading || fetchCitiesLoading} >
                <View style={{ marginTop: -40 }}>
                    <Text style={styles.userText}>
                        {locales('titles.chooseCityAndProvince')}
                    </Text>
                    {/* {!error && message && message.length &&
                    <View style={styles.loginFailedContainer}>
                        <Text style={styles.loginFailedText}>
                            {ENUMS.VERIFICATION_MESSAGES.list.filter(item => item.value === message)[0].title}
                        </Text>
                    </View>
                } */}
                    {/* {this.state.errorFlag && <View style={styles.loginFailedContainer}>
                    <Text style={styles.loginFailedText}>{locales('titles.cityAndProvinceRequired')}</Text>
                </View>} */}
                    {/* <View style={{ flexDirection: 'column', width: deviceWidth * 0.4 }}> */}
                    <View style={[styles.labelInputPadding, { marginVertical: -30 }]}>
                        <Label style={{ color: 'black', fontFamily: 'IRANSansWeb(FaNum)_Bold', padding: 5 }}>
                            {locales('labels.province')}
                        </Label>
                        <Item regular
                            style={{
                                width: deviceWidth * 0.9,
                                borderRadius: 5,
                                alignSelf: 'center',
                                borderColor: province ? '#00C569' : provinceError ? '#D50000' : '#a8a8a8'
                            }}
                        >
                            <RNPickerSelect
                                Icon={() => <Ionicons name='ios-arrow-down' size={25} color='gray' />}
                                useNativeAndroidPickerStyle={false}
                                onValueChange={this.setProvince}
                                style={styles}
                                value={province}
                                placeholder={{
                                    label: locales('labels.selectProvince'),
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                }}
                                items={[...provinces.map(item => ({
                                    label: item.province_name, value: item.id
                                }))]}
                            />
                        </Item>
                        {!!provinceError && <Label style={{ fontSize: 14, color: '#D81A1A', width: deviceWidth * 0.9 }}>{provinceError}</Label>}
                    </View>
                    {/* <Dropdown
                    onChangeText={(value, index) => this.setProvince(value, index)}
                    label={locales('labels.selectProvince')}
                    data={provinces}
                    containerStyle={{
                        marginVertical: 20,
                        paddingHorizontal: 20
                    }}
                /> */}
                    <View style={[styles.labelInputPadding, { marginTop: 30 }]}>
                        <Label style={{ color: 'black', fontFamily: 'IRANSansWeb(FaNum)_Bold', padding: 5 }}>
                            {locales('labels.city')}
                        </Label>
                        <Item regular
                            style={{
                                width: deviceWidth * 0.9,
                                borderRadius: 5,
                                alignSelf: 'center',
                                borderColor: city ? '#00C569' : cityError ? '#D50000' : '#a8a8a8'
                            }}
                        >
                            <RNPickerSelect
                                Icon={() => <Ionicons name='ios-arrow-down' size={25} color='gray' />}
                                useNativeAndroidPickerStyle={false}
                                onValueChange={this.setCity}
                                style={styles}
                                value={city}
                                placeholder={{
                                    label: locales('labels.selectCity'),
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                }}
                                items={[...cities.map(item => ({
                                    label: item.city_name, value: item.id
                                }))]}
                            />
                        </Item>
                        {!!cityError && <Label style={{ fontSize: 14, color: '#D81A1A', width: deviceWidth * 0.9 }}>{cityError}</Label>}
                    </View>
                    {/* <Dropdown
                    onChangeText={(value) => this.setCity(value)}
                    label={locales('labels.selectCity')}
                    data={cities}
                    containerStyle={{
                        paddingHorizontal: 20
                    }}
                /> */}
                    <View style={{ marginVertical: 20 }}>
                        <Button
                            onPress={() => this.onSubmit()}
                            style={!city || !province ? styles.disableLoginButton : styles.loginButton}
                            rounded
                        >
                            <Text style={styles.buttonText}>{locales('titles.nextStep')}</Text>
                        </Button>
                    </View>
                </View>
            </Spin>
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
        width: '100%',
        textAlign: 'center'
    },
    disableLoginButton: {
        textAlign: 'center',
        margin: 10,
        borderRadius: 5,
        backgroundColor: '#B5B5B5',
        width: deviceWidth * 0.8,
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
        width: deviceWidth * 0.8,
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
    },
    labelInputPadding: {
        paddingVertical: 5,
        paddingHorizontal: 20
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
    }
});
const mapStateToProps = state => {
    return {
        loading: state.locationsReducer.fetchAllProvincesLoading,
        error: state.locationsReducer.fetchAllProvincesError,
        failed: state.locationsReducer.fetchAllProvincesFailed,
        message: state.locationsReducer.fetchAllProvincesMessage,
        allProvincesObject: state.locationsReducer.allProvincesObject,

        fetchCitiesLoading: state.locationsReducer.fetchAllCitiesLoading,
        fetchCitiesError: state.locationsReducer.fetchAllCitiesError,
        fetchCitiesFailed: state.locationsReducer.fetchAllCitiesFailed,
        fetchCitiesMessage: state.locationsReducer.fetchAllCitiesMessage,
        allCitiesObject: state.locationsReducer.allCitiesObject,
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllProvinces: (provinceId) => dispatch(locationActions.fetchAllProvinces(provinceId)),
        fetchAllCities: () => dispatch(locationActions.fetchAllCities()),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ChooseCity)