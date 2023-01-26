import { AppConfig } from '../../../../CustomerApp/Utils/AppConfig';

/**
 * Configuration used for views
 * @type {{authConfig: {splashScreenTimer: number, OTPResentTimer: number}, settingsConfig: {}}}
 */

export const AppUpdateConfig = {
    storeUrls: {
        IOS_APP_STORE_LINK: AppConfig.IOS_APP_STORE_URL,
        ANDROID_PLAY_STORE_LINK: AppConfig.ANDROID_PLAY_STORE_URL
    }
};
