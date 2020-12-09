import React from 'react';
import { StyleSheet } from 'react-native';
import colors from './colors'
import fonts from './fonts'
import units from './fonts/units.js'



const styles = StyleSheet.create({
  h1: {
    fontSize: fonts.bigTitle,
    fontFamily: fonts.bold
  },
  h2: {
    fontSize: fonts.title,
    fontFamily: fonts.bold
  },
  h3: {
    fontSize: fonts.subTitle,
    fontFamily: fonts.bold
  },
  h4: {
    fontSize: fonts.smallTitle,
    fontFamily: fonts.bold
  },
  textBold: {
    fontSize: fonts.text,
    fontFamily: fonts.bold
  },
  smallTextBold: {
    fontSize: fonts.smallText,
    fontFamily: fonts.bold
  },
  p: {
    fontSize: fonts.text,
    fontFamily: fonts.medium

  },
  small: {
    fontSize: fonts.smallText,
    fontFamily: fonts.medium
  },
  textRight: {
    textAlign: 'right'
  },
  textCenter: {
    textAlign: 'center'
  },
  textLeft: {
    textAlign: 'left'
  },
  contentLeft: {
    alignSelf: 'flex-start',
    alignContent: 'flex-start',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  contentCenter: {
    alignSelf: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentRight: {
    alignSelf: 'flex-end',
    alignContent: 'flex-end',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  rtl: {
    direction: 'rtl'
  },
  ltr: {
    direction: 'ltr'
  },
  row: {
    flexDirection: 'row'
  },
  rowR: {
    flexDirection: 'row-reverse'
  },

  // Generals *******

  radius: {
    borderRadius: units.n4
  },
  radius12: {
    borderRadius: units.n12
  },
  radius50: {
    borderRadius: 500
  },




  // ‌Borders *******




  borderWhite: {
    borderColor: colors.white,
    borderWidth: units.n1
  },
  borderBlack: {
    borderColor: colors.black,
    borderWidth: units.n1
  },
  borderPrimary: {
    borderColor: colors.primary,
    borderWidth: units.n1
  },
  borderSecondary: {
    borderColor: colors.secondary,
    borderWidth: units.n1
  },
  borderSkyBlue: {
    borderColor: colors.skyBlue,
    borderWidth: units.n1
  },
  borderHardBlue: {
    borderColor: colors.hardBlue,
    borderWidth: units.n1
  },
  borderSoftBlue: {
    borderColor: colors.softBlue,
    borderWidth: units.n1
  },
  borderBlueGray: {
    borderColor: colors.blueGray,
    borderWidth: units.n1
  },
  borderLightGreen: {
    borderColor: colors.lightGreen,
    borderWidth: units.n1
  },
  borderGreen: {
    borderColor: colors.green,
    borderWidth: units.n1
  },
  borderYellow: {
    borderColor: colors.yellow,
    borderWidth: units.n1
  },
  borderRed: {
    borderColor: colors.red,
    borderWidth: units.n1
  },
  borderGray: {
    borderColor: colors.gray,
    borderWidth: units.n1
  },
  borderGray1: {
    borderColor: colors.gray1,
    borderWidth: units.n1
  },
  borderGray2: {
    borderColor: colors.gray2,
    borderWidth: units.n1
  },
  borderGray3: {
    borderColor: colors.gray3,
    borderWidth: units.n1
  },
  borderGray4: {
    borderColor: colors.gray4,
    borderWidth: units.n1
  },

  // ‌Border Left *******

  borderLeftWhite: {
    borderLeftColor: colors.white,
    borderLeftWidth: units.n1
  },
  borderLeftBlack: {
    borderLeftColor: colors.black,
    borderLeftWidth: units.n1
  },
  borderLeftPrimary: {
    borderLeftColor: colors.primary,
    borderLeftWidth: units.n1
  },
  borderLeftSecondary: {
    borderLeftColor: colors.secondary,
    borderLeftWidth: units.n1
  },
  borderLeftSkyBlue: {
    borderLeftColor: colors.skyBlue,
    borderLeftWidth: units.n1
  },
  borderLeftHardBlue: {
    borderLeftColor: colors.hardBlue,
    borderLeftWidth: units.n1
  },
  borderLeftSoftBlue: {
    borderLeftColor: colors.softBlue,
    borderLeftWidth: units.n1
  },
  borderLeftBlueGray: {
    borderLeftColor: colors.blueGray,
    borderLeftWidth: units.n1
  },
  borderLeftLightGreen: {
    borderLeftColor: colors.lightGreen,
    borderLeftWidth: units.n1
  },
  borderLeftGreen: {
    borderLeftColor: colors.green,
    borderLeftWidth: units.n1
  },
  borderLeftYellow: {
    borderLeftColor: colors.yellow,
    borderLeftWidth: units.n1
  },
  borderLeftRed: {
    borderLeftColor: colors.red,
    borderLeftWidth: units.n1
  },
  borderLeftGray: {
    borderLeftColor: colors.gray,
    borderLeftWidth: units.n1
  },
  borderLeftGray1: {
    borderLeftColor: colors.gray1,
    borderLeftWidth: units.n1
  },
  borderLeftGray2: {
    borderLeftColor: colors.gray2,
    borderLeftWidth: units.n1
  },
  borderLeftGray3: {
    borderLeftColor: colors.gray3,
    borderLeftWidth: units.n1
  },
  borderLeftGray4: {
    borderLeftColor: colors.gray4,
    borderLeftWidth: units.n1
  },

  // ‌Border Top *******

  borderTopWhite: {
    borderTopColor: colors.white,
    borderTopWidth: units.n1
  },
  borderTopBlack: {
    borderTopColor: colors.black,
    borderTopWidth: units.n1
  },
  borderTopPrimary: {
    borderTopColor: colors.primary,
    borderTopWidth: units.n1
  },
  borderTopSecondary: {
    borderTopColor: colors.secondary,
    borderTopWidth: units.n1
  },
  borderTopSkyBlue: {
    borderTopColor: colors.skyBlue,
    borderTopWidth: units.n1
  },
  borderTopHardBlue: {
    borderTopColor: colors.hardBlue,
    borderTopWidth: units.n1
  },
  borderTopSoftBlue: {
    borderTopColor: colors.softBlue,
    borderTopWidth: units.n1
  },
  borderTopBlueGray: {
    borderTopColor: colors.blueGray,
    borderTopWidth: units.n1
  },
  borderTopLightGreen: {
    borderTopColor: colors.lightGreen,
    borderTopWidth: units.n1
  },
  borderTopGreen: {
    borderTopColor: colors.green,
    borderTopWidth: units.n1
  },
  borderTopYellow: {
    borderTopColor: colors.yellow,
    borderTopWidth: units.n1
  },
  borderTopRed: {
    borderTopColor: colors.red,
    borderTopWidth: units.n1
  },
  borderTopGray: {
    borderTopColor: colors.gray,
    borderTopWidth: units.n1
  },
  borderTopGray1: {
    borderTopColor: colors.gray1,
    borderTopWidth: units.n1
  },
  borderTopGray2: {
    borderTopColor: colors.gray2,
    borderTopWidth: units.n1
  },
  borderTopGray3: {
    borderTopColor: colors.gray3,
    borderTopWidth: units.n1
  },
  borderTopGray4: {
    borderTopColor: colors.gray4,
    borderTopWidth: units.n1
  },

  // ‌Border Right *******

  borderRightWhite: {
    borderRightColor: colors.white,
    borderRightWidth: units.n1
  },
  borderRightBlack: {
    borderRightColor: colors.black,
    borderRightWidth: units.n1
  },
  borderRightPrimary: {
    borderRightColor: colors.primary,
    borderRightWidth: units.n1
  },
  borderRightSecondary: {
    borderRightColor: colors.secondary,
    borderRightWidth: units.n1
  },
  borderRightSkyBlue: {
    borderRightColor: colors.skyBlue,
    borderRightWidth: units.n1
  },
  borderRightHardBlue: {
    borderRightColor: colors.hardBlue,
    borderRightWidth: units.n1
  },
  borderRightSoftBlue: {
    borderRightColor: colors.softBlue,
    borderRightWidth: units.n1
  },
  borderRightBlueGray: {
    borderRightColor: colors.blueGray,
    borderRightWidth: units.n1
  },
  borderRightLightGreen: {
    borderRightColor: colors.lightGreen,
    borderRightWidth: units.n1
  },
  borderRightGreen: {
    borderRightColor: colors.green,
    borderRightWidth: units.n1
  },
  borderRightYellow: {
    borderRightColor: colors.yellow,
    borderRightWidth: units.n1
  },
  borderRightRed: {
    borderRightColor: colors.red,
    borderRightWidth: units.n1
  },
  borderRightGray: {
    borderRightColor: colors.gray,
    borderRightWidth: units.n1
  },
  borderRightGray1: {
    borderRightColor: colors.gray1,
    borderRightWidth: units.n1
  },
  borderRightGray2: {
    borderRightColor: colors.gray2,
    borderRightWidth: units.n1
  },
  borderRightGray3: {
    borderRightColor: colors.gray3,
    borderRightWidth: units.n1
  },
  borderRightGray4: {
    borderRightColor: colors.gray4,
    borderRightWidth: units.n1
  },

  // ‌Border Bottom *******

  borderBottomWhite: {
    borderBottomColor: colors.white,
    borderBottomWidth: units.n1
  },
  borderBottomBlack: {
    borderBottomColor: colors.black,
    borderBottomWidth: units.n1
  },
  borderBottomPrimary: {
    borderBottomColor: colors.primary,
    borderBottomWidth: units.n1
  },
  borderBottomSecondary: {
    borderBottomColor: colors.secondary,
    borderBottomWidth: units.n1
  },
  borderBottomSkyBlue: {
    borderBottomColor: colors.skyBlue,
    borderBottomWidth: units.n1
  },
  borderBottomHardBlue: {
    borderBottomColor: colors.hardBlue,
    borderBottomWidth: units.n1
  },
  borderBottomSoftBlue: {
    borderBottomColor: colors.softBlue,
    borderBottomWidth: units.n1
  },
  borderBottomBlueGray: {
    borderBottomColor: colors.blueGray,
    borderBottomWidth: units.n1
  },
  borderBottomLightGreen: {
    borderBottomColor: colors.lightGreen,
    borderBottomWidth: units.n1
  },
  borderBottomDarkGreen: {
    borderBottomColor: colors.darkGreen,
    borderBottomWidth: units.n1
  },
  borderBottomGreen: {
    borderBottomColor: colors.green,
    borderBottomWidth: units.n1
  },
  borderBottomYellow: {
    borderBottomColor: colors.yellow,
    borderBottomWidth: units.n1
  },
  borderBottomRed: {
    borderBottomColor: colors.red,
    borderBottomWidth: units.n1
  },
  borderBottomGray: {
    borderBottomColor: colors.gray,
    borderBottomWidth: units.n1
  },
  borderBottomGray1: {
    borderBottomColor: colors.gray1,
    borderBottomWidth: units.n1
  },
  borderBottomGray2: {
    borderBottomColor: colors.gray2,
    borderBottomWidth: units.n1
  },
  borderBottomGray3: {
    borderBottomColor: colors.gray3,
    borderBottomWidth: units.n1
  },
  borderBottomGray4: {
    borderBottomColor: colors.gray4,
    borderBottomWidth: units.n1
  },

  // Backgrounds *******

  bgWhite: {
    backgroundColor: colors.white,
  },
  bgBlack: {
    backgroundColor: colors.black,
  },
  bgPrimary: {
    backgroundColor: colors.primary,
  },
  bgSecondary: {
    backgroundColor: colors.secondary,
  },
  bgSkyBlue: {
    backgroundColor: colors.skyBlue,
  },
  bgHardBlue: {
    backgroundColor: colors.hardBlue,
  },
  bgSoftBlue: {
    backgroundColor: colors.softBlue,
  },
  bgBlueGray: {
    backgroundColor: colors.blueGray,
  },
  bgLightGreen: {
    backgroundColor: colors.lightGreen,
  },
  bgGreen: {
    backgroundColor: colors.green,
  },
  bgYellow: {
    backgroundColor: colors.yellow,
  },
  bgRed: {
    backgroundColor: colors.red,
  },
  bgGray: {
    backgroundColor: colors.gray,
  },
  bgGray1: {
    backgroundColor: colors.gray1,
  },
  bgGray2: {
    backgroundColor: colors.gray2,
  },
  bgGray3: {
    backgroundColor: colors.gray3,
  },
  bgGray4: {
    backgroundColor: colors.gray4,
  },

  // TextColors *******

  textWhite: {
    color: colors.white,
  },
  textBlack: {
    color: colors.black,
  },
  textPrimary: {
    color: colors.primary,
  },
  textSecondary: {
    color: colors.secondary,
  },
  textSkyBlue: {
    color: colors.skyBlue,
  },
  textHardBlue: {
    color: colors.hardBlue,
  },
  textSoftBlue: {
    color: colors.softBlue,
  },
  textBlueGray: {
    color: colors.blueGray,
  },
  textLightGreen: {
    color: colors.lightGreen,
  },
  textGreen: {
    color: colors.green,
  },
  textYellow: {
    color: colors.yellow,
  },
  textRed: {
    color: colors.red,
  },
  textGray: {
    color: colors.gray,
  },
  textGray1: {
    color: colors.gray1,
  },
  textGray2: {
    color: colors.gray2,
  },
  textGray3: {
    color: colors.gray3,
  },
  textGray4: {
    color: colors.gray4,
  },

  // Boxing -> Margin *******

  m0: {
    margin: 0
  },
  m5: {
    margin: units.n5
  },
  m7: {
    margin: units.n7
  },
  m10: {
    margin: units.n10
  },
  m15: {
    margin: units.n15
  },
  m20: {
    margin: units.n20
  },
  m25: {
    margin: units.n25
  },
  m30: {
    margin: units.n30
  },
  mv0: {
    marginVertical: 0
  },
  mv5: {
    marginVertical: units.n5
  },
  mv7: {
    marginVertical: units.n7
  },
  mv10: {
    marginVertical: units.n10
  },
  mv15: {
    marginVertical: units.n15
  },
  mv20: {
    marginVertical: units.n20
  },
  mv25: {
    marginVertical: units.n25
  },
  mv30: {
    marginVertical: units.n30
  },
  mh0: {
    marginHorizontal: 0
  },
  mh5: {
    marginHorizontal: units.n5
  },
  mh7: {
    marginHorizontal: units.n7
  },
  mh10: {
    marginHorizontal: units.n10
  },
  mh15: {
    marginHorizontal: units.n15
  },
  mh20: {
    marginHorizontal: units.n20
  },
  mh25: {
    marginHorizontal: units.n25
  },
  mh30: {
    marginHorizontal: units.n30
  },
  mLeft0: {
    marginLeft: 0
  },
  mLeft5: {
    marginLeft: units.n5
  },
  mLeft7: {
    marginLeft: units.n7
  },
  mLeft10: {
    marginLeft: units.n10
  },
  mLeft15: {
    marginLeft: units.n15
  },
  mLeft20: {
    marginLeft: units.n20
  },
  mLeft25: {
    marginLeft: units.n25
  },
  mLeft30: {
    marginLeft: units.n30
  },
  mRight0: {
    marginRight: 0
  },
  mRight5: {
    marginRight: units.n5
  },
  mRight7: {
    marginRight: units.n7
  },
  mRight10: {
    marginRight: units.n10
  },
  mRight15: {
    marginRight: units.n15
  },
  mRight20: {
    marginRight: units.n20
  },
  mRight25: {
    marginRight: units.n25
  },
  mRight30: {
    marginRight: units.n30
  },
  mTop0: {
    marginTop: 0
  },
  mTop5: {
    marginTop: units.n5
  },
  mTop7: {
    marginTop: units.n7
  },
  mTop10: {
    marginTop: units.n10
  },
  mTop15: {
    marginTop: units.n15
  },
  mTop20: {
    marginTop: units.n20
  },
  mTop25: {
    marginTop: units.n25
  },
  mTop30: {
    marginTop: units.n30
  },
  mBottom0: {
    marginBottom: 0
  },
  mBottom5: {
    marginBottom: units.n5
  },
  mBottom7: {
    marginBottom: units.n7
  },
  mBottom10: {
    marginBottom: units.n10
  },
  mBottom15: {
    marginBottom: units.n15
  },
  mBottom20: {
    marginBottom: units.n20
  },
  mBottom25: {
    marginBottom: units.n25
  },
  mBottom30: {
    marginBottom: units.n30
  },

  // Boxing -> Padding *******

  p0: {
    padding: 0
  },
  p5: {
    padding: units.n5
  },
  p7: {
    padding: units.n7
  },
  p10: {
    padding: units.n10
  },
  p15: {
    padding: units.n15
  },
  p20: {
    padding: units.n20
  },
  p25: {
    padding: units.n25
  },
  p30: {
    padding: units.n30
  },
  pv0: {
    paddingVertical: 0
  },
  pv5: {
    paddingVertical: units.n5
  },
  pv7: {
    paddingVertical: units.n7
  },
  pv10: {
    paddingVertical: units.n10
  },
  pv15: {
    paddingVertical: units.n15
  },
  pv20: {
    paddingVertical: units.n20
  },
  pv25: {
    paddingVertical: units.n25
  },
  pv30: {
    paddingVertical: units.n30
  },
  ph0: {
    paddingHorizontal: 0
  },
  ph5: {
    paddingHorizontal: units.n5
  },
  ph7: {
    paddingHorizontal: units.n7
  },
  ph10: {
    paddingHorizontal: units.n10
  },
  ph15: {
    paddingHorizontal: units.n15
  },
  ph20: {
    paddingHorizontal: units.n20
  },
  ph25: {
    paddingHorizontal: units.n25
  },
  ph30: {
    paddingHorizontal: units.n30
  },
  pLeft0: {
    paddingLeft: 0
  },
  pLeft5: {
    paddingLeft: units.n5
  },
  pLeft7: {
    paddingLeft: units.n7
  },
  pLeft10: {
    paddingLeft: units.n10
  },
  pLeft15: {
    paddingLeft: units.n15
  },
  pLeft20: {
    paddingLeft: units.n20
  },
  pLeft25: {
    paddingLeft: units.n25
  },
  pLeft30: {
    paddingLeft: units.n30
  },
  pRight0: {
    paddingRight: 0
  },
  pRight5: {
    paddingRight: units.n5
  },
  pRight7: {
    paddingRight: units.n7
  },
  pRight10: {
    paddingRight: units.n10
  },
  pRight15: {
    paddingRight: units.n15
  },
  mRight20: {
    marginRight: units.n20
  },
  pRight25: {
    paddingRight: units.n25
  },
  pRight30: {
    paddingRight: units.n30
  },
  pTop0: {
    paddingTop: 0
  },
  pTop1: {
    paddingTop: units.n1
  },
  pTop2: {
    paddingTop: units.n2
  },
  pTop3: {
    paddingTop: units.n3
  },
  pTop4: {
    paddingTop: units.n4
  },
  pTop5: {
    paddingTop: units.n5
  },
  pTop6: {
    paddingTop: units.n6
  },
  pTop7: {
    paddingTop: units.n7
  },
  pTop8: {
    paddingTop: units.n8
  },
  pTop9: {
    paddingTop: units.n9
  },
  pTop10: {
    paddingTop: units.n10
  },
  pTop15: {
    paddingTop: units.n15
  },
  pTop20: {
    paddingTop: units.n20
  },
  pTop25: {
    paddingTop: units.n25
  },
  pTop30: {
    paddingTop: units.n30
  },
  pBottom0: {
    paddingBottom: 0
  },
  pBottom5: {
    paddingBottom: units.n5
  },
  pBottom7: {
    paddingBottom: units.n7
  },
  pBottom10: {
    paddingBottom: units.n10
  },
  pBottom15: {
    paddingBottom: units.n15
  },
  pBottom20: {
    paddingBottom: units.n20
  },
  pBottom25: {
    paddingBottom: units.n25
  },
  pBottom30: {
    paddingBottom: units.n30
  },

});



export default styles;
