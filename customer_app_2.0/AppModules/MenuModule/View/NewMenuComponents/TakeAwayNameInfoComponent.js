import React from 'react';
import { connect } from 'react-redux';
import T2SIcon from 't2sbasemodule/UI/CommonUI/T2SIcon';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import Styles from '../Styles/MenuStyle';
import { isFullCollectionClosed, getDistanceType, isFullDeliveryClosed } from '../../../../FoodHubApp/TakeawayListModule/Utils/Helper';
import { SCREEN_NAME } from '../../Utils/MenuConstants';
import { VIEW_ID } from '../../Utils/MenuConstants';
import { FONT_ICON } from '../../../../CustomerApp/Fonts/FontIcon';
import Colors from 't2sbasemodule/Themes/Colors';
import { selectStoreConfigResponse, selectStoreId } from 't2sbasemodule/Utils/AppSelectors';
import { selectOrderType } from '../../../OrderManagementModule/Redux/OrderManagementSelectors';
import {
    selectCollectionStatus,
    selectDeliveryStatus,
    selectPreorderCollectionStatus,
    selectPreorderDeliveryStatus
} from '../../../../FoodHubApp/TakeawayListModule/Redux/TakeawayListSelectors';
import { getCollectionWaitingTime, getDeliveryWaitingTime } from '../../../../FoodHubApp/TakeawayListModule/Utils/Helper';
import { distanceValue, isValidElement } from 't2sbasemodule/Utils/helpers';
import { T2STouchableOpacity } from 't2sbasemodule/UI';
import { RatingComponent } from '../../../../FoodHubApp/TakeawayListModule/View/MicroComponents/ReviewAndMilesComponent';
import { TakeAwayNameInfoComponentStyle } from '../Styles/NewMenuStyle';

const screenName = SCREEN_NAME.MENU_SEARCH_SCREEN;

const RenderCollection = (props) => {
    const { storeConfigShowCollection, storeStatusCollection, storeConfigPreOrderCollection, storeConfigResponse } = props;
    let collection_wait = getCollectionWaitingTime(storeConfigResponse);
    return (
        <T2SView style={Styles.rowContainer}>
            <T2SIcon
                id={VIEW_ID.COLLECTION_ICON}
                screenName={screenName}
                icon={FONT_ICON.COLLECTION}
                color={
                    isFullCollectionClosed(storeConfigShowCollection, storeStatusCollection, storeConfigPreOrderCollection)
                        ? Colors.ashColor
                        : Colors.black
                }
                size={22}
            />
            <T2SText
                id={VIEW_ID.COLLECTION_VALUE_TEXT}
                screenName={screenName}
                style={[
                    Styles.detailsMenuCartText,
                    isFullCollectionClosed(storeConfigShowCollection, storeStatusCollection, storeConfigPreOrderCollection)
                        ? { color: Colors.ashColor }
                        : { color: Colors.black }
                ]}>
                {collection_wait}
            </T2SText>
        </T2SView>
    );
};

const RenderDelivery = (props) => {
    const { storeConfigShowDelivery, storeStatusDelivery, storeConfigPreOrderDelivery, storeConfigResponse } = props;
    let delivery_wait = getDeliveryWaitingTime(storeConfigResponse);
    // reactotron.log('delivery_wait', delivery_wait);
    return (
        <T2SView style={Styles.deliveryRowContainer}>
            <T2SIcon
                id={VIEW_ID.DELIVERY_ICON}
                screenName={screenName}
                icon={FONT_ICON.DELIVERY}
                color={
                    isFullDeliveryClosed(storeConfigShowDelivery, storeStatusDelivery, storeConfigPreOrderDelivery)
                        ? Colors.ashColor
                        : Colors.black
                }
                size={22}
                style={Styles.deliveryIconStyle}
            />
            <T2SText
                id={VIEW_ID.COLLECTION_VALUE_TEXT}
                screenName={screenName}
                style={[
                    Styles.detailsMenuCartText,
                    isFullDeliveryClosed(storeConfigShowDelivery, storeStatusDelivery, storeConfigPreOrderDelivery)
                        ? { color: Colors.ashColor }
                        : { color: Colors.black }
                ]}>
                {delivery_wait}
            </T2SText>
        </T2SView>
    );
};

