import React from 'react';
import { Text, View, StyleSheet, BackHandler, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux';
import * as authActions from '../../redux/auth/actions';
import { ScrollView } from 'react-native-gesture-handler';
import { deviceWidth, deviceHeight } from '../../utils';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import SelectCategory from './Steps/SelectCategory';
import StockAndPrice from './Steps/StockAndPrice'

let stepsArray = [1, 2, 3, 4, 5, 6]
class RegisterProduct extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            successfullAlert: false,
            stepNumber: 2,
            productType: '',
            category: '',
            subCategory: ''
        }
    }


    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', () => {
            if (this.state.stepNumber > 1) {
                this.setState({ stepNumber: this.state.stepNumber - 1 })
                return true;
            }
        })
    }


    componentWillUnmount() {
        this.setState({ successfullAlert: false })
        BackHandler.removeEventListener();
    }

    changeStep = stepNumber => {
        this.setState({ stepNumber })
    };



    setProductType = (productType, category, subCategory) => {
        this.setState({ productType, category, subCategory, stepNumber: 2 });
    };

    renderSteps = () => {
        let { stepNumber } = this.state
        switch (stepNumber) {
            case 1: {
                return <SelectCategory
                    setProductType={this.setProductType}
                    changeStep={this.changeStep} {...this.props}
                    setMobileNumber={this.setMobileNumber}
                />
            }
            case 2: {
                return <StockAndPrice changeStep={this.changeStep} mobileNumber={this.state.mobileNumber} {...this.props} />
            }
            // case 3: {
            //     return <UserBasicInfo {...this.props} setFullNameAndGender={this.setFullNameAndGender} />
            // }
            // case 4: {
            //     return <ChooseCity {...this.props} setCityAndProvice={this.setCityAndProvice} />
            // }
            // case 5: {
            //     return <UserAuthority setUserAuthorities={this.setUserAuthorities} {...this.props} />
            // }
            // case 6: {
            //     return <UserActivity setActivityZoneAndType={this.setActivityZoneAndType} setUserAuthorities={this.setUserAuthorities} {...this.props} />
            // }
            default:
                break;
        }

    };

    render() {

        let { stepNumber, successfullAlert } = this.state;

        return (
            <View style={{ flex: 1 }}>


                <View style={{
                    backgroundColor: 'white',
                    flexDirection: 'row-reverse',
                    alignContent: 'center',
                    alignItems: 'center',
                    height: 57,
                    shadowOffset: { width: 20, height: 20 },
                    shadowColor: 'black',
                    shadowOpacity: 1.0,
                    elevation: 5,
                    justifyContent: 'center'
                }}>
                    {stepNumber > 1 && <TouchableOpacity
                        style={{ width: deviceWidth * 0.4, justifyContent: 'center', alignItems: 'flex-end', paddingHorizontal: 10 }}
                        onPress={() => this.setState({ stepNumber: this.state.stepNumber - 1 })}
                    >
                        <AntDesign name='arrowright' size={25} />
                    </TouchableOpacity>
                    }
                    <View style={{
                        width: stepNumber > 1 ? deviceWidth * 0.6 : deviceWidth,
                        alignItems: stepNumber > 1 ? 'flex-end' : 'center'
                    }}>
                        <Text
                            style={{ fontSize: 18 }}
                        >
                            {locales('labels.registerProduct')}
                        </Text>
                    </View>
                </View>






                <ScrollView>


                    <View style={{
                        width: deviceWidth, paddingVertical: 10,
                        flexDirection: 'row-reverse', alignContent: 'center', justifyContent: 'center',
                    }}>
                        <View style={{
                            flexDirection: 'row-reverse',
                            marginVertical: 10,
                            alignItems: 'stretch',
                            alignContent: 'center', alignSelf: 'center',
                            width: deviceWidth - 80,

                        }}>
                            {stepsArray.map((item, index) => {
                                return (
                                    <>
                                        <Text
                                            style={{
                                                textAlign: 'center', color: 'white', alignItems: 'center', justifyContent: 'center',
                                                alignSelf: 'center', alignContent: 'center',
                                                shadowOffset: { width: 20, height: 20 },
                                                shadowColor: 'black',
                                                shadowOpacity: 1.0,
                                                elevation: 10,
                                                textAlignVertical: 'center', borderColor: '#FFFFFF',
                                                backgroundColor: stepNumber >= item ? "#00C569" : '#BEBEBE',
                                                width: 30, height: 30, borderRadius: 15

                                            }}
                                        >
                                            {item}
                                        </Text>
                                        {index < stepsArray.length - 1 && <View
                                            style={{
                                                height: 8,
                                                flex: 1,
                                                alignSelf: 'center',
                                                backgroundColor: stepNumber - 1 >= item ? "#00C569" : '#BEBEBE',
                                            }}>
                                        </View>
                                        }
                                    </>
                                )
                            }
                            )}
                        </View>
                    </View>





                    <View style={styles.stepsContainer}>
                        {successfullAlert && <View style={styles.loginFailedContainer}>
                            <Text
                                style={styles.loginFailedText}
                            >
                                {locales('titles.signUpDoneSuccessfully')}
                            </Text>
                        </View >
                        }
                        {this.renderSteps()}
                    </View>



                </ScrollView>

            </View >
        )
    }
}
const styles = StyleSheet.create({
    stepsContainer: {
        marginVertical: 30,
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
})

const mapStateToProps = (state) => {
    return {
    }
};

const mapDispatchToProps = (dispatch) => {
    return {

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterProduct)