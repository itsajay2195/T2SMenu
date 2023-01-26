import React from 'react';
import { View, ViewPropTypes, Keyboard, Platform } from 'react-native';
import PropTypes from 'prop-types';
import { Appbar } from 'react-native-paper';
import styles from './Style/AppBarStyle';

import { useNavigation } from '@react-navigation/native';
import { defaultTouchArea, isValidElement } from '../../Utils/helpers';
import { FONT_ICON } from '../../../CustomerApp/Fonts/FontIcon';
import { VIEW_ID } from 'appmodules/BaseModule/BaseConstants';
import { setTestId } from '../../Utils/AutomationHelper';
import T2SIcon from 't2sbasemodule/UI/CommonUI/T2SIcon';
import T2STouchableOpacity from './T2STouchableOpacity';

const viewPropTypes = ViewPropTypes || View.propTypes;

const T2SAppBar = ({
    title,
    icon,
    actions = undefined,
    customView = undefined,
    screenName = '',
    id = '',
    handleLeftActionPress,
    headerStyle,
    showElevation = true,
    headerTextStyle,
    customViewStyle
}) => {
    const navigation = useNavigation();

    function handleLeftCLickAction(handleLeftActionPress, navigationBack) {
        return isValidElement(handleLeftActionPress) ? handleLeftActionPress : navigationBack;
    }

    function navigationBack() {
        if (icon === FONT_ICON.HAMBURGER) {
            Keyboard.dismiss();
            navigation.toggleDrawer();
        } else if (navigation.canGoBack()) {
            navigation.goBack();
        }
    }

    return (
        <Appbar.Header
            style={
                // Used different elevation for iOS and Android
                // Because in iOS 'elevation' overlaps others
                showElevation
                    ? [styles.headerStyle, Platform.OS === 'ios' ? styles.iosElevation : styles.androidElevation, headerStyle]
                    : [styles.noElevation, headerStyle]
            }
            {...setTestId(screenName, id)}>
            <T2STouchableOpacity
                style={styles.headerIconStyle}
                screenName={screenName}
                id={VIEW_ID.LEFT_BUTTON}
                onPress={handleLeftCLickAction(handleLeftActionPress, navigationBack)}
                hitSlop={defaultTouchArea(24)}>
                <T2SIcon id={id} screenName={screenName} style={styles.headerLeftIconStyle} icon={icon} size={24} />
            </T2STouchableOpacity>

            {isValidElement(customView) ? (
                <View style={isValidElement(customViewStyle) ? customViewStyle : styles.customViewStyle}>{customView}</View>
            ) : (
                <Appbar.Content
                    {...setTestId(screenName, id)}
                    title={title}
                    style={styles.contentStyle}
                    titleStyle={[styles.titleStyle, headerTextStyle]}
                />
            )}

            {isValidElement(actions) ? <View style={styles.actionContainer}>{actions}</View> : null}
        </Appbar.Header>
    );
};
T2SAppBar.propTypes = {
    screenName: PropTypes.string,
    id: PropTypes.string,
    actions: PropTypes.node, //AppBar RightAction Buttons
    title: PropTypes.string, // AppBar Title
    icon: PropTypes.string, // Font icon for LeftAction Button
    customView: PropTypes.node, //used to render custom view on Parent Component
    handleLeftActionPress: PropTypes.func, // callback function to override for LeftAction Button
    useDefault: PropTypes.bool, // Default Navigation which will take care of scene,previous,
    headerStyle: viewPropTypes.style,
    showElevation: PropTypes.bool
};

function propCheck(prevProps, nextProps) {
    return (
        prevProps.screenName === nextProps.screenName &&
        prevProps.id === nextProps.id &&
        prevProps.title === nextProps.title &&
        prevProps.icon === nextProps.icon &&
        prevProps.customView === nextProps.customView &&
        prevProps.useDefault === nextProps.useDefault &&
        prevProps.showElevation === nextProps.showElevation &&
        prevProps.actions === nextProps.actions
    );
}
T2SAppBar.defaultProps = {
    actions: undefined,
    icon: FONT_ICON.BACK,
    customView: null,
    showElevation: true
};
export default React.memo(T2SAppBar, propCheck);
