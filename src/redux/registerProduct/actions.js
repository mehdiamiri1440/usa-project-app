import {
    action,
    generateErrorAction
} from '../actions';
import actionTypes from './actionTypes';
import API from '../../apis'


export const fetchAllCategories = () => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.registerProduct
                .fetchAllCategories()
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

export const addNewProduct = productObject => {
    const request = () => {
        return dispatch => {
            dispatch(loading());
            return API.registerProduct
                .addNewProduct(productObject)
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
