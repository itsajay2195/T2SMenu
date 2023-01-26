/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { FlatList, View } from 'react-native';
import styles from './Styles/DeliveryComponentStyle';
import { VIEW_ID } from '../Utils/QuickCheckoutConstants';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { isValidElement } from 't2sbasemodule/Utils/helpers';
import * as Analytics from '../../AnalyticsModule/Analytics';
import { handleNavigation } from '../../../CustomerApp/Navigation/Helper';
import { ADDRESS_FORM_TYPE } from '../../AddressModule/Utils/AddressConstants';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import T2SIcon from 't2sbasemodule/UI/CommonUI/T2SIcon';
import { FONT_ICON } from '../../../CustomerApp/Fonts/FontIcon';
import { getAddressWithoutCityName, getFormattedFullAddress } from '../../OrderManagementModule/Utils/OrderManagementHelper';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from '../../AnalyticsModule/AnalyticsConstants';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import DeliveryAddressRowComponent from './MicroComponents/DeliveryAddressRowComponent';
import { CHECKBOX_STATUS } from '../../HomeModule/Utils/HomeConstants';

const AddAddressWidget = React.memo(({ screenName }) => {
    return (
        <T2STouchableOpacity
            accessible={false}
            screenName={screenName}
            id={VIEW_ID.QC_ADD_ADDRESS_CONATAINER}
            activeOpacity={0.9}
            onPress={() => {
                Analytics.logEvent(ANALYTICS_SCREENS.QC_ADDRESS, ANALYTICS_EVENTS.ADD_ADDRESS_ACTION);
                handleNavigation(SCREEN_OPTIONS.LOCATION_SEARCH_SCREEN.route_name, {
                    viewType: ADDRESS_FORM_TYPE.ADD_SELECTED_ADDRESS
                });
            }}>
            <View style={styles.itemDividerStyle} />
            <View style={styles.addressContainer}>
                <View style={styles.addAddressStyle}>
                    <T2SText style={styles.addressTextStyle} screenName={screenName} id={VIEW_ID.QC_DELIVERY}>
                        {LOCALIZATION_STRINGS.ADDRESS_FORM_ADD_ADDRESS}
                    </T2SText>
                    <T2SIcon
                        id={VIEW_ID.QC_DETAILS_BACK}
                        screenName={screenName}
                        icon={FONT_ICON.RIGHT_ARROW_2}
                        style={styles.addressIconstyle}
                        size={30}
                    />
                </View>
            </View>
        </T2STouchableOpacity>
    );
});

const DeliveryComponent = ({ data, screenName, deliveryAddressId, isUkTakeaway, itemClicked }) => {
    let flatListRef = null;

    let getItemLayout = (data, index) => ({ length: 50, offset: 60 * index, index });
    useEffect(() => {
        if (isValidElement(deliveryAddressId) && isValidElement(data)) {
            let findIndex = data.findIndex((data) => data.id === deliveryAddressId);
            const timeout = setTimeout(() => {
                flatListRef && flatListRef.scrollToIndex({ animated: true, index: findIndex });
            }, 100);
            return () => {
                if (isValidElement(timeout)) {
                    clearTimeout(timeout);
                }
            };
        }
    }, [data, deliveryAddressId, flatListRef]);

    return (
        <View style={styles.rootStyle}>
            <FlatList
                getItemLayout={getItemLayout}
                ref={(ref) => {
                    flatListRef = ref;
                }}
                id={VIEW_ID.QC_ADD_ADDRESS_CONATAINER}
                screenName={screenName}
                keyExtractor={(item) => item.id.toString()}
                data={data}
                renderItem={({ item }) => renderRowContentView(item, itemClicked, deliveryAddressId, isUkTakeaway, screenName)}
            />
            <AddAddressWidget screenName={screenName} />
        </View>
    );
};

const renderRowContentView = (item, itemClicked, deliveryAddressId, isUkTakeaway, screenName) => {
    return (
        <DeliveryAddressRowComponent
            item={item}
            screenName={screenName}
            itemClicked={itemClicked}
            numberOfLinesOfAddress={isUkTakeaway ? 1 : 2}
            displayAddress={isUkTakeaway ? getAddressWithoutCityName(item) : getFormattedFullAddress(item)}
            checkBoxStatus={
                isValidElement(deliveryAddressId) && deliveryAddressId === item.id ? CHECKBOX_STATUS.CHECKED : CHECKBOX_STATUS.UNCHECKED
            }
        />
    );
};

export default React.memo(DeliveryComponent);
