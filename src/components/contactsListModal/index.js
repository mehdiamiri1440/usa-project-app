import React, {
    useEffect,
    useRef,
    useState
} from 'react';
import {
    Text,
    View,
    Linking,
    Pressable
} from 'react-native';
import { Button } from 'native-base';
import { connect } from 'react-redux';
import RBSheet from "react-native-raw-bottom-sheet";
import { REACT_APP_API_ENDPOINT_RELEASE } from '@env';
import BgLinearGradient from 'react-native-linear-gradient';

import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';

import { shareToSocial } from '../shareToSocial';
import { InstagramStoryPreview } from '../../screens/UserContacts';

const ContactsListModal = props => {

    let {
        visible,
        onRequestClose = _ => { },
        onReject = _ => { },
        navigation = {},
        productInfo = {},
        shouldShowInstagramButton,
        image,
        userProfile = {}
    } = props;

    const {
        city_name,
        min_sale_amount,
        product_name,
        stock,
        sub_category_name,
        user_name
    } = productInfo;

    const {
        profile = {}
    } = userProfile;

    const {
        profile_photo
    } = profile;

    const {
        navigate = _ => { }
    } = navigation;

    const refRBSheet = useRef();

    const [showImagePreview, setShowImagePreview] = useState(false);

    useEffect(() => {
        if (visible)
            refRBSheet.current.open();
        else
            refRBSheet.current.close();
    }, [visible]);

    const shareLink = app => {

        let {
            title,
            sharingUrlPostFix = '',
            bodyText = '',
        } = props;

        let url = '';

        sharingUrlPostFix = `${REACT_APP_API_ENDPOINT_RELEASE}${sharingUrlPostFix}`;

        sharingUrlPostFix = sharingUrlPostFix.replace(/ /g, '');

        if (bodyText)
            sharingUrlPostFix = `${bodyText}\n\n${sharingUrlPostFix}`;

        switch (app) {
            case 'whatsApp':
            case 'telegram':
                if (!image) {
                    image = profile_photo && profile_photo.length ?
                        `${REACT_APP_API_ENDPOINT_RELEASE}/storage/${profile_photo}`
                        : 'https://www.buskool.com/images/512-buskool-logo.jpg?eac56955a30a44cc7dad1d6971926bf9';
                }
                return shareToSocial(app, image, sharingUrlPostFix, undefined, title);

            case 'instagramStory':
                return setShowImagePreview(true);

            default:
                break;
        };
        Linking.canOpenURL(url).then((supported) => {
            if (!!supported) {
                Linking.openURL(url)
            } else {
                Linking.openURL(url)
            }
        })
            .catch(() => {
                Linking.openURL(url)
            })
    };


    const navigateToUserContacts = _ => {
        onRequestClose();
        navigate('MyBuskool', {
            screen: 'UserContacts', params: {
                sharingUrlPostFix,
                image,
                title,
                bodyText,
                shouldShowInstagramButton,
                productInfo
            }
        });
    };

    return (
        <RBSheet
            ref={refRBSheet}
            closeOnDragDown
            closeOnPressMask
            height={200}
            onClose={props.onRequestClose}
            animationType='fade'
            customStyles={{
                draggableIcon: {
                    backgroundColor: "#E0E0E0"
                },
                container: {
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                    backgroundColor: '#FAFAFA',
                    justifyContent: 'space-around'
                }
            }}
        >
            {showImagePreview ?
                <InstagramStoryPreview
                    visible={showImagePreview}
                    onRequestClose={_ => setShowImagePreview(false)}
                    image={image}
                    sub_category_name={sub_category_name}
                    product_name={product_name}
                    user_name={user_name}
                    min_sale_amount={min_sale_amount}
                    stock={stock}
                    city_name={city_name}
                />
                : null
            }

            {shouldShowInstagramButton ?
                <Pressable
                    onPress={_ => shareLink('instagramStory')}
                    android_ripple={{
                        color: '#ededed'
                    }}
                    style={{
                        flexDirection: 'row-reverse',
                        justifyContent: 'flex-start',
                        marginLeft: '20%',
                        alignItems: 'center',
                        alignSelf: 'center',
                        width: '45%'
                    }}
                >
                    <FontAwesome5
                        name='instagram-square'
                        solid
                        size={20}
                        color='#cd486b'
                    />
                    <Text
                        style={{
                            marginHorizontal: 7,
                            fontSize: 18,
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            color: '#333',
                        }}
                    >
                        {locales('titles.instagramStory')}
                    </Text>
                </Pressable>
                : null
            }


            <Pressable
                onPress={_ => shareLink('whatsApp')}
                android_ripple={{
                    color: '#ededed'
                }}
                style={{
                    flexDirection: 'row-reverse',
                    justifyContent: 'flex-start',
                    marginLeft: '20%',
                    alignItems: 'center',
                    alignSelf: 'center',
                    width: '45%'
                }}
            >
                <FontAwesome5
                    name='whatsapp-square'
                    solid
                    size={20}
                    color='#25D366'
                />
                <Text
                    style={{
                        marginHorizontal: 7,
                        fontSize: 18,
                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                        color: '#333',
                    }}
                >
                    {locales('titles.whatsApp')}
                </Text>
            </Pressable>

            <Pressable
                onPress={_ => shareLink('telegram')}
                android_ripple={{
                    color: '#ededed'
                }}
                style={{
                    flexDirection: 'row-reverse',
                    marginLeft: '20%',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    alignSelf: 'center',
                    width: '45%',
                }}
            >
                <FontAwesome5
                    name='telegram'
                    solid
                    size={20}
                    color='#0088cc'
                />
                <Text
                    style={{
                        marginHorizontal: 7,
                        fontSize: 18,
                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                        color: '#333',
                    }}
                >
                    {locales('titles.telegram')}
                </Text>
            </Pressable>

            {/* <View
                style={{
                    alignItems: 'center',
                    alignSelf: 'center',
                    paddingVertical: 15,
                    width: '80%'
                }}>
                <BgLinearGradient
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0.8, y: 0.2 }}
                    colors={['#00C569', '#00C569']}
                    style={{
                        borderRadius: 12,
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: 60,
                        alignSelf: 'center',
                        marginTop: 10,
                        position: 'absolute',
                        zIndex: 1
                    }}
                >
                    <Button
                        style={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'transparent',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        onPress={navigateToUserContacts}
                    >

                        <View
                            style={{
                                flexDirection: 'row-reverse',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <FontAwesome5
                                name='users'
                                color='white'
                                size={20}
                                style={{

                                }}
                            />
                            <Text
                                style={{
                                    fontSize: 18,
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                    flexDirection: 'row',
                                    color: 'white',
                                    marginRight: 5
                                }}>
                                {locales('titles.chooseFromContacts')}
                            </Text>
                        </View>
                    </Button>
                </BgLinearGradient>
                <View style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: '#0D9355',
                    height: 60,
                    borderRadius: 12,
                }}>
                </View>
            </View>

            <Pressable
                onPress={onReject}
                style={{
                    flexDirection: 'row-reverse',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 10
                }}
            >
                <FontAwesome5
                    name='link'
                    color='#313A43'
                    size={15}
                />
                <Text
                    style={{
                        fontSize: 15,
                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                        color: '#313A43',
                        textAlign: 'center',
                        marginHorizontal: 5
                    }}
                >
                    {locales('labels.copyLink')}
                </Text>
            </Pressable> */}
        </RBSheet >
    )
};

const mapStateToProps = ({
    profileReducer
}) => {

    const {
        userProfile
    } = profileReducer;

    return {
        userProfile
    }
};

export default connect(mapStateToProps)(ContactsListModal);