export const convertToString = function(value) {
  if (typeof value === 'undefined' || value === null || value === '') {
    return value;
  }

  return value.toString();
};

export const tryParseToInt = function(value) {
  if (typeof value === 'undefined' || value === null || value === '') {
    throw new Error(`An error happened while calling tryParseInt(${value})`);
  }

  const num = parseInt(value);

  if (isNaN(num)) {
    throw new Error(`An error happened while calling tryParseInt(${value})`);
  }

  return num;
};
