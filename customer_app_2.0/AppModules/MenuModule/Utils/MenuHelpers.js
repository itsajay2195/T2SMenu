import base64 from 'base-64';
import pako from 'pako';
import {
    ADD_ON_TYPE,
    DEFAULT_CATEGORY_INDEX,
    DEFAULT_MODIFIER,
    FREE,
    IGNORE_ADD_ON_NAME,
    MODIFIER_ADD_ON,
    MODIFIER_ADD_ON_ARRAY
} from './MenuConstants';
import { Colors } from 't2sbasemodule/Themes';
import Styles from '../View/Styles/AddOnStyles';
import _ from 'lodash';
import { isValidElement, isValidNotEmptyString, isValidNumber, isValidString, safeFloatValue } from 't2sbasemodule/Utils/helpers';
import { ORDER_TYPE } from '../../OrderManagementModule/Utils/OrderManagementConstants';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import { isBetweenDays, isBetweenTime } from 't2sbasemodule/Utils/DateUtil';
import moment from 'moment-timezone';
import { store } from '../../../CustomerApp/Redux/Store/ConfigureStore';
// import reactotron from 'reactotron-react-native';

export const decompressApiResponse = (data) => {
    if (!isValidElement(data)) {
        return null;
    }
    try {
        const decodedString = base64.decode(data);
        return JSON.parse(pako.inflate(decodedString, { to: 'string' }));
    } catch (e) {
        return null;
    }
};

export const filterScheduleByDate = (value, currentBusinessMoment) => {
    if (isValidElement(value) && isValidElement(value.schedule) && value.schedule.length > 0) {
        if (isValidElement(value.schedule[0].start_date) && isValidElement(value.schedule[0].end_date)) {
            let startDate = moment(value.schedule[0].start_date, 'YYYY-MM-DD');
            let endDate = moment(value.schedule[0].end_date).endOf('day');
            return isBetweenDays(startDate, endDate, currentBusinessMoment);
        } else {
            return true;
        }
    } else {
        return true;
    }
};

export const filterScheduleByTime = (value, currentBusinessMoment) => {
    if (isValidElement(value) && isValidElement(value.schedule) && value.schedule.length > 0) {
        if (isValidElement(value.schedule[0].start_time) && isValidElement(value.schedule[0].end_time)) {
            return isBetweenTime(value.schedule[0].start_time, value.schedule[0].end_time, currentBusinessMoment);
        } else {
            return true;
        }
    } else {
        return true;
    }
};

export const filterCurrentMenu = (menuData, orderType, currentBusinessDay, currentBusinessMoment, addFreeItem = false) => {
    let categoryFilter = [];

    if (!addFreeItem) {
        categoryFilter = menuData.filter(
            (category) =>
                category.subcat.length > 0 &&
                category.name.toLowerCase() !== FREE &&
                (isValidElement(orderType) && orderType.toLowerCase() === ORDER_TYPE.COLLECTION.toLowerCase()
                    ? category.collection === 1
                    : category.delivery === 1) &&
                Object.prototype.hasOwnProperty.call(category, currentBusinessDay) &&
                category[currentBusinessDay] === 1 &&
                filterScheduleByDate(category, currentBusinessMoment) &&
                filterScheduleByTime(category, currentBusinessMoment)
        );
    } else {
        categoryFilter = menuData.filter(
            (category) =>
                category.subcat.length > 0 &&
                (isValidElement(orderType) && orderType.toLowerCase() === ORDER_TYPE.COLLECTION.toLowerCase()
                    ? category.collection === 1
                    : category.delivery === 1) &&
                Object.prototype.hasOwnProperty.call(category, currentBusinessDay) &&
                category[currentBusinessDay] === 1 &&
                filterScheduleByDate(category, currentBusinessMoment) &&
                filterScheduleByTime(category, currentBusinessMoment)
        );
    }
    return categoryFilter.map((category) => {
        return {
            ...category,
            subcat: formSubCategory(category.subcat, orderType, currentBusinessDay, currentBusinessMoment)
        };
    });
};
const formSubCategory = (subCategory, orderType, currentBusinessDay, currentBusinessMoment) => {
    //filter subcategory
    const subFilter = filterArray(subCategory, orderType, currentBusinessDay, currentBusinessMoment);
    return subFilter.map((subCategoryElement) => {
        return {
            ...subCategoryElement,
            //filter item
            item: filterArray(subCategoryElement.item, orderType, currentBusinessDay, currentBusinessMoment)
        };
    });
};

