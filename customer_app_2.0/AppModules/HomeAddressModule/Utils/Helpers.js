import { isValidElement } from 't2sbasemodule/Utils/helpers';
import { getDistanceFromLatLonInKm } from '../../OrderManagementModule/Utils/OrderManagementHelper';

export const isDifferentLatLongFromCurrentLocation = (currentLocation, addressLocation, setMinimumDistance = 50) => {
    const { latitude, longitude } = isValidElement(currentLocation) && currentLocation;
    if (
        isValidElement(latitude) &&
        isValidElement(longitude) &&
        isValidElement(addressLocation) &&
        isValidElement(addressLocation.longitude) &&
        isValidElement(addressLocation.latitude)
    ) {
        let distance = getDistanceFromLatLonInKm(latitude, longitude, addressLocation.latitude, addressLocation.longitude);
        let distanceInMeter = distance * 1000;
        return distanceInMeter >= setMinimumDistance;
    }
    return false;
};
