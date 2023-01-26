import moment from 'moment-timezone';
import {
    boolValue,
    capsWordCase,
    distance,
    distanceValue,
    isArrayNonEmpty,
    isBoolean,
    isFranchiseApp,
    isMoreZero,
    isValidElement,
    isValidNotEmptyString,
    isValidNumber,
    isValidString,
    safeFloatValueWithoutDecimal,
    safeIntValue
} from 't2sbasemodule/Utils/helpers';
import { DATE_FORMAT, getCurrentDateWithTimeZone, isBetweenDays, isToday } from 't2sbasemodule/Utils/DateUtil';
import {
    DISTANCE_TYPE,
    FAVOURITE_TAKEAWAY,
    FILTER_TAKEAWAY_CONSTANTS,
    FILTER_TAKEAWAY_LIST,
    FILTER_TYPE,
    NASH_DELIVERY_CHARGE_RANGE_VALUE,
    NEW_LABEL,
    NO_MATCH_FOUND,
    VIEW_ID
} from './Constants';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import { ORDER_TYPE, ORDER_TYPE_STATUS } from 'appmodules/BaseModule/BaseConstants';
import _ from 'lodash';
import {
    getBestMatchCount,
    getCustomerRating,
    getDeliveryFeeValue,
    getMinimumOrderValue,
    getTotalReviewsCount
} from 'appmodules/ReviewModule/Utils/ReviewHelper';
import { convertMessageToAppLanguage } from 't2sbasemodule/Network/NetworkHelpers';
import { SEGMENT_CONSTANTS, SEGMENT_EVENTS } from 'appmodules/AnalyticsModule/SegmentConstants';
import * as Segment from 'appmodules/AnalyticsModule/Segment';
import { select } from 'redux-saga/effects';
import { selectTakeawayListReducer } from 't2sbasemodule/Utils/AppSelectors';
import { BOOL_CONSTANT } from 'appmodules/AddressModule/Utils/AddressConstants';
import { Colors } from 't2sbasemodule/Themes';
import { CONSTANTS } from 'appmodules/QuickCheckoutModule/Utils/QuickCheckoutConstants';

export const filterTakeawayData = (filterType, takeawayList) => {
    if (isValidElement(filterType) && isValidElement(takeawayList)) {
        switch (filterType) {
            case FILTER_TYPE.BEST_MATCH:
                return _.orderBy(
                    takeawayList,
                    [
                        (obj) => {
                            return getBestMatchCount(obj);
                        },
                        (obj) => {
                            return distanceValue(obj.distanceInMiles);
                        },
                        (obj) => {
                            return obj.name.trim().toLowerCase();
                        }
                    ],
                    ['desc', 'asc', 'asc']
                );
            case FILTER_TYPE.DISTANCE_VALUE:
                return _.orderBy(
                    takeawayList,
                    [
                        (obj) => {
                            return distanceValue(obj.distanceInMiles);
                        },
                        (obj) => {
                            return obj.name.trim().toLowerCase();
                        }
                    ],
                    ['asc', 'asc']
                );

            case FILTER_TYPE.CUSTOMER_RATING:
                return _.orderBy(
                    takeawayList,
                    [
                        (obj) => {
                            return getCustomerRating(obj);
                        },
                        (obj) => {
                            return getTotalReviewsCount(obj?.total_reviews);
                        },
                        (obj) => {
                            return distanceValue(obj.distanceInMiles);
                        },
                        (obj) => {
                            return obj.name.trim().toLowerCase();
                        }
                    ],
                    ['desc', 'desc', 'asc', 'asc']
                );
            case FILTER_TYPE.DELIVERY_TIME:
                return _.orderBy(
                    takeawayList,
                    [
                        (obj) => {
                            return isDeliveryOpen(obj);
                        },
                        (obj) => {
                            return Number(parseInt(obj.delivery_time));
                        },
                        (obj) => {
                            return distanceValue(obj.distanceInMiles);
                        },
                        (obj) => {
                            return obj.name.trim().toLowerCase();
                        }
                    ],
                    ['desc', 'asc', 'asc', 'asc']
                );
            case FILTER_TYPE.MINIMUM_ORDER:
                return _.orderBy(
                    takeawayList,
                    [
                        (obj) => {
                            return getMinimumOrderValue(obj);
                        },
                        (obj) => {
                            return obj.name.trim().toLowerCase();
                        }
                    ],
                    ['asc', 'asc']
                );
            case FILTER_TYPE.DELIVERY_FEE:
                return _.orderBy(
                    takeawayList,
                    [
                        (obj) => {
                            return isDeliveryOpen(obj);
                        },
                        (obj) => {
                            return getDeliveryFeeValue(obj);
                        },
                        (obj) => {
                            return obj.name.trim().toLowerCase();
                        }
                    ],
                    ['desc', 'asc', 'asc']
                );
            case FILTER_TYPE.DISCOUNT:
                return _.orderBy(
                    takeawayList,
                    [
                        (obj) => {
                            return Number(parseFloat(obj.discount));
                        },
                        (obj) => {
                            return obj.delivery_time;
                        },
                        (obj) => {
                            return distanceValue(obj.distanceInMiles);
                        },
                        (obj) => {
                            return obj.name.trim().toLowerCase();
                        }
                    ],
                    ['desc', 'asc', 'asc', 'asc']
                );
            default:
                return takeawayList;
        }
    }
    return takeawayList;
};

export const isDeliveryOpen = (item) => {
    let storeStatusDelivery = getStoreStatusDelivery(item);
    if (isValidString(storeStatusDelivery)) {
        return storeStatusDelivery;
    } else {
        return '';
    }
};

