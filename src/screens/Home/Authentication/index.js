import React, { useState, useRef } from 'react';
import { Text, View, ScrollView } from 'react-native';

import { connect } from 'react-redux';

import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';

import * as authActions from '../../../redux/auth/actions';
import { deviceWidth } from '../../../utils';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';
import AuthenticatedSuccessfully from './AuthenticatedSuccessfully';
import Header from '../../../components/header';


const Authentication = props => {

    const scrollViewRef = useRef(null);

    let stepsArray = [
        {
            number: 1,
            title: locales('titles.idCardTitle')
        },
        {
            number: 2,
            title: locales('titles.yourPhoto')
        },
        // {
        //     number: 3,
        //     title: locales('titles.relatedEvidences')
        // },
    ];

    const {
        navigation,
        userProfile = {}
    } = props;

    const {
        user_info = {}
    } = userProfile;

    const {
        is_verified
    } = user_info

    let [evidence, setEvidence] = useState({});

    let [idCard, setIdCard] = useState({});

    let [idCardWithOwner, setIdCardWithOwner] = useState({});


    let [stepNumber, setStepNumber] = useState(1);


    const changeStep = step => {
        setStepNumber(step);
    };

    const handleIdCardChange = card => {
        setIdCard(card);
        changeStep(2);
    };

    const handleIdCardWithOwnerChange = cardWithOwner => {
        setIdCardWithOwner(cardWithOwner);
        let data = new FormData();
        data.append("images_count", 2);
        data.append("image_" + 0, idCard);
        data.append("image_" + 1, cardWithOwner);

        return props.setEvidences(data).then(_ => changeStep(4));
    };

    const handleEvidenceChange = uploadedEvidence => {

        setEvidence(uploadedEvidence);

        // let data = new FormData();
        // data.append("images_count", 3);
        // data.append("image_" + 0, idCard);
        // data.append("image_" + 1, idCardWithOwner);
        // data.append("image_" + 2, uploadedEvidence);

        // return props.setEvidences(data).then(_ => changeStep(4));
    };

    const renderSteps = _ => {

        switch (stepNumber) {
            case 1:
                return <StepOne
                    idCard={idCard}
                    handleIdCardChange={handleIdCardChange}
                    changeStep={changeStep}
                    {...props}
                />;

            case 2:
                return <StepTwo
                    idCardWithOwner={idCardWithOwner}
                    handleIdCardWithOwnerChange={handleIdCardWithOwnerChange}
                    changeStep={changeStep}
                    {...props}
                />;

            case 3:
                return <StepThree
                    changeStep={changeStep}
                    handleEvidenceChange={handleEvidenceChange}
                    evidence={evidence}
                    {...props}
                />;

            case 4:
                return <AuthenticatedSuccessfully
                    changeStep={changeStep}
                    parentRef={scrollViewRef}
                    {...props}
                />;

            default:
                break;
        };

    };

    const renderColor = (number, type) => {
        if (stepNumber == number)
            return type == 'bg' ? 'white' : '#00C569';
        else if (stepNumber < number)
            return type == 'bg' ? '#979797' : 'white';
        else
            return type == 'bg' ? '#00C569' : 'white';
    };

    return (
        <View
            style={{
                backgroundColor: 'white',
                flex: 1
            }}
        >

            <Header
                title={locales('labels.authentication')}
                {...props}
            />

            {is_verified ?
                <View
                    style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <View
                        style={{ marginTop: 3, alignItems: 'center', justifyContent: 'center' }}>
                        <FontAwesome5 name='certificate' color='#1DA1F2' size={95} />
                        <FontAwesome5 color='white' name='check' size={60} style={{ position: 'absolute' }} />
                    </View>
                    <Text
                        style={{
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            fontSize: 20,
                            color: '#777777', textAlign: 'center'
                        }}
                    >
                        {locales('titles.authenticationVerified')}
                    </Text>
                </View>
                :
                <ScrollView
                    ref={scrollViewRef}
                >
                    {stepNumber < 4 ?
                        <View style={{
                            flexDirection: 'row-reverse',
                            marginVertical: 25,
                            justifyContent: 'space-between',
                            alignContent: 'center', alignSelf: 'center',
                            width: deviceWidth - 40,

                        }}>
                            {stepsArray.map((item, index) => {
                                return (
                                    <View key={index}
                                        style={{
                                            flex: 1,
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Text
                                            style={{
                                                textAlign: 'center',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                alignSelf: 'center',
                                                alignContent: 'center',
                                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                                textAlignVertical: 'center',
                                                color: renderColor(item.number, 'c'),
                                                borderColor: renderColor(item.number, 'c'),
                                                borderWidth: 1,
                                                backgroundColor: renderColor(item.number, 'bg'),
                                                width: 20,
                                                height: 20,
                                                borderRadius: 10,
                                                zIndex: 1
                                            }}
                                        >
                                            {item.number}
                                        </Text>
                                        {/* <Text
                                            style={{
                                                color: stepNumber >= item.number ? "#333333" : '#999999',
                                                fontSize: 14,
                                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                            }}
                                        >
                                            {item.title}
                                        </Text> */}
                                        {index < stepsArray.length - 1 && <View
                                            style={{
                                                position: 'absolute',
                                                height: 3,
                                                width: '100%',
                                                top: 8,
                                                right: '50%',
                                                backgroundColor: stepNumber - 1 >= item.number ? "#00C569" : '#979797',
                                            }}>
                                        </View>
                                        }

                                    </View>
                                )
                            }
                            )}
                        </View>
                        : null
                    }
                    {renderSteps()}
                </ScrollView>
            }
        </View>
    )

}


const mapDispatchToProps = (dispatch) => {
    return {
        setEvidences: (evidences) => dispatch(authActions.setEvidences(evidences))
    }
};

const mapStateToProps = ({
    authReducer,
    profileReducer
}) => {

    const {
        setEvidencesLoading,
        setEvidencesObject
    } = authReducer;

    const {
        userProfileLoading,
        userProfile
    } = profileReducer;

    return {
        setEvidencesLoading,
        setEvidencesObject,

        userProfileLoading,
        userProfile
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Authentication);