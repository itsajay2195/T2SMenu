import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
const shouldForceOffscreen = Platform.OS === 'android';

const T2SSwipeList = (props) => {
    return (
        <View needsOffscreenAlphaCompositing={shouldForceOffscreen} style={shouldForceOffscreen && style.forceComposition}>
            <SwipeListView {...props}>{props.children}</SwipeListView>
        </View>
    );
};

// eslint-disable-next-line react/display-name
const T2SSwipeRow = React.forwardRef((props, ref) => (
    <View needsOffscreenAlphaCompositing={shouldForceOffscreen} style={shouldForceOffscreen && style.forceComposition}>
        <SwipeRow ref={ref} {...props}>
            {props.children}
        </SwipeRow>
    </View>
));

const style = StyleSheet.create({
    forceComposition: {
        opacity: 0.99
    }
});

export { T2SSwipeList, T2SSwipeRow };
