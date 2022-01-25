import React, { Fragment } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View, StyleSheet, BackHandler, ActivityIndicator, ScrollView } from 'react-native'
import { connect } from 'react-redux';
import analytics from '@react-native-firebase/analytics';

import * as productActions from '../../redux/registerProduct/actions';
import * as profileActions from '../../redux/profile/actions';

import ProductMoreDetails from './Steps/ProductMoreDetails';
import SelectCategory from './Steps/SelectCategory';
import StockAndPrice from './Steps/StockAndPrice';
import GuidToRegisterProduct from './Steps/GuidToRegisterProduct';
import ChooseCity from './Steps/ChooseCity';
import ProductImages from './Steps/ProductImages';
import RegisterProductSuccessfully from './RegisterProductSuccessfully';
import ProductDescription from './Steps/ProductDescription';
import PaymentModal from '../../components/paymentModal';
import { deviceWidth, deviceHeight } from '../../utils';
import LinearGradient from 'react-native-linear-gradient';

let stepsArray = [1, 2, 3, 4, 5, 6];
class RegisterProduct extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            paymentModalVisibility: false,
            product: {
                product_name: "",
                stock: "",
                min_sale_price: "",
                max_sale_price: "",
                min_sale_amount: "",
                description: "",
                address: "",
                category_id: "",
                city_id: "",
                rules: true
            },
            productFiles: [],
            successfullAlert: false,
            productFields: [
                "product_name",
                "stock",
                "min_sale_price",
                "max_sale_price",
                "min_sale_amount",
                "description",
                "address",
                "category_id",
                "city_id"
            ],
            productType: '',
            category: '',
            detailsArray: [],
            subCategory: '',
            minimumOrder: "",
            maximumPrice: "",
            minimumPrice: "",
            images: [],
            amount: '',
            city: '',
            description: '',
            province: '',
            stepNumber: 5,
            subCategoryName: '',
            subCategoryId: null,

            selectedButton: null,
            showDialog: false,
            loaded: false,
            parentList: [],
            uploadPercentage: 0
        }
    }

    isComponentMounted = false;
    mainContainer = React.createRef();

    componentDidMount() {
        this.isComponentMounted = true;
        if (this.isComponentMounted) {
            BackHandler.addEventListener('hardwareBackPress', this.handleHardWareBackButtonPressed)
            analytics().logEvent('register_product');
            this.props.fetchUserProfile();
            // global.resetRegisterProduct = data => {
            //     if (data) {
            //         this.changeStep(0);
            //     }
            // }



            if (this.props.resetTab) {
                this.changeStep(1);
                this.props.resetRegisterProduct(false);
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {

        const { stepNumber } = this.state;

        if (this.props.resetTab) {
            this.props.resetRegisterProduct(false);
            this.changeStep(1);
        }

        if (this.props.resetTab && stepNumber == 8) {
            this.props.resetRegisterProduct(false);
            this.setState({ stepNumber: 1 })
        }
    }

    componentWillUnmount() {
        this.isComponentMounted = false;
        this.setState({ successfullAlert: false })
        BackHandler.removeEventListener('hardwareBackPress', this.handleHardWareBackButtonPressed);
    }

    handleHardWareBackButtonPressed = _ => {
        if (this.state.stepNumber > 2) {
            this.setState({ stepNumber: this.state.stepNumber - 1 })
            return true;
        }
    };

    changeStep = stepNumber => {
        this.setState({ stepNumber });
    };

    setProductType = (productType, category, subCategory, subCategoryName, parentList) => {
        AsyncStorage.setItem('@registerProductParams', JSON.stringify({ subCategoryId: subCategory, subCategoryName }))
        this.setState({ productType, category, subCategory, subCategoryId: subCategory, subCategoryName, stepNumber: 3, parentList });
    };

    setStockAndPrice = (minimumOrder, maximumPrice, minimumPrice, amount) => {
        this.setState({ minimumOrder, maximumPrice, minimumPrice, amount, stepNumber: 4 });
    };

    setCityAndProvice = (city, province) => {
        this.setState({ city, province, stepNumber: 5 });
    };

    setProductImages = images => {
        this.setState({ productFiles: images, images, stepNumber: 6 });
    };

    setProductDescription = description => {
        this.setState({ description, stepNumber: 7 });
    };

    getItemDescription = (itemKey, defaultFieldsOptions) => {
        return defaultFieldsOptions.find((item) => itemKey == item.name).description;
    };

    setDetailsArray = (detailsArray, defaultArray, defaultFieldsOptions) => {
        const { productType } = this.state;
        let description = '<hr/>';
        let temp = 'برای اطلاع از قیمت روز ' + productType + ' و خرید مستقیم پیام ارسال کنید.' + '<hr/>';
        this.setState({ description: this.state.description.replace(temp, "") })
        description = description + temp;


        for (let i = 0; i < detailsArray.length; i++) {
            if (detailsArray[i].itemValue) {
                let itemDescription = this.getItemDescription(detailsArray[i].itemKey, defaultFieldsOptions);
                itemDescription = itemDescription + ' : ' + detailsArray[i].itemValue + '<hr/>';
                this.setState({ description: this.state.description.replace(itemDescription, "") })
                description = description + itemDescription;
            }
        }



        temp = 'مقدار موجودی آماده فروش برای این محصول : ' + this.state.amount + ' کیلوگرم' + '<hr/>';
        this.setState({ description: this.state.description.replace(temp, "") })
        description = description + temp;


        temp = 'حداقل مقدار فروش این محصول توسط فروشنده در یک معامله : ' + this.state.minimumOrder + ' کیلوگرم' + '<hr/>';
        this.setState({ description: this.state.description.replace(temp, "") })
        description = description + temp;

        this.setState({ description: this.state.description + description }, () => {
            return this.submitAllSteps();
        })


    };

    toLatinNumbers = (num) => {
        if (num == null) {
            return null;
        }

        num = num.toString().replace(/^0+/, "");
        num = num.toString().replace(/^\u0660+/, "");
        num = num.toString().replace(/^\u06f0+/, "");

        return num
            .toString()
            .replace(/[\u0660-\u0669]/g, function (c) {
                return c.charCodeAt(0) - 0x0660;
            })
            .replace(/[\u06f0-\u06f9]/g, function (c) {
                return c.charCodeAt(0) - 0x06f0;
            });
    };

    submitAllSteps = () => {
        let {
            productType,
            category,
            detailsArray,
            subCategory,
            minimumOrder,
            maximumPrice,
            minimumPrice,
            amount,
            city,
            description,
            images,
            province

        } = this.state;


        let formData = new FormData();
        let cnt = this.state.productFields.length;

        this.setState(state => {
            state.product.product_name = productType;
            state.product.stock = amount;
            state.product.min_sale_amount = minimumOrder;
            state.product.max_sale_price = maximumPrice;
            state.product.min_sale_price = minimumPrice;
            state.product.description = description;
            state.product.address = "";
            state.product.category_id = subCategory;
            state.product.city_id = city;
            state.product.rules = true;
            return '';
        }, () => {
            for (var i = 0; i < cnt; i++) {
                formData.append(
                    this.state.productFields[i],
                    this.toLatinNumbers(this.state.product[this.state.productFields[i]])
                );
            }
            for (var i = 0; i < this.state.productFiles.length; i++) {
                let file = this.state.productFiles[i];
                formData.append("image_" + i, file);
            }
            formData.append("images_count", this.state.productFiles.length);

            return this.props.addNewProduct(formData, (event) => {
                this.setState({ uploadPercentage: Math.round((100 * event.loaded) / event.total) });
            }).then(result => {
                analytics().logEvent('register_product_successfully');
                setTimeout(() => this.setState({
                    paymentModalVisibility: true
                })
                    , 1000);
                this.setState({
                    productType: '',
                    category: '',
                    detailsArray: '',
                    minimumOrder: '',
                    maximumPrice: '',
                    minimumPrice: '',
                    amount: '',
                    subCategory: '',
                    city: '',
                    description: '',
                    images: '',
                    province: '',
                })
                this.changeStep(8);
            })
        })

    };

    setSelectedButton = id => this.setState({ selectedButton: id })

    resetAndChangeStep = _ => {
        this.setState({
            productType: '',
            category: '',
            detailsArray: '',
            minimumOrder: '',
            maximumPrice: '',
            minimumPrice: '',
            amount: '',
            subCategory: '',
            city: '',
            description: '',
            images: '',
            province: '',
        }, _ => this.changeStep(2));
    }

    renderSteps = () => {
        let { stepNumber, category, subCategory, productType, images, description,
            minimumOrder, maximumPrice, minimumPrice, amount, city,
            province, subCategoryId, subCategoryName, selectedButton,
            parentList
        } = this.state

        const {
            product,
            buyAds
        } = this.props;

        switch (stepNumber) {
            case 1: {
                return <GuidToRegisterProduct
                    resetAndChangeStep={this.resetAndChangeStep}
                    changeStep={this.changeStep}
                    {...this.props}
                />
            }
            case 2: {
                return <SelectCategory
                    setProductType={this.setProductType}
                    changeStep={this.changeStep}
                    category={category}
                    subCategory={subCategory}
                    productType={productType}
                    parentList={parentList}
                    {...this.props}
                />
            }
            case 3: {
                return <StockAndPrice
                    minimumOrder={minimumOrder}
                    maximumPrice={maximumPrice}
                    minimumPrice={minimumPrice}
                    amount={amount}
                    changeStep={this.changeStep} setStockAndPrice={this.setStockAndPrice} {...this.props} />
            }
            case 4: {
                return <ChooseCity
                    city={city} province={province
                    } changeStep={this.changeStep} setCityAndProvice={this.setCityAndProvice}  {...this.props} />
            }
            case 5: {
                return <ProductImages
                    images={images} changeStep={this.changeStep} setProductImages={this.setProductImages} {...this.props} />
            }
            case 6: {
                return <ProductDescription
                    description={description}
                    changeStep={this.changeStep} setProductDescription={this.setProductDescription} {...this.props} />
            }
            case 7: {
                return <ProductMoreDetails setDetailsArray={this.setDetailsArray} changeStep={this.changeStep}  {...this.props} />
            }
            case 8: {
                return <RegisterProductSuccessfully
                    subCategoryId={subCategoryId}
                    product={product}
                    buyAds={buyAds}
                    setSelectedButton={this.setSelectedButton}
                    changeStep={this.changeStep}
                    subCategoryName={subCategoryName}
                    openChat={this.openChat}
                    selectedButton={selectedButton}
                    isUserAllowedToSendMessageLoading={this.props.isUserAllowedToSendMessageLoading}
                    {...this.props}
                />

            }
            default:
                break;
        }
    };

    render() {
        let {
            stepNumber,
            successfullAlert,
            paymentModalVisibility,
            subCategoryId,
            subCategoryName,
            uploadPercentage
        } = this.state;

        const {
            userProfile = {},
            addNewProductMessage = [],
            addNewProductError,
            buyAds = [],
            addNewProductLoading
        } = this.props;

        const {
            user_info = {}
        } = userProfile;
        const {
            active_pakage_type
        } = user_info;

        if (addNewProductLoading)
            return (
                <View
                    style={{
                        flex: 1,
                        height: deviceHeight,
                        width: deviceWidth,
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 20,
                        backgroundColor: 'white'
                    }}
                >
                    <View
                        style={{
                            backgroundColor: '#fafafa',
                            elevation: 0,
                            width: '100%',
                            borderRadius: 12,
                            marginTop: 20
                        }}>
                        <Text style={{
                            backgroundColor: '#F6F8FE',
                            width: '100%',
                            textAlign: 'center',
                            fontFamily: "IRANSansWeb(FaNum)_Medium",
                            color: '#313A43',
                            paddingVertical: 7


                        }}>
                            {locales('labels.uploading')}
                        </Text>
                        <View
                            style={{
                                marginTop: 7,
                                marginBottom: 15,
                                paddingHorizontal: 15
                            }}>
                            <Text
                                style={{
                                    fontFamily: "IRANSansWeb(FaNum)_Medium",
                                    color: '#FF9828',
                                    textAlign: 'center'
                                }}>
                                {uploadPercentage}%
                            </Text>
                            <View style={{
                                width: '100%',
                                height: 7
                            }}>
                                <View
                                    style={{
                                        backgroundColor: '#DDDDDD',
                                        borderRadius: 15,
                                        height: 7,
                                        width: '100%',
                                        position: 'absolute'

                                    }}
                                ></View>
                                <LinearGradient
                                    start={{ x: 0, y: 1 }}
                                    end={{ x: 0.8, y: 0.2 }}
                                    colors={['#FF9727', '#FF6701']}
                                    style={{
                                        position: 'absolute',
                                        height: 7,
                                        width: `${uploadPercentage}%`,
                                        right: 0,
                                        borderRadius: 10
                                    }}
                                >

                                </LinearGradient>
                            </View>
                        </View>
                    </View>
                </View>
            )
        return (
            <>
                {stepNumber == 8 && !buyAds.length && active_pakage_type == 0 ? <PaymentModal
                    {...this.props}
                    routeTo={{ parentScreen: 'RegisterProductSuccessfully' }}
                    routeParams={{ subCategoryId, subCategoryName, buyAds }}
                    onRequestToClose={() => this.setState({ paymentModalVisibility: false })}
                    visible={paymentModalVisibility}
                /> : null}

                <View style={{ flex: 1, backgroundColor: 'white' }}>

                    <View style={{
                        backgroundColor: 'white',
                        flexDirection: 'row',
                        alignContent: 'center',
                        alignItems: 'center',
                        height: 45,
                        elevation: 5,
                        justifyContent: 'center'
                    }}>

                        <View style={{
                            width: '100%',
                            alignItems: 'center'
                        }}>
                            <Text
                                style={{ fontSize: 18, fontFamily: 'IRANSansWeb(FaNum)_Bold' }}
                            >
                                {locales('labels.registerProduct')}
                            </Text>
                        </View>
                    </View>

                    <View
                        style={{
                            flex: 1
                        }}
                        ref={this.mainContainer}
                        keyboardShouldPersistTaps='handled'
                    >


                        {stepNumber > 1 && stepNumber < 8 && <View style={{
                            paddingVertical: 10,
                            width: deviceWidth, marginVertical: 5,
                            flexDirection: 'row-reverse', alignContent: 'center', justifyContent: 'center',
                        }}>
                            <View style={{
                                flexDirection: 'row-reverse',
                                marginVertical: 5,

                                alignItems: 'stretch',
                                alignContent: 'center', alignSelf: 'center',
                                width: deviceWidth - 40,

                            }}>
                                {stepsArray.map((item, index) => {
                                    return (
                                        <Fragment key={index}>
                                            <Text
                                                style={{
                                                    textAlign: 'center', color: 'white', alignItems: 'center', justifyContent: 'center',
                                                    alignSelf: 'center', alignContent: 'center',
                                                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                                    textAlignVertical: 'center', borderColor: '#FFFFFF',
                                                    backgroundColor: stepNumber > item ? "#00C569" : '#BEBEBE',
                                                    width: 20, height: 20, borderRadius: 10

                                                }}
                                            >
                                                {item}
                                            </Text>
                                            {index < stepsArray.length - 1 && <View
                                                style={{
                                                    height: 2,
                                                    flex: 1,
                                                    alignSelf: 'center',
                                                    backgroundColor: stepNumber - 1 > item ? "#00C569" : '#BEBEBE',
                                                }}>
                                            </View>
                                            }
                                        </Fragment>
                                    )
                                }
                                )}
                            </View>
                        </View>}

                        {addNewProductError && addNewProductMessage && addNewProductMessage.length ?
                            addNewProductMessage.map((error, index) => (
                                <View
                                    style={{
                                        width: deviceWidth, justifyContent: 'center', alignItems: 'center',
                                        alignContent: 'center'
                                    }}
                                    key={index}
                                >
                                    <Text style={{
                                        width: '100%',
                                        color: '#E41C38',
                                        textAlign: 'center',
                                        fontFamily: 'IRANSansWeb(FaNum)_Light',
                                        marginVertical: 10,
                                        paddingHorizontal: 15,
                                        paddingVertical: 5,
                                        borderRadius: 4
                                    }}
                                    >{error}
                                    </Text>
                                </View>
                            ))
                            : null}



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

                    </View>

                </View >
            </>
        )
    };

};

const styles = StyleSheet.create({
    stepsContainer: {
        marginVertical: 5,
        flex: 1
    },
    loginFailedContainer: {
        backgroundColor: '#D4EDDA',
        padding: 10,
        borderRadius: 5
    },
    loginFailedText: {
        textAlign: 'center',
        fontFamily: 'IRANSansWeb(FaNum)_Light',
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
        alignSelf: 'center',
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
    buttonText: {
        color: 'white',
        width: '80%',
        textAlign: 'center'
    },
    backButtonText: {
        fontFamily: 'IRANSansWeb(FaNum)_Light',
        color: '#7E7E7E',
        width: '60%',
        textAlign: 'center'
    },
    greenButton: {
        backgroundColor: '#FF9828',
    },
    redButton: {
        backgroundColor: '#E41C39',
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
});

const mapStateToProps = (state) => {
    const {
        isUserAllowedToSendMessageLoading,
        isUserAllowedToSendMessage,
        isUserAllowedToSendMessagePermission,
    } = state.profileReducer;

    return {
        userProfile: state.profileReducer.userProfile,
        addNewProductLoading: state.registerProductReducer.addNewProductLoading,
        resetTab: state.registerProductReducer.resetTab,
        addNewProductMessage: state.registerProductReducer.addNewProductMessage,
        addNewProductError: state.registerProductReducer.addNewProductError,

        product: state.registerProductReducer.product,
        buyAds: state.registerProductReducer.buyAds,

        isUserAllowedToSendMessageLoading,
        isUserAllowedToSendMessage,
        isUserAllowedToSendMessagePermission,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        addNewProduct: (productObject, onUploadProgress) => dispatch(productActions.addNewProduct(productObject, onUploadProgress)),
        fetchUserProfile: _ => dispatch(profileActions.fetchUserProfile()),
        resetRegisterProduct: resetTab => dispatch(productActions.resetRegisterProduct(resetTab)),
        setSubCategoryIdFromRegisterProduct: (id, name) => dispatch(productActions.setSubCategoryIdFromRegisterProduct(id, name)),
        isUserAllowedToSendMessage: (id) => dispatch(profileActions.isUserAllowedToSendMessage(id)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterProduct);