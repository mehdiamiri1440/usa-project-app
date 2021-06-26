import React, { Component } from 'react'
import { View, Text, Pressable, ScrollView, StyleSheet, FlatList, ActivityIndicator, BackHandler } from 'react-native';
import analytics from '@react-native-firebase/analytics';
import { connect } from 'react-redux';
import { Body, Card, CardItem, Label, InputGroup, Input, Button } from 'native-base';
import Svg, { Path, G, Circle } from "react-native-svg";

import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';

import * as registerProductActions from '../../redux/registerProduct/actions';
import * as productActions from '../../redux/registerProduct/actions';

import { deviceWidth, deviceHeight, validator, formatter } from '../../utils';
import Loading from '../Loading';

const CategoriesIcons = [
    {
        name: 'صیفی',
        svg: <Svg
            xmlns="http://www.w3.org/2000/svg"
            width="31.32"
            height="24.469"
            viewBox="0 0 31.32 24.469"
        >
            <Path
                fill="#38485f"
                d="M26.427 12.234a.612.612 0 10.612.612.612.612 0 00-.612-.612zm0 0M17.145 15.517a.612.612 0 10-.224-.836.612.612 0 00.224.836zm0 0M15.293 17.978a.612.612 0 10-.836-.224.612.612 0 00.836.224zm0 0M11.623 18.963a.612.612 0 10-.612-.612.612.612 0 00.612.612zm0 0M7.948 17.978a.612.612 0 10-.224-.836.612.612 0 00.224.836zm0 0M5.266 15.293a.612.612 0 10.224-.836.612.612 0 00-.224.836zm0 0"
            ></Path>
            <Path
                fill="#38485f"
                d="M19.189 0h-.1A12.229 12.229 0 006.852 12.234H.612a.612.612 0 00-.612.612 11.629 11.629 0 0015.3 11.027 12.218 12.218 0 003.68.6h.1A12.237 12.237 0 0019.189 0zm-2.55 12.234c0-4.68 1.049-11.011 2.447-11.011 1.788 0 2.447 8.411 2.447 11.011zm2.913 1.223a7.953 7.953 0 01-15.858 0zM17.088 1.725c-1.318 2.7-1.672 7.49-1.672 10.509h-3.059c0-3.946 1.49-8.84 4.731-10.509zm-2.588.489c-2.36 2.561-3.367 6.486-3.367 10.02H8.075A11.024 11.024 0 0114.5 2.214zM1.241 13.458h1.227a9.175 9.175 0 0018.31 0H22a10.4 10.4 0 01-20.763 0zm22.451 8.773a13.708 13.708 0 003.083-6.848.612.612 0 10-1.206-.206c-.8 4.7-3.441 8.016-6.414 8.068h-.145a4.247 4.247 0 01-1.567-.336 11.651 11.651 0 005.8-10.062.612.612 0 00-.489-.6v-.012c0-3.044-.358-7.813-1.669-10.5 2.864 1.484 4.314 5.474 4.64 8.73a.612.612 0 001.217-.122 14.1 14.1 0 00-3.254-8.1 11 11 0 010 19.993zm0 0"
            ></Path>
        </Svg>
    },
    {
        name: 'میوه',
        svg: <Svg
            xmlns="http://www.w3.org/2000/svg"
            width="27.763px"
            style={{ justifyContent: 'center', flex: 1 }}
            height="25.358px"
            viewBox="0 0 27.763 25.358"
        >
            <Path
                fill="#38485f"
                d="M23.29 4.751q.25-.091.488-.2a8.086 8.086 0 003.506-3.57.542.542 0 00-.351-.753 8.086 8.086 0 00-4.988.391 7.339 7.339 0 00-2.638 2.173 10.683 10.683 0 00-.819-2.077.542.542 0 00-.97.485 8.893 8.893 0 01.882 2.5 8.684 8.684 0 00-7.055 4.73 8.724 8.724 0 00-4.74-.171.542.542 0 00.258 1.053 7.592 7.592 0 11-5.779 7.374 7.535 7.535 0 012.276-5.422.542.542 0 10-.76-.774A8.676 8.676 0 1016.417 20.6 8.679 8.679 0 0023.29 4.751zM22.4 1.6a6.665 6.665 0 013.54-.45 6.635 6.635 0 01-2.62 2.417 5.587 5.587 0 01-1.728.469 8.665 8.665 0 00-1.618-.322A6.463 6.463 0 0122.4 1.6zm-3.313 18.336a7.581 7.581 0 01-2.239-.335 8.683 8.683 0 00-4.49-10.775 7.6 7.6 0 016.672-4.072h.057a7.591 7.591 0 110 15.183zm0 0"
            ></Path>
            <Path
                fill="#38485f"
                d="M8.676 23.19a6.507 6.507 0 10-6.507-6.507 6.513 6.513 0 006.507 6.507zm-4.2-9.937l2.728 2.728a1.559 1.559 0 00-.066.159H3.28a5.37 5.37 0 011.2-2.888zm9.592 2.888H10.21a1.66 1.66 0 00-.066-.159l2.728-2.728a5.37 5.37 0 011.197 2.887zm-1.199 3.975l-2.728-2.729a1.559 1.559 0 00.066-.159h3.862a5.371 5.371 0 01-1.2 2.888zm-3.654-3.43a.542.542 0 11-.542-.542.542.542 0 01.545.539zm-1.244 1.468a1.61 1.61 0 00.159.066v3.861a5.37 5.37 0 01-2.888-1.2zm1.244.066a1.666 1.666 0 00.159-.066l2.728 2.728a5.369 5.369 0 01-2.888 1.2zm.159-3a1.6 1.6 0 00-.159-.066v-3.861a5.371 5.371 0 012.888 1.2zm-1.244-.066a1.6 1.6 0 00-.159.066l-2.728-2.728a5.371 5.371 0 012.888-1.2zm-.992 2.077a1.634 1.634 0 00.066.159l-2.725 2.726a5.367 5.367 0 01-1.2-2.887zm0 0M4.717 9.037a.542.542 0 10.542.542.542.542 0 00-.542-.542zm0 0"
            ></Path>
        </Svg>
    },
    {
        name: 'غلات',
        svg: <Svg
            xmlns="http://www.w3.org/2000/svg"
            width="27.772"
            height="24.734"
            viewBox="0 0 27.772 24.734"
        >
            <Path
                fill="#38485f"
                d="M.542 20.612a.542.542 0 000 1.085h26.687a.542.542 0 000-1.085H24.3v-2.031a4.04 4.04 0 002.65-1.151 4.308 4.308 0 00.774-3.232.541.541 0 00-.446-.505 4.714 4.714 0 00.446-2.777.541.541 0 00-.448-.506 4.712 4.712 0 00.448-2.779.542.542 0 00-.512-.514 4.926 4.926 0 00-.742.028V5.409a.542.542 0 10-1.085 0v1.969a3.2 3.2 0 00-1.378.866 2.6 2.6 0 00-.251.332 2.635 2.635 0 00-.251-.332 3.193 3.193 0 00-1.374-.865v-1.97a.542.542 0 00-1.085 0v1.737a4.975 4.975 0 00-.745-.029.543.543 0 00-.511.51 4.715 4.715 0 00.448 2.783.541.541 0 00-.447.5 4.716 4.716 0 00.446 2.781.541.541 0 00-.406.327.536.536 0 00-.04.175 4.309 4.309 0 00.774 3.236 4.04 4.04 0 002.65 1.151v2.031h-8.784V18.02a4.04 4.04 0 002.65-1.151 4.307 4.307 0 00.775-3.232.542.542 0 00-.446-.505 4.716 4.716 0 00.446-2.777.542.542 0 00-.448-.509 4.713 4.713 0 00.448-2.779.542.542 0 00-.447-.505 4.713 4.713 0 00.447-2.778.543.543 0 00-.512-.514 5 5 0 00-.743.029V1.584a.542.542 0 00-1.085 0v1.951a3.2 3.2 0 00-1.376.866 2.615 2.615 0 00-.251.332 2.634 2.634 0 00-.251-.332 3.2 3.2 0 00-1.376-.866V1.584a.542.542 0 00-1.085 0v1.718a4.932 4.932 0 00-.743-.029.542.542 0 00-.511.51 4.716 4.716 0 00.446 2.782.541.541 0 00-.446.5 4.713 4.713 0 00.447 2.781.541.541 0 00-.447.5 4.716 4.716 0 00.446 2.781.541.541 0 00-.406.327.535.535 0 00-.04.175 4.309 4.309 0 00.774 3.236 4.04 4.04 0 002.65 1.151v2.592H4.559v-2.027a4.04 4.04 0 002.65-1.151 4.307 4.307 0 00.775-3.232.542.542 0 00-.446-.505 4.716 4.716 0 00.446-2.777.542.542 0 00-.448-.506 4.711 4.711 0 00.448-2.779.542.542 0 00-.512-.514 4.939 4.939 0 00-.745.029V5.409a.542.542 0 10-1.085 0V7.38a3.193 3.193 0 00-1.374.865 2.615 2.615 0 00-.251.332 2.633 2.633 0 00-.251-.332 3.2 3.2 0 00-1.378-.866v-1.97a.542.542 0 10-1.085 0v1.737a4.976 4.976 0 00-.742-.029.542.542 0 00-.511.51A4.713 4.713 0 00.5 10.41a.542.542 0 00-.407.327.535.535 0 00-.04.175A4.716 4.716 0 00.5 13.693a.541.541 0 00-.446.5 4.31 4.31 0 00.774 3.236 4.04 4.04 0 002.65 1.151v2.031zm21.733-6.615a2.2 2.2 0 01-.9-.572 2.907 2.907 0 01-.545-1.925 4.071 4.071 0 01.982.2l.125.047a2.012 2.012 0 01.762.508 2.85 2.85 0 01.512 1.953 4.1 4.1 0 01-.923-.2l-.014-.005zm2.959 0a4.089 4.089 0 01-.926.205 2.851 2.851 0 01.512-1.953 2.015 2.015 0 01.763-.508l.123-.046a4.061 4.061 0 01.983-.2 2.906 2.906 0 01-.545 1.925 2.2 2.2 0 01-.9.574zm.91 2.706a2.928 2.928 0 01-1.836.782 2.852 2.852 0 01.512-1.954 1.99 1.99 0 01.727-.493c.068-.024.136-.049.2-.077a4.1 4.1 0 01.938-.183 2.9 2.9 0 01-.545 1.925zM24.82 8.964a2.882 2.882 0 011.869-.753 2.906 2.906 0 01-.545 1.925 2.928 2.928 0 01-1.836.782 2.852 2.852 0 01.512-1.954zm-3.989-.753a2.882 2.882 0 011.869.753 2.852 2.852 0 01.512 1.954 2.929 2.929 0 01-1.836-.782 2.907 2.907 0 01-.545-1.925zm2.381 9.274a2.928 2.928 0 01-1.836-.782 2.906 2.906 0 01-.545-1.925 4.107 4.107 0 01.937.183c.069.028.139.054.208.078a1.986 1.986 0 01.725.492 2.852 2.852 0 01.512 1.954zm-10.855-4.07a2.168 2.168 0 01-.853-.555 2.907 2.907 0 01-.545-1.925 4.064 4.064 0 01.981.2l.126.047a2.013 2.013 0 01.762.508 2.851 2.851 0 01.512 1.954 4.082 4.082 0 01-.906-.2l-.077-.029zm2.986.028a4.081 4.081 0 01-.907.2 2.852 2.852 0 01.512-1.954 2.015 2.015 0 01.763-.508l.124-.047a4.067 4.067 0 01.983-.2 2.906 2.906 0 01-.545 1.925 2.166 2.166 0 01-.853.556l-.076.028zm-2.515-5.04a2.852 2.852 0 01.512 1.954 2.928 2.928 0 01-1.836-.782 2.905 2.905 0 01-.545-1.925 4.1 4.1 0 01.941.184c.066.027.132.052.2.075a1.991 1.991 0 01.73.494zm3.047-.568a4.1 4.1 0 01.942-.185 2.906 2.906 0 01-.545 1.925 2.928 2.928 0 01-1.836.782 2.852 2.852 0 01.512-1.954 1.99 1.99 0 01.73-.495q.1-.034.2-.074zm.4 8.307a2.928 2.928 0 01-1.836.782 2.852 2.852 0 01.512-1.954 1.984 1.984 0 01.716-.488q.113-.039.226-.085a4.124 4.124 0 01.928-.18 2.9 2.9 0 01-.545 1.925zM14.949 5.124a2.881 2.881 0 011.869-.753 2.906 2.906 0 01-.545 1.925 2.928 2.928 0 01-1.836.782 2.852 2.852 0 01.512-1.954zm-3.989-.753a2.881 2.881 0 011.869.753 2.852 2.852 0 01.512 1.954 2.929 2.929 0 01-1.836-.782 2.907 2.907 0 01-.545-1.925zm2.381 12.557a2.928 2.928 0 01-1.841-.782 2.906 2.906 0 01-.545-1.925 4.125 4.125 0 01.927.18q.114.046.227.085a1.981 1.981 0 01.715.488 2.852 2.852 0 01.512 1.954zm-10.81-2.931a2.2 2.2 0 01-.9-.572 2.906 2.906 0 01-.545-1.925 4.069 4.069 0 01.982.2l.125.047a2.013 2.013 0 01.762.508 2.852 2.852 0 01.512 1.953 4.1 4.1 0 01-.922-.2l-.015-.006zm2.96 0a4.089 4.089 0 01-.926.205 2.851 2.851 0 01.512-1.953 2.015 2.015 0 01.763-.503l.123-.046a4.061 4.061 0 01.983-.2 2.906 2.906 0 01-.546 1.924 2.2 2.2 0 01-.9.574h-.007zm.91 2.706a2.928 2.928 0 01-1.836.782 2.852 2.852 0 01.512-1.954 1.99 1.99 0 01.723-.485c.068-.024.136-.049.2-.077a4.1 4.1 0 01.938-.183 2.9 2.9 0 01-.538 1.921zM5.077 8.968a2.882 2.882 0 011.869-.753 2.906 2.906 0 01-.546 1.924 2.928 2.928 0 01-1.836.782 2.852 2.852 0 01.512-1.954zm-3.989-.753a2.882 2.882 0 011.869.753 2.852 2.852 0 01.512 1.954 2.929 2.929 0 01-1.836-.782 2.907 2.907 0 01-.545-1.925zm2.381 9.274a2.928 2.928 0 01-1.836-.782 2.906 2.906 0 01-.545-1.925 4.107 4.107 0 01.937.183c.069.028.139.054.208.078a1.986 1.986 0 01.725.492 2.852 2.852 0 01.512 1.954zm0 0M27.229 23.649H16.055a.542.542 0 100 1.085h11.174a.542.542 0 000-1.085zm0 0M.542 24.734h11.174a.542.542 0 100-1.085H.542a.542.542 0 100 1.085zm0 0"
            ></Path>
            <Path
                fill="#38485f"
                d="M13.888 3a.543.543 0 00.542-.542V.542a.542.542 0 10-1.085 0v1.92a.543.543 0 00.543.538zm0 0M4.015 6.83a.543.543 0 00.542-.542v-1.92a.542.542 0 00-1.085 0v1.919a.542.542 0 00.543.543zm0 0M23.762 6.83a.543.543 0 00.542-.542v-1.92a.542.542 0 00-1.085 0v1.919a.542.542 0 00.543.543zm0 0M13.512 23.808a.542.542 0 10.383-.159.545.545 0 00-.383.159zm0 0"
            ></Path>
        </Svg>
    },
    {
        name: 'خشکبار',
        svg: <Svg
            xmlns="http://www.w3.org/2000/svg"
            width="45.32"
            height="35.469"
            viewBox="0 0 93.992 96.15"
        >
            <G stroke="#38485f" transform="translate(-67.575 -2.51)">
                <G
                    data-name="mini pistacho"
                    transform="scale(-1) rotate(-85.99 -88.505 39.14)"
                >
                    <Path
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M19.95 47.36s11.96-8.853 16.305-19.157.565-20.084-7.06-22.846-15.93.493-20.133 10.76-3.649 24.73-3.649 24.73l21.08-28.883z"
                        data-name="Path 320"
                    ></Path>
                    <Path
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M33.618 21.986a20.914 20.914 0 00-.346-4.823 14.7 14.7 0 00-1.281-2.53"
                        data-name="Path 321"
                    ></Path>
                    <G
                        fill="#fff"
                        strokeWidth="1"
                        data-name="Ellipse 42"
                        transform="translate(32.394 24.402)"
                    >
                        <Circle cx="1" cy="1" r="1" stroke="none"></Circle>
                        <Circle cx="1" cy="1" r="0.5" fill="none"></Circle>
                    </G>
                    <G
                        fill="#fff"
                        strokeWidth="1"
                        data-name="Ellipse 43"
                        transform="translate(31.295 27.15)"
                    >
                        <Circle cx="1" cy="1" r="1" stroke="none"></Circle>
                        <Circle cx="1" cy="1" r="0.5" fill="none"></Circle>
                    </G>
                    <Path
                        fill="none"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                        d="M10.047 35.304s.986 6.484 4.147 7.378 6.74-2.461 6.74-2.461"
                        data-name="Path 322"
                    ></Path>
                </G>
                <G data-name="big pistacho" transform="translate(-123 2)">
                    <Path
                        fill="#fff"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3.5"
                        d="M240.36 8.229s21.757 16.108 29.661 34.857 1.028 36.542-12.847 41.565-28.981-.895-36.627-19.575-6.637-44.995-6.637-44.995l38.351 52.546z"
                        data-name="Path 320"
                    ></Path>
                    <Path
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M265.227 54.4s.188 6.512-.63 8.774a26.756 26.756 0 01-2.331 4.6"
                        data-name="Path 321"
                    ></Path>
                    <G
                        fill="#fff"
                        strokeWidth="3"
                        data-name="Ellipse 42"
                        transform="translate(262 47)"
                    >
                        <Circle cx="1.5" cy="1.5" r="1.5" stroke="none"></Circle>
                        <Circle cx="1.5" cy="1.5" fill="none"></Circle>
                    </G>
                    <G
                        fill="#fff"
                        strokeWidth="3"
                        data-name="Ellipse 43"
                        transform="translate(260 41)"
                    >
                        <Circle cx="1.5" cy="1.5" r="1.5" stroke="none"></Circle>
                        <Circle cx="1.5" cy="1.5" fill="none"></Circle>
                    </G>
                    <Path
                        fill="none"
                        strokeLinecap="round"
                        strokeWidth="3.5"
                        d="M222.34 30.164s1.794-11.8 7.547-13.425 12.264 4.478 12.264 4.478"
                        data-name="Path 322"
                    ></Path>
                </G>
            </G>
        </Svg>
    },
    {
        name: 'ادویه',
        svg: <Svg
            xmlns="http://www.w3.org/2000/svg"
            width="40.32"
            height="30.469"
            viewBox="0 0 75.294 76.826"
        >
            <G transform="translate(-222.566 -106.174)">
                <G
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    data-name="Path 333"
                >
                    <Path
                        d="M5253.566 13937.394c4.395-1.9 36.212-7.03 69.294.43-1.331 20.542-14.746 29.009-14.746 29.009h-39.672s-14.156-8.596-14.876-29.439z"
                        transform="translate(-5028 -13793)"
                    ></Path>
                    <Path
                        fill="#38485f"
                        d="M5285.99 13933.902c-17.004 0-29.758 2.342-32.424 3.492.72 20.843 14.876 29.438 14.876 29.438h39.672s13.416-8.467 14.746-29.009c-13.017-2.935-25.838-3.92-36.87-3.92m0-3c13.15 0 25.777 1.343 37.53 3.993a3.001 3.001 0 012.334 3.122c-.323 4.995-1.355 9.739-3.066 14.1a41.22 41.22 0 01-5.401 9.715c-3.808 5.067-7.515 7.438-7.672 7.536a2.996 2.996 0 01-1.6.463h-39.673a3 3 0 01-1.557-.436c-.164-.1-4.069-2.501-7.996-7.647a39.565 39.565 0 01-5.497-9.892c-1.698-4.442-2.648-9.274-2.824-14.36a3 3 0 011.81-2.858c1.854-.8 6.205-1.696 11.64-2.398 4.731-.61 12.384-1.339 21.972-1.339z"
                        transform="translate(-5028 -13793)"
                    ></Path>
                </G>
                <Path
                    fill="none"
                    stroke="#38485f"
                    strokeLinecap="round"
                    strokeWidth="3"
                    d="M256.543 108.162s-1.269 2.771 3.318 5.76"
                    data-name="Path 334"
                ></Path>
                <Path
                    fill="none"
                    stroke="#38485f"
                    strokeLinecap="round"
                    strokeWidth="3"
                    d="M251.24 117.071s-.962-2.892-6.355-1.95"
                    data-name="Path 336"
                ></Path>
                <Path
                    fill="none"
                    stroke="#38485f"
                    strokeLinecap="round"
                    strokeWidth="3"
                    d="M256.402 122.19s5.32.338 9.655-5.896"
                    data-name="Path 335"
                ></Path>
                <Path
                    fill="none"
                    stroke="#38485f"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M285.665 137.489s8.75-16.264 8.933-16.971.7-3.183-1.27-4.51a3.925 3.925 0 00-4.67.441c-.591.557-17.488 19.61-17.488 19.61"
                    data-name="Path 337"
                ></Path>
                <G
                    fill="none"
                    stroke="#38485f"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    data-name="Rectangle 182"
                    transform="translate(241 177)"
                >
                    <Path stroke="none" d="M0 0H39V3H0z"></Path>
                    <Path d="M-1.5 -1.5H40.5V4.5H-1.5z"></Path>
                </G>
                <G
                    fill="#38485f"
                    stroke="#38485f"
                    strokeWidth="1"
                    data-name="Ellipse 45"
                    transform="translate(276 153)"
                >
                    <Circle cx="2" cy="2" r="2" stroke="none"></Circle>
                    <Circle cx="2" cy="2" r="1.5" fill="none"></Circle>
                </G>
                <G
                    fill="#38485f"
                    stroke="#38485f"
                    strokeWidth="1"
                    data-name="Ellipse 46"
                    transform="translate(283 157)"
                >
                    <Circle cx="2" cy="2" r="2" stroke="none"></Circle>
                    <Circle cx="2" cy="2" r="1.5" fill="none"></Circle>
                </G>
                <G
                    fill="#38485f"
                    stroke="#38485f"
                    strokeWidth="1"
                    data-name="Ellipse 47"
                    transform="translate(277 164)"
                >
                    <Circle cx="2" cy="2" r="2" stroke="none"></Circle>
                    <Circle cx="2" cy="2" r="1.5" fill="none"></Circle>
                </G>
                <G
                    fill="#38485f"
                    stroke="#38485f"
                    strokeWidth="1"
                    data-name="Ellipse 48"
                    transform="translate(269 158)"
                >
                    <Circle cx="2" cy="2" r="2" stroke="none"></Circle>
                    <Circle cx="2" cy="2" r="1.5" fill="none"></Circle>
                </G>
                <G
                    fill="#38485f"
                    stroke="#38485f"
                    strokeWidth="1"
                    data-name="Ellipse 49"
                    transform="translate(266 167)"
                >
                    <Circle cx="2" cy="2" r="2" stroke="none"></Circle>
                    <Circle cx="2" cy="2" r="1.5" fill="none"></Circle>
                </G>
                <Path
                    fill="none"
                    stroke="#38485f"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M242.989 122.814s7.54-1.746 10.552 4.391 5.218 6.729 5.218 6.729-22.191 4.157-18.331-9.054c5.487 3.615 8.543 5.19 8.543 5.19s-9.46-6.035-11.062-8.18"
                    data-name="Path 338"
                ></Path>
            </G>
        </Svg>
    },
    {
        name: 'دامپروری',
        svg: <Svg
            xmlns="http://www.w3.org/2000/svg"
            width="40.32"
            height="30.469"
            viewBox="0 0 70.101 58.362"
        >
            <G transform="translate(-106.949 -121.899)">
                <G fill="#fff">
                    <Path
                        d="M10.543 50.286a51.32 51.32 0 01-4.86-6.548c-1.69-2.705-3.033-5.436-3.994-8.119-1.186-3.312-1.788-6.556-1.788-9.642 0-2.567.881-6.345 2.547-10.927a82.328 82.328 0 012.584-6.287l.186-.394-.054-.432C5.16 7.904 4.745 4.19 6.65 2.046 7.588.99 8.943.478 10.795.478c2.13 0 3.743.595 4.794 1.77 1.93 2.156 1.564 5.668 1.56 5.703l-.052.416.173.369c.048.106 4.792 10.772 4.792 17.24 0 3.087-.653 6.332-1.94 9.647-1.042 2.687-2.5 5.423-4.334 8.132a51.689 51.689 0 01-5.245 6.531z"
                        transform="translate(131 127.807)"
                    ></Path>
                    <Path
                        fill="#38485f"
                        d="M10.795 1.978c-2.072 0-2.784.795-3.017 1.057-1.2 1.342-1.22 3.853-1.124 4.723l.115.841-.381.805C5 12.338 1.4 21.033 1.4 25.977c0 2.901.568 5.962 1.686 9.098.919 2.574 2.208 5.2 3.83 7.807a50.307 50.307 0 003.672 5.136 50.624 50.624 0 003.957-5.103c1.77-2.617 3.176-5.252 4.178-7.834 1.22-3.142 1.838-6.205 1.838-9.104 0-5.098-3.365-13.732-4.66-16.628l-.34-.756.098-.823c.07-.593.075-3.1-1.181-4.513-.766-.86-1.97-1.28-3.684-1.28m0-3c8.923 0 7.844 9.145 7.844 9.145s4.923 10.983 4.923 17.855c0 14.346-13.062 26.478-13.062 26.478S-1.599 40.323-1.599 25.977c0-6.7 5.275-17.855 5.275-17.855s-1.137-9.144 7.12-9.144z"
                        transform="translate(131 127.807)"
                    ></Path>
                </G>
                <G fill="none" stroke="#38485f" strokeLinecap="round" strokeWidth="3">
                    <Path
                        d="M9 0L0 0"
                        data-name="Line 33"
                        transform="translate(137.5 153.5)"
                    ></Path>
                    <Path
                        d="M19 0L0 0"
                        data-name="Line 34"
                        transform="translate(132.5 162.5)"
                    ></Path>
                    <Path
                        d="M11 0L0 0"
                        data-name="Line 35"
                        transform="translate(136.5 170.5)"
                    ></Path>
                </G>
                <G fill="none" stroke="#38485f" strokeLinecap="round" strokeWidth="3">
                    <Path
                        d="M142.157 126.99s.01-4.575 7.88-3.394"
                        data-name="Path 342"
                    ></Path>
                    <Path
                        d="M142.037 126.99s-.01-4.575-7.88-3.394"
                        data-name="Path 343"
                    ></Path>
                </G>
                <G fill="#fff">
                    <G data-name="Path 340">
                        <Path
                            d="M9.492 35.333c-.946 0-2.187-.427-3.405-1.17-1.022-.625-2.517-1.773-3.83-3.694-1.38-2.02-2.204-4.361-2.446-6.958-.29-3.121.277-6.536 1.685-10.152l.006-.015.006-.016.082-.22v-.004l.002-.003c1.95-5.334 6.103-9.739 8.08-11.625a75.264 75.264 0 013.953 5.13c3.243 4.625 5.198 8.665 5.652 11.683l.012.084.022.082c1.618 6.022-.14 10.02-1.898 12.313a12.609 12.609 0 01-4.078 3.45c-1.34.708-2.741 1.115-3.843 1.115z"
                            transform="rotate(-45.97 236.915 -88.17)"
                        ></Path>
                        <Path
                            fill="#38485f"
                            d="M9.56 3.7C7.514 5.83 4.532 9.427 3 13.617l-.002.006-.003.007-.078.21-.012.033-.012.032C1.57 17.3 1.036 20.485 1.305 23.372c.218 2.34.955 4.443 2.19 6.251 1.163 1.7 2.477 2.711 3.374 3.26 1.148.7 2.107.95 2.623.95 1.422 0 4.508-1.08 6.73-3.978a10.637 10.637 0 002.012-4.493c.383-1.98.258-4.174-.371-6.518l-.045-.164-.025-.168c-.418-2.783-2.278-6.593-5.377-11.016A72.482 72.482 0 009.56 3.701M9.8-.667s9.762 10.775 10.959 18.733c3.35 12.473-6.298 18.767-11.268 18.767-4.971 0-15.522-8.29-9.393-24.018l.084-.229C2.948 5.02 9.801-.667 9.801-.667z"
                            transform="rotate(-45.97 236.915 -88.17)"
                        ></Path>
                    </G>
                    <G data-name="Path 341">
                        <Path
                            d="M11.435 35.356c-1.978-1.891-6.137-6.306-8.08-11.624l-.001-.003-.002-.003-.082-.222-.005-.015-.006-.015c-1.409-3.615-1.976-7.03-1.685-10.152.242-2.597 1.065-4.938 2.446-6.958 1.313-1.92 2.807-3.068 3.83-3.693 1.218-.744 2.459-1.17 3.404-1.17 2.197-.001 5.623 1.567 7.921 4.564 1.76 2.294 3.516 6.291 1.899 12.313l-.022.082-.013.084c-.455 3.025-2.416 7.075-5.672 11.712a75.185 75.185 0 01-3.932 5.1z"
                            transform="rotate(-134.03 97.659 59.05)"
                        ></Path>
                        <Path
                            fill="#38485f"
                            d="M11.326 33.128a72.61 72.61 0 002.813-3.734c3.123-4.448 4.996-8.277 5.417-11.073l.025-.168.044-.164c.63-2.344.755-4.537.372-6.517a10.636 10.636 0 00-2.012-4.494C15.763 4.08 12.677 3 11.255 3c-.516 0-1.476.25-2.623.95-.897.549-2.211 1.56-3.374 3.26-1.235 1.808-1.972 3.911-2.19 6.252-.27 2.886.265 6.071 1.588 9.467l.012.029.01.03.08.216.003.007.003.007c1.522 4.166 4.512 7.773 6.562 9.91m.238 4.372S4.71 31.813 1.946 24.247l-.085-.229C-4.267 8.29 6.284 0 11.254 0c4.97 0 14.619 6.294 11.269 18.767C21.326 26.725 11.564 37.5 11.564 37.5z"
                            transform="rotate(-134.03 97.659 59.05)"
                        ></Path>
                    </G>
                </G>
            </G>
        </Svg>
    },
];



