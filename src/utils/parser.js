import React from 'react';
import { View, Text } from 'react-native';
import moment from 'moment';
import Jmoment from 'moment-jalaali';

import { deviceWidth } from './index';

export const convertToString = function (value) {
  if (typeof value === 'undefined' || value === null || value === '') {
    return value;
  }

  return value.toString();
};

export const tryParseToInt = function (value) {
  if (typeof value === 'undefined' || value === null || value === '') {
    throw new Error(`An error happened while calling tryParseInt(${value})`);
  }

  const num = parseInt(value);

  if (isNaN(num)) {
    throw new Error(`An error happened while calling tryParseInt(${value})`);
  }

  return num;
};


export const showDate = (item = {}, prevMessage = {}, style = {}) => {

  let text = '';

  if (item && !item.created_at)
    item.created_at = moment(new Date()).format('YYYY-MM-DD HH:mm');

  if (prevMessage && !prevMessage.created_at)
    prevMessage.created_at = moment(new Date()).format('YYYY-MM-DD HH:mm');


  if (!prevMessage.created_at || !item.created_at || typeof item.created_at !== 'string'
    || typeof prevMessage.created_at !== 'string' ||
    !item.created_at.length || !prevMessage.created_at.length)
    return text;

  const currentMessageDate = item.created_at.split('-')[2].split(' ')[0];
  const prevMessageDay = prevMessage.created_at.split('-')[2].split(' ')[0];
  // const prevMessageMonth = prevMessage.created_at.split('-')[1];
  // const prevMessageYear = prevMessage.created_at.split('-')[0];
  const diffBetweenMessages = Math.abs(prevMessageDay - currentMessageDate);

  // if (diffBetweenMessages >= 1 && Math.abs(prevMessageDay - (new Date().getDate())) == 0 && (prevMessageYear == new Date().getFullYear()) && (prevMessageMonth == (new Date().getMonth() + 1)))
  //     text = locales('labels.today');

  // else if (diffBetweenMessages >= 1 && Math.abs((new Date().getDate()) - prevMessageDay) <= 1 && (prevMessageYear == new Date().getFullYear()) && (prevMessageMonth == (new Date().getMonth() + 1)))
  //     text = locales('labels.yesterday');
  if (diffBetweenMessages >= 1)
    text = Jmoment(prevMessage.created_at).format('jYYYY/jMM/jDD')
  else text = '';
  if (text)
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#deeff7',
          width: deviceWidth * 0.3,
          borderRadius: 7.6,
          padding: 3,
          margin: 5,
          elevation: 1,
          alignSelf: 'center',
          ...style
        }}
      >
        <Text
          style={{
            textAlign: 'center',
            textAlignVertical: 'center',
            color: '#313a43',
            fontFamily: 'IRANSansWeb(FaNum)_Light',
            fontSize: 14,
            paddingHorizontal: 10
          }}
        >
          {text}
        </Text>
      </View>
    )
  return null;
};
