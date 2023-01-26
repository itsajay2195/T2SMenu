import React, { Component } from 'react';
import { FlatList } from 'react-native';

// Common Widget
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import { SCREEN_NAME, VIEW_ID } from '../../Utils/HomeConstants';

// Actions and Helpers
import { getModifiedImageURL } from '../../Utils/Helper';
import { isValidElement } from 't2sbasemodule/Utils/helpers';
import { connect } from 'react-redux';

import { isTakeawayBlocked, takeawayBlockedMessage } from '../../../TakeawayListModule/Utils/Helper';
import { showInformationAlert } from 'appmodules/BaseModule/Helper';
import { updateStoreConfigResponseForViewAction } from '../../../TakeawayListModule/Redux/TakeawayListAction';
import { selectHasUserLoggedIn } from 't2sbasemodule/Utils/AppSelectors';
import { selectLanguageKey } from 't2sbasemodule/Utils/AppSelectors';
import * as Segment from 'appmodules/AnalyticsModule/Segment';
import { SEGMENT_EVENTS, SEGMENT_STRINGS } from 'appmodules/AnalyticsModule/SegmentConstants';
import RecentTakeawayListComponent from '../MicroComponents/RecentTakeawayListComponent';
import RecentTakeawayHeaderComponent from '../MicroComponents/RecentTakeawayHeaderComponent';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import { handleNavigation } from '../../../../CustomerApp/Navigation/Helper';
import { SCREEN_OPTIONS } from '../../../../CustomerApp/Navigation/ScreenOptions';
import { updateSelectedOrderType } from 'appmodules/AddressModule/Redux/AddressAction';
let updateStoreTimeOut;
class RecentTakeawayComponent extends Component {
    constructor(props) {
        super(props);
        this.handlePersistLogic = this.handlePersistLogic.bind(this);
    }

    componentDidMount() {
        this.navigationOnFocusEventListener = this.props.navigation.addListener('focus', () => {
            // As rerender is not called after language is changed, did this tricky
            this.setState({ change: true });
        });
    }
    componentWillUnmount() {
        if (isValidElement(this.navigationOnFocusEventListener)) {
            this.props.navigation.removeListener(this.navigationOnFocusEventListener);
        }
        if (isValidElement(updateStoreTimeOut)) {
            clearTimeout(updateStoreTimeOut);
        }
    }

    shouldComponentUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean {
        return nextProps.recentTakeawayResponse !== this.props.recentTakeawayResponse || nextProps.languageKey !== this.props.languageKey;
    }

    render() {
        const { isUserLoggedIn, recentTakeawayResponse } = this.props;
        if (isUserLoggedIn && isValidElement(recentTakeawayResponse) && recentTakeawayResponse.length > 0) {
            return (
                <T2SView screenName={SCREEN_NAME.HOME_SCREEN} id={VIEW_ID.RECENT_TAKEAWAY} style={{ margin: 5 }}>
                    <RecentTakeawayHeaderComponent title={LOCALIZATION_STRINGS.RECENT_TAKEAWAY} />
                    {this.renderRecentTakeawaylist()}
                </T2SView>
            );
        }
        return null;
    }

    renderRecentTakeawaylist() {
        const { recentTakeawayResponse } = this.props;
        return (
            <T2SView id={VIEW_ID.RECENT_TAKEAWAY_LIST} screenName={SCREEN_NAME.HOME_SCREEN}>
                <FlatList
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    data={recentTakeawayResponse}
                    keyExtractor={(item) => item?.id?.toString()}
                    renderItem={this.renderListItem}
                />
            </T2SView>
        );
    }

    renderListItem = ({ item }) => {
        const { name, logo_url, rating, total_reviews } = item;
        let imageURL = getModifiedImageURL(logo_url);
        return (
            <RecentTakeawayListComponent
                name={name}
                rating={rating}
                total_reviews={total_reviews}
                imageURL={imageURL}
                onRecentTakeawaySelected={this.onRecentTakeawaySelected.bind(this, item)}
            />
        );
    };

    onRecentTakeawaySelected(storeInfo) {
        const { associateTakeawayResponse, countryBaseFeatureGateResponse, profileResponse, countryISO, languageKey } = this.props;
        if (isValidElement(storeInfo)) {
            Segment.trackEvent(countryBaseFeatureGateResponse, SEGMENT_EVENTS.TAKEAWAY_SELECT, {
                country_code: countryISO,
                source: SEGMENT_STRINGS.RECENT_TAKEAWAY,
                takeaway: storeInfo.name,
                user_id: isValidElement(profileResponse) ? profileResponse.id : null
            });
            if (isTakeawayBlocked(storeInfo.id, associateTakeawayResponse)) {
                this.props.navigation.dispatch(
                    showInformationAlert('', takeawayBlockedMessage(storeInfo.id, associateTakeawayResponse, languageKey))
                );
            } else {
                this.handlePersistLogic(storeInfo);
            }
        }
    }

    handlePersistLogic(item) {
        const { selectedTAOrderType } = this.props;
        handleNavigation(SCREEN_OPTIONS.MENU_SCREEN.route_name, {
            isFromReOrder: false,
            isFromRecentTakeAway: true,
            storeConfig: item
        });
        updateStoreTimeOut = setTimeout(() => {
            if (isValidElement(selectedTAOrderType)) {
                this.props.updateSelectedOrderType(selectedTAOrderType);
            }
            this.props.updateStoreConfigResponseForViewAction(item, false, true);
        }, 10);
    }
}

const mapStateToProps = (state) => ({
    isUserLoggedIn: selectHasUserLoggedIn(state),
    recentTakeawayResponse: state.foodHubHomeState.recentTakeawayResponse,
    associateTakeawayResponse: state.takeawayListReducer.associateTakeawayResponse,
    languageKey: selectLanguageKey(state),
    countryBaseFeatureGateResponse: state.appState.countryBaseFeatureGateResponse,
    profileResponse: state.profileState.profileResponse,
    countryISO: state.appState.s3ConfigResponse?.country?.iso,
    countryFlag: state.appState.s3ConfigResponse?.country?.flag,
    selectedTAOrderType: state.addressState.selectedTAOrderType
});
const mapDispatchToProps = {
    updateStoreConfigResponseForViewAction,
    updateSelectedOrderType
};
export default connect(mapStateToProps, mapDispatchToProps)(RecentTakeawayComponent);
