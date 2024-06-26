import {
    action,
    generateErrorAction
} from '../actions';
import actionTypes from './actionTypes';
import API from '../../apis'


export const fetchAllCategories = (cascade_list) => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.registerProduct
                .fetchAllCategories(cascade_list)
                .then(res => dispatch(success(res)))
                .catch(err => {
                    dispatch(generateErrorAction(err, {
                        failure: actionTypes.FETCH_ALL_CATEGORIES_FAILED,
                        reject: actionTypes.FETCH_ALL_CATEGORIES_REJECT
                    }));
                    throw err;
                });
        };
    };
    const loading = () => action(actionTypes.FETCH_ALL_CATEGORIES_LOADING);
    const success = res => action(actionTypes.FETCH_ALL_CATEGORIES_SUCCESSFULLY, res);

    return request();
};

export const fetchAllSubCategories = id => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.registerProduct
                .fetchAllSubCategories(id)
                .then(res => dispatch(success(res)))
                .catch(err => {
                    dispatch(generateErrorAction(err, {
                        failure: actionTypes.FETCH_ALL_SUB_CATEGORIES_FAILED,
                        reject: actionTypes.FETCH_ALL_SUB_CATEGORIES_REJECT
                    }));
                    throw err;
                });
        };
    };
    const loading = () => action(actionTypes.FETCH_ALL_SUB_CATEGORIES_LOADING);
    const success = res => action(actionTypes.FETCH_ALL_SUB_CATEGORIES_SUCCESSFULLY, res);

    return request();
};

export const addNewProduct = (productObject, onUploadProgress) => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.registerProduct
                .addNewProduct(productObject, onUploadProgress)
                .then(res => dispatch(success(res)))
                .catch(err => {
                    dispatch(generateErrorAction(err, {
                        failure: actionTypes.ADD_NEW_PRODUCT_FAILED,
                        reject: actionTypes.ADD_NEW_PRODUCT_REJECT
                    }));
                    throw err;
                });
        };
    };
    const loading = () => action(actionTypes.ADD_NEW_PRODUCT_LOADING);
    const success = res => action(actionTypes.ADD_NEW_PRODUCT_SUCCESSFULLY, res);

    return request();
};

export const checkUserPermissionToRegisterProduct = () => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.registerProduct
                .checkUserPermissionToRegisterProduct()
                .then(res => dispatch(success(res)))
                .catch(err => {
                    dispatch(generateErrorAction(err, {
                        failure: actionTypes.CHECK_USER_PERMISSION_TO_REGISTER_PRODUCT_FAILED,
                        reject: actionTypes.CHECK_USER_PERMISSION_TO_REGISTER_PRODUCT_REJECT
                    }));
                    throw err;
                });
        };
    };
    const loading = () => action(actionTypes.CHECK_USER_PERMISSION_TO_REGISTER_PRODUCT_LOADING);
    const success = res => action(actionTypes.CHECK_USER_PERMISSION_TO_REGISTER_PRODUCT_SUCCESSFULLY, res);

    return request();
};

export const registerBuyAdRequest = requestObj => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.registerProduct
                .registerBuyAdRequest(requestObj)
                .then(res => dispatch(success(res)))
                .catch(err => {
                    dispatch(generateErrorAction(err, {
                        failure: actionTypes.REGISTER_BUYAD_REQUEST_FAILED,
                        reject: actionTypes.REGISTER_BUYAD_REQUEST_REJECT
                    }));
                    throw err;
                });
        };
    };
    const loading = () => action(actionTypes.REGISTER_BUYAD_REQUEST_LOADING);
    const success = res => action(actionTypes.REGISTER_BUYAD_REQUEST_SUCCESSFULLY, res);

    return request();
};

export const fetchBuyAdsAfterPayment = _ => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.registerProduct
                .fetchBuyAdsAfterPayment()
                .then(res => dispatch(success(res)))
                .catch(err => {
                    dispatch(generateErrorAction(err, {
                        failure: actionTypes.BUYADS_AFTER_PAYMENT_FAILED,
                        reject: actionTypes.BUYADS_AFTER_PAYMENT_REJECT
                    }));
                    throw err;
                });
        };
    };
    const loading = () => action(actionTypes.BUYADS_AFTER_PAYMENT_LOADING);
    const success = res => action(actionTypes.BUYADS_AFTER_PAYMENT_SUCCESSFULLY, res);

    return request();
};


export const setSubCategoryIdFromRegisterProduct = (id, name) => dispatch => dispatch(action(actionTypes.SET_PRODUCT_ID_FROM_REGISTER_PRODUCT, { id, name }));

export const resetRegisterProduct = resetTab => dispatch => dispatch(action(actionTypes.RESET_REGISTER_PRODUCT_TAB, { resetTab }));

export const resetRegisterRequest = resetTab => dispatch => dispatch(action(actionTypes.RESET_REGISTER_REQUEST_TAB, { resetTab }));

