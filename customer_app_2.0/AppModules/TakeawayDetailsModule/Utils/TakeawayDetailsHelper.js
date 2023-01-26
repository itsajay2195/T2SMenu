import { getDateStr, isValidElement, isValidString } from 't2sbasemodule/Utils/helpers';
import { DATE_FORMAT } from 't2sbasemodule/Utils/DateUtil';
import { Linking, Platform } from 'react-native';
import { MAP_URL_CONSTANTS, RATING_VALUES } from './TakeawayDetailsConstants';

export const getDateOfInspection = (rating) => {
    let date = isValidElement(rating) && isValidElement(rating.rating_date) ? rating.rating_date : undefined;
    if (isValidElement(date)) {
        return getDateStr(date, DATE_FORMAT.DD_MMM_YYYY);
    } else {
        return null;
    }
};
export const showMap = (latitude, longitude) => {
    const scheme1 = Platform.select({
        ios: MAP_URL_CONSTANTS.IOS_SCHEME_1,
        android: MAP_URL_CONSTANTS.ANDROID_SCHEME_1
    });
    const scheme2 = Platform.select({ ios: MAP_URL_CONSTANTS.IOS_SCHEME_2, android: MAP_URL_CONSTANTS.ANDROID_SCHEME_2 });
    const latLng = `${latitude},${longitude}`;
    const url = `${scheme1}${latLng}${scheme2}`;
    if (Platform.OS === 'ios') {
        Linking.canOpenURL(MAP_URL_CONSTANTS.CHECK_GOOGLE_MAPS_SCHEME).then((supported) => {
            if (supported) {
                Linking.openURL(url);
            } else {
                Linking.openURL(`${MAP_URL_CONSTANTS.APPLE_MAPS_SCHEME}${latLng}`);
            }
        });
    } else {
        return Linking.openURL(url);
    }
};

export const getHygienicRatingValueAndId = (ratingId) => {
    let ratingData = RATING_VALUES().filter((rating) => (rating.id === ratingId ? rating.id + rating.review : null));
    return isValidElement(ratingData) && ratingData.length > 0 && isValidElement(ratingData[0].id) && isValidElement(ratingData[0].review)
        ? ratingData[0].id + ratingData[0].review
        : ratingId + '';
};

export const getRatingText = (rating) => {
    let ratingText = '';
    RATING_VALUES().forEach((item) => {
        if (item.id === rating) {
            ratingText = item.review;
        }
    });
    return ratingText;
};

export const checkDeepLinkMenuParamsExist = (storeResponse) => {
    //if certain params not present, call store config api
    const { delivery_time, collection_time, rating, total_reviews } = storeResponse;
    return isValidElement(delivery_time) && isValidElement(collection_time) && isValidElement(rating) && isValidElement(total_reviews);
};

export const getTakeawayAddress = (props) => {
    let address = '';
    const { storeConfigAddress, storeConfigNumber, storeConfigPostcode, storeConfigTown, storeConfigCity, storeConfigStreet } = props;
    let street = isValidString(storeConfigStreet)
        ? storeConfigStreet
        : isValidString(storeConfigAddress?.street)
        ? storeConfigAddress.street
        : '';
    let city = isValidString(storeConfigCity)
        ? storeConfigCity
        : isValidString(storeConfigAddress?.region)
        ? storeConfigAddress.region
        : '';
    let town = isValidString(storeConfigTown) ? storeConfigTown : isValidString(storeConfigAddress?.town) ? storeConfigAddress.town : '';

    address = isValidString(storeConfigNumber) ? storeConfigNumber + ', ' : '';
    if (isValidString(street)) {
        address = address + street + ', ';
    }
    if (isValidString(city)) {
        address = address + city + ', ';
    }
    if (isValidString(town)) {
        address = address + town + ', ';
    }
    if (isValidString(storeConfigPostcode)) {
        address = address + storeConfigPostcode;
    }
    return address;
};