class RegisterRequest extends Component {
    constructor(props) {
        super(props)
        this.state = {
            disableSubCategory: true,
            amountError: '',
            amount: '',
            amountText: '',
            category: '',
            subCategory: '',
            productTypeError: '',
            categoryError: '',
            subCategoryError: '',
            productType: '',
            isFocused: false,
            loaded: false,
            categoriesList: [],
            subCategoriesList: [],
            amountClicked: false,
            productTypeClicked: false,
            selectedSvgName: ''
        }
    }

    amountRef = React.createRef();
    productTypeRef = React.createRef();

    isComponentMounted = false;

    componentDidMount() {
        this.isComponentMounted = true;
        if (this.isComponentMounted) {
            analytics().logEvent('register_buyAd')
            global.resetRegisterProduct = data => {
                if (data) {
                    this.props.navigation.navigate('RegisterRequest')
                }
            }
            if (this.props.resetTab) {
                this.props.resetRegisterProduct(false);
                this.props.navigation.navigate('RegisterRequest')
            }
            this.props.fetchAllCategories().then(_ => {
                const { category, subCategory, productType, categoriesList } = this.props;

                if (this.productTypeRef && this.productTypeRef.current)
                    this.productTypeRef.current.value = productType;

                this.setState({
                    category, subCategory, productType,
                    subCategoriesTogether: categoriesList.map(item => item.subcategories),
                    categoriesList,
                    loaded: true,
                    subCategoriesList: category && categoriesList && categoriesList.length ?
                        Object.values(categoriesList.find(item => item.id == category).subcategories)
                        : []
                })

            });

            BackHandler.addEventListener('hardwareBackPress', this.handleHardWareBackButtonPressed)
        }
    }


