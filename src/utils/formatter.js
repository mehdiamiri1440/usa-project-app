export const toStandard = text => {
  if (!text) return text;

  let result = String(text).trim();

  result = result.split('ك').join('ک');
  result = result.split('ي').join('ی');
  result = result.split('ئ').join('ی');
  result = result.split('ؤ').join('و');
  result = result.split('ة').join('ه');

  result = result.split('۰').join('0');
  result = result.split('۱').join('1');
  result = result.split('۲').join('2');
  result = result.split('۳').join('3');
  result = result.split('۴').join('4');
  result = result.split('۵').join('5');
  result = result.split('۶').join('6');
  result = result.split('۷').join('7');
  result = result.split('۸').join('8');
  result = result.split('۹').join('9');

  return result;
};

export const toPersianDigits = text => {
  if (!text) return text;

  let result = String(text).trim();
  result = result.split('0').join('۰');
  result = result.split('1').join('۱');
  result = result.split('2').join('۲');
  result = result.split('3').join('۳');
  result = result.split('4').join('۴');
  result = result.split('5').join('۵');
  result = result.split('6').join('۶');
  result = result.split('7').join('۷');
  result = result.split('8').join('۸');
  result = result.split('9').join('۹');

  return result;
};

export const numberWithCommas = number => {
  if (number || typeof number === "number")
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  else return "";
};


export const convertedNumbersToTonUnit = (number) => {
  if (number || typeof number === "number") {
    let data = number / 1000;
    if (number < 1000) {
      return numberWithCommas(number) + " " + locales('labels.kiloGram');
    } else {
      return numberWithCommas(data) + " " + locales('labels.ton');
    }
  } else return "";
}

export const convertUnitsToText = (number) => {
  let data = number / 1000;
  let text = "";
  if (number < 1000) {
    return number + " " + locales('labels.kiloGram');
  } else {
    let ton = data.toString().split(".")[0];
    let kg = number.toString().substr(ton.length);
    kg = kg.replace(/^0+/, "");
    ton = ton + " " + locales('labels.ton');

    if (kg) {
      kg = " و " + kg + locales('labels.kiloGram');
      text = ton + kg;
    } else {
      text = ton;
    }

    return text;
  }
}
validateRegx = (input, regx) => {
  return regx.test(input);
}