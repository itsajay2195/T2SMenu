import React, { Component } from 'react';
import { Animated, View } from 'react-native';
import Styles from '../Styles/MenuStyle';
import T2SIcon from 't2sbasemodule/UI/CommonUI/T2SIcon';
import { FONT_ICON } from '../../../../CustomerApp/Fonts/FontIcon';
import styles from '../Styles/MenuList';
import { VIEW_ID } from '../../Utils/MenuConstants';
import { SCREEN_OPTIONS } from '../../../../CustomerApp/Navigation/ScreenOptions';
import OrderTypeAction from '../../../HomeModule/View/components/OrderTypeAction';
import Colors from 't2sbasemodule/Themes/Colors';
import { isNonCustomerApp } from 't2sbasemodule/Utils/helpers';

let screenName = SCREEN_OPTIONS.MENU_SCREEN.screen_title;
class MenuMainHeader extends Component {
    shouldComponentUpdate(nextProps) {
        return (
            nextProps.springValue !== this.props.springValue ||
            nextProps.mainHeaderContainerOpacity !== this.props.mainHeaderContainerOpacity ||
            nextProps.selectedOrderType !== this.props.selectedOrderType
        );
    }
    render() {
        const {
            goBackHandler,
            onOrderTypeActionPressed,
            springValue,
            mainHeaderContainerOpacity,
            selectedOrderType,
            onSearchIconPressed
        } = this.props;
        return (
            <Animated.View style={[Styles.mainHeaderContainerAnimated, springValue, { opacity: mainHeaderContainerOpacity }]}>
                <View style={Styles.mainHeaderContainer}>
                    <View style={styles.headerIconBGView}>
                        <T2SIcon
                            id={VIEW_ID.MENU_BACK_ICON}
                            name={FONT_ICON.BACK}
                            style={[styles.backIcon, Styles.alignCenter]}
                            onPress={goBackHandler}
                            color={Colors.black}
                        />
                    </View>

                    {isNonCustomerApp() && (
                        <View style={styles.headerContainerView}>
                            <View style={styles.headerIconBGView}>
                                <T2SIcon
                                    id={VIEW_ID.SEARCH_ICON}
                                    screenName={screenName}
                                    icon={FONT_ICON.SEARCH}
                                    color={Colors.black}
                                    style={[styles.backIcon, Styles.alignCenter]}
                                    onPress={onSearchIconPressed}
                                />
                            </View>
                            <OrderTypeAction
                                isFull={true}
                                isTransparent={true}
                                key={VIEW_ID.COLLECTION_DELIVERY_ICON}
                                orderType={selectedOrderType}
                                onPress={onOrderTypeActionPressed}
                                screenName={screenName}
                                OrderTypeViewStyle={styles.orderTypeContainerView}
                            />
                        </View>
                    )}
                </View>
            </Animated.View>
        );
    }
}

export default MenuMainHeader;
