import { SafeAreaView, FlatList, Animated } from 'react-native';
import { connect } from 'react-redux';
import React, { useEffect, useState, useCallback } from 'react';
import { takeawayListClickAction } from '../../../FoodHubApp/TakeawayListModule/Redux/TakeawayListAction';
import { selectStoreConfigResponse, selectStoreId } from 't2sbasemodule/Utils/AppSelectors';
import { selectFilteredRecommendation, getRecommendationResponse } from '../../HomeModule/Utils/HomeSelector';
import { selectOrderType } from '../../OrderManagementModule/Redux/OrderManagementSelectors';
import { selectCartItems } from '../../BasketModule/Redux/BasketSelectors';
import { isValidElement } from 't2sbasemodule/Utils/helpers';
import { constructSectionListData } from '../Utils/MenuHelpers';
import { getTakeawayName } from 't2sbasemodule/Utils/helpers';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import T2SIcon from 't2sbasemodule/UI/CommonUI/T2SIcon';
import { handleNavigation } from '../../../CustomerApp/Navigation/Helper';
import { GridViewSkeletonLoader } from '../Utils/MenuSkeletonLoader';
import { T2STouchableOpacity } from 't2sbasemodule/UI';
import { getStoreConfigAction } from '../../TakeawayDetailsModule/Redux/TakeawayDetailsAction';
import { showHideOrderTypeAction } from '../../OrderManagementModule/Redux/OrderManagementAction';
import TopBarComponent from './NewMenuComponents/TopBarComponent';
import TakeAwayInfoBar from './NewMenuComponents/MenuSearchBar';
import ViewCartButton from '../../BasketModule/View/Components/ViewCartButton';
import { cuisinesList } from '../../../FoodHubApp/TakeawayListModule/Utils/Helper';
import { setCategoryItems } from '../Redux/MenuAction';
import { VIEW_ID } from '../Utils/MenuConstants';
import { FONT_ICON } from '../../../CustomerApp/Fonts/FontIcon';
import Colors from 't2sbasemodule/Themes/Colors';
import { NewMenuStyle } from './Styles/NewMenuStyle';
import PreviousOrderComponent from '../../HomeModule/View/PreviousOrderComponent';
import Styles from './Styles/MenuStyle';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import MenuRecentOrders from './Components/MenuRecentOrders';
import ListViewRenderItem from './NewMenuComponents/ListViewRenderItem';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import reactotron from 'reactotron-react-native';
import { setFinalData, retunSearchItemResult } from '../Utils/MenuHelpers';

let takeAwayTitle,
    isLoading,
    formattedData,
    cuisines,
    rating,
    selectedOrderTypeOuterScope,
    searchResults = [],
    bestSellingDataOuterScope = null;
const screenName = SCREEN_OPTIONS.NEW_MENU_CATEGORY_SCREEN.route_name;

const getSubCategories = (data) => {
    return data.map((item) => item.name);
};

// const ViewSwitch = ({ isGridView, setIsGridView, isLoading }) => {
//     return (
//         <Animated.View>
//             {isLoading ? (
//                 <SwitchSkeletonLoader />
//             ) : (
//                 <Animated.View style={NewMenuStyle.headerGridWrpperStyle}>
//                     <Animated.Text> Grid</Animated.Text>
//                     <Switch
//                         trackColor={{ false: '#767577', true: '#81b0ff' }}
//                         style={NewMenuStyle.switchStyle}
//                         thumbColor={'red'}
//                         onValueChange={() => setIsGridView(!isGridView)}
//                         value={isGridView}
//                     />
//                     <Animated.Text> List</Animated.Text>
//                 </Animated.View>
//             )}
//         </Animated.View>
//     );
// };

const keyExtractor = (item) => {
    return item?.index.toString();
};