    componentWillUnmount() {
        this.isComponentMounted = false;
        BackHandler.removeEventListener('hardwareBackPress', this.handleHardWareBackButtonPressed);
    }

    handleHardWareBackButtonPressed = _ => {

        const {
            category,
            subCategory,
        } = this.state;

        if (subCategory && category) {
            this.setState({ subCategory: '' })
            return true;
        }

        if (category) {
            this.setState({ category: '' })
            return true;
        }

        return false;
    };

    emptyState = () => {
        this.setState({
            amountError: '',
            amount: '',
            amountText: '',
            category: '',
            amountClicked: false,
            productTypeClicked: false,
            subCategory: '',
            productTypeError: '',
            categoryError: '',
            subCategoryError: '',
            productType: '',
            isFocused: false,
            loaded: false,
            selectedSvgName: ''
        })
    }


    // setCategory = (value) => {
    //     this.setState({ disableSubCategory: true })
    //     let { categoriesList = [] } = this.props;
    //     if (categoriesList.length && value) {
    //         this.setState({ category: value, categoryError: '', subCategoryError: '', subCategory: '' })
    //         this.props.fetchAllSubCategories(categoriesList.some(item => item.id == value) ? categoriesList.find(item => item.id == value).id : undefined).then(_ => {
    //             this.setState({ disableSubCategory: false })
    //         })
    //     }
    // };


