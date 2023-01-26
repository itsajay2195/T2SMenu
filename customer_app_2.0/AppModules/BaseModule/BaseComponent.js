import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { FONT_ICON } from '../../CustomerApp/Fonts/FontIcon';
import { T2SIcon, T2SIconButton } from 't2sbasemodule/UI';
import { SCREEN_NAME, VIEW_ID } from './BaseConstants';
import T2SAppBar from 't2sbasemodule/UI/CommonUI/T2SAppBar';
import { SCREEN_OPTIONS } from '../../CustomerApp/Navigation/ScreenOptions';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import { isValidElement } from 't2sbasemodule/Utils/helpers';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import styles from './BaseStyle';
import CustomIcon from 't2sbasemodule/UI/CustomUI/CustomIcon';
import { zenDeskMessageCountAction } from '../HomeModule/Redux/HomeAction';
import { handleNavigation } from '../../CustomerApp/Navigation/Helper';
import { startLiveChat } from './Helper';
import { selectCountryBaseFeatureGateSelector, selectHasUserLoggedIn, selectLanguageKey } from 't2sbasemodule/Utils/AppSelectors';
import { SafeAreaView } from 'react-native-safe-area-context';

class BaseComponent extends Component {
    constructor() {
        super();
        this.user = null;
        this.handleZendeskChat = this.handleZendeskChat.bind(this);
    }

    render() {
        const {
            showHeader,
            icon,
            showCommonActions,
            actions,
            title,
            customView,
            headerStyle,
            showElevation,
            customViewStyle,
            children
        } = this.props;
        if (showHeader) {
            return (
                <SafeAreaView style={styles.container}>
                    <T2SAppBar
                        id={VIEW_ID.APP_BAR}
                        screenName={SCREEN_NAME.BASE_COMPONENT}
                        icon={icon}
                        actions={showCommonActions ? [this.renderDefaultActions(), actions] : actions}
                        title={title}
                        customView={customView}
                        handleLeftActionPress={this.props.handleLeftActionPress}
                        showCommonActions={showCommonActions}
                        headerStyle={headerStyle}
                        showElevation={showElevation}
                        customViewStyle={customViewStyle}
                    />
                    {children}
                </SafeAreaView>
            );
        } else {
            return <SafeAreaView style={styles.container}>{children}</SafeAreaView>;
        }
    }

    showNotificationCount() {
        const { notificationCount } = this.props;
        if (isValidElement(notificationCount) && notificationCount > 0) {
            return (
                <T2SText style={styles.labelCount} id={VIEW_ID.NOTIFICATION_ICON} screenName={SCREEN_NAME.BASE_COMPONENT}>
                    {notificationCount}
                </T2SText>
            );
        } else {
            return null;
        }
    }

    showNotificationIcon() {
        return (
            <T2STouchableOpacity
                key={FONT_ICON.NOTIFICATION}
                id={VIEW_ID.NOTIFICATION_ICON}
                onPress={() => {
                    handleNavigation(SCREEN_OPTIONS.NOTIFICATIONS.route_name, { showBackButton: true });
                }}
                screenName={SCREEN_NAME.BASE_COMPONENT}>
                <T2SIcon key={FONT_ICON.NOTIFICATION} icon={FONT_ICON.NOTIFICATION} style={styles.notificationIconStyle} />
            </T2STouchableOpacity>
        );
    }

    renderNotificationComponent() {
        return (
            <T2STouchableOpacity>
                <View>
                    {this.showNotificationIcon()}
                    {this.showNotificationCount()}
                </View>
            </T2STouchableOpacity>
        );
    }

    handleZendeskMessageCount() {
        const { chatNotificationCount } = this.props;
        if (isValidElement(chatNotificationCount) && chatNotificationCount > 0) {
            return (
                <T2SText style={styles.labelCount} id={VIEW_ID.CHAT_NOTIFICATION_COUNT_TEXT} screenName={SCREEN_NAME.BASE_COMPONENT}>
                    {chatNotificationCount}
                </T2SText>
            );
        } else {
            return null;
        }
    }

    handleZendeskChat() {
        const { profileResponse, defaultLanguage, featureGateResponse } = this.props;
        startLiveChat(profileResponse, defaultLanguage, featureGateResponse);
    }

    renderDefaultActions() {
        let { showSearch, showZendeskChat, isUserLoggedIn, showNotificationOption } = this.props;
        return (
            <Fragment key={'actions'}>
                {isUserLoggedIn && showZendeskChat && (
                    <T2STouchableOpacity style={styles.zendeskChatIconStyle} onPress={this.handleZendeskChat}>
                        <CustomIcon name={FONT_ICON.LIVE_CHAT} size={27} />
                        {this.handleZendeskMessageCount()}
                    </T2STouchableOpacity>
                )}

                {showSearch && (
                    <T2SIconButton
                        key={FONT_ICON.SEARCH}
                        icon={FONT_ICON.SEARCH}
                        id={VIEW_ID.SEARCH_ICON}
                        onPress={() => {
                            handleNavigation(SCREEN_OPTIONS.MENU_SCREEN.route_name);
                        }}
                        screenName={SCREEN_NAME.BASE_COMPONENT}
                    />
                )}
                {showNotificationOption && this.renderNotificationComponent()}
            </Fragment>
        );
    }
}

BaseComponent.propTypes = {
    showHeader: PropTypes.bool,
    title: PropTypes.string,
    actions: PropTypes.node, // Renders Right Action Buttons on the ParentComponent
    customView: PropTypes.node, //Renders CustomView on the ParentComponent
    handleLeftActionPress: PropTypes.func, //Callback for the Left Action Button of the ApBar
    showCommonActions: PropTypes.bool, // By default, show all the common action buttons to the ParentComponent
    showSearch: PropTypes.bool,
    showElevation: PropTypes.bool,
    showNotificationOption: PropTypes.bool
};
BaseComponent.defaultProps = {
    showHeader: false,
    icon: FONT_ICON.HAMBURGER,
    customView: undefined,
    showCommonActions: true,
    showNotificationOption: false
};
const mapStateToProps = (state) => ({
    profileResponse: state.profileState.profileResponse,
    isUserLoggedIn: selectHasUserLoggedIn(state),
    defaultLanguage: selectLanguageKey(state),
    featureGateResponse: selectCountryBaseFeatureGateSelector(state)
});

const mapDispatchToProps = {
    zenDeskMessageCountAction
};
export default connect(mapStateToProps, mapDispatchToProps)(BaseComponent);