export const filterArray = (array, orderType, currentBusinessDay, currentBusinessMoment) => {
    return array.filter(
        (element) =>
            (isValidElement(orderType) && orderType.toLowerCase() === ORDER_TYPE.COLLECTION.toLowerCase()
                ? element.collection === 1
                : element.delivery === 1) &&
            Object.prototype.hasOwnProperty.call(element, currentBusinessDay) &&
            element[currentBusinessDay] === 1 &&
            filterScheduleByDate(element, currentBusinessMoment) &&
            filterScheduleByTime(element, currentBusinessMoment)
    );
};
/**
 ** Objective : Construct an AddOnCategoryGroup Object for addOn_cat_id:
 ** Parameter - addOnCategoryId - Id for addOn Category Group.
 ** Check Weather addonGroup available on Addon Stack array. If it is, return that object.
 ** Else Check on Global AddoncategotryGroup List and return obj.
 *  Add new properties addOnCategoryindex, addOnList and modifierList into object.
 *  If AddOn Type is "Radio" on first item of Addon-list. Then Iterate the list and add three new props into an Addon Object.(CategoryIndex, isSelected, modifier)
 *  else Iterate the addOn and check anyItem name match with "Modifier List".
 *  If it is add that addon Into Modifier list of AddOnCategory Group Obj.
 *  else add it into addon-list.
 *  Check The next_move available for Selected addon Item.
 *  If Yes then set the Addon's next move to AddonCategroup Next Move.
 *  Else Check Weather the AddonCategoryGroup have valid next-Move Id
 *  if Yes the Set the Button Name as "CONTINUE" Else "ADD ITEM".
 **/
export const constructAddOnCategoryObject = (addOnCategoryId) => {
    if (!isValidElement(addOnCategoryId) || addOnCategoryId.length === 0) {
        return null;
    }
    let addonCategoryGroup;
    let state = store.getState();
    const menuGroupResponse = state.menuState.menuAddOnGroupResponse;
    if (isValidElement(menuGroupResponse) && isValidElement(addOnCategoryId)) {
        const result = _.find(
            menuGroupResponse,
            (value) =>
                isValidElement(value) &&
                isValidElement(value.category) &&
                isValidElement(value.category.id) &&
                value.category.id.toString() === addOnCategoryId.toString()
        );
        if (isValidElement(result)) {
            addonCategoryGroup = result.category;
            const addOnList = result.addon.map((item) => {
                if (isValidElement(item) && isValidString(item.name) && !isAddonNameExistInModifierList(item.name)) {
                    return {
                        ...item,
                        categoryIndex: DEFAULT_CATEGORY_INDEX,
                        isSelected: false,
                        modifier: DEFAULT_MODIFIER,
                        type: !isValidString(item.type) ? ADD_ON_TYPE.MULTI : item.type
                    };
                } else {
                    return item;
                }
            });
            const addOns = addOnList
                .filter((element) => element.modifier)
                .filter(
                    (item) =>
                        isValidElement(item) &&
                        isValidElement(item.name) &&
                        item.name.toLowerCase() !== IGNORE_ADD_ON_NAME.FREE.toLowerCase()
                );
            const modifiers = addOnList
                .filter((element) => !element.modifier)
                .filter(
                    (item) =>
                        isValidElement(item) &&
                        isValidElement(item.name) &&
                        item.name.toLowerCase() !== IGNORE_ADD_ON_NAME.FREE.toLowerCase()
                );
            return {
                ...addonCategoryGroup,
                modifierList: _.uniqBy(modifiers, 'name'), //removing duplicates modifier list with `name` property
                addOnList: addOns
            };
        }
    }
};
export const isAddonNameExistInModifierList = (itemName) => {
    const result = MODIFIER_ADD_ON_ARRAY.filter((item) => {
        return item.toLowerCase() === itemName.toLowerCase();
    });
    return result.length > 0;
};
/*
 * Check Weather the Given Modifier available modifier List.
 */
