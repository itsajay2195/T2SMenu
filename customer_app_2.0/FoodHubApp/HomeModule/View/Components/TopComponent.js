import React, { Component, Fragment } from 'react';
import { FlatList, Keyboard, TouchableHighlight, View } from 'react-native';
import SearchBar from '../SearchBar';
import { isValidElement, isValidNumber, isValidString } from 't2sbasemodule/Utils/helpers';
import { getSearchType, isEatAppyClient } from 'appmodules/BaseModule/GlobalAppHelper';
import { AutocompleteStyle } from '../../Styles/AutocompleteStyle';
import { Text } from 'react-native-paper';
import Colors from 't2sbasemodule/Themes/Colors';
import { getFormattedFullAddress } from 'appmodules/OrderManagementModule/Utils/OrderManagementHelper';
import { connect } from 'react-redux';
import { selectHasUserLoggedIn } from 't2sbasemodule/Utils/AppSelectors';
import {
    getTakeawayListByAddressAction,
    getTakeawayListFromUserAddress,
    resetTakeawayAction
} from '../../../TakeawayListModule/Redux/TakeawayListAction';
import { postcodeInput } from '../../Redux/HomeAction';
import _ from 'lodash';
import { handleNavigation } from '../../../../CustomerApp/Navigation/Helper';
import { SCREEN_OPTIONS } from '../../../../CustomerApp/Navigation/ScreenOptions';
import TopComponentItem from './TopComponentItem';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import * as Segment from '../../../../AppModules/AnalyticsModule/Segment';
import { SEGMENT_EVENTS } from 'appmodules/AnalyticsModule/SegmentConstants';
import { updateGoogleSessionToken } from '../../../../CustomerApp/Redux/Actions';
import { isValidSearchInput } from 'appmodules/AddressModule/Utils/AddressHelpers';

class TopComponent extends Component {
    constructor(props) {
        super(props);
        this.handleAddressItem = this.handleAddressItem.bind(this);
        this.state = {
            autocompletePosition: 0,
            showAutocomplete: false,
            searchText: '',
            onMoveTop: false,
            place_id: null,
            areaSelected: null,
            isItemSelected: false,
            selectedItem: null
        };
    }

    static getDerivedStateFromProps(props, state) {
        let value = {};
        if (isValidString(state.searchText) && !isValidString(props.postcode)) {
            value.searchText = '';
            value.place_id = '';
            value.areaSelected = '';
        }
        if (props.postcode !== state.searchText) {
            value.searchText = props.postcode;
        }
        if (props.postcode !== state.searchText) {
            value.searchText = props.postcode;
        }
        return _.isEmpty(value) ? null : value;
    }

    componentDidMount() {
        this.navigationOnFocusEventListener = this.props.navigation.addListener('focus', () => {
            this.onScreenFocused();
        });
    }
    onScreenFocused() {
        this.setState({ onMoveTop: false });
    }

    render() {
        let { place_id, areaSelected, searchText, isItemSelected, selectedItem } = this.state;
        return (
            <View>
                <SearchBar
                    navigation={this.props.navigation}
                    autoFocus={false}
                    toggleAutocomplete={(value) => {
                        this.setState({ showAutocomplete: isValidElement(value) ? value : false });
                    }}
                    parentRef={this.scrollRef}
                    onGetSearchBarHeight={(height) => {
                        this.setState({ autocompletePosition: isValidNumber(height) ? height : 0 });
                    }}
                    place_id={place_id}
                    areaSelected={areaSelected}
                    resetAreaSelected={() => this.setState({ searchText: '', areaSelected: null, place_id: null })}
                    onChangeText={(text) => {
                        this.setState({ searchText: text, areaSelected: text, selectedItem: null });
                    }}
                    onMoveTop={(value) => {
                        this.setState({ onMoveTop: value });
                    }}
                    searchedIndex={searchText}
                    isItemSelected={isItemSelected}
                    changeSelectedItemStatus={() => this.setState({ isItemSelected: false })}
                    selectedItem={selectedItem}
                />
                {this.doShowAutoComplete() && this.renderAreaAutocomplete()}
                {this.props.children}
            </View>
        );
    }

