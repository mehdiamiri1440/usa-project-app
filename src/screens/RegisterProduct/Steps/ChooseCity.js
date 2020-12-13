import React from 'react'
import { TouchableOpacity, Text, StyleSheet, View, ActivityIndicator } from 'react-native'
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import RNPickerSelect from 'react-native-picker-select';
import { Button, Item, Label } from 'native-base';
import { connect } from 'react-redux'
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import { deviceHeight, deviceWidth } from '../../../utils/index'
import * as locationActions from '../../../redux/locations/actions'
import ENUMS from '../../../enums';

class ChooseCity extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            province: '',
            errorFlag: false,
            city: '',
            disableCity: true,
            index: -1,
            provinceError: '',
            cityError: '',
            loaded: false
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


    componentDidUpdate(prevProps, prevState) {
        if (prevState.loaded == false &&
            this.props.allCitiesObject &&
            Object.entries(this.props.allCitiesObject).length
            && this.props.allCitiesObject.cities.length
            && this.props.city) {
            const { province, city } = this.props;
            this.setState({ province, city, loaded: true })
        }
    }

    componentWillUnmount() {
        // if (I18nManager.isRTL) {
        //     I18nManager.forceRTL(false);
        // }
    }

    onSubmit = () => {
        let { city, province } = this.state;

        let provinceError = '', cityError = '';

        if (!province) {
            provinceError = locales('errors.fieldNeeded', { fieldName: locales('labels.province') });
        }
        else {
            provinceError = '';
        }

        if (!city) {
            cityError = locales('errors.fieldNeeded', { fieldName: locales('labels.city') });
        }
        else {
            cityError = '';
        }

        this.setState({ provinceError, cityError });

        if (!cityError && !provinceError) {
            this.props.setCityAndProvice(city, province);
        }
    };
    setProvince = (value, index) => {
        this.setState({ disableCity: true })
        let { provinces = [] } = this.props.allProvincesObject;
        if (provinces.length) {
            this.setState({ province: value, provinceError: '', city: '', cityError: '' })
            this.props.fetchAllProvinces(provinces.some(item => item.id == value) ? provinces.find(item => item.id == value).id : undefined).then(_ => {
                this.setState({ disableCity: false })
            })
        }
    };


    setCity = (value) => {
        if (!!value)
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

        if (allCitiesObject && Object.entries(allCitiesObject).length) {
            cities = allCitiesObject.cities.map(item => ({ ...item, value: item.city_name }))
        }

        return (
            <View style={[{ backgroundColor: 'white' }, styles.labelInputPadding]}>

                <Text style={styles.userText}>
                    {locales('titles.selectOrigin')}
                </Text>
                {!error && message && message.length &&
                    <View style={styles.loginFailedContainer}>
                        <Text style={styles.loginFailedText}>
                            {ENUMS.VERIFICATION_MESSAGES.list.filter(item => item.value === message)[0].title}
                        </Text>
                    </View>
                }
                <View>
                    <View style={{
                        flexDirection: 'row-reverse'
                    }}>
                        <Label style={{ color: 'black', fontFamily: 'IRANSansWeb(FaNum)_Bold', padding: 5 }}>
                            {locales('labels.province')}
                        </Label>
                        {(!!this.props.loading) ?
                            <ActivityIndicator size="small" color="#00C569"
                                style={{
                                    position: 'relative',
                                    width: 30, height: 30, borderRadius: 25
                                }}
                            /> : null}
                    </View>
                    <Item regular
                        style={{
                            width: deviceWidth * 0.9,
                            borderRadius: 5,
                            alignSelf: 'center',
                            borderColor: province ? '#00C569' : provinceError ? '#D50000' : '#a8a8a8'
                        }}
                    >
                        <RNPickerSelect
                            Icon={() => <FontAwesome5 name='angle-down' size={25} color='gray' />}
                            useNativeAndroidPickerStyle={false}
                            onValueChange={this.setProvince}
                            style={styles}
                            value={province}
                            disabled={loading}
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
                        error={provinceError}
                        value={province}
                        containerStyle={{
                            marginVertical: 20,
                            paddingHorizontal: 20
                        }}
                    /> */}

                <View >
                    <View style={{
                        flexDirection: 'row-reverse'
                    }}>
                        <Label style={{ color: 'black', fontFamily: 'IRANSansWeb(FaNum)_Bold', padding: 5 }}>
                            {locales('labels.city')}
                        </Label>
                        {(!!this.props.fetchCitiesLoading) ?
                            <ActivityIndicator size="small" color="#00C569"
                                style={{
                                    position: 'relative',
                                    width: 30, height: 30, borderRadius: 25
                                }}
                            /> : null}
                    </View>
                    <Item regular
                        style={{
                            width: deviceWidth * 0.9,
                            borderRadius: 5,
                            alignSelf: 'center',
                            borderColor: city ? '#00C569' : cityError ? '#D50000' : '#a8a8a8'
                        }}
                    >
                        <RNPickerSelect
                            Icon={() => <FontAwesome5 name='angle-down' size={25} color='gray' />}
                            useNativeAndroidPickerStyle={false}
                            onValueChange={this.setCity}
                            style={styles}
                            disabled={fetchCitiesLoading || loading || this.state.disableCity}
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
                        value={city}
                        error={cityError}
                        onChangeText={(value) => this.setCity(value)}
                        label={locales('labels.selectCity')}
                        data={cities}
                        containerStyle={{
                            paddingHorizontal: 20
                        }}
                    /> */}
                <View style={{ flexDirection: 'row', marginVertical: 20, width: deviceWidth, justifyContent: 'space-between', width: '100%' }}>
                    <Button
                        onPress={() => this.onSubmit()}
                        style={!city || !province ? styles.disableLoginButton : styles.loginButton}
                        rounded
                    >
                        <AntDesign name='arrowleft' size={25} color='white' />
                        <Text style={styles.buttonText}>{locales('titles.nextStep')}</Text>
                    </Button>
                    <Button
                        onPress={() => this.props.changeStep(2)}
                        style={styles.backButtonContainer}
                        rounded
                    >
                        <Text style={styles.backButtonText}>{locales('titles.previousStep')}</Text>
                        <AntDesign name='arrowright' size={25} color='#7E7E7E' />
                    </Button>
                </View>
            </View >
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
        borderRadius: 5,
        margin: 10,
        width: deviceWidth * 0.4,
        backgroundColor: 'white',
        alignItems: 'center',
        alignSelf: 'flex-end',
        justifyContent: 'center'
    },
    disableLoginButton: {
        textAlign: 'center',
        marginVertical: 10,
        width: deviceWidth * 0.4,
        borderRadius: 5,
        color: 'white',
        alignItems: 'center',
        backgroundColor: '#B5B5B5',
        alignSelf: 'flex-start',
        justifyContent: 'center'
    },
    loginButton: {
        textAlign: 'center',
        marginVertical: 10,
        backgroundColor: '#00C569',
        borderRadius: 5,
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
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
        paddingTop: '3%',
        fontSize: 20,
        padding: 20,
        textAlign: 'right',
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
        fontSize: 13,
        paddingHorizontal: deviceWidth * 0.04,
        fontFamily: 'IRANSansWeb(FaNum)_Medium',
        paddingVertical: 8,
        height: 50,
        color: 'black',
        width: deviceWidth * 0.9,
    },
    iconContainer: {
        left: 10,
        top: 13,
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