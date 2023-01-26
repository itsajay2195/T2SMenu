import React from 'react';
import PropTypes from 'prop-types';
import T2STouchableRipple from 't2sbasemodule/UI/CommonUI/T2STouchableRipple';
import { VIEW_ID } from '../../Utils/HomeConstants';
import { View } from 'react-native';
import { T2SIcon } from 't2sbasemodule/UI';
import { FONT_ICON } from '../../../../CustomerApp/Fonts/FontIcon';
import { setTestId } from 't2sbasemodule/Utils/AutomationHelper';
import styles from '../Styles/OrderTypeStyle';
import { isValidElement } from 't2sbasemodule/Utils/helpers';
import { ORDER_TYPE } from '../../../BaseModule/BaseConstants';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import { LOCALIZATION_STRINGS } from '../../../LocalizationModule/Utils/Strings';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { Colors } from 't2sbasemodule/Themes';
const OrderTypeView = (props) => {
    return (
        <T2STouchableRipple
            accessible={false}
            onPress={props.onPress}
            style={[
                props.isFull
                    ? props.isTransparent
                        ? styles.deliveryButtonContainerWithoutBg
                        : styles.deliveryButtonContainer
                    : styles.rippleStyle,
                props.OrderTypeViewStyle
            ]}
            id={VIEW_ID.COLLECTION_DELIVERY_ICON}
            screenName={props.screenName}
            {...setTestId(props.screenName, props.id)}>
            <View style={styles.viewStyle}>
                {isValidElement(props.orderType) && props.orderType === ORDER_TYPE.COLLECTION && (
                    <T2SView style={props.isFull && styles.contentStyle}>
                        <T2SIcon
                            id={VIEW_ID.HEADER_ORDER_TYPE_COLLECTION_ICON}
                            style={styles.collectionIconStyle}
                            color={props.isFull ? (props.isTransparent ? Colors.black : Colors.white) : Colors.black}
                            screenName={props.screenName}
                            icon={FONT_ICON.COLLECTION}
                            size={23}
                        />
                        <View>
                            {props.isFull && (
                                <T2SText
                                    id={VIEW_ID.HEADER_ORDER_TYPE_COLLECTION_TEXT}
                                    screenName={props.screenName}
                                    style={[
                                        styles.deliveryButtonText,
                                        { color: props.isFull ? (props.isTransparent ? Colors.black : Colors.white) : Colors.black }
                                    ]}>
                                    {LOCALIZATION_STRINGS.COLLECTION}
                                </T2SText>
                            )}
                        </View>
                    </T2SView>
                )}
                {isValidElement(props.orderType) && props.orderType === ORDER_TYPE.DELIVERY && (
                    <T2SView style={props.isFull && styles.contentStyle}>
                        <View>
                            <T2SIcon
                                screenName={props.screenName}
                                id={VIEW_ID.HEADER_ORDER_TYPE_DELIVERY_ICON}
                                style={styles.deliveryIconStyle}
                                color={props.isFull ? (props.isTransparent ? Colors.black : Colors.white) : Colors.black}
                                icon={FONT_ICON.DELIVERY}
                                size={28}
                            />
                        </View>
                        <View>
                            {props.isFull && (
                                <T2SText
                                    screenName={props.screenName}
                                    id={VIEW_ID.HEADER_ORDER_TYPE_DELIVERY_TEXT}
                                    style={[
                                        styles.deliveryButtonText,
                                        { color: props.isFull ? (props.isTransparent ? Colors.black : Colors.white) : Colors.black }
                                    ]}>
                                    {LOCALIZATION_STRINGS.DELIVERY}
                                </T2SText>
                            )}
                        </View>
                    </T2SView>
                )}
                <View>
                    <T2SIcon
                        id={VIEW_ID.HEADER_ORDER_TYPE_DOWN_ARROW_ICON}
                        screenName={props.screenName}
                        icon={FONT_ICON.ARROW_DOWN}
                        style={[
                            styles.arrowStyleDelivery,
                            { color: props.isFull ? (props.isTransparent ? Colors.black : Colors.white) : Colors.black }
                        ]}
                        size={25}
                    />
                </View>
            </View>
        </T2STouchableRipple>
    );
};

OrderTypeView.propTypes = {
    screenName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    orderType: PropTypes.string,
    isTransparent: PropTypes.bool,
    isFull: PropTypes.bool
};
OrderTypeView.defaultProps = {
    orderType: ORDER_TYPE.DELIVERY,
    isFull: false,
    isTransparent: false,
    showSearchFilter: false
};

function propCheck(prevProps, nextProps) {
    return prevProps.orderType === nextProps.orderType;
}

const OrderTypeAction = React.memo(OrderTypeView, propCheck);
export default OrderTypeAction;
