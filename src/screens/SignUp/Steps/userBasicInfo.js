import React from 'react';
import {
    Text,
    StyleSheet,
    View,
    ActivityIndicator,
    TouchableOpacity,
    ScrollView,
    Image
} from 'react-native';
import {
    Button,
    Input,
    Item,
    Label,
    Radio
} from 'native-base';
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
import { connect } from 'react-redux';
import RNPickerSelect from 'react-native-picker-select';

import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';

import { deviceWidth } from '../../../utils/index';
import { validator } from '../../../utils';
import * as authActions from '../../../redux/auth/actions'
import * as locationActions from '../../../redux/locations/actions';
class UserBasicInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstNameError: '',
            lastNameError: '',
            firstName: '',
            lastName: '',
            activityType: null,
            activityZoneError: '',
            activityTypeError: '',
            selectedCategoryId: null,
            province: null,
            provinceError: '',
            city: null,
            cityError: ''
        }
    }

    componentDidMount() {
        this.props.fetchAllActivityZones();
        this.props.fetchAllProvinces();
        if (!!this.props.gender && !!this.props.firstName && !!this.props.lastName) {
            this.setState({ gender: this.props.gender, lastName: this.props.lastName, firstName: this.props.firstName });
        }
    }

    onSubmit = () => {
        const {
            allProvincesObject = {},
            allCitiesObject = {},
        } = this.props;

        const {
            provinces = []
        } = allProvincesObject;

        const {
            cities = []
        } = allCitiesObject;

        let {
            firstName,
            lastName,
            activityType,
            province,
            city,
            selectedCategoryId,
        } = this.state;

        let isFirstNameValid,
            isLastNameValid,
            isActivityTypeValid,
            isProvinceValid,
            isActivityZoneValid,
            isCityValid,
            firstNameError,
            lastNameError,
            provinceError,
            cityError,
            activityZoneError,
            activityTypeError;

        if (!selectedCategoryId) {
            activityZoneError = locales('errors.fieldNeeded', { fieldName: locales('labels.activityZone') });
            isActivityZoneValid = false;
        }
        else {
            activityZoneError = ''
            isActivityZoneValid = true;
        }

        if (!province) {
            provinceError = locales('errors.fieldNeeded', { fieldName: locales('labels.province') })
            isProvinceValid = false;
        }

        else {
            provinceError = '';
            isProvinceValid = true;
        }

        if (!city) {
            cityError = locales('errors.fieldNeeded', { fieldName: locales('labels.city') })
            isCityValid = false;
        }

        else {
            cityError = '';
            isCityValid = true;
        }

        if (activityType == null) {
            activityTypeError = locales('errors.fieldNeeded', { fieldName: locales('labels.activityType') })
            isActivityTypeValid = false;
        }

        else {
            activityTypeError = '';
            isActivityTypeValid = true;
        }

        if (!firstName) {
            firstNameError = locales('errors.fieldNeeded', { fieldName: locales('titles.firstName') })
            isFirstNameValid = false;
        }
        else if (!validator.isPersianName(firstName)) {
            firstNameError = locales('errors.invalidFormat', { fieldName: locales('titles.firstName') });
            isFirstNameValid = false;
        }
        else {
            firstNameError = '';
            isFirstNameValid = true;
        }


        if (!lastName) {
            lastNameError = locales('errors.fieldNeeded', { fieldName: locales('titles.lastName') })
            isLastNameValid = false;
        }
        else if (!validator.isPersianName(lastName)) {
            lastNameError = locales('errors.invalidFormat', { fieldName: locales('titles.lastName') });
            isLastNameValid = false;
        }
        else {
            lastNameError = '';
            isLastNameValid = true;
        }

        if (
            isLastNameValid &&
            isFirstNameValid &&
            isActivityTypeValid &&
            isActivityZoneValid &&
            isProvinceValid &&
            isCityValid
        ) {
            const provinceName = provinces.find(item => item.id == province).province_name;

            const cityName = allCitiesObject &&
                Object.entries(allCitiesObject).length &&
                cities
                ? cities.find(item => item.id == city).city_name : '';

            this.props.setFullNameAndGender(
                firstName,
                lastName,
                province,
                provinceName,
                city,
                cityName,
                activityType,
                selectedCategoryId
            );
        }
        else {
            this.setState({
                firstNameError,
                lastNameError,
                provinceError,
                cityError,
                activityTypeError,
                activityZoneError
            });
        }
    };

    onFirstNameChanged = firstName => {
        this.setState(() => ({
            firstName,
            firstNameError: !firstName || validator.isPersianName(firstName) ?
                ''
                : locales('errors.invalidFormat', { fieldName: locales('titles.firstName') })
        }));
    };

    onLastNameChanged = lastName => {
        this.setState(() => ({
            lastName,
            lastNameError: !lastName || validator.isPersianName(lastName) ?
                ''
                : locales('errors.invalidFormat', { fieldName: locales('titles.lastName') })
        }));
    };

    setProvince = value => {
        this.setState({ disableCity: true }, _ => {
            let { provinces = [] } = this.props.allProvincesObject;
            if (provinces.length) {
                this.setState({
                    province: value,
                    provinceError: '',
                    city: '',
                    cityError: ''
                });
                this.props.fetchAllProvinces(provinces.some(item => item.id == value) ?
                    provinces.find(item => item.id == value).id :
                    undefined)
                    .then(_ => {
                        this.setState({ disableCity: false })
                    })
            };
        });
    };

    setCity = value => {
        if (!!value)
            this.setState({ city: value, cityError: '' })
    };

    onActivityZoneSubmit = value => {
        this.setState({ selectedCategoryId: value, activityZoneError: '' })
    };

    render() {
        let {
            loading,
            allProvincesObject = {},
            fetchCitiesLoading,
            allCitiesObject = {},
            activityZoneLoading,
            activityZones,
            submitRegisterLoading
        } = this.props

        let {
            lastName,
            firstName,
            firstNameError,
            lastNameError,
            city,
            province,
            provinceError,
            cityError,
            selectedCategoryId,
            activityType,
            activityTypeError,
            activityZoneError,
        } = this.state


        let { provinces = [] } = allProvincesObject;

        let { cities = [] } = allCitiesObject;

        provinces = provinces.map(item => ({ ...item, value: item.province_name }));

        if (allCitiesObject && Object.entries(allCitiesObject).length && cities) {
            cities = cities.map(item => ({ ...item, value: item.city_name }))
        };

        return (
            <ScrollView
                keyboardDismissMode='none'
                keyboardShouldPersistTaps='handled'
            >
                <View
                    style={{ marginTop: 10 }}
                >
                    <Label
                        style={{
                            color: 'rgba(0, 0, 0, 0.7)',
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            padding: 2,
                            paddingHorizontal: 10
                        }}
                    >
                        {locales('titles.firstName')} <Text
                            style={{
                                color: '#F24E1E',
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            }}
                        >
                            *
                        </Text>
                    </Label>
                    <Item
                        regular
                        style={{
                            borderColor: (firstNameError ? '#D50000'
                                : ((firstName.length &&
                                    validator.isPersianName(firstName))
                                    ? '#00C569'
                                    : 'rgba(0, 0, 0, 0.15)'
                                )),
                            borderRadius: 12,
                            overflow: 'hidden',
                            width: deviceWidth * 0.95,
                            alignSelf: 'center'
                        }}>
                        <Input
                            autoCapitalize='none'
                            autoCorrect={false}
                            autoCompleteType='off'
                            style={{
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                textDecorationLine: 'none',
                                fontSize: 16,
                                height: 50,
                                backgroundColor: '#fff',
                                padding: 3,
                                direction: 'rtl',
                                textAlign: 'right'
                            }}
                            onChangeText={this.onFirstNameChanged}
                            value={firstName}
                            placeholderTextColor="#bebebe"
                            placeholder={locales('titles.enterFirstName')}

                        />
                    </Item>
                    <Label
                        style={{
                            fontSize: 14,
                            height: 20,
                            textAlign: 'center',
                            fontFamily: 'IRANSansWeb(FaNum)_Light',
                            color: '#D81A1A'
                        }}>
                        {firstNameError}
                    </Label>
                </View>
                <View
                    style={{
                        marginTop: 5
                    }}
                >
                    <Label
                        style={{
                            color: 'rgba(0, 0, 0, 0.7)',
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            padding: 5,
                            left: -5
                        }}
                    >
                        {locales('titles.lastName')} <Text
                            style={{
                                color: '#F24E1E',
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            }}
                        >
                            *
                        </Text>
                    </Label>
                    <Item
                        regular
                        style={{
                            borderRadius: 5,
                            overflow: 'hidden',
                            borderColor: (lastNameError ? '#D50000' :
                                ((lastName.length &&
                                    validator.isPersianName(lastName)) ?
                                    '#00C569'
                                    : 'rgba(0, 0, 0, 0.15)')),
                            borderRadius: 12,
                            width: deviceWidth * 0.95,
                            alignSelf: 'center'
                        }}
                    >
                        <Input
                            autoCapitalize='none'
                            autoCorrect={false}
                            autoCompleteType='off'
                            style={{
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                textDecorationLine: 'none',
                                fontSize: 16,
                                height: 50,
                                backgroundColor: '#fff',
                                padding: 3,
                                direction: 'rtl',
                                textAlign: 'right'
                            }}
                            onChangeText={this.onLastNameChanged}
                            value={lastName}
                            placeholderTextColor='#bebebe'
                            placeholder={locales('titles.enterLastName')}
                        />
                    </Item>
                    <Label
                        style={{
                            height: 20,
                            fontSize: 14,
                            textAlign: 'center',
                            fontFamily: 'IRANSansWeb(FaNum)_Light',
                            color: '#D81A1A'
                        }}>
                        {lastNameError}
                    </Label>
                </View>

                <View
                    style={{
                        flexDirection: 'row-reverse',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        marginTop: 5,
                        width: deviceWidth,
                    }}
                >

                    <View
                        style={{
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'row-reverse'
                            }}>
                            <Label
                                style={
                                    {
                                        color: 'black',
                                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                        fontSize: 16
                                    }
                                }
                            >
                                {locales('labels.province')} <Text
                                    style={{
                                        color: '#F24E1E',
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                    }}
                                >
                                    *
                                </Text>
                            </Label>
                            {!!loading ?
                                <ActivityIndicator
                                    size="small"
                                    color="#00C569"
                                    style={{
                                        position: 'relative',
                                        width: 30,
                                        height: 30,
                                        borderRadius: 25
                                    }}
                                />
                                : null
                            }
                        </View>
                        <Item
                            regular
                            style={{

                                borderRadius: 12,
                                alignSelf: 'center',
                                backgroundColor: '#fff',
                                overflow: 'hidden',
                                borderColor:
                                    province ?
                                        '#00C569'
                                        : provinceError
                                            ? '#D50000'
                                            : 'rgba(0, 0, 0, 0.15)'
                            }}
                        >
                            <RNPickerSelect
                                Icon={() => <FontAwesome5
                                    name='angle-down'
                                    size={25}
                                    color='#bebebe'
                                />
                                }
                                useNativeAndroidPickerStyle={false}
                                onValueChange={this.setProvince}
                                style={smallPickersStyle}
                                disabled={loading}
                                value={province}
                                placeholder={{
                                    label: locales('labels.selectProvince'),
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                }}
                                items={[...provinces.map(item => ({
                                    label: item.province_name,
                                    value: item.id
                                }))]}
                            />
                        </Item>
                        <Label
                            style={
                                {
                                    fontFamily: 'IRANSansWeb(FaNum)_Light',
                                    fontSize: 14,
                                    color: '#D81A1A',
                                    height: 20,
                                    textAlign: 'center',
                                }
                            }
                        >
                            {provinceError}
                        </Label>
                    </View>

                    <View>
                        <View style={{
                            flexDirection: 'row-reverse'
                        }}>
                            <Label
                                style={{
                                    color: 'black',
                                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                }}
                            >
                                {locales('labels.city')} <Text
                                    style={{
                                        color: '#F24E1E',
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                        fontSize: 16
                                    }}
                                >
                                    *
                                </Text>
                            </Label>
                            {(!!fetchCitiesLoading) ?
                                <ActivityIndicator
                                    size="small"
                                    color="#00C569"
                                    style={{
                                        position: 'relative',
                                        width: 30,
                                        height: 30,
                                        borderRadius: 25
                                    }}
                                />
                                : null}
                        </View>
                        <Item
                            regular
                            style={{
                                borderRadius: 12,
                                alignSelf: 'center',
                                backgroundColor: '#fff',
                                overflow: 'hidden',
                                borderColor:
                                    city ?
                                        '#00C569' :
                                        cityError ?
                                            '#D50000' :
                                            'rgba(0, 0, 0, 0.15)'
                            }}
                        >
                            <RNPickerSelect
                                Icon={() => <FontAwesome5
                                    name='angle-down'
                                    size={25}
                                    color='#bebebe'
                                />
                                }
                                useNativeAndroidPickerStyle={false}
                                onValueChange={this.setCity}
                                style={smallPickersStyle}
                                disabled={
                                    fetchCitiesLoading ||
                                    loading ||
                                    this.state.disableCity
                                }
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
                        <Label
                            style={{
                                fontFamily: 'IRANSansWeb(FaNum)_Light',
                                fontSize: 14,
                                color: '#D81A1A',
                                textAlign: 'center',
                                height: 20,
                            }}>
                            {cityError}
                        </Label>
                    </View>

                </View>

                <View
                    style={{
                        marginVertical: 5
                    }}
                >
                    <Text
                        style={
                            {
                                color: '#000000',
                                fontSize: 16,
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                paddingVertical: 5,
                                left: -10,
                            }
                        }
                    >
                        {locales('labels.activityZone')} <Text
                            style={{
                                color: '#F24E1E',
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            }}
                        >
                            *
                        </Text>
                    </Text>
                    {activityZoneLoading ?
                        <ActivityIndicator
                            size="small"
                            color="#00C569"
                            style={{
                                position: 'absolute',
                                right: '22%',
                                bottom: '64%',
                                width: 50,
                                height: 50,
                                borderRadius: 25
                            }}
                        />
                        : null
                    }
                    <Item
                        regular
                        style={{
                            width: deviceWidth * 0.95,
                            borderRadius: 12,
                            alignSelf: 'center',
                            borderColor:
                                selectedCategoryId ?
                                    '#00C569' :
                                    activityZoneError ?
                                        '#D50000' :
                                        'rgba(0, 0, 0, 0.15)'
                        }}
                    >
                        <RNPickerSelect
                            Icon={() => <FontAwesome5
                                name='angle-down'
                                size={25}
                                color='#bebebe'
                            />
                            }
                            useNativeAndroidPickerStyle={false}
                            onValueChange={this.onActivityZoneSubmit}
                            style={styles}
                            disabled={activityZoneLoading}
                            value={selectedCategoryId}
                            placeholder={{
                                label: locales('labels.selectActivityZone'),
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            }}
                            items={[...activityZones.map(item => ({
                                label: item.category_name, value: item.id
                            }))]}
                        />
                    </Item>
                    <Label
                        style={{
                            fontFamily: 'IRANSansWeb(FaNum)_Light',
                            fontSize: 14,
                            height: 20,
                            color: '#D81A1A',
                            textAlign: 'center',
                        }}>
                        {activityZoneError}
                    </Label>
                </View>

                <View
                    style={{
                        marginTop: 5
                    }}
                >
                    <Label
                        style={{
                            color: 'rgba(0, 0, 0, 0.7)',
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            padding: 5,
                            left: -5
                        }}
                    >
                        {locales('labels.activityType')} <Text
                            style={{
                                color: '#F24E1E',
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            }}
                        >
                            *
                        </Text>
                    </Label>
                    <View
                        style={{
                            flexDirection: 'row-reverse',
                            alignItems: 'space-between',
                            width: '100%',
                            justifyContent: 'center'
                        }}
                    >
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => this.setState({
                                activityType: 0,
                                activityTypeError: ''
                            })}
                            style={{
                                flexDirection: 'row-reverse',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 12,
                                padding: 13,
                                width: '40%',
                                marginRight: 5,
                                borderWidth: 1,
                                borderColor: activityTypeError ?
                                    '#D81A1A'
                                    : (activityType == 0 ?
                                        "rgba(60, 193, 59, 1)" :
                                        'rgba(0,0,0,0.15)'),
                            }}
                        >
                            <Radio
                                onPress={() => this.setState({
                                    activityType: 0,
                                    activityTypeError: ''
                                })}
                                selected={activityType === 0}
                                color={"#BEBEBE"}
                                // style={{ marginHorizontal: 10 }}
                                selectedColor="rgba(60, 193, 59, 1)"
                            />
                            <Svg
                                style={{
                                    marginHorizontal: 5,
                                    bottom: 5
                                }}
                                xmlns="http://www.w3.org/2000/svg"
                                width="24.011"
                                height="29.612"
                                viewBox="0 0 24.011 29.612"
                            >
                                <Path
                                    fill={activityType == 0 ? "rgba(60, 193, 59, 1)" : '#000000'}
                                    d="M21.639 19.053l-5.225-1.513a1.421 1.421 0 01-1.021-1.358V14.9a.462.462 0 00-.027-.148 5.04 5.04 0 001.716-3.789V8.7h3.737V7.409h-3.737V5.152a5.052 5.052 0 10-10.1 0v2.257H3.17V8.7h3.81v2.257a5.04 5.04 0 001.676 3.754.462.462 0 00-.038.185v1.284A1.421 1.421 0 017.6 17.542l-5.23 1.511A3.3 3.3 0 000 22.208v6.262a.462.462 0 00.924 0v-6.262a2.372 2.372 0 011.7-2.269l1.864-.539v9.615a.693.693 0 001.386 0V19.3a.689.689 0 00-.059-.277l1.774-.514v2.125a2.2 2.2 0 002.233 2.163h4.343a2.2 2.2 0 002.235-2.166V18.5l1.81.524a.692.692 0 00-.022.171v9.827a.693.693 0 001.386 0v-9.6l1.808.523a2.372 2.372 0 011.7 2.268v6.261a.462.462 0 10.924 0v-6.266a3.3 3.3 0 00-2.367-3.155zM7.9 5.152a4.128 4.128 0 118.255 0v2.257H7.9zm0 5.81V8.7h8.255v2.257a4.128 4.128 0 11-8.255 0zm6.262 10.9H9.823a1.276 1.276 0 01-1.309-1.239v-2.508a2.351 2.351 0 001.028-1.934v-.832a5.036 5.036 0 004.927.03v.8a2.351 2.351 0 001.006 1.92v2.527a1.277 1.277 0 01-1.308 1.245z"
                                    data-name="Path 11"
                                    transform="translate(0 -.1)"
                                ></Path>
                            </Svg>
                            <Text
                                style={{
                                    marginHorizontal: 5,
                                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                    fontSize: 16,
                                    color: activityType == 0 ? "rgba(60, 193, 59, 1)" : '#000000'
                                }}
                            >
                                {locales('labels.seller')}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => this.setState({
                                activityType: 1,
                                activityTypeError: ''
                            })}
                            style={{
                                flexDirection: 'row-reverse',
                                alignItems: 'center',
                                justifyContent: 'center',
                                left: 5,
                                borderWidth: 1,
                                marginLeft: 5,
                                borderRadius: 12,
                                padding: 10,
                                borderColor: activityTypeError ?
                                    '#D81A1A'
                                    : (activityType == 1 ?
                                        "rgba(60, 193, 59, 1)" :
                                        'rgba(0,0,0,0.15)'),
                                marginTop: 5,
                                width: '40%'
                            }}
                        >
                            <Radio
                                onPress={() => this.setState({
                                    activityType: 1,
                                    activityTypeError: ''
                                })}
                                selected={activityType === 1}
                                color={"#BEBEBE"}
                                // style={{ marginHorizontal: 10 }}
                                selectedColor="rgba(60, 193, 59, 1)"
                            />
                            <Svg
                                style={{
                                    marginHorizontal: 5,
                                }}
                                xmlns="http://www.w3.org/2000/svg"
                                width="25.404"
                                height="35.49"
                                viewBox="0 0 25.404 35.49"
                            >
                                <Path
                                    fill={activityType == 1 ? "rgba(60, 193, 59, 1)" : '#000000'}
                                    d="M22.9 18.2l-5.528-1.6a1.476 1.476 0 01-.286-.118.483.483 0 00-.232-.153 1.5 1.5 0 01-.562-1.167V13.62a5.333 5.333 0 001.788-3.985v-4.19a5.345 5.345 0 10-10.69 0v4.19a5.332 5.332 0 001.734 3.936v1.587A1.5 1.5 0 018.039 16.6l-5.53 1.6A3.492 3.492 0 000 21.536v6.625a.489.489 0 10.978 0v-6.625a2.51 2.51 0 011.8-2.4l2.053-.593a.481.481 0 00.038.046L7.5 21.217a2 2 0 002.583.216l.923-.657a1.76 1.76 0 00.652 1.047l-2.065 9.966a.763.763 0 00.184.654l2.068 2.747.045.052a1.188 1.188 0 001.679 0l.024-.024 2.092-2.779a.767.767 0 00.179-.66L13.8 21.822a1.76 1.76 0 00.651-1.046l.923.657a2 2 0 002.583-.216l2.66-2.66 2 .58a2.51 2.51 0 011.8 2.4v6.625a.489.489 0 10.978 0v-6.626A3.492 3.492 0 0022.9 18.2zM14.525 1.478l-.044-.034.054.024zm-6.16 8.159V7.049q.27.025.541.025a5.711 5.711 0 004.032-1.662L14.4 3.945a2.222 2.222 0 011.153.676 3.456 3.456 0 001.541.894v4.12a4.367 4.367 0 11-8.735 0zm4.368 5.345a5.311 5.311 0 002.579-.666v.844a2.475 2.475 0 00.6 1.6l-2.762 1.964a1.7 1.7 0 00-.841 0l-2.79-1.986a2.474 2.474 0 00.577-1.58v-.88a5.31 5.31 0 002.634.7zm-3.219 5.654a1.027 1.027 0 01-1.326-.111L5.9 18.234l2.414-.7a2.444 2.444 0 00.414-.163l2.672 1.907c-.011.013-.022.023-.032.036zm5.372 11.244l-2.027 2.692a.209.209 0 01-.259 0l-2.027-2.692 2.006-9.693c.05 0 .1.008.151.008a.972.972 0 00.151-.008zm2.385-11.355a1.027 1.027 0 01-1.325.11l-1.858-1.322c-.01-.013-.022-.023-.032-.036l2.656-1.89a2.444 2.444 0 00.382.147l2.461.712z"
                                    data-name="Path 7"
                                    transform="translate(0 -.1)"
                                ></Path>
                            </Svg>
                            <Text
                                style={{
                                    marginHorizontal: 5,
                                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                    fontSize: 16,
                                    color: activityType == 1 ? "rgba(60, 193, 59, 1)" : '#000000'
                                }}
                            >
                                {locales('labels.buyer')}
                            </Text>
                        </TouchableOpacity>

                    </View>
                </View>


                {/* 
                <View
                    style={{
                        marginTop: 20,
                        borderWidth: 1,
                        borderColor: activityType == 0 || activityType == 1
                            ? '#00C569'
                            : activityTypeError
                                ? '#D50000'
                                : 'rgba(0, 0, 0, 0.15)',
                        borderRadius: 8,
                        height: 140,
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                        width: deviceWidth * 0.95,
                        alignSelf: 'center'
                    }}
                >
                    <Text
                        style={{
                            top: -13,
                            backgroundColor: 'white',
                            textAlign: 'center',
                            position: 'absolute',
                            width: '25%',
                            right: 20,
                            paddingHorizontal: 10,
                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            fontSize: 14,
                            alignSelf: 'flex-end'
                        }}
                    >
                        {locales('labels.activityType')}
                    </Text>

                    <View
                        style={{
                            paddingHorizontal: 20
                        }}
                    >

                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => this.setState({
                                activityType: 0,
                                activityTypeError: ''
                            })}
                            style={{
                                flexDirection: 'row-reverse',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Radio
                                onPress={() => this.setState({
                                    activityType: 0,
                                    activityTypeError: ''
                                })}
                                selected={activityType === 0}
                                color={"#BEBEBE"}
                                // style={{ marginHorizontal: 10 }}
                                selectedColor="rgba(60, 193, 59, 1)"
                            />
                            <Svg
                                style={{
                                    marginHorizontal: 5,
                                    bottom: 5
                                }}
                                xmlns="http://www.w3.org/2000/svg"
                                width="24.011"
                                height="29.612"
                                viewBox="0 0 24.011 29.612"
                            >
                                <Path
                                    fill='#000000'
                                    d="M21.639 19.053l-5.225-1.513a1.421 1.421 0 01-1.021-1.358V14.9a.462.462 0 00-.027-.148 5.04 5.04 0 001.716-3.789V8.7h3.737V7.409h-3.737V5.152a5.052 5.052 0 10-10.1 0v2.257H3.17V8.7h3.81v2.257a5.04 5.04 0 001.676 3.754.462.462 0 00-.038.185v1.284A1.421 1.421 0 017.6 17.542l-5.23 1.511A3.3 3.3 0 000 22.208v6.262a.462.462 0 00.924 0v-6.262a2.372 2.372 0 011.7-2.269l1.864-.539v9.615a.693.693 0 001.386 0V19.3a.689.689 0 00-.059-.277l1.774-.514v2.125a2.2 2.2 0 002.233 2.163h4.343a2.2 2.2 0 002.235-2.166V18.5l1.81.524a.692.692 0 00-.022.171v9.827a.693.693 0 001.386 0v-9.6l1.808.523a2.372 2.372 0 011.7 2.268v6.261a.462.462 0 10.924 0v-6.266a3.3 3.3 0 00-2.367-3.155zM7.9 5.152a4.128 4.128 0 118.255 0v2.257H7.9zm0 5.81V8.7h8.255v2.257a4.128 4.128 0 11-8.255 0zm6.262 10.9H9.823a1.276 1.276 0 01-1.309-1.239v-2.508a2.351 2.351 0 001.028-1.934v-.832a5.036 5.036 0 004.927.03v.8a2.351 2.351 0 001.006 1.92v2.527a1.277 1.277 0 01-1.308 1.245z"
                                    data-name="Path 11"
                                    transform="translate(0 -.1)"
                                ></Path>
                            </Svg>
                            <Text
                                style={{
                                    marginHorizontal: 5,
                                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                    fontSize: 16,
                                    color: '#000000'
                                }}
                            >
                                {locales('labels.seller')}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => this.setState({
                                activityType: 1,
                                activityTypeError: ''
                            })}
                            style={{
                                flexDirection: 'row-reverse',
                                alignItems: 'center',
                                justifyContent: 'center',
                                left: 5,
                                marginTop: 20
                            }}
                        >
                            <Radio
                                onPress={() => this.setState({
                                    activityType: 1,
                                    activityTypeError: ''
                                })}
                                selected={activityType === 1}
                                color={"#BEBEBE"}
                                // style={{ marginHorizontal: 10 }}
                                selectedColor="rgba(60, 193, 59, 1)"
                            />
                            <Svg
                                style={{
                                    marginHorizontal: 5,
                                    bottom: 5,
                                }}
                                xmlns="http://www.w3.org/2000/svg"
                                width="25.404"
                                height="35.49"
                                viewBox="0 0 25.404 35.49"
                            >
                                <Path
                                    fill='#000000'
                                    d="M22.9 18.2l-5.528-1.6a1.476 1.476 0 01-.286-.118.483.483 0 00-.232-.153 1.5 1.5 0 01-.562-1.167V13.62a5.333 5.333 0 001.788-3.985v-4.19a5.345 5.345 0 10-10.69 0v4.19a5.332 5.332 0 001.734 3.936v1.587A1.5 1.5 0 018.039 16.6l-5.53 1.6A3.492 3.492 0 000 21.536v6.625a.489.489 0 10.978 0v-6.625a2.51 2.51 0 011.8-2.4l2.053-.593a.481.481 0 00.038.046L7.5 21.217a2 2 0 002.583.216l.923-.657a1.76 1.76 0 00.652 1.047l-2.065 9.966a.763.763 0 00.184.654l2.068 2.747.045.052a1.188 1.188 0 001.679 0l.024-.024 2.092-2.779a.767.767 0 00.179-.66L13.8 21.822a1.76 1.76 0 00.651-1.046l.923.657a2 2 0 002.583-.216l2.66-2.66 2 .58a2.51 2.51 0 011.8 2.4v6.625a.489.489 0 10.978 0v-6.626A3.492 3.492 0 0022.9 18.2zM14.525 1.478l-.044-.034.054.024zm-6.16 8.159V7.049q.27.025.541.025a5.711 5.711 0 004.032-1.662L14.4 3.945a2.222 2.222 0 011.153.676 3.456 3.456 0 001.541.894v4.12a4.367 4.367 0 11-8.735 0zm4.368 5.345a5.311 5.311 0 002.579-.666v.844a2.475 2.475 0 00.6 1.6l-2.762 1.964a1.7 1.7 0 00-.841 0l-2.79-1.986a2.474 2.474 0 00.577-1.58v-.88a5.31 5.31 0 002.634.7zm-3.219 5.654a1.027 1.027 0 01-1.326-.111L5.9 18.234l2.414-.7a2.444 2.444 0 00.414-.163l2.672 1.907c-.011.013-.022.023-.032.036zm5.372 11.244l-2.027 2.692a.209.209 0 01-.259 0l-2.027-2.692 2.006-9.693c.05 0 .1.008.151.008a.972.972 0 00.151-.008zm2.385-11.355a1.027 1.027 0 01-1.325.11l-1.858-1.322c-.01-.013-.022-.023-.032-.036l2.656-1.89a2.444 2.444 0 00.382.147l2.461.712z"
                                    data-name="Path 7"
                                    transform="translate(0 -.1)"
                                ></Path>
                            </Svg>
                            <Text
                                style={{
                                    marginHorizontal: 5,
                                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                    fontSize: 16,
                                    color: '#000000'
                                }}
                            >
                                {locales('labels.buyer')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View> */}
                <Label
                    style={{
                        fontFamily: 'IRANSansWeb(FaNum)_Light',
                        fontSize: 14,
                        height: 20,
                        color: '#D81A1A',
                        textAlign: 'center',
                    }}>
                    {activityTypeError}
                </Label>
                <View style={{
                    paddingHorizontal: 10,
                    justifyContent: 'space-between',
                    marginTop: 5
                }}
                >
                    <Button
                        onPress={this.onSubmit}
                        style={[firstNameError ||
                            lastNameError ||
                            activityTypeError ||
                            activityZoneError ||
                            provinceError ||
                            cityError ||
                            !firstName ||
                            !lastName ||
                            !province ||
                            !city ||
                            activityType == null ||
                            !selectedCategoryId
                            ?
                            styles.disableLoginButton :
                            styles.loginButton,
                        {
                            width: deviceWidth * 0.95,
                            elevation: 0
                        }
                        ]
                        }
                        rounded
                    >
                        <Text
                            style={styles.buttonText}
                        >
                            {locales('titles.register')}
                        </Text>
                        <ActivityIndicator
                            animating={submitRegisterLoading}
                            size={20}
                            style={{
                                position: 'absolute',
                                left: '37%'
                            }}
                            color='white'
                        />
                    </Button>
                </View>
            </ScrollView >
        )
    };

};

