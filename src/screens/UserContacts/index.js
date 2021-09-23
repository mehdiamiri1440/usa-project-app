import React, {
    useEffect,
    useState,
    useRef
} from 'react';
import {
    View,
    Text,
    FlatList,
    Linking,
    Image,
    Platform,
    ToastAndroid,
    Pressable,
    Share,
    Modal,
    ImageBackground
} from 'react-native';
import ContentLoader, { Rect, Circle } from "react-content-loader/native";
import { REACT_APP_API_ENDPOINT_RELEASE } from '@env';
import Svg, {
    Path
} from "react-native-svg";
import {
    Icon,
    InputGroup,
    Input,
    Button
} from 'native-base';
import ShadowView from '@vikasrg/react-native-simple-shadow-view';
import Clipboard from "@react-native-community/clipboard";
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import Contacts from 'react-native-contacts';
import ViewShot from "react-native-view-shot";

import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';

import Header from '../../components/header';
import { shareToSocial } from '../../components/shareToSocial';
import { permissions, deviceWidth, formatter, deviceHeight } from '../../utils';
import * as profileActions from '../../redux/profile/actions';

let colors = [
    ["#DE7080", "#EA7891"],
    ["#EA9443", "#E9973A"],
    ["#18B0C4", "#21BDCA"],
    ["#7A89DE", "#8465C7"],
    ["#FF883C", "#FFAC68"],
    ["#0398E5", "#21A3DB"],
    ["#00c569", "#21ad93"],
    ["#42BA96", "#2DAB95"],
    ["#D1D43B", "#DCDF35"],
    ["#B8D34A", "#9EC97D"],
    ["#5FC69E", "#61A793"],
],
    randNumbers = [];