export const getCuisinesFromTakeawayList = (takeawayList, cuisinesData) => {
    //cuisinesData contains image_url of each cuisine
    let unsortedCuisinesArray = [];
    for (let i = 0; i < takeawayList.length; i++) {
        for (let j = 0; j < takeawayList[i]?.cuisines.length; j++) {
            if (isValidElement(takeawayList[i]?.cuisines[j])) {
                unsortedCuisinesArray.push(takeawayList[i].cuisines[j]);
            }
        }
    }

    let sortedCuisineResultArray = getRequiredCuisinesData(cuisinesData, unsortedCuisinesArray);
    return [...sortedCuisineResultArray]; // returning new array without duplicate elements
};

export const getRequiredCuisinesData = (cuisinesList, unsortedCuisinesArray) => {
    let filteredList = [];
    let cuisineCountArray = calculateCuisineCount(unsortedCuisinesArray);
    //we map and merge to get cuisine image_url
    if (isValidElement(cuisinesList)) {
        filteredList = cuisineCountArray.map((item) => ({
            ...cuisinesList.find((data) => data.name.toString() === item.name.toString()),
            ...item
        }));
    }
    return isArrayNonEmpty(filteredList) ? sortByCuisineCount(filteredList) : filteredList;
};

export const calculateCuisineCount = (unsortedCuisinesArray) => {
    return _.chain(unsortedCuisinesArray)
        .countBy()
        .map((count, name) => ({ name, count }))
        .value();
};

export const searchMethod = (arrayList, searchString) => {
    const searchData = arrayList.filter((cuisineName) => {
        if (isValidElement(cuisineName) && isValidString(cuisineName.name)) {
            const searchedName = cuisineName.name.toUpperCase();
            return searchedName.includes(searchString.toUpperCase());
        } else {
            return false;
        }
    });
    return searchData;
};

export const searchTARecommendationName = (arrayList, searchString) => {
    let sortedList = [];
    for (let j = 0; j < arrayList.length; j++) {
        if (arrayList[j].name.toUpperCase().includes(searchString.toUpperCase())) {
            sortedList.push(arrayList[j]);
        }
    }
    return sortedList;
};
export function* searchTakeawayName(arrayList, searchString) {
    let sortedList = [];
    for (let j = 0; j < arrayList.length; j++) {
        if (arrayList[j].name.toUpperCase().includes(searchString.toUpperCase())) {
            sortedList.push(arrayList[j]);
        }
    }
    const takeawayListReducer = yield select(selectTakeawayListReducer);

    if (isValidElement(takeawayListReducer) && isValidElement(takeawayListReducer.isFromOfferList) && takeawayListReducer.isFromOfferList) {
        let offerList = sortedList.filter(
            (takeaway) =>
                takeaway.discount >= takeawayListReducer.filterListWithOffer &&
                takeaway.discount <= takeawayListReducer.filterListWithMaxOffer
        );
        return yield filterTakeawayData(FILTER_TYPE.DISCOUNT, offerList);
    } else if (
        isValidElement(takeawayListReducer) &&
        takeawayListReducer.homeScreenFilter &&
        (isValidElement(takeawayListReducer.advancedCuisineSelected) || isValidElement(takeawayListReducer.advancedFilterList))
    ) {
        let cuisineSorted = sortBasedOnCuisineAndFilter(
            takeawayListReducer.advancedCuisineSelected,
            sortedList,
            takeawayListReducer.advancedFilterList,
            true,
            takeawayListReducer.selectedAdvancedFilterName
        );
        return yield filterTakeawayData(takeawayListReducer.advancedFilterType, cuisineSorted);
    } else if (
        isValidElement(takeawayListReducer) &&
        isValidElement(takeawayListReducer.cuisinesSelected) &&
        takeawayListReducer.cuisinesSelected.length > 0
    ) {
        let cuisineSorted = sortBasedOnCuisineAndFilter(
            takeawayListReducer.cuisinesSelected,
            sortedList,
            takeawayListReducer.filterList,
            false,
            null
        );
        return yield filterTakeawayData(takeawayListReducer.filterType, cuisineSorted);
    }
    return sortedList;
}

export const sortBasedOnCuisineAndFilter = (cuisines, takeawayList, filterList, homeScreenFilter, selectedCuisineFilterName) => {
    let filterArray = sortBasedOnCuisines(cuisines, takeawayList, homeScreenFilter, selectedCuisineFilterName);
    if (isValidElement(filterList) && filterList.length > 0) {
        if (filterList.includes(FILTER_TAKEAWAY_LIST.FOUR_STAR_ABOVE)) {
            filterArray = filterArray.filter((item) => isValidString(item.rating) && item.rating >= 4);
        }
        if (filterList.includes(FILTER_TAKEAWAY_LIST.FREE_DELIVERY)) {
            filterArray = filterArray.filter((item) => isDeliveryFreeEnabled(item));
        }
        if (filterList.includes(FILTER_TAKEAWAY_LIST.OFFER)) {
            filterArray = filterArray.filter((item) => isValidString(item.discount) && item.discount > 0);
        }
        if (filterList.includes(FILTER_TAKEAWAY_LIST.LOW_DELIVERY_FEE)) {
            filterArray = filterArray.filter((item) => isLowDeliveryFree(item));
        }
        if (filterList.includes(FILTER_TAKEAWAY_LIST.HYGIENE_RATING)) {
            filterArray = filterArray.filter(
                (item) => isValidString(item.rating_value) && item.rating_value > 3 && item.rating_value !== -1
            );
        }
    }
    return filterArray;
};

