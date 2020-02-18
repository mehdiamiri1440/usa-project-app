import React from 'react'
import { TouchableOpacity, Text, StyleSheet, View, I18nManager } from 'react-native'
import { Dropdown } from 'react-native-material-dropdown';
import { Button } from 'native-base'
import { connect } from 'react-redux'
import { deviceHeight, deviceWidth } from '../../../utils/index'
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import { validator } from '../../../utils'
import * as authActions from '../../../redux/auth/actions'
import * as locationActions from '../../../redux/locations/actions'
import Spin from '../../../components/loading/loading'
import ENUMS from '../../../enums';
class ChooseCity extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            province: '',
            city: '',
            index: -1
        }
    }
    provinceRef = React.createRef();
    cityRef = React.createRef();

    componentDidMount() {
        this.props.fetchAllProvinces();
        if (!I18nManager.isRTL) {
            I18nManager.forceRTL(true);
        }
    }

    componentWillUnmount() {
        if (I18nManager.isRTL) {
            I18nManager.forceRTL(false);
        }
    }

    onSubmit = () => {
        let { city, province } = this.state;
        this.props.setCityAndProvice(city, province);
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
            <Spin spinning={loading || fetchCitiesLoading} >
                <Text style={styles.userText}>
                    {locales('titles.chooseCityAndProvince')}
                </Text>
                {!error && message && message.length &&
                    <View style={styles.loginFailedContainer}>
                        <Text style={styles.loginFailedText}>
                            {ENUMS.VERIFICATION_MESSAGES.list.filter(item => item.value === message)[0].title}
                        </Text>
                    </View>
                }
                {/* <View style={{ flexDirection: 'column', width: deviceWidth * 0.4 }}> */}
                <Dropdown
                    onChangeText={(value, index) => this.setProvince(value, index)}
                    label={locales('labels.selectProvince')}
                    data={provinces}
                    containerStyle={{
                        paddingHorizontal: 20
                    }}
                />
                <Dropdown
                    onChangeText={(value) => this.setCity(value)}
                    label={locales('labels.selectCity')}
                    data={cities}
                    containerStyle={{
                        paddingHorizontal: 20
                    }}
                />
                <View style={{ marginVertical: 20 }}>
                    <Button
                        onPress={() => this.onSubmit()}
                        style={!city.length || !province.length ? styles.disableLoginButton : styles.loginButton}
                        rounded
                        disabled={!city.length || !province.length}
                    >
                        <Text style={styles.buttonText}>{locales('titles.nextStep')}</Text>
                    </Button>
                </View>
            </Spin>
        )
    }
}
const styles = StyleSheet.create({
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
    buttonText: {
        color: 'white',
        width: '100%',
        textAlign: 'center'
    },
    disableLoginButton: {
        textAlign: 'center',
        margin: 10,
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