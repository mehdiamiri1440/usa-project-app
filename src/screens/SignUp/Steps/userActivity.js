import React from 'react'
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native'
import { Radio, Button } from 'native-base'
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
            activityType: '',
            selectedCategoryId: null
        }
    }
    activityZone = React.createRef();

    componentDidMount() {
        this.props.fetchAllActivityZones();
    }

    onSubmit = () => {
        let { selectedCategoryId, activityType } = this.state;
        this.props.setActivityZoneAndType(selectedCategoryId, activityType)
    }

    onActivityZoneSubmit = (value, index) => {
        let { activityZones } = this.props;
        let selectedCategoryId = activityZones[index].id;
        this.setState({ selectedCategoryId })
    };


    render() {
        let { message, failed, loading, error, activityZones } = this.props
        let { selectedCategoryId, activityType } = this.state

        activityZones = activityZones.map(item => ({ ...item, value: item.category_name }));

        return (
            <Spin spinning={loading} >
                <Text style={styles.userText}>
                    {locales('messages.enterUserBasicInfo')}
                </Text>
                <View style={[styles.textInputPadding, {
                    alignItems: 'center', flexDirection: 'row', justifyContent: 'space-around'
                }]}>
                    <TouchableOpacity
                        onPress={() => this.setState({ activityType: 'buyer' })}
                        style={{
                            borderWidth: 1, borderColor: activityType == 'buyer' ? '#00C569' : '#BDC4CC',
                            padding: 20, borderRadius: 5,
                            flexDirection: 'row-reverse',
                            justifyContent: 'space-between',
                            marginHorizontal: 10,
                        }}>
                        <Radio
                            onPress={() => this.setState({ activityType: 'buyer' })}
                            selected={activityType === 'buyer'}
                            color={"#BEBEBE"}
                            style={{ marginHorizontal: 10 }}
                            selectedColor={"#00C569"}
                        />
                        <View style={{ flexDirection: 'row-reverse' }}>
                            <AntDesign
                                name="shoppingcart"
                                style={{
                                    fontSize: 25,
                                    alignSelf: "center",
                                }}
                            />
                            <Text style={{ marginHorizontal: 5, fontSize: 14 }}>{locales('labels.buyer')}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            borderWidth: 1, borderColor: activityType == 'seller' ? '#00C569' : '#BDC4CC',
                            padding: 20, borderRadius: 5, flexDirection: 'row-reverse'
                            , justifyContent: 'space-between'
                        }}
                        onPress={() => this.setState({ activityType: 'seller' })}
                    >
                        <Radio
                            onPress={() => this.setState({ activityType: 'seller' })}
                            selected={activityType === 'seller'}
                            color={"#BEBEBE"}
                            style={{ marginHorizontal: 10 }}
                            selectedColor={"#00C569"}
                        />
                        <View style={{ flexDirection: 'row-reverse' }}>
                            <MaterialCommunityIcons
                                name="account-tie"
                                style={{
                                    fontSize: 25,
                                    alignSelf: "center",
                                }}
                            />
                            <Text style={{ marginHorizontal: 5, fontSize: 14 }}>{locales('labels.seller')}</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.textInputPadding}>
                    <Dropdown
                        onChangeText={(value, index) => this.onActivityZoneSubmit(value, index)}
                        label={locales('labels.selectActivityZone')}
                        data={activityZones}
                        containerStyle={{
                            paddingHorizontal: 20
                        }}
                    />
                </View>
                <Button
                    onPress={() => this.onSubmit()}
                    style={!selectedCategoryId || !activityType.length ? styles.disableLoginButton : styles.loginButton}
                    rounded
                    disabled={!selectedCategoryId || !activityType.length}
                >
                    <Text style={styles.buttonText}>{locales('titles.submitSignUp')}</Text>
                </Button>
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