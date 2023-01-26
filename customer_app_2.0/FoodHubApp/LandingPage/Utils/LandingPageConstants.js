import { AppConfig } from '../../../CustomerApp/Utils/AppConfig';

export const COUNTRY_CONFIG = {
    au: {
        api_version: AppConfig.API_VERSION,
        country: {
            id: 3,
            name: 'Australia',
            code: 36,
            iso: 'AU',
            syncInitialConfig: 0,
            alias: 'australia'
        },
        currency: {
            id: 7,
            value: 6,
            name: 'AU Dollar',
            symbol: '$',
            iso: 'AUD'
        },
        post_code: {
            fusion_reg_ex: '[0-9]{4}$',
            reg_ex: '[a-zA-Z0-9]{2,45}$',
            min_length: '2',
            max_length: '45',
            message: 'The :attribute format is invalid',
            available: true,
            name: 'Postcode'
        },
        mobile: {
            reg_ex: '(^(\\+?[6][1][1-9]{1}))(\\d{7,10}$)|(^(0([1-9]{1})))(\\d{7,10}$)',
            min_length: '9',
            max_length: '15',
            message: 'Valid mobile number required for :attribute'
        },
        phone: {
            reg_ex: '(^(\\+?[6][1][1-9]{1}))(\\d{7,10}$)|(^(0([1-9]{1})))(\\d{7,10}$)',
            min_length: '9',
            max_length: '15',
            message: 'Valid phone number required for :attribute'
        },
        house_number: {
            name: 'House/Door No',
            available: true,
            min_length: '1',
            max_length: '100',
            reg_ex: '^(?!0+$)(?!0.0+$)([0-9a-zA-Z ]{1,}$|[0-9a-zA-Z]{1}[0-9a-zA-Z -.,&:_\\/]{0,}[0-9a-zA-Z]{1}$)',
            message: 'The :attribute format is invalid'
        },
        flat: {
            name: 'Apartment',
            available: true,
            min_length: '0',
            max_length: '100',
            reg_ex: '^[a-zA-Z0-9 -.,&:_\\/]+$',
            message: 'The :attribute format is invalid'
        },
        address_line1: {
            name: 'Street',
            available: true,
            min_length: '1',
            max_length: '100',
            reg_ex: '^[a-zA-Z0-9 -.,&:_\\/]+$',
            message: 'The :attribute format is invalid'
        },
        address_line2: {
            name: 'City',
            available: true,
            min_length: '1',
            max_length: '100',
            reg_ex: '^[a-zA-Z0-9 -.,&:_\\/]+$',
            message: 'The :attribute format is invalid'
        },
        area: {
            name: 'State',
            available: true,
            min_length: '1',
            max_length: '100',
            reg_ex: '^[a-zA-Z0-9 -.,&:_\\/]+$',
            message: 'The :attribute format is invalid'
        },
        map: {
            latitude: '-26.1772288',
            longitude: '133.4170119',
            zoom_level: '3',
            available: true
        },
        search: {
            name: 'Enter Your Area',
            type: 'address',
            min_length: '3',
            max_length: '100',
            reg_ex: '^[a-zA-Z0-9 -.,&:_\\/]+$',
            message: 'The :attribute format is invalid'
        },
        analytics: {
            gtm: 'GTM-MMZL693',
            google_verification: 'IAhRT9SEADpDm13vRrMODGzX19zsAEwmm04xOZrYgos'
        },
        config: {
            host: 'foodhub.co.uk',
            franchise: {
                id: 2465,
                store_id: 794891
            }
        }
        //TODO have to be configurable
    },
    ie: {
        api_version: AppConfig.API_VERSION,
        country: { id: 2, name: 'Ireland', code: 372, iso: 'IE', syncInitialConfig: 0, alias: 'ireland' },
        currency: { id: 1, value: 0, name: 'Euro', symbol: '\u20ac', iso: 'EUR' },
        post_code: {
            fusion_reg_ex:
                '([a-z]{1}[a-y]{0,1}[0-9]{1,2})([ ]{0,})([0-9]{1}[a-z]{2}$)|([a-z]{1}[0-9]{1}[a-w]{1})([ ]{0,})([0-9]{1}[a-z]{2}$)|([a-z]{1}[a-y][0-9]{1}[a-y])([ ]{0,})([0-9]{1}[a-z]{2}$)|((gir)([ ]{0,})(0aa)$)|((bfpo)([ ]{0,})[0-9]{1,4}$)|((bfpo)([ ]{0,})(c/o([ ]{0,})[0-9]{1,3})$)|(([a-z]{4})([ ]{0,})(1zz)$)',
            reg_ex: '[a-zA-Z0-9 ]{2,45}$',
            min_length: '2',
            max_length: '45',
            message: 'The :attribute format is invalid',
            available: true,
            name: 'Postcode'
        },
        mobile: { reg_ex: '^0[1-9]{1}[0-9]{8,12}$', min_length: 10, max_length: 14, message: 'Valid phone number required for :attribute' },
        phone: { reg_ex: '^0[1-9]{1}[0-9]{8,12}$', min_length: 10, max_length: 14, message: 'Valid phone number required for :attribute' },
        house_number: {
            name: 'House/Door No',
            available: true,
            min_length: '1',
            max_length: '100',
            reg_ex: '^(?!0+$)(?!0.0+$)([0-9a-zA-Z ]{1,}$|[0-9a-zA-Z]{1}[0-9a-zA-Z -.,&:_\\/]{0,}[0-9a-zA-Z]{1}$)',
            message: 'The :attribute format is invalid'
        },
        flat: {
            name: 'Apartment',
            available: true,
            min_length: '0',
            max_length: '100',
            reg_ex: '^[a-zA-Z0-9 -.,&:_\\/]+$',
            message: 'The :attribute format is invalid'
        },
        address_line1: {
            name: 'Street',
            available: true,
            min_length: '1',
            max_length: '100',
            reg_ex: '^[a-zA-Z0-9 -.,&:_\\/]+$',
            message: 'The :attribute format is invalid'
        },
        address_line2: {
            name: 'City',
            available: true,
            min_length: '1',
            max_length: '100',
            reg_ex: '^[a-zA-Z0-9 -.,&:_\\/]+$',
            message: 'The :attribute format is invalid'
        },
        area: {
            name: 'State',
            available: true,
            min_length: '1',
            max_length: '100',
            reg_ex: '^[a-zA-Z0-9 -.,&:_\\/]+$',
            message: 'The :attribute format is invalid'
        },
        map: { latitude: '37.09024', longitude: '-95.712891', zoom_level: '3', available: true },
        search: {
            name: 'Enter Your Area',
            type: 'address',
            min_length: '3',
            max_length: '100',
            reg_ex: '^[a-zA-Z0-9 -.,&:_\\/]+$',
            message: 'The :attribute format is invalid'
        },
        analytics: { gtm: 'GTM-TN6PN2F', google_verification: 'E2Nl-4v-UTE5b_STk4h7PIi636M2n6mZ42u3OFwVelI' }
    },
    nz: {
        api_version: AppConfig.API_VERSION,
        country: { id: 4, name: 'New Zealand', code: 554, iso: 'NZ', syncInitialConfig: 0, alias: 'new zealand' },
        currency: { id: 8, value: 7, name: 'NZ Dollar', symbol: '$', iso: 'NZD' },
        post_code: {
            fusion_reg_ex: '[0-9]{4}$',
            reg_ex: '[a-zA-Z0-9 ]{2,45}$',
            min_length: '2',
            max_length: '45',
            message: 'The :attribute format is invalid',
            available: true,
            name: 'Postcode'
        },
        mobile: {
            reg_ex: '(^(\\+?[6][4][1-9]{1}))(\\d{7,11}$)|(^(0([1-9]{1})))(\\d{7,11}$)',
            min_length: '9',
            max_length: '12',
            message: 'Valid mobile number required for :attribute'
        },
        phone: {
            reg_ex: '(^(\\+?[6][4][1-9]{1}))(\\d{7,11}$)|(^(0([1-9]{1})))(\\d{7,11}$)',
            min_length: '9',
            max_length: '12',
            message: 'Valid phone number required for :attribute'
        },
        house_number: {
            name: 'House/Door No',
            available: true,
            min_length: '1',
            max_length: '100',
            reg_ex: '^(?!0+$)(?!0.0+$)([0-9a-zA-Z ]{1,}$|[0-9a-zA-Z]{1}[0-9a-zA-Z -.,&:_\\/]{0,}[0-9a-zA-Z]{1}$)',
            message: 'The :attribute format is invalid'
        },
        flat: {
            name: 'Apartment',
            available: true,
            min_length: '0',
            max_length: '100',
            reg_ex: '^[a-zA-Z0-9 -.,&:_\\/]+$',
            message: 'The :attribute format is invalid'
        },
        address_line1: {
            name: 'Street',
            available: true,
            min_length: '1',
            max_length: '100',
            reg_ex: '^[a-zA-Z0-9 -.,&:_\\/]+$',
            message: 'The :attribute format is invalid'
        },
        address_line2: {
            name: 'City',
            available: true,
            min_length: '1',
            max_length: '100',
            reg_ex: '^[a-zA-Z0-9 -.,&:_\\/]+$',
            message: 'The :attribute format is invalid'
        },
        area: {
            name: 'State',
            available: true,
            min_length: '1',
            max_length: '100',
            reg_ex: '^[a-zA-Z0-9 -.,&:_\\/]+$',
            message: 'The :attribute format is invalid'
        },
        map: { latitude: '-42.6656729', longitude: '172.4344171', zoom_level: '5', available: true },
        search: {
            name: 'Enter Your Area',
            type: 'address',
            min_length: '3',
            max_length: '100',
            reg_ex: '^[a-zA-Z0-9 -.,&:_\\/]+$',
            message: 'The :attribute format is invalid'
        },
        analytics: { gtm: 'GTM-N27V3G9', google_verification: 'KjXqlEzHGxNErbajFhgiYObPDR54hle_ON4ThsC7MZc' }
    },
    gb: {
        api_version: AppConfig.API_VERSION,
        country: { id: 1, name: 'United Kingdom', code: 826, iso: 'GB', syncInitialConfig: 0, alias: 'united kingdom' },
        currency: { id: 2, value: 1, name: 'Pound', symbol: '\u00a3', iso: 'GBP' },
        post_code: {
            fusion_reg_ex:
                '([a-z]{1}[a-y]{0,1}[0-9]{1,2})([ ]{0,})([0-9]{1}[a-z]{2}$)|([a-z]{1}[0-9]{1}[a-w]{1})([ ]{0,})([0-9]{1}[a-z]{2}$)|([a-z]{1}[a-y][0-9]{1}[a-y])([ ]{0,})([0-9]{1}[a-z]{2}$)|((gir)([ ]{0,})(0aa)$)|((bfpo)([ ]{0,})[0-9]{1,4}$)|((bfpo)([ ]{0,})(c/o([ ]{0,})[0-9]{1,3})$)|(([a-z]{4})([ ]{0,})(1zz)$)',
            reg_ex: '[a-zA-Z0-9 ]{2,45}$',
            min_length: '2',
            max_length: '45',
            message: 'The :attribute format is invalid',
            available: true,
            name: 'Postcode'
        },
        mobile: {
            reg_ex: '^0[7|8|9]{1}[0-9]{8,9}$',
            min_length: 10,
            max_length: 11,
            message: 'Valid mobile number required for :attribute'
        },
        phone: { reg_ex: '^0[1-9]{1}[0-9]{8,12}$', min_length: 10, max_length: 14, message: 'Valid phone number required for :attribute' },
        search: {
            name: 'Enter your Postcode',
            type: 'postcode',
            min_length: '3',
            max_length: '100',
            reg_ex: '^[a-zA-Z0-9 -.,&:_\\/]+$',
            message: 'The :attribute format is invalid'
        },
        house_number: {
            name: 'House/Door No.',
            available: true,
            min_length: '1',
            max_length: '100',
            reg_ex: '^(?!0+$)(?!0.0+$)([0-9a-zA-Z ]{1,}$|[0-9a-zA-Z]{1}[0-9a-zA-Z -.,&:_\\/]{0,}[0-9a-zA-Z]{1}$)',
            message: 'The :attribute format is invalid'
        },
        flat: {
            name: 'Flat',
            available: true,
            min_length: '0',
            max_length: '100',
            reg_ex: '^[a-zA-Z0-9 -.,&:_\\/]+$',
            message: 'The :attribute format is invalid'
        },
        address_line1: {
            name: 'Address',
            available: true,
            min_length: '1',
            max_length: '100',
            reg_ex: '^[a-zA-Z0-9 -.,&:_\\/]+$',
            message: 'The :attribute format is invalid'
        },
        address_line2: {
            name: 'City',
            available: true,
            min_length: '1',
            max_length: '100',
            reg_ex: '^[a-zA-Z0-9 -.,&:_\\/]+$',
            message: 'The :attribute format is invalid'
        },
        area: {
            name: 'State',
            available: false,
            min_length: '1',
            max_length: '100',
            reg_ex: '^[a-zA-Z0-9 -.,&:_\\/]+$',
            message: 'The :attribute format is invalid'
        },
        map: { latitude: '53.062790', longitude: '-2.202990', zoom_level: '3', available: false },
        analytics: {
            gtm: 'GTM-PCWKKR4',
            google_verification: 'DgERHjaK4YhLxHjID_RXdGuyVXwTHis6PA-DqDxQvik',
            facebook_pixel: '449874532221917'
        },
        social_media: {
            facebook: 'https://www.facebook.com/Foodhub.co.uk/',
            twitter: 'https://twitter.com/FoodhubUK',
            youtube: 'https://www.youtube.com/channel/UC12E2pidPaspN8tWTvaRs-A',
            instagram: 'https://www.instagram.com/foodhub.co.uk/'
        }
    },
    us: {
        api_version: AppConfig.API_VERSION,
        country: { id: 7, name: 'United States', code: 840, iso: 'US', syncInitialConfig: 0, alias: 'united states' },
        currency: { id: 4, value: 3, name: 'US Dollar', symbol: '$', iso: 'USD' },
        post_code: {
            fusion_reg_ex: '[0-9]{5}(-[0-9]{4})?$',
            reg_ex: '[0-9]{5}(-[0-9]{4})?$',
            min_length: '5',
            max_length: '10',
            message: 'The :attribute format is invalid',
            available: true,
            name: 'Zip Code'
        },
        mobile: {
            reg_ex: '^(0?1[- ]?)?(([0-9]{3})[- ]?([0-9]{3})[- ]?([0-9]{4}))$',
            min_length: 10,
            max_length: 17,
            message: 'Valid mobile number required for :attribute'
        },
        phone: {
            reg_ex: '^(0?1[- ]?)?(([0-9]{3})[- ]?([0-9]{3})[- ]?([0-9]{4}))$',
            min_length: 10,
            max_length: 17,
            message: 'Valid phone number required for :attribute'
        },
        search: {
            name: 'Enter Your Area.',
            type: 'address',
            min_length: '3',
            max_length: '100',
            reg_ex: '^[a-zA-Z0-9 -.,&:_\\/]+$',
            message: 'The :attribute format is invalid'
        },
        house_number: {
            name: 'House/Door No',
            available: true,
            min_length: '1',
            max_length: '100',
            reg_ex: '^(?!0+$)(?!0.0+$)([0-9a-zA-Z ]{1,}$|[0-9a-zA-Z]{1}[0-9a-zA-Z -.,&:_\\/]{0,}[0-9a-zA-Z]{1}$)',
            message: 'The :attribute format is invalid'
        },
        flat: {
            name: 'Apartment',
            available: true,
            min_length: '0',
            max_length: '100',
            reg_ex: '^[a-zA-Z0-9 -.,&:_\\/]+$',
            message: 'The :attribute format is invalid'
        },
        address_line1: {
            name: 'Street',
            available: true,
            min_length: '1',
            max_length: '100',
            reg_ex: '^[a-zA-Z0-9 -.,&:_\\/]+$',
            message: 'The :attribute format is invalid'
        },
        address_line2: {
            name: 'City',
            available: true,
            min_length: '1',
            max_length: '100',
            reg_ex: '^[a-zA-Z0-9 -.,&:_\\/]+$',
            message: 'The :attribute format is invalid'
        },
        area: {
            name: 'State',
            available: true,
            min_length: '1',
            max_length: '100',
            reg_ex: '^[a-zA-Z0-9 -.,&:_\\/]+$',
            message: 'The :attribute format is invalid'
        },
        map: { latitude: '37.09024', longitude: '-95.712891', zoom_level: '3', available: true },
        analytics: { gtm: 'GTM-MMSS5FQ', google_verification: 'qylkYFLBKscA0idK2nYC1U7apvMyJhgoOKzEMx39E6Y' },
        social_media: {
            facebook: 'https://www.facebook.com/FoodhubUS',
            twitter: 'https://twitter.com/FoodhubU',
            youtube: 'https://www.youtube.com/channel/UC12E2pidPaspN8tWTvaRs-A',
            instagram: 'https://www.instagram.com/foodhub.usa/'
        }
    },
    ca: {
        api_version: AppConfig.API_VERSION,
        address_search: 'street',
        country: {
            id: 5,
            name: 'Canada',
            code: 124,
            iso: 'CA',
            syncInitialConfig: 0,
            alias: 'canada',
            flag: 'ca',
            tax_type: 'EXCLUDED',
            customer_care_number: '',
            phone_number_starts_with: null,
            short_name: 'CA',
            distance_type: 'miles',
            phone_code: 1,
            tax_label: 'VAT',
            distance_label: 'mi'
        },
        currency: {
            id: 6,
            value: 5,
            name: 'CA Dollar',
            symbol: '$',
            iso: 'CAD',
            currency_unit: 'cents'
        },
        self_signup: [
            {
                id: '2595',
                name: 'ULTIMATE MYPOS',
                setupFee: '99',
                weeklyFee: '7',
                setupFeeDML: '150.00',
                weeklyFeeDML: '13',
                description:
                    "<div><h5 class='small strong'>Ultimate Android MYPOS</h5><p>A cost-effective Android POS system that streamlines your operations. Manage online orders easily with real time order tracking and integrated printer.</p><p class='small'><span>Set Up Fee : $99</span></p><p class='small'><span>Weekly Rental : $7</span></p><p>3rd Party Payment Processing Fee (per transaction):  3.4% + 20c</p><ul class='planlists'><li><span>Full order & delivery management by app or web</span></li><li><span>3rd Party Integration for Payment Processing**</span></li><li><span>Dedicated 24/7 Phone Support</span></li><li><span>On-demand delivery***</span></li><li><span>Foodhub Marketplace listing</span></li><li><span>8 weeks free trial period</span></li></ul></div>"
            }
        ],
        datman: {
            support: 'https://support.datman.je/portal/en/home',
            mail: 'info@datman.je',
            phone: '03330165548'
        },
        post_code: {
            fusion_reg_ex: '[0-9]{5}(-[0-9]{4})?$',
            reg_ex: '[0-9]{5}(-[0-9]{4})?$',
            min_length: '5',
            max_length: '10',
            message: 'The :attribute format is invalid',
            available: true,
            name: 'Zip Code',
            keyboard: 'NUMERIC'
        },
        mobile: {
            reg_ex: '^(0?1[- ]?)?(([0-9]{3})[- ]?([0-9]{3})[- ]?([0-9]{4}))$',
            min_length: 10,
            max_length: 17,
            message: 'Valid mobile number required for :attribute'
        },
        phone: {
            reg_ex: '^(0?1[- ]?)?(([0-9]{3})[- ]?([0-9]{3})[- ]?([0-9]{4}))$',
            min_length: 10,
            max_length: 17,
            message: 'Valid phone number required for :attribute'
        },
        search: {
            name: 'Enter Your Area',
            type: 'address',
            min_length: '3',
            max_length: '100',
            reg_ex: '^[a-zA-Z0-9 -.,&:_/]+$',
            message: 'The :attribute format is invalid'
        },
        house_number: {
            name: 'House/Door No',
            available: true,
            min_length: '1',
            max_length: '100',
            reg_ex: '^(?!0+$)(?!0.0+$)([0-9a-zA-Z ]{1,}$|[0-9a-zA-Z]{1}[0-9a-zA-Z -.,&:_\\/]{0,}[0-9a-zA-Z]{1}$)',
            message: 'The :attribute format is invalid'
        },
        flat: {
            name: 'Apartment',
            available: true,
            min_length: '0',
            max_length: '100',
            reg_ex: '^[a-zA-Z0-9 -.,&:_/]+$',
            message: 'The :attribute format is invalid'
        },
        address_line1: {
            name: 'Street',
            available: true,
            min_length: '1',
            max_length: '100',
            reg_ex: '^[a-zA-Z0-9 -.,&:_/]+$',
            message: 'The :attribute format is invalid'
        },
        address_line2: {
            name: 'City',
            available: true,
            min_length: '1',
            max_length: '100',
            reg_ex: '^[a-zA-Z0-9 -.,&:_/]+$',
            message: 'The :attribute format is invalid'
        },
        area: {
            name: 'Area',
            available: true,
            min_length: '1',
            max_length: '100',
            reg_ex: '^[a-zA-Z0-9 -.,&:_/]+$',
            message: 'The :attribute format is invalid'
        },
        map: {
            latitude: '0',
            longitude: '0',
            zoom_level: '3',
            available: true
        },
        analytics: {
            gtm: '',
            google_verification: '',
            facebook_pixel: ''
        },
        social_media: {
            facebook: 'https://www.facebook.com/FoodhubUS',
            twitter: 'https://twitter.com/FoodhubU',
            youtube: 'https://www.youtube.com/channel/UC12E2pidPaspN8tWTvaRs-A',
            instagram: 'https://www.instagram.com/foodhub.usa/'
        },
        address_template: {
            format: 'No : <house_number>,\r\n<address_line1>,\r\n<address_line2>,\r\n<area>,\r\n,\r\n<country> - <post_code>'
        },
        language: {
            default: {
                name: 'English (UK)',
                code: 'en-gb',
                default: true,
                title: 'English (UK)'
            },
            options: []
        },
        ms_date_format: {
            long_format: {
                date: 'd/m/Y',
                time: 'HH:i:ss',
                date_time: 'd/M/Y h:i:s A'
            },
            short_format: {
                date: 'd/m/Y',
                time: 'HH:i:s',
                date_time: 'd/m/Y HH:i:s'
            }
        },
        date_format: {
            long_format: {
                date: 'DD/MM/YYYY',
                time: 'H:mm:ss',
                date_time: 'DD/MM/YYYY H:mm:ss'
            },
            short_format: {
                date: 'DD/MM/YY',
                time: 'hh:mm:ss A',
                date_time: 'DD/MM/YY hh:mm:ss A'
            }
        },
        municipality: {
            name: 'Municipality',
            available: true,
            min_length: '1',
            max_length: '100',
            reg_ex: '^[a-zA-Z0-9 -.,&:_/]+$',
            message: 'The :attribute format is invalid'
        },
        neighborhood: {
            name: 'State',
            available: true,
            min_length: '1',
            max_length: '100',
            reg_ex: '^[a-zA-Z0-9 -.,&:_/]+$',
            message: 'The :attribute format is invalid'
        },
        client_projects: {
            'MY-TAKEAWAY': {
                coupon_avilable: ['ALL']
            }
        },
        fallback: null,
        product_id: 4
    },
    in: {
        api_version: AppConfig.API_VERSION,
        address_search: 'street',
        country: {
            id: 15,
            name: 'India',
            code: 356,
            iso: 'IN',
            syncInitialConfig: 0,
            alias: 'india',
            flag: 'in',
            tax_type: 'EXCLUDED',
            customer_care_number: '',
            phone_number_starts_with: '',
            short_name: 'IN',
            distance_type: 'kms',
            phone_code: 91,
            tax_label: 'GST',
            distance_label: 'km'
        },
        currency: {
            id: 3,
            value: 2,
            name: 'Rupee',
            symbol: '₹',
            iso: 'INR',
            currency_unit: 'paise'
        },
        phone: {
            reg_ex: '^[9][1][6-9]{1}[0-9]{9}$',
            min_length: 10,
            max_length: 10,
            message: 'Valid phone number required for :attribute'
        },
        mobile: {
            reg_ex: '^[9][1][6-9]{1}[0-9]{9}$',
            min_length: 10,
            max_length: 10,
            message: 'Valid mobile number required for :attribute'
        },
        post_code: {
            fusion_reg_ex: '^[1-9]{1}[0-9]{5}$',
            reg_ex: '^[1-9]{1}[0-9]{5}$',
            min_length: '6',
            max_length: '6',
            message: 'The :attribute format is invalid',
            available: true,
            name: 'Pin code',
            keyboard: 'NUMERIC'
        },
        address_line1: {
            name: 'address_line1',
            available: true,
            min_length: '1',
            max_length: '100',
            reg_ex: '^[a-zA-Z0-9 -.,&:_\\/]+$',
            message: 'The :attribute format is invalid'
        },
        address_line2: {
            name: 'Town',
            available: true,
            min_length: '1',
            max_length: '100',
            reg_ex: '^[a-zA-Z0-9 -.,&:_\\/]+$',
            message: 'The :attribute format is invalid'
        },
        analytics: {
            gtm: '',
            google_verification: ''
        },
        area: {
            name: 'State',
            available: true,
            min_length: '1',
            max_length: '100',
            reg_ex: '^[a-zA-Z0-9 -.,&:_\\/]+$',
            message: 'The :attribute format is invalid'
        },
        flat: {
            name: 'Street no.',
            available: true,
            min_length: '0',
            max_length: '100',
            reg_ex: '^[a-zA-Z0-9 -.,&:_\\/]+$',
            message: 'The :attribute format is invalid'
        },
        house_number: {
            name: 'House no.',
            available: true,
            min_length: '1',
            max_length: '100',
            reg_ex: '^(?!0+$)(?!0.0+$)([0-9a-zA-Z ]{1,}$|[0-9a-zA-Z]{1}[0-9a-zA-Z -.,&:_/]{0,}[0-9a-zA-Z]{1}$)',
            message: 'The :attribute format is invalid'
        },
        language: {
            default: {
                name: 'English (India)',
                code: 'en-in',
                default: true,
                title: 'English (India)'
            },
            options: [
                {
                    name: 'भारत',
                    code: 'hi-in',
                    title: 'Hindi (India)'
                },
                {
                    name: 'Kannada (India)',
                    code: 'kn-in',
                    title: 'Kannada (India)'
                },
                {
                    name: 'Malayalam (India)',
                    code: 'ml-in',
                    title: 'Malayalam (India)'
                },
                {
                    name: 'தமிழ்',
                    code: 'ta-in',
                    title: 'Tamil (India)'
                },
                {
                    name: 'Telugu (India)',
                    code: 'te-in',
                    title: 'Telugu (India)'
                }
            ]
        },
        map: {
            latitude: '13.0243823',
            longitude: '80.1772356',
            zoom_level: '3',
            available: true
        },
        search: {
            name: 'Enter Your Area',
            type: 'address',
            min_length: '3',
            max_length: '100',
            reg_ex: '^[a-zA-Z0-9 -.,&:_\\/]+$',
            message: 'The :attribute format is invalid'
        },
        datman: {
            support: 'https://support.datman.je/portal/en/home',
            mail: 'info@datman.je',
            phone: '03330165548'
        },
        social_media: {
            facebook: 'https://www.facebook.com/FoodhubUS',
            twitter: 'https://twitter.com/FoodhubU',
            youtube: 'https://www.youtube.com/channel/UC12E2pidPaspN8tWTvaRs-A',
            instagram: 'https://www.instagram.com/foodhub.usa/'
        },
        address_template: {
            format: '<house_number><flat><address_line1><address_line2><district><country><post_code>'
        },
        date_format: {
            long_format: {
                date: 'DD/MM/YYYY',
                time: 'H:mm:ss',
                date_time: 'DD/MM/YYYY H:mm:ss'
            },
            short_format: {
                date: 'DD/MM/YY',
                time: 'hh:mm:ss A',
                date_time: 'DD/MM/YY hh:mm:ss A'
            }
        },
        ms_date_format: {
            long_format: {
                date: 'd-M-Y',
                time: 'HH:i:ss',
                date_time: 'd/M/Y h:i:s A'
            },
            short_format: {
                date: 'd/m/Y',
                time: 'HH:i:s',
                date_time: 'd/m/Y HH:i:s'
            }
        },
        municipality: {
            name: 'Municipality',
            available: true,
            min_length: '1',
            max_length: '100',
            reg_ex: '^[a-zA-Z0-9 -.,&:_/]+$',
            message: 'The :attribute format is invalid'
        },
        neighborhood: {
            name: 'State',
            available: true,
            min_length: '1',
            max_length: '100',
            reg_ex: '^[a-zA-Z0-9 -.,&:_/]+$',
            message: 'The :attribute format is invalid'
        },
        client_projects: {
            'MY-TAKEAWAY': {
                coupon_avilable: ['ALL']
            }
        },
        fallback: null,
        product_id: 4
    },
    es: {
        api_version: AppConfig.API_VERSION,
        address_search: 'street',
        country: {
            id: 261,
            name: 'Spain',
            code: 724,
            iso: 'ES',
            syncInitialConfig: 1642500263,
            alias: 'spain',
            flag: 'es',
            tax_type: 'EXCLUDED',
            customer_care_number: '',
            phone_number_starts_with: '6,7',
            short_name: 'ESP',
            distance_type: 'kms',
            phone_code: 34,
            tax_label: 'VAT',
            distance_label: 'km'
        },
        currency: {
            id: 224,
            value: 224,
            name: 'Euro',
            symbol: '€',
            iso: 'EUR',
            currency_unit: 'centimes'
        },
        post_code: {
            fusion_reg_ex: '[0-9]{5}(-[0-9]{4})?$',
            reg_ex: '[0-9]{5}(-[0-9]{4})?$',
            min_length: '5',
            max_length: '10',
            message: 'The :attribute format is invalid',
            available: true,
            name: 'Zip Code',
            keyboard: 'NUMERIC'
        },
        mobile: {
            reg_ex: '^(0?1[- ]?)?(([0-9]{3})[- ]?([0-9]{3})[- ]?([0-9]{4}))$',
            min_length: 10,
            max_length: 17,
            message: 'Valid mobile number required for :attribute'
        },
        phone: {
            reg_ex: '^(0?1[- ]?)?(([0-9]{3})[- ]?([0-9]{3})[- ]?([0-9]{4}))$',
            min_length: 10,
            max_length: 17,
            message: 'Valid phone number required for :attribute'
        },
        search: {
            name: 'Enter Your Area',
            type: 'address',
            min_length: '3',
            max_length: '100',
            reg_ex: '^[a-zA-Z0-9 -.,&:_/]+$',
            message: 'The :attribute format is invalid'
        },
        house_number: {
            name: 'House/Door No',
            available: true,
            min_length: '1',
            max_length: '100',
            reg_ex: '^(?!0+$)(?!0.0+$)([0-9a-zA-Z ]{1,}$|[0-9a-zA-Z]{1}[0-9a-zA-Z -.,&:_\\/]{0,}[0-9a-zA-Z]{1}$)',
            message: 'The :attribute format is invalid'
        },
        flat: {
            name: 'Apartment',
            available: true,
            min_length: '0',
            max_length: '100',
            reg_ex: '^[a-zA-Z0-9 -.,&:_/]+$',
            message: 'The :attribute format is invalid'
        },
        address_line1: {
            name: 'Street',
            available: true,
            min_length: '1',
            max_length: '100',
            reg_ex: '^[a-zA-Z0-9 -.,&:_/]+$',
            message: 'The :attribute format is invalid'
        },
        address_line2: {
            name: 'City',
            available: true,
            min_length: '1',
            max_length: '100',
            reg_ex: '^[a-zA-Z0-9 -.,&:_/]+$',
            message: 'The :attribute format is invalid'
        },
        area: {
            name: 'Area',
            available: true,
            min_length: '1',
            max_length: '100',
            reg_ex: '^[a-zA-Z0-9 -.,&:_/]+$',
            message: 'The :attribute format is invalid'
        },
        map: {
            latitude: '0',
            longitude: '0',
            zoom_level: '3',
            available: true
        },
        analytics: {
            gtm: '',
            google_verification: '',
            facebook_pixel: ''
        },
        social_media: {
            facebook: 'https://www.facebook.com/FoodhubUS',
            twitter: 'https://twitter.com/FoodhubU',
            youtube: 'https://www.youtube.com/channel/UC12E2pidPaspN8tWTvaRs-A',
            instagram: 'https://www.instagram.com/foodhub.usa/'
        },
        address_template: {
            format: 'No : <house_number>,\r\n<address_line1>,\r\n<address_line2>,\r\n<area>,\r\n,\r\n<country> - <post_code>'
        },
        language: {
            default: {
                name: 'Espanol (Spanish)',
                code: 'es',
                default: true,
                title: 'Spanish'
            },
            options: [
                {
                    name: 'English (United Kingdom)',
                    code: 'en-gb',
                    title: 'English (United Kingdom)'
                },
                {
                    name: 'English (United States)',
                    code: 'en-us',
                    title: 'English (United States)'
                }
            ]
        },
        ms_date_format: {
            long_format: {
                date: 'd-M-Y',
                time: 'HH:i:ss',
                date_time: 'd/M/Y h:i:s A'
            },
            short_format: {
                date: 'd/m/Y',
                time: 'HH:i:s',
                date_time: 'd/m/Y HH:i:s'
            }
        },
        date_format: {
            long_format: {
                date: 'DD/MM/YYYY',
                time: 'H:mm:ss',
                date_time: 'DD/MM/YYYY H:mm:ss'
            },
            short_format: {
                date: 'DD/MM/YY',
                time: 'hh:mm:ss A',
                date_time: 'DD/MM/YY hh:mm:ss A'
            }
        },
        municipality: {
            name: 'Municipality',
            available: true,
            min_length: '1',
            max_length: '100',
            reg_ex: '^[a-zA-Z0-9 -.,&:_/]+$',
            message: 'The :attribute format is invalid'
        },
        neighborhood: {
            name: 'State',
            available: true,
            min_length: '1',
            max_length: '100',
            reg_ex: '^[a-zA-Z0-9 -.,&:_/]+$',
            message: 'The :attribute format is invalid'
        },
        client_projects: {
            'MY-TAKEAWAY': {
                coupon_avilable: ['ALL']
            }
        },
        sample_address: [
            {
                house_number: '',
                address_line1: '',
                address_line2: '',
                postcode: '',
                latitude: '',
                longitude: ''
            }
        ],
        fallback: null,
        product_id: 4
    }
};

export const VIEW_ID = {
    COUNTRY_SELECTION: 'country_selection',
    LEFT_BUTTON: 'left_button',
    ICON_TICK: 'icon_tick'
};