export const isModifierExists = (modifier, addOnCategoryGroup) => {
    if (isValidElement(modifier) && isValidElement(addOnCategoryGroup) && isValidElement(addOnCategoryGroup.modifierList)) {
        return (
            addOnCategoryGroup.modifierList.filter((modifierAddOn) => modifierAddOn.name.toLowerCase() === modifier.toLowerCase()).length >
            0
        );
    } else {
        return false;
    }
};
/*
 * Parameters - addOnCategoryId, addOnCagegoryGroupList
 * Extract an AddonCategoryGroup from AddOnCategoryGroupList
 */
export const extractAddOnCategoryGroup = (id, menuAddOnGroupResponse) => {
    if (isValidElement(menuAddOnGroupResponse)) {
        let addOnCategoryGroupList = menuAddOnGroupResponse.filter(
            (categoryGroup) => isValidString(id) && isValidElement(categoryGroup) && categoryGroup.id === id.toString()
        );
        if (isValidElement(addOnCategoryGroupList) && addOnCategoryGroupList.length > 0) {
            return Object.assign({}, addOnCategoryGroupList[0]);
        }
    }
};
/*
 * Parameters -addOnCategoryId, menuAddOnsResponse
 * Extract an AddOnObject for given addOnCategoryId from AddOnCategoryGroup's addOnList
 */
export const extractAddonItems = (addOnCategoryId, menuAddOnsResponse) => {
    if (isValidElement(menuAddOnsResponse)) {
        let addOnList = menuAddOnsResponse.filter(
            (addon) =>
                isValidElement(addOnCategoryId) && isValidElement(addon) && addon.item_addon_cat.toString() === addOnCategoryId.toString()
        );
        if (isValidElement(addOnList) && addOnList.length > 0) {
            return addOnList;
        }
    }
};

/*
 * Params - categoryId, addOnCategoryList
 * Check Weather the CategoryGroup for the Given Category id available on Existing Addon-GroupList( AddOn-Stack)
 */
export const isCategoryGroupAlreadyAvailableFor = (categoryId, addOnCategoryList) => {
    if (isValidElement(addOnCategoryList) && addOnCategoryList.length > 0) {
        let filteredList = addOnCategoryList.filter((addOnCategoryObj) => Number(addOnCategoryObj.id) === Number(categoryId));
        return filteredList.length > 0 ? filteredList[0] : null;
    }
    return null;
};
export const getSearchResult = (query, menuList) => {
    let searchResult = [];

    // category name
    searchResult = menuList.filter((list) => _.includes(list.name.toLowerCase(), query.toLowerCase()));

    // subCategory name
    const subList = menuList.map((menu) => {
        let filteredSubCat = menu.subcat.filter(
            (subcat) =>
                _.includes(subcat.name.toLowerCase(), query.toLowerCase()) ||
                (isValidString(subcat.description) && _.includes(subcat.description.toLowerCase(), query.toLowerCase()))
        );
        return {
            ...menu,
            subcat: filteredSubCat
        };
    });
    const searchSubCategoryList = subList.filter((element) => isValidElement(element.subcat) && element.subcat.length > 0);

    //item
    const filterItemData = menuList.map((menu) => {
        return {
            ...menu,
            subcat: constructSubCat(menu.subcat, query)
        };
    });
    const searchItemList = filterItemData.filter((element) => isValidElement(element.subcat) && element.subcat.length > 0);

    //combining the results
    const finalArray = [...searchResult, ...searchSubCategoryList, ...searchItemList];
    //removes duplicate array and returns it
    return _.uniqBy(finalArray, 'id');
};

