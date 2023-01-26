import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { connect } from 'react-redux';
import { SafeAreaView, Text, View, Image, FlatList } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import QuantityButton from './Components/QuantityButton';
import ViewCartButton from '../../BasketModule/View/Components/ViewCartButton';
import TopBarComponent from './NewMenuComponents/TopBarComponent';
import { showHideOrderTypeAction } from '../../OrderManagementModule/Redux/OrderManagementAction';
import { getStoreConfigAction } from '../../TakeawayDetailsModule/Redux/TakeawayDetailsAction';
import { selectStoreConfigResponse, selectStoreId } from 't2sbasemodule/Utils/AppSelectors';
import { selectOrderType } from '../../OrderManagementModule/Redux/OrderManagementSelectors';
import { selectFilteredRecommendation, getRecommendationResponse } from '../../HomeModule/Utils/HomeSelector';
import { selectCartItems } from '../../BasketModule/Redux/BasketSelectors';
import { getSubCatItemsSelector } from '../Redux/MenuSelector';
import { setFinalData } from '../Utils/MenuHelpers';
import { MenuCategoryItemsStyle } from './Styles/NewMenuStyle';
import reactotron from 'reactotron-react-native';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import T2SImage from 't2sbasemodule/UI/CommonUI/T2SImage';
import { isValidString } from 't2sbasemodule/Utils/helpers';
import { VIEW_ID } from '../Utils/MenuConstants';
import { T2SText } from 't2sbasemodule/UI';
import { getOfferText } from '../../BasketModule/Utils/BasketHelper';

let showSeperator = false;
let formattedData, setCategoryOuterScope, setSearchTextInputOuterScope;

let screenName = SCREEN_OPTIONS.NEW_MENU_ITEM_SCREEN.route_name;
const SubCatItem = ({ subCategories }) => {
    const { value: title, image, price, collection, delivery, description, offer } = subCategories;
    const memoizedRightViewWrapperStyle = useMemo(() => {
        return {
            ...MenuCategoryItemsStyle.rightViewWrapper,
            top: image ? -20 : 0,
            marginBottom: image ? -20 : 0,
            marginTop: image ? 0 : 15
        };
    }, [image]);
    return (
        <>
            <View style={MenuCategoryItemsStyle.subCatItemStyle}>
                <View style={MenuCategoryItemsStyle.leftViewItemWrapper}>
                    <View style={MenuCategoryItemsStyle.leftItemWrapperContentStyle}>
                        <View style={MenuCategoryItemsStyle.flex1}>
                            <Text numberOfLines={3} style={MenuCategoryItemsStyle.lefttViewItemTitleStyle}>
                                {title}
                            </Text>
                            {description ? (
                                <Text numberOfLines={2} style={MenuCategoryItemsStyle.leftViewItemDescriptionStyle}>
                                    {description}
                                </Text>
                            ) : null}
                        </View>

                        <View style={MenuCategoryItemsStyle.leftViewImageWrapper}>
                            {image ? (
                                <Image
                                    style={MenuCategoryItemsStyle.itemImageStyle}
                                    resizeMethod="contain"
                                    source={{
                                        uri: image
                                    }}
                                />
                            ) : null}
                        </View>
                    </View>
                </View>

                <View style={memoizedRightViewWrapperStyle}>
                    <View style={MenuCategoryItemsStyle.priceAndBogofContainer}>
                        <View style={MenuCategoryItemsStyle.priceAndBogofWrapper}>
                            <View style={MenuCategoryItemsStyle.priceItemWrapper}>
                                {price ? <Text style={MenuCategoryItemsStyle.priceTextStyle}>{price}</Text> : null}
                            </View>
                            {offer !== 'NONE' ? (
                                <View style={MenuCategoryItemsStyle.menuItemOfferWrapper}>
                                    <T2SText
                                        id={VIEW_ID.ITEM + offer}
                                        screenName={screenName}
                                        style={MenuCategoryItemsStyle.offerLabel}
                                        numberOfLines={2}>
                                        {getOfferText(offer)}
                                    </T2SText>
                                </View>
                            ) : null}
                        </View>
                    </View>
                    <View style={MenuCategoryItemsStyle.rightViewImageWrapper}>
                        <QuantityButton
                            item={subCategories}
                            collectionType={collection}
                            deliveryType={delivery}
                            screenName={screenName}
                            // isFromReOrder={isFromReOrder}
                            // isFromPreviousOrder={isFromPreviousOrder}
                        />
                    </View>
                </View>
            </View>
            {showSeperator ? <View style={MenuCategoryItemsStyle.itemSeparator} /> : null}
        </>
    );
};

