import React, { PureComponent } from 'react';
import {
    Text, Image, View, StyleSheet, Modal, ScrollView,
    Pressable, Linking, Share, RefreshControl,
    ActivityIndicator
} from 'react-native';
import RBSheet from "react-native-raw-bottom-sheet";
import { Dialog, Portal, Paragraph } from 'react-native-paper';
import { Navigation } from 'react-native-navigation';
import analytics from '@react-native-firebase/analytics';
import { connect } from 'react-redux';
import { Input, Label, Item, Button, Toast } from 'native-base';
import { REACT_APP_API_ENDPOINT_RELEASE, REACT_APP_API_ENDPOINT_BLOG_RELEASE } from '@env';
import * as productListActions from '../../redux/productsList/actions';
import ShadowView from '@vikasrg/react-native-simple-shadow-view'
import * as profileActions from '../../redux/profile/actions';
import { deviceWidth, deviceHeight } from '../../utils/deviceDimenssions';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import EvilIcons from 'react-native-vector-icons/dist/EvilIcons';
import ContentLoader, { Rect, Circle } from "react-content-loader/native"
import Svg, { Path as SvgPath, G, Defs, Pattern, Image as SvgImage, Circle as SvgCircle } from "react-native-svg"
import ImageZoom from 'react-native-image-pan-zoom';

import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import Feather from 'react-native-vector-icons/dist/Feather';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import { validator, formatter } from '../../utils';
import ValidatedUserIcon from '../../components/validatedUserIcon';
import RelatedProductsList from './RelatedProductsList';
import ProductImages from './ProductImages';
import StarRating from '../../components/StarRating';
import Header from '../../components/header';
import RegisterationModal from '../../components/RegisterationModal';
import ContactsListModal from '../../components/contactsListModal';
import { shareToSocial } from '../../components/shareToSocial';