const styles = StyleSheet.create({
    buttonText: {
        color: 'white',
        width: '100%',
        textAlign: 'center',
        fontFamily: 'IRANSansWeb(FaNum)_Bold',

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
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#bebebe',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30,
    },
    inputAndroid: {
        fontSize: 13,
        paddingHorizontal: deviceWidth * 0.05,
        fontFamily: 'IRANSansWeb(FaNum)_Medium',
        paddingVertical: 8,
        height: 50,
        color: 'black',
        width: deviceWidth * 0.98,
    },
    iconContainer: {
        left: 10,
        top: 13,
    }
});

const smallPickersStyle = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#bebebe',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30,
    },
    inputAndroid: {
        fontSize: 13,
        paddingHorizontal: deviceWidth * 0.02,
        fontFamily: 'IRANSansWeb(FaNum)_Medium',
        paddingVertical: 8,
        height: 50,
        color: 'black',
        width: deviceWidth * 0.45,
    },
    iconContainer: {
        left: 10,
        top: 13,
    }
});

const mapStateToProps = ({
    locationsReducer,
    authReducer
}) => {

    const {
        fetchAllProvincesLoading,
        fetchAllProvincesError,
        fetchAllProvincesFailed,
        fetchAllProvincesMessage,
        allProvincesObject,
        fetchAllCitiesLoading,
        fetchAllCitiesError,
        fetchAllCitiesFailed,
        fetchAllCitiesMessage,
        allCitiesObject,
    } = locationsReducer;

    const {
        fetchAllActivityZonesLoading,
        fetchAllActivityZonesError,
        fetchAllActivityZonesFailed,
        fetchAllActivityZonesMessage,
        activityZones,
        submitRegisterLoading,
    } = authReducer;

    return {
        loading: fetchAllProvincesLoading,
        error: fetchAllProvincesError,
        failed: fetchAllProvincesFailed,
        message: fetchAllProvincesMessage,
        allProvincesObject: allProvincesObject,
        fetchCitiesLoading: fetchAllCitiesLoading,
        fetchCitiesError: fetchAllCitiesError,
        fetchCitiesFailed: fetchAllCitiesFailed,
        fetchCitiesMessage: fetchAllCitiesMessage,
        allCitiesObject: allCitiesObject,

        activityZoneLoading: fetchAllActivityZonesLoading,
        activityZoneError: fetchAllActivityZonesError,
        activityZoneFail: fetchAllActivityZonesFailed,
        activityZoneMessage: fetchAllActivityZonesMessage,
        activityZones,

        submitRegisterLoading
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllProvinces: (provinceId) => dispatch(locationActions.fetchAllProvinces(provinceId, false)),
        fetchAllCities: () => dispatch(locationActions.fetchAllCities()),
        fetchAllActivityZones: () => dispatch(authActions.fetchAllActivityZones()),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(UserBasicInfo);