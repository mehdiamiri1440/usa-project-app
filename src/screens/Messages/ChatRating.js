import React, { useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, LayoutAnimation, UIManager, Platform } from 'react-native';
import { connect } from 'react-redux';

import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';

import * as CommentsAndRatingsActions from '../../redux/commentsAndRatings/actions';
import { deviceWidth, deviceHeight } from '../../utils';


if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ChatRating = props => {

    const {
        firstName,
        lastName,
        userId,

        rateSubmissionLoading,
    } = props;

    const [isRatingDone, setIsRatingDone] = useState(false);

    const doRating = type => {

        let ratingObject = {
            user_id: userId
        };

        switch (type) {
            case 'good': {
                ratingObject.rating_score = 5;
                break;
            };

            case 'bad': {
                ratingObject.rating_score = 1;
                break;
            };

            default:
                ratingObject.rating_score = 1;
                break;
        };

        props.submitRating(ratingObject).then(_ => {

            setIsRatingDone(true);

            setTimeout(() => {
                setIsRatingDone(false);
                props.closeRatingCard();
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            }, 3000);

        });

    };

    if (!isRatingDone)
        return (
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
                    {`${locales('labels.from')} ${firstName} ${lastName}`}
                </Text>

                {!rateSubmissionLoading ?
                    <View
                        style={{
                            marginTop: 10,
                            flexDirection: 'row-reverse',
                            alignItems: 'center',
                            justifyContent: 'space-around',
                            width: '100%'
                        }}
                    >

                        <TouchableOpacity
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
                        </TouchableOpacity>

                        <TouchableOpacity
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
                        </TouchableOpacity>

                    </View>
                    :
                    <View
                        style={{
                            height: deviceHeight * 0.147,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <ActivityIndicator
                            size={30}
                            color='#00C569'
                        />
                        <Text
                            style={{
                                fontSize: 16,
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                color: '#00C569'
                            }}
                        >
                            {locales('labels.pleaseWait')}
                        </Text>
                    </View>
                }
            </View>
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