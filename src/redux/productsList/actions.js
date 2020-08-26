import {
    action,
    generateErrorAction
} from '../actions';
import actionTypes from './actionTypes';
import API from '../../apis'


export const fetchAllProductsList = (item, isSpecial) => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.productsList
                .fetchAllProductsList(item, isSpecial)
                .then(res => dispatch(success(res)))
                .catch(err => {
                    dispatch(generateErrorAction(err, {
                        failure: actionTypes.FETCH_ALL_PRODUCTS_LIST_FAILED,
                        reject: actionTypes.FETCH_ALL_PRODUCTS_LIST_REJECT
                    }));
                    throw err;
                });
        };
    };
    const loading = () => action(actionTypes.FETCH_ALL_PRODUCTS_LIST_LOADING);
    const success = res => action(actionTypes.FETCH_ALL_PRODUCTS_LIST_SUCCESSFULLY, res);

    return request();
};


export const fetchAllSpecialProductsList = (item, isSpecial) => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.productsList
                .fetchAllProductsList(item, isSpecial)
                .then(res => dispatch(success(res)))
                .catch(err => {
                    dispatch(generateErrorAction(err, {
                        failure: actionTypes.FETCH_ALL_SPECIAL_PRODUCTS_LIST_FAILED,
                        reject: actionTypes.FETCH_ALL_SPECIAL_PRODUCTS_LIST_REJECT
                    }));
                    throw err;
                });
        };
    };
    const loading = () => action(actionTypes.FETCH_ALL_SPECIAL_PRODUCTS_LIST_LOADING);
    const success = res => action(actionTypes.FETCH_ALL_SPECIAL_PRODUCTS_LIST_SUCCESSFULLY, res);

    return request();
};


export const fetchAllRelatedProducts = id => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.productsList
                .fetchAllRelatedProducts(id)
                .then(res => dispatch(success(res)))
                .catch(err => {
                    dispatch(generateErrorAction(err, {
                        failure: actionTypes.FETCH_ALL_RELATED_PRODUCTS_LIST_FAILED,
                        reject: actionTypes.FETCH_ALL_RELATED_PRODUCTS_LIST_REJECT
                    }));
                    throw err;
                });
        };
    };
    const loading = () => action(actionTypes.FETCH_ALL_RELATED_PRODUCTS_LIST_LOADING);
    const success = res => action(actionTypes.FETCH_ALL_RELATED_PRODUCTS_LIST_SUCCESSFULLY, res);

    return request();
};

export const fetchAllMyProducts = userName => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.productsList
                .fetchAllMyProducts(userName)
                .then(res => dispatch(success(res)))
                .catch(err => {
                    dispatch(generateErrorAction(err, {
                        failure: actionTypes.FETCH_ALL_MY_PRODUCTS_FAILED,
                        reject: actionTypes.FETCH_ALL_MY_PRODUCTS_REJECT
                    }));
                    throw err;
                });
        };
    };
    const loading = () => action(actionTypes.FETCH_ALL_MY_PRODUCTS_LOADING);
    const success = res => action(actionTypes.FETCH_ALL_MY_PRODUCTS_SUCCESSFULLY, res);

    return request();
};

export const editProduct = item => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.productsList
                .editProduct(item)
                .then(res => dispatch(success(res)))
                .catch(err => {
                    dispatch(generateErrorAction(err, {
                        failure: actionTypes.EDIT_PRODUCT_FAILED,
                        reject: actionTypes.EDIT_PRODUCT_REJECT
                    }));
                    throw err;
                });
        };
    };
    const loading = () => action(actionTypes.EDIT_PRODUCT_LOADING);
    const success = res => action(actionTypes.EDIT_PRODUCT_SUCCESSFULLY, res);

    return request();
};

export const deleteProduct = id => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.productsList
                .deleteProduct(id)
                .then(res => dispatch(success(res)))
                .catch(err => {
                    dispatch(generateErrorAction(err, {
                        failure: actionTypes.DELETE_PRODUCT_FAILED,
                        reject: actionTypes.DELETE_PRODUCT_REJECT
                    }));
                    throw err;
                });
        };
    };
    const loading = () => action(actionTypes.DELETE_PRODUCT_LOADING);
    const success = res => action(actionTypes.DELETE_PRODUCT_SUCCESSFULLY, res);

    return request();
};

export const fetchProductDetails = id => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.productsList
                .fetchProductDetails(id)
                .then(res => dispatch(success(res)))
                .catch(err => {
                    dispatch(generateErrorAction(err, {
                        failure: actionTypes.FETCH_PRODUCT_DETAILS_FAILED,
                        reject: actionTypes.FETCH_PRODUCT_DETAILS_REJECT
                    }));
                    throw err;
                });
        };
    };
    const loading = () => action(actionTypes.FETCH_PRODUCT_DETAILS_LOADING);
    const success = res => action(actionTypes.FETCH_PRODUCT_DETAILS_SUCCESSFULLY, res);

    return request();
};

export const setProductDetailsId = id => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.productsList
                .setProductDetailsId(id)
                .then(res => dispatch(success(res)))
                .catch(err => {
                    dispatch(generateErrorAction(err, {
                        failure: actionTypes.SET_PRODUCT_DETAILS_ID_FAILED,
                        reject: actionTypes.SET_PRODUCT_DETAILS_ID_REJECT
                    }));
                    throw err;
                });
        };
    };
    const loading = () => action(actionTypes.SET_PRODUCT_DETAILS_ID_LOADING);
    const success = res => action(actionTypes.SET_PRODUCT_DETAILS_ID_SUCCESSFULLY, res);

    return request();
};

export const fetchAllProductInfo = id => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return Promise.all([
                API.productsList.fetchProductDetails(id),
                API.productsList.fetchAllRelatedProducts(id)
            ]).then(res => {
                dispatch(success(res))
            })
                .catch(err => {
                    dispatch(generateErrorAction(err, {
                        failure: actionTypes.FETCH_ALL_PRODUCT_DETAILS_INFO_FAILED,
                        reject: actionTypes.FETCH_ALL_PRODUCT_DETAILS_INFO_REJECT
                    }));
                    throw err;
                });
        };
    };
    const loading = () => action(actionTypes.FETCH_ALL_PRODUCT_DETAILS_INFO_LOADING);
    const success = res => action(actionTypes.FETCH_ALL_PRODUCT_DETAILS_INFO_SUCCESSFULLY, res);

    return request();
};
