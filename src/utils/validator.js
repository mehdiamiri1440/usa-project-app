import { parser, formatter } from './index';

export const MAX_MOBILE_NUMBER_LENGTH = 11;
export const MAX_NATIONAL_CODE_LENGTH = 10;
export const MAX_EMAIL_ADDRESS_LENGTH = 128;
export const MAX_NAME_LENGTH = 64;
export const DEFAULT_MIN_LENGTH = 32;
export const DEFAULT_MAX_VALUE = 10000;
export const DEFAULT_MIN_VALUE = 5;

export const isValidEmailOrUsername = text => {
  const re = /^(?!^[@\\.\\_\\-\\d])(?!.[@\.\_\-]$)(?!.[@\.\_\-]{ 2,})(?!.@+(?![a-zA-Z0-9-]\.+[a-zA-Z0-9]{2,4}))^([a-zA-Z0-9\-\_@.]{4,64})+$/;
  return re.test(text);
};

export const isWebsiteUrl = text => {
  const re = /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;
  return re.test(text);
};

export const isValidInstagramUserName = text => {
  return /^[A-Za-z_\-]{1,30}$/.test(text);
};


export const isValidDescription = text => {
  return /^(?!.*[(@#!%$&*)])[s\u{0600}-\u{06FF}\u{060C}\u{061B}\u{061F}\u{0640}\u{066A}\u{066B}\u{066C}\u{0E}_.-،:()A-Za-z0-9 ]+$/u.test(text);
};

export const isNumber = text => {
  return /^\d+$/.test(text);
};

export const isMobileNumber = (text, { typing = false } = {}) => {
  let cellRegEx = /^(\+98|0)?9\d{9}$/g;
  if (typing === true) {
    cellRegEx = /^\+?[0-9]{0,12}$/;
  }
  return cellRegEx.test(text);
};

export const isPhoneNumber = (text, { typing = false } = {}) => {
  let phoneNumberRegEx = /^(0[1-9]{1}[0-9]{1})+([1-9]{1}[0-9]{7})$/;
  if (typing === true) {
    phoneNumberRegEx = /^[0-9]{11}$/;
  }
  return phoneNumberRegEx.test(text);
};

export const isEmailAddress = (text, { typing = false } = {}) => {
  let emailAddressRegEx = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
  if (typing === true) {
    emailAddressRegEx = /^[a-zA-Z0-9_\-\.@]{1,64}$/;
  }
  return emailAddressRegEx.test(text);
};

export const isNationalCode = (text, { typing = false, foreign = false } = {}) => {
  if (!text.length) {
    return false;
  }

  let nationalCodeRegEx = /^[0-9۰-۹]{10}$/;
  let foreignCitizensCodeRegEx = /^[0-9۰-۹آابپتثجچحخدذرزژسشصضطظعغفڤقکگلمنوهیءكةئأإؤي]{10,15}$/;

  let regex;

  if (typing === true) {
    regex = foreign === false ? /^[0-9۰-۹]{1,10}$/ : /^[0-9۰-۹آابپتثجچحخدذرزژسشصضطظعغفڤقکگلمنوهیءكةئأإؤي]{1,15}$/;
  } else {
    regex = foreign === false ? nationalCodeRegEx : foreignCitizensCodeRegEx;
  }

  let maxLength = !foreign ? MAX_NATIONAL_CODE_LENGTH : 15;
  let minLength = typing ? 1 : 10;

  const isOfTypeString = typeof text === 'string';
  const isMatched = regex.test(text);
  const isLengthValid = text.length >= minLength && text.length <= maxLength;

  return isOfTypeString && isMatched && isLengthValid;
};

export const isPersianName = (text, { typing = false, maxLength = MAX_NAME_LENGTH } = {}) => {
  if (!text) {
    return false;
  }

  if (text.length > maxLength) {
    return false;
  }

  let persianChars = [
    ' ',
    'آ',
    'ا',
    'ب',
    'پ',
    'ت',
    'ث',
    'ج',
    'چ',
    'ح',
    'خ',
    'د',
    'ذ',
    'ر',
    'ز',
    'ژ',
    'س',
    'ش',
    'ص',
    'ض',
    'ط',
    'ظ',
    'ع',
    'غ',
    'ف',
    'ڤ',
    'ق',
    'ک',
    'گ',
    'ل',
    'م',
    'ن',
    'و',
    'ه',
    'ی',
    'ء'
  ];
  const arabicChars = ['ك', 'ة', 'ئ', 'أ', 'إ', 'ؤ', 'ي'];

  if (typing === true) {
    persianChars = [...persianChars, ...arabicChars];
  }

  let isValid = true;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (persianChars.indexOf(char) < 0) {
      isValid = false;
      break;
    }
  }

  return isValid;
};

export const hasMaxLength = (text, { maxLength = MAX_NAME_LENGTH } = {}) => {
  if (!text) {
    return false;
  }

  if (text.length > maxLength) {
    return false;
  }

  return true;
};

export const hasMinLength = (text, { minLength = DEFAULT_MIN_LENGTH } = {}) => {
  if (!text) {
    return false;
  }

  if (text.length < minLength) {
    return false;
  }

  return true;
};

export const hasMaxValue = (number, { maxValue = DEFAULT_MAX_VALUE } = {}) => {
  if (!number) {
    return false;
  }

  number = parser.tryParseToInt(formatter.toStandard(number));

  if (number > maxValue) {
    return false;
  }

  return true;
};

export const hasMinValue = (number, { minValue = DEFAULT_MIN_VALUE } = {}) => {
  if (!number) {
    return false;
  }

  number = parser.tryParseToInt(formatter.toStandard(number));

  if (number < minValue) {
    return false;
  }

  return true;
};