    // setSubCategory = (value) => {
    //     if (!!value)
    //         this.setState({
    //             subCategoryError: '', subCategory: value
    //         }, () => {
    //         })
    // };



    onAmountSubmit = field => {
        this.setState(() => ({
            amountError: '',
            amount: field,
            amountClicked: true
        }));
        if (field) {
            if (!validator.isNumber(field)) {
                this.setState(() => ({
                    amountError: "لطفا  فقط عدد وارد کنید",
                    amountClicked: true
                }));
            }
            if (field >= 1000000000) {
                this.setState(() => ({
                    amountError: locales('errors.filedShouldBeLessThanMillion', { fieldName: locales('titles.qunatityAmount') }),
                    amountClicked: true
                }));
            }
            if (field <= 0) {
                this.setState(() => ({
                    amountError: locales('errors.canNotBeZero', { fieldName: locales('titles.qunatityAmount') }),
                    amountClicked: true
                }));
            }
            if (!this.amountError) {
                this.setState(() => ({
                    amountText: formatter.convertUnitsToText(field),
                    amountClicked: true
                }));
            }
        } else {
            this.setState(() => ({
                amount: '',
                amountText: '',
                amountClicked: false
            }));
        }
    }



    onProductTypeSubmit = (field) => {
        this.setState(() => ({
            productTypeClicked: !!field,
            productType: field,
            productTypeError: (!field || validator.isPersianNameWithDigits(field)) ?
                '' : locales('titles.productTypeInvalid')
        }));
    };

    onSubmit = () => {

        let { productType, category, subCategory, amount } = this.state;
        let productTypeError = '', categoryError = '', subCategoryError = '', amountError = '';

        if (!amount) {
            amountError = locales('errors.pleaseEnterField', { fieldName: locales('titles.amountNeeded') })
        }
        else if (amount && (amount <= 0 || amount >= 1000000000)) {
            amountError = locales('errors.filedShouldBeGreaterThanZero', { fieldName: locales('titles.amountNeeded') })
        }
        else {
            amountError = '';
        }


        // if (!productType) {
        //     productTypeError = locales('titles.productTypeEmpty');
        // }
        if (productType && !validator.isPersianNameWithDigits(productType)) {
            productTypeError = locales('titles.productTypeInvalid');
        }
        else {
            productTypeError = '';
        }

        if (!category) {
            categoryError = locales('titles.categoryError');
        }
        else {
            categoryError = '';
        }

        if (!subCategory) {
            subCategoryError = locales('titles.productNameError');
        }
        else {
            subCategoryError = '';
        }
        this.setState({ productTypeError, subCategoryError, categoryError, productTypeError, amountError, amountClicked: true })
        if (!categoryError && !subCategoryError && !amountError && !productTypeError) {
            let requestObj = {
                name: productType,
                requirement_amount: amount,
                category_id: subCategory
            };
            this.props.registerBuyAdRequest(requestObj).then(result => {
                this.emptyState();
                this.props.navigation.navigate('RegisterRequestSuccessfully');
            })
        }
    }

    setSelectedSubCategory = (id, isSub, index) => {
        const { subCategoriesTogether, subCategoriesList, categoriesList } = this.state;
        if (!isSub) {
            let selectedSubs = [];
            subCategoriesTogether.forEach(item => {
                selectedSubs.push(Object.values(item).filter(sub => sub.parent_id == id))
            })
            selectedSubs = selectedSubs.filter(item => item && item.length).flatMap(item => item)
            this.setState({
                subCategoriesList: selectedSubs, category: id,
                selectedSvgName: categoriesList.find(item => item.id == id).category_name
            });
        }
        else {
            this.setState({
                subCategory: id,
                subCategoryName: subCategoriesList && subCategoriesList.length ? subCategoriesList.find(item => item.id == id).category_name : ''
            })
        }
    };


    renderItem = ({ item, index }) => {
        return (
            <Pressable
                android_ripple={{
                    color: '#ededed'
                }}
                style={{
                    width: deviceWidth,
                    borderBottomWidth: 1,
                    borderBottomColor: '#E0E0E0',
                    justifyContent: 'space-between',
                    padding: 20,
                    flexDirection: 'row-reverse'
                }}
                onPress={_ => this.setSelectedSubCategory(item.id, !item.subcategories, index)}
            >
                <View
                    style={{
                        flexDirection: 'row-reverse',
                    }}
                >
                    <Text
                        style={{
                            color: '#38485F',
                            fontFamily: 'IRANSansWeb(FaNum)_Bold',
                            marginHorizontal: 15,
                            fontSize: 18
                        }}
                    >
                        {item.category_name}
                    </Text>
                </View>
                <FontAwesome5 name='angle-left' size={25} color='gray' />
            </Pressable>

        )
    };

    subCategoriesListFooterComponent = _ => {
        return (
            <View
                style={{ marginVertical: 20, alignSelf: 'flex-end' }}
            >
                <Button
                    onPress={() => this.setState({ category: '' })}
                    style={[styles.backButtonContainer, { elevation: 0, flex: 1, marginRight: 30, width: '37%' }]}
                    rounded
                >
                    <Text style={styles.backButtonText}>{locales('titles.previousStep')}</Text>
                    <FontAwesome5 name='arrow-right' size={14} color='#7E7E7E' />
                </Button>
            </View>
        )
    };


    renderListEmptyComponent = _ => {

        const {
            categoriesLoading
        } = this.props;

        return (
            !categoriesLoading ? <View style={{
                alignSelf: 'center', justifyContent: 'center',
                alignContent: 'center', alignItems: 'center',
                width: deviceWidth, height: deviceHeight * 0.7
            }}>
                <FontAwesome5 name='list-alt' size={80} color='#BEBEBE' solid />
                <Text style={{
                    color: '#7E7E7E', fontFamily: 'IRANSansWeb(FaNum)_Bold',
                    fontSize: 17, padding: 15, textAlign: 'center'
                }}>
                    {locales('labels.emptyList')}</Text>
            </View> : null
        )
    };

    handleProductTypeExample = _ => {
        const {
            selectedSvgName
        } = this.state;

        switch (selectedSvgName) {
            case 'میوه': {
                return locales('titles.mazafati');
            };
            case 'صیفی': {
                return locales('titles.matinSaderati');
            };
            case 'غلات': {
                return locales('titles.hendi1121');
            };
            case 'خشکبار': {
                return locales('titles.pesteFandoghi');
            };
            case 'ادویه': {
                return locales('titles.zaferanNegini');
            };
            case 'دامپروری': {
                return locales('titles.asalChehelGiyah');
            };
            default:
                return locales('titles.mazafati');
        }
    };


    render() {


        let { subCategoriesLoading, categoriesLoading,
            registerBuyAdRequestMessage, registerBuyAdRequestError } = this.props;

        let {
            productType, category, subCategory,
            subCategoryError, categoryError, productTypeError,
            amountError,
            subCategoriesList, categoriesList,
            amount, productTypeClicked, amountClicked, selectedSvgName,
            amountText
        } = this.state;

        const categoryIcon = categoriesList && categoriesList.length && category ?
            categoriesList.some(item => item.category_name == selectedSvgName) ?
                CategoriesIcons.find(item => item.name == selectedSvgName)?.svg : null : null

        return (
            <>

                <View style={{
                    backgroundColor: 'white',
                    flexDirection: 'row',
                    alignContent: 'center',
                    alignItems: 'center',
                    height: 45,
                    elevation: 5,
                    justifyContent: 'center'
                }}>

                    <View style={{
                        width: '100%',
                        alignItems: 'center'
                    }}>
                        <Text
                            style={{ fontSize: 18, fontFamily: 'IRANSansWeb(FaNum)_Bold' }}
                        >
                            {locales('labels.registerRequest')}
                        </Text>
                    </View>
                </View>

                {registerBuyAdRequestError && registerBuyAdRequestMessage && registerBuyAdRequestMessage.length ?
                    registerBuyAdRequestMessage.map((error, index) => (
                        <View
                            style={{
                                width: deviceWidth, justifyContent: 'center', alignItems: 'center',
                                alignContent: 'center'
                            }}
                            key={index}
                        >
                            <Text style={{
                                width: '100%',
                                color: '#E41C38',
                                textAlign: 'center',
                                marginVertical: 10,
                                paddingHorizontal: 15,
                                fontFamily: 'IRANSansWeb(FaNum)_Light',
                                paddingVertical: 5,
                                borderRadius: 4
                            }}
                            >{error}
                            </Text>
                        </View>
                    ))
                    : null}
                <View
                    style={{ backgroundColor: 'white', flex: 1 }}>
                    <ScrollView>

                        <View style={{
                            alignItems: 'flex-start', justifyContent: 'flex-start', flexDirection: 'row-reverse',
                            textAlign: 'center',
                            elevation: 0, backgroundColor: '#e6f4f8', borderRadius: 6, padding: 20
                        }} transparent>
                            <FontAwesome5
                                color='#333333'
                                name='exclamation-circle'
                                size={15}
                            />
                            <Text style={{ marginHorizontal: 10, color: '#E51C38', fontSize: 15, fontFamily: 'IRANSansWeb(FaNum)_Medium' }}>
                                {locales('titles.doYouWishToBuy')} <Text
                                    style={{
                                        fontSize: 15,
                                        color: '#333333',
                                        fontFamily: 'IRANSansWeb(FaNum)_Medium'
                                    }}
                                >
                                    {locales('titles.registerRequestNow')}
                                </Text>
                            </Text>
                        </View>


                        <View style={{ padding: 0 }}>
                            {!category || !subCategory ? <>
                                <Text style={{
                                    borderBottomColor: '#CCC',
                                    borderBottomWidth: 1,
                                    padding: 15,
                                    width: '100%',
                                    fontSize: 18,
                                    color: '#555555',
                                    fontFamily: 'IRANSansWeb(FaNum)_Medium'
                                }}>
                                    {locales('titles.registerBuyAdRequest')}
                                </Text>
                                <View
                                    style={{
                                        padding: 2,
                                        marginVertical: 20,
                                        paddingHorizontal: 10,
                                        flexDirection: 'row-reverse'
                                    }}
                                >
                                    <Text>{categoryIcon}</Text>
                                    <Text style={{
                                        fontSize: 20,
                                        color: '#333',
                                        fontFamily: 'IRANSansWeb(FaNum)_Medium'
                                    }}>  {locales('labels.chooseProductCategory')}</Text>

                                </View>
                            </> : null}

                            {!category ?
                                <FlatList
                                    data={categoriesList}
                                    ListEmptyComponent={this.renderListEmptyComponent}
                                    keyExtractor={(item) => item.id.toString()}
                                    renderItem={this.renderItem}
                                />
                                : null}

                            {
                                !subCategory && category ?
                                    <FlatList
                                        data={subCategoriesList}
                                        ListEmptyComponent={this.renderListEmptyComponent}
                                        keyExtractor={(item) => item.id.toString()}
                                        renderItem={this.renderItem}
                                        ListFooterComponent={this.subCategoriesListFooterComponent}
                                    />
                                    : null
                            }

                            {categoriesLoading ? <ActivityIndicator size={50} color="#00C569" style={{ marginTop: deviceHeight * 0.13 }}
                                animating={categoriesLoading} /> : null}

                            {
                                category && subCategory ?
                                    <View style={{
                                        paddingHorizontal: 15
                                    }}
                                    >
                                        <Text
                                            style={{
                                                color: '#333',
                                                marginTop: 20,
                                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                                fontSize: 18
                                            }}
                                        >
                                            {`${locales('titles.type')} `}
                                            <Text
                                                style={{
                                                    color: '#21AD93', paddingHorizontal: 50,
                                                    fontFamily: 'IRANSansWeb(FaNum)_Medium', fontSize: 18
                                                }}
                                            >
                                                {
                                                    subCategoriesList && subCategoriesList.length ?
                                                        subCategoriesList.find(item => item.id == subCategory).category_name
                                                        : null
                                                }
                                            </Text>
                                            <Text
                                                style={{
                                                    marginHorizontal: 10, color: '#333',
                                                    fontFamily: 'IRANSansWeb(FaNum)_Medium', fontSize: 18
                                                }}
                                            >
                                                {` ${locales('titles.enterYouNeed')}.`}
                                            </Text>
                                        </Text>

                                        <Text
                                            style={{
                                                marginVertical: 10,
                                                color: '#777777',
                                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                                fontSize: 16
                                            }}
                                        >
                                            {locales('titles.productTypeExample', { fieldName: this.handleProductTypeExample() })}
                                        </Text>
                                        <InputGroup
                                            regular
                                            style={{
                                                borderRadius: 4,
                                                borderColor: productType ? productTypeError ? '#E41C38' : '#00C569' :
                                                    productTypeClicked ? '#E41C38' : '#666',
                                                paddingHorizontal: 10,
                                                backgroundColor: '#FBFBFB'
                                            }}>
                                            <FontAwesome5 name={
                                                productType ? productTypeError ? 'times-circle' : 'check-circle' : productTypeClicked
                                                    ? 'times-circle' : 'edit'}
                                                color={productType ? productTypeError ? '#E41C38' : '#00C569'
                                                    : productTypeClicked ? '#E41C38' : '#BDC4CC'}
                                                size={16}
                                                solid
                                                style={{
                                                    marginLeft: 10
                                                }}
                                            />
                                            <Input
                                                autoCapitalize='none'
                                                autoCorrect={false}
                                                autoCompleteType='off'
                                                style={{
                                                    textDecorationLine: 'none',
                                                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                                    fontSize: 14,
                                                    height: 45,
                                                    direction: 'rtl',
                                                    textAlign: 'right'
                                                }}
                                                onChangeText={this.onProductTypeSubmit}
                                                value={productType}
                                                placeholderTextColor="#BEBEBE"
                                                placeholder={locales('titles.enterYouNeedProduct')}
                                                ref={this.productTypeRef}
                                            />
                                        </InputGroup>
                                        <Label style={{
                                            fontFamily: 'IRANSansWeb(FaNum)_Light',
                                            height: 20, fontSize: 14, color: '#D81A1A'
                                        }}>
                                            {!!productTypeError && productTypeError}
                                        </Label>

                                        <Text
                                            style={{
                                                marginTop: 10,
                                                color: '#333',
                                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                                fontSize: 18
                                            }}
                                        >
                                            {locales('titles.amountNeeded')} <Text
                                                style={{
                                                    marginTop: 10,
                                                    color: '#333',
                                                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                                    fontSize: 16
                                                }}
                                            >({locales('labels.kiloGram')}) </Text><Text
                                                style={{
                                                    color: '#D44546',
                                                    fontSize: 16,
                                                    fontFamily: 'IRANSansWeb(FaNum)_Bold'
                                                }}
                                            >*</Text>
                                        </Text>
                                        <Text
                                            style={{
                                                marginBottom: 10,
                                                color: '#777777',
                                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                                fontSize: 16
                                            }}
                                        >
                                            {locales('titles.amountExample')}
                                        </Text>
                                        <InputGroup
                                            regular
                                            style={{

                                                borderRadius: 4,
                                                borderColor: amount ? amountError ? '#E41C38' : '#00C569' :
                                                    amountClicked ? '#E41C38' : '#666',
                                                paddingHorizontal: 10,
                                                backgroundColor: '#FBFBFB'
                                            }}>
                                            <FontAwesome5 name={

                                                amount ? amountError ? 'times-circle' : 'check-circle' : amountClicked
                                                    ? 'times-circle' : 'edit'}
                                                color={amount ? amountError ? '#E41C38' : '#00C569'
                                                    : amountClicked ? '#E41C38' : '#BDC4CC'}
                                                size={16}
                                                solid
                                                style={{
                                                    marginLeft: 10
                                                }}
                                            />
                                            <Input
                                                autoCapitalize='none'
                                                autoCorrect={false}
                                                keyboardType='number-pad'
                                                autoCompleteType='off'
                                                style={{
                                                    width: '100%',
                                                    fontFamily: 'IRANSansWeb(FaNum)',
                                                    flexDirection: 'row',
                                                    textDecorationLine: 'none',
                                                    fontSize: 14,
                                                    height: 45,
                                                    direction: 'rtl',
                                                    textAlign: 'right',
                                                }}
                                                onChangeText={this.onAmountSubmit}
                                                value={amount}
                                                placeholderTextColor="#BEBEBE"
                                                placeholder={locales('titles.enterRequirment')}
                                                ref={this.amountRef}

                                            />
                                        </InputGroup>
                                        <Label style={{
                                            height: 25,
                                            fontFamily: 'IRANSansWeb(FaNum)_Light',
                                            textAlign: !amountError && amount.length ? 'left' : 'right'
                                        }}>

                                            {!!amountError && <Text style={{
                                                fontSize: 14, color: '#D81A1A',
                                                fontFamily: 'IRANSansWeb(FaNum)_Light',
                                            }}> {amountError}</Text>}
                                            {!amountError && amount.length ? <Text style={{
                                                fontSize: 14, color: '#1DA1F2',
                                                fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                            }}>
                                                {amountText}</Text> : null}

                                        </Label>

                                        <View style={{
                                            marginTop: 20,
                                            marginBottom: 20,
                                            // marginHorizontal: 10,
                                            flexDirection: 'row',
                                            justifyContent: 'space-between'
                                        }}>
                                            <Button
                                                onPress={() => this.onSubmit()}
                                                style={!this.state.category || !this.state.subCategory || !amount ||
                                                    (productType ? !validator.isPersianNameWithDigits(productType) : null)
                                                    ? styles.disableLoginButton : styles.loginButton}
                                                rounded
                                            >
                                                {!this.props.registerBuyAdRequestLoading
                                                    ? <FontAwesome5 name='check' size={15} color='white' /> :
                                                    <ActivityIndicator size="small" color="white"
                                                    />
                                                }
                                                <Text style={styles.buttonText}>{locales('labels.registerRequest')}</Text>
                                            </Button>
                                            <Button
                                                onPress={() => this.setState({ productType: '', subCategory: '' })}
                                                style={[styles.backButtonContainer, { width: '37%' }]}
                                                rounded
                                            >
                                                <Text style={styles.backButtonText}>{locales('titles.previousStep')}</Text>
                                                <AntDesign name='arrowright' size={25} color='#7E7E7E' />
                                            </Button>
                                        </View>

                                    </View>
                                    :
                                    null
                            }
                            {/* <View style={{

                                    width: '100%'
                                }}>

                                    <View style={styles.labelInputPadding}>
                                        <View style={{
                                            flexDirection: 'row-reverse',

                                        }}>
                                            <Label style={{ position: 'relative', color: '#333', fontSize: 15, fontFamily: 'IRANSansWeb(FaNum)_Bold', padding: 5 }}>
                                                {locales('labels.category')}
                                            </Label>
                                            {!!categoriesLoading ? <ActivityIndicator size="small" color="#00C569"
                                            /> : null}
                                        </View>
                                        <Item regular
                                            style={{
                                                width: '100%',
                                                borderRadius: 5,
                                                alignSelf: 'center',
                                                borderColor: category ? '#00C569' : categoryError ? '#D50000' : '#a8a8a8'
                                            }}
                                        >
                                            <RNPickerSelect
                                                Icon={() => <FontAwesome5 name='angle-down' size={25} color='gray' />}
                                                useNativeAndroidPickerStyle={false}
                                                onValueChange={this.setCategory}
                                                disabled={categoriesLoading}
                                                style={styles}
                                                value={category}
                                                placeholder={{
                                                    label: locales('labels.selectCategory'),
                                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                                }}
                                                items={[...categoriesList.map(item => ({
                                                    label: item.category_name, value: item.id
                                                }))]}
                                            />
                                        </Item>
                                        {!!categoryError && <Label style={{ fontSize: 14, color: '#D81A1A', width: deviceWidth * 0.9 }}>{categoryError}</Label>}
                                    </View>

                                    <View style={styles.labelInputPadding}>
                                        <View style={{
                                            flexDirection: 'row-reverse'
                                        }}>
                                            <Label style={{ color: '#333', fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 15, padding: 5 }}>
                                                {locales('titles.productName')}
                                            </Label>
                                            {!!subCategoriesLoading ? <ActivityIndicator size="small" color="#00C569"
                                                style={{
                                                    width: 30, height: 30, borderRadius: 15
                                                }}
                                            /> : null}
                                        </View>
                                        <Item regular
                                            style={{
                                                width: '100%',
                                                borderRadius: 5,
                                                alignSelf: 'center',
                                                borderColor: subCategory ? '#00C569' : subCategoryError ? '#D50000' : '#a8a8a8'
                                            }}
                                        >
                                            <RNPickerSelect
                                                Icon={() => <FontAwesome5 name='angle-down' size={25} color='gray' />}
                                                useNativeAndroidPickerStyle={false}
                                                onValueChange={this.setSubCategory}
                                                style={styles}
                                                disabled={this.state.disableSubCategory || categoriesLoading || subCategoriesLoading}
                                                value={subCategory}
                                                placeholder={{
                                                    label: locales('titles.selectProductName'),
                                                    fontFamily: 'IRANSansWeb(FaNum)_Bold',
                                                }}
                                                items={[...subCategoriesList.map(item => ({
                                                    label: item.category_name, value: item.id
                                                }))]}
                                            />
                                        </Item>
                                        {!!subCategoryError && <Label style={{ fontSize: 14, color: '#D81A1A', width: deviceWidth * 0.9 }}>{subCategoryError}</Label>}
                                    </View>


                                    <View style={styles.labelInputPadding}>
                                        <Label style={{ color: '#333', fontSize: 15, fontFamily: 'IRANSansWeb(FaNum)_Bold', padding: 5 }}>
                                            {locales('titles.enterYourProductType')}
                                        </Label>
                                        <Item regular style={{
                                            borderColor: (productTypeError ? '#D50000' :
                                                (productType.length && validator.isPersianNameWithDigits(productType)) ? '#00C569' : '#a8a8a8'),
                                            borderRadius: 5, padding: 3
                                        }}>
                                            <Input
                                                autoCapitalize='none'
                                                autoCorrect={false}
                                                autoCompleteType='off'
                                                style={{
                                                    width: '100%',
                                                    fontFamily: 'IRANSansWeb(FaNum)_Medium',
                                                    textDecorationLine: 'none',
                                                    fontSize: 14,
                                                    height: 45,
                                                    direction: 'rtl',
                                                    textAlign: 'right'
                                                }}
                                                onChangeText={this.onProductTypeSubmit}
                                                value={productType}
                                                placeholderTextColor="#BEBEBE"
                                                placeholder={locales('titles.productTypeWithExample')}
                                                ref={this.productTypeRef}
                                            />
                                        </Item>
                                        {!!productTypeError && <Label style={{ fontSize: 14, color: '#D81A1A' }}>{productTypeError}</Label>}

                                    </View>



                                    <View style={styles.labelInputPadding}>
                                        <Label style={{ color: '#333', fontSize: 15, fontFamily: 'IRANSansWeb(FaNum)_Bold', padding: 5 }}>
                                            {locales('titles.requestQuantity')}
                                        </Label>
                                        <Item regular style={{
                                            borderColor: amountError ? '#D50000' : amount.length ? '#00C569' : '#a8a8a8', borderRadius: 5, padding: 3
                                        }}>
                                            <Input
                                                autoCapitalize='none'
                                                autoCorrect={false}
                                                keyboardType='number-pad'
                                                autoCompleteType='off'
                                                style={{
                                                    width: '100%',
                                                    fontFamily: 'IRANSansWeb(FaNum)',
                                                    flexDirection: 'row',
                                                    textDecorationLine: 'none',
                                                    fontSize: 14,
                                                    height: 45,
                                                    direction: 'rtl',
                                                    textAlign: 'right'
                                                }}
                                                onChangeText={this.onAmountSubmit}
                                                value={amount}
                                                placeholderTextColor="#BEBEBE"

                                                placeholder={locales('titles.maximumPriceWithExample')}
                                                ref={this.amountRef}

                                            />
                                        </Item>
                                        {!!amountError && <Label style={{ fontSize: 14, color: '#D81A1A' }}>{amountError}</Label>}
                                        {!amountError ? <Label style={{ fontSize: 14, color: '#777', fontFamily: 'IRANSansWeb(FaNum)_Medium' }}>{amount.length ? amountText : null}</Label> : null}
                                    </View>



                                    <View style={[styles.labelInputPadding], {
                                        alignSelf: 'center', justifyContent: 'center',
                                        alignItems: 'center',

                                    }}>

                                        <Button
                                            onPress={() => this.onSubmit()}
                                            style={[!this.state.category || !this.state.subCategory || !amount

                                                ? styles.disableLoginButton : styles.loginButton, {
                                                marginBottom: 25,
                                                marginTop: 25
                                            }]}

                                        >
                                            <ActivityIndicator size="small"
                                                animating={!!this.props.registerBuyAdRequestLoading} color="white"
                                                style={{
                                                    position: 'relative',
                                                    marginRight: -30,
                                                    width: 25, height: 25, borderRadius: 15
                                                }}
                                            />
                                            <Text style={styles.buttonText}>{locales('labels.registerRequest')}</Text>


                                        </Button>

                                    </View>
                                </View>
                            */}
                        </View>
                    </ScrollView>
                </View>

            </>
        )
    }
}


const styles = StyleSheet.create({
    textInputPadding: {
        padding: 20,
        marginTop: 20
    },
    buttonText: {
        color: 'white',
        width: '80%',
        textAlign: 'center',
        fontFamily: 'IRANSansWeb(FaNum)_Bold'
    },
    disableLoginButton: {
        textAlign: 'center',
        borderRadius: 5,
        backgroundColor: '#B5B5B5',
        width: '40%',
        color: 'white',
        elevation: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loginButton: {
        textAlign: 'center',
        borderRadius: 5,
        backgroundColor: '#00C569',
        width: '40%',
        color: 'white',
        elevation: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    backButtonText: {
        fontFamily: 'IRANSansWeb(FaNum)_Light',
        color: '#7E7E7E',
        width: '60%',
        textAlign: 'center'
    },
    backButtonContainer: {
        textAlign: 'center',
        elevation: 0,
        borderWidth: 1,
        borderColor: '#BDC4CC',
        backgroundColor: 'white',
        alignItems: 'center',
        borderRadius: 5,
        justifyContent: 'center'
    },
    labelInputPadding: {
        paddingVertical: 5,
        paddingHorizontal: 15
    },
    container: {
        flex: 1,
    },
    scrollContainer: {
        flex: 1,
        paddingHorizontal: 15,
    },
    scrollContentContainer: {
        paddingTop: 40,
        paddingBottom: 10,
    },
    inputIOS: {
        fontSize: 14,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
        fontSize: 13,
        paddingHorizontal: deviceWidth * 0.062,
        fontFamily: 'IRANSansWeb(FaNum)_Medium',
        paddingVertical: 8,
        color: 'black',
        height: 50,
        width: deviceWidth * 0.9,
    },
    iconContainer: {
        left: 10,
        top: 13,
    }
})


const mapStateToProps = (state) => {
    return {
        categoriesLoading: state.registerProductReducer.categoriesLoading,
        categoriesMessage: state.registerProductReducer.categoriesMessage,
        categoriesError: state.registerProductReducer.categoriesError,
        categoriesFailed: state.registerProductReducer.categoriesFailed,
        categoriesList: state.registerProductReducer.categoriesList,
        categories: state.registerProductReducer.categories,


        subCategoriesLoading: state.registerProductReducer.subCategoriesLoading,
        subCategoriesMessage: state.registerProductReducer.subCategoriesMessage,
        subCategoriesError: state.registerProductReducer.subCategoriesError,
        subCategoriesFailed: state.registerProductReducer.subCategoriesFailed,
        subCategoriesList: state.registerProductReducer.subCategoriesList,
        subCategories: state.registerProductReducer.subCategories,

        registerBuyAdRequestLoading: state.registerProductReducer.registerBuyAdRequestLoading,
        registerBuyAdRequest: state.registerProductReducer.registerBuyAdRequest,
        registerBuyAdRequestMessage: state.registerProductReducer.registerBuyAdRequestMessage,
        registerBuyAdRequestError: state.registerProductReducer.registerBuyAdRequestError,
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
        registerBuyAdRequest: requestObj => dispatch(registerProductActions.registerBuyAdRequest(requestObj)),
        fetchAllCategories: () => dispatch(registerProductActions.fetchAllCategories(true)),
        resetRegisterProduct: resetTab => dispatch(productActions.resetRegisterProduct(resetTab))

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterRequest);