const constructSubCat = (subCat, query) => {
    const subCatData = subCat.map((element) => {
        return {
            ...element,
            item: element.item.filter(
                (item) =>
                    _.includes(item.name.toLowerCase(), query.toLowerCase()) ||
                    (isValidString(item.description) && _.includes(item.description.toLowerCase(), query.toLowerCase()))
            )
        };
    });
    const subCategoryList = subCatData.filter((element) => element.item.length > 0);
    if (isValidElement(subCategoryList) && subCategoryList.length > 0) {
        return subCategoryList;
    } else {
        return [];
    }
};

export const getModifierColor = (item, modifier) => {
    let color;
    if (item === modifier) {
        color = Colors.white;
    } else if (item.toLowerCase() === MODIFIER_ADD_ON.NO.toLowerCase()) {
        color = Colors.BittersweetRed;
    } else {
        color = Colors.modifier;
    }
    return color;
};

export const getModifierStyle = (itemName, modifier) => {
    let style;
    if (itemName === modifier) {
        if (itemName.toLowerCase() === MODIFIER_ADD_ON.NO.toLowerCase()) {
            style = Styles.noSelectedModifierAddOnStyle;
        } else {
            style = Styles.selectedModifierAddOnStyle;
        }
    } else if (itemName.toLowerCase() === MODIFIER_ADD_ON.NO.toLowerCase()) {
        style = Styles.noModifierAddOnStyle;
    } else {
        style = Styles.modifierAddOnStyle;
    }
    return style;
};

export const getModifiedTextStyle = (modifier) => {
    if (modifier.toLowerCase() === DEFAULT_MODIFIER.toLowerCase()) return {};
    else if (modifier.toLowerCase() === MODIFIER_ADD_ON.NO.toLowerCase()) return Styles.modifierNoTextStyle;
    else return Styles.modifierTextStyle;
};
export const getAddonText = (addOn) => {
    if (!isValidElement(addOn)) return '';

    let addOnName = '';
    if (isValidNotEmptyString(addOn.name)) addOnName = addOn.name;
    else return '';

    if (isValidNotEmptyString(addOn.second_language_name)) addOnName += ' ' + addOn.second_language_name;

    if (isValidNotEmptyString(addOn.modifier) && addOn.modifier.toLowerCase() !== DEFAULT_MODIFIER.toLowerCase())
        addOnName = addOn.modifier + ' ' + addOnName;

    return addOnName;
};
export const getAddOnPrice = (addOn) => {
    if (!isValidElement(addOn) || addOn.price === '' || safeFloatValue(addOn.price) === safeFloatValue(0)) return '';
    else return addOn.price;
};

export const hasAddOn = (item) => {
    if (isValidElement(item)) {
        return !(item.item_addon_cat === '' || item.item_addon_cat === '0' || (isValidElement(item.addons) && item.addons.length === 0));
    } else return false;
};
/*
 * Params : AddOnCategoryGroup
 * If Next_move available for "AddOnCategoryGroup" return "COUNTINUE" else returns "ADD ITEM"
 */
export const getButtonName = (addOnCategoryGroup) => {
    if (canAllowForNextMove(addOnCategoryGroup) || isNextMoveAvailableInRadioAddon(addOnCategoryGroup)) {
        return LOCALIZATION_STRINGS.CONTINUE;
    }
    return LOCALIZATION_STRINGS.ADD_ITEM;
};

export const areAddOnsEqual = (lastAddOns, selectedAddOn, lastAddOnID) => {
    const data = lastAddOns.find((element) => element.item.id === lastAddOnID);
    if (isValidElement(data)) {
        const currentAddOnIds = selectedAddOn.map((addOn) => addOn.id);
        const lastAddOnIds = data.addOns.map((addOn) => addOn.id);
        return _.isEqual(currentAddOnIds.sort(), lastAddOnIds.sort());
    }
    return false;
};

