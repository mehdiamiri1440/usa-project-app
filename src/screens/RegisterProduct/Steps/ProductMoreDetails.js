// import react-native element
import React, { Component } from 'react';
import { Button } from 'native-base';
import { View, Text, StyleSheet } from "react-native";
import { Dropdown } from 'react-native-material-dropdown';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { deviceWidth, deviceHeight } from '../../../utils/deviceDimenssions';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import { TextField } from '../../../components/floatingInput';
import { dataGenerator, validator } from '../../../utils';


let tempDefaults = [
    {
        id: 1,
        name: "بسته بندی",
        description: 'نوع بسته بندی و وزن ارایه شده توسط فروشنده برای این محصول',
        itemValue: '',
        alreadySelected: false,
        selectedIndex: null,
    },
    {
        id: 2,
        name: "کیفیت",
        description: 'میزان مرغوبیت و کیفیت ظاهری محصول ارایه شده',
        itemValue: '',
        alreadySelected: false,
        selectedIndex: null,
    },
    {
        id: 3,
        name: "رنگ",
        description: 'رنگ ظاهری این محصول',
        itemValue: '',
        alreadySelected: false,
        selectedIndex: null,
    },
    // {
    //     id: 4,
    //     name: "وزن",
    //     description:'sdf sdfsadf',
    //     itemValue:'',
    //     alreadySelected:false,
    //     selectedIndex:null,
    // },
    {
        id: 5,
        name: "اندازه یا ابعاد",
        description: 'اندازه یا ابعاد محصول',
        itemValue: '',
        alreadySelected: false,
        selectedIndex: null,
    },
    {
        id: 6,
        name: "گواهی کیفی،سلامت",
        description: 'تاییدیه های کیفی، بهداشتی و سلامت کالا موجود برای این محصول',
        itemValue: '',
        alreadySelected: false,
        selectedIndex: null,
    },
    {
        id: 7,
        name: "تازگی",
        description: 'میزان تازه بودن و زمان تولید این محصول',
        itemValue: '',
        alreadySelected: false,
        selectedIndex: null,
    },
    {
        id: 8,
        name: "نوع فروش",
        description: 'شرایط پرداخت پول در معامله طبق نظر فروشنده برای فروش این محصول',
        itemValue: '',
        alreadySelected: false,
        selectedIndex: null,
    },
    {
        id: 9,
        name: "روش نگهداری یا ماندگاری",
        description: 'میزان ماندگاری و شرایط نگهداری این محصول',
        itemValue: '',
        alreadySelected: false,
        selectedIndex: null,
    },
    {
        id: 10,
        name: "مزیا نسبت به محصولات مشابه",
        description: 'مزیت این محصول نسبت به محصولات مشابه',
        itemValue: '',
        alreadySelected: false,
        selectedIndex: null,
    },
]



class ProductMoreDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultFieldsOptions: [...tempDefaults],
            description: '',
            detailsArray: [
                {
                    error: '',
                    itemKey: '',
                    itemValue: '',
                    keyId: dataGenerator.generateKey()
                },
                {
                    error: '',
                    itemKey: '',
                    itemValue: '',
                    keyId: dataGenerator.generateKey()
                },
                {
                    error: '',
                    itemKey: '',
                    itemValue: '',
                    keyId: dataGenerator.generateKey()
                },
            ],
            isDescriptionFocused: false
        }
    }

    onSubmit = () => {
        let { detailsArray } = this.state;
        if (detailsArray.some(item => item.itemKey && !item.itemValue)) {
            this.setState(state => {
                state.detailsArray.filter(item => item.itemKey && !item.itemValue)[0].error = locales('labels.completeCase')
                return '';
            })
        }
        else {
            this.setState(state => {
                state.detailsArray = state.detailsArray.filter(item => item.itemKey)
                return '';
            }, () => this.props.setDetailsArray([...(this.state.detailsArray)], [...tempDefaults]))
        }
    };


    deleteRow = index => {
        let selectedIndex = tempDefaults.findIndex(item => item.name == this.state.detailsArray[index].itemKey);
        if (selectedIndex > -1) {
            this.setState(state => {
                state.detailsArray.splice(index, 1);
                state.defaultFieldsOptions.splice(index, 0, tempDefaults[selectedIndex]);
                return '';
            });
        }
    }

    setItemKey = (value, dropDownIndex, index) => {
        this.setState(state => {
            state.detailsArray[index].itemKey = value;
            state.defaultFieldsOptions = state.defaultFieldsOptions.filter((item, ind) => dropDownIndex !== ind);
            return '';
        })
    };

    onDescriptionSubmit = (index, value) => {
        setTimeout(() => {
            if (validator.isValidDescription(value) && value.length) {
                this.setState(state => {
                    state.detailsArray[index].itemValue = value;
                    state.detailsArray[index].error = '';
                    return '';
                });
            }
            else {
                this.setState(state => {
                    state.detailsArray[index].error = locales('labels.incorrectFormat');
                    return '';
                });
            }
        }, 10);
    };

    addMoreRow = () => {
        if (this.state.detailsArray.length < tempDefaults.length) {
            this.setState(state => {
                state.detailsArray.push({
                    itemKey: '',
                    itemValue: '',
                    keyId: dataGenerator.generateKey()
                })
                return '';
            })
        }
    }


    render() {
        let { description, detailsArray, defaultFieldsOptions } = this.state;

        defaultFieldsOptions = defaultFieldsOptions.map(item => ({ ...item, value: item.name }))

        return (
            <ScrollView>
                <View
                    style={{ backgroundColor: 'white' }}>
                    <Text
                        style={{
                            marginVertical: 10,
                            color: '#666666',
                            fontSize: 20,
                            paddingHorizontal: 10
                        }}
                    >
                        {locales('labels.addMoreDetails')}
                    </Text>
                    <View style={{ flexDirection: 'row-reverse', width: deviceWidth, alignItems: 'center', justifyContent: 'center' }}>

                        <View style={{ flexDirection: 'row-reverse', width: deviceWidth * 0.4, alignItems: 'center', justifyContent: 'center' }}>
                            <Text
                                style={{
                                    color: 'red',
                                    fontSize: 14,
                                    paddingHorizontal: 10
                                }}
                            >
                                {locales('labels.example')} :
                            </Text>
                            <Text
                                style={{
                                    color: '#666666',
                                    fontSize: 14,
                                    paddingHorizontal: 10
                                }}
                            >
                                {locales('labels.boxing')}
                            </Text>
                        </View>

                        <View style={{ flexDirection: 'row-reverse', width: deviceWidth * 0.6, alignItems: 'center', justifyContent: 'center' }}>
                            <Text
                                style={{
                                    color: 'red',
                                    fontSize: 14,
                                    paddingHorizontal: 10
                                }}
                            >
                                {locales('labels.example')} :
                            </Text>
                            <Text
                                style={{
                                    color: '#666666',
                                    fontSize: 14,
                                    paddingHorizontal: 10
                                }}
                            >
                                {locales('labels.8kMotherBox')}
                            </Text>
                        </View>


                    </View>

                    {detailsArray.map((detail, index) => (
                        <View
                            key={detail.keyId}
                            style={{ flexDirection: 'row-reverse', paddingVertical: 20 }}>
                            <TouchableOpacity
                                onPress={() => this.deleteRow(index)}
                                style={{
                                    paddingRight: 10,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: 80
                                }}>
                                <FontAwesome name='trash' color='red' size={25} />
                            </TouchableOpacity>
                            <Dropdown
                                error={detail.error}
                                onChangeText={(value, dropDownIndex) => this.setItemKey(value, dropDownIndex, index)}
                                label={locales('titles.selectOne')}
                                data={defaultFieldsOptions}
                                containerStyle={{
                                    fontSize: 18,
                                    paddingHorizontal: 20,
                                    width: 195
                                }}
                            />
                            <TextField
                                baseColor={description.length ? '#00C569' : '#a8a8a8'}
                                onChangeText={(a, b, c) => this.onDescriptionSubmit(index, a, b, c)}
                                error={detail.error}
                                disabled={!detail.itemKey}
                                containerStyle={{ width: 170 }}
                                fontSize={18}
                                isRtl={true}
                                labelTextStyle={{ padding: 5 }}
                                label={locales('titles.writeDescription')}
                            />
                        </View>
                    )
                    )}


                    <View style={{
                        marginVertical: 20, flexDirection: 'row',
                        width: deviceWidth, justifyContent: 'space-between'
                    }}>
                        <Button
                            onPress={() => this.addMoreRow()}
                            style={styles.addMoreButton}
                            rounded
                        >
                            <Text style={styles.addMoreButtonText}>{locales('labels.addMore')}</Text>
                            <AntDesign name='plus' size={25} color='#00C569' />
                        </Button>
                    </View>

                    <View style={{
                        marginVertical: 20, flexDirection: 'row',
                        width: deviceWidth, justifyContent: 'space-between'
                    }}>
                        <Button
                            onPress={() => this.onSubmit()}
                            style={styles.loginButton}
                            rounded
                        >
                            <AntDesign name='arrowleft' size={25} color='white' />
                            <Text style={styles.buttonText}>{locales('titles.finalSubmit')}</Text>
                        </Button>
                        <Button
                            onPress={() => this.props.changeStep(5)}
                            style={styles.backButtonContainer}
                            rounded
                        >
                            <Text style={styles.backButtonText}>{locales('titles.previousStep')}</Text>
                            <AntDesign name='arrowright' size={25} color='#7E7E7E' />
                        </Button>
                    </View>

                </View>
            </ScrollView >
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
    addMoreButtonText: {
        color: '#00C569',
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
        width: deviceWidth * 0.4,
        color: 'white',
        alignItems: 'center',
        alignSelf: 'flex-start',
        justifyContent: 'center'
    },
    addMoreButton: {
        textAlign: 'center',
        margin: 10,
        backgroundColor: 'white',
        width: deviceWidth * 0.4,
        color: '#00C569',
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
    }
});

export default ProductMoreDetails;