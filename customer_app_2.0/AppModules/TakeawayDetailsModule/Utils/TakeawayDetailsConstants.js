import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';

export const VIEW_ID = {
    RATED_PLACEHOLDER_VIEW: 'rated_rating_placeholder_view',
    RATING_REVIEW_VIEW: 'rating_review_view',
    RATING_PLACEHOLDER_VIEW: 'rating_placeholder_view',
    HEADING_VIEW: 'heading_view',
    BACKGROUND_IMAGE_TEXT: 'background_image_text',
    SHOW_IMAGE_GALLERY_MODEL_CLICK: 'show_image_gallery_model_click',
    CLOSE_IMAGE_GALLERY_MODEL_CLICK: 'close_image_gallery_model_click',
    SHOW_IMAGE_MODEL_IMAGE_CLICK: 'show_image_model_image_click',
    CLOSE_IMAGE_MODEL_CLICK: 'close_image_model_close_image_cLICK',
    SHOW_MODAL_IMAGE: 'show_modal_image',
    SHOW_MODAL_GALLERY_IMAGE: 'show_modal_gallery_image',
    SHOW_GALLERY_IMAGE: 'show_gallery_image',
    CALL_ICON: 'call_icon',
    INFORMATION_BODY_SCROLLVIEW: 'info_body_scrollview',
    DESCRIPTION: 'description',
    READ_MORE: 'read_more_button',
    READ_MORE_DOT: 'read_more_dot',
    MAP_LOCATION_TEXT: 'map_location_text',
    MAP_ADDRESS: 'map_address',
    HYGENIC_RATING_HOST_TEXT: 'hygenic_rating_host_text',
    HYGENIC_RATING_HOST_LINK_TEXT: 'hygenic_rating_host_link_text',
    HYGENIC_RATING_STATUS_TEXT: 'hygenic_rating_status_text',
    HYGENIC_RATING_IMAGE_: 'hygenic_rating_image_',
    CUISINE_SELECTED: 'cuisine_selected',
    CUISINE_NAME: 'cuisine_name',
    ABOUT_HEADING: 'about_heading',
    VIEW_MORE: 'view_more',
    OPEN_HOURS_HEADING: 'open_hours_heading',
    OPEN_HOURS_VIEW: 'open_hours_view',
    FOOD_HYGENIC_HEADING_VIEW: 'food_hygenic_heading_view',
    LAST_INSPECTION_HEADING_VIEW: 'last_inspection_heading_view',
    RATING_HEADING_VIEW: 'rating_heading_view'
};
export const IMAGE_VALUES = {
    IMAGE_COUNT: 4
};
export const SCREEN_NAME = {
    HYGENIC_RATING_WIDGET: 'hygenic_rating_widget',
    IMAGE_GALLERY_EXPANDING_MODEL: 'image_gallery_expanding_model',
    IMAGE_MODAL_VIEW: 'image_modal_view',
    GALLERY_MODAL_VIEW: 'gallery_modal_view',
    INFORMATION: 'TAKEAWAY INFORMATION',
    CUISINES: 'cuisines_modal_view'
};

export const RATING_VALUES = () => [
    {
        id: 0,
        review: LOCALIZATION_STRINGS.URGENT_IMPROVEMENT_NECESSARY
    },
    {
        id: 1,
        review: LOCALIZATION_STRINGS.MAJOR_IMPROVEMENT_NECESSARY
    },
    {
        id: 2,
        review: LOCALIZATION_STRINGS.IMPROVEMENT_NECESSARY
    },
    {
        id: 3,
        review: LOCALIZATION_STRINGS.SATISFACTORY
    },
    {
        id: 4,
        review: LOCALIZATION_STRINGS.GOOD
    },
    {
        id: 5,
        review: LOCALIZATION_STRINGS.VERY_GOOD
    }
];

export const HYGIENE_RATING_STATUS_COMPLETED = 'Completed';
export const SCHEME = {
    SCHEME_TYPE_FHIS: 'FHIS',
    SCHEME_TYPE_FHRS: 'FHRS'
};

export const MAX_RATING_VALUE = 5;
export const AVG_RATING_VALUE = 3;
export const MAX_LINE_COUNT = 2;
export const DEFAULT_LINE_COUNT = 0;

export const MAP_URL_CONSTANTS = {
    IOS_SCHEME_1: 'comgooglemapsurl://maps.google.com/maps?f=d&views=traffic&daddr=',
    IOS_SCHEME_2: '&sspn=0.2,0.1&nav=1',
    ANDROID_SCHEME_1: 'https://www.google.com/maps/dir/?api=1&destination=',
    ANDROID_SCHEME_2: '&travelmode=driving&dir_action=navigate',
    APPLE_MAPS_SCHEME: 'maps:0,0?q=',
    CHECK_GOOGLE_MAPS_SCHEME: 'comgooglemaps://'
};
