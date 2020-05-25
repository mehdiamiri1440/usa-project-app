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
import ProductDescription from './Steps/ProductDescription';
import ProductMoreDetails from './Steps/ProductMoreDetails';

let stepsArray = [1, 2, 3, 4, 5, 6],
    tempDefaultArray = []
class RegisterProduct extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            successfullAlert: false,
            stepNumber: 6,
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
            province: ''
        }
    }

    mainContainer = React.createRef();

    componentDidUpdate() {
        if (this.mainContainer && this.mainContainer.current)
            this.mainContainer.current.scrollTo({ y: 0 });
    }

    componentDidMount() {
        if (this.mainContainer && this.mainContainer.current)
            this.mainContainer.current.scrollTo({ y: 0 });
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

    setStockAndPrice = (minimumOrder, maximumPrice, minimumPrice, amount) => {
        this.setState({ minimumOrder, maximumPrice, minimumPrice, amount, stepNumber: 3 });
    };

    setCityAndProvice = (city, province) => {
        this.setState({ city, province, stepNumber: 4 });
    };


    setProductImages = images => {
        this.setState({ images, stepNumber: 5 });
    };

    setProductDescription = description => {
        this.setState({ description, stepNumber: 6 });
    };


    setDetailsArray = (detailsArray, defaultArray) => {
        tempDefaultArray = [...defaultArray]
        this.setState({ detailsArray }, () => this.submitAllSteps());
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

        // console.warn(
        //     'productType--->', productType,
        //     'category--->', category,
        //     'detailsarray---->', detailsArray,
        //     'sub category---->>', subCategory,
        //     'minimim order--->', minimumOrder,
        //     'maximum price---->', maximumPrice,
        //     'minimum price--->', minimumPrice,
        //     'amount --->', amount,
        //     'images--->>', images,
        //     'city--->>', city,
        //     'description--->', description,
        //     'province--->', province,
        //     'temp---------->>>', tempDefaultArray);

        detailsArray.forEach(element => {
            if (!this.state.description.includes(tempDefaultArray.find(item => item.name == element.itemKey).description))
                description = `${description} <hr/> ${tempDefaultArray.find(item => item.name == element.itemKey).description} : ${element.itemValue}`;
        });
        this.setState({ description }, () => {
            let productObject = {
                product_name: productType,
                category,
                detailsArray,
                category_id: subCategory,
                stock: amount,
                max_sale_price: maximumPrice,
                min_sale_price: minimumPrice,
                min_sale_amount: minimumOrder,
                city_id: city,
                description: this.state.description,
                images_count: images.length,
                rules: true
            };

            images.forEach((element, index) => {
                productObject[`images_${index}`] = element
            });

            console.log('my final product->', productObject)
            this.props.addNewProduct(productObject)
        })
    }

    renderSteps = () => {
        let { stepNumber, category, subCategory, productType, images, description,
            minimumOrder, maximumPrice, minimumPrice, amount, city, province } = this.state
        switch (stepNumber) {
            case 0: {
                return <GuidToRegisterProduct
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
            default:
                break;
        }

    };

    render() {

        let { stepNumber, successfullAlert } = this.state;

        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>


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
                    <TouchableOpacity
                        style={{ width: deviceWidth * 0.4, justifyContent: 'center', alignItems: 'flex-end', paddingHorizontal: 10 }}
                        onPress={() => { stepNumber > 1 ? this.setState({ stepNumber: this.state.stepNumber - 1 }) : this.props.navigation.goBack(); }}
                    >
                        <AntDesign name='arrowright' size={25} />
                    </TouchableOpacity>

                    <View style={{
                        width: deviceWidth * 0.6,
                        alignItems: 'flex-end'
                    }}>
                        <Text
                            style={{ fontSize: 18 }}
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
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        addNewProduct: productObject => dispatch(productActions.addNewProduct(productObject))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterProduct)