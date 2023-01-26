import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ActivityIndicator, BackHandler, FlatList, View } from 'react-native';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';

import { ADD_ON_TYPE, DEFAULT_CATEGORY_INDEX, DEFAULT_MODIFIER, MODIFIER_ADD_ON, VIEW_ID } from '../Utils/MenuConstants';
import Styles from './Styles/AddOnStyles';
import { T2SAppBar, T2SDivider } from 't2sbasemodule/UI';
import { firstCharacterUpperCased, isValidElement, isValidString, makeHapticFeedback, safeStringValue } from 't2sbasemodule/Utils/helpers';
import {
    areAddOnsEqual,
    canAllowForNextMove,
    constructAddOnCategoryObject,
    getButtonName,
    getModifierColor,
    getModifierStyle,
    getNextMoveId,
    handleMixedAddOn,
    handleSelectedAddOnState,
    isMandatoryAddOn,
    isMixedMenu,
    isRadioAddonAvailable,
    isReadyToAdd
} from '../Utils/MenuHelpers';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import { selectCurrencyFromStore } from 't2sbasemodule/Utils/AppSelectors';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import { showErrorMessage } from 't2sbasemodule/Network/NetworkHelpers';
import SelectedAddOn from 't2sbasemodule/UI/CustomUI/SelectedAddon';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Analytics from 't2sbasemodule/Utils/Analytics';
import { addOnItemButtonTappedAction } from '../../BasketModule/Redux/BasketAction';
import { ADD_BUTTON_CONSTANT } from 't2sbasemodule/UI/CustomUI/ItemAddButton/Utils/AddButtonConstant';
import { selectCountryBaseFeatureGateResponse, selectLastAddOnID, selectLastAddOnItems } from '../../BasketModule/Redux/BasketSelectors';
import { isNoOfferItem } from '../../BasketModule/Utils/BasketHelper';
import { debounce } from 'lodash';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from '../../AnalyticsModule/AnalyticsConstants';
import { HapticFrom } from '../../../T2SBaseModule/Utils/Constants';
import AddOnItem from './Components/AddOnItem';
import Colors from 't2sbasemodule/Themes/Colors';
import { selectMenuAddonsLoadingResponse } from '../Redux/MenuSelector';

const screenName = SCREEN_OPTIONS.MENU_ADD_ON.route_name;

class AddOn extends Component {
    constructor(props) {
        super(props);
        this.handleAddOnTotal = this.handleAddOnTotal.bind(this);
        this.backAction = this.backAction.bind(this);
        this.onBackPress = this.onBackPress.bind(this);
        this.state = {
            addOnTotal: 0,
            selectText: '',
            modifier: DEFAULT_MODIFIER,
            addOnCategoryGroup: {},
            addOnCategoryMap: null,
            addOnCategoryGroupList: [],
            selectedAddOnItems: [],
            currentAddOnCategoryIndex: DEFAULT_CATEGORY_INDEX
        };
        this.selectedAddonref = React.createRef();
    }