class ProductDetails extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            editionFlag: false,
            showEditionMessage: false,
            showFullSizeImageModal: false,
            selectedImage: -1,

            minimumOrder: '',
            amount: '',
            loaded: false,
            maximumPrice: '',
            minimumPrice: '',
            minimumOrderError: '',
            editionMessageText: '',
            showEditionMessage: '',
            maximumPriceError: '',
            minimumPriceError: '',
            amountError: '',

            related_products: [],
            avg_score: 0,
            total_count: 0,

            active_pakage_type: 0,
            created_at: '',
            first_name: '',
            userId: '',
            is_verified: false,
            last_name: '',
            response_rate: 0,
            user_name: '',

            photos: [],
            description: '',

            myuser_id: '',
            product_name: '',
            province_id: null,
            province_name: '',
            sub_category_id: '',
            sub_category_name: '',
            updated_at: '',

            address: '',
            category_id: null,
            category_name: '',
            city_id: null,
            city_name: '',
            confirmed: false,
            is_elevated: false,
            stock: 0,

            max_sale_price: 0,
            min_sale_amount: 0,
            min_sale_price: 0,

            profile_photo: '',

            isContactInfoShown: false,
            has_phone: false,
            mobileNumber: '',
            showMobileNumberWarnModal: false,
            productIdFromProductDetails: '',
            accessToContactInfoErrorMessage: '',

            shouldShowRegisterationModal: false,
            RegisterationModalReturnType: null,

            showContactListModal: false,
        }
    }


    amountRef = React.createRef();
    minimumOrderRef = React.createRef();
    maximumPriceRef = React.createRef();
    minimumPriceRef = React.createRef();
    refRBSheet = React.createRef();


    wrapper = React.createRef();

    componentDidMount() {
        Navigation.events().registerComponentDidAppearListener(({ componentName, componentType }) => {
            if (componentType === 'Component') {
                analytics().logScreenView({
                    screen_name: componentName,
                    screen_class: componentName,
                });
            }
        });
        analytics().logScreenView({
            screen_name: "product_view",
            screen_class: "product_view",
        });

        this.initialCall();

    }

    initialCall = _ => {
        const {
            route = {}
        } = this.props;

        const {
            params = {}
        } = route;

        const {
            productId
        } = params;

        if (productId) {
            this.props.fetchAllProductInfo(productId);
        }
    };

    componentDidUpdate(prevProps, prevState) {

        const {
            route = {}
        } = this.props;

        const {
            params = {}
        } = route;

        const {
            productId
        } = params;

        const {
            route: prevPropsRoute = {}
        } = prevProps;

        const {
            params: prevPropsParams = {}
        } = prevPropsRoute;

        const {
            productId: prevPropsProductId
        } = prevPropsParams;

        if (prevPropsProductId != productId) {
            this.setState({ loaded: false });
            this.props.fetchAllProductInfo(productId);
        }
        if ((this.state.loaded == false || prevState.loaded == false) && this.props.productDetailsInfo && this.props.productDetailsInfo.length) {

            const {
                productDetailsInfo = []
            } = this.props;

            const {
                main = {},
                photos,
                profile_info = {},
                user_info = {}
            } = productDetailsInfo[0].product;

            const {
                profile_photo
            } = profile_info;

            const {
                address,
                category_id,
                category_name,
                city_id,
                city_name,
                confirmed,
                description,
                is_elevated,
                max_sale_price,
                min_sale_amount,
                min_sale_price,
                myuser_id,
                product_name,
                province_id,
                province_name,
                stock,
                sub_category_id,
                sub_category_name,
                updated_at,
                id: productIdFromProductDetails
            } = main;

            const {
                active_pakage_type,
                created_at,
                first_name,
                id,
                is_verified,
                last_name,
                response_rate,
                review_info = {},
                user_name,
                has_phone
            } = user_info;

            const {
                avg_score,
                total_count
            } = review_info;

            const {
                related_products = []
            } = productDetailsInfo[1];

            this.setState({
                minimumOrder: min_sale_amount.toString(),
                maximumPrice: max_sale_price.toString(),
                minimumPrice: min_sale_price.toString(),
                amount: stock.toString(),
                loaded: true,

                related_products,
                avg_score,
                total_count,

                active_pakage_type,
                created_at,
                first_name,
                userId: id,
                is_verified,
                last_name,
                response_rate,
                user_name,

                photos,
                description,

                myuser_id,
                product_name,
                province_id,
                province_name,
                sub_category_id,
                sub_category_name,
                updated_at,

                address,
                category_id,
                category_name,
                city_id,
                city_name,
                confirmed,
                is_elevated,
                stock,
                max_sale_price,
                min_sale_amount,
                min_sale_price,

                profile_photo,
                has_phone,
                productIdFromProductDetails
            });
        }
    }

    showFullSizeImage = index => {
        this.setState({ showFullSizeImageModal: true, selectedImage: index })
    };



    onAmountSubmit = field => {
        this.setState(() => ({
            amount: field,
            amountError: ''
        }));
    };

    onMinimumPriceSubmit = field => {
        if (validator.isNumber(field))
            this.setState(() => ({
                minimumPrice: field,
                minimumPriceError: ''
            }));
        else
            this.setState(() => ({
                minimumPrice: ''
            }));
    };

    onMaximumPriceSubmit = field => {
        if (validator.isNumber(field))
            this.setState(() => ({
                maximumPrice: field,
                maximumPriceError: ''
            }));
        else
            this.setState(() => ({
                maximumPrice: ''
            }));
    };

    onMinimumOrderSubmit = field => {
        if (validator.isNumber(field))
            this.setState(() => ({
                minimumOrder: field,
                minimumOrderError: ''
            }));
        else
            this.setState(() => ({
                minimumOrder: ''
            }));
    };




    onSubmit = () => {

        let { minimumOrder, maximumPrice, minimumPrice, amount } = this.state;

        let minimumOrderError = '', maximumPriceError = '', minimumPriceError = '', amountError = '';

        if (!amount) {
            amountError = locales('errors.fieldNeeded', { fieldName: locales('titles.amountNeeded') })
        }
        else {
            amountError = '';
        }


        if (!minimumOrder) {
            minimumOrderError = locales('errors.fieldNeeded', { fieldName: locales('titles.minimumOrderNeeded') })
        }
        else {
            minimumOrderError = '';
        }


        if (!maximumPrice) {
            maximumPriceError = locales('errors.fieldNeeded', { fieldName: locales('titles.maxPriceNeeded') })
        }
        else {
            maximumPriceError = '';
        }


        if (!minimumPrice) {
            minimumPriceError = locales('errors.fieldNeeded', { fieldName: locales('titles.minPriceNeeded') })
        }
        else {
            minimumPriceError = '';
        }
        this.setState({ minimumOrderError, maximumPriceError, minimumPriceError, amountError })
        if (!minimumOrderError && !minimumPriceError && !maximumPriceError && !amountError) {
            let productObject = {
                product_id: this.props.productDetailsInfo[0].product.main.id,
                stock: amount,
                min_sale_amount: minimumOrder,
                max_sale_price: maximumPrice,
                min_sale_price: minimumPrice
            };
            this.props.editProduct(productObject).then(_ => {
                const { editProductMessage } = this.props;
                this.setState({
                    showEditionMessage: true,
                    editionMessageText: editProductMessage
                }, () => {
                    this.props.fetchAllProductInfo(this.props.route.params.productId)
                    setTimeout(() => {
                        this.setState({ showEditionMessage: false, editionFlag: false })
                    }, 4000);
                });
            }).catch(_ => {
                const { editProductMessage } = this.props;
                this.setState({
                    showEditionMessage: true,
                    editionMessageText: editProductMessage
                }, () => {
                    this.props.fetchAllProductInfo(this.props.route.params.productId)
                    setTimeout(() => {
                        this.setState({ showEditionMessage: false, editionFlag: false })
                    }, 4000);
                });
            });
        }
    }


    getProductUrl = _ => {
        if (this.props.productDetailsInfo.length)
            return (
                "/product-view/خرید-عمده-" +
                this.props.productDetailsInfo[0].product.main.sub_category_name.replace(" ", "-") +
                "/" +
                this.props.productDetailsInfo[0].product.main.category_name.replace(" ", "-") +
                "/" +
                this.props.productDetailsInfo[0].product.main.id
            );
    };

    // shareProductLink = async (url) => {
    //     this.setState({ showContactListModal: false });
    //     if (this.props.route.params.productId)
    //         analytics().logEvent('product_share', {
    //             product_id: this.props.route.params.productId
    //         });
    //     try {
    //         const result = await Share.share({
    //             message: url,
    //         });
    //         if (result.action === Share.sharedAction) {
    //             if (result.activityType) {
    //                 // shared with activity type of result.activityType
    //             } else {
    //                 // shared
    //             }
    //         } else if (result.action === Share.dismissedAction) {
    //             // dismissed
    //         }
    //     } catch (error) {
    //     }
    // };

    shareProductLink = (url, image, description = '') => {
        const {
            route = {}
        } = this.props;

        const {
            params = {}
        } = route;

        const {
            productId,
        } = params;

        const {
            sub_category_name,
            product_name
        } = this.state;

        this.setState({ showContactListModal: false });
        analytics().logEvent('product_share', {
            product_id: productId
        });

        url = url.replace(/ /g, '');

        url = `${description}\n\n${url}`;

        const title = (`${sub_category_name} ${sub_category_name ? ' | ' : ''} ${product_name}`) || '---';

        return shareToSocial('whatsApp', image, url, undefined, title);
    };

    openCallPad = phoneNumber => {

        if (!validator.isMobileNumber(phoneNumber))
            return;

        return Linking.canOpenURL(`tel:${phoneNumber}`).then((supported) => {
            if (!!supported) {
                Linking.openURL(`tel:${phoneNumber}`)
            }
            else {

            }
        })
            .catch(_ => { })
    };

    fetchContactInfo = (id, userId, isRegisterationModalSeen) => {

        const {
            loggedInUserId,
            userProfile = {}
        } = this.props;

        const {
            user_info = {}
        } = userProfile;

        const {
            is_seller
        } = user_info;

        const contactInfoObject = {
            s_id: userId,
            p_id: id,
            item: "PRODUCT"
        }
        if (!loggedInUserId) {
            if (isRegisterationModalSeen != true)
                return this.setState({ shouldShowRegisterationModal: true, RegisterationModalReturnType: 1 });
            return;
        }

        if (userId == loggedInUserId || !!is_seller)
            return;

        this.props.fetchSellerMobileNumber(contactInfoObject).then(result => {

            const {
                payload = {}
            } = result;
            const {
                phone,
                status
            } = payload;
            if (status == true && !!phone) {
                this.setState({ mobileNumber: phone, isContactInfoShown: true }, _ => {
                    return this.refRBSheet?.current?.open();
                })
            }
        })
            .catch(err => {
                const {
                    response = {}
                } = err;
                const {
                    data = {}
                } = response;
                const {
                    msg,
                    status
                } = data;
                if (status == false) {
                    this.setState({ showMobileNumberWarnModal: true, accessToContactInfoErrorMessage: msg })
                }
            });
    };

    closeContactInfoSlider = _ => {
        this.setState({ isContactInfoShown: false }, _ => {
            return this.refRBSheet?.current?.close();
        })
    };

    openChat = () => {
        let {
            first_name,
            is_verified,
            last_name,
            user_name,
            userId,
            profile_photo,
            productIdFromProductDetails
        } = this.state;

        const {
            loggedInUserId
        } = this.props;

        if (!loggedInUserId)
            return this.setState({ shouldShowRegisterationModal: true, RegisterationModalReturnType: 0 });

        const selectedContact = {
            first_name,
            contact_id: userId,
            last_name,
            user_name,
            is_verified
        }
        if (this.props?.route?.params?.productId)
            analytics().logEvent('open_chat', {
                product_id: this.props?.route?.params?.productId
            });
        this.props.navigation.navigate('Chat', {
            contact: selectedContact,
            profile_photo,
            productId: productIdFromProductDetails
        })
    };

    onRequestToCloseRegisterationModal = (shouldOpenChat = false) => {

        this.setState({ shouldShowRegisterationModal: false }, _ => {

            const {
                first_name,
                is_verified,
                last_name,
                user_name,
                userId,
                profile_photo,
                RegisterationModalReturnType = 0,
                productIdFromProductDetails,
            } = this.state;

            const selectedContact = {
                first_name,
                contact_id: userId,
                last_name,
                user_name,
                is_verified
            }

            if (RegisterationModalReturnType == 1)
                this.fetchContactInfo(productIdFromProductDetails, userId, true);
            else {
                if (shouldOpenChat == true)
                    this.props.navigation.navigate('Chat', {
                        contact: selectedContact,
                        profile_photo,
                        productId: productIdFromProductDetails
                    });
            }
        });
    };

    onRequestCloseContactListModal = _ => {
        this.setState({ showContactListModal: false });
    };

    navigateToPaymentType = _ => {

        const {
            productIdFromProductDetails,
        } = this.state;

        this.props.navigation.navigate('PaymentType', {
            price: 25000,
            type: 0,
            productId: productIdFromProductDetails,
            bankUrl: `${REACT_APP_API_ENDPOINT_RELEASE}/app-payment/elevator/${productIdFromProductDetails}`
        });
    };

    render() {
        const {
            editProductLoading,
            editProductStatus,
            loggedInUserId,
            productDetailsInfoLoading,
            productDetailsInfoError,
            productDetailsInfoFailed,

            sellerMobileNumberLoading,

            userProfile = {}
        } = this.props;

        const {
            user_info = {}
        } = userProfile;

        const {
            is_seller
        } = user_info;

        let {
            showFullSizeImageModal,
            selectedImage,
            editionFlag,
            showEditionMessage,

            minimumOrder,
            amount,
            maximumPrice,
            minimumPrice,
            minimumOrderError,
            editionMessageText,
            maximumPriceError,
            minimumPriceError,
            amountError,

            related_products = [],
            avg_score,
            total_count,

            active_pakage_type,
            first_name,
            is_verified,
            last_name,
            response_rate,
            user_name,
            userId,

            photos = [],

            description,

            product_name,
            min_sale_price,
            province_name,
            sub_category_name,

            category_name,
            city_name,
            is_elevated,
            stock,

            min_sale_amount,

            profile_photo,

            isContactInfoShown,
            has_phone,
            mobileNumber,
            showMobileNumberWarnModal,
            productIdFromProductDetails,

            accessToContactInfoErrorMessage,

            shouldShowRegisterationModal,

            category_id,
            sub_category_id,

            showContactListModal
        } = this.state;


        let photosWithCompletePath = Array.from(photos).map(item => `${REACT_APP_API_ENDPOINT_RELEASE}/storage/${item.file_path}`);
        let descriptionWithoutHtml = '';
        if (description != undefined && typeof (description) == 'string' && !!description && description.length) {
            descriptionWithoutHtml = description.replace(new RegExp('<hr/>', 'g'), "\n")
        }

        let splittedDescription = '';
        if (description && description.length) {
            splittedDescription = description.split('<hr/>').slice(2).filter(item => item);

            splittedDescription = splittedDescription.map(item => {
                const splittedDescriptionItem = item.split(":");
                splittedDescriptionItem[0] = `*${splittedDescriptionItem[0].trim()}*`;
                return splittedDescriptionItem[0] + " : " + splittedDescriptionItem[1];
            })
            splittedDescription = splittedDescription.filter(item => item && item.length).join('\n\n');

            splittedDescription = `${description.split('<hr/>').slice(0, 1)}\n\n${splittedDescription}`;
        }

        var url = REACT_APP_API_ENDPOINT_RELEASE + this.getProductUrl();

        return (
            <>
                {showContactListModal ?
                    <ContactsListModal
                        visible={showContactListModal}
                        onRequestClose={this.onRequestCloseContactListModal}
                        shouldShowInstagramButton={true}
                        onReject={_ => this.shareProductLink(url, photosWithCompletePath[0], splittedDescription)}
                        sharingUrlPostFix={this.getProductUrl()}
                        bodyText={splittedDescription}
                        productInfo={{
                            city_name,
                            min_sale_amount,
                            product_name,
                            stock,
                            sub_category_name,
                            user_name
                        }}
                        title={(`${sub_category_name} ${sub_category_name ? ' | ' : ''} ${product_name}`) || '---'}
                        image={photosWithCompletePath[0]}
                        {...this.props}
                    />
                    : null
                }

                {shouldShowRegisterationModal ?
                    <RegisterationModal
                        visible={shouldShowRegisterationModal}
                        onRequestClose={this.onRequestToCloseRegisterationModal}
                        subCategoryName={sub_category_name}
                        categoryId={category_id}
                        subCategoryId={sub_category_id}
                        productName={product_name}
                        {...this.props}
                    />
                    : null
                }

                {(!is_seller && isContactInfoShown) ?
                    <>
                        <RBSheet
                            ref={this.refRBSheet}
                            closeOnDragDown
                            closeOnPressMask
                            onClose={_ => this.closeContactInfoSlider()}
                            height={350}
                            animationType='fade'
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
                            <Text
                                onPress={_ => this.closeContactInfoSlider()}
                                style={{ width: '100%', textAlign: 'right', paddingHorizontal: 20 }}>
                                <EvilIcons name='close-o' size={35} color='#777777' />
                            </Text>

                            <View
                                style={{
                                    flexDirection: 'row-reverse',
                                    paddingHorizontal: 15,
                                    paddingVertical: 25,
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                        fontSize: 18,
                                        color: '#404B55'
                                    }}>
                                    {locales('titles.phoneNumber')}
                                </Text>
                                <Pressable
                                    android_ripple={{
                                        color: '#ededed'
                                    }}
                                    onPress={_ => this.openCallPad(mobileNumber)}
                                    style={{
                                        flexDirection: 'row-reverse',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: '#404B55', fontSize: 18,
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold', marginHorizontal: 5
                                        }}
                                    >
                                        {mobileNumber}
                                    </Text>
                                    <FontAwesome5
                                        name='phone-square-alt'
                                        size={20}
                                    />
                                </Pressable>
                            </View>

                            <View
                                style={{
                                    backgroundColor: '#FFFBE5',
                                    borderRadius: 12,
                                    alignSelf: 'center',
                                    padding: 20,
                                    width: deviceWidth * 0.95
                                }}
                            >

                                <View
                                    style={{
                                        flexDirection: 'row-reverse',
                                        alignItems: 'center'
                                    }}
                                >
                                    <FontAwesome5
                                        color='#404B55'
                                        size={25}
                                        name='exclamation-circle'
                                    />
                                    <Text
                                        style={{
                                            color: '#404B55',
                                            marginHorizontal: 5,
                                            fontSize: 18,
                                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                        }}
                                    >
                                        {locales('titles.policeWarn')}
                                    </Text>
                                </View>
                                <Text
                                    style={{
                                        marginVertical: 15,
                                        color: '#666666',
                                        fontSize: 16,
                                        fontFamily: 'IRANSansWeb(FaNum)_Light',
                                    }}
                                >
                                    {locales('labels.policeWarnDescription')}
                                </Text>
                            </View>
                        </RBSheet>
                    </>
                    : null}

                < Portal
                    style={{
                        padding: 0,
                        margin: 0

                    }}>
                    <Dialog
                        visible={showMobileNumberWarnModal}
                        onDismiss={_ => this.setState({ showMobileNumberWarnModal: false })}
                        style={styles.dialogWrapper}
                    >
                        <Dialog.Actions
                            style={styles.dialogHeader}
                        >
                            <Button
                                onPress={_ => this.setState({ showMobileNumberWarnModal: false })}
                                style={styles.closeDialogModal}>
                                <FontAwesome5 name="times" color="#777" solid size={18} />
                            </Button>
                            <Paragraph style={styles.headerTextDialogModal}>
                                {locales('labels.contactInfo')}
                            </Paragraph>
                        </Dialog.Actions>



                        <View
                            style={{
                                width: '100%',
                                alignItems: 'center'
                            }}>

                            <AntDesign name="exclamation" color="#f8bb86" size={70} style={[styles.dialogIcon, {
                                borderColor: '#facea8',
                            }]} />

                        </View>
                        <Paragraph
                            style={{ fontFamily: 'IRANSansWeb(FaNum)_Bold', color: '#e41c38', paddingHorizontal: 15, textAlign: 'center' }}>
                            {accessToContactInfoErrorMessage}
                        </Paragraph>
                        {/* <View style={{
                            width: '100%',
                            textAlign: 'center',
                            alignItems: 'center'
                        }}>
                            <Button
                                style={[styles.modalButton, styles.greenButton]}
                                onPress={() => {
                                    this.setState({ showMobileNumberWarnModal: false });
                                    this.props.navigation.navigate('MyBuskool', { screen: 'PromoteRegistration' });
                                }}
                            >

                                <Text style={[{ fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 16 },
                                styles.buttonText]}>{locales('titles.promoteRegistration')}
                                </Text>
                            </Button>
                        </View> */}




                        <Dialog.Actions style={{
                            justifyContent: 'center',
                            width: '100%',
                            padding: 0
                        }}>
                            <Button
                                style={styles.modalCloseButton}
                                onPress={_ => this.setState({ showMobileNumberWarnModal: false })}
                            >

                                <Text style={styles.closeButtonText}>{locales('titles.close')}
                                </Text>
                            </Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal >

                {editionFlag ? < Portal
                    style={{
                        padding: 0,
                        margin: 0

                    }}>
                    <Dialog
                        visible={editionFlag}
                        onDismiss={() => this.setState({ editionFlag: false })}
                        style={styles.dialogWrapper}
                    >
                        <Dialog.Actions
                            style={styles.dialogHeader}
                        >
                            <Button
                                onPress={() => this.setState({ editionFlag: false })}
                                style={styles.closeDialogModal}>
                                <FontAwesome5 name="times" color="#777" solid size={18} />
                            </Button>
                            <Paragraph style={styles.headerTextDialogModal}>
                                {locales('labels.edition', { fieldName: `${category_name || '---'}  ${category_name ? ' | ' : ''} ${sub_category_name || '---'}` })}
                            </Paragraph>
                        </Dialog.Actions>


                        {!showEditionMessage ?
                            <>
                                <Dialog.ScrollArea>
                                    <View style={styles.textInputPadding}>
                                        <Label style={{ color: 'black', fontFamily: 'IRANSansWeb(FaNum)_Bold', padding: 5 }}>
                                            {locales('titles.amount')}
                                        </Label>
                                        <Item regular style={{
                                            borderColor: amountError ? '#D50000' : amount.length ? '#00C569' : '#a8a8a8', borderRadius: 5, padding: 3
                                        }}>
                                            <Input
                                                autoCapitalize='none'
                                                autoCorrect={false}
                                                keyboardType='number-pad'
                                                autoCompleteType='off'
                                                style={{ fontFamily: 'IRANSansWeb(FaNum)_Bold', flexDirection: 'row', textDecorationLine: 'none' }}
                                                onChangeText={this.onAmountSubmit}
                                                value={amount}
                                                placeholder={locales('titles.amountWithExample')}
                                                ref={this.amountRef}

                                            />
                                        </Item>
                                        {!!amountError ? <Label style={{
                                            fontFamily: 'IRANSansWeb(FaNum)_Light',
                                            fontSize: 14, color: '#D81A1A'
                                        }}>{amountError}</Label> : null}
                                    </View>
                                    <View style={styles.textInputPadding}>
                                        <Label style={{ color: 'black', fontFamily: 'IRANSansWeb(FaNum)_Bold', padding: 5 }}>
                                            {locales('titles.minimumOrder')}
                                        </Label>
                                        <Item regular style={{
                                            borderColor: minimumOrderError ? '#D50000' : minimumOrder.length ? '#00C569' : '#a8a8a8', borderRadius: 5, padding: 3
                                        }}>
                                            <Input
                                                autoCapitalize='none'
                                                autoCorrect={false}
                                                autoCompleteType='off'
                                                keyboardType='number-pad'
                                                style={{ fontFamily: 'IRANSansWeb(FaNum)_Bold', textDecorationLine: 'none' }}
                                                onChangeText={this.onMinimumOrderSubmit}
                                                value={minimumOrder}
                                                placeholder={locales('titles.minimumOrderWithExample')}
                                                ref={this.minimumOrderRef}

                                            />
                                        </Item>
                                        {!!minimumOrderError ? <Label style={{
                                            fontFamily: 'IRANSansWeb(FaNum)_Light',
                                            fontSize: 14, color: '#D81A1A'
                                        }}>{minimumOrderError}</Label> : null}
                                    </View>
                                    <View style={styles.textInputPadding}>
                                        <Label style={{ color: 'black', fontFamily: 'IRANSansWeb(FaNum)_Bold', padding: 5 }}>
                                            {locales('titles.minimumPrice')}
                                        </Label>
                                        <Item regular style={{
                                            borderColor: minimumPriceError ? '#D50000' : minimumPrice.length ? '#00C569' : '#a8a8a8', borderRadius: 5, padding: 3
                                        }}>
                                            <Input
                                                autoCapitalize='none'
                                                autoCorrect={false}
                                                keyboardType='number-pad'
                                                autoCompleteType='off'
                                                style={{ fontFamily: 'IRANSansWeb(FaNum)_Bold', textDecorationLine: 'none' }}
                                                onChangeText={this.onMinimumPriceSubmit}
                                                value={minimumPrice}
                                                placeholder={locales('titles.minimumPriceWithExample')}
                                                ref={this.minimumPriceRef}

                                            />
                                        </Item>
                                        {!!minimumPriceError ? <Label style={{
                                            fontFamily: 'IRANSansWeb(FaNum)_Light',
                                            fontSize: 14, color: '#D81A1A'
                                        }}>
                                            {minimumPriceError}</Label> : null}
                                    </View>
                                    <View style={styles.textInputPadding}>
                                        <Label style={{ color: 'black', fontFamily: 'IRANSansWeb(FaNum)_Bold', padding: 5 }}>
                                            {locales('titles.maximumPrice')}
                                        </Label>
                                        <Item regular
                                            style={{
                                                borderColor: maximumPriceError ? '#D50000' : maximumPrice.length ? '#00C569' : '#a8a8a8',
                                                borderRadius: 5, padding: 3
                                            }}>
                                            <Input
                                                autoCapitalize='none'
                                                autoCorrect={false}
                                                autoCompleteType='off'
                                                keyboardType='number-pad'
                                                style={{ fontFamily: 'IRANSansWeb(FaNum)_Bold', textDecorationLine: 'none' }}
                                                onChangeText={this.onMaximumPriceSubmit}
                                                value={maximumPrice}
                                                placeholder={locales('titles.maximumPriceWithExample')}
                                                ref={this.maximumPriceRef}

                                            />
                                        </Item>
                                        {!!maximumPriceError ? <Label style={{
                                            fontFamily: 'IRANSansWeb(FaNum)_Light',
                                            fontSize: 14, color: '#D81A1A'
                                        }}>
                                            {maximumPriceError}
                                        </Label> : null}
                                    </View>
                                </Dialog.ScrollArea>
                                <Dialog.Actions style={{
                                    width: '100%',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <Button
                                        style={[styles.loginButton, { width: '50%' }]}
                                        onPress={() => this.onSubmit()}>
                                        <Text style={[styles.buttonText, { alignSelf: 'center' }]}>
                                            {locales('titles.submitChanges')}
                                        </Text>
                                    </Button>
                                </Dialog.Actions>
                            </> :
                            <>

                                <View
                                    style={{
                                        width: '100%',
                                        alignItems: 'center'
                                    }}>

                                    {!editProductStatus ? <AntDesign name="close" color="#f27474" size={70} style={[styles.dialogIcon, {
                                        borderColor: '#f27474',
                                    }]} /> : <Feather name="check" color="#a5dc86" size={70} style={[styles.dialogIcon, {
                                        borderColor: '#edf8e6',
                                    }]} />}

                                </View>
                                <Dialog.Actions style={styles.mainWrapperTextDialogModal}>

                                    <Text style={styles.mainTextDialogModal}>
                                        {editionMessageText}
                                    </Text>

                                </Dialog.Actions>
                            </>}



                        <Dialog.Actions style={{
                            justifyContent: 'center',
                            width: '100%',
                            padding: 0
                        }}>
                            <Button
                                style={styles.modalCloseButton}
                                onPress={() => this.setState({ editionFlag: false })}
                            >

                                <Text style={styles.closeButtonText}>{locales('titles.close')}
                                </Text>
                            </Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal > : null}

                <Modal
                    animationType="fade"
                    transparent
                    visible={showFullSizeImageModal}
                    onRequestClose={() => this.setState({ showFullSizeImageModal: false })}
                >
                    <View style={{
                        backgroundColor: 'rgba(59,59,59,0.85)',
                        height: deviceHeight, alignItems: 'center', justifyContent: 'center'
                    }}>
                        <AntDesign name='arrowright' size={30} color='white'
                            style={{ alignSelf: 'flex-end', justifyContent: 'center', position: 'absolute', right: 10, top: 10 }}
                            onPress={() => this.setState({ showFullSizeImageModal: false })}
                        />
                        <ImageZoom
                            cropWidth={deviceWidth}
                            cropHeight={deviceHeight * 0.9}
                            imageWidth={deviceWidth}
                            imageHeight={deviceHeight * 0.9}
                        >
                            <Image
                                style={{
                                    alignSelf: 'center',
                                    width: '100%',
                                    height: '100%',
                                    resizeMode: 'contain'
                                }}
                                source={{ uri: photosWithCompletePath[selectedImage] }} />
                        </ImageZoom>
                    </View>
                </Modal>

                <Header
                    title={(`${category_name} ${category_name ? ' | ' : ''} ${sub_category_name}`) || '---'}
                    {...this.props}
                />
                {productDetailsInfoError || productDetailsInfoFailed ?
                    <View
                        style={{
                            flex: 1,
                            height: deviceHeight,
                            width: deviceWidth,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Text
                            style={{
                                textAlign: 'center',
                                fontSize: 20,
                                color: '#777',
                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                marginVertical: 20
                            }}
                        >
                            {locales('labels.somethingWentWrong')}
                        </Text>
                        <Button
                            style={{
                                ...styles.loginButton,
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '50%',
                                backgroundColor: '#00C569',
                                elevation: 0,
                                borderRadius: 8,
                                alignSelf: 'center'
                            }}
                            onPress={this.initialCall}
                        >
                            <Text style={[
                                styles.textWhite,
                                styles.margin5,
                                styles.textBold,
                                styles.textSize18,
                            ]}
                            >
                                {locales('labels.retry')}
                            </Text>
                        </Button>
                    </View>
                    :
                    (productDetailsInfoLoading || editProductLoading) ?
                        <ScrollView style={{
                            backgroundColor: 'white',
                        }}>
                            <View>
                                <ContentLoader
                                    speed={2}
                                    width={deviceWidth}
                                    height={400}
                                    viewBox="0 0 400 400"
                                    backgroundColor="#f3f3f3"
                                    foregroundColor="#ecebeb"
                                >
                                    <Rect x="0" y="0" rx="2" ry="2" width="400" height="400" />
                                </ContentLoader>
                            </View>

                            <ShadowView style={{
                                shadowColor: 'black',
                                shadowOpacity: 0.13,
                                shadowRadius: 1,
                                shadowOffset: { width: 0, height: 2 },

                            }}>
                                <View style={{
                                    paddingTop: 20,
                                    alignItems: 'center',

                                }}>

                                    <ContentLoader
                                        speed={2}
                                        width={deviceWidth}
                                        height={124}
                                        viewBox="0 0 410 124"
                                        backgroundColor="#f3f3f3"
                                        foregroundColor="#ecebeb"
                                    >
                                        <Rect x="174" y="1" rx="3" ry="3" width="221" height="30" />
                                        <Rect x="232" y="56" rx="3" ry="3" width="163" height="47" />
                                        <Rect x="15" y="55" rx="3" ry="3" width="122" height="47" />
                                    </ContentLoader>
                                </View>
                                <View style={{
                                    paddingTop: 20,
                                    alignItems: 'center',
                                    paddingBottom: 30
                                }}>

                                    <ContentLoader
                                        speed={2}
                                        width={deviceWidth}
                                        height={350}
                                        viewBox="0 0 410 350"
                                        backgroundColor="#f3f3f3"
                                        foregroundColor="#ecebeb"
                                    >
                                        <Rect x="249" y="1" rx="3" ry="3" width="146" height="18" />
                                        <Rect x="15" y="1" rx="3" ry="3" width="133" height="18" />
                                        <Rect x="15" y="35" rx="3" ry="3" width="379" height="2" />
                                        <Rect x="207" y="52" rx="3" ry="3" width="187" height="18" />
                                        <Rect x="14" y="52" rx="3" ry="3" width="98" height="18" />
                                        <Rect x="14" y="86" rx="3" ry="3" width="379" height="2" />
                                        <Rect x="285" y="108" rx="3" ry="3" width="108" height="18" />
                                        <Rect x="13" y="108" rx="3" ry="3" width="156" height="18" />
                                        <Rect x="13" y="142" rx="3" ry="3" width="379" height="2" />
                                        <Rect x="258" y="160" rx="3" ry="3" width="134" height="18" />
                                        <Rect x="12" y="160" rx="3" ry="3" width="122" height="18" />
                                        <Rect x="12" y="194" rx="3" ry="3" width="379" height="2" />
                                        <Rect x="173" y="211" rx="3" ry="3" width="218" height="18" />
                                        <Rect x="12" y="211" rx="3" ry="3" width="99" height="18" />
                                        <Rect x="12" y="245" rx="3" ry="3" width="379" height="2" />
                                        <Rect x="223" y="267" rx="3" ry="3" width="168" height="18" />
                                        <Rect x="120" y="267" rx="3" ry="3" width="84" height="18" />
                                        <Rect x="15" y="267" rx="3" ry="3" width="83" height="18" />
                                        <Rect x="306" y="300" rx="3" ry="3" width="84" height="18" />
                                        <Rect x="155" y="300" rx="3" ry="3" width="134" height="18" />
                                        <Rect x="15" y="300" rx="3" ry="3" width="121" height="18" />
                                        <Rect x="307" y="330" rx="3" ry="3" width="84" height="18" />
                                        <Rect x="202" y="331" rx="3" ry="3" width="84" height="18" />
                                        <Rect x="15" y="330" rx="3" ry="3" width="156" height="18" />
                                    </ContentLoader>
                                </View>
                            </ShadowView>
                            <ShadowView style={{
                                marginTop: 30,
                                paddingVertical: 30,
                                shadowColor: 'black',
                                shadowOpacity: 0.13,
                                shadowRadius: 1,
                                shadowOffset: { width: 0, height: 2 },
                            }}>
                                <ContentLoader
                                    speed={2}
                                    width={deviceWidth}
                                    height={325}
                                    viewBox="0 0 476 325"
                                    backgroundColor="#f3f3f3"
                                    foregroundColor="#ecebeb"
                                >
                                    <Circle cx="237" cy="65" r="60" />
                                    <Rect x="141" y="137" rx="3" ry="3" width="185" height="20" />
                                    <Rect x="132" y="168" rx="3" ry="3" width="208" height="31" />
                                    <Rect x="25" y="225" rx="3" ry="3" width="423" height="43" />
                                    <Rect x="24" y="280" rx="3" ry="3" width="423" height="43" />
                                </ContentLoader>
                            </ShadowView>
                        </ScrollView>
                        :
                        <ScrollView
                            style={{ backgroundColor: 'white' }}
                            ref={this.wrapper}
                            refreshControl={
                                <RefreshControl
                                    refreshing={!!this.props.productDetailsInfoLoading}
                                    onRefresh={() => this.componentDidMount()}
                                />
                            }>
                            <ShadowView style={{
                                shadowColor: 'black',
                                shadowOpacity: 0.13,
                                shadowRadius: 1,
                                shadowOffset: { width: 0, height: 2 },
                            }}>
                                <ProductImages
                                    showFullSizeImage={this.showFullSizeImage}
                                    photosWithCompletePath={photosWithCompletePath}
                                />

                                <View
                                    style={{
                                        flexDirection: 'row-reverse', alignItems: 'center',
                                        marginVertical: 30, width: deviceWidth, justifyContent: 'space-between',
                                        paddingHorizontal: 15
                                    }}>
                                    <Text
                                        style={{ fontFamily: 'IRANSansWeb(FaNum)_Bold', width: '68%', fontSize: 20 }}>
                                        {product_name ? product_name : '---'}
                                    </Text>
                                    <View>
                                        <Pressable
                                            android_ripple={{
                                                color: '#ededed'
                                            }}
                                            onPress={_ => {
                                                analytics().logEvent('click_on_share_button_product');
                                                this.setState({ showContactListModal: true });
                                            }}
                                            style={{
                                                borderWidth: 0.8, borderColor: '#777777', borderRadius: 6, padding: 5,
                                                flexDirection: 'row-reverse', justifyContent: 'center', alignItems: 'center'
                                            }}>
                                            <FontAwesome name='share-alt' size={14} color='#777777' style={{ marginHorizontal: 5 }} />
                                            <Text style={{
                                                color: '#777777', fontSize: 14, marginLeft: 5,
                                                fontFamily: 'IRANSansWeb(FaNum)_Light'
                                            }}>
                                                {locales('labels.share')}
                                            </Text>

                                        </Pressable>
                                    </View>
                                </View>

                                <View style={{
                                    flexDirection: 'row-reverse', alignItems: 'center',
                                    width: deviceWidth, justifyContent: 'space-between', paddingHorizontal: 15,

                                }}>
                                    {userId == loggedInUserId ? <View style={{
                                        flexDirection: 'row', justifyContent: 'space-around',
                                        flex: 1
                                        // width: !!is_elevated ? deviceWidth * 0.88 : deviceWidth * 0.99
                                    }}>
                                        <Button
                                            style={{
                                                color: 'white',
                                                fontSize: 18,
                                                borderRadius: 5,
                                                marginLeft: !is_elevated ? 5 : 0,
                                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                                width: !!is_elevated ? '45%' : '55%',
                                                paddingRight: 40,
                                                backgroundColor: '#E41C38'
                                            }}
                                        >
                                            <Text
                                                onPress={this.navigateToPaymentType}

                                                style={[styles.buttonText, { fontFamily: 'IRANSansWeb(FaNum)_Bold' }]}>
                                                {locales('titles.elevateProduct')}</Text>
                                            <FontAwesome5
                                                name='chart-line' size={25} color='white' style={{ position: 'absolute', right: 15 }} />
                                        </Button>
                                        <Button
                                            style={{
                                                color: 'white',
                                                fontSize: 18,
                                                borderRadius: 5,
                                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                                width: '40%',
                                                paddingRight: 15,
                                                backgroundColor: '#000546'
                                            }}
                                        >
                                            <Text onPress={() => this.setState({ editionFlag: true })} style={[styles.buttonText, { fontFamily: 'IRANSansWeb(FaNum)_Bold' }]}>{locales('titles.edit')}</Text>
                                            <FontAwesome name='pencil' size={23} color='white' style={{ position: 'absolute', right: 15 }} />
                                        </Button>
                                    </View> :
                                        null
                                    }


                                    {(is_elevated && loggedInUserId == userId) ? <FontAwesome5
                                        onPress={() => Toast.show({
                                            text: locales('titles.elevatorHasAdded'),
                                            position: "bottom",
                                            style: { borderRadius: 10, bottom: 100, width: '90%', alignSelf: 'center' },
                                            textStyle: { fontFamily: 'IRANSansWeb(FaNum)_Light', textAlign: 'center' },
                                            duration: 3000
                                        })} name='chart-line' size={25} color='white'
                                        style={{ backgroundColor: '#7E7E7E', borderRadius: 4, padding: 10, elevation: 1 }} />
                                        : null
                                    }
                                </View>

                                <View style={{
                                    flexDirection: 'row-reverse', alignItems: 'center', borderBottomColor: '#F1F1F1',
                                    borderBottomWidth: 0.7, paddingVertical: 15,
                                    marginVertical: 10, width: deviceWidth * 0.9, alignSelf: 'center',
                                    justifyContent: 'space-between', paddingHorizontal: 10
                                }}>

                                    <View style={{
                                        flexDirection: 'row-reverse', alignItems: 'center', borderBottomColor: '#BEBEBE',
                                        justifyContent: 'space-between',
                                    }}>
                                        <FontAwesome5
                                            name='folder'
                                            color='#777777'
                                            solid
                                            size={20}
                                            style={{ textAlign: 'center', width: 23 }}
                                        />
                                        <Text style={{
                                            color: '#777777', fontSize: 18,
                                            textAlignVertical: 'center',
                                            marginHorizontal: 7,
                                            fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                        }}>
                                            {locales('titles.category')}
                                        </Text>
                                    </View>
                                    <Text style={{ fontSize: 16, fontFamily: 'IRANSansWeb(FaNum)_Bold' }}>{sub_category_name}</Text>
                                </View>

                                <View style={{
                                    flexDirection: 'row-reverse', alignItems: 'center', borderBottomColor: '#F1F1F1',
                                    borderBottomWidth: 0.7, paddingTop: 5, paddingBottom: 20,
                                    marginVertical: 10, width: deviceWidth * 0.9, alignSelf: 'center',
                                    justifyContent: 'space-between', paddingHorizontal: 10
                                }}>
                                    <View style={{
                                        flexDirection: 'row-reverse', alignItems: 'center', borderBottomColor: '#BEBEBE',
                                        justifyContent: 'space-between',
                                    }}>
                                        <FontAwesome5
                                            name='map-marker-alt'
                                            color='#777777'
                                            style={{ textAlign: 'center', width: 23 }}
                                            solid
                                            size={20}
                                        />
                                        <Text style={{ color: '#777777', fontSize: 16, marginHorizontal: 7, fontFamily: 'IRANSansWeb(FaNum)_Medium' }}>
                                            {locales('titles.province/city')}
                                        </Text>
                                    </View>
                                    <Text style={{ fontSize: 16, fontFamily: 'IRANSansWeb(FaNum)_Bold' }}>
                                        {`${province_name || '---'}-${city_name || '==='}`}
                                    </Text>
                                </View>

                                <View style={{
                                    flexDirection: 'row-reverse', alignItems: 'center', borderBottomColor: '#F1F1F1',
                                    borderBottomWidth: 0.7, paddingTop: 5, paddingBottom: 20,
                                    marginVertical: 10, width: deviceWidth * 0.9, alignSelf: 'center',
                                    justifyContent: 'space-between', paddingHorizontal: 10
                                }}>
                                    <View style={{
                                        flexDirection: 'row-reverse', alignItems: 'center', borderBottomColor: '#BEBEBE',
                                        justifyContent: 'space-between',
                                    }}>
                                        <FontAwesome5
                                            name='box-open'
                                            color='#777777'
                                            solid
                                            style={{ textAlign: 'center', width: 23 }}
                                            size={18}
                                        />
                                        <Text style={{ color: '#777777', fontSize: 18, marginHorizontal: 7, fontFamily: 'IRANSansWeb(FaNum)_Medium' }}>
                                            {locales('titles.stockQuantity')}
                                        </Text>
                                    </View>
                                    <Text style={{ fontSize: 16, fontFamily: 'IRANSansWeb(FaNum)_Bold' }}>{formatter.convertedNumbersToTonUnit(stock)} </Text>
                                </View>

                                <View style={{
                                    flexDirection: 'row-reverse', alignItems: 'center', borderBottomColor: '#F1F1F1',
                                    borderBottomWidth: 0.7, paddingTop: 5, paddingBottom: 20,
                                    marginVertical: 10, width: deviceWidth * 0.9, alignSelf: 'center',
                                    justifyContent: 'space-between', paddingHorizontal: 10
                                }}>
                                    <View style={{
                                        flexDirection: 'row-reverse', alignItems: 'center', borderBottomColor: '#BEBEBE',
                                        justifyContent: 'space-between',
                                    }}>
                                        <FontAwesome5
                                            name='clipboard-check'
                                            color='#777777'
                                            solid
                                            style={{ textAlign: 'center', width: 23 }}
                                            size={20}
                                        />
                                        <Text style={{
                                            color: '#777777', fontSize: 18, marginHorizontal: 7, fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                        }}>
                                            {locales('titles.minOrder')}
                                        </Text>
                                    </View>
                                    <Text style={{ fontSize: 16, fontFamily: 'IRANSansWeb(FaNum)_Bold' }}>
                                        {formatter.convertedNumbersToTonUnit(min_sale_amount)}
                                    </Text>
                                </View>

                                <View style={{
                                    flexDirection: 'row-reverse', alignItems: 'center', borderBottomColor: '#F1F1F1',
                                    borderBottomWidth: 0.7, paddingTop: 5, paddingBottom: 20,
                                    marginVertical: 10, width: deviceWidth * 0.9, alignSelf: 'center',
                                    justifyContent: 'space-between', paddingHorizontal: 10
                                }}>
                                    <View style={{
                                        flexDirection: 'row-reverse', alignItems: 'center', borderBottomColor: '#BEBEBE',
                                        justifyContent: 'space-between',
                                    }}>
                                        <FontAwesome5
                                            name='dollar-sign'
                                            color='#777777'
                                            solid
                                            style={{ textAlign: 'center', width: 23 }}
                                            size={20}
                                        />
                                        <Text style={{ color: '#777777', fontSize: 18, marginHorizontal: 7, fontFamily: 'IRANSansWeb(FaNum)_Medium', }}>
                                            {locales('titles.price')}
                                        </Text>
                                    </View>
                                    <Text style={{ fontSize: 16, fontFamily: 'IRANSansWeb(FaNum)_Bold' }}>{locales('titles.achiveThePrice')}</Text>
                                </View>

                                <View

                                    style={{
                                        paddingVertical: 5,
                                        marginVertical: 10, width: deviceWidth * 0.97,
                                        paddingHorizontal: 10
                                    }}>
                                    <Text style={{ fontSize: 18, fontFamily: 'IRANSansWeb(FaNum)_Bold', marginBottom: 15 }}>
                                        {locales('titles.headerDescription')}
                                    </Text>
                                    <Text style={{
                                        fontSize: 16, color: '#777777', marginBottom: 20,
                                        fontFamily: 'IRANSansWeb(FaNum)_Light',
                                    }}>{descriptionWithoutHtml ? descriptionWithoutHtml : '---'}</Text>
                                </View>

                                <Pressable
                                    android_ripple={{
                                        color: '#ededed'
                                    }}
                                    onPress={() => {
                                        analytics().logEvent('click_on_profile_from_product_details');
                                        this.props.navigation.navigate('Profile', { user_name });
                                    }}
                                    style={{
                                        width: deviceWidth * 0.95,
                                        alignSelf: 'center',
                                        marginBottom: 30,
                                        borderRadius: 12,
                                        borderColor: active_pakage_type == 3 ? '#00C569' : '#E9ECEF',
                                        borderWidth: 1,
                                        backgroundColor: 'white',
                                        paddingHorizontal: 10,
                                        paddingVertical: 25
                                    }}
                                >
                                    <View
                                        style={{
                                            flexDirection: 'row-reverse',
                                            justifyContent: 'space-around',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <View>
                                            <Image
                                                style={{ width: deviceWidth * 0.15, height: deviceWidth * 0.15, borderRadius: deviceWidth * 0.075 }}
                                                source={profile_photo ? { uri: `${REACT_APP_API_ENDPOINT_RELEASE}/storage/${profile_photo}` }
                                                    : require('../../../assets/icons/user.png')}
                                            />
                                            {active_pakage_type == 3 ?
                                                <Svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                                    width="25"
                                                    height="25"
                                                    viewBox="0 0 39 39"
                                                    style={{
                                                        bottom: 12,
                                                        left: 19,
                                                    }}
                                                >
                                                    <Defs>
                                                        <Pattern
                                                            id="pattern"
                                                            width="100%"
                                                            height="100%"
                                                            preserveAspectRatio="xMidYMid slice"
                                                            viewBox="0 0 362 361"
                                                        >
                                                            <SvgImage
                                                                width="362"
                                                                height="361"
                                                                xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAWoAAAFpCAYAAAC1TGJNAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA25pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo5N2NmOWU2Yi03NmI5LWM3NDYtOTk4OS01OWY5NmI4Zjc0NTYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MTlCQTA1RDBDRTMzMTFFOUFCNjlFNjkxRERGREZFRDAiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MTlCQTA1Q0ZDRTMzMTFFOUFCNjlFNjkxRERGREZFRDAiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OTY1NkQyREI1RUFEMTFFOUIxQjRBN0UyMTA3RkM4NEQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OTY1NkQyREM1RUFEMTFFOUIxQjRBN0UyMTA3RkM4NEQiLz4gPC9yZGY6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"
                                                            ></SvgImage>
                                                        </Pattern>
                                                    </Defs>
                                                    <G data-name="valid icon" transform="translate(0.848 1)">
                                                        <SvgCircle
                                                            cx="19.5"
                                                            cy="19.5"
                                                            r="19.5"
                                                            fill="#00c569"
                                                            data-name="Ellipse 7"
                                                            transform="translate(-0.848 -1)"
                                                        ></SvgCircle>
                                                        <SvgPath
                                                            fill="url(#pattern)"
                                                            d="M0 0H28.078V28H0z"
                                                            transform="translate(4.153 4)"
                                                        ></SvgPath>
                                                    </G>
                                                </Svg>
                                                : null}
                                        </View>

                                        <View style={{
                                            justifyContent: 'center',
                                            alignItems: 'flex-end',
                                            width: '80%',
                                            marginHorizontal: 10
                                        }}
                                        >
                                            <View style={{
                                                flexDirection: 'row-reverse', justifyContent: 'flex-start',
                                                width: '100%',
                                            }}>
                                                <Text
                                                    numberOfLines={1}
                                                    style={{
                                                        textAlign: 'right',
                                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                                        fontSize: 18,
                                                        marginLeft: 3,
                                                        maxWidth: '88%',
                                                        color: '#474747',
                                                    }}>
                                                    {`${first_name} ${last_name}`}
                                                </Text>
                                                {is_verified ? <ValidatedUserIcon {...this.props} /> : null}
                                            </View>
                                            {response_rate > 0 ? <Text style={{
                                                textAlign: 'right', width: '100%', marginVertical: 7,
                                                fontFamily: 'IRANSansWeb(FaNum)_Medium', fontSize: 14, color: '#777777'
                                            }}>
                                                {locales('labels.responseRate')} <Text style={{
                                                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                                    fontSize: 14, color: '#e41c38'
                                                }}>
                                                    {response_rate}%
                                                </Text>
                                            </Text> : null}

                                            {active_pakage_type == 3 ?
                                                <Text
                                                    style={{
                                                        fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                                        fontSize: 15, color: '#00C569', textAlign: 'right'
                                                    }}
                                                >
                                                    {locales('labels.specialSeller')}
                                                </Text>
                                                :
                                                <Text
                                                    style={{
                                                        fontFamily: 'IRANSansWeb(FaNum)_Light',
                                                        fontSize: 15, color: '#777777'
                                                    }}
                                                >
                                                    {locales('labels.seller')}
                                                </Text>
                                            }
                                        </View>

                                        <View style={{
                                            flexDirection: 'row-reverse',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            position: 'absolute',
                                            right: 0
                                        }}
                                        >
                                            <Text style={{
                                                textAlign: 'center',
                                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                                fontSize: 14,
                                                marginHorizontal: 3,
                                                color: '#00C569',
                                            }}>
                                                {locales('titles.seeProfile')}
                                            </Text>
                                            <FontAwesome5
                                                color='#00C569'
                                                size={16}
                                                name='angle-left'
                                            />
                                        </View>
                                    </View>

                                    {(avg_score > 0) ? <View style={{
                                        flex: 1,
                                        marginVertical: 10,
                                        borderRadius: 4, borderWidth: 0.8, borderColor: '#F2F2F2',
                                        overflow: 'hidden',
                                        alignSelf: 'center', justifyContent: 'center', flexDirection: 'row-reverse', alignItems: 'center',
                                    }}>
                                        <View style={{
                                            backgroundColor: '#FAFAFA',
                                            padding: 5,
                                            justifyContent: 'center', flexDirection: 'row-reverse', alignItems: 'center',
                                        }}>
                                            <Text style={{
                                                fontSize: 20, marginHorizontal: 10,
                                                fontFamily: 'IRANSansWeb(FaNum)_Light',
                                                color: '#777777', paddingHorizontal: 5
                                            }}
                                            >
                                                {avg_score}
                                            </Text>
                                            <StarRating
                                                starsCount={5}
                                                defaultRate={avg_score}
                                                disable={true}
                                                color='#FFBB00'
                                                size={25}
                                            />
                                        </View>
                                        <View style={{
                                            width: 120,

                                            justifyContent: 'center', flexDirection: 'row-reverse', alignItems: 'center',
                                        }}
                                        >
                                            <Text style={{
                                                fontSize: 16, color: '#777777', paddingVertical: 2,
                                                fontFamily: 'IRANSansWeb(FaNum)_Light',
                                            }}>
                                                {total_count} {locales('labels.comment')}
                                            </Text>
                                        </View>
                                    </View> : null}

                                </Pressable>


                                <Pressable
                                    android_ripple={{
                                        color: '#ededed'
                                    }}
                                    activeOpacity={1}
                                    onPress={() => {
                                        return Linking.canOpenURL(`${REACT_APP_API_ENDPOINT_BLOG_RELEASE}/راهنمای-خرید-امن`).then(supported => {
                                            if (supported) {
                                                Linking.openURL(`${REACT_APP_API_ENDPOINT_BLOG_RELEASE}/راهنمای-خرید-امن`);
                                            }
                                        });
                                    }}
                                    style={{
                                        backgroundColor: '#F5FBFF',
                                        borderRadius: 12,
                                        alignSelf: 'center',
                                        padding: 20,
                                        width: deviceWidth * 0.95
                                    }}
                                >

                                    <View
                                        style={{
                                            flexDirection: 'row-reverse',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <FontAwesome5
                                            color='#404B55'
                                            size={25}
                                            solid
                                            name='question-circle'
                                        />
                                        <Text
                                            style={{
                                                color: '#404B55',
                                                marginHorizontal: 5,
                                                fontSize: 18,
                                                fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                            }}
                                        >
                                            {locales('titles.safeShopHelp')}
                                        </Text>
                                    </View>
                                    <Text
                                        style={{
                                            marginVertical: 15,
                                            color: '#666666',
                                            fontSize: 16,
                                            fontFamily: 'IRANSansWeb(FaNum)_Light',
                                        }}
                                    >
                                        {locales('labels.safeShopDescription')}
                                        <Text
                                            style={{
                                                marginVertical: 15,
                                                color: '#00C569',
                                                fontSize: 16,
                                                fontFamily: 'IRANSansWeb(FaNum)_Light',
                                            }}
                                        >
                                            {` ${locales('titles.safeShopHelp')} `}
                                        </Text>
                                        <Text
                                            style={{
                                                marginVertical: 15,
                                                color: '#666666',
                                                fontSize: 16,
                                                fontFamily: 'IRANSansWeb(FaNum)_Light',
                                            }}
                                        >
                                            {locales('labels.tradeComfortabely')}
                                        </Text>
                                    </Text>
                                </Pressable>


                                <View
                                    style={{
                                        marginTop: 30
                                    }}
                                >
                                    <View style={{ width: deviceWidth, alignItems: 'flex-end' }}>
                                        <Text style={{
                                            fontSize: 20, color: '#313A43', paddingHorizontal: 20,
                                            fontFamily: 'IRANSansWeb(FaNum)_Light',
                                        }}>
                                            {locales('labels.relatedProducts')}
                                        </Text>
                                        <View
                                            style={{
                                                backgroundColor: '#00C569',
                                                height: 3,
                                                width: 100,
                                                marginVertical: 10,
                                                marginHorizontal: 20
                                            }}
                                        >
                                        </View>
                                    </View>
                                    <RelatedProductsList
                                        {...this.props}
                                        relatedProductsArray={related_products}
                                    />
                                </View>

                            </ShadowView>


                            {/* <View style={{ marginVertical: 30 }}>
                            <Card>
                                <CardItem style={{ borderWidth: active_pakage_type == 3 ? 1 : 0, borderColor: '#00C569' }}>
                                    <Body>
                                        <View style={{ width: deviceWidth, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                                            <Image
                                                style={{ width: deviceWidth * 0.35, height: deviceWidth * 0.35, borderRadius: deviceWidth * 0.175 }}
                                                source={profile_photo ? { uri: `${REACT_APP_API_ENDPOINT_RELEASE}/storage/${profile_photo}` }
                                                    : require('../../../assets/icons/user.png')}
                                            />
                                            {active_pakage_type == 3 ?
                                                // <Image source={require('../../../assets/icons/valid_user.png')}
                                                //     style={{ bottom: 18, left: 3 }} />
                                                <Svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                                    width="39"
                                                    height="39"
                                                    viewBox="0 0 39 39"
                                                    style={{
                                                        bottom: 18,
                                                    }}
                                                >
                                                    <Defs>
                                                        <Pattern
                                                            id="pattern"
                                                            width="100%"
                                                            height="100%"
                                                            preserveAspectRatio="xMidYMid slice"
                                                            viewBox="0 0 362 361"
                                                        >
                                                            <SvgImage
                                                                width="362"
                                                                height="361"
                                                                xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAWoAAAFpCAYAAAC1TGJNAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA25pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo5N2NmOWU2Yi03NmI5LWM3NDYtOTk4OS01OWY5NmI4Zjc0NTYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MTlCQTA1RDBDRTMzMTFFOUFCNjlFNjkxRERGREZFRDAiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MTlCQTA1Q0ZDRTMzMTFFOUFCNjlFNjkxRERGREZFRDAiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OTY1NkQyREI1RUFEMTFFOUIxQjRBN0UyMTA3RkM4NEQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OTY1NkQyREM1RUFEMTFFOUIxQjRBN0UyMTA3RkM4NEQiLz4gPC9yZGY6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"
                                                            ></SvgImage>
                                                        </Pattern>
                                                    </Defs>
                                                    <G data-name="valid icon" transform="translate(0.848 1)">
                                                        <SvgCircle
                                                            cx="19.5"
                                                            cy="19.5"
                                                            r="19.5"
                                                            fill="#00c569"
                                                            data-name="Ellipse 7"
                                                            transform="translate(-0.848 -1)"
                                                        ></SvgCircle>
                                                        <SvgPath
                                                            fill="url(#pattern)"
                                                            d="M0 0H28.078V28H0z"
                                                            transform="translate(4.153 4)"
                                                        ></SvgPath>
                                                    </G>
                                                </Svg>
                                                : null}
                                        </View>
                                        <View
                                            style={{
                                                top: active_pakage_type == 3 ? -20 : 0,
                                                width: deviceWidth, alignItems: 'center', justifyContent: 'center', alignSelf: 'center'
                                            }}>
                                            <Text style={{
                                                color: '#777777', textAlign: 'center', width: '100%',
                                                fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 14
                                            }}>
                                                {locales('labels.seller')}
                                            </Text>

                                            <View style={{ flexDirection: 'row-reverse', width: '100%', justifyContent: 'center' }}>
                                                <Text style={{
                                                    textAlign: 'center',
                                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                                    fontSize: 18,
                                                    color: '#474747',
                                                }}>
                                                    {`${first_name} ${last_name}`}
                                                </Text>
                                                {is_verified ? <ValidatedUserIcon {...this.props} /> : null}
                                            </View>

                                            {active_pakage_type == 3 ? <Text style={{
                                                color: '#00C569', textAlign: 'center', width: '100%', fontFamily: 'IRANSansWeb(FaNum)_Medium', fontSize: 15
                                            }}>
                                                {locales('labels.confirmedUser')}
                                            </Text> : null}

                                            {response_rate > 0 ? <Text style={{
                                                textAlign: 'center', width: '100%',
                                                fontFamily: 'IRANSansWeb(FaNum)_Medium', fontSize: 15, color: '#777777'
                                            }}>
                                                {locales('labels.responseRate')} <Text style={{ fontFamily: 'IRANSansWeb(FaNum)_Medium', fontSize: 15, color: '#e41c38' }}>%{response_rate}</Text>
                                            </Text> : null}
                                        </View>
                                        <Button
                                            onPress={() => {
                                                this.props.navigation.navigate({ name: 'Profile', params: { user_name }, key: null, index: 0 })
                                            }}
                                            style={[styles.loginButton, {
                                                borderWidth: 1,
                                                borderColor: '#00C569',
                                                backgroundColor: 'white',
                                                alignSelf: 'center',
                                                maxWidth: 230
                                            }]}
                                        >
                                            <Text style={[styles.buttonText, { fontSize: 16, color: '#00C569' }]}>
                                                {locales('titles.seeProfile')}</Text>
                                        </Button>
                                        <Button
                                            onPress={() => {
                                                if (userId == loggedInUserId) {
                                                    this.props.navigation.navigate('MyBuskool', { screen: 'EditProfile' })
                                                }
                                                else {
                                                    if (this.props.route.params.productId)
                                                        analytics().logEvent('open_chat', {
                                                            product_id: this.props.route.params.productId
                                                        });
                                                    this.props.navigation.navigate('Chat', { contact: selectedContact, profile_photo })
                                                }
                                            }
                                            }
                                            style={[styles.loginButton, {
                                                alignSelf: 'center',
                                                maxWidth: 230
                                            }]}
                                        >

                                            <Text style={[styles.buttonText, { fontSize: 16, color: '#fff' }]}>
                                                {loggedInUserId == userId ? locales('titles.editProfile') : locales('titles.sendMessage')}</Text>
                                        </Button>
                                    </Body>
                                </CardItem>
                            </Card>

                            <View style={{ marginTop: 15 }}>
                                <Card>
                                    <CardItem>
                                        <Body>
                                            <Text
                                                onPress={() => {
                                                    return Linking.canOpenURL(`${REACT_APP_API_ENDPOINT_BLOG_RELEASE}/راهنمای-خرید-امن`).then(supported => {
                                                        if (supported) {
                                                            Linking.openURL(`${REACT_APP_API_ENDPOINT_BLOG_RELEASE}/راهنمای-خرید-امن`);
                                                        }
                                                    });
                                                }}
                                                style={{ color: '#777777', textAlign: 'center', fontSize: 16 }}>
                                                {locales('labels.buskoolSmallTerms')} <Text style={{ color: '#00C569' }}>{locales('labels.safeShop')}</Text> , {locales('labels.dealEasier')}
                                            </Text>
                                        </Body>
                                    </CardItem>
                                </Card>
                            </View>

                        </View>
                     */}

                        </ScrollView>
                }
                {
                    productDetailsInfoFailed || productDetailsInfoError ? null :
                        !this.props.productDetailsInfoLoading && userId != loggedInUserId ?
                            <ShadowView style={{
                                width: '100%',
                                height: 65,
                                shadowColor: 'black',
                                shadowOpacity: 0.13,
                                backgroundColor: 'white',
                                shadowRadius: 1,
                                shadowOffset: { width: 0, height: 2 },
                                flexDirection: 'row-reverse',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }} >
                                {(has_phone && !is_seller) ?
                                    <Button
                                        onPress={() => {
                                            analytics().logEvent('click_on_call_info_button_product');
                                            this.fetchContactInfo(productIdFromProductDetails, userId);
                                        }}
                                        style={[styles.loginButton, {
                                            alignItems: 'center',
                                            width: '45%',
                                            justifyContent: 'center',
                                            backgroundColor: isContactInfoShown ? '#E0E0E0' : '#00C569'
                                            // width: !!is_elevated ? '50%' : '46%'
                                        }]}
                                    >
                                        <View style={[styles.textCenterView, styles.buttonText]}>
                                            {!sellerMobileNumberLoading ? <Text style={[styles.textWhite, styles.margin5, { marginTop: 7 }]}>
                                                <FontAwesome5 solid name='phone-square-alt'
                                                    size={20} />
                                            </Text> :
                                                <ActivityIndicator
                                                    animating={true}
                                                    size={20}
                                                    color='white'
                                                />
                                            }
                                            <Text style={[styles.textWhite, styles.margin5, styles.textBold, styles.textSize18]}>
                                                {locales('labels.contactInfo')}
                                            </Text>
                                        </View>
                                    </Button>
                                    : null}
                                <Button
                                    onPress={this.openChat}
                                    style={[styles.loginButton, {
                                        zIndex: 1,
                                        width: (!is_seller && has_phone) ? '45%' : '95%',
                                        backgroundColor: (!is_seller && has_phone) ? 'white' : '#FF5722',
                                        borderColor: (!is_seller && has_phone) ? '#556080' : '#FF5722',
                                        borderWidth: (!is_seller && has_phone) ? 1 : 0,
                                    }]}
                                >
                                    <View style={[styles.textCenterView, styles.buttonText]}>
                                        <Text style={[styles.textWhite, styles.margin5, {
                                            marginTop: 7,
                                            color: (!is_seller && has_phone) ? '#556080' : 'white',
                                        }]}>
                                            <FontAwesome5 solid name='comment-alt' size={20} />
                                        </Text>
                                        <Text style={[styles.textWhite, styles.margin5, styles.textBold, styles.textSize18,
                                        {
                                            color: (!is_seller && has_phone) ? '#556080' : 'white',
                                        }
                                        ]}>
                                            {(!is_seller && has_phone) ? locales('labels.chat') : locales('labels.chatWithSeller')}
                                        </Text>
                                    </View>

                                </Button>
                            </ShadowView>
                            : null
                }
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
    deletationSuccessfullContainer: {
        backgroundColor: '#00C569',
        padding: 10,
        borderRadius: 5
    },
    deletationSuccessfullText: {
        textAlign: 'center',
        width: deviceWidth,
        color: 'white'
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
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
        justifyContent: 'center',
        elevation: 0
    },
    fontAwesomeEnvelope: {
        color: "#fff",
        margin: '15px'
    },
    textWhite: {
        color: "#fff"
    },
    textCenterView: {
        justifyContent: 'center',
        flexDirection: "row-reverse",
    },
    textBold: {
        fontFamily: 'IRANSansWeb(FaNum)_Bold'
    },
    loginButton: {
        textAlign: 'center',
        margin: 10,
        borderRadius: 4,
        backgroundColor: '#00C569',
        color: 'white',
        elevation: 0
    },
    dialogWrapper: {
        borderRadius: 12,
        padding: 0,
        margin: 0,
        overflow: "hidden"
    },
    dialogHeader: {
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5',
        padding: 0,
        margin: 0,
        position: 'relative',
    },
    closeDialogModal: {
        position: "absolute",
        top: 0,
        right: 0,
        padding: 15,
        height: '100%',
        backgroundColor: 'transparent',
        elevation: 0
    },
    headerTextDialogModal: {
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
        textAlign: 'center',
        fontSize: 17,
        paddingTop: 11,
        color: '#474747'
    },
    mainWrapperTextDialogModal: {
        width: '100%',
        marginBottom: 0
    },
    mainTextDialogModal: {
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
        color: '#777',
        textAlign: 'center',
        fontSize: 15,
        paddingHorizontal: 15,
        width: '100%'
    },
    modalButton: {
        textAlign: 'center',
        width: '100%',
        fontSize: 16,
        maxWidth: 145,
        marginVertical: 10,
        color: 'white',
        alignItems: 'center',
        borderRadius: 5,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    modalCloseButton: {
        textAlign: 'center',
        width: '100%',
        fontSize: 16,
        color: 'white',
        alignItems: 'center',
        alignSelf: 'flex-start',
        justifyContent: 'center',
        elevation: 0,
        borderRadius: 0,
        backgroundColor: '#ddd',
        marginTop: 10
    },
    closeButtonText: {
        fontFamily: 'IRANSansWeb(FaNum)_Bold',
        color: '#555',
    },
    dialogIcon: {

        height: 80,
        width: 80,
        textAlign: 'center',
        borderWidth: 4,
        borderRadius: 80,
        paddingTop: 5,
        marginTop: 20

    },
    greenButton: {
        backgroundColor: '#00C569',
    },
    forgotContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    forgotPassword: {
        textAlign: 'center',
        color: '#7E7E7E',
        fontSize: 16,
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
        paddingVertical: 5,
    },
    userText: {
        flexWrap: 'wrap',
        paddingTop: '3%',
        fontSize: 20,
        padding: 20,
        textAlign: 'center',
        color: '#7E7E7E'
    },
    marginTop5: {
        marginTop: 5
    },
    marginTop10: {
        marginTop: 10
    },
    margin5: {
        margin: 5
    },
    margin10: {
        margin: 10
    },
    textSize15: {
        fontSize: 15
    },
    textSize18: {
        fontSize: 18
    },
    textSize20: {
        fontSize: 20
    },
});

const mapStateToProps = (state) => {
    const {
        profileReducer,
        authReducer,
        productsListReducer,
        buyAdRequestReducer,
    } = state;

    const {
        productDetails,
        productDetailsError,
        productDetailsFailed,
        productDetailsMessage,
        productDetailsLoading,
        productDetailsStatus,


        relatedProductsLoading,
        relatedProductsFailed,
        relatedProductsError,
        relatedProductsMessage,
        relatedProductsObject,
        relatedProductsArray,

        productDetailsInfo,
        productDetailsInfoLoading,

        editProductStatus,
        editProductMessage,
        editProductLoading,

        sellerMobileNumberLoading,
        productDetailsInfoError,
        productDetailsInfoFailed,

    } = productsListReducer;

    const {
        userProfile,


        walletElevatorPayFailed,
        walletElevatorPayError,
        walletElevatorPayMessage,
        walletElevatorPay,
    } = profileReducer;

    const {
        loggedInUserId
    } = authReducer;


    return {
        productDetails,
        productDetailsError,
        productDetailsFailed,
        productDetailsMessage,
        productDetailsLoading,
        productDetailsStatus,

        relatedProductsLoading,
        relatedProductsFailed,
        relatedProductsError,
        relatedProductsMessage,
        relatedProductsObject,
        relatedProductsArray,


        productDetailsInfo,
        productDetailsInfoLoading,
        productDetailsInfoError,
        productDetailsInfoFailed,

        editProductStatus,
        editProductMessage,
        editProductLoading,

        loggedInUserId,

        userProfile,

        sellerMobileNumberLoading,


        walletElevatorPayFailed,
        walletElevatorPayError,
        walletElevatorPayMessage,
        walletElevatorPay,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllRelatedProducts: id => dispatch(productListActions.fetchAllRelatedProducts(id)),
        editProduct: product => dispatch(productListActions.editProduct(product)),
        fetchAllProductInfo: id => dispatch(productListActions.fetchAllProductInfo(id)),
        fetchSellerMobileNumber: contactInfoObject => dispatch(productListActions.fetchSellerMobileNumber(contactInfoObject)),
        walletElevatorPay: productId => dispatch(profileActions.walletElevatorPay(productId)),
        fetchUserProfile: _ => dispatch(profileActions.fetchUserProfile()),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetails)