const RenderDistance = (props) => {
    const { distanceType, storeFromListResponse } = props;
    const { distanceInMiles } = isValidElement(storeFromListResponse) && storeFromListResponse;
    let distance = distanceValue(distanceInMiles);
    // reactotron.log('RenderDistance', distanceType, storeFromListResponse);
    // let isDistanceAvailable = isMoreZero(distance);
    return (
        <T2SView style={Styles.rowContainer}>
            <T2SIcon id={VIEW_ID.MAP_ICON} screenName={screenName} icon={FONT_ICON.MAP} color={Colors.black} size={22} />
            <T2SText id={VIEW_ID.MILES_VALUE_TEXT} screenName={screenName} style={Styles.detailsMenuCartText}>
                {distance}
                {getDistanceType(distanceType)}
            </T2SText>
        </T2SView>
    );
};

export const TakeAwayNameInfoComponent = ({ takeAwayName, momizedViewInfoClick, cuisines, rating }) => {
    return (
        <T2SView style={TakeAwayNameInfoComponentStyle.takeAwayNameInforComponentContainer}>
            <T2SView style={TakeAwayNameInfoComponentStyle.leftContainerStyle}>
                <T2SText numberOfLines={1} style={TakeAwayNameInfoComponentStyle.takeawayNameStyle}>
                    {takeAwayName}
                </T2SText>
                <T2SText style={TakeAwayNameInfoComponentStyle.cuisinesTextStyle}>{cuisines}</T2SText>
            </T2SView>

            <T2SView style={TakeAwayNameInfoComponentStyle.rightContainerStyle}>
                <T2STouchableOpacity style={TakeAwayNameInfoComponentStyle.infoAndRatingWrapper} onPress={momizedViewInfoClick}>
                    <T2SIcon
                        id={VIEW_ID.INFO_CON}
                        screenName={screenName}
                        icon={FONT_ICON.INFO_ICON_UNFILLED}
                        color={Colors.lightBlue}
                        size={20}
                    />
                    <T2SText style={TakeAwayNameInfoComponentStyle.infoTextStyle}>Info</T2SText>
                </T2STouchableOpacity>
                <T2SView style={TakeAwayNameInfoComponentStyle.ratingComponentWrapper}>
                    <RatingComponent rating={rating} screenName={screenName} />
                </T2SView>
            </T2SView>
        </T2SView>
    );
};

const mapStateToProps = (state) => ({
    filteredMenu: state.menuState.uiFilteredMenu,
    storeConfigResponse: selectStoreConfigResponse(state),
    isMenuLoading: state.takeawayListReducer.isMenuLoading,
    storeID: selectStoreId(state),
    selectedOrderType: selectOrderType(state),
    basketStoreID: state.basketState.storeID,
    prevStoreConfigResponse: state.appState.prevStoreConfigResponse,
    storeConfigName: state.appState.storeConfigResponse?.name,
    storeConfigId: state.appState.storeConfigResponse?.id,
    countryBaseFeatureGateResponse: state.appState.countryBaseFeatureGateResponse,
    storeFromListResponse: state.appState.storeFromListResponse,
    storeConfigShowCollection: state.appState.storeConfigResponse?.show_collection,
    storeStatusCollection: selectCollectionStatus(state),
    storeConfigPreOrderCollection: selectPreorderCollectionStatus(state),
    distanceType: state.appState.s3ConfigResponse?.country?.distance_type,
    storeConfigShowDelivery: state.appState.storeConfigResponse?.show_delivery,
    storeStatusDelivery: selectDeliveryStatus(state),
    storeConfigPreOrderDelivery: selectPreorderDeliveryStatus(state)
});

export default {
    RenderCollection: connect(mapStateToProps)(RenderCollection),
    RenderDistance: connect(mapStateToProps)(RenderDistance),
    RenderDelivery: connect(mapStateToProps)(RenderDelivery)
};