export const isOrderTypeEnabled = (status) => {
    return isValidString(status) && status === 1;
};

export const isDeliveryFreeEnabled = (item) => {
    return (isValidElement(item?.delivery?.charge) && !(item.delivery.charge > 0)) || !isNashTakeaway(item?.assignDriverThrough);
};

export const isLowDeliveryFree = (item) => {
    return (isValidElement(item?.delivery?.charge) && item.delivery.charge <= 2) || !isNashTakeaway(item.delivery.charge);
};

export const sortBasedOnCuisines = (cuisines, takeawayList, homeScreenFilter, selectedCuisineFilterName) => {
    let filterTakeaway = takeawayList;

    if (isValidElement(homeScreenFilter) && homeScreenFilter && isValidString(selectedCuisineFilterName)) {
        filterTakeaway = getAdvanceFilterCuisinesBasedSort(takeawayList, [selectedCuisineFilterName]);
    }

    return getAdvanceFilterCuisinesBasedSort(filterTakeaway, cuisines);
};

export const getAdvanceFilterCuisinesBasedSort = (takeawayList, cuisines) => {
    let sortedArray = [];

    if (isValidElement(cuisines) && cuisines.length > 0) {
        for (let i = 0; i < takeawayList.length; i++) {
            for (let j = 0; j < takeawayList[i].cuisines.length; j++) {
                for (let k = 0; k < cuisines.length; k++) {
                    if (takeawayList[i].cuisines[j] === cuisines[k]) {
                        sortedArray.push(takeawayList[i]);
                    }
                }
            }
        }
        let noDuplicateElements = new Set(sortedArray);
        return [...noDuplicateElements];
    } else {
        return takeawayList;
    }
};

export const getFilterCuisinesList = (takeawayList, selectedCuisine, cuisinesData = null) => {
    let unsortedCuisinesArray = [];
    for (let i = 0; i < takeawayList?.length; i++) {
        for (let j = 0; j < takeawayList[i].cuisines.length; j++) {
            if (isValidElement(takeawayList[i]?.cuisines[j]) && takeawayList[i].cuisines[j] === selectedCuisine) {
                unsortedCuisinesArray = [...unsortedCuisinesArray, ...takeawayList[i].cuisines];
                continue;
            }
        }
    }
    //removing selected cuisine
    unsortedCuisinesArray = unsortedCuisinesArray.filter((item) => item !== selectedCuisine);
    let sortedCuisineResultArray = getRequiredCuisinesData(cuisinesData, unsortedCuisinesArray);
    return [...sortedCuisineResultArray]; // returning new array without duplicate elements
};

export const cuisinesList = (cuisines) => {
    if (isArrayNonEmpty(cuisines)) {
        return cuisines
            .slice(0, 3)
            .map((item) => capsWordCase(isValidString(item?.name) ? item.name : item))
            .join(', ');
    } else {
        return LOCALIZATION_STRINGS.CUISINES_UNAVAILABLE;
    }
};

export const getTakeawayLogoUrl = (item, isFranchiseOrTA) => {
    let defaultImage = isFranchiseApp()
        ? require('../../../FranchiseApp/Images/no_image_small_pattern.png')
        : require('../../HomeModule/Utils/Images/no_image.png');

    if (isValidElement(item)) {
        if (isFranchiseOrTA) {
            if (isValidString(item.logo_url)) {
                return { uri: item.logo_url };
            } else if (isValidString(item.thumbnail_url)) {
                return { uri: item.thumbnail_url };
            } else {
                return defaultImage;
            }
        } else {
            return isValidElement(item?.setting?.logo_url) ? { uri: item.setting.logo_url } : defaultImage;
        }
    } else {
        return defaultImage;
    }
};

export const portalDiscount = (item) => {
    if (isValidElement(item)) {
        if (!isValidString(item.portal_discount) && !isValidElement(item.setting)) {
            return item.discount;
        }
        let foodhubDiscount = isValidString(item.portal_discount)
            ? item.portal_discount
            : isValidElement(item.setting)
            ? item.setting.discount
            : null;
        let onlineDiscount = item.discount;
        if (item.gifttype === 'item') {
            return foodhubDiscount;
        } else {
            return isValidElement(foodhubDiscount)
                ? isValidElement(onlineDiscount)
                    ? Math.max(foodhubDiscount, onlineDiscount)
                    : foodhubDiscount
                : onlineDiscount;
        }
    } else {
        return null;
    }
};

export const getMinOrder = (item) => {
    if (isValidNumber(item?.setting?.min_order)) {
        return item.setting.min_order;
    } else if (isValidNumber(item?.delivery?.minimum_order)) {
        return item.delivery.minimum_order;
    } else {
        return null;
    }
};

export const getDeliveryWaitingTime = (item) => {
    if (isValidString(item?.delivery_time)) {
        const { show_delivery } = item;
        let storeStatusDelivery = getStoreStatusDelivery(item);
        let preOrderStatusDelivery = getPreorderStatus(item, ORDER_TYPE.DELIVERY, storeStatusDelivery);
        if (
            isDeliveryAvailable(show_delivery, storeStatusDelivery) &&
            isValidNumber(item.delivery_time) &&
            isMoreZero(item.delivery_time)
        ) {
            return safeIntValue(item.delivery_time) > 1
                ? item.delivery_time + ' ' + LOCALIZATION_STRINGS.MINS
                : item.delivery_time + ' ' + LOCALIZATION_STRINGS.MIN.toLowerCase();
        } else {
            return !isFullDeliveryClosed(show_delivery, storeStatusDelivery, preOrderStatusDelivery)
                ? LOCALIZATION_STRINGS.PREORDER
                : LOCALIZATION_STRINGS.CLOSED;
        }
    }
    return '';
};

