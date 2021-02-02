import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Button, Textarea, InputGroup, Label } from 'native-base';
import { connect } from 'react-redux';

import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';

import { deviceWidth, deviceHeight } from '../../utils/deviceDimenssions';

const Rating = props => {

    const descriptionRef = useRef();

    const [description, setDescription] = useState('');
    const [descriptionError, setDescriptionError] = useState('');

    const [stars, setStars] = useState(
        [
            {
                number: 1,
                color: '#BDC4CC',
            },
            {
                number: 2,
                color: '#BDC4CC',
            },
            {
                number: 3,
                color: '#BDC4CC',
            },
            {
                number: 4,
                color: '#BDC4CC',
            },
            {
                number: 5,
                color: '#BDC4CC',
            },
        ]
    );

    const onStarsPressed = (selectedItem) => {
        let tempStars = [...stars]
        tempStars.forEach(item => {
            if (item.number <= selectedItem.number)
                item.color = '#FFBB00';
            else
                item.color = '#BDC4CC';
        });
        setStars(tempStars);
    };


    const onDescriptionSubmit = field => {
        this.setState(() => ({
            description: field,
            descriptionClicked: !!field,
            descriptionError: (!field || validator.isValidDescription(field)) ?
                '' : locales('errors.invalidDescription')
        }));
    };


    return (
        <View
            style={{
                backgroundColor: '#F6FBFF',
                padding: 20,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: '#F2F2F2',
                width: deviceWidth * 0.9,
                alignSelf: 'center'
            }}
        >
            <Text
                style={{
                    color: '#474747',
                    textAlign: 'center',
                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                    fontSize: 16
                }}
            >
                {locales('titles.enterYourRate')}
            </Text>
            <View
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row-reverse',
                    marginTop: 5,
                    marginBottom: 20,
                }}
            >
                {stars.map((item) => (
                    <TouchableOpacity
                        style={{ marginHorizontal: 2 }}
                        activeOpacity={1}
                        onPress={_ => onStarsPressed(item)}
                    >
                        <FontAwesome5
                            name='star'
                            key={item.number}
                            color={item.color}
                            size={40}
                            solid
                        />
                        <Text
                            style={{
                                position: 'absolute',
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                fontSize: 14,
                                color: '#777777',
                                left: item.number <= 1 ? 19 : 18,
                                top: 12
                            }}
                        >
                            {item.number}
                        </Text>
                        <Text
                            style={{
                                textAlign: 'center',
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                fontSize: 12,
                                position: 'absolute',
                                bottom: -25,
                                width: 55,
                                right: -5,
                                color: '#BEBEBE',
                            }}
                        >
                            {item.number == 1 ? locales('titles.veryBad') : item.number == 5 ? locales('titles.veryGood') : null}
                        </Text>
                    </TouchableOpacity>
                )
                )
                }
            </View>

            <View style={styles.textInputPadding, { width: '100%', marginTop: 20 }}>
                <Label style={{
                    color: '#777777', fontFamily: 'IRANSansWeb(FaNum)_Bold',
                    fontSize: 15, marginVertical: 5
                }}
                >
                    {locales('titles.headerDescription')}
                </Label>
                <InputGroup
                    regular
                    style={{
                        borderRadius: 4,
                        borderColor: descriptionError ? '#E41C38' : '#00C569',
                        paddingLeft: 15,
                        paddingHorizontal: 10,
                        backgroundColor: '#FBFBFB'
                    }}>
                    <FontAwesome5 name={descriptionError ? 'times-circle' : 'check-circle'}
                        color={descriptionError ? '#E41C38' : '#00C569'}
                        size={16}
                        solid
                        style={{ position: 'absolute', top: 10, left: 10 }}
                    />
                    <Textarea
                        onChangeText={onDescriptionSubmit}
                        error=''
                        value={description}
                        autoCapitalize='none'
                        autoCompleteType='off'
                        autoCorrect={false}
                        // placeholderTextColor='#777777'
                        // placeholder={locales('titles.descriptionWithExample')}
                        ref={descriptionRef}
                        style={{
                            fontFamily: 'IRANSansWeb(FaNum)_Light',
                            paddingTop: 10,
                            direction: 'rtl',
                            textAlign: 'right',
                            width: '100%'
                        }}
                        rowSpan={5}
                    />
                </InputGroup>
                <Label style={{ height: 20, fontSize: 14, color: '#D81A1A' }}>
                    {!!descriptionError && descriptionError}
                </Label>
            </View>
            <Button
                style={{
                    textAlign: 'center',
                    zIndex: 10005,
                    borderRadius: 5,
                    elevation: 0,
                    padding: 25,
                    marginBottom: 10,
                    backgroundColor: '#00C886',
                    width: '40%',
                    color: 'white',
                    alignItems: 'center',
                    alignSelf: 'center',
                    justifyContent: 'center',
                    fontFamily: 'IRANSansWeb(FaNum)_Bold'
                }}
                rounded
            >
                <View
                    style={{
                        flexDirection: 'row', justifyContent: 'center',
                        alignItems: 'center', width: '100%'
                    }}>
                    <Text
                        style={{
                            color: 'white',
                            textAlign: 'center',
                            fontSize: 20,
                            marginHorizontal: 3,
                            marginTop: 2,
                            fontFamily: 'IRANSansWeb(FaNum)_Bold'
                        }}>{locales('titles.postComment')}</Text>
                    <FontAwesome5
                        name='star'
                        color='#FFBB00'
                        size={22}
                        solid
                    />
                </View>
            </Button>

        </View>
    )
};




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
        borderWidth: 1,
        borderColor: '#BDC4CC',
        backgroundColor: 'white',
        alignItems: 'center',
        borderRadius: 5,
        justifyContent: 'center',
        width: '37%',
        elevation: 0,
        margin: 10,
    },
    disableLoginButton: {
        textAlign: 'center',
        margin: 10,
        elevation: 0,
        width: '37%',
        color: 'white',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: '#B5B5B5',
        alignSelf: 'flex-start',
        justifyContent: 'center'
    },
    loginButton: {
        textAlign: 'center',
        margin: 10,
        elevation: 0,
        backgroundColor: '#00C569',
        borderRadius: 5,
        width: '37%',
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
    },
    labelInputPadding: {
        paddingVertical: 5,
        paddingHorizontal: 20
    }
});


const mapStateToProps = (state) => {
    return {
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(Rating);