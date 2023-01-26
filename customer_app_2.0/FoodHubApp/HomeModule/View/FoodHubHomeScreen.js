import React, { Component } from 'react';
import { Animated, BackHandler, Dimensions, View } from 'react-native';
import { connect } from 'react-redux';
// Constants and Strings and Styles
import styles from '../Styles/HomeStyles';
import * as Analytics from '../../../AppModules/AnalyticsModule/Analytics';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
// Actions and Helpers
import { getFoodHubTotalSavingsAction } from '../Redux/HomeAction';
import { makeGetTotalSavingsAction, refreshFoodhubHomeScreenUserData } from 'appmodules/TotalSavingsModule/Redux/TotalSavingsAction';
import { selectCurrencySymbol, selectHasUserLoggedIn, selectLanguageKey } from 't2sbasemodule/Utils/AppSelectors';
import {
    disableReorderButtonAction,
    makeGetOrderListAction,
    resetReOrderFlags,
    syncFirstTimeAppOpenOrUserLogin
} from 'appmodules/OrderManagementModule/Redux/OrderManagementAction';
import {
    resetTakeawayAction,
    stopMenuLoaderAction,
    stopTakeawayButtonLoadingAction
} from '../../TakeawayListModule/Redux/TakeawayListAction';
import { getCarousellSavingsAmountDetails, isFoodHubApp, isValidElement } from 't2sbasemodule/Utils/helpers';
import { redirectRouteAction, setSideMenuActiveAction } from '../../../CustomerApp/Redux/Actions';
import { CommonActions } from '@react-navigation/native';
import { ANALYTICS_SCREENS } from 'appmodules/AnalyticsModule/AnalyticsConstants';
import TopComponent from './Components/TopComponent';
import RecentTakeawayComponent from './Components/RecentTakeawaysComponent';
import RecentOrderAndPlaceHolderComponent from './Components/RecentOrderAndPlaceHolderComponent';
import ItemNotAvailableModal from 'appmodules/BasketModule/View/Components/ItemNotAvailableModal';
import CarouselImagesComponent from './Components/CarouselImageComponent';
import Colors from 't2sbasemodule/Themes/Colors';
import HeaderComponent from './MicroComponents/HeaderComponent';
import FoodhubHomeSlidingHeader from './MicroComponents/FoodhubHomeSlidingHeader';

let SCREEN_HEIGHT = Dimensions.get('window').height;
let TRANSITION_THRESHOLD = SCREEN_HEIGHT / 6.66;
class FoodHubHomeScreen extends Component {
    constructor(props) {
        super(props);
        this.handleNavigationForLoggedInUser = this.handleNavigationForLoggedInUser.bind(this);
        this.state = {
            isUserLoggedIn: false,
            stickyHeaderOpacity: new Animated.Value(0),
            hideStatusBar: true
        };
    }

    componentDidMount() {
        if (isFoodHubApp()) {
            this.props.getFoodHubTotalSavingsAction();
        }
        if (this.props.takeawayFetching) {
            this.props.stopTakeawayButtonLoadingAction();
        }
        if (this.props.isUserLoggedIn) {
            this.fetchData();
            this.setState({ isUserLoggedIn: this.props.isUserLoggedIn });
        }

        if (this.props.isMenuLoading) {
            this.props.stopMenuLoaderAction();
        }
        this.navigationOnFocusEventListener = this.props.navigation.addListener('focus', () => {
            this.onScreenFocused();
        });
        this.navigationOnBlurEventListener = this.props.navigation.addListener('blur', () => {
            this.onScreenBlur();
        });
        Analytics.logScreen(ANALYTICS_SCREENS.HOME);
    }

    fetchData() {
        this.props.syncFirstTimeAppOpenOrUserLogin();
    }

    componentWillUnmount() {
        this.props.resetTakeawayAction();
        this.props.resetReOrderFlags();
        this.props.disableReorderButtonAction(false);
        if (isValidElement(this.navigationOnFocusEventListener)) {
            this.props.navigation.removeListener(this.navigationOnFocusEventListener);
        }
        if (isValidElement(this.navigationOnBlurEventListener)) {
            this.props.navigation.removeListener(this.navigationOnBlurEventListener);
        }
    }

    onScreenFocused() {
        if (this.props.isUserLoggedIn) {
            setTimeout(() => {
                this.props.refreshFoodhubHomeScreenUserData();
            }, 3000);
        }
        this.backhandler = BackHandler.addEventListener('hardwareBackPress', () => {
            BackHandler.exitApp();
        });
        this.props.setSideMenuActiveAction(SCREEN_OPTIONS.HOME.route_name);
    }

