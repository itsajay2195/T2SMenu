import { getDeviceOS } from 't2sbasemodule/Utils/helpers';
import { OS_PLATFORM } from 't2sbasemodule/Utils/Constants';
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import { Platform } from 'react-native';

export async function isGPSLocationEnabled(checkOnly = false) {
    if (getDeviceOS() === OS_PLATFORM.iOS) {
        let status = await check(PERMISSIONS.IOS.LOCATION_ALWAYS);
        if (status !== RESULTS.GRANTED) {
            status = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        }
        return permissionStatus(status, checkOnly);
    } else {
        let status = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        return permissionStatus(status, checkOnly);
    }
}

export async function permissionStatus(status, checkOnly = false) {
    if (status === RESULTS.GRANTED) return true;
    if (status === RESULTS.BLOCKED || status === RESULTS.UNAVAILABLE) return false;
    if (!checkOnly && status === RESULTS.DENIED) {
        if (getDeviceOS() === OS_PLATFORM.iOS) {
            let result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
            if (result === RESULTS.GRANTED) return true;
            if (result === RESULTS.BLOCKED) return false;
        } else {
            let result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
            if (result === RESULTS.GRANTED) return true;
            if (result === RESULTS.BLOCKED) return false;
        }
    } else return false;
}
export const hasLocationPermission = async () => {
    if (Platform.OS === 'ios') {
        let status = await check(PERMISSIONS.IOS.LOCATION_ALWAYS);
        if (status !== RESULTS.GRANTED) {
            status = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        }
        return status === RESULTS.GRANTED;
    }

    if (Platform.OS === 'android' && Platform.Version < 23) {
        return true;
    }
    let status = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    return status === RESULTS.GRANTED;
};