const PreviousOrdersList = ({ item }) => {
    return (
        <T2SView>
            <MenuRecentOrders isFromReOrder={true} />
            {bestSellingDataOuterScope ? (
                <T2SView style={Styles.likeIconStyle}>
                    <T2SIcon
                        id={VIEW_ID.LIKE_ICON}
                        screenName={screenName}
                        icon={FONT_ICON.LIKE}
                        color={Colors.suvaGrey}
                        style={Styles.searchIconStyle}
                        size={22}
                    />
                    <T2SText id={VIEW_ID.BEST_SELLING_ITEMS_VIEW} screenName={screenName} style={Styles.bestSellingHeaderText}>
                        {LOCALIZATION_STRINGS.TA_RECOMMENDATION}
                    </T2SText>
                </T2SView>
            ) : null}
            <PreviousOrderComponent
                screenName={screenName}
                previousOrderResponse={bestSellingDataOuterScope}
                isFromBestSelling={true}
                selectedOrderType={selectedOrderTypeOuterScope}
                isNewMenuBestSelling={true}
            />
        </T2SView>
    );
};

const gridViewRenderItem = React.memo(({ item }) => {
    const { title } = item;
    let subCategoriesData = getSubCategories(item.data);
    if (item.empty) return <T2SView style={[NewMenuStyle.gridViewItem, NewMenuStyle.itemInvisible]} />;
    if (item.title === 'row') {
        return (
            <>
                <PreviousOrdersList item={item} />;
            </>
        );
    }

    return (
        <>
            {title.length > 0 && !isLoading ? (
                <T2STouchableOpacity
                    style={NewMenuStyle.gridViewItem}
                    onPress={() => {
                        subCategoriesData.length > 1
                            ? handleNavigation(SCREEN_OPTIONS.NEW_MENU_SUBCAT_SCREEN.route_name, {
                                  //   takeAwayTitle: takeAwayTitle,
                                  item: item
                                  //   cuisines: cuisines,
                                  //   rating: rating
                              })
                            : handleNavigation(SCREEN_OPTIONS.NEW_MENU_ITEM_SCREEN.route_name, {
                                  //   takeAwayTitle: takeAwayTitle,
                                  item: item
                                  //   cuisines: cuisines,
                                  //   rating: rating
                              });
                    }}>
                    <T2SView style={NewMenuStyle.gridViewImageWrapper}>
                        <T2SIcon
                            id={VIEW_ID.INFO_CON}
                            // screenName={screenName}
                            icon={FONT_ICON.FORK_SPOON}
                            color={Colors.lightBlue}
                            size={35}
                        />
                        <T2SView style={NewMenuStyle.gridTiltleWapper}>
                            <T2SText numberOfLines={2} style={NewMenuStyle.gridViewItemTitleStyle}>
                                {title}
                            </T2SText>
                        </T2SView>
                    </T2SView>
                </T2STouchableOpacity>
            ) : (
                <GridViewSkeletonLoader />
            )}
        </>
    );
});

const renderListViewItem = ({ item }) => {
    return (
        <ListViewRenderItem
            item={item}
            takeAwayTitle={takeAwayTitle}
            cuisines={cuisines}
            rating={rating}
            isLoading={isLoading}
            getSubCategories={getSubCategories}
            bestSellingDataOuterScope={bestSellingDataOuterScope}
        />
    );
};

const ListViewFlatList = React.memo(({ menuData }) => {
    return (
        <FlatList
            ItemSeparatorComponent={() => <T2SView style={NewMenuStyle.listItemSeparator} />}
            removeClippedSubviews
            data={menuData}
            renderItem={renderListViewItem}
            windowSize={60}
            initialNumToRender={21}
            maxToRenderPerBatch={12}
            updateCellsBatchingPeriod={30}
            keyExtractor={keyExtractor}
            contentContainerStyle={{ paddingBottom: 30 }}
            showsVerticalScrollIndicator={false}
        />
    );
});

const GridViewFlatList = React.memo(({ menuData }) => {
    return <FlatList data={menuData} numColumns={3} renderItem={gridViewRenderItem} keyExtractor={(item) => item.index} />;
});

