import React from 'react'
import { TouchableOpacity, Text, StyleSheet, View, I18nManager } from 'react-native'
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import { Dropdown } from 'react-native-material-dropdown';
import { Button } from 'native-base'
import { connect } from 'react-redux'
import { deviceHeight, deviceWidth } from '../../../utils/index'
import * as locationActions from '../../../redux/locations/actions'
import Spin from '../../../components/loading/loading'
import ENUMS from '../../../enums';

class ChooseCity extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            province: '',
            errorFlag: false,
            city: '',
            index: -1,
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
        if (prevState.loaded == false && Object.entries(this.props.allCitiesObject).length && this.props.allCitiesObject.cities.length && this.props.city) {
            const { province, city } = this.props;
            this.setState({ province, city: this.props.allCitiesObject.cities.find(item => item.id == city).city_name, loaded: true })
        }
    }

    componentWillUnmount() {
        // if (I18nManager.isRTL) {
        //     I18nManager.forceRTL(false);
        // }
    }

    onSubmit = () => {
        let { city, province } = this.state;
        if (!city || !province.length) {
            this.setState({ errorFlag: true })
        }
        else {
            this.props.setCityAndProvice(this.props.allCitiesObject.cities.find(item => item.city_name == city).id, province);
        }
    };

    setProvince = (value, index) => {
        let { provinces = [] } = this.props.allProvincesObject;
        if (provinces.length) {
            this.setState({ province: value })
            this.props.fetchAllProvinces(provinces[index].id)
        }
    };

    setCity = (value) => {
        this.setState({ city: value })
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
            province
        } = this.state;

        let { provinces = [] } = allProvincesObject;

        let cities = [];

        provinces = provinces.map(item => ({ ...item, value: item.province_name }));

        if (Object.entries(allCitiesObject).length) {
            cities = allCitiesObject.cities.map(item => ({ ...item, value: item.city_name }))
        }

        return (
            <View style={{ backgroundColor: 'white' }}>
                <Spin spinning={loading || fetchCitiesLoading} >
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
                    {this.state.errorFlag && <View style={styles.loginFailedContainer}>
                        <Text style={styles.loginFailedText}>{locales('titles.cityAndProvinceRequired')}</Text>
                    </View>}
                    {/* <View style={{ flexDirection: 'column', width: deviceWidth * 0.4 }}> */}
                    <Dropdown
                        onChangeText={(value, index) => this.setProvince(value, index)}
                        label={locales('labels.selectProvince')}
                        data={provinces}
                        value={province}
                        containerStyle={{
                            marginVertical: 20,
                            paddingHorizontal: 20
                        }}
                    />
                    <Dropdown
                        value={city}
                        onChangeText={(value) => this.setCity(value)}
                        label={locales('labels.selectCity')}
                        data={cities}
                        containerStyle={{
                            paddingHorizontal: 20
                        }}
                    />
                    <View style={{ marginVertical: 20, flexDirection: 'row', width: deviceWidth, justifyContent: 'space-between' }}>
                        <Button
                            onPress={() => this.onSubmit()}
                            style={!city || !province.length ? styles.disableLoginButton : styles.loginButton}
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
                </Spin >
            </View>
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
        margin: 10,
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
        margin: 10,
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
        fontFamily: 'Vazir-Bold-FD',
        paddingTop: '3%',
        fontSize: 20,
        padding: 20,
        textAlign: 'right',
        color: '#7E7E7E'
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