    onScreenBlur() {
        this.backhandler && this.backhandler.remove();
    }

    onScrollListener = (event) => {
        if (
            isValidElement(event) &&
            isValidElement(event.nativeEvent) &&
            isValidElement(event.nativeEvent.contentOffset) &&
            isValidElement(event.nativeEvent.contentOffset.y)
        ) {
            if (event.nativeEvent.contentOffset.y >= 0) {
                Animated.parallel([
                    Animated.timing(this.state.stickyHeaderOpacity, {
                        toValue: event.nativeEvent.contentOffset.y,
                        duration: 0,
                        useNativeDriver: true
                    })
                ]).start();
            }
            if (event.nativeEvent.contentOffset.y < TRANSITION_THRESHOLD + 10 && !this.state.hideStatusBar) {
                this.setState({
                    hideStatusBar: true
                });
            }

            if (event.nativeEvent.contentOffset.y >= TRANSITION_THRESHOLD && this.state.hideStatusBar) {
                this.setState({ hideStatusBar: false });
            }
        }
    };

    render() {
        const { navigation, countryId, currencySymbol, foodHubTotalSavings, isUserLoggedIn, totalSavingsResponse, language } = this.props;
        const savingsText = getCarousellSavingsAmountDetails(
            isUserLoggedIn,
            currencySymbol,
            foodHubTotalSavings,
            totalSavingsResponse?.totalSavings
        );
        return (
            <View>
                <Animated.ScrollView
                    showsVerticalScrollIndicator={false}
                    scrollToOverflowEnabled={true}
                    ref={(ref) => {
                        this.scrollRef = ref;
                    }}
                    onScroll={Animated.event([], {
                        listener: (event) => {
                            this.onScrollListener(event);
                        }
                    })}
                    keyboardShouldPersistTaps="always">
                    <CarouselImagesComponent
                        countryId={countryId}
                        currencySymbol={currencySymbol}
                        amount={savingsText?.amount}
                        text={savingsText?.text}
                        language={language}
                    />
                    <TopComponent navigation={navigation}>
                        <RecentOrderAndPlaceHolderComponent navigation={navigation} />
                        <RecentTakeawayComponent navigation={navigation} />
                    </TopComponent>
                    <ItemNotAvailableModal />
                </Animated.ScrollView>
                <View style={styles.absoluteStyle}>
                    {this.renderHeader()}
                    <FoodhubHomeSlidingHeader
                        navigation={navigation}
                        hideStatusBar={this.state.hideStatusBar}
                        stickyHeaderOpacity={this.state.stickyHeaderOpacity}
                        handleNavigationForLoggedInUser={this.handleNavigationForLoggedInUser}
                        language={language}
                    />
                </View>
            </View>
        );
    }

    renderHeader() {
        const { navigation } = this.props;
        return (
            <View>
                <HeaderComponent
                    backgroundColor={Colors.transparent}
                    navigation={navigation}
                    handleNavigationForLoggedInUser={this.handleNavigationForLoggedInUser.bind(this)}
                />
            </View>
        );
    }

    handleNavigationForLoggedInUser() {
        const { basketStoreID } = this.props;
        if (isValidElement(basketStoreID)) {
            this.props.navigation.dispatch(
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
    isMenuLoading: state.takeawayListReducer.isMenuLoading,
    basketStoreID: state.appState.prevStoreConfigResponse?.id,
    isUserLoggedIn: selectHasUserLoggedIn(state),
    takeawayFetching: state.takeawayListReducer.takeawayFetching,
    currencySymbol: selectCurrencySymbol(state),
    foodHubTotalSavings: state.foodHubHomeState.foodHubTotalSavings,
    totalSavingsResponse: state.totalSavingsState.totalSavingsResponse,
    featureGateResponse: state.appState.countryBaseFeatureGateResponse,
    language: selectLanguageKey(state),
    countryId: state.appState.s3ConfigResponse?.country?.id
});

const mapDispatchToProps = {
    getFoodHubTotalSavingsAction,
    makeGetTotalSavingsAction,
    refreshFoodhubHomeScreenUserData,
    makeGetOrderListAction,
    resetTakeawayAction,
    syncFirstTimeAppOpenOrUserLogin,
    redirectRouteAction,
    resetReOrderFlags,
    stopMenuLoaderAction,
    setSideMenuActiveAction,
    disableReorderButtonAction,
    stopTakeawayButtonLoadingAction
};

export default connect(mapStateToProps, mapDispatchToProps)(FoodHubHomeScreen);
