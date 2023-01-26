import React, { Component } from 'react';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import { setTestId } from 't2sbasemodule/Utils/AutomationHelper';
import { SCREEN_NAME, VIEW_ID } from '../../../../FoodHubApp/HomeModule/Utils/HomeConstants';
import { defaultTouchArea, isValidElement } from 't2sbasemodule/Utils/helpers';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import styles from '../../../../FoodHubApp/HomeModule/Styles/HomeStyles';
import { View } from 'react-native';
import { T2SIcon } from 't2sbasemodule/UI';
import { FONT_ICON } from '../../../../CustomerApp/Fonts/FontIcon';
import { SCREEN_OPTIONS } from '../../../../CustomerApp/Navigation/ScreenOptions';
import { selectHasUserLoggedIn } from 't2sbasemodule/Utils/AppSelectors';
import { redirectRouteAction, storeConfigResponseAction } from '../../../../CustomerApp/Redux/Actions';
import { connect } from 'react-redux';
import { CommonActions } from '@react-navigation/native';

class BasketIcon extends Component {
    constructor(props) {
        super(props);
        this.handleCardButtonClick = this.handleCardButtonClick.bind(this);
    }

    shouldComponentUpdate(nextProps) {
        const { isUserLoggedIn, storeConfigResponse, prevStoreConfigResponse, totalItems } = this.props;
        return (
            isUserLoggedIn !== nextProps.isUserLoggedIn ||
            storeConfigResponse !== nextProps.storeConfigResponse ||
            prevStoreConfigResponse !== nextProps.prevStoreConfigResponse ||
            totalItems !== nextProps.totalItems
        );
    }

    render() {
        const { totalItems } = this.props;
        return (
            <T2SView accessible={false}>
                <T2STouchableOpacity
                    {...setTestId(SCREEN_NAME.HOME_SCREEN, VIEW_ID.CART_BUTTON)}
                    hitSlop={defaultTouchArea(20)}
                    onPress={this.handleCardButtonClick}
                    screenName={SCREEN_NAME.HOME_SCREEN}
                    id={VIEW_ID.CART_ICON_VIEW}>
                    <T2SText screenName={SCREEN_NAME.HOME_SCREEN} id={VIEW_ID.ITEM_COUNT} style={styles.countStyle}>
                        {totalItems}
                    </T2SText>
                    <View>
                        <T2SIcon
                            icon={FONT_ICON.CART}
                            style={styles.cardStyle}
                            id={VIEW_ID.CART_ICON}
                            screenName={SCREEN_NAME.HOME_SCREEN}
                        />
                    </View>
                </T2STouchableOpacity>
            </T2SView>
        );
    }

    handleCardButtonClick() {
        const { isUserLoggedIn, navigation, storeConfigResponse, prevStoreConfigResponse } = this.props;
        if (isUserLoggedIn) {
            this.handleNavigationForLoggedInUser();
        } else {
            if (
                isValidElement(storeConfigResponse) &&
                isValidElement(prevStoreConfigResponse) &&
                storeConfigResponse.id !== prevStoreConfigResponse.id
            ) {
                this.props.storeConfigResponseAction(prevStoreConfigResponse);
            }
            this.props.redirectRouteAction(SCREEN_OPTIONS.BASKET.route_name);
            navigation.navigate(SCREEN_OPTIONS.SOCIAL_LOGIN.route_name);
        }
    }

    handleNavigationForLoggedInUser() {
        const { basketStoreID, navigation } = this.props;
        if (isValidElement(basketStoreID)) {
            navigation.dispatch(
                CommonActions.reset({
                    index: 2,
                    routes: [
                        { name: SCREEN_OPTIONS.HOME.route_name },
                        {
                            name: SCREEN_OPTIONS.MENU_SCREEN.route_name,
                            params: { isFromReOrder: false, isFromCartIcon: true }
                        },
                        { name: SCREEN_OPTIONS.BASKET.route_name }
                    ]
                })
            );
        }
    }
}

const mapStateToProps = (state) => ({
    isUserLoggedIn: selectHasUserLoggedIn(state),
    storeConfigResponse: state.appState.storeConfigResponse,
    prevStoreConfigResponse: state.appState.prevStoreConfigResponse,
    basketStoreID: state.appState.prevStoreConfigResponse?.id
});

const mapDispatchToProps = {
    redirectRouteAction,
    storeConfigResponseAction
};

export default connect(mapStateToProps, mapDispatchToProps)(BasketIcon);