export const isFullDeliveryClosed = (storeConfigShowDelivery, storeStatusDelivery, storeConfigPreOrderDelivery) => {
    return (
        !isDeliveryAvailable(storeConfigShowDelivery, storeStatusDelivery) &&
        !isDeliveryPreorderAvailable(storeConfigShowDelivery, storeConfigPreOrderDelivery)
    );
};

export const isFullCollectionClosed = (storeConfigShowCollection, storeStatusCollection, storeConfigPreOrderCollection) => {
    return (
        !isCollectionAvailable(storeConfigShowCollection, storeStatusCollection) &&
        !isCollectionPreorderAvailable(storeConfigShowCollection, storeConfigPreOrderCollection)
    );
};

export const getStoreStatusDelivery = (item) => {
    return isValidString(item?.store_status?.delivery)
        ? item.store_status.delivery
        : getOpenStatusBasedOnBusinessHours(item?.business_hours, ORDER_TYPE.DELIVERY, getCurrentDateWithTimeZone(item?.time_zone));
};

export const getStoreStatusCollection = (item) => {
    return isValidString(item?.store_status?.collection)
        ? item.store_status.collection
        : getOpenStatusBasedOnBusinessHours(item?.business_hours, ORDER_TYPE.COLLECTION, getCurrentDateWithTimeZone(item?.time_zone));
};

export const getCollectionWaitingTime = (item) => {
    if (isValidString(item?.collection_time)) {
        const { show_collection } = item;
        let storeStatusCollection = getStoreStatusCollection(item);
        let preOrderStatusCollection = getPreorderStatus(item, ORDER_TYPE.COLLECTION, storeStatusCollection);
        if (
            isCollectionAvailable(show_collection, storeStatusCollection) &&
            isValidNumber(item.collection_time) &&
            isMoreZero(item.collection_time)
        ) {
            return safeIntValue(item.collection_time) > 1
                ? item.collection_time + ' ' + LOCALIZATION_STRINGS.MINS
                : item.collection_time + ' ' + LOCALIZATION_STRINGS.MIN.toLowerCase();
        } else {
            return !isFullCollectionClosed(show_collection, storeStatusCollection, preOrderStatusCollection)
                ? LOCALIZATION_STRINGS.PREORDER
                : LOCALIZATION_STRINGS.CLOSED;
        }
    }
    return '';
};

export const getRatings = (storeConfigRating) => {
    if (isValidElement(storeConfigRating) && isMoreZero(storeConfigRating)) {
        return safeFloatValueWithoutDecimal(storeConfigRating);
    } else {
        return 0.0;
    }
};

export const filterTakeawayList = (takeawayList, checkByOrderType = false, orderType = null) => {
    let filteredList = {};
    filteredList.onlineTakeaways = [];
    filteredList.preOrderTakeaways = [];
    filteredList.closedTakeawayList = [];

    if (isArrayNonEmpty(takeawayList)) {
        for (let i = 0; i < takeawayList.length; i++) {
            let { show_delivery, show_collection } = isValidElement(takeawayList[i]) && takeawayList[i];
            let storeStatusDelivery = getStoreStatusDelivery(takeawayList[i]);
            let storeStatusCollection = getStoreStatusCollection(takeawayList[i]);
            let preOrderStatusDelivery = getPreorderStatus(takeawayList[i], ORDER_TYPE.DELIVERY, storeStatusDelivery);
            let preOrderStatusCollection = getPreorderStatus(takeawayList[i], ORDER_TYPE.COLLECTION, storeStatusCollection);

            let isTakeawayOpenCondition = checkByOrderType
                ? orderType === ORDER_TYPE.DELIVERY
                    ? isDeliveryAvailable(show_delivery, storeStatusDelivery)
                    : isCollectionAvailable(show_collection, storeStatusCollection)
                : isTakeawayOpen(show_delivery, storeStatusDelivery, show_collection, storeStatusCollection);

            let isTakeawayPreorderAvailable = checkByOrderType
                ? orderType === ORDER_TYPE.DELIVERY
                    ? isDeliveryPreorderAvailable(show_delivery, preOrderStatusDelivery)
                    : isCollectionPreorderAvailable(show_collection, preOrderStatusCollection)
                : canPreorder(show_delivery, preOrderStatusDelivery, show_collection, preOrderStatusCollection);

            let isDeliveryTAavailable = isDeliveryOrPreOrderAvailable(show_delivery, storeStatusDelivery, preOrderStatusDelivery);
            let isCollectionTAavailable = isCollectionOrPreOrderAvailable(show_collection, storeStatusCollection, preOrderStatusCollection);

            if (isTakeawayOpenCondition) {
                filteredList.onlineTakeaways.push(takeawayList[i]);
            } else if (isTakeawayPreorderAvailable) {
                filteredList.preOrderTakeaways.push(takeawayList[i]);
            } else {
                if (checkByOrderType) {
                    if (orderType === ORDER_TYPE.DELIVERY && !isCollectionTAavailable) {
                        filteredList.closedTakeawayList.push(takeawayList[i]);
                    } else if (orderType === ORDER_TYPE.COLLECTION && !isDeliveryTAavailable) {
                        filteredList.closedTakeawayList.push(takeawayList[i]);
                    }
                } else {
                    filteredList.closedTakeawayList.push(takeawayList[i]);
                }
            }
        }
    }
    return filteredList;
};