export const convertAddonGroupListToDict = (addOnGroupList) => {
    var addOnGroupObj = {};
    if (isValidElement(addOnGroupList)) {
        addOnGroupList.map((addOnCat) => {
            if (isValidElement(addOnCat) && isValidElement(addOnCat.id)) {
                addOnGroupObj[addOnCat.id.toString()] = addOnCat;
            }
        });
    }
    return addOnGroupObj;
};

export const constructSectionListData = (array, menuRecommendation, addDummy = true) => {
    let header = {
        name: '',
        id: 93209393,
        subcat: [
            {
                item: menuRecommendation
            }
        ]
    };

    const arrayWithDummy = addDummy ? [header, ...array] : [...array];

    return arrayWithDummy.map((item, position) => {
        return {
            title: isValidString(item.second_language_name) ? `${item.name} ${item.second_language_name}` : item.name,
            description: item.description,
            data: item.subcat,
            index: position
        };
    });
};

export const formReOrderItemListData = (persistResponse, recentOrderResponse) => {
    let output = recentOrderResponse.data.map((item) => {
        return {
            ...item,
            summary: {
                ...item.summary,
                items: formNewData(item, persistResponse)
            }
        };
    });
    return output.slice(0, 2);
};

const formNewData = (item, persistResponse) => {
    let summary = item.summary;
    let menuItems = summary.items;
    let recentOrderAddons = summary.addons;
    const { menuResponse, addOn } = persistResponse;

    let menuItemResponse = constructDataForReOrderMenu(menuResponse);
    let arrItems = [];
    let finalMenuItems = _.uniqBy(menuItems, function(o) {
        return o.id;
    });

    if (isValidElement(menuItemResponse)) {
        for (let i = 0; i < finalMenuItems.length; i++) {
            let filterOutput = recentOrderAddons.filter((item) => item.order_item_ref_id === finalMenuItems[i].order_item_ref_id);
            for (let j = 0; j < menuItemResponse.length; j++) {
                if (finalMenuItems[i].id === menuItemResponse[j].id) {
                    arrItems.push({
                        ...menuItemResponse[j].value,
                        isFromReOrderItem: true,
                        reorderAddons: filterOutput.map((item) => {
                            let obj = addOn.find((data) => data.id === item.id);
                            return { ...obj, modifier: item.modifier };
                        })
                    });
                }
            }
        }
    }
    return arrItems;
};

function constructDataForReOrderMenu(menuResponse) {
    if (isValidElement(menuResponse)) {
        let array = [];
        for (let i = 0; i < menuResponse.length; i++) {
            for (let j = 0; j < menuResponse[i].subcat.length; j++) {
                for (let k = 0; k < menuResponse[i].subcat[j].item.length; k++) {
                    let arr = menuResponse[i].subcat[j].item[k];
                    array.push({ id: arr.id, value: arr });
                }
            }
        }
        return array;
    }
}

export const isTakeawayFavorite = (storeConfigId, favouriteTakeaways, isUserLoggedIn) => {
    if (
        isValidElement(isUserLoggedIn) &&
        isUserLoggedIn &&
        isValidElement(favouriteTakeaways) &&
        favouriteTakeaways.length > 0 &&
        isValidElement(storeConfigId)
    ) {
        return isValidElement(favouriteTakeaways.find((item) => item.id === storeConfigId));
    }
    return false;
};

export const isItemAvailableForSelectedOrderType = (orderType, collectionType, deliveryType) => {
    if (isValidElement(collectionType) && isValidElement(collectionType) && isValidElement(deliveryType)) {
        if (orderType === ORDER_TYPE.COLLECTION.toLowerCase()) {
            return collectionType === 1;
        } else {
            return deliveryType === 1;
        }
    } else {
        return false;
    }
};

export const getReOrderAddOns = (item) => {
    if (isValidElement(item.reorderAddons) && item.reorderAddons.length > 0) {
        let addOnNames = item.reorderAddons.map((data) => data.name);
        return addOnNames.join(', ');
    }
    return '';
};

