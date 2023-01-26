import { StyleSheet } from 'react-native';
import React, { useCallback } from 'react';
import Components, { TakeAwayNameInfoComponent } from './TakeAwayNameInfoComponent';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import { isValidElement } from 't2sbasemodule/Utils/helpers';
import { handleNavigation } from '../../../../CustomerApp/Navigation/Helper';
import * as Analytics from 'appmodules/AnalyticsModule/Analytics';
import * as Segment from 'appmodules/AnalyticsModule/Segment';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from 'appmodules/AnalyticsModule/AnalyticsConstants';
import { SEGMENT_EVENTS } from 'appmodules/AnalyticsModule/SegmentConstants';
import { SCREEN_OPTIONS } from '../../../../CustomerApp/Navigation/ScreenOptions';
import { TakeAwayInfoBarSkeletonLoader } from '../../../MenuModule/Utils/MenuSkeletonLoader';
import { ORDER_TYPE } from '../../../BaseModule/BaseConstants';

const handleViewInfoClick = (storeConfigResponse, countryBaseFeatureGateResponse, getStoreConfigAction, showHideOrderTypeAction) => {
    getStoreConfigAction();
    if (isValidElement(storeConfigResponse)) {
        showHideOrderTypeAction(false);
        Analytics.logEvent(ANALYTICS_SCREENS.MENU, ANALYTICS_EVENTS.TAKEAWAY_INFO);
        Segment.trackEvent(countryBaseFeatureGateResponse, SEGMENT_EVENTS.VIEW_INFO, {
            takeaway: storeConfigResponse.name
        });
        handleNavigation(SCREEN_OPTIONS.TAKEAWAY_DETAILS.route_name, { isFromMenu: true });
    }
};

const TakeAwayInfoBar = ({ takeAwayName, takeAwayInfoPressArgs, isLoading, selectedOrderType, cuisines, rating }) => {
    const {
        storeConfigResponse,
        countryBaseFeatureGateResponse,
        getStoreConfigAction: storeConfigAction,
        showHideOrderTypeAction: hideOrderTypeAction
    } = takeAwayInfoPressArgs;
    const momizedViewInfoClick = useCallback(() => {
        handleViewInfoClick(storeConfigResponse, countryBaseFeatureGateResponse, storeConfigAction, hideOrderTypeAction);
    }, [storeConfigResponse, countryBaseFeatureGateResponse, storeConfigAction, hideOrderTypeAction]);
    return (
        <T2SView style={styles.headerComponentStyle}>
            {isLoading ? (
                <TakeAwayInfoBarSkeletonLoader />
            ) : (
                <>
                    <T2SView style={styles.headerContainerStyle}>
                        <TakeAwayNameInfoComponent
                            takeAwayName={takeAwayName}
                            momizedViewInfoClick={momizedViewInfoClick}
                            cuisines={cuisines}
                            rating={rating}
                        />
                    </T2SView>
                    <T2SView style={styles.headerComponentSecondRowWrapper}>
                        <T2SView>
                            <Components.RenderDistance />
                        </T2SView>

                        <T2SView style={styles.paddingLeftStyle}>
                            {selectedOrderType === ORDER_TYPE.COLLECTION ? <Components.RenderCollection /> : null}
                        </T2SView>

                        <T2SView style={styles.paddingLeftStyle}>
                            {selectedOrderType === ORDER_TYPE.DELIVERY ? <Components.RenderDelivery /> : null}
                        </T2SView>
                    </T2SView>
                    <T2SView style={styles.itemSeparator} />
                </>
            )}
        </T2SView>
    );
};

export default TakeAwayInfoBar;

const styles = StyleSheet.create({
    headerComponentStyle: { display: 'flex', paddingHorizontal: 10 },
    headerContainerStyle: { display: 'flex', flexDirection: 'row' },
    headerComponentSecondRowWrapper: { display: 'flex', flexDirection: 'row' },
    itemSeparator: { marginVertical: 10, backgroundColor: 'grey', height: 0.3, opacity: 0.4 },
    paddingLeftStyle: { paddingLeft: 10 }
});