let getMenu = (route, prevStoreConfigResponse, triggerNewMenu, storeConfigResponse) => {
    if (isValidElement(route) && isValidElement(route.params)) {
        const isFromRecentTakeAway = isValidElement(route.params.isFromRecentTakeAway) ? route.params.isFromRecentTakeAway : false;
        if (route.params.isFromCartIcon && isValidElement(prevStoreConfigResponse)) {
            //For Customer App we are hitting the API every kill and launch
            let storeConfigData = prevStoreConfigResponse;
            triggerNewMenu(storeConfigData, isFromRecentTakeAway);
        } else if (isValidElement(route.params.storeConfig)) {
            triggerNewMenu(route.params.storeConfig, isFromRecentTakeAway);
        } else if (isValidElement(storeConfigResponse)) {
            triggerNewMenu(storeConfigResponse, isFromRecentTakeAway);
        }
    }
};

// const formatData = (data, numColumns, isGrid) => {
//     if (isGrid) {
//         return data;
//     } else {
//         const numberOfFullRows = Math.floor(data.length / numColumns);
//         let numberOfElementsLastRow = data.length - numberOfFullRows * numColumns;
//         while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
//             data.push({ title: `blank-${numberOfElementsLastRow}`, empty: true, data: [] });
//             numberOfElementsLastRow++;
//         }
//         return data;
//     }
// };
const handleItemSearch = (formattedQuery) => {
    const itemSearchResults = searchResults.filter((item) => item.value.toLowerCase().includes(formattedQuery)).map((item) => item.index);
    return [...new Set(itemSearchResults)];
};

const searchOperation = (text, setMenu) => {
    reactotron.log(formattedData);
    if (text.length > 0) {
        const formattedQuery = text.toLowerCase();
        const newData = formattedData.filter((item) => item.title.toLowerCase().includes(formattedQuery));
        const itemSearchResult = handleItemSearch(formattedQuery);
        reactotron.log('itemSearchResult', itemSearchResult);
        // const categoryData = formattedData.filter((item) => item.title.toLowerCase().includes(formattedQuery));
        // const itemData = formattedData.filter((item) => item.title.toLowerCase().includes(formattedQuery));
        setMenu(newData);
    } else {
        setMenu(formattedData);
    }
};

const clearSearch = (setMenu, setSearchTextInput) => {
    setMenu(formattedData);
    setSearchTextInput('');
};

