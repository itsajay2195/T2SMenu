import { SCREEN_OPTIONS } from '../../Navigation/ScreenOptions';
import { FONT_ICON } from '../../Fonts/FontIcon';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import { isNonCustomerApp } from 't2sbasemodule/Utils/helpers';

export const menu = () => [
    {
        key: SCREEN_OPTIONS.HOME.route_name,
        name: LOCALIZATION_STRINGS.HOME,
        is_more: false,
        featureVisible: FeatureVisible.ALL,
        icon_name: FONT_ICON.HOME
    },
    {
        key: SCREEN_OPTIONS.PROFILE.route_name,
        name: LOCALIZATION_STRINGS.PROFILE,
        is_more: false,
        featureVisible: FeatureVisible.ALL,
        icon_name: FONT_ICON.PROFILE
    },
    {
        key: SCREEN_OPTIONS.SOCIAL_LOGIN.route_name,
        name: LOCALIZATION_STRINGS.LOGIN,
        is_more: false,
        featureVisible: FeatureVisible.ALL,
        icon_name: FONT_ICON.LOGOUT
    },
    {
        key: SCREEN_OPTIONS.FAVOURITE_TAKEAWAY_SCREEN.route_name,
        name: LOCALIZATION_STRINGS.FAVOURITES,
        is_more: false,
        featureVisible: FeatureVisible.IS_NOT_CUSTOMER_APP,
        icon_name: FONT_ICON.HEART_STROKE
    },
    {
        key: SCREEN_OPTIONS.ORDER_HISTORY.route_name,
        name: LOCALIZATION_STRINGS.ORDER_HISTORY,
        is_more: false,
        featureVisible: FeatureVisible.ALL,
        icon_name: FONT_ICON.ORDER_HISTORY
    },
    {
        key: SCREEN_OPTIONS.WALLET.route_name,
        name: LOCALIZATION_STRINGS.WALLET,
        is_more: false,
        featureVisible: FeatureVisible.FOODHUB,
        icon_name: FONT_ICON.PAY
    },
    {
        key: SCREEN_OPTIONS.REFERRAL_SCREEN.route_name,
        name: LOCALIZATION_STRINGS.REFERRAL_LINK_MSG,
        is_more: false,
        featureVisible: FeatureVisible.FOODHUB,
        icon_name: FONT_ICON.SHARE_FILL
    },
    {
        key: SCREEN_OPTIONS.NOTIFICATIONS.route_name,
        name: LOCALIZATION_STRINGS.NOTIFICATIONS,
        is_more: false,
        featureVisible: FeatureVisible.ALL,
        icon_name: FONT_ICON.NOTIFICATION
    },
    {
        key: isNonCustomerApp() ? SCREEN_OPTIONS.ABOUT_US.route_name : SCREEN_OPTIONS.TAKEAWAY_DETAILS.route_name,
        name: LOCALIZATION_STRINGS.ABOUT_US,
        is_more: false,
        featureVisible: FeatureVisible.ALL,
        icon_name: FONT_ICON.INFO_ICON_UNFILLED
    },
    {
        key: SCREEN_OPTIONS.LOYALTY_POINTS.route_name,
        name: LOCALIZATION_STRINGS.LOYALTY_POINTS,
        is_more: false,
        featureVisible: FeatureVisible.CUSTOMER_APP,
        icon_name: FONT_ICON.LOYALTY_POINTS
    },
    {
        key: SCREEN_OPTIONS.TABLE_BOOKING.route_name,
        name: LOCALIZATION_STRINGS.TABLE_BOOKING,
        is_more: false,
        featureVisible: FeatureVisible.CUSTOMER_APP,
        icon_name: FONT_ICON.TABLE
    },
    {
        key: SCREEN_OPTIONS.TOTAL_SAVINGS.route_name,
        name: LOCALIZATION_STRINGS.TOTAL_SAVINGS,
        is_more: false,
        featureVisible: FeatureVisible.FOODHUB,
        icon_name: FONT_ICON.TOTAL_SAVINGS
    },
    {
        key: SCREEN_OPTIONS.ALLERGY_INFORMATION.route_name,
        name: LOCALIZATION_STRINGS.ALLERGY_INFORMATION,
        is_more: true,
        featureVisible: FeatureVisible.ALL,
        icon_name: FONT_ICON.ALLERGY_INFORMATION
    },
    {
        key: SCREEN_OPTIONS.TERMS_AND_CONDITIONS.route_name,
        name: LOCALIZATION_STRINGS.TERMS_AND_CONDITIONS,
        is_more: true,
        featureVisible: FeatureVisible.ALL,
        icon_name: FONT_ICON.TERMS_AND_CONDITIONS
    },
    {
        key: SCREEN_OPTIONS.TERMS_OF_USE.route_name,
        name: LOCALIZATION_STRINGS.TERMS_OF_USE,
        is_more: true,
        featureVisible: FeatureVisible.ALL,
        icon_name: FONT_ICON.TERMS_OF_USE
    },
    {
        key: SCREEN_OPTIONS.PRIVACY_POLICY.route_name,
        name: LOCALIZATION_STRINGS.PRIVACY_POLICY,
        is_more: true,
        featureVisible: FeatureVisible.ALL,
        icon_name: FONT_ICON.PRIVACY_POLICY
    },
    {
        key: SCREEN_OPTIONS.SUPPORT.route_name,
        is_more: false,
        featureVisible: FeatureVisible.ALL,
        name: LOCALIZATION_STRINGS.SUPPORT,
        icon_name: FONT_ICON.CALL
    }
];

export const FeatureVisible = {
    ALL: 'ALL',
    FOODHUB: 'FOODHUB',
    FRANCHISE: 'FRANCHISE',
    IS_NOT_CUSTOMER_APP: 'IS_NOT_CUSTOMER_APP',
    CUSTOMER_APP: 'CUSTOMER'
};