const SubCatHeader = ({ title }) => {
    return (
        <View style={MenuCategoryItemsStyle.subCatHeaderContainer}>
            <Text style={MenuCategoryItemsStyle.subCatHeaderText}>{title}</Text>
        </View>
    );
};

const SubCatSectionHeader = ({ title, image, description }) => {
    return (
        <View style={MenuCategoryItemsStyle.subCatHeaderContainer}>
            <T2SText screenName={screenName} id={VIEW_ID.SUBCATEGORY_TITLE} style={MenuCategoryItemsStyle.subCatSectionTextStyle}>
                {title}
            </T2SText>
            {description ? (
                <T2SText
                    screenName={screenName}
                    id={VIEW_ID.SUBCATEGORY_DESCRIPTION}
                    style={MenuCategoryItemsStyle.subcatDescriptionText}
                    numberOfLines={2}>
                    {description}
                </T2SText>
            ) : null}
            {isValidString(image) ? <T2SImage source={{ uri: image }} style={MenuCategoryItemsStyle.subcatImageStyle} /> : null}
        </View>
    );
};

const flatListRenderItem = ({ item }) => {
    const { title, value, image, description } = item;
    switch (title) {
        case 'title_cat':
            showSeperator = false;
            return <SubCatHeader key={value} title={value} subCategories={item} />;
        case 'subcategory':
            showSeperator = false;
            return <SubCatSectionHeader key={value} title={value} subCategories={item} image={image} description={description} />;
        default:
            showSeperator = true;
            return <SubCatItem key={value} title={value} subCategories={item} />;
    }
};

const searchOperation = (text, setCatItems) => {
    if (text.length > 0) {
        const formattedQuery = text.toLowerCase();
        const newData = formattedData.filter(
            (catItem) =>
                catItem.value?.toLowerCase().includes(formattedQuery) && (catItem.title !== 'title_cat' || catItem.title !== 'subcategory')
        );
        setCatItems(newData);
    } else {
        setCatItems(formattedData);
    }
};

const clearSearch = (setCatItems, setSearchTextInput) => {
    setCatItems(formattedData);
    setSearchTextInput('');
};

const filterResults = (text) => {
    setSearchTextInputOuterScope(text);
    searchOperation(text, setCategoryOuterScope);
};

const NewMenuItemList = (props) => {
    const { route } = props;
    const { item } = route?.params ?? formattedData;
    const [catItems, setCatItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const sortedCatItems = useMemo(() => (item ? setFinalData([item]) : formattedData), [item]);
    const [searchTextInput, setSearchTextInput] = useState('');
    (setCategoryOuterScope = setCatItems), (setSearchTextInputOuterScope = setSearchTextInput);
    const onClearPress = useCallback(() => clearSearch(setCatItems, setSearchTextInput), [setCatItems, setSearchTextInput]);
    const keyExtractor = (subcatItem) => {
        return subcatItem?.id;
    };
    useEffect(() => {
        if (!catItems.length > 0 && !searchTextInput.length > 0) {
            setCatItems(sortedCatItems[0].data);
            formattedData = sortedCatItems[0].data;
            reactotron.log(formattedData);
        } else {
            setLoading(false);
        }
    }, [catItems, sortedCatItems, loading, searchTextInput]);

    return (
        <SafeAreaView style={MenuCategoryItemsStyle.flex1}>
            {loading ? (
                <View style={MenuCategoryItemsStyle.activityIndicatorWrapper}>
                    <ActivityIndicator size={'large'} color={'red'} />
                </View>
            ) : (
                <View style={MenuCategoryItemsStyle.container}>
                    <TopBarComponent
                        searchTextInput={searchTextInput}
                        setSearchTextInput={filterResults}
                        clearSearch={onClearPress}
                        placeholderText={'Search Items...'}
                    />
                    <View style={MenuCategoryItemsStyle.subCategoryListComponentWrapper}>
                        <FlatList
                            data={catItems}
                            windowSize={60}
                            initialNumToRender={30}
                            maxToRenderPerBatch={12}
                            updateCellsBatchingPeriod={20}
                            renderItem={flatListRenderItem}
                            keyExtractor={keyExtractor}
                        />
                    </View>
                </View>
            )}
            <ViewCartButton />
        </SafeAreaView>
    );
};

const mapStateToProps = (state) => ({
    filteredMenu: state.menuState.uiFilteredMenu,
    subCatItem: getSubCatItemsSelector(state),
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
    storeConfigShowCollection: state.appState.storeConfigResponse?.show_collection
});

const mapDispatchToProps = {
    getStoreConfigAction,
    showHideOrderTypeAction
};

export default connect(mapStateToProps, mapDispatchToProps)(NewMenuItemList);
