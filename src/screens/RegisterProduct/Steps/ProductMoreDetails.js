// import react-native element
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Item, Input, Label } from 'native-base';
import { View, Text, StyleSheet, ActivityIndicator, BackHandler } from "react-native";
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { deviceWidth, deviceHeight } from '../../../utils/deviceDimenssions';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import RNPickerSelect from 'react-native-picker-select';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
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
            deletedIndexes: [],
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
            isDescriptionFocused: false,
            deletedRows: []
        }
    }
    pickerRef = React.createRef();

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', _ => {
            this.props.changeStep(5)
            return true;
        })
    }

    componentWillUnmount() {
        BackHandler.removeEventListener();
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
            }, () => this.props.setDetailsArray([...(this.state.detailsArray)], [...tempDefaults], this.state.defaultFieldsOptions))
        }
    };


    deleteRow = index => {
        let selectedIndex = this.state.defaultFieldsOptions.findIndex(item => item.name == this.state.detailsArray[index].itemKey);
        if (selectedIndex > -1) {
            this.setState(state => {
                state.deletedRows.push(index);
                state.detailsArray[index].itemKey = '';
                state.detailsArray[index].itemValue = '';
                state.detailsArray[index].error = '';
                if (selectedIndex > -1) {
                    state.defaultFieldsOptions[selectedIndex].alreadySelected = false;
                    state.defaultFieldsOptions[selectedIndex].selectedIndex = null;
                }
                return '';
            });
        }
    }

    setItemKey = (value, dropIndex, index) => {
        const selectedIndex = this.state.defaultFieldsOptions.findIndex(item => item.name == value);
        if (this.state.detailsArray[index].itemKey.length) {
            this.setState(state => {
                const deletedIndex = state.defaultFieldsOptions.findIndex(item => item.name == state.detailsArray[index].itemKey);
                let inDeleteds = state.deletedIndexes.indexOf(deletedIndex);
                state.deletedIndexes.splice(inDeleteds, 1);
                return '';
            })
        }
        this.setState(state => {
            console.log('state', state.defaultFieldsOptions, 'index', selectedIndex)
            this.state.detailsArray[index].itemKey = value;
            state.deletedIndexes.push(selectedIndex);
            if (selectedIndex > -1) {
                state.defaultFieldsOptions[selectedIndex].alreadySelected = true;
                state.defaultFieldsOptions[selectedIndex].selectedIndex = selectedIndex;
            }
            state.defaultFieldsOptions.forEach(item => {
                if (item.selectedIndex && state.deletedIndexes.indexOf(item.selectedIndex) < 0) {
                    item.alreadySelected = false;
                    item.selectedIndex = null;
                }
            })
            return '';
        })

    };


    onDescriptionSubmit = (index, value) => {
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

        return (
            <>
                <ScrollView>

                    <View
                        style={[{ backgroundColor: 'white' }, styles.labelInputPadding]}>
                        <Text
                            style={{
                                marginBottom: 10,
                                color: '#666666',
                                fontSize: 20,
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                paddingHorizontal: 10
                            }}
                        >
                            {locales('labels.addMoreDetails')}
                        </Text>
                        <View style={{ flexDirection: 'row-reverse', width: deviceWidth, alignItems: 'center', justifyContent: 'center' }}>

                            <View style={{ flexDirection: 'row-reverse', width: deviceWidth * 0.45, alignItems: 'center', justifyContent: 'center' }}>
                                <Text
                                    style={{
                                        color: '#E41C38',
                                        fontSize: 14,
                                    }}
                                >
                                    {locales('labels.example')} :
                            </Text>
                                <Text
                                    style={{
                                        color: '#666666',
                                        fontSize: 14,
                                    }}
                                >
                                    {locales('labels.boxing')}
                                </Text>
                            </View>

                            <View style={{ flexDirection: 'row-reverse', width: deviceWidth * 0.6, alignItems: 'center', justifyContent: 'center' }}>
                                <Text
                                    style={{
                                        color: '#E41C38',
                                        fontSize: 14,
                                    }}
                                >
                                    {locales('labels.example')} :
                            </Text>
                                <Text
                                    style={{
                                        color: '#666666',
                                        fontSize: 14,
                                    }}
                                >
                                    {locales('labels.8kMotherBox')}
                                </Text>
                            </View>


                        </View>
                        {detailsArray.map((detail, index) => (
                            <>
                                {(this.state.deletedRows.indexOf(index) < 0 || !this.state.deletedRows.length) && <View
                                    key={detail.keyId}
                                    style={{
                                        flexDirection: 'row-reverse',
                                        paddingBottom: 0,
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginVertical: 7
                                    }}>
                                    <TouchableOpacity
                                        onPress={() => this.deleteRow(index)}
                                        style={{
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            height: 45,
                                            width: 30
                                        }}>
                                        <FontAwesome5 name='trash' color='#E41C38' size={20} />
                                    </TouchableOpacity>

                                    <View style={{
                                        flex: 1,
                                        flexDirection: 'row-reverse',
                                        justifyContent: 'space-between',
                                    }}>
                                        <View >
                                            <Item regular
                                                style={{
                                                    height: 45,
                                                    marginVertical: 10,
                                                    backgroundColor: '#fff',
                                                    overflow: "hidden",
                                                    alignSelf: 'center',
                                                    borderColor: detail.error && !detail.error.length ? '#00C569' : detail.error && detail.error.length ? '#D50000' : '#a8a8a8',
                                                    borderRadius: 5,
                                                    marginLeft: 5,

                                                }}
                                            >
                                                <RNPickerSelect
                                                    Icon={() => <FontAwesome5 name='angle-down' size={25} color='gray' />}
                                                    useNativeAndroidPickerStyle={false}
                                                    onValueChange={(value, dropIndex) => this.setItemKey(value, dropIndex, index)}
                                                    style={styles}
                                                    ref={this.pickerRef}
                                                    placeholder={{
                                                        label: locales('titles.selectOne'),
                                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                                        value: detail.itemKey
                                                    }}
                                                    items={defaultFieldsOptions.filter(item => !item.alreadySelected).map(item => ({
                                                        label: item.name, value: item.name
                                                    }))}
                                                />
                                            </Item>
                                        </View>
                                        {/* <Dropdown
                                error={detail.error}
                                onChangeText={(value, dropDownIndex) => this.setItemKey(value, dropDownIndex, index)}
                                label={locales('titles.selectOne')}
                                data={defaultFieldsOptions}
                                containerStyle={{
                                    fontSize: 18,
                                    paddingHorizontal: 20,
                                    width: 195
                                }}
                            /> */}
                                        <View style={{
                                            flex: 1,
                                            marginVertical: 10,
                                        }}>
                                            <Item error={detail.error} regular style={{
                                                height: 45,
                                                backgroundColor: '#fff',
                                                overflow: "hidden",
                                                borderColor: description.length ? '#00C569' : '#a8a8a8',
                                                borderRadius: 5,
                                                padding: 3
                                            }}>
                                                <Input
                                                    disabled={!detail.itemKey}
                                                    autoCapitalize='none'
                                                    autoCorrect={false}
                                                    autoCompleteType='off'
                                                    style={{
                                                        fontFamily: 'IRANSansWeb(FaNum)_Medium', textDecorationLine: 'none', fontSize: 14,
                                                        direction: 'rtl',
                                                        textAlign: 'right'
                                                    }}
                                                    onChangeText={(a, b, c) => this.onDescriptionSubmit(index, a, b, c)}
                                                    placeholderTextColor="#bebebe"
                                                    placeholder={locales('titles.writeDescription')}


                                                />
                                            </Item>
                                        </View>
                                    </View>
                                    {/* <TextField
                                baseColor={description.length ? '#00C569' : '#a8a8a8'}
                                onChangeText={(a, b, c) => this.onDescriptionSubmit(index, a, b, c)}
                                error={detail.error}
                                disabled={!detail.itemKey}
                                containerStyle={{ width: 170 }}
                                fontSize={18}
                                isRtl={true}
                                labelTextStyle={{ padding: 5 }}
                                label={locales('titles.writeDescription')}
                            /> */}
                                </View>}
                                {!!detail.error && detail.error.length && <Label style={{ fontSize: 14, color: '#D81A1A', width: deviceWidth * 0.9 }}>{detail.error}</Label>}
                            </>
                        )
                        )}



                        <View style={{
                            marginVertical: 0, flexDirection: 'row',
                            width: deviceWidth, justifyContent: 'space-between',

                        }}>
                            <Button
                                onPress={() => this.addMoreRow()}
                                style={[styles.addMoreButton, {
                                    borderWidth: 1,
                                    borderColor: '#00C569'
                                }]}
                                rounded
                            >
                                <Text style={styles.addMoreButtonText}>{locales('labels.addMore')}</Text>
                                <AntDesign name='plus' size={25} color='#00C569' />
                            </Button>
                        </View>
                        <View style={{ marginVertical: 20, flexDirection: 'row', justifyContent: 'space-between' }}>

                            <Button
                                onPress={() => this.onSubmit()}
                                style={[styles.loginButton]}
                                rounded
                            >
                                <ActivityIndicator size="small" color="white"
                                    animating={!!this.props.addNewProductLoading}
                                    style={{
                                        width: 30,
                                        height: 30,
                                        borderRadius: 15,
                                        fontSize: 20,
                                        marginLeft: -30
                                    }}
                                />
                                <Text style={styles.buttonText}>{locales('titles.finalSubmit')}</Text>

                            </Button>
                            <Button
                                onPress={() => this.props.changeStep(5)}
                                style={[styles.backButtonContainer]}
                                rounded
                            >
                                <Text style={styles.backButtonText}>{locales('titles.previousStep')}</Text>
                                <FontAwesome5 name='arrow-right' style={{ marginLeft: 10 }} size={14} color='#7E7E7E' />
                            </Button>
                        </View>

                    </View>
                </ScrollView>
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
        width: '60%',
        textAlign: 'center',
        fontFamily: 'IRANSansWeb(FaNum)_Bold'
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
        borderWidth: 1,
        borderColor: '#BDC4CC',
        backgroundColor: 'white',
        alignItems: 'center',
        borderRadius: 5,
        justifyContent: 'center',
        width: deviceWidth * 0.4,
        elevation: 0,
        margin: 10,
    },
    disableLoginButton: {
        textAlign: 'center',
        margin: 10,
        color: 'white',
        alignItems: 'center',
        backgroundColor: '#B5B5B5',
        borderRadius: 5,
        alignSelf: 'flex-start',
        justifyContent: 'center'
    },
    loginButton: {
        textAlign: 'center',
        margin: 10,
        width: deviceWidth * 0.4,
        backgroundColor: '#00C569',
        borderRadius: 5,
        color: 'white',
        alignItems: 'center',
        alignSelf: 'flex-start',
        justifyContent: 'center'
    },
    addMoreButton: {
        textAlign: 'center',
        margin: 10,
        backgroundColor: 'white',
        borderRadius: 5,
        width: deviceWidth * 0.45,
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
        // paddingVertical: 8,
        color: 'black',
        height: 50,
        width: deviceWidth * 0.45,
    },
    iconContainer: {
        left: 10,
        top: 13,
    },

    labelInputPadding: {
        paddingVertical: 5,
        paddingHorizontal: 5
    }
});


const mapStateToProps = (state) => {
    return {
        addNewProductMessage: state.registerProductReducer.addNewProductMessage,
        addNewProductLoading: state.registerProductReducer.addNewProductLoading,
    }
}
export default connect(mapStateToProps)(ProductMoreDetails);