export const getCartItemsFromBasketResponse = (basketItems) => {
    if (isValidElement(basketItems) && basketItems.length > 0) {
        let updatedCartItem = [];
        basketItems.forEach((itemObj) => {
            let existingItemIndex = updatedCartItem.findIndex((item) => item.id === itemObj.item_id);
            if (isValidElement(existingItemIndex) && existingItemIndex >= 0) {
                updatedCartItem[existingItemIndex].quantity += isValidNumber(itemObj.quantity) ? parseInt(itemObj.quantity) : 0;
                updatedCartItem[existingItemIndex].addOns = itemObj.addons;
            } else {
                updatedCartItem.push({
                    type: '',
                    id: itemObj.item_id,
                    quantity: isValidNumber(itemObj.quantity) ? parseInt(itemObj.quantity) : 0,
                    quantityType: '',
                    item: { ...itemObj, id: itemObj.item_id },
                    fromBasket: false,
                    addOns: itemObj.addons,
                    repeatAddOnType: undefined,
                    fromFreeItems: itemObj.free
                });
            }
        });
        return updatedCartItem;
    }
    return [];
};

export const constructItemForBasketRecommendation = (menuResponse) => {
    let arr = [];
    if (isValidElement(menuResponse)) {
        menuResponse.forEach((category) => {
            category.subcat.forEach((subcat) => {
                subcat.item.forEach((item) => {
                    arr.push(item);
                });
            });
        });
    }
    return arr;
};

export const calculateMenuSyncTime = (storeConfigResponse) => {
    let menuSyncTime = null;
    if (isValidElement(storeConfigResponse)) {
        return storeConfigResponse.id + '-' + storeConfigResponse.syncMenu;
    }
    return menuSyncTime;
};
export const getAddOnCategoryGroup = (menuAddOnGroupResponse, addOnCategoryId) => {
    return Array.isArray(menuAddOnGroupResponse)
        ? extractAddOnCategoryGroup(addOnCategoryId, menuAddOnGroupResponse)
        : Object.assign({}, isValidElement(menuAddOnGroupResponse) ? menuAddOnGroupResponse[[addOnCategoryId]] : {});
};

export const canAllowForNextMove = (addOnCategoryGroup, selectedAddOn) => {
    return (
        (isValidElement(selectedAddOn) && isValidNotEmptyString(selectedAddOn.next_move)) ||
        (!isValidElement(selectedAddOn) && isSelectedAddonHasNextMove(addOnCategoryGroup)) ||
        (isValidNotEmptyString(addOnCategoryGroup?.next_move) &&
            isValidElement(addOnCategoryGroup?.addOnList) &&
            addOnCategoryGroup?.addOnList?.length > 0)
    );
};

export const getNextMoveId = (addOnCategoryGroup, selectedAddOn) => {
    if (isValidElement(selectedAddOn) && isValidNotEmptyString(selectedAddOn.next_move)) {
        return selectedAddOn.next_move;
    } else if (isSelectedAddonHasNextMove(addOnCategoryGroup)) {
        return getSelectedAddonNextMoveId(addOnCategoryGroup);
    } else if (isValidNotEmptyString(addOnCategoryGroup.next_move)) {
        return addOnCategoryGroup.next_move;
    }
};

export const getSelectedAddon = (addOnCategoryGroup) => {
    let addOnArray = isValidElement(addOnCategoryGroup) && isValidElement(addOnCategoryGroup.addOnList) ? addOnCategoryGroup.addOnList : [];
    let data = addOnArray.find((item) => item.isSelected === true);
    return isValidElement(data) ? data : null;
};

export const getSelectedRadioAddon = (addOnCategoryGroup) => {
    let data = getSelectedAddon(addOnCategoryGroup);
    return isValidElement(data) && isValidElement(data.type) && data.type === ADD_ON_TYPE.RADIO ? data : null;
};

