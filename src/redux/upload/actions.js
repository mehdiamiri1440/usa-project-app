import {
    action,
} from '../actions';
import actionTypes from './actionTypes';

export const fetchUploadPercentage = (uploadPercentage) => {
    return dispatch => dispatch(action(actionTypes.FETCH_UPLOAD_PERCENTAGE, uploadPercentage));
};

