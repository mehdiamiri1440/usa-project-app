import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    Pressable,
    LayoutAnimation,
    UIManager,
    Platform,
    ScrollView
} from 'react-native';
import { Button, Textarea, InputGroup, Label } from 'native-base';
import { connect } from 'react-redux';
import RBSheet from "react-native-raw-bottom-sheet";

import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';

import * as CommentsAndRatingsActions from '../../redux/commentsAndRatings/actions';
import { deviceWidth, deviceHeight, validator } from '../../utils';

if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ChatRating = props => {

    const refRBSheet = useRef();
    const descriptionRef = useRef();

    const {
        firstName,
        lastName,
        userId,

        rateSubmissionLoading,
    } = props;

    const [isRatingDone, setIsRatingDone] = useState(false);

    const [ratingType, setRatingType] = useState('');

    const [ratingScore, setRatingScore] = useState(null);

    const [description, setDescription] = useState('');

    const [descriptionError, setDescriptionError] = useState('');

    const [descriptionClicked, setDescriptionClicked] = useState(false);

    const [buttonType, setButtonType] = useState(null);

    const doRating = type => {

        setRatingType(type);
        switch (type) {
            case 'good': {
                setRatingScore(5);
                break;
            };

            case 'bad': {
                setRatingScore(1);
                break;
            };

            default:
                setRatingScore(1);
                break;
        };

        refRBSheet?.current?.open();
    };

    const onDescriptionSubmit = field => {
        setDescription(field);
        setDescriptionClicked(!!field);
        setDescriptionError(!field || validator.isValidDescription(field) ? '' : locales('errors.invalidDescription'));
    };

    const submitRating = type => {

        let ratingObject = {
            user_id: userId,
            rating_score: ratingScore
        };

        setButtonType(type);

        if (description && description.length && !descriptionError && type == 0)
            ratingObject.text = description;

        if (!descriptionError || type == 1) {
            if (ratingObject.text) {
                setDescriptionError(null);
            }
            setDescriptionClicked(false);
            props.submitRating(ratingObject).then(_ => {
                refRBSheet?.current?.close();
                setIsRatingDone(true);

                setTimeout(() => {
                    setIsRatingDone(false);
                    props.closeRatingCard();
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                }, 3000);

            });
        }
    };

    if (!isRatingDone)
        return (
            <>
                <RBSheet
                    ref={refRBSheet}
                    closeOnDragDown
                    closeOnPressMask
                    // onClose={_ => closeContactInfoSlider()}
                    height={350}
                    animationType='slide'
                    customStyles={{
                        draggableIcon: {
                            backgroundColor: "#000"
                        },
                        container: {
                            borderTopLeftRadius: 12,
                            borderTopRightRadius: 12,
                            backgroundColor: '#FAFAFA'
                        }
                    }}
                >
                    <ScrollView
                        keyboardDismissMode='on-drag'
                        keyboardShouldPersistTaps='handled'
                    >
                        <Text
                            onPress={_ => refRBSheet?.current?.close()}
                            style={{ width: '100%', textAlign: 'right', paddingHorizontal: 20 }}>
                            <FontAwesome5 name='times' size={20} color='#777777' />
                        </Text>


                        <View style={{ padding: 20, width: '100%', marginTop: 20 }}>
                            <Label
                                style={{
                                    color: '#777777', fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                    fontSize: 15, marginVertical: 5
                                }}
                            >
                                {ratingType == 'good' ?
                                    locales('titles.reasonOfSatisfy') :
                                    locales('titles.reasonOfNotSatisfy')
                                }
                                <Text
                                    style={{
                                        fontSize: 17,
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                        color: '#00C886',
                                        fontWeight: '200'
                                    }}
                                >
                                    {` ${firstName} ${lastName} `}
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 15,
                                        fontWeight: '200',
                                        color: '#777777', fontFamily: 'IRANSansWeb(FaNum)_Bold',

                                    }}
                                >
                                    {locales('titles.secondWriteHere')}
                                </Text>
                            </Label>
                            <InputGroup
                                regular
                                style={{
                                    borderRadius: 4,
                                    borderColor: description ? descriptionError ? '#E41C38' : '#00C569' :
                                        descriptionClicked ? '#E41C38' : '#666',
                                    paddingLeft: 15,
                                    paddingHorizontal: 10,
                                    backgroundColor: '#FBFBFB'
                                }}>
                                <FontAwesome5 name={
                                    description ? descriptionError ? 'times-circle' : 'check-circle' : descriptionClicked
                                        ? 'times-circle' : 'edit'}
                                    color={description ? descriptionError ? '#E41C38' : '#00C569'
                                        : descriptionClicked ? '#E41C38' : '#BDC4CC'}
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
                                    placeholderTextColor='#777777'
                                    placeholder={locales('titles.commentDescriptionWithExample')}
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
                            <Label style={{
                                fontFamily: 'IRANSansWeb(FaNum)_Light',
                                height: 20, fontSize: 14, color: '#D81A1A'
                            }}>
                                {!!descriptionError && descriptionError}
                            </Label>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row-reverse',
                                marginBottom: 30,
                                justifyContent: 'space-around',
                                width: '100%'
                            }}
                        >
                            <Button
                                onPress={_ => submitRating(0)}
                                style={{
                                    textAlign: 'center',
                                    borderRadius: 5,
                                    elevation: 0,
                                    padding: 25,
                                    marginBottom: 10,
                                    backgroundColor: (descriptionError || !description.length) ? '#B5B5B5' : '#00C886',
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
                                        }}>
                                        {locales('labels.insert')}
                                    </Text>
                                    {
                                        rateSubmissionLoading && buttonType == 0 ?
                                            <ActivityIndicator
                                                size={20}
                                                color='white'
                                                style={{
                                                    position: 'absolute',
                                                    right: -10
                                                }}
                                            />
                                            :
                                            null
                                    }
                                </View>
                            </Button>

                            <Button
                                onPress={_ => submitRating(1)}
                                style={{
                                    textAlign: 'center',
                                    zIndex: 10005,
                                    borderRadius: 5,
                                    elevation: 0,
                                    padding: 25,
                                    marginBottom: 10,
                                    backgroundColor: '#000546',
                                    width: '40%',
                                    color: 'white',
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                    justifyContent: 'center',
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold'
                                }}
                                rounded
                            >
                                <Text
                                    style={{
                                        color: 'white',
                                        textAlign: 'center',
                                        fontSize: 20,
                                        marginHorizontal: 3,
                                        marginTop: 2,
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold'
                                    }}
                                >
                                    {locales('titles.haveNoComment')}
                                </Text>
                                {
                                    rateSubmissionLoading && buttonType == 1 ?
                                        <ActivityIndicator
                                            size={20}
                                            color='white'
                                            style={{
                                                position: 'absolute',
                                                right: -20
                                            }}
                                        />
                                        :
                                        null
                                }
                            </Button>
                        </View>
                    </ScrollView>
                </RBSheet>
                <View
                    style={{
                        backgroundColor: '#E8F4F8',
                        padding: 10,
                        marginVertical: 10,
                        width: deviceWidth * 0.95,
                        alignSelf: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 12
                    }}
                >
                    <FontAwesome5
                        onPress={_ => {
                            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                            props.closeRatingCard();
                        }}
                        name='times'
                        color='#777777'
                        size={20}
                        style={{
                            alignSelf: 'flex-end'
                        }}
                    />

                    <Text
                        numberOfLines={1}
                        style={{
                            marginTop: 5,
                            color: '#313A43',
                            fontSize: 18,
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            textAlign: 'center',
                            width: '95%',
                            alignSelf: 'center'
                        }}
                    >
                        {`${locales('labels.connectionBy')} ${firstName} ${lastName}`}
                    </Text>
                    <View
                        style={{
                            marginTop: 10,
                            flexDirection: 'row-reverse',
                            alignItems: 'center',
                            justifyContent: 'space-around',
                            width: '100%'
                        }}
                    >

                        <Pressable
                            android_ripple={{
                                color: '#ededed'
                            }}
                            onPress={_ => doRating('good')}
                            activeOpacity={1}
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <FontAwesome5
                                name='thumbs-up'
                                color='white'
                                size={30}
                                solid
                                style={{
                                    backgroundColor: '#21AD93',
                                    alignSelf: 'center',
                                    borderRadius: 30,
                                    width: 60,
                                    height: 60,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    textAlignVertical: 'center'
                                }}
                            />
                            <Text
                                style={{
                                    marginTop: 5,
                                    color: '#21AD93',
                                    fontSize: 16,
                                    fontFamily: 'IRANSansWeb(FaNum)_Light'
                                }}
                            >
                                {locales('titles.satisfied')}
                            </Text>
                        </Pressable>

                        <Pressable
                            android_ripple={{
                                color: '#ededed'
                            }}
                            onPress={_ => doRating('bad')}
                            activeOpacity={1}
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <FontAwesome5
                                name='thumbs-up'
                                color='white'
                                size={30}
                                solid
                                style={{
                                    transform: [{ rotate: '-180deg' }],
                                    backgroundColor: '#E41C38',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    textAlignVertical: 'center',
                                    alignSelf: 'center',
                                    borderRadius: 30,
                                    width: 60,
                                    height: 60
                                }}
                            />
                            <Text
                                style={{
                                    marginTop: 5,
                                    color: '#E41C38',
                                    fontSize: 16,
                                    fontFamily: 'IRANSansWeb(FaNum)_Light'
                                }}
                            >
                                {locales('titles.notSatisfied')}
                            </Text>
                        </Pressable>

                    </View>
                </View>
            </>
        );

    return (
        <View
            style={{
                backgroundColor: '#ebf8e6',
                padding: 10,
                marginVertical: 10,
                width: deviceWidth * 0.95,
                height: deviceHeight * 0.258,
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 12,
            }}
        >
            <FontAwesome5
                name='check'
                color='#00C569'
                size={55}
                solid
                style={{
                    backgroundColor: 'white',
                    alignSelf: 'center',
                    borderRadius: 40,
                    height: 80,
                    width: 80,
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    textAlignVertical: 'center'
                }}
            />
            <Text
                style={{
                    color: '#222',
                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                    fontSize: 20
                }}
            >
                {locales('titles.thanksForCommenting')}
            </Text>
        </View>
    )
};

const mapStateToProps = ({
    commentsAndRatingsReducer
}) => {

    const {
        rateSubmissionAndRatings,
        rateSubmissionLoading,
        rateSubmissionFailed,
        rateSubmissionError,
        rateSubmissionMessage,
    } = commentsAndRatingsReducer;

    return {
        rateSubmissionAndRatings,
        rateSubmissionLoading,
        rateSubmissionFailed,
        rateSubmissionError,
        rateSubmissionMessage,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        submitRating: (rateObj) => dispatch(CommentsAndRatingsActions.submitRating(rateObj)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatRating);