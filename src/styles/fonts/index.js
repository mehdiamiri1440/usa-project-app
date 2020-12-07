import {React} from "react";
import { deviceWidth, deviceHeight } from '../../utils/deviceDimenssions.js'
import units from './units'


const fonts = {
    bigTitle:0,
    title:0,
    subTitle:0,
    smallTitle:0,
    text:0,
    smallText:0,
    bold:'IRANSansWeb(FaNum)_Bold',
    medium:'IRANSansWeb(FaNum)_Medium',
    light:'IRANSansWeb(FaNum)_Light',
}

function deviceSize() {

    if(deviceWidth >= 768){
        
        fonts.bigTitle = units.n25;
        fonts.title = units.n23;
        fonts.subTitle = units.n21;
        fonts.smallTitle = units.n19;
        fonts.text = units.n16;
        fonts.smallText = units.n14;
        
    }else if(deviceWidth >= 500){
        
        fonts.bigTitle = units.n24;
        fonts.title = units.n22;
        fonts.subTitle = units.n20;
        fonts.smallTitle = units.n18;
        fonts.text = units.n16;
        fonts.smallText = units.n14;
        
    }else if(deviceWidth >= 410){
        
        fonts.bigTitle = units.n23;
        fonts.title = units.n21;
        fonts.subTitle = units.n19;
        fonts.smallTitle = units.n17;
        fonts.text = units.n15;
        fonts.smallText = units.n13;
        
    }else if(deviceWidth >= 360){
        
        fonts.bigTitle = units.n22;
        fonts.title = units.n20;
        fonts.subTitle = units.n18;
        fonts.smallTitle = units.n16;
        fonts.text = units.n14;
        fonts.smallText = units.n12;
        
    }else{
        
        fonts.bigTitle = units.n21;
        fonts.title = units.n19;
        fonts.subTitle = units.n17;
        fonts.smallTitle = units.n15;
        fonts.text = units.n13;
        fonts.smallText = units.n11;
        
    }

}


deviceSize();

export default fonts;