export const filterRecommendedTakeawayList = (takeawayList, filterType, checkByOrderType = false, orderType = null) => {
    const filteredList = filterTakeawayList(takeawayList, checkByOrderType, orderType);
    const taResponse = filterTakeawayData(filterType, filteredList?.onlineTakeaways);
    return isArrayNonEmpty(taResponse) ? taResponse : null;
};

export const getOpenStatusBasedOnBusinessHours = (businessHours, orderType, currentTimeStamp) => {
    let isTakeawayOpen = null;
    let filteredHours = [];
    if (isArrayNonEmpty(businessHours)) {
        //as business hours for a day may contain 2 or more shifts
        for (let i = 0; i < businessHours.length; i++) {
            if (isToday(businessHours[i]?.business_date) && businessHours[i]?.service_type?.toLowerCase() === orderType) {
                filteredHours.push(businessHours[i]);
            }
        }

        for (let i = 0; i < filteredHours.length; i++) {
            let isOpen =
                filteredHours[i]?.open_at <= currentTimeStamp &&
                currentTimeStamp > filteredHours[i]?.open_at &&
                currentTimeStamp <= filteredHours[i]?.close_at;
            isTakeawayOpen = isBoolean(isTakeawayOpen) ? isTakeawayOpen || isOpen : isOpen;
        }
    }
    return isBoolean(isTakeawayOpen) && isTakeawayOpen ? ORDER_TYPE_STATUS.OPEN : ORDER_TYPE_STATUS.CLOSED;
};

export const getPreorderStatus = (item, orderType, storeStatus) => {
    if (item?.preorder === FILTER_TAKEAWAY_CONSTANTS.ENABLED && isValidElement(item?.preorder_hours)) {
        let preorderStatus =
            orderType === ORDER_TYPE.DELIVERY ? item.preorder_hours?.delivery?.pre_order : item.preorder_hours?.collection?.pre_order;
        if (isValidElement(preorderStatus)) {
            return preorderStatus;
        }
    } else if (item?.preorder === FILTER_TAKEAWAY_CONSTANTS.ENABLED && storeStatus === ORDER_TYPE_STATUS.CLOSED) {
        let getNextShift = getNearestBusinessHours(item?.business_hours, orderType, null, item?.time_zone, item?.next_open);
        return isValidElement(getNextShift) ? BOOL_CONSTANT.YES.toLowerCase() : BOOL_CONSTANT.NO.toLowerCase();
    }
    return BOOL_CONSTANT.NO.toLowerCase();
};

export const getNearestBusinessHours = (businessHours, orderType = null, preorderHours = null, timezone = null, next_open = null) => {
    let nearestBusinessHours = null;
    if (isValidString(next_open)) {
        return next_open;
    } else if (isValidElement(preorderHours) && isValidElement(orderType)) {
        let preorderData = isValidElement(preorderHours[orderType]) ? preorderHours[orderType] : '';
        return isValidString(preorderData?.next_open) ? preorderData.next_open : '';
    } else if (isValidElement(businessHours)) {
        let getFilteredHours;
        if (isValidElement(orderType)) {
            getFilteredHours = businessHours.filter(
                (item) => item?.service_type?.toLowerCase() === orderType && item?.open_at > getCurrentDateWithTimeZone(timezone)
            );
        } else {
            getFilteredHours = businessHours.filter((item) => item?.open_at > getCurrentDateWithTimeZone(timezone));
        }
        if (isArrayNonEmpty(getFilteredHours)) {
            nearestBusinessHours = _.sortBy(getFilteredHours, function(item) {
                return moment(item.open_at);
            });
            if (isArrayNonEmpty(nearestBusinessHours) && isValidElement(nearestBusinessHours[0]?.open_at)) {
                return nearestBusinessHours[0].open_at;
            }
        }
    }
    return null;
};

export const getFavouriteTakeaways = (arrayOfTakeaways) => {
    let favouriteTakeawayId = [];
    if (isValidElement(arrayOfTakeaways) && arrayOfTakeaways.length > 0) {
        for (let i = 0; i < arrayOfTakeaways.length; i++) {
            favouriteTakeawayId.push(arrayOfTakeaways[i].id);
        }
        return favouriteTakeawayId;
    } else {
        return null;
    }
};

export const getDiscountAmount = (discount) => {
    if (isValidElement(discount)) {
        if (/^\d$/.test(discount)) {
            return ' ' + parseInt(discount);
        } else {
            return parseInt(discount);
        }
    } else {
        return 0;
    }
};

export const isDeliveryAvailable = (storeConfigShowDelivery, storeStatusDelivery) => {
    return (
        isValidElement(storeConfigShowDelivery) &&
        isValidString(storeStatusDelivery) &&
        storeConfigShowDelivery === 1 &&
        storeStatusDelivery.toLowerCase() === ORDER_TYPE_STATUS.OPEN.toLowerCase()
    );
};

export const isCollectionAvailable = (storeConfigShowCollection, storeStatusCollection) => {
    return (
        isValidElement(storeConfigShowCollection) &&
        isValidElement(storeStatusCollection) &&
        storeConfigShowCollection === 1 &&
        storeStatusCollection === ORDER_TYPE_STATUS.OPEN
    );
};

export const isTakeawayOpen = (storeConfigShowDelivery, storeStatusDelivery, storeConfigShowCollection, storeStatusCollection) => {
    return (
        isDeliveryAvailable(storeConfigShowDelivery, storeStatusDelivery) ||
        isCollectionAvailable(storeConfigShowCollection, storeStatusCollection)
    );
};

export const isDeliveryOrPreOrderAvailable = (show_delivery, store_status, preorder_hours) => {
    return isDeliveryAvailable(show_delivery, store_status) || isDeliveryPreorderAvailable(show_delivery, preorder_hours);
};

