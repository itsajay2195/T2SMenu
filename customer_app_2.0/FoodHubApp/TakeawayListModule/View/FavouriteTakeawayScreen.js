import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import {
    getFavouriteTakeawayAction,
    getFavouriteTakeawayListAction,
    resetFavouriteSearchListAction,
    searchElementMethodAction
} from '../Redux/TakeawayListAction';
import BaseComponent from 'appmodules/BaseModule/BaseComponent';
import TakeawayListWidget from './Components/TakeawayListWidget';
import { FONT_ICON } from '../../../CustomerApp/Fonts/FontIcon';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import { FavouriteTakeawayStyle } from '../Style/FavouriteTakeawayListStyle';
import { selectHasUserLoggedIn } from 't2sbasemodule/Utils/AppSelectors';
import { isValidElement, isValidString } from 't2sbasemodule/Utils/helpers';
import { FILTER_TAKEAWAY_CONSTANTS, SCREEN_NAME, SEARCH_TYPE } from '../Utils/Constants';
import ViewCartButton from 'appmodules/BasketModule/View/Components/ViewCartButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Analytics from 'appmodules/AnalyticsModule/Analytics';
import { ANALYTICS_SCREENS } from 'appmodules/AnalyticsModule/AnalyticsConstants';
import { CuisineSearchInput } from './MicroComponents/CuisinesSearchInput';

class FavouriteTakeawayScreen extends Component {
    constructor(props) {
        super(props);
        this.updateFavouriteTakeawayList = this.updateFavouriteTakeawayList.bind(this);
        this.handleTextChanged = this.handleTextChanged.bind(this);
        this.state = {
            textInputValue: null
        };
    }

    componentDidMount() {
        Analytics.logScreen(ANALYTICS_SCREENS.FAVOURITE_TAKEAWAY);
        this.didFocus = this.props.navigation.addListener('focus', () => {
            this.setState({ textInputValue: null });
            if (isValidElement(this.props.isUserLoggedIn) && this.props.isUserLoggedIn) {
                this.props.getFavouriteTakeawayListAction();
                this.props.getFavouriteTakeawayAction();
            }
        });
        this.didBlur = this.props.navigation.addListener('blur', () => {
            this.setState({ textInputValue: null });
            this.props.resetFavouriteSearchListAction();
        });
    }

    componentWillUnmount() {
        if (isValidElement(this.didFocus)) this.props.navigation.removeListener(this.didFocus);
        if (isValidElement(this.didBlur)) this.props.navigation.removeListener(this.didBlur);
    }

    handleTextChanged(text) {
        this.setState({ textInputValue: text });
        this.props.searchElementMethodAction(this.props.favouriteTakeawayListResponse, text, SEARCH_TYPE.FAVOURITE_TAKEAWAYS);
    }

    updateFavouriteTakeawayList() {
        if (isValidString(this.state.textInputValue)) {
            this.props.searchElementMethodAction(
                this.props.favouriteTakeawayList,
                this.state.textInputValue,
                SEARCH_TYPE.FAVOURITE_TAKEAWAYS
            );
        }
    }

    renderCustomView() {
        return (
            <CuisineSearchInput
                isFromFavTAList={true}
                textValue={this.state.textInputValue}
                handleTextChange={this.handleTextChanged}
                placeholderText={LOCALIZATION_STRINGS.SEARCH_FOR_TAKEAWAY}
            />
        );
    }

    render() {
        let data;
        const {
            favouriteTakeawayList,
            route,
            searchedFavouriteTakeawayList,
            favouriteTakeaways,
            selectedTAOrderType,
            countryId,
            navigation
        } = this.props;
        const { textInputValue } = this.state;
        if (isValidElement(textInputValue) && isValidElement(searchedFavouriteTakeawayList)) {
            data = searchedFavouriteTakeawayList;
        } else {
            data = favouriteTakeawayList;
        }
        return (
            <BaseComponent
                icon={
                    isValidElement(route?.params?.viewType) && route.params.viewType === FILTER_TAKEAWAY_CONSTANTS.TAKEAWAY_LIST
                        ? FONT_ICON.BACK
                        : FONT_ICON.HAMBURGER
                }
                showElevation={false}
                showHeader={true}
                showCommonActions={false}
                customView={this.renderCustomView()}>
                <View style={FavouriteTakeawayStyle.headersBottomViewStyle} />
                <KeyboardAwareScrollView enabled behavior="padding" keyboardShouldPersistTaps="always" showsVerticalScrollIndicator={false}>
                    {isValidElement(data) && (
                        <View style={FavouriteTakeawayStyle.fullFlex}>
                            <TakeawayListWidget
                                screenName={SCREEN_NAME.FAVOURITE_TAKEAWAY_LIST}
                                data={data}
                                favouriteTakeaways={favouriteTakeaways}
                                viewType={FILTER_TAKEAWAY_CONSTANTS.FAVOURITE_TAKEAWAY_LIST}
                                updateFavouriteTakeawayList={this.updateFavouriteTakeawayList}
                                navigation={navigation}
                                route={route}
                                onlineTakeaways={data.onlineTakeaways}
                                preorderTakeaways={data.preOrderTakeaways}
                                closedTakeaways={data.closedTakeawayList}
                                orderType={selectedTAOrderType}
                                countryId={countryId}
                                isFromFavouriteSearch={isValidString(textInputValue)}
                            />
                        </View>
                    )}
                </KeyboardAwareScrollView>
                <ViewCartButton screenName={SCREEN_NAME.TAKEAWAY_LIST_SCREEN} handleBasketNavigation={true} />
            </BaseComponent>
        );
    }
}

const mapStateToProps = (state) => ({
    isUserLoggedIn: selectHasUserLoggedIn(state),
    favouriteTakeawayList: state.takeawayListReducer.favouriteTakeawayList,
    searchedFavouriteTakeawayList: state.takeawayListReducer.searchedFavouriteTakeawayList,
    favouriteTakeaways: state.takeawayListReducer.favouriteTakeaways,
    favouriteTakeawayListResponse: state.takeawayListReducer.favouriteTakeawayListResponse,
    selectedTAOrderType: state.addressState.selectedTAOrderType,
    countryId: state.appState.s3ConfigResponse?.country?.id
});
const mapDispatchToProps = {
    getFavouriteTakeawayListAction,
    searchElementMethodAction,
    getFavouriteTakeawayAction,
    resetFavouriteSearchListAction
};
export default connect(mapStateToProps, mapDispatchToProps)(FavouriteTakeawayScreen);