export const isSelectedAddonHasNextMove = (addOnCategoryGroup) => {
    let data = getSelectedRadioAddon(addOnCategoryGroup);
    return isValidElement(data) && isValidNotEmptyString(data.next_move);
};

export const getSelectedAddonNextMoveId = (addOnCategoryGroup) => {
    let data = getSelectedRadioAddon(addOnCategoryGroup);
    return isValidElement(data) && isValidNotEmptyString(data.next_move) && data.next_move;
};

export const isNextMoveAvailableInRadioAddon = (addOnCategoryGroup) => {
    let addOnArray = isValidElement(addOnCategoryGroup) && isValidElement(addOnCategoryGroup.addOnList) ? addOnCategoryGroup.addOnList : [];
    let data = addOnArray.find((item) => item.type === ADD_ON_TYPE.RADIO);
    return isValidElement(data) && isValidNotEmptyString(data.next_move);
};

export const isRadioAddonAvailable = (addOnCategoryGroup) => {
    let addOnArray = isValidElement(addOnCategoryGroup) && isValidElement(addOnCategoryGroup.addOnList) ? addOnCategoryGroup.addOnList : [];
    let data = addOnArray.find((item) => item.type === ADD_ON_TYPE.RADIO);
    return isValidElement(data);
};

//if its radio type & addon item should not be selected
export const isMandatoryAddOn = (addOnCategoryGroup) => {
    return isRadioAddonAvailable(addOnCategoryGroup) && !isValidElement(getSelectedAddon(addOnCategoryGroup));
};

export const isReadyToAdd = (addOnCategoryGroup, isItemTapped) => {
    if (!isRadioAddonAvailable(addOnCategoryGroup)) {
        return true;
    } else {
        let data = getSelectedAddon(addOnCategoryGroup);
        return isValidElement(data) && !isValidNotEmptyString(data.next_move) && !isItemTapped;
    }
};

export const isMixedMenu = (addOnCategoryGroup) => {
    if (isValidElement(addOnCategoryGroup) && addOnCategoryGroup.length > 0) {
        const currentType = addOnCategoryGroup[0].type;
        for (let i = 0; i < addOnCategoryGroup.length; i++) {
            if (isValidString(addOnCategoryGroup[i].type) && currentType !== addOnCategoryGroup[i].type) {
                return true;
            }
        }
    }
    return false;
};

export const handleSelectedAddOnState = (addon, selectedAddon, addOnCategoryGroup, modifierState) => {
    let selectedAddOnState = addon.isSelected;
    let selectedAddOnModifier = addon.modifier;
    if (addon.id === selectedAddon.id) {
        if (addon.type === ADD_ON_TYPE.RADIO) {
            selectedAddOnState = true;
        } else {
            if (addon.modifier !== modifierState) {
                selectedAddOnModifier = modifierState;
                selectedAddOnState = true;
            } else {
                selectedAddOnModifier = DEFAULT_MODIFIER;
                selectedAddOnState = !selectedAddOnState;
            }
        }
    } else {
        if (addon.type === ADD_ON_TYPE.RADIO) {
            selectedAddOnState = false;
        }
    }
    return {
        ...addon,
        isSelected: selectedAddOnState,
        modifier: selectedAddOnModifier,
        categoryIndex: addOnCategoryGroup.addOnCategoryIndex
    };
};

export const handleMixedAddOn = (addOnList) => {
    if (isValidElement(addOnList)) {
        return addOnList.map((item) => {
            if (item.type !== ADD_ON_TYPE.RADIO) {
                return {
                    ...item,
                    isSelected: false,
                    modifier: DEFAULT_MODIFIER
                };
            } else {
                return item;
            }
        });
    }
};

export const addOnsForReorder = (menuGroupResponse) => {
    let addonArray = [];
    Object.keys(menuGroupResponse).forEach(function(key) {
        const value = menuGroupResponse[key];
        if (isValidElement(value.addon) && value.addon.length > 0) {
            addonArray = addonArray.concat(value.addon);
        }
    });
    return addonArray;
};