export const isCollectionOrPreOrderAvailable = (show_collection, store_status, preorder_hours) => {
    return isCollectionAvailable(show_collection, store_status) || isCollectionPreorderAvailable(show_collection, preorder_hours);
};

export const canPreorder = (
    storeConfigShowDelivery,
    storeConfigPreOrderDelivery,
    storeConfigShowCollection,
    storeConfigPreOrderCollection
) => {
    return (
        isDeliveryPreorderAvailable(storeConfigShowDelivery, storeConfigPreOrderDelivery) ||
        isCollectionPreorderAvailable(storeConfigShowCollection, storeConfigPreOrderCollection)
    );
};

export const isDeliveryPreorderAvailable = (storeConfigShowDelivery, storeConfigPreOrderDelivery) => {
    return (
        isValidElement(storeConfigShowDelivery) &&
        storeConfigShowDelivery === 1 &&
        isValidElement(storeConfigPreOrderDelivery) &&
        boolValue(storeConfigPreOrderDelivery)
    );
};

export const isCollectionPreorderAvailable = (storeConfigShowCollection, storeConfigPreOrderCollection) => {
    return (
        isValidElement(storeConfigShowCollection) &&
        storeConfigShowCollection === 1 &&
        isValidElement(storeConfigPreOrderCollection) &&
        boolValue(storeConfigPreOrderCollection)
    );
};

export const getDistanceTypeValue = (distanceType) => {
    return isValidString(distanceType) ? distanceType : DISTANCE_TYPE.MILES;
};

export const patchDistanceOfTakeaway = (response, distanceType, best_match_response) => {
    let distanceTypeValue = getDistanceTypeValue(distanceType);
    if (isValidElement(response?.value?.location) && isValidElement(response?.data)) {
        let userLat = response.value.location.lat;
        let userLong = response.value.location.long;
        let takeawayList = response.data;
        if (isValidElement(userLat) && isValidElement(userLong) && takeawayList.length > 0) {
            for (let i = 0; i < takeawayList.length; i++) {
                if (isValidElement(takeawayList[i].lat) && isValidElement(takeawayList[i].lng)) {
                    takeawayList[i].distanceInMiles = distance(
                        userLat,
                        userLong,
                        takeawayList[i].lat,
                        takeawayList[i].lng,
                        distanceTypeValue === DISTANCE_TYPE.MILES ? 'M' : 'K'
                    );
                    if (isValidElement(best_match_response) && isValidElement(best_match_response[4]?.distance)) {
                        let disValue = distanceBestMatch(best_match_response[4], takeawayList[i].distanceInMiles);
                        takeawayList[i].best_match = Number(disValue) + Number(takeawayList[i].best_match);
                    }
                }
            }
        }
    }
};
export const newTakeawayList = (takeawayList) => {
    let newTakeaway = [];
    let oldTakeaway = [];
    if (isValidElement(takeawayList) && takeawayList.length > 0) {
        for (let i = 0; i < takeawayList.length; i++) {
            if (isNewTakeaway(takeawayList[i])) {
                newTakeaway.push(takeawayList[i]);
            } else {
                oldTakeaway.push(takeawayList[i]);
            }
        }
        return newTakeaway.concat(oldTakeaway);
    } else return takeawayList;
};

export const isNewTakeaway = (item) => {
    const { priority, new_takeaway, setting } = item;
    if (isValidString(priority)) {
        return priority.toLowerCase() === NEW_LABEL;
    } else if (isValidElement(new_takeaway)) {
        return new_takeaway;
    }
    return (
        isValidElement(setting?.priority) &&
        setting.priority.toLowerCase() === NEW_LABEL &&
        isValidElement(setting?.priority_start_date) &&
        isValidElement(setting?.priority_end_date) &&
        isBetweenDays(setting.priority_start_date, setting.priority_end_date)
    );
};

export const isValidFavouriteTAList = (favouriteTakeaway) => {
    return isValidElement(favouriteTakeaway) && favouriteTakeaway.length > 0;
};

export const updateFilterType = (listDetails) => {
    return isValidElement(listDetails?.filter_by?.filter) ? listDetails.filter_by.filter : FILTER_TYPE.DISTANCE_VALUE;
};

export function extractTimeLogicForNextOpening(timeStamp, timeZone) {
    let todayMoment = moment.tz(timeZone);
    let timeStampMoment = moment(timeStamp, DATE_FORMAT.YYYY_MM_DD_HH_MM_SS, true);
    let dayDiff = timeStampMoment.diff(todayMoment.format(DATE_FORMAT.YYYY_MM_DD), 'days');
    let today = todayMoment.format(DATE_FORMAT.YYYY_MM_DD);
    let date = timeStampMoment.toDate();
    const tomorrow = dayDiff === 1;
    let actualDate = timeStampMoment.format(DATE_FORMAT.YYYY_MM_DD);
    let isAfter1Day = dayDiff > 1;

    return { today, tomorrow, actualDate, date, isAfter1Day };
}

export const preorderTakeawayOpenTime = (timeStamp, timeZone, id, isPreorder = true) => {
    const { today, tomorrow, actualDate, date } = extractTimeLogicForNextOpening(timeStamp, timeZone);

    //if from closed TA, show in am/pm format
    let time = moment(date).format(DATE_FORMAT.H_MM_A);
    let formatedDate = moment(date).format(DATE_FORMAT.YYYY_MM_DD_H_MM_A);

    if (isValidString(timeStamp) && id === VIEW_ID.CLOSED_MESSAGE) {
        return getFormattedMessage(today, actualDate, tomorrow, isPreorder);
    }
    if (isValidString(timeStamp) && id === VIEW_ID.OPENING_TIME_TEXT) {
        if (actualDate === today) {
            return time;
        } else if (tomorrow) {
            return time;
        } else {
            return formatedDate;
        }
    }
};

