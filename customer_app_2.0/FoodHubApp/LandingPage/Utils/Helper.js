import { isArrayNonEmpty } from 't2sbasemodule/Utils/helpers';

export const getCountryList = (countryList) => {
    if (isArrayNonEmpty(countryList?.data)) {
        return countryList.data;
    } else {
        return COUNTRY_DATA.data;
    }
};

export const getCountryById = (countryList, countryId) => {
    const countries = getCountryList(countryList);
    const coutry = countries.filter((data) => data?.id === countryId);
    return coutry?.length >= 0 ? coutry[0] : null;
};

//TODO: GET HOST FROM API IN  COUNTRY LIST ENDPOINT
export const COUNTRY_DATA = {
    data: [
        {
            id: 1,
            name: 'United Kingdom',
            flag: 'gb',
            short_name: 'UK',
            iso: 'GB',
            host: 'foodhub.co.uk',
            sit_host: 'sit-franchise-foodhub-uk.stage.t2sonline.com',
            preprod_host: 'preprod-franchise-foodhub-uk.t2sonline.com'
        },
        {
            id: 2,
            name: 'Ireland',
            flag: 'ie',
            short_name: 'IRE',
            iso: 'IE',
            host: 'food-hub.ie',
            sit_host: 'sit-franchise-foodhub-ire.stage.t2sonline.com',
            preprod_host: 'preprod-franchise-foodhub-ire.t2sonline.com'
        },
        {
            id: 3,
            name: 'Australia',
            flag: 'au',
            short_name: 'AUS',
            iso: 'AU',
            host: 'foodhub.com.au',
            sit_host: 'sit-franchise-foodhub-aus.stage.t2sonline.com',
            preprod_host: 'preprod-franchise-foodhub-aus.t2sonline.com'
        },
        {
            id: 4,
            name: 'New Zealand',
            flag: 'nz',
            short_name: 'NZ',
            iso: 'NZ',
            host: 'food-hub.nz',
            sit_host: 'sit-franchise-foodhub-nz.stage.t2sonline.com',
            preprod_host: 'preprod-franchise-foodhub-nz.t2sonline.com'
        },
        {
            id: 7,
            name: 'United States',
            flag: 'us',
            short_name: 'USA',
            iso: 'US',
            host: 'foodhub.com',
            sit_host: 'sit-franchise-foodhub-usa.stage.t2sonline.com',
            preprod_host: 'preprod-franchise-foodhub-usa.t2sonline.com'
        }
        // {
        //     id: 8,
        //     name: 'Mexico',
        //     flag: 'mx',
        //     short_name: 'MX',
        //     iso: 'MX',
        //     host: 'foodhub.com.mx',
        //     sit_host: 'sit-franchise-foodhub-mx.stage.t2sonline.com',
        //     preprod_host: 'preprod-franchise-foodhub-mx.t2sonline.com'
        // },
        // {
        //     id: 9,
        //     name: 'Guatemala',
        //     flag: 'gt',
        //     short_name: 'GT',
        //     iso: 'GT',
        //     host: 'foodhub.gt',
        //     sit_host: 'sit-franchise-foodhub-gt.stage.t2sonline.com',
        //     preprod_host: 'preprod-franchise-foodhub-gt.t2sonline.com'
        // }
        // {
        //     id: 13,
        //     name: 'Canada',
        //     flag: 'ca',
        //     short_name: 'CA',
        //     iso: 'CA'
        // },
        // {
        //     id: 15,
        //     name: 'India',
        //     flag: 'in',
        //     short_name: 'IN',
        //     iso: 'IN'
        // },
        // {
        //     id: 107,
        //     name: 'Grenada',
        //     flag: 'gd',
        //     short_name: 'GRD',
        //     iso: 'GD'
        // },
        // {
        //     id: 171,
        //     name: 'Nigeria',
        //     flag: 'ng',
        //     short_name: 'NGA',
        //     iso: 'NG'
        // }
    ]
};
