export function convertEnumValueToTitle(enumData, enumValue) {
  if (enumValue === undefined || enumValue === null || enumValue === '') {
    return '';
  }
  return enumData.find(x => x.value === enumValue).title;
}

export function convertEnumValueToMaxValue(enumData, enumValue) {
  if (!enumValue) {
    return '';
  }
  return enumData.find(x => x.value === enumValue).maxValue;
}