export const getFormattedMessage = (today, actualDate, tomorrow, isPreorder) => {
    let formattedMessage = isPreorder
        ? LOCALIZATION_STRINGS.OPENS_AT + ' '
        : LOCALIZATION_STRINGS.formatString(LOCALIZATION_STRINGS.SORRY_WE_ARE_CLOSED_AND_WILL_OPEN, '', '');
    if (actualDate === today) {
        return formattedMessage;
    } else if (actualDate === tomorrow) {
        return isPreorder
            ? LOCALIZATION_STRINGS.OPENING_TOMORROW_AT + ' '
            : LOCALIZATION_STRINGS.formatString(LOCALIZATION_STRINGS.SORRY_WE_ARE_CLOSED_AND_WILL_OPEN, LOCALIZATION_STRINGS.TOMORROW, ' ');
    } else {
        return formattedMessage;
    }
};

export const isTakeawayBlocked = (store_id, associateTakeawayResponse) => {
    if (isValidElement(store_id) && isValidElement(associateTakeawayResponse)) {
        const store = associateTakeawayResponse.find((item) => item.id === store_id);
        if (isValidElement(store)) {
            return boolValue(store.block_order);
        }
    }
    return false;
};

export const takeawayBlockedMessage = (store_id, associateTakeawayResponse, languageKey = undefined) => {
    if (isValidElement(store_id) && isValidElement(associateTakeawayResponse)) {
        const store = associateTakeawayResponse.find((item) => item.id === store_id);
        if (isValidElement(store) && isValidNotEmptyString(store.block_order_message)) {
            return convertMessageToAppLanguage(store.block_order_message, languageKey);
        }
    }
    return LOCALIZATION_STRINGS.TAKEAWAY_BLOCKED_MESSAGE;
};

export const getDistanceType = (type) => {
    let distanceType = isValidString(type) ? type : DISTANCE_TYPE.MILES;
    return distanceType.toLowerCase() === DISTANCE_TYPE.MILES ? ' ' + LOCALIZATION_STRINGS.MILES_SHORT : ' ' + distanceType;
};
export const takeawayListWithFavoritesUpdated = (favouriteTakeaways, takeawayId, isFavorite) => {
    const clonedList = _.cloneDeep(favouriteTakeaways);
    let indexOfTakeaway = NO_MATCH_FOUND;
    for (let i = 0; i < clonedList.length; i++) {
        if (clonedList[i].id === takeawayId) {
            indexOfTakeaway = i;
            break;
        }
    }
    if (isFavorite === FAVOURITE_TAKEAWAY.YES && indexOfTakeaway === NO_MATCH_FOUND) {
        clonedList.push({ id: takeawayId });
    } else if (indexOfTakeaway > NO_MATCH_FOUND) {
        clonedList.splice(indexOfTakeaway, 1);
    }
    return clonedList;
};

export const logFavouritesSegment = (countryBaseFeatureGateResponse, itemName, action, favouriteTakeaways, isFromMenu = false) => {
    let names = [];
    if (action === SEGMENT_CONSTANTS.ADD) {
        Segment.trackEvent(countryBaseFeatureGateResponse, SEGMENT_EVENTS.ADDED_TO_FAVOURITES, {
            takeaway: itemName
        });
        names = [itemName];
    } else if (action === SEGMENT_CONSTANTS.REMOVE) {
        Segment.trackEvent(countryBaseFeatureGateResponse, SEGMENT_EVENTS.REMOVED_FROM_FAVOURITES, {
            takeaway: itemName
        });
    }
    if (isFromMenu) {
        if (isValidElement(favouriteTakeaways)) {
            favouriteTakeaways.map((ta) => {
                if (action === SEGMENT_CONSTANTS.ADD && isValidElement(ta.name)) {
                    names.push(ta.name);
                } else if (action === SEGMENT_CONSTANTS.REMOVE && itemName !== ta.name && isValidElement(ta.name)) {
                    names.push(ta.name);
                }
            });
        }
        logFavouriteList(countryBaseFeatureGateResponse, names);
    } else {
        logFavouriteList(countryBaseFeatureGateResponse, favouriteTakeaways);
    }
};

export const logFavouriteList = (countryBaseFeatureGateResponse, names) => {
    Segment.trackEventNonInteractiveEvent(
        countryBaseFeatureGateResponse,
        SEGMENT_EVENTS.FAVOURITE_LIST,
        {
            favourite_ta_names: names.length > 0 ? names.toString() : ''
        },
        names.length > 0 ? names : []
    );
};

export const sortBySelectedCuisine = (data, cuisinesSelected) => {
    if (isValidElement(cuisinesSelected) && cuisinesSelected.length > 0) {
        return _.orderBy(
            data,
            [
                (obj) => {
                    return isValidElement(cuisinesSelected) ? cuisinesSelected.includes(obj.name) : obj.name;
                },
                (obj) => {
                    return obj.count;
                }
            ],
            ['desc', 'desc']
        );
    } else {
        return data;
    }
};

export const sortByCuisineCount = (data) => {
    return _.orderBy(
        data,
        [
            (obj) => {
                return obj.count;
            },
            (obj) => {
                return obj.name;
            }
        ],
        ['desc', 'asc']
    );
};

