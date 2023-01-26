import React from 'react';
import { View } from 'react-native';
import T2SButton from 't2sbasemodule/UI/CommonUI/T2SButton';
import { VIEW_ID } from '../Utils/OrderManagementConstants';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import styles from './Styles/OrderStatusStyle';
import { ORDER_STATUS } from '../../BaseModule/BaseConstants';
import { Text } from 'react-native-paper';
import T2STouchableRipple from '../../../T2SBaseModule/UI/CommonUI/T2STouchableRipple';

const OrderStatusBottomButton = (props) => {
    const { screenName, orderDetails, cancelButtonVisible } = props;

    let buttonIsVisible = orderDetails.status === ORDER_STATUS.CANCEL_ORDER;
    return (
        <View style={styles.bottomButtonsContainer}>
            {
                // As per demo feedback removed Live chat button
                //     buttonIsVisible ? (
                //     <View style={styles.buttonView}>
                //         <T2SOutlineButton
                //             buttonStyle={styles.liveChatButton}
                //             buttonTextStyle={styles.liveChatButtonText}
                //             screenName={screenName}
                //             id={VIEW_ID.LIVE_CHAT_BUTTON}
                //             title={LOCALIZATION_STRINGS.LIVE_CHAT}
                //             onPress={props.handleLiveChatClick}
                //         />
                //     </View>
                // ) :
            }
            {!buttonIsVisible && !cancelButtonVisible && (
                <View style={styles.buttonView}>
                    <T2STouchableRipple
                        style={styles.liveChatButton}
                        onPress={props.handleRateTheApp}
                        screenName={screenName}
                        id={VIEW_ID.RATE_APP_BUTTON}>
                        <Text style={styles.liveChatButtonText}>{LOCALIZATION_STRINGS.RATE_THE_APP.toUpperCase()}</Text>
                    </T2STouchableRipple>
                </View>
            )}
            {cancelButtonVisible && (
                <View style={styles.buttonView}>
                    <T2STouchableRipple
                        style={styles.cancelButton}
                        onPress={props.handleCancelOrderClick}
                        screenName={screenName}
                        id={VIEW_ID.CANCEL_BUTTON}>
                        <Text style={styles.cancelButtonText}>{LOCALIZATION_STRINGS.CANCEL.toUpperCase()}</Text>
                    </T2STouchableRipple>
                </View>
            )}
            <View style={styles.buttonView}>
                <T2SButton
                    buttonStyle={styles.viewOrderButton}
                    buttonTextStyle={styles.viewOrderButtonText}
                    screenName={screenName}
                    id={VIEW_ID.VIEW_ORDER_BUTTON}
                    title={LOCALIZATION_STRINGS.VIEW_ORDER}
                    onPress={props.handleViewOrderClick}
                />
            </View>
        </View>
    );
};

export default OrderStatusBottomButton;
