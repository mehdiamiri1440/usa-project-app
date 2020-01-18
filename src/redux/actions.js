export const REQUEST = 'REQUEST';
export const SUCCESS = 'SUCCESS';
export const FAILURE = 'FAILURE';

export function action(type, payload = {}) {
  return {
    type,
    payload
  };
}

export function createRequestTypes(base) {
  return [REQUEST, SUCCESS, FAILURE].reduce((acc, type) => {
    acc[type] = `${base}_${type}`;
    return acc;
  }, {});
}

export function generateErrorAction(err, actionTypes) {
  switch (err.status) {
    case 'FAIL':
      return action(actionTypes.failure, err);
      break;
    case 'ERROR':
      return action(actionTypes.reject, err);
      break;
    default:
      return action(actionTypes.reject, err);
  }
}