const NewMenu = (props) => {
    const [menu, setMenu] = useState(null);
    const [isGridView] = useState(true);
    const [takeAwayName, setTakeAwayName] = useState(null);
    const [mount, setMount] = useState(false);
    const [searchTextInput, setSearchTextInput] = useState('');
    const onClearPress = useCallback(() => clearSearch(setMenu, setSearchTextInput), [setMenu, setSearchTextInput]);
    const { filteredMenu } = props;
    const {
        route,
        storeConfigResponse,
        prevStoreConfigResponse,
        takeawayListClickAction: triggerNewMenu,
        isMenuLoading,
        countryBaseFeatureGateResponse,
        storeFromListResponse,
        storeConfigShowCollection,
        selectedOrderType,
        ourRecommendationsLoading,
        bestSellingResponse
    } = props;
    isLoading = isMenuLoading;
    const takeAwayInfoPressArgs = {
        storeConfigResponse: storeConfigResponse,
        countryBaseFeatureGateResponse: countryBaseFeatureGateResponse,
        getStoreConfigAction: props.getStoreConfigAction,
        showHideOrderTypeAction: showHideOrderTypeAction,
        storeFromListResponse: storeFromListResponse,
        storeConfigShowCollection: storeConfigShowCollection
    };

    useEffect(() => {
        bestSellingDataOuterScope = null;
        if (mount) return;
        getMenu(route, prevStoreConfigResponse, triggerNewMenu, storeConfigResponse);
    }, [mount, prevStoreConfigResponse, route, storeConfigResponse, triggerNewMenu]);

    useEffect(() => {
        let sectionListData;
        sectionListData = constructSectionListData(filteredMenu);
        formattedData = sectionListData.splice(1);
        setFinalData(formattedData);
        // setMenu(formattedData);
        if (!ourRecommendationsLoading && !isMenuLoading) {
            sectionListData = constructSectionListData(filteredMenu);
            formattedData = sectionListData.splice(1);
            // setMenu(formattedData);
            if (bestSellingResponse && bestSellingResponse.length > 0) {
                bestSellingDataOuterScope = bestSellingResponse;
                let test = { title: 'row', description: undefined, data: [bestSellingResponse], index: 0 };
                formattedData.unshift(test);
                setMenu(formattedData);
            }
            setMenu(formattedData);
        }
    }, [bestSellingResponse, filteredMenu, isMenuLoading, ourRecommendationsLoading]);

    useEffect(() => {
        // if (mount) return;
        setTakeAwayName(getTakeawayName(props.storeConfigName));
        setMount(true);
    }, [props.storeConfigName]);

    const filterResults = useCallback((text) => {
        setSearchTextInput(text);
        searchOperation(text, setMenu);
    }, []);

    // useEffect(() => {
    //     if (!isMenuLoading && formattedData === menu) {
    //         reactotron.log('im called', formattedData);
    //     }
    // }, [isMenuLoading, menu]);

    takeAwayTitle = takeAwayName;
    selectedOrderTypeOuterScope = selectedOrderType;
    searchResults = retunSearchItemResult();

    if (prevStoreConfigResponse !== storeConfigResponse) {
        cuisines = cuisinesList(storeConfigResponse?.cuisines);
        rating = storeConfigResponse?.rating;
    }

    return (
        <SafeAreaView style={NewMenuStyle.flex1}>
            <Animated.View style={NewMenuStyle.container}>
                <TopBarComponent
                    searchTextInput={searchTextInput}
                    setSearchTextInput={filterResults}
                    isLoading={isLoading}
                    clearSearch={onClearPress}
                    placeholderText={'Search Categories...'}
                />
                <TakeAwayInfoBar
                    takeAwayName={takeAwayName}
                    takeAwayInfoPressArgs={takeAwayInfoPressArgs}
                    isLoading={isLoading}
                    selectedOrderType={selectedOrderType}
                    cuisines={cuisines}
                    rating={rating}
                />
                {/* <ViewSwitch isLoading={isLoading} isGridView={isGridView} setIsGridView={setIsGridView} /> */}
                <T2SView style={NewMenuStyle.listViewWrapper}>
                    {isGridView ? (
                        <ListViewFlatList menuData={menu} loading={props.isMenuLoading} takeAwayTitle={takeAwayName} />
                    ) : (
                        <GridViewFlatList menuData={menu} loading={props.isMenuLoading} takeAwayTitle={takeAwayName} />
                    )}
                </T2SView>
            </Animated.View>
            <ViewCartButton />
        </SafeAreaView>
    );
};

const mapStateToProps = (state) => ({
    filteredMenu: state.menuState.uiFilteredMenu,
    storeConfigResponse: selectStoreConfigResponse(state),
    isMenuLoading: state.takeawayListReducer.isMenuLoading,
    storeID: selectStoreId(state),
    selectedOrderType: selectOrderType(state),
    bestSellingResponse: selectFilteredRecommendation(state),
    ourRecommendation: getRecommendationResponse(state),
    cartItems: selectCartItems(state),
    basketStoreID: state.basketState.storeID,
    prevStoreConfigResponse: state.appState.prevStoreConfigResponse,
    storeConfigName: state.appState.storeConfigResponse?.name,
    storeConfigId: state.appState.storeConfigResponse?.id,
    countryBaseFeatureGateResponse: state.appState.countryBaseFeatureGateResponse,
    storeFromListResponse: state.appState.storeFromListResponse,
    storeConfigShowCollection: state.appState.storeConfigResponse?.show_collection,
    ourRecommendationsLoading: state.homeState.ourRecommendationsLoading
});

const mapDispatchToProps = {
    takeawayListClickAction,
    getStoreConfigAction,
    showHideOrderTypeAction,
    setCategoryItems
};

export default connect(mapStateToProps, mapDispatchToProps)(NewMenu);