export const setFilterType = (homeScreenFilter, action, stateFilterType, stateAdvancedFilterType) => {
    //filterDataType comes from saga
    let sortType = {};
    if (isValidElement(homeScreenFilter) && homeScreenFilter) {
        sortType.advancedFilterType = isValidElement(action?.filter)
            ? action.filter
            : isValidElement(action?.filterDataType)
            ? action.filterDataType
            : stateAdvancedFilterType;
        if (!isValidElement(sortType.advancedFilterType)) {
            sortType.advancedFilterType = FILTER_TYPE.DISTANCE_VALUE;
        }
    } else {
        sortType.filterType = isValidElement(action?.filter)
            ? action.filter
            : isValidElement(action?.filterDataType)
            ? action.filterDataType
            : stateFilterType;
        if (!isValidElement(sortType.filterType)) {
            sortType.filterType = FILTER_TYPE.DISTANCE_VALUE;
        }
    }
    return sortType;
};

export const filterOfferList = (offerList, takeawayList) => {
    let filteredList = [];
    if (isValidElement(offerList) && isValidElement(takeawayList)) {
        offerList.map((item) => {
            let filterOfferList = takeawayList.filter((takeaway) => takeaway.discount >= item.offer && takeaway.discount <= item.offerMax);
            if (filterOfferList.length > 0) filteredList.push(item);
        });
        return filteredList;
    }
    return offerList;
};

export const getCuisineColorCode = (index) => {
    switch (index % 5) {
        case 0:
            return [Colors.paleOrange, Colors.lighterOrange];
        case 1:
            return [Colors.palePink, Colors.vividPink];
        case 2:
            return [Colors.droverOrange, Colors.dandelionOrange];
        case 3:
            return [Colors.paleAqua, Colors.sprayBlue];
        case 4:
            return [Colors.whiteLilac, Colors.fogPurple];
        default:
            return [Colors.paleOrange, Colors.lighterOrange];
    }
};

export const checkNecessaryConfigParams = (storeResponse) => {
    //todo: function can be removed once api params are updated - fdhb-9060
    if (isValidElement(storeResponse)) {
        const { our_recommendations, card_payment, payment_provider, ask_postcode_first, global_tip } = storeResponse;
        return (
            isValidElement(our_recommendations) &&
            isValidElement(card_payment) &&
            isValidElement(payment_provider) &&
            isValidElement(ask_postcode_first) &&
            isValidElement(global_tip)
        );
    }
    return false;
};
//TODO we have to unit test case for this function
export const distanceBestMatch = (best_match_weightage, value) => {
    let min_value = best_match_weightage?.distance?.min_value ?? 0;
    let max_value = best_match_weightage?.distance?.max_value ?? 0;
    let value_split = best_match_weightage?.distance?.value_split ?? 1;
    let weightage = best_match_weightage?.distance?.weightage ?? 1;

    let split = (max_value - min_value) / value_split;
    let point = 10 / value_split;
    let j = 0;
    let point_value = (value % split) / split;

    for (let i = max_value; i > min_value; i -= split) {
        if (value >= i && value < max_value) {
            return ((j - point_value) * weightage) / 100;
        }
        j += point;
    }

    if (value > max_value) {
        return 0;
    } else {
        return ((10 - point_value) * weightage) / 100;
    }
};

export const isTakeawayListEmpty = (takeawayListData) => {
    let { onlineTakeaways, preOrderTakeaways, closedTakeawayList } = takeawayListData;
    return onlineTakeaways?.length === 0 && closedTakeawayList?.length === 0 && preOrderTakeaways?.length === 0;
};

export const convertLatLngToString = (object) => {
    if (isValidElement(object?.lat) && isValidElement(object?.lng)) {
        return `${object.lat},${object.lng}`;
    }
};

export const getTAURL = (storeConfigLogoURL, storeConfigThumbnailURL) => {
    let defaultImage = isFranchiseApp()
        ? require('../../../FranchiseApp/Images/no_image_small_pattern.png')
        : require('../../HomeModule/Utils/Images/no_image.png');
    if (isValidString(storeConfigLogoURL)) {
        return storeConfigLogoURL;
    } else if (isValidString(storeConfigThumbnailURL)) {
        return storeConfigThumbnailURL;
    } else {
        return defaultImage;
    }
};

export const getSearchMethodFromTakeawayList = (action) => {
    return !action?.searchByAddress && isValidString(action?.postCode)
        ? SEGMENT_CONSTANTS.POSTCODE
        : action?.searchByAddress && isValidString(action?.searchType)
        ? action.searchType
        : '';
};

export const getSearchTermFromTakeawayList = (action) => {
    return isValidString(action?.addressObj?.description)
        ? action?.addressObj?.description
        : convertLatLngToString(action) ?? action?.postCode ?? '';
};

export const isDeliveryChargeAvailable = (delivery) => {
    return isValidElement(delivery?.charge) && parseFloat(delivery.charge) > 0;
};
export const isFreeDelivery = (delivery) => {
    return (
        delivery?.charge?.toString() === '0.00' ||
        delivery?.charge?.length === 0 ||
        delivery?.charge?.toString() === '0' ||
        delivery?.charge?.toString() === '0.0'
    );
};
export const isNashTakeaway = (assignDriverThrough) => {
    return isValidElement(assignDriverThrough) && assignDriverThrough === CONSTANTS.FALCON_DELIVERY;
};

export const getNashRangeValueAsArray = () => {
    return NASH_DELIVERY_CHARGE_RANGE_VALUE.charge.split('-');
};
export const isValidFavSearchedTakeawayList = (data) => {
    return (
        isValidElement(data) &&
        (isArrayNonEmpty(data.onlineTakeaways) || isArrayNonEmpty(data.preorderTakeaways) || isArrayNonEmpty(data.closedTakeaways))
    );
};