const UserContacts = props => {

    const viewShotRef = useRef();

    const {
        route = {}
    } = props;

    const {
        params = {}
    } = route;

    const {
        sharingUrlPostFix,
        bodyText,
        title,
        image,
        productInfo = {},
        shouldShowInstagramButton
    } = params;

    const {
        city_name,
        min_sale_amount,
        product_name,
        stock,
        sub_category_name,
        user_name
    } = productInfo;

    const completeUrlToShare = `${REACT_APP_API_ENDPOINT_RELEASE}${sharingUrlPostFix}`;

    const [uploadContactsLoading, setUploadContactsLoading] = useState(false);

    const [showImagePreview, setShowImagePreview] = useState(false);

    const [userContacts, setUserContacts] = useState([]);

    const [copyOfuserContacts, setCopyOfuserContacts] = useState([]);

    const [searchText, setSearchText] = useState('');

    // const [scrollYPos, setScrollYPos] = useState(10);

    // const [eleHeight, setEleHeight] = useState(0);

    // const translateY = React.useRef(new Animated.Value(0)).current;

    useEffect(_ => {
        getContacts();
    }, []);

    const getContacts = async (isFromRefresh) => {

        setUploadContactsLoading(true);

        const isAllowedToAccessContacts = await permissions.requestContactsPermission();
        if (isAllowedToAccessContacts) {

            Contacts.getAll((_, contacts) => {

                if (!isFromRefresh)
                    randNumbers = [...new Array(contacts.length)].map(item => item = Math.floor(Math.random() * colors.length))

                setUserContacts(contacts);

                setCopyOfuserContacts(contacts);
                const contatcsArrayToSendForServer = contacts.map(
                    (
                        {
                            phoneNumbers = [],
                            displayName = '',
                            hasThumbnail,
                            ...rest
                        }
                    ) => (
                        {
                            ...rest,
                            full_name: displayName,
                            phone: phoneNumbers.length ? formatter.toLatinNumbers(phoneNumbers[0].number) : "",
                            has_thumbnail: hasThumbnail
                        }
                    )
                );
                if (contatcsArrayToSendForServer.length)
                    props.uploadUserContacts(contatcsArrayToSendForServer).then(_ => {

                        setUploadContactsLoading(false);

                    })
                else
                    setUploadContactsLoading(false);

            });

        }
        else
            props.navigation.goBack();
    };

    const showToast = _ => {
        ToastAndroid.showWithGravityAndOffset(
            locales('titles.copiedToClipboard'),
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            5,
            250);
        Clipboard.setString(bodyText ? title ? `*${title}*\n\n${bodyText}\n\n${completeUrlToShare}` : `${bodyText}\n\n${completeUrlToShare}` : completeUrlToShare);
    };

    const handleSearch = text => {


        let tempList = [...copyOfuserContacts];

        if (text && text.length)
            tempList = [...tempList.filter(item => item.displayName && item.displayName.length && item.displayName.toLowerCase().includes(text.toLowerCase()))];
        else
            tempList = [...copyOfuserContacts];

        setSearchText(text);
        setUserContacts(tempList);
    };

    const onSharePressed = async () => {
        const {
            route = {}
        } = props;

        const {
            params = {}
        } = route;

        let {
            sharingUrlPostFix = '',
            bodyText,
            title
        } = params;

        sharingUrlPostFix = `${REACT_APP_API_ENDPOINT_RELEASE}${sharingUrlPostFix}`;

        if (bodyText)
            sharingUrlPostFix = `${bodyText}\n\n${sharingUrlPostFix}`;

        if (title && title.length)
            sharingUrlPostFix = `${title}\n\n${sharingUrlPostFix}`;

        const result = await Share.share({ message: sharingUrlPostFix });
    };

    const shareToExternalApp = async (phone, app) => {
        let url = '';

        const {
            route = {},
            userProfile = {}
        } = props;

        const {
            profile = {}
        } = userProfile;

        const {
            profile_photo
        } = profile;

        const {
            params = {}
        } = route;

        let {
            sharingUrlPostFix = '',
            bodyText,
            image = '',
            title
        } = params;

        sharingUrlPostFix = `${REACT_APP_API_ENDPOINT_RELEASE}${sharingUrlPostFix}`;

        sharingUrlPostFix = sharingUrlPostFix.replace(/ /g, '');

        if (bodyText)
            sharingUrlPostFix = `${bodyText}\n\n${sharingUrlPostFix}`;

        if (phone && phone.length)
            phone = formatter.toLatinNumbers(phone);

        switch (app) {
            case 'whatsApp': {
                if (!phone)
                    url = `whatsapp://send?text=${sharingUrlPostFix}`;
                else {
                    if (phone.startsWith('+98'))
                        phone = phone.replace(phone.substring(0, 3), '+98');

                    else if (phone.startsWith('+9') || phone.startsWith('09'))
                        phone = phone.replace(phone.substring(0, 2), '+989');

                }
                if (!image) {
                    image = profile_photo && profile_photo.length ?
                        `${REACT_APP_API_ENDPOINT_RELEASE}/storage/${profile_photo}`
                        : 'https://www.buskool.com/images/512-buskool-logo.jpg?eac56955a30a44cc7dad1d6971926bf9';
                }

                return shareToSocial('whatsApp', image, sharingUrlPostFix, phone, title);
            }
            case 'sms': {
                if (!phone)
                    url = `sms:?body=${sharingUrlPostFix}`;
                else
                    url = `sms:${phone}${Platform.OS === "ios" ? "&" : "?"}body=${sharingUrlPostFix}`;
                break;
            }
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

    const shareToInstagramStory = _ => {
        setShowImagePreview(true);
    };

    const captureImage = _ => {
        viewShotRef?.current?.capture().then(uri => shareToSocial('instagramStory', uri));
    };

    const renderItem = ({
        item: {
            phoneNumbers = [],
            displayName = '',
            hasThumbnail,
            familyName = '',
            givenName = '',
            thumbnailPath = ''
        } = {},
        index
    }) => {

        if (!phoneNumbers.length)
            return null;

        return (
            <Pressable
                android_ripple={{
                    color: '#ededed',
                }}
                onPress={_ => shareToExternalApp(phoneNumbers && phoneNumbers.length && phoneNumbers[0].number ? phoneNumbers[0].number : undefined, 'whatsApp')}
                style={{
                    flexDirection: 'row-reverse',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 15,
                }}
            >
                <View
                    style={{
                        flexDirection: 'row-reverse',
                        alignItems: 'center',
                        flex: 1
                    }}
                >
                    {hasThumbnail ?
                        <Image
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 100,
                            }}
                            source={{ uri: thumbnailPath }}
                        />
                        :
                        <LinearGradient
                            start={{ x: 0, y: 1 }}
                            end={{ x: 0.8, y: 0.2 }}
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 100,
                            }}
                            colors={[colors[randNumbers[index] ?? 0][0], colors[randNumbers[index] ?? 0][1]]}
                        >
                            <Text
                                style={{
                                    color: 'white',
                                    textAlignVertical: 'center',
                                    textAlign: 'center',
                                    width: '100%',
                                    height: '100%',
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                    textTransform: 'uppercase'
                                }}
                            >
                                {`${givenName.length ? '' + givenName[0] : ""}${familyName.length ? '' + familyName[0] : ''}`}
                            </Text>
                        </LinearGradient>
                    }
                    <View
                        style={{
                            borderBottomColor: '#f0f0f1',
                            marginLeft: 15,
                            borderBottomWidth: 1,
                            paddingVertical: 20,
                            flexDirection: 'row-reverse',
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}
                    >
                        <Text
                            numberOfLines={1}
                            style={{
                                textAlign: 'right',
                                color: '#666',
                                fontSize: 15,
                                width: '63%',
                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                            }}
                        >
                            {displayName}
                        </Text>
                        <View
                            style={{
                                flexDirection: 'row-reverse',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}
                        >
                            <Svg
                                onPress={_ => shareToExternalApp(phoneNumbers[0].number, 'whatsApp')}
                                xmlns="http://www.w3.org/2000/svg"
                                width="30"
                                height="30"
                                fill="#2ecc71"
                                viewBox="0 0 30 30"
                            >
                                <Path d="M15 3C8.373 3 3 8.373 3 15c0 2.251.632 4.35 1.71 6.15L3.108 27l5.975-1.568A11.935 11.935 0 0015 27c6.627 0 12-5.373 12-12S21.627 3 15 3zm-4.107 6.402c.195 0 .395 0 .568.008.214.005.447.02.67.514.265.586.842 2.056.916 2.205.074.149.126.324.023.52-.098.2-.149.32-.293.497-.149.172-.312.386-.447.516-.149.15-.303.312-.13.61.171.296.769 1.27 1.652 2.056 1.135 1.014 2.092 1.326 2.39 1.475.298.149.47.126.643-.074.177-.195.743-.865.943-1.163.195-.298.394-.246.664-.148.274.098 1.735.818 2.033.967.298.149.494.223.569.344.077.125.077.72-.17 1.414-.247.693-1.46 1.363-2.004 1.41-.55.05-1.061.246-3.568-.74-3.024-1.191-4.932-4.289-5.08-4.489-.15-.195-1.211-1.61-1.211-3.07 0-1.465.768-2.183 1.037-2.48.274-.299.595-.372.795-.372z"></Path>
                            </Svg>
                            <Svg
                                onPress={_ => shareToExternalApp(phoneNumbers[0].number, 'sms')}
                                xmlns="http://www.w3.org/2000/svg"
                                className="svg-icon"
                                style={{ width: 28, height: 28, verticalAlign: "middle", marginHorizontal: 15 }}
                                fill="currentColor"
                                overflow="hidden"
                                viewBox="0 0 1024 1024"
                            >
                                <Path
                                    fill="#1abc9c"
                                    d="M789.333 832H234.667l-128 128V234.667c0-70.4 57.6-128 128-128h554.666c70.4 0 128 57.6 128 128V704c0 70.4-57.6 128-128 128z"
                                ></Path>
                                <Path
                                    fill="#FFF"
                                    d="M448 469.333a64 64 0 10128 0 64 64 0 10-128 0zM661.333 469.333a64 64 0 10128 0 64 64 0 10-128 0zM234.66699999999997 469.333a64 64 0 10128 0 64 64 0 10-128 0z"
                                ></Path>
                            </Svg>

                            {shouldShowInstagramButton == false ?
                                <FontAwesome5
                                    onPress={onSharePressed}
                                    name='ellipsis-h'
                                    size={17}
                                    color='#555'
                                />
                                :
                                <Pressable
                                    onPress={shareToInstagramStory}
                                >
                                    <Image
                                        style={{
                                            width: 25,
                                            height: 25
                                        }}
                                        source={require('../../../assets/icons/instagram.png')}
                                    />
                                </Pressable>

                            }
                        </View>
                    </View>
                </View>
            </Pressable>
        )
    };

    const keyExtractor = (_, index) => index.toString();

    const renderListEmptyComponent = _ => {
        if (!uploadContactsLoading && !userContacts.length)
            return (
                <View
                    style={{
                        flex: 1,
                        marginTop: 50,
                        width: deviceWidth,
                        alignSelf: 'center',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <FontAwesome5
                        size={65}
                        name='user-circle'
                        solid
                        color='#BEBEBE'
                    />
                    <Text
                        style={{
                            fontSize: 20,
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            color: '#7E7E7E'
                        }}
                    >
                        {locales('labels.noContactFound')}
                    </Text>
                </View>
            )
        if (uploadContactsLoading)
            return (
                [1, 2, 3, 4, 5, 6].map((_, index) => (
                    <ContentLoader
                        key={index}
                        speed={2}
                        width={deviceWidth}
                        height={deviceWidth * 0.18}
                        backgroundColor="#f3f3f3"
                        foregroundColor="#ecebeb"
                        style={{ alignSelf: 'flex-start', justifyContent: 'center', alignItems: 'flex-start' }}
                    >
                        <Circle cx='90%' cy="40%" r="20" />
                        <Rect x="55%" y="35%" width="90" height="10" />
                        <Circle cx='30%' cy="40%" r="12" />
                        <Circle cx='20%' cy="40%" r="12" />
                        <Circle cx='10%' cy="40%" r="12" />
                    </ContentLoader>
                ))
            );
        return null;
    };

    const onRefresh = _ => {
        getContacts(true);
    };

    // const onScrollChanged = ({ nativeEvent }) => {
    //     const {
    //         contentInset,
    //         contentOffset,
    //         contentSize,
    //         layoutMeasurement,
    //         zoomScale
    //     } = nativeEvent;
    //     setScrollYPos(contentInset.y);
    //     setEleHeight(contentSize.height);
    //     translateY.setValue(-1 * contentOffset.y)
    // };

    const renderListHeaderComponent = _ => {

        return (
            <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                colors={['#151c2e', '#1010ee']}
            // colors={['#27426b', '#474d6f']}
            >
                <View
                    style={{
                        padding: 10
                    }}
                >
                    <Text
                        style={{
                            textAlign: 'right',
                            color: '#fff',
                            fontSize: 16,
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                        }}
                    >
                        {locales('titles.shareInviteLink')}
                    </Text>

                    <View
                        style={{
                            flexDirection: 'row-reverse',
                            backgroundColor: 'white',
                            alignItems: 'center',
                            marginVertical: 10,
                            justifyContent: 'space-between',
                            alignSelf: 'center',
                            borderRadius: 12
                        }}
                    >
                        <Text
                            onPress={showToast}
                            style={{
                                textAlign: 'center',
                                backgroundColor: '#02C09E',
                                color: 'white',
                                fontSize: 16,
                                borderRadius: 12,
                                padding: 10,
                                width: '25%',
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            }}
                        >
                            {locales('titles.copy')}
                        </Text>
                        <Text
                            numberOfLines={1}
                            style={{
                                textAlign: 'left',
                                backgroundColor: 'white',
                                fontSize: 14,
                                borderRadius: 12,
                                padding: 10,
                                width: '75%',
                                color: '#555',
                                fontFamily: 'IRANSansWeb(FaNum)_Light',
                            }}
                        >
                            {completeUrlToShare}
                        </Text>
                    </View>

                    <View
                        style={{
                            flexDirection: 'row-reverse',
                            alignSelf: 'center',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: 10,
                        }}
                    >
                        <Pressable
                            onPress={_ => shareToExternalApp(undefined, 'whatsApp')}
                            style={{
                                flexDirection: 'row-reverse',
                                borderColor: '#fff',
                                borderWidth: 1,
                                alignItems: 'center',
                                justifyContent: 'space-around',
                                backgroundColor: 'white',
                                borderRadius: 12,
                                width: '30%',
                                padding: 10,
                            }}
                        >
                            <FontAwesome5
                                name='whatsapp'
                                solid
                                color='#2ecc71'
                                size={20}
                            />
                            <Text
                                style={{
                                    color: '#000',
                                    marginHorizontal: 5,
                                    fontFamily: 'IRANSansWeb(FaNum)_Light',
                                }}
                            >
                                {locales('titles.whatsApp')}
                            </Text>
                        </Pressable>
                        <Pressable
                            onPress={_ => shareToExternalApp(undefined, 'sms')}
                            style={{
                                flexDirection: 'row-reverse',
                                borderColor: '#fff',
                                borderWidth: 1,
                                alignItems: 'center',
                                justifyContent: 'space-around',
                                backgroundColor: 'white',
                                borderRadius: 12,
                                width: '30%',
                                marginHorizontal: 20,
                                padding: 10,
                            }}
                        >
                            <FontAwesome5
                                name='sms'
                                solid
                                color='#1abc9c'
                                size={20}
                            />
                            <Text
                                style={{
                                    color: '#000',
                                    marginHorizontal: 5,
                                    fontFamily: 'IRANSansWeb(FaNum)_Light',
                                }}
                            >
                                {locales('labels.sms')}
                            </Text>
                        </Pressable>
                        <Pressable
                            onPress={onSharePressed}
                            style={{
                                flexDirection: 'row-reverse',
                                borderColor: '#fff',
                                borderWidth: 1,
                                alignItems: 'center',
                                justifyContent: 'space-around',
                                borderRadius: 12,
                                backgroundColor: 'white',
                                width: '30%',
                                padding: 10,
                            }}
                        >
                            <FontAwesome5
                                name='ellipsis-h'
                                solid
                                color='#555'
                                size={20}
                            />
                            <Text
                                style={{
                                    color: '#000',
                                    marginHorizontal: 5,
                                    fontFamily: 'IRANSansWeb(FaNum)_Light',
                                }}
                            >
                                {locales('titles.others')}
                            </Text>
                        </Pressable>
                    </View>
                </View>

                <Text
                    style={{
                        paddingTop: 10,
                        marginBottom: 5,
                        paddingHorizontal: 15,
                        color: '#fff',
                        textAlignVertical: 'center',
                        textAlign: 'right',
                        width: '100%',
                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                    }}
                >
                    {locales('titles.yourContacts')}
                </Text>
                {
                    renderSearchBar()
                }
            </LinearGradient>
        )
    };

    const renderSearchBar = _ => {
        return (
            <InputGroup style={{ backgroundColor: '#f2f2f2' }}>
                <Input
                    value={searchText}
                    onChangeText={handleSearch}
                    style={{
                        fontFamily: 'IRANSansWeb(FaNum)_Medium',
                        paddingBottom: 10,
                        color: '#777',
                        textAlignVertical: 'bottom'
                    }}
                    placeholderTextColor="#bebebe"
                    placeholder={locales('labels.searchContacts')}
                />
                <Icon
                    name='ios-search'
                    style={{
                        color: '#7E7E7E',
                        marginHorizontal: 5
                    }}
                />
            </InputGroup>
        )
    };

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: 'white'
            }}
        >
            {showImagePreview ?
                <Modal
                    visible={showImagePreview}
                    onRequestClose={_ => setShowImagePreview(false)}
                    transparent={false}
                    animationType='fade'
                >
                    <View
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <ViewShot
                            ref={viewShotRef}
                            options={{
                                format: "png",
                                quality: 1,
                                result: 'data-uri'
                            }}
                        >

                            <ImageBackground
                                source={image && image.length ? { uri: image } : require('../../../assets/icons/buskool-logo.png')}
                                style={{
                                    resizeMode: "cover",
                                    width: deviceWidth,
                                    height: deviceHeight,
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                }}
                                blurRadius={1}
                            >
                                <View
                                    style={{
                                        // backgroundColor: 'rgba(0,0,0,0.4)',
                                        padding: 20,
                                        paddingTop: 40,
                                        width: deviceWidth,
                                        height: deviceHeight
                                    }}
                                >
                                    <ShadowView
                                        style={{
                                            shadowColor: 'black',
                                            shadowOpacity: 0.16,
                                            shadowRadius: 7,
                                            shadowOffset: { width: 1, height: 5 },
                                            padding: 15,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            alignSelf: 'center',
                                            zIndex: 1,
                                            backgroundColor: 'rgba(0,0,0,0.7)',
                                            borderRadius: 12,
                                            width: '90%',
                                            alignSelf: 'center',
                                            marginTop: 30
                                        }}>
                                        <View
                                            style={{
                                                borderBottomWidth: 1,
                                                borderBottomColor: '#f2f2f2',
                                                paddingBottom: 10,
                                                width: deviceWidth * 0.81
                                            }}
                                        >
                                            <View
                                                style={{
                                                    flexDirection: 'row-reverse',
                                                    alignItems: 'center',
                                                    padding: 20
                                                }}
                                            >
                                                <FontAwesome5
                                                    name='check'
                                                    color='#00C569'
                                                    solid
                                                    size={20}
                                                />
                                                <Text
                                                    numberOfLines={2}
                                                    style={{
                                                        fontSize: 23,
                                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                                        textAlign: 'right',
                                                        color: '#fff',
                                                        marginRight: 5
                                                    }}
                                                >
                                                    {`${locales('labels.sale')} ${sub_category_name ? `${sub_category_name} | ${product_name}` : product_name}`}
                                                </Text>
                                            </View>
                                            <View
                                                style={{
                                                    paddingVertical: 10,
                                                    paddingHorizontal: 20,
                                                }}
                                            >
                                                <View
                                                    style={{
                                                        flexDirection: 'row-reverse',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        borderRadius: 12,
                                                        padding: 10,
                                                    }}
                                                >
                                                    <View
                                                        style={{
                                                            flexDirection: 'row-reverse',
                                                            alignItems: 'center',
                                                            borderRadius: 12,
                                                        }}
                                                    >
                                                        <FontAwesome5
                                                            name='box-open'
                                                            color='#999'
                                                            solid
                                                            style={{ textAlign: 'center', width: 23, marginLeft: 5 }}
                                                            size={15}
                                                        />
                                                        <Text
                                                            style={{
                                                                fontSize: 18,
                                                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                                                textAlign: 'right',
                                                                color: '#fff',
                                                            }}
                                                        >
                                                            {locales('titles.stockQuantity')}
                                                        </Text>
                                                    </View>
                                                    <Text
                                                        numberOfLines={1}
                                                        style={{
                                                            fontSize: 20,
                                                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                                            textAlign: 'left',
                                                            color: '#fff',
                                                            width: '64%'
                                                        }}
                                                    >
                                                        {formatter.convertedNumbersToTonUnit(stock)}
                                                    </Text>
                                                </View>
                                                <View
                                                    style={{
                                                        flexDirection: 'row-reverse',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        backgroundColor: 'rgba(100,100,100,0.4)',
                                                        borderRadius: 12,
                                                        padding: 10,
                                                    }}
                                                >
                                                    <View
                                                        style={{
                                                            flexDirection: 'row-reverse',
                                                            alignItems: 'center',
                                                            backgroundColor: 'transparent',
                                                            borderRadius: 12,
                                                        }}
                                                    >
                                                        <FontAwesome5
                                                            name='clipboard-check'
                                                            color='#999'
                                                            solid
                                                            style={{ textAlign: 'center', width: 23, marginLeft: 5 }}
                                                            size={18}
                                                        />
                                                        <Text
                                                            style={{
                                                                fontSize: 18,
                                                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                                                textAlign: 'right',
                                                                color: '#fff',
                                                            }}
                                                        >
                                                            {locales('titles.minSale')}
                                                        </Text>
                                                    </View>
                                                    <Text
                                                        numberOfLines={1}
                                                        style={{
                                                            fontSize: 20,
                                                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                                            textAlign: 'left',
                                                            color: '#fff',
                                                            width: '52%',
                                                        }}
                                                    >
                                                        {formatter.convertedNumbersToTonUnit(min_sale_amount)}
                                                    </Text>
                                                </View>
                                                <View
                                                    style={{
                                                        flexDirection: 'row-reverse',
                                                        alignItems: 'center',
                                                        borderRadius: 12,
                                                        padding: 10,
                                                        justifyContent: 'space-between',
                                                    }}
                                                >
                                                    <View
                                                        style={{
                                                            flexDirection: 'row-reverse',
                                                            alignItems: 'center',
                                                            borderRadius: 12,
                                                        }}
                                                    >
                                                        <FontAwesome5
                                                            name='map-marker-alt'
                                                            color='#999'
                                                            solid
                                                            style={{ textAlign: 'center', width: 23, marginLeft: 5 }}
                                                            size={18}
                                                        />
                                                        <Text
                                                            style={{
                                                                fontSize: 18,
                                                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                                                textAlign: 'right',
                                                                color: '#fff',
                                                            }}
                                                        >
                                                            {locales('labels.startLocation')}
                                                        </Text>
                                                    </View>
                                                    <Text
                                                        numberOfLines={1}
                                                        style={{
                                                            fontSize: 20,
                                                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                                            textAlign: 'left',
                                                            color: '#fff',
                                                            width: '75%',
                                                        }}
                                                    >
                                                        {city_name || '---'}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View
                                            style={{
                                                flexDirection: 'row-reverse',
                                                alignItems: 'center',
                                                justifyContent: 'flex-end',
                                                marginTop: 10,
                                                width: '97%'
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 15,
                                                    fontFamily: 'IRANSansWeb',
                                                    textAlign: 'left',
                                                    marginLeft: 10,
                                                    width: '85%',
                                                    color: '#fff',
                                                }}
                                            >
                                                {`www.buskool.com/profile/${(user_name)}`}
                                            </Text>
                                            <Image
                                                source={require('../../../assets/icons/buskool-logo.png')}
                                                style={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: 12,
                                                    backgroundColor: '#E84153',
                                                }}
                                            />
                                        </View>
                                    </ShadowView>
                                    <View
                                        style={{
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Image
                                            source={require('../../../assets/icons/buskool-logo.png')}
                                            style={{
                                                width: 90,
                                                height: 90,
                                                marginVertical: 30,
                                                borderRadius: 12,
                                                backgroundColor: '#E84153',
                                            }}
                                        />
                                        <Text
                                            style={{
                                                fontSize: 36,
                                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                                textAlign: 'center',
                                                color: '#fafafa',
                                                backgroundColor: '#rgba(0,0,0,0.6)',
                                                borderRadius: 12,
                                                padding: 5,

                                            }}
                                        >
                                            {locales('titles.saleInBuskoolSite')}
                                        </Text>
                                    </View>
                                </View>
                            </ImageBackground>
                        </ViewShot>
                        <Button
                            onPress={captureImage}
                            style={{
                                backgroundColor: "#00C569",
                                position: 'absolute',
                                bottom: 20,
                                borderRadius: 12,
                                padding: 10,
                                marginVertical: 10,
                                width: '90%',
                                alignItems: 'center',
                                alignSelf: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 20,
                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                    textAlign: 'center',
                                    color: 'white',
                                }}
                            >
                                {locales('labels.share')}
                            </Text>
                        </Button>
                    </View>
                </Modal>
                : null
            }

            <Header
                title={locales('titles.yourContacts')}
                {...props}
            />


            {renderListHeaderComponent()}

            <FlatList
                // onScroll={onScrollChanged}
                // scrollEventThrottle={16}
                // style={[{
                //     zIndex: 999,
                //     bottom: translateY.interpolate({
                //         inputRange: [0, 10],
                //         outputRange: [0, 10],
                //     })
                // },
                // ]}
                keyboardDismissMode='none'
                keyboardShouldPersistTaps='handled'
                data={userContacts}
                ListEmptyComponent={renderListEmptyComponent}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                onRefresh={onRefresh}
                refreshing={false}
                windowSize={10}
                initialNumToRender={3}
                initialScrollIndex={0}
                maxToRenderPerBatch={10}
                removeClippedSubviews
            />
        </View>
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

const mapDispatchToProps = dispatch => {
    return {
        uploadUserContacts: contacts => dispatch(profileActions.uploadUserContacts(contacts))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(UserContacts);