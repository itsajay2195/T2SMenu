import { Animated } from 'react-native';
import React from 'react';
import HomeScreenStatusBar from '../HomeScreenStatusBar';
import HeaderComponent from './HeaderComponent';
import Style from '../../Styles/CarouselImageComponentStyle';
import Colors from 't2sbasemodule/Themes/Colors';
import { getStickyHeaderOpacityInterpolation } from '../../Utils/Helper';

const FoodhubHomeSlidingHeader = ({ navigation, hideStatusBar, stickyHeaderOpacity, handleNavigationForLoggedInUser }) => {
    return (
        <Animated.View style={[Style.animatedStyle, { opacity: getStickyHeaderOpacityInterpolation(stickyHeaderOpacity) }]}>
            <HomeScreenStatusBar animated isStickyHeaderShown={hideStatusBar} navigation={navigation} />
            <HeaderComponent
                backgroundColor={Colors.white}
                navigation={navigation}
                handleNavigationForLoggedInUser={handleNavigationForLoggedInUser}
            />
        </Animated.View>
    );
};

export default React.memo(FoodhubHomeSlidingHeader);