    componentDidMount() {
        let { addOnCategoryId, addOnCategoryGroup } = this.props.route.params;
        Analytics.logScreen(`${SCREEN_OPTIONS.MENU_ADD_ON.screen_title}${addOnCategoryId}`);
        if (!this.props.isMenuAddonsLoading) {
            this.populateInitialValues(addOnCategoryId, addOnCategoryGroup);
        }
        this.navigationOnFocusEventListener = this.props.navigation.addListener('focus', () => {
            BackHandler.addEventListener('hardwareBackPress', this.backAction);
        });
        this.navigationOnBlurEventListener = this.props.navigation.addListener('blur', () => {
            BackHandler.removeEventListener('hardwareBackPress', this.backAction);
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (
            !this.props.isMenuAddonsLoading &&
            !isValidElement(prevProps.menuAddOnGroupResponse) &&
            isValidElement(this.props.menuAddOnGroupResponse)
        ) {
            let { addOnCategoryId, addOnCategoryGroup } = this.props.route.params;
            this.populateInitialValues(addOnCategoryId, addOnCategoryGroup);
        }
    }

    componentWillUnmount() {
        if (isValidElement(this.navigationOnFocusEventListener)) {
            this.props.navigation.removeListener(this.navigationOnFocusEventListener);
        }
        if (isValidElement(this.navigationOnBlurEventListener)) {
            this.props.navigation.removeListener(this.navigationOnBlurEventListener);
        }
    }

    populateInitialValues(addOnCategoryId, addOnCategoryGroup = null, fromNextButton = false, fromSelectedAddon = false) {
        const { addOnCategoryGroupList, selectedAddOnItems } = this.state;
        let currentAddOnCategoryGroup = isValidElement(addOnCategoryGroup)
            ? addOnCategoryGroup
            : constructAddOnCategoryObject(addOnCategoryId);
        //todo: if constructed addonCategoryGroup is not valid and isMenuAddonLoading/menuAddonGroupResponse is null, navigate back and execute handleAddOrRemoveItemToBasket.
        let index;

        if (fromNextButton) {
            index = this.state.currentAddOnCategoryIndex + 1;
        } else if (fromSelectedAddon) {
            index = addOnCategoryGroup.addOnCategoryIndex;
        } else {
            index = this.state.currentAddOnCategoryIndex;
        }
        currentAddOnCategoryGroup = {
            ...currentAddOnCategoryGroup,
            addOnCategoryIndex: index
        };
        const matchingObj = addOnCategoryGroupList.find(
            (item) =>
                isValidElement(item) &&
                isValidElement(item.id) &&
                safeStringValue(item.id) === safeStringValue(currentAddOnCategoryGroup.id)
        );
        let newCategoryGroupList;
        if (!isValidElement(matchingObj)) {
            newCategoryGroupList = [...addOnCategoryGroupList, currentAddOnCategoryGroup];
        }

        this.setState({
            selectText:
                isValidElement(currentAddOnCategoryGroup) && isValidString(currentAddOnCategoryGroup.description)
                    ? currentAddOnCategoryGroup.description
                    : LOCALIZATION_STRINGS.PLEASE_SELECT,
            addOnCategoryGroup: currentAddOnCategoryGroup,
            addOnTotal: this.handleAddOnTotal(),
            buttonName: getButtonName(currentAddOnCategoryGroup),
            addOnCategoryGroupList: newCategoryGroupList ?? addOnCategoryGroupList,
            selectedAddOnItems: selectedAddOnItems ?? [],
            currentAddOnCategoryIndex: index,
            modifier: DEFAULT_MODIFIER
        });
    }
    backAction() {
        this.onBackPress();
        return true;
    }

    onBackPress() {
        if (isValidElement(this.state.addOnCategoryGroup) && this.state.currentAddOnCategoryIndex === 0) {
            this.props.navigation.pop();
            return;
        }
        const addonIndex = this.state.currentAddOnCategoryIndex - 1;
        if (
            isValidElement(this.state.addOnCategoryGroupList) &&
            isValidElement(this.state.addOnCategoryGroup) &&
            this.state.addOnCategoryGroupList.length > addonIndex
        ) {
            const tempAddOnCatGroup = this.state.addOnCategoryGroupList[addonIndex];
            if (isValidElement(tempAddOnCatGroup)) {
                this.setState(
                    {
                        addOnCategoryGroup: tempAddOnCatGroup,
                        currentAddOnCategoryIndex: addonIndex
                    },
                    () => {
                        this.populateInitialValues(null, this.state.addOnCategoryGroup);
                    }
                );
            }
        }
    }
    render() {
        let { route } = this.props;
        const { selectedAddOnItems } = this.state;
        let { name } = route.params;
        return (
            <SafeAreaView style={Styles.parentContainer}>
                <T2SAppBar
                    showElevation={false}
                    title={name}
                    actions={
                        isValidElement(selectedAddOnItems) &&
                        selectedAddOnItems.length > 0 && (
                            <T2SText
                                id={VIEW_ID.CLEAR_ALL}
                                screenName={screenName}
                                onPress={() => {
                                    this.setState(
                                        {
                                            currentAddOnCategoryIndex: DEFAULT_CATEGORY_INDEX,
                                            selectedAddOnItems: [],
                                            addOnCategoryGroupList: [],
                                            modifier: DEFAULT_MODIFIER
                                        },
                                        () => {
                                            let { addOnCategoryId } = this.props.route.params;
                                            this.populateInitialValues(addOnCategoryId);
                                        }
                                    );
                                }}
                                style={Styles.clearTextStyle}>
                                {LOCALIZATION_STRINGS.CLEAR_ALL}
                            </T2SText>
                        )
                    }
                    handleLeftActionPress={this.onBackPress}
                />
                {this.renderSelectedAddOn()}
                {this.renderAddOns()}
                {this.renderBottomButton()}
            </SafeAreaView>
        );
    }

    renderAddonLoader() {
        if (this.props.isMenuAddonsLoading) {
            return (
                <View style={Styles.addonLoaderView}>
                    <ActivityIndicator color={Colors.secondary_color} size={'large'} />
                </View>
            );
        }
    }

    renderSelectedAddOn() {
        let { selectedAddOnItems } = this.state;
        return (
            <SelectedAddOn
                screenName={screenName}
                addOns={selectedAddOnItems}
                ref={this.selectedAddonref}
                handleOnPress={this.handleSelectedAddOn}
            />
        );
    }

    renderAddOns() {
        let { selectText } = this.state;
        return (
            <>
                <View style={Styles.selectTextContainer}>
                    <T2SText id={VIEW_ID.PLEASE_SELECT} screenName={screenName} style={Styles.selectTextStyle}>
                        {selectText}
                    </T2SText>
                </View>
                {isValidElement(this.state.addOnCategoryGroup) &&
                    isValidElement(this.state.addOnCategoryGroup.modifierList) &&
                    this.state.addOnCategoryGroup.modifierList.length > 0 &&
                    this.renderModifierAddOns()}
                <T2SDivider style={Styles.divider} />
                {this.renderAddonLoader()}
                {this.renderItems()}
            </>
        );
    }

    renderModifierAddOns() {
        let modifierAddOnList = this.state.addOnCategoryGroup.modifierList;
        return (
            <View style={[Styles.modifierAddOnParentContainer, modifierAddOnList.length > 0 ? Styles.modifierAddOnContainer : {}]}>
                <FlatList
                    data={modifierAddOnList}
                    renderItem={({ item }) => this.renderModifierItem(item)}
                    numColumns={3}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        );
    }

    renderModifierItem(item) {
        let { modifier } = this.state;
        return (
            <T2STouchableOpacity
                id={VIEW_ID.MODIFIER_ADD_ON + item.id}
                screenName={screenName}
                key={item.id}
                style={[Styles.defaultModifierStyle, getModifierStyle(item.name, modifier)]}
                onPress={this.modifierOnPress.bind(this, item)}>
                <T2SText
                    id={VIEW_ID.MODIFIER_ADD_ON + item.name}
                    screenName={screenName}
                    style={[Styles.modifierFont, { color: getModifierColor(item.name, modifier) }]}>
                    {firstCharacterUpperCased(item.name)}
                </T2SText>
            </T2STouchableOpacity>
        );
    }

    modifierOnPress(item) {
        let { modifier } = this.state;
        if (item.name !== modifier) {
            Analytics.logEvent(ANALYTICS_SCREENS.ADD_ON, ANALYTICS_EVENTS.MODIFIER_BUTTON);
            this.setState({ modifier: item.name });
        } else {
            this.setState({ modifier: DEFAULT_MODIFIER });
        }
    }

    renderItems() {
        if (
            isValidElement(this.state.addOnCategoryGroup) &&
            isValidElement(this.state.addOnCategoryGroup.addOnList) &&
            this.state.addOnCategoryGroup.addOnList.length > 0
        ) {
            return (
                <FlatList
                    data={this.state.addOnCategoryGroup.addOnList}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={this.renderListItem}
                />
            );
        }
    }

    renderListItem = ({ item, index }) => {
        return (
            <AddOnItem
                currency={this.props.currency}
                screenName={screenName}
                addOn={item}
                onPress={() => {
                    this.handleItemTapped(item, index);
                }}
            />
        );
    };

    renderBottomButton() {
        let { buttonName } = this.state;
        let { currency } = this.props;
        return (
            <View style={Styles.bottomButtonContainer}>
                <View style={Styles.bottomButtonStyle}>
                    <T2SText id={VIEW_ID.ADD_ON_TOTAL} screenName={screenName} style={Styles.addOnTotalText}>
                        {LOCALIZATION_STRINGS.LABEL_ADD_ON_TOTAL}
                        <T2SText id={VIEW_ID.ADD_ON_TOTAL_AMT} style={Styles.addOnTotalAmtText} screenName={screenName}>
                            {currency + this.handleAddOnTotal()}
                        </T2SText>
                    </T2SText>
                    <T2STouchableOpacity
                        hitSlop={Styles.addOnTouchableArea}
                        id={VIEW_ID.ADD_ON_BUTTON}
                        style={Styles.continueButtonStyle}
                        screenName={screenName}
                        onPress={() => this.handleNextMove(undefined, false)}>
                        <T2SText id={VIEW_ID.ADD_ON_BUTTON} screenName={screenName} style={Styles.buttonTextStyle}>
                            {buttonName}
                        </T2SText>
                    </T2STouchableOpacity>
                </View>
            </View>
        );
    }

    handleItemTapped(addon, index) {
        let { addOnCategoryGroup } = this.state;
        let { featureGateResponse } = this.props;
        if (isValidElement(addOnCategoryGroup.addOnList) && addOnCategoryGroup.addOnList.length > index) {
            let addOnCategoryGroupList = [...this.state.addOnCategoryGroupList];
            if (addon.type === ADD_ON_TYPE.RADIO) {
                if (!addon.isSelected) {
                    let selectedAddOnList = addOnCategoryGroup.addOnList.filter((item) => item.isSelected === true);
                    if (
                        isValidElement(addOnCategoryGroup) &&
                        isValidElement(addOnCategoryGroup.addOnCategoryIndex) &&
                        isValidElement(selectedAddOnList) &&
                        selectedAddOnList.length > 0 &&
                        selectedAddOnList[0].next_move !== addon.next_move
                    ) {
                        addOnCategoryGroupList.splice(addOnCategoryGroup.addOnCategoryIndex, addOnCategoryGroupList.length);
                    }
                    this.resetAllAddOnsForCurrentCategory();
                }
            }
            let addOnList = addOnCategoryGroup.addOnList.map((item) =>
                handleSelectedAddOnState(item, addon, addOnCategoryGroup, this.state.modifier)
            );
            if (isMixedMenu(addOnCategoryGroup.addOnList)) {
                //For Mixed AddOn,
                // Find the selected addon is radio, if it is radio then clear the checkbox else keep the old state
                const final = addOnList.find((item) => item.id === addon.id && item.type === ADD_ON_TYPE.RADIO);
                if (isValidElement(final)) {
                    addOnList = handleMixedAddOn(addOnList);
                }
            }
            this.setState({
                modifier: DEFAULT_MODIFIER
            });

            addOnCategoryGroup = {
                ...this.state.addOnCategoryGroup,
                addOnList: addOnList
            };

            addOnCategoryGroupList[addOnCategoryGroup.addOnCategoryIndex] = addOnCategoryGroup;
            let selectedAddOns = [];
            addOnCategoryGroupList.forEach((item) => {
                if (isValidElement(item.addOnList)) {
                    item.addOnList.forEach((addONS) => {
                        if (addONS.isSelected) {
                            selectedAddOns = [...selectedAddOns, addONS];
                        }
                    });
                }
            });
            this.setState(
                {
                    addOnCategoryGroup: addOnCategoryGroup,
                    addOnCategoryGroupList: addOnCategoryGroupList,
                    selectedAddOnItems: selectedAddOns,
                    currentAddOnCategoryIndex: addOnCategoryGroup.addOnCategoryIndex
                },
                () => {
                    if (addon.type === ADD_ON_TYPE.RADIO) {
                        this.handleNextMove(addon, true);
                    } else {
                        makeHapticFeedback(featureGateResponse, HapticFrom.ADDON_ADDED);
                    }
                }
            );
        }
        if (isValidElement(this.selectedAddonref) && isValidElement(this.selectedAddonref.current)) {
            this.selectedAddonref.current.scrollContentToBottom();
        }
    }
    resetAllAddOnsForCurrentCategory() {
        let addOnCategoryGroup = { ...this.state.addOnCategoryGroup };
        if (isValidElement(addOnCategoryGroup) && isValidElement(addOnCategoryGroup.addOnList)) {
            addOnCategoryGroup.addOnList = addOnCategoryGroup.addOnList.map((addOn) => {
                let copiedAddOn = { ...addOn };
                copiedAddOn.isSelected = false;
                copiedAddOn.modifier = DEFAULT_MODIFIER;
                copiedAddOn.categoryIndex = DEFAULT_CATEGORY_INDEX;
                return copiedAddOn;
            });
            if (isValidElement(addOnCategoryGroup)) {
                addOnCategoryGroup.next_move = addOnCategoryGroup.groupNextMove;
            }
            this.setState({
                addOnCategoryGroup
            });
        }
    }

    handleAddOnTotal() {
        let total = 0.0;
        let { selectedAddOnItems } = this.state;
        isValidElement(selectedAddOnItems) &&
            selectedAddOnItems.forEach((addOn) => {
                if (isValidElement(addOn.price) && addOn.modifier.toLowerCase() !== MODIFIER_ADD_ON.NO.toLowerCase()) {
                    total = (Number(total) + Number(addOn.price)).toFixed(2);
                }
            });
        return total;
    }

    /*
     * Params: addOn - Selected AddOn Obj.
     * Check Weather the selected add-on is Current AddOn Group. if yes Return
     * else check Selected addon category index is Less than current AddonCategory Group Entity If Yes Pop to selected Addon category
     * else Create new route list for selected Addon and reset the navigation state.
     */
    handleSelectedAddOn = debounce(
        (addOn) => {
            this.setState(
                {
                    currentAddOnCategoryIndex: addOn.categoryIndex
                },
                () => {
                    const addOnCategoryGroup = this.state.addOnCategoryGroupList[addOn.categoryIndex];
                    this.populateInitialValues(null, addOnCategoryGroup, false, true);
                }
            );
            makeHapticFeedback(this.props.featureGateResponse, HapticFrom.ADDON_ADDED);
        },
        450,
        { leading: true, trailing: false }
    );

    handleNextMove = debounce(
        (addon, isItemTapped = false) => {
            let { addOnCategoryGroup, buttonName } = this.state;
            let { featureGateResponse } = this.props;
            if (isMandatoryAddOn(addOnCategoryGroup)) {
                showErrorMessage(LOCALIZATION_STRINGS.ALERT_SELECT_ADD_ON);
                return;
            }
            if (canAllowForNextMove(addOnCategoryGroup, addon)) {
                const nextMoveID = getNextMoveId(addOnCategoryGroup, addon);
                if (isValidString(nextMoveID)) {
                    let nextAddOnCategoryObj = constructAddOnCategoryObject(nextMoveID);
                    if (
                        isValidElement(nextAddOnCategoryObj) &&
                        isValidElement(nextAddOnCategoryObj.addOnList) &&
                        nextAddOnCategoryObj.addOnList.length > 0
                    ) {
                        let selectedAddOnObject = this.state.addOnCategoryGroupList.find(
                            (item) => isValidElement(item) && isValidElement(item.id) && item.id === nextAddOnCategoryObj.id
                        );
                        if (isValidElement(selectedAddOnObject)) {
                            nextAddOnCategoryObj = selectedAddOnObject;
                        }
                        this.renderNextAddOn(addOnCategoryGroup.next_move, nextAddOnCategoryObj);
                        makeHapticFeedback(featureGateResponse, HapticFrom.ADDON_ADDED);
                    } else {
                        if (buttonName === LOCALIZATION_STRINGS.CONTINUE) {
                            this.setState({ buttonName: LOCALIZATION_STRINGS.ADD_ITEM });
                        } else {
                            this.redirectToMenuList();
                            makeHapticFeedback(featureGateResponse, HapticFrom.ITEM_ADDED);
                        }
                    }
                } else {
                    //TODO Mostly this scenario won't come in case of any issue occured in the above scenario we should check the API response
                    showErrorMessage(LOCALIZATION_STRINGS.INVALID_CART_ERROR);
                }
            } else if (isReadyToAdd(addOnCategoryGroup, isItemTapped) || !isRadioAddonAvailable(addOnCategoryGroup)) {
                this.redirectToMenuList();
                makeHapticFeedback(featureGateResponse, HapticFrom.ITEM_ADDED);
            }
        },
        450,
        { leading: true, trailing: false }
    );

    renderNextAddOn(nextMoveId, addOnCategoryGroup) {
        Analytics.logEvent(ANALYTICS_SCREENS.ADD_ON, ANALYTICS_EVENTS.NEXT_ADD_ON);
        this.populateInitialValues(nextMoveId, addOnCategoryGroup, true);
    }

    redirectToMenuList() {
        let { selectedAddOnItems } = this.state;
        let { navigation, route, lastAddOns, lastAddOnID } = this.props;
        let { fromHome, selectedItem, quantity, itemId, isFromBasketRecommendation, isFromNewMenu } = route.params;
        if (isFromBasketRecommendation) {
            navigation.goBack();
            this.addToCart(selectedAddOnItems, itemId, quantity, selectedItem, true);
            return;
        }
        if (fromHome) {
            navigation.navigate({ name: SCREEN_OPTIONS.HOME.route_name });
        } else if (isFromNewMenu) {
            navigation.goBack();
        } else {
            //////todo: handle for old menuuu navigation - configurable menu
            navigation.navigate({ name: SCREEN_OPTIONS.NEW_MENU_ITEM_SCREEN.route_name });
        }
        //if last selected add-on & newly selected add-on are same, then update only the quantity for no offer items
        if (
            isValidElement(lastAddOns) &&
            isValidElement(lastAddOnID) &&
            isNoOfferItem(selectedItem.offer) &&
            areAddOnsEqual(lastAddOns, selectedAddOnItems, lastAddOnID)
        ) {
            this.props.addOnItemButtonTappedAction(itemId, quantity, ADD_BUTTON_CONSTANT.ADD, selectedItem, false);
        } else {
            this.addToCart(selectedAddOnItems, itemId, quantity, selectedItem);
        }
    }
    addToCart(selectedAddOnItems, itemId, quantity, selectedItem, isFromRecommendation = false) {
        const add = selectedAddOnItems.map((item) => {
            return {
                id: item.id,
                modifier: item.modifier.toUpperCase(), //TODO: remove toUpperCase() when the modifier in the UI is changed to uppercase.
                name: item.name,
                price: item.price,
                second_language_name: item.second_language_name
            };
        });
        if (isFromRecommendation) {
            this.props.addOnItemButtonTappedAction(
                itemId,
                quantity,
                ADD_BUTTON_CONSTANT.ADD,
                selectedItem,
                false,
                add,
                undefined,
                false,
                true
            );
        } else {
            this.props.addOnItemButtonTappedAction(itemId, quantity, ADD_BUTTON_CONSTANT.ADD, selectedItem, false, add);
        }
    }
}

const mapStateToProps = (state) => ({
    currency: selectCurrencyFromStore(state),
    lastAddOns: selectLastAddOnItems(state),
    lastAddOnID: selectLastAddOnID(state),
    featureGateResponse: selectCountryBaseFeatureGateResponse(state),
    menuAddOnGroupResponse: state.menuState.menuAddOnGroupResponse,
    isMenuAddonsLoading: selectMenuAddonsLoadingResponse(state)
});

const mapDispatchToProps = {
    addOnItemButtonTappedAction
};

export default connect(mapStateToProps, mapDispatchToProps)(AddOn);
