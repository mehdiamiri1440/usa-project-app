import React, { Fragment } from 'react';
import { Text, View, StyleSheet, BackHandler, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux';
import * as productActions from '../../redux/registerProduct/actions';
import { ScrollView } from 'react-native-gesture-handler';
import { deviceWidth, deviceHeight } from '../../utils';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import SelectCategory from './Steps/SelectCategory';
import StockAndPrice from './Steps/StockAndPrice';
import GuidToRegisterProduct from './Steps/GuidToRegisterProduct';
import ChooseCity from './Steps/ChooseCity';
import ProductImages from './Steps/ProductImages';
import RegisterProductSuccessfully from './RegisterProductSuccessfully';
import ProductDescription from './Steps/ProductDescription';
import ProductMoreDetails from './Steps/ProductMoreDetails';
import NoConnection from '../../components/noConnectionError';

let stepsArray = [1, 2, 3, 4, 5, 6],
    tempDefaultArray = []
class RegisterProduct extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
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

            stepNumber: 0,
            showModal: false
        }
    }

    mainContainer = React.createRef();

    componentDidUpdate(prevProps, prevState) {
        if (this.mainContainer && this.mainContainer.current)
            this.mainContainer.current.scrollTo({ y: 0 });

    }

    componentDidMount() {
        global.resetRegisterProduct = data => {
            if (data) {
                this.changeStep(0);
            }
        }
        if (this.mainContainer && this.mainContainer.current)
            this.mainContainer.current.scrollTo({ y: 0 });
        BackHandler.addEventListener('hardwareBackPress', () => {
            if (this.state.stepNumber > 1) {
                this.setState({ stepNumber: this.state.stepNumber - 1 })
                return true;
            }
        })
        if (this.props.resetTab) {
            this.changeStep(0);
            this.props.resetRegisterProduct(false);
        }
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

    setStockAndPrice = (minimumOrder, maximumPrice, minimumPrice, amount) => {
        this.setState({ minimumOrder, maximumPrice, minimumPrice, amount, stepNumber: 3 });
    };

    setCityAndProvice = (city, province) => {
        this.setState({ city, province, stepNumber: 4 });
    };


    setProductImages = images => {
        this.setState({ productFiles: images, images, stepNumber: 5 });
    };

    setProductDescription = description => {
        this.setState({ description, stepNumber: 6 });
    };
    getItemDescription = (itemKey, defaultFieldsOptions) => {
        return defaultFieldsOptions.find((item) => itemKey == item.name).description;
    }

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
    }

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
            return this.props.addNewProduct(formData).then(_ => {
                this.setState({
                    productType: '',
                    category: '',
                    detailsArray: '',
                    subCategory: '',
                    minimumOrder: '',
                    maximumPrice: '',
                    minimumPrice: '',
                    amount: '',
                    city: '',
                    description: '',
                    images: '',
                    province: '',
                })
                this.changeStep(7);
            }).catch(_ => this.setState({ showModal: true }))
        })

    }

    setShowModal = _ => {
        this.setState({ showModal: true })
    };

    renderSteps = () => {
        let { stepNumber, category, subCategory, productType, images, description,
            minimumOrder, maximumPrice, minimumPrice, amount, city, province } = this.state
        switch (stepNumber) {
            case 0: {
                return <GuidToRegisterProduct
                    setShowModal={this.setShowModal}
                    setProductType={this.setProductType}
                    changeStep={this.changeStep} {...this.props}
                />
            }
            case 1: {
                return <SelectCategory
                    setProductType={this.setProductType}
                    changeStep={this.changeStep} {...this.props}
                    category={category}
                    subCategory={subCategory}
                    productType={productType}
                />
            }
            case 2: {
                return <StockAndPrice
                    minimumOrder={minimumOrder}
                    maximumPrice={maximumPrice}
                    minimumPrice={minimumPrice}
                    amount={amount}
                    changeStep={this.changeStep} setStockAndPrice={this.setStockAndPrice} {...this.props} />
            }
            case 3: {
                return <ChooseCity
                    city={city} province={province
                    } changeStep={this.changeStep} setCityAndProvice={this.setCityAndProvice}  {...this.props} />
            }
            case 4: {
                return <ProductImages
                    images={images} changeStep={this.changeStep} setProductImages={this.setProductImages} {...this.props} />
            }
            case 5: {
                return <ProductDescription
                    description={description}
                    changeStep={this.changeStep} setProductDescription={this.setProductDescription} {...this.props} />
            }
            case 6: {
                return <ProductMoreDetails setDetailsArray={this.setDetailsArray} changeStep={this.changeStep}  {...this.props} />
            }
            case 7: {
                return <RegisterProductSuccessfully {...this.props} />
            }
            default:
                break;
        }

    };

    closeModal = _ => {
        this.setState({ showModal: false })
        this.componentDidMount();
    }

    render() {
        let { stepNumber, successfullAlert } = this.state;

        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <NoConnection
                    showModal={this.state.showModal}
                    closeModal={this.closeModal}
                />

                <View style={{
                    backgroundColor: 'white',
                    flexDirection: 'row',
                    alignContent: 'center',
                    alignItems: 'center',
                    height: 57,
                    elevation: 5,
                    justifyContent: 'center'
                }}>
                    <TouchableOpacity
                        style={{ width: 40, justifyContent: 'center', position: 'absolute', right: 0 }}
                        onPress={() => { stepNumber > 1 ? this.setState({ stepNumber: this.state.stepNumber - 1 }) : this.props.navigation.goBack(); }}

                    >
                        <AntDesign name='arrowright' size={25} />
                    </TouchableOpacity>

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

                <ScrollView
                    ref={this.mainContainer}
                    keyboardShouldPersistTaps='handled'
                >


                    {stepNumber > 0 && <View style={{
                        borderBottomColor: '#00C569',
                        borderBottomWidth: 2,
                        paddingVertical: 10,
                        width: deviceWidth, marginVertical: 5,
                        flexDirection: 'row-reverse', alignContent: 'center', justifyContent: 'center',
                    }}>
                        <View style={{
                            flexDirection: 'row-reverse',
                            marginVertical: 5,

                            alignItems: 'stretch',
                            alignContent: 'center', alignSelf: 'center',
                            width: deviceWidth - 80,

                        }}>
                            {stepsArray.map((item, index) => {
                                return (
                                    <Fragment key={index}>
                                        <Text
                                            style={{
                                                textAlign: 'center', color: 'white', alignItems: 'center', justifyContent: 'center',
                                                alignSelf: 'center', alignContent: 'center',
                                                shadowOffset: { width: 10, height: 10 },
                                                shadowColor: 'black',
                                                shadowOpacity: 1.0,
                                                elevation: 5,
                                                textAlignVertical: 'center', borderColor: '#FFFFFF',
                                                backgroundColor: stepNumber >= item ? "#00C569" : '#BEBEBE',
                                                width: 26, height: 26, borderRadius: 13

                                            }}
                                        >
                                            {item}
                                        </Text>
                                        {index < stepsArray.length - 1 && <View
                                            style={{
                                                height: 4,
                                                flex: 1,
                                                alignSelf: 'center',
                                                backgroundColor: stepNumber - 1 >= item ? "#00C569" : '#BEBEBE',
                                            }}>
                                        </View>
                                        }
                                    </Fragment>
                                )
                            }
                            )}
                        </View>
                    </View>}





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
        marginVertical: 5,
        height: deviceHeight
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
        addNewProductLoading: state.registerProductReducer.addNewProductLoading,
        resetTab: state.registerProductReducer.resetTab
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        addNewProduct: productObject => dispatch(productActions.addNewProduct(productObject)),
        resetRegisterProduct: resetTab => dispatch(productActions.resetRegisterProduct(resetTab))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterProduct)