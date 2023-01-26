import { Platform } from 'react-native';
import { isDebugBuildType } from 't2sbasemodule/Utils/helpers';

export const BASE_ID = 'AK_';
export const VIEW_DISABLED = '_Disabled';
export const VIEW_SELECTED = '_Selected';

export const setTestId = (screenName, id) => {
    if (isDebugBuildType) {
        try {
            return Platform.OS === 'android'
                ? { accessible: true, accessibilityLabel: BASE_ID + screenName + '_' + id }
                : { testID: BASE_ID + screenName + '_' + id };
        } catch (e) {
            // Adding automation logging failed
        }
    }
};
