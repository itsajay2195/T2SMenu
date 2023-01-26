export const T2SConfig = {
    currencyName: {
        POUND: 'pound',
        EURO: 'euro',
        DOLLAR: 'dollar',
        DINAR: 'dinar',
        RUPEES: 'rupees',
        VATU: 'vatu'
    },
    country: {
        UK: 1,
        IRE: 2,
        AUS: 3,
        NZ: 4,
        US: 7,
        CA: 10,
        IN: 11
    },
    TAX_TEXT: {
        UK: 'VAT',
        IRE: 'VAT',
        AUS: 'GST',
        NZ: 'GST'
    },
    supportNumber: {
        UK: '+441782444282',
        IRE: '+35315682849',
        AUS: '+610285034155',
        NZ: '+64800767027'
    },
    default: {
        timeZone: 'Europe/London',
        locale: 'united kingdom',
        country: 'UK',
        name: 'United Kingdom',
        countryID: 1,
        currency: '£',
        iso: 'GBP',
        postcodeRegex: {
            UK: '^[a-zA-Z0-9\\s]{2,45}$',
            IRE: '^[a-zA-Z0-9\\s]{2,15}$',
            AUS_NZ: '^[0-9]{4}$'
        },
        postcodeKeyboard: {
            UK_IRE: 'default',
            AUS_NZ: 'numeric'
        },
        phoneRegex: {
            UK: '^0[1-9]{1}[0-9]{8,12}$',
            IRE: '^0[1-9]{1}[0-9]{8,12}$',
            AUS_NZ: '^(\\\\+?\\\\(61\\\\)|\\\\(\\\\+?61\\\\)|\\\\+?61|\\\\(0[1-9]\\\\)|0[1-9])?([0-9]){7,9}$'
        },
        postcodeLength: {
            UK: '45',
            IRE: '45',
            AUS_NZ: '45'
        },
        phoneLength: {
            UK: '14',
            IRE: '14',
            AUS_NZ: '11'
        },
        lat_long: {
            NZ_LAT: -43.6459825,
            NZ_LONG: 172.4571288,
            UK_LAT: 54.8079758,
            UK_LONG: -2.7743362,
            IRE_LAT: 53.2720087,
            IRE_LONG: -7.5076596,
            AUS_LAT: -37.8090491,
            AUS_LONG: 144.9690771
        },
        location: {
            NZ: 'Ellesmere Junction Road, Lincoln 7674, New Zealand',
            UK: 'Brackenrigg, Armathwaite, Carlisle CA4 9PX, UK',
            IRE: 'Charleville View, Kilcruttin, Tullamore, Co. Offaly, R35 HH32, Ireland',
            AUS: 'Little Lonsdale St, Melbourne VIC 3000, Australia'
        }
    },
    clientType: {
        BIGFOODIE: 'BIGFOODIE',
        FOODHUB: 'FOODHUB'
    },
    maxPostCode: {
        UK: 8,
        IRE: 25,
        AUS_NZ: 4,
        US: 10
    },
    website_url: {
        UK: 'foodhub.co.uk',
        US: 'foodhub.com',
        IRE: 'food-hub.ie',
        AUS: 'foodhub.com.au',
        NZ: 'food-hub.nz'
    }
};