export const getName = (name, secondLanguage) => {
    return isValidString(name) && isValidString(secondLanguage) ? name.trim() + ' ' + secondLanguage : name.trim();
};

export const getCommonUIfilterMenuObj = (menuData) => {
    let menuObj = {
        id: menuData.id,
        host: menuData.host,
        name: menuData.name,
        image: menuData.image,
        delivery: menuData.delivery,
        collection: menuData.collection,
        show_online: menuData.show_online,
        description: menuData.description,
        second_language_name: menuData.second_language_name,
        second_language_description: menuData.second_language_description,
        coupon_allowed: menuData.coupon_allowed
    };
    return menuObj;
};

export const getUIfilteredMenuData = (menu) => {
    let filteredUIMenu;
    if (isValidElement(menu) && menu.length > 0) {
        filteredUIMenu = menu.map((menuData) => {
            return {
                ...getCommonUIfilterMenuObj(menuData),
                subcat:
                    menuData.subcat.length > 0
                        ? menuData.subcat.map((subcat) => {
                              return {
                                  ...getCommonUIfilterMenuObj(subcat),
                                  item:
                                      subcat.item.length > 0
                                          ? subcat.item.map((items) => {
                                                return {
                                                    ...getCommonUIfilterMenuObj(items),
                                                    item_addon_cat: items.item_addon_cat,
                                                    price: items.price,
                                                    subcat: items.subcat,
                                                    offer: items.offer
                                                };
                                            })
                                          : []
                              };
                          })
                        : []
            };
        });
        return filteredUIMenu;
    }
};

let outArr = [],
    itemsList = [],
    finalArray = [];
let PrimaryIndexValue = 0;
const setFunction = (dataCollection, title, ival) => {
    if (isValidElement(dataCollection)) {
        if (!title) {
            title = dataCollection.name;
            outArr.push({ title: 'subcategory', value: title, image: dataCollection.image, description: dataCollection.description });
        }
        if (ival === dataCollection.item?.length) {
            return;
        } else {
            outArr.push({ title: `item${ival}`, value: dataCollection.item[ival]?.name, ...dataCollection.item[ival] });
            itemsList.push({ title: `item${ival}`, value: dataCollection.item[ival]?.name, index: PrimaryIndexValue });
            ival++;
            setFunction(dataCollection, title, ival);
        }
    }
    return [];
};

const setSecondaryFunction = (dataCollection, primaryTitle, secondaryIndexValue) => {
    if (!primaryTitle) {
        primaryTitle = dataCollection.title;
        outArr.push({ title: 'title_cat', value: primaryTitle, description: dataCollection.description });
    }
    if (secondaryIndexValue === dataCollection.data.length) return;
    let title = null,
        ival = 0;
    setFunction(dataCollection.data[secondaryIndexValue], title, ival);
    secondaryIndexValue++;
    setSecondaryFunction(dataCollection, primaryTitle, secondaryIndexValue);
};

const setPrimaryFunction = (data) => {
    if (data.length === PrimaryIndexValue || data[PrimaryIndexValue] === undefined) return;
    let primaryTitle = '',
        secondaryIndexValue = 0;
    let title = data[PrimaryIndexValue].title;
    let index = PrimaryIndexValue;
    setSecondaryFunction(data[PrimaryIndexValue], primaryTitle, secondaryIndexValue);
    PrimaryIndexValue++;
    finalArray.push({ title: title, index: index, data: [...outArr] });
    outArr.length = 0;
    setPrimaryFunction(data);
};

export const setFinalData = (data) => {
    PrimaryIndexValue = 0;
    finalArray = [];
    itemsList = [];
    setPrimaryFunction(data);
    let result = finalArray;
    return result;
};

export const retunSearchItemResult = () => itemsList;

// export const setCategoryWiseItem = (dummy) => {
//     setFinalData(dummy);
//     return resultantArray;
// };
