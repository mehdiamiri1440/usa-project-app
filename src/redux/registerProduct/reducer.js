import actionTypes from './actionTypes';
const INITIAL_STATE = {
    categoriesLoading: false,
    categoriesFailed: false,
    categoriesError: false,
    categoriesMessage: null,
    categoriesList: [],
    categories: {},


    addNewProductLoading: false,
    addNewProductFailed: false,
    addNewProductError: false,
    addNewProductMessage: [],

    userPermissionToRegisterProductLoading: false,
    userPermissionToRegisterProductFailed: false,
    userPermissionToRegisterProductError: false,
    userPermissionToRegisterProductMessage: null,
    isUserLimitedToRegisterProduct: false,
    userPermissionToRegisterProductStatus: false,

    buyAdsAfterPaymentLoading: false,
    buyAdsAfterPaymentFailed: false,
    buyAdsAfterPaymentError: false,
    buyAdsAfterPaymentMessage: [],
    buyAdsAfterPaymentList: [],

    registerBuyAdRequestLoading: false,
    registerBuyAdRequestFailed: false,
    registerBuyAdRequestError: false,
    registerBuyAdRequestMessage: [],

    subCategoriesLoading: false,
    subCategoriesFailed: false,
    subCategoriesError: false,
    subCategoriesMessage: null,
    subCategoriesList: [],
    subCategories: {},

    subCategoryId: null,
    subCategoryName: null,

    products: [],
    product: {},
    buyAds: []
};
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {


        case actionTypes.FETCH_ALL_CATEGORIES_LOADING: {
            return {
                ...state,
                categoriesList: [],
                categories: {},
                categoriesLoading: true,
                categoriesFailed: false,
                categoriesError: false,
                categoriesMessage: null
            };
        };
        case actionTypes.FETCH_ALL_CATEGORIES_SUCCESSFULLY: {
            let { msg = '', status = true } = action.payload
            const x = [
                {
                    "id": 0,
                    "created_at": null,
                    "updated_at": null,
                    "category_name": "کشاورزی",
                    "parent_id": null,
                    "score": 0,
                    "subcategories": [
                        {
                            "id": 1,
                            "created_at": null,
                            "updated_at": null,
                            "category_name": "میوه",
                            "parent_id": 0,
                            "score": 0,
                            "subcategories": {
                                "0": {
                                    "id": 6,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "خرما",
                                    "parent_id": 1,
                                    "score": 4244
                                },
                                "2": {
                                    "id": 3,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "سیب",
                                    "parent_id": 1,
                                    "score": 916
                                },
                                "8": {
                                    "id": 11,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "پرتقال",
                                    "parent_id": 1,
                                    "score": 400
                                },
                                "11": {
                                    "id": 7,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "انگور ",
                                    "parent_id": 1,
                                    "score": 268
                                },
                                "16": {
                                    "id": 4,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "انار",
                                    "parent_id": 1,
                                    "score": 188
                                },
                                "17": {
                                    "id": 41,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "انجیر",
                                    "parent_id": 1,
                                    "score": 179
                                },
                                "18": {
                                    "id": 19,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "کیوی",
                                    "parent_id": 1,
                                    "score": 171
                                },
                                "23": {
                                    "id": 17,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "لیمو ترش",
                                    "parent_id": 1,
                                    "score": 121
                                },
                                "33": {
                                    "id": 18,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "زردآلو",
                                    "parent_id": 1,
                                    "score": 63
                                },
                                "35": {
                                    "id": 13,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "توت فرنگی",
                                    "parent_id": 1,
                                    "score": 52
                                },
                                "38": {
                                    "id": 14,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "نارنگی",
                                    "parent_id": 1,
                                    "score": 43
                                },
                                "39": {
                                    "id": 15,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "هلو",
                                    "parent_id": 1,
                                    "score": 41
                                },
                                "40": {
                                    "id": 49,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "موز",
                                    "parent_id": 1,
                                    "score": 39
                                },
                                "42": {
                                    "id": 10,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "گیلاس",
                                    "parent_id": 1,
                                    "score": 34
                                },
                                "43": {
                                    "id": 12,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "به",
                                    "parent_id": 1,
                                    "score": 30
                                },
                                "46": {
                                    "id": 16,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "لیمو شیرین",
                                    "parent_id": 1,
                                    "score": 28
                                },
                                "49": {
                                    "id": 8,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "آلبالو",
                                    "parent_id": 1,
                                    "score": 22
                                },
                                "50": {
                                    "id": 9,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "گلابی",
                                    "parent_id": 1,
                                    "score": 22
                                },
                                "51": {
                                    "id": 21,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "شلیل",
                                    "parent_id": 1,
                                    "score": 19
                                },
                                "61": {
                                    "id": 48,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "زیتون",
                                    "parent_id": 1,
                                    "score": 7
                                },
                                "62": {
                                    "id": 20,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "گریپ فروت",
                                    "parent_id": 1,
                                    "score": 6
                                },
                                "63": {
                                    "id": 22,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "سایر",
                                    "parent_id": 1,
                                    "score": 479
                                }
                            }
                        },
                        {
                            "id": 2,
                            "created_at": null,
                            "updated_at": null,
                            "category_name": "صیفی",
                            "parent_id": 0,
                            "score": 0,
                            "subcategories": {
                                "4": {
                                    "id": 5,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "گوجه",
                                    "parent_id": 2,
                                    "score": 528
                                },
                                "7": {
                                    "id": 23,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "سیب زمینی",
                                    "parent_id": 2,
                                    "score": 416
                                },
                                "9": {
                                    "id": 37,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "هندوانه",
                                    "parent_id": 2,
                                    "score": 327
                                },
                                "10": {
                                    "id": 25,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "پیاز",
                                    "parent_id": 2,
                                    "score": 310
                                },
                                "13": {
                                    "id": 26,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "فلفل دلمه ای",
                                    "parent_id": 2,
                                    "score": 247
                                },
                                "14": {
                                    "id": 29,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "سیر",
                                    "parent_id": 2,
                                    "score": 196
                                },
                                "20": {
                                    "id": 24,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "کلم",
                                    "parent_id": 2,
                                    "score": 150
                                },
                                "24": {
                                    "id": 31,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "خیار",
                                    "parent_id": 2,
                                    "score": 106
                                },
                                "26": {
                                    "id": 50,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "کاهو",
                                    "parent_id": 2,
                                    "score": 83
                                },
                                "27": {
                                    "id": 51,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "بادمجان",
                                    "parent_id": 2,
                                    "score": 81
                                },
                                "28": {
                                    "id": 36,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "کدو",
                                    "parent_id": 2,
                                    "score": 79
                                },
                                "29": {
                                    "id": 34,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "ملون",
                                    "parent_id": 2,
                                    "score": 73
                                },
                                "30": {
                                    "id": 52,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "قارچ",
                                    "parent_id": 2,
                                    "score": 72
                                },
                                "32": {
                                    "id": 33,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "هویج",
                                    "parent_id": 2,
                                    "score": 65
                                },
                                "36": {
                                    "id": 28,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "شوید",
                                    "parent_id": 2,
                                    "score": 47
                                },
                                "37": {
                                    "id": 38,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "فلفل",
                                    "parent_id": 2,
                                    "score": 45
                                },
                                "44": {
                                    "id": 35,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "خربزه",
                                    "parent_id": 2,
                                    "score": 30
                                },
                                "47": {
                                    "id": 27,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "کرفس",
                                    "parent_id": 2,
                                    "score": 26
                                },
                                "48": {
                                    "id": 30,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "شلغم",
                                    "parent_id": 2,
                                    "score": 23
                                },
                                "55": {
                                    "id": 32,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "لوبیا سبز",
                                    "parent_id": 2,
                                    "score": 13
                                },
                                "58": {
                                    "id": 39,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "طالبی",
                                    "parent_id": 2,
                                    "score": 9
                                },
                                "59": {
                                    "id": 40,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "سایر",
                                    "parent_id": 2,
                                    "score": 452
                                }
                            }
                        },
                        {
                            "id": 42,
                            "created_at": null,
                            "updated_at": null,
                            "category_name": "غلات",
                            "parent_id": 0,
                            "score": 0,
                            "subcategories": {
                                "1": {
                                    "id": 43,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "برنج",
                                    "parent_id": 42,
                                    "score": 1960
                                },
                                "31": {
                                    "id": 70,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "کنجد",
                                    "parent_id": 42,
                                    "score": 67
                                },
                                "52": {
                                    "id": 63,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "ذرت",
                                    "parent_id": 42,
                                    "score": 15
                                },
                                "57": {
                                    "id": 62,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "گندم",
                                    "parent_id": 42,
                                    "score": 13
                                },
                                "72": {
                                    "id": 61,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "جو",
                                    "parent_id": 42,
                                    "score": 0
                                }
                            }
                        },
                        {
                            "id": 45,
                            "created_at": null,
                            "updated_at": null,
                            "category_name": "خشکبار",
                            "parent_id": 0,
                            "score": 0,
                            "subcategories": {
                                "3": {
                                    "id": 44,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "پسته",
                                    "parent_id": 45,
                                    "score": 536
                                },
                                "19": {
                                    "id": 57,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "میوه خشک",
                                    "parent_id": 45,
                                    "score": 164
                                },
                                "21": {
                                    "id": 54,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "گردو",
                                    "parent_id": 45,
                                    "score": 132
                                },
                                "22": {
                                    "id": 53,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "کشمش",
                                    "parent_id": 45,
                                    "score": 124
                                },
                                "25": {
                                    "id": 55,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "بادام",
                                    "parent_id": 45,
                                    "score": 90
                                },
                                "34": {
                                    "id": 58,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "زرشک",
                                    "parent_id": 45,
                                    "score": 62
                                },
                                "56": {
                                    "id": 56,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "تخمه آفتابگردان",
                                    "parent_id": 45,
                                    "score": 13
                                }
                            }
                        },
                        {
                            "id": 46,
                            "created_at": null,
                            "updated_at": null,
                            "category_name": "ادویه",
                            "parent_id": 0,
                            "score": 0,
                            "subcategories": {
                                "12": {
                                    "id": 59,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "زعفران",
                                    "parent_id": 46,
                                    "score": 250
                                },
                                "53": {
                                    "id": 69,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "زنجبیل",
                                    "parent_id": 46,
                                    "score": 15
                                },
                                "60": {
                                    "id": 66,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "آویشن",
                                    "parent_id": 46,
                                    "score": 8
                                },
                                "63": {
                                    "id": 65,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "زردچوبه",
                                    "parent_id": 46,
                                    "score": 3
                                },
                                "64": {
                                    "id": 68,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "پودر سیر",
                                    "parent_id": 46,
                                    "score": 3
                                },
                                "65": {
                                    "id": 64,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "هل",
                                    "parent_id": 46,
                                    "score": 2
                                },
                                "73": {
                                    "id": 67,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "فلفل سیاه",
                                    "parent_id": 46,
                                    "score": 0
                                }
                            }
                        },
                        {
                            "id": 47,
                            "created_at": null,
                            "updated_at": null,
                            "category_name": "دامپروری",
                            "parent_id": 0,
                            "score": 0,
                            "subcategories": {
                                "15": {
                                    "id": 60,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "عسل",
                                    "parent_id": 47,
                                    "score": 194
                                }
                            }
                        },
                        {
                            "id": 71,
                            "created_at": null,
                            "updated_at": null,
                            "category_name": "حبوبات",
                            "parent_id": 0,
                            "score": 0,
                            "subcategories": {
                                "41": {
                                    "id": 73,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "لوبیا",
                                    "parent_id": 71,
                                    "score": 37
                                },
                                "45": {
                                    "id": 75,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "سویا",
                                    "parent_id": 71,
                                    "score": 29
                                },
                                "54": {
                                    "id": 72,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "عدس",
                                    "parent_id": 71,
                                    "score": 14
                                },
                                "59": {
                                    "id": 74,
                                    "created_at": null,
                                    "updated_at": null,
                                    "category_name": "نخود",
                                    "parent_id": 71,
                                    "score": 9
                                }
                            }
                        }

                    ]
                }
            ];
            const categories = action.payload.categories.filter(item => item.parent_id == null);
            return {
                ...state,
                categoriesList: [...categories],
                categories: { ...action.payload },
                categoriesLoading: false,
                categoriesFailed: false,
                categoriesError: false,
                categoriesMessage: msg,
            };
        };
        case actionTypes.FETCH_ALL_CATEGORIES_FAILED: {
            const { msg = '' } = action.payload;
            return {
                ...state,
                categoriesList: [],
                categories: {},
                categoriesLoading: false,
                categoriesFailed: true,
                categoriesError: false,
                categoriesMessage: msg
            };
        };
        case actionTypes.FETCH_ALL_CATEGORIES_REJECT: {
            return {
                ...state,
                categoriesList: [],
                categories: {},
                categoriesLoading: false,
                categoriesFailed: false,
                categoriesError: true,
                categoriesMessage: ''
            };
        };


        case actionTypes.FETCH_ALL_SUB_CATEGORIES_LOADING: {
            return {
                ...state,
                subCategoriesList: [],
                subCategories: {},
                subCategoriesLoading: true,
                subCategoriesFailed: false,
                subCategoriesError: false,
                subCategoriesMessage: null
            };
        };
        case actionTypes.FETCH_ALL_SUB_CATEGORIES_SUCCESSFULLY: {
            let { msg = '', status = true } = action.payload
            return {
                ...state,
                subCategoriesList: [...action.payload.categories],
                subCategories: { ...action.payload },
                subCategoriesLoading: false,
                subCategoriesFailed: false,
                subCategoriesError: false,
                subCategoriesMessage: msg,
            };
        };
        case actionTypes.FETCH_ALL_SUB_CATEGORIES_FAILED: {
            let { msg = '' } = action.payload
            return {
                ...state,
                subCategoriesList: [],
                subCategories: {},
                subCategoriesLoading: false,
                subCategoriesFailed: true,
                subCategoriesError: false,
                subCategoriesMessage: msg
            };
        };
        case actionTypes.FETCH_ALL_SUB_CATEGORIES_REJECT: {
            return {
                ...state,
                subCategoriesList: [],
                subCategories: {},
                subCategoriesLoading: false,
                subCategoriesFailed: false,
                subCategoriesError: true,
                subCategoriesMessage: ''
            };
        };




        case actionTypes.ADD_NEW_PRODUCT_LOADING: {
            return {
                ...state,
                addNewProductLoading: true,
                addNewProductFailed: false,
                buyAdsAfterPaymentList: [],
                addNewProductError: false,
                addNewProductMessage: [],
                product: {},
                buyAds: []
            };
        };
        case actionTypes.ADD_NEW_PRODUCT_SUCCESSFULLY: {
            let { buyAds = [], product = {} } = action.payload;
            return {
                ...state,
                addNewProductLoading: false,
                addNewProductFailed: false,
                addNewProductError: false,
                addNewProductMessage: [],
                buyAdsAfterPaymentList: [],
                product,
                buyAds
            };
        };
        case actionTypes.ADD_NEW_PRODUCT_FAILED: {
            let { msg = '' } = action.payload
            return {
                ...state,
                addNewProductLoading: false,
                addNewProductFailed: true,
                addNewProductError: false,
                addNewProductMessage: [],
                buyAdsAfterPaymentList: [],
                product: {},
                buyAds: []
            };
        };
        case actionTypes.ADD_NEW_PRODUCT_REJECT: {
            const { data = {} } = action.payload;
            const { errors = {} } = data;
            const errorsArray = Object.values(errors);

            return {
                ...state,
                addNewProductLoading: false,
                buyAdsAfterPaymentList: [],
                addNewProductFailed: false,
                addNewProductError: true,
                addNewProductMessage: errorsArray && errorsArray.length ? errorsArray : ['خطای سرور'],
                product: {},
                buyAds: []
            };
        };



        case actionTypes.CHECK_USER_PERMISSION_TO_REGISTER_PRODUCT_LOADING: {
            return {
                ...state,
                userPermissionToRegisterProductLoading: true,
                userPermissionToRegisterProductFailed: false,
                userPermissionToRegisterProductError: false,
                userPermissionToRegisterProductMessage: null,
                isUserLimitedToRegisterProduct: false,
                userPermissionToRegisterProductStatus: false
            };
        };
        case actionTypes.CHECK_USER_PERMISSION_TO_REGISTER_PRODUCT_SUCCESSFULLY: {
            let { msg = '', status = true, is_limit = true } = action.payload
            return {
                ...state,
                userPermissionToRegisterProductLoading: false,
                userPermissionToRegisterProductFailed: false,
                userPermissionToRegisterProductError: false,
                userPermissionToRegisterProductMessage: msg,
                isUserLimitedToRegisterProduct: is_limit,
                userPermissionToRegisterProductStatus: status
            };
        };
        case actionTypes.CHECK_USER_PERMISSION_TO_REGISTER_PRODUCT_FAILED: {
            let { msg = '' } = action.payload
            return {
                ...state,
                userPermissionToRegisterProductLoading: false,
                userPermissionToRegisterProductFailed: true,
                userPermissionToRegisterProductError: false,
                userPermissionToRegisterProductMessage: msg,
                isUserLimitedToRegisterProduct: false,
                userPermissionToRegisterProductStatus: false
            };
        };
        case actionTypes.CHECK_USER_PERMISSION_TO_REGISTER_PRODUCT_REJECT: {
            return {
                ...state,
                userPermissionToRegisterProductLoading: false,
                userPermissionToRegisterProductFailed: false,
                userPermissionToRegisterProductError: true,
                userPermissionToRegisterProductMessage: '',
                isUserLimitedToRegisterProduct: false,
                userPermissionToRegisterProductStatus: false
            };
        };



        case actionTypes.REGISTER_BUYAD_REQUEST_LOADING: {
            return {
                ...state,
                registerBuyAdRequestLoading: true,
                registerBuyAdRequestFailed: false,
                registerBuyAdRequestError: false,
                registerBuyAdRequestMessage: [],
                products: [],
                registerBuyAdRequest: {}
            };
        };
        case actionTypes.REGISTER_BUYAD_REQUEST_SUCCESSFULLY: {
            let { msg = '', products = [] } = action.payload
            return {
                ...state,
                registerBuyAdRequestLoading: false,
                registerBuyAdRequestFailed: false,
                registerBuyAdRequestError: false,
                registerBuyAdRequestMessage: [],
                products,
                registerBuyAdRequest: { ...action.payload }
            };
        };
        case actionTypes.REGISTER_BUYAD_REQUEST_FAILED: {
            return {
                ...state,
                registerBuyAdRequestLoading: false,
                registerBuyAdRequestFailed: true,
                registerBuyAdRequestError: false,
                registerBuyAdRequestMessage: [],
                registerBuyAdRequest: {},
                products: []
            };
        };
        case actionTypes.REGISTER_BUYAD_REQUEST_REJECT: {
            const { response = {} } = action.payload;
            const { data = {} } = response;
            const { errors = {} } = data;
            const errorsArray = Object.values(errors);

            return {
                ...state,
                products: [],
                registerBuyAdRequestLoading: false,
                registerBuyAdRequestFailed: false,
                registerBuyAdRequestError: true,
                registerBuyAdRequestMessage: errorsArray && errorsArray.length ? errorsArray : ['خطای سرور'],
                registerBuyAdRequest: {}
            };
        };



        case actionTypes.BUYADS_AFTER_PAYMENT_LOADING: {
            return {
                ...state,
                buyAdsAfterPaymentLoading: true,
                buyAdsAfterPaymentFailed: false,
                buyAdsAfterPaymentError: false,
                buyAdsAfterPaymentMessage: [],
                buyAdsAfterPaymentList: [],
                buyAdsAfterPayment: {}
            };
        };
        case actionTypes.BUYADS_AFTER_PAYMENT_SUCCESSFULLY: {
            let { msg = '', products = [] } = action.payload
            return {
                ...state,
                buyAdsAfterPaymentLoading: false,
                buyAdsAfterPaymentFailed: false,
                buyAdsAfterPaymentError: false,
                buyAdsAfterPaymentMessage: [],
                buyAdsAfterPaymentList: [...action.payload.buyAds],
                buyAdsAfterPayment: { ...action.payload }
            };
        };
        case actionTypes.BUYADS_AFTER_PAYMENT_FAILED: {
            let { msg = '' } = action.payload
            return {
                ...state,
                buyAdsAfterPaymentLoading: false,
                buyAdsAfterPaymentFailed: true,
                buyAdsAfterPaymentError: false,
                buyAdsAfterPaymentMessage: [],
                buyAdsAfterPayment: {},
                buyAdsAfterPaymentList: []
            };
        };
        case actionTypes.BUYADS_AFTER_PAYMENT_REJECT: {
            const { response = {} } = action.payload;
            const { data = {} } = response;
            const { errors = {} } = data;
            const errorsArray = Object.values(errors);

            return {
                ...state,
                buyAdsAfterPaymentList: [],
                buyAdsAfterPaymentLoading: false,
                buyAdsAfterPaymentFailed: false,
                buyAdsAfterPaymentError: true,
                buyAdsAfterPaymentMessage: errorsArray && errorsArray.length ? errorsArray : ['خطای سرور'],
                buyAdsAfterPayment: {}
            };
        };


        case actionTypes.SET_PRODUCT_ID_FROM_REGISTER_PRODUCT: {
            return {
                ...state,
                subCategoryId: action.payload.id,
                subCategoryName: action.payload.name
            }
        }

        case actionTypes.RESET_REGISTER_PRODUCT_TAB: {
            return {
                ...state,
                resetTab: action.payload.resetTab
            }
        }
        default:
            return state
    }
};