    doShowAutoComplete() {
        const { showAutocomplete, searchText } = this.state;
        if (!showAutocomplete) return false;
        const { autocompletePlaces, clientType, countryFlag, addressResponse, isUserLoggedIn } = this.props;
        return (
            // Checking address data exists or not
            (isValidElement(searchText) &&
                searchText.length < 3 &&
                isUserLoggedIn &&
                !isEatAppyClient(clientType, countryFlag) &&
                isValidElement(addressResponse) &&
                isValidElement(addressResponse.data) &&
                addressResponse.data.length > 0) ||
            // Checking places data exists or not
            (isValidSearchInput(searchText) && isValidElement(autocompletePlaces) && autocompletePlaces.length > 0)
        );
    }
    renderAreaAutocomplete() {
        const { searchText } = this.state;
        const { autocompletePlaces, addressResponse } = this.props;
        const addressSearch = searchText.length < 3;

        return (
            <Fragment>
                <View style={[AutocompleteStyle.container, { top: this.state.autocompletePosition }]}>
                    <View style={AutocompleteStyle.suggestionListStyle}>
                        {addressSearch && (
                            <View>
                                <Text style={AutocompleteStyle.headerStyle}>{LOCALIZATION_STRINGS.CHOOSE_YOUR_ADDRESS}</Text>
                            </View>
                        )}

                        <FlatList
                            contentContainerStyle={AutocompleteStyle.flatListContainer}
                            nestedScrollEnabled={true}
                            keyboardShouldPersistTaps="always"
                            data={addressSearch ? addressResponse.data : autocompletePlaces}
                            renderItem={({ item }) => (addressSearch ? this.renderAddressItem(item) : this.renderPlaceItem(item))}
                            style={AutocompleteStyle.listStyle}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </View>
                <View style={AutocompleteStyle.bottomFix} />
            </Fragment>
        );
    }
    handleAddressItem(item) {
        this.props.resetTakeawayAction();
        handleNavigation(SCREEN_OPTIONS.TAKEAWAY_LIST_SCREEN.route_name);
        this.props.getTakeawayListFromUserAddress(item);
        this.setState({ isItemSelected: true, searchText: getFormattedFullAddress(item), selectedItem: item });
        this.props.postcodeInput(getFormattedFullAddress(item));
        const { countryBaseFeatureGateResponse, countryISO } = this.props;
        Segment.trackEvent(countryBaseFeatureGateResponse, SEGMENT_EVENTS.ADDRESS_SEARCHED, {
            country_code: countryISO,
            search: getFormattedFullAddress(item),
            method: 'address'
        });
    }

    renderPlaceItem(item) {
        const { searchType, countryFlag, selectedTAOrderType, googleSessionToken } = this.props;
        if (isValidElement(item) && isValidString(item.description)) {
            return (
                <TouchableHighlight
                    onPress={() => {
                        Keyboard.dismiss();
                        if (isValidElement(item)) {
                            const { countryBaseFeatureGateResponse, countryISO } = this.props;
                            this.setState({
                                isItemSelected: true,
                                showAutocomplete: false,
                                areaSelected: item.description,
                                place_id: item.place_id
                            });
                            this.props.resetTakeawayAction();
                            handleNavigation(SCREEN_OPTIONS.TAKEAWAY_LIST_SCREEN.route_name);
                            this.props.getTakeawayListByAddressAction(
                                item,
                                getSearchType(searchType, countryFlag),
                                selectedTAOrderType,
                                googleSessionToken
                            );
                            this.setState({ searchText: item.description });
                            this.props.postcodeInput(item.description);
                            Segment.trackEvent(countryBaseFeatureGateResponse, SEGMENT_EVENTS.ADDRESS_SEARCHED, {
                                country_code: countryISO,
                                search: item.description,
                                method: 'area'
                            });
                        }
                    }}
                    underlayColor={Colors.lighterGrey}
                    style={AutocompleteStyle.listItemStyle}>
                    <Text numberOfLines={2} ellipsizeMode="tail">
                        {item.description}
                    </Text>
                </TouchableHighlight>
            );
        }
    }

    renderAddressItem(item) {
        return <TopComponentItem item={item} addressText={getFormattedFullAddress(item)} onPress={this.handleAddressItem} />;
    }
}

const mapStateToProps = (state) => ({
    postcode: state.foodHubHomeState.postcode,
    autocompletePlaces: state.foodHubHomeState.autocompletePlaces,
    addressResponse: state.addressState.addressResponse,
    isUserLoggedIn: selectHasUserLoggedIn(state),
    takeawayList: state.takeawayListReducer.takeawayList,
    takeawayGetSuccess: state.takeawayListReducer.takeawayGetSuccess,
    invalidPostCodeOrAddress: state.takeawayListReducer.invalidPostCodeOrAddress,
    selectedTAOrderType: state.addressState.selectedTAOrderType,
    countryFlag: state.appState.s3ConfigResponse?.country?.flag,
    clientType: state.appState.s3ConfigResponse?.config?.client_type,
    searchType: state.appState.s3ConfigResponse?.search?.type,
    countryBaseFeatureGateResponse: state.appState.countryBaseFeatureGateResponse,
    countryISO: state.appState.s3ConfigResponse?.country?.iso,
    googleSessionToken: state.appState.googleSessionToken
});
const mapDispatchToProps = {
    getTakeawayListByAddressAction,
    postcodeInput,
    resetTakeawayAction,
    getTakeawayListFromUserAddress,
    updateGoogleSessionToken
};
export default connect(mapStateToProps, mapDispatchToProps)(TopComponent);
