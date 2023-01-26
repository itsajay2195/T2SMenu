import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import { isUKTakeaway } from 't2sbasemodule/Utils/helpers';
import { FILTER_TAKEAWAY_LIST } from './Constants';

export const sortBy = (isUkTakeaway) => {
    let sortList = [
        {
            id: '1',
            title: LOCALIZATION_STRINGS.DISTANCE_VALUE,
            key: 'Nearby'
        },
        {
            id: '2',
            title: LOCALIZATION_STRINGS.CUSTOMER_RATING,
            key: 'Rating'
        },
        {
            id: '3',
            title: LOCALIZATION_STRINGS.DELIVERY_TIME,
            key: 'Delivery_time'
        },
        {
            id: '4',
            title: LOCALIZATION_STRINGS.MINIMUM_ORDER,
            key: 'Minimum_order'
        },
        {
            id: '5',
            title: LOCALIZATION_STRINGS.DELIVERY_FEE,
            key: 'Delivery_fee'
        },
        {
            id: '6',
            title: LOCALIZATION_STRINGS.DISCOUNT,
            key: 'Discount'
        }
    ];

    let best_match = {
        id: '0',
        title: LOCALIZATION_STRINGS.BEST_MATCH,
        key: 'BestMatch'
    };

    return isUkTakeaway ? [best_match, ...sortList] : sortList;
};

export const handleSortByFilterTypeText = (key) => {
    let returnString;
    switch (key) {
        case 'BestMatch':
            returnString = LOCALIZATION_STRINGS.BEST_MATCH;
            break;
        case 'Nearby':
            returnString = LOCALIZATION_STRINGS.DISTANCE_VALUE;
            break;
        case 'Rating':
            returnString = LOCALIZATION_STRINGS.CUSTOMER_RATING;
            break;
        case 'Delivery_time':
            returnString = LOCALIZATION_STRINGS.DELIVERY_TIME;
            break;
        case 'Minimum_order':
            returnString = LOCALIZATION_STRINGS.MINIMUM_ORDER;
            break;
        case 'Delivery_fee':
            returnString = LOCALIZATION_STRINGS.DELIVERY_FEE;
            break;
        case 'Discount':
            returnString = LOCALIZATION_STRINGS.DISCOUNT;
            break;
        default:
            returnString = LOCALIZATION_STRINGS.DISTANCE_VALUE;
            break;
    }
    return returnString;
};

export const filterBy = (countryId) => {
    const hygineRating = isUKTakeaway(countryId)
        ? [
              {
                  id: '5',
                  title: LOCALIZATION_STRINGS.HYGIENE_RATING,
                  key: FILTER_TAKEAWAY_LIST.HYGIENE_RATING
              }
          ]
        : [];

    return [
        ...[
            {
                id: '1',
                title: LOCALIZATION_STRINGS.FOUR_STAR_ABOVE,
                key: FILTER_TAKEAWAY_LIST.FOUR_STAR_ABOVE
            },
            {
                id: '2',
                title: LOCALIZATION_STRINGS.LOW_DELIVERY_FEE,
                key: FILTER_TAKEAWAY_LIST.LOW_DELIVERY_FEE
            },
            {
                id: '3',
                title: LOCALIZATION_STRINGS.FREE_DELIVERY_TEXT,
                key: FILTER_TAKEAWAY_LIST.FREE_DELIVERY
            },
            {
                id: '4',
                title: LOCALIZATION_STRINGS.OFFER_TEXT,
                key: FILTER_TAKEAWAY_LIST.OFFER
            }
        ],
        ...hygineRating
    ];
};

export const offerBannerFilterList = [
    {
        id: 0,
        offer: 20,
        offerMax: 101,
        title: LOCALIZATION_STRINGS.formatString(LOCALIZATION_STRINGS.MINIMUM_OFFER, 20)
    },
    {
        id: 1,
        offer: 1,
        offerMax: 20,
        title: LOCALIZATION_STRINGS.formatString(LOCALIZATION_STRINGS.GET_UPTO_OFFER, 20)
    },
    {
        id: 2,
        offer: 1,
        offerMax: 15,
        title: LOCALIZATION_STRINGS.formatString(LOCALIZATION_STRINGS.GET_UPTO_OFFER, 15)
    },
    {
        id: 3,
        offer: 1,
        offerMax: 10,
        title: LOCALIZATION_STRINGS.formatString(LOCALIZATION_STRINGS.GET_UPTO_OFFER, 10)
    },
    {
        id: 4,
        offer: 1,
        offerMax: 5,
        title: LOCALIZATION_STRINGS.formatString(LOCALIZATION_STRINGS.GET_UPTO_OFFER, 5)
    }
];
