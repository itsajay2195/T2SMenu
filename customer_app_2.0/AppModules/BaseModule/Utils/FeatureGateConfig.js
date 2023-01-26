import { DEFAULT_CHAT_BOT_DURATION } from '../../SupportModule/Utils/SupportConstants';

export const DEFAULT_FEATURE_GATE_ID = '1';

export const FOODHUB_FEATURE_GATE_CONFIG = {
    '1': {
        discovery_screen_recent_orders: {
            status: 'ENABLED',
            options: null
        },
        hygiene_rating: {
            status: 'ENABLED',
            options: null
        },
        total_savings: {
            status: 'ENABLED',
            options: null
        },
        ada_chat_bot: {
            status: 'ENABLED',
            options: null
        },
        discovery_page_re_order: {
            status: 'ENABLED',
            options: null
        },
        takeaway_menu_recent_order: {
            status: 'ENABLED',
            options: null
        },
        show_recommendation: {
            status: 'ENABLED',
            options: null
        },
        show_play_store_rating_left_menu: {
            status: 'ENABLED',
            options: null
        },
        live_tracking: {
            status: 'ENABLED',
            options: null
        },
        native_app: {
            status: 'ENABLED',
            options: null
        },
        foodhub_wallet: {
            status: 'ENABLED',
            options: null
        },
        contactless_delivery: {
            status: 'DISABLED',
            options: null
        },
        saved_cards: {
            status: 'ENABLED',
            options: null
        },
        code_push_silent: {
            status: 'ENABLED',
            options: {
                '9.8': {
                    status: 'ENABLED'
                },
                '9.9': {
                    status: 'ENABLED'
                },
                '9.10': {
                    status: 'DISABLED'
                },
                '9.11': {
                    status: 'ENABLED'
                },
                '9.12': {
                    status: 'ENABLED'
                },
                '9.13': {
                    status: 'ENABLED'
                },
                '9.14': {
                    status: 'ENABLED'
                },
                '9.15': {
                    status: 'ENABLED'
                },
                '9.16': {
                    status: 'ENABLED'
                }
            }
        },
        basket_recommendation: {
            status: 'ENABLED',
            options: null
        },
        consumer_cancel_request: {
            status: 'ENABLED',
            options: {
                wait_time_after_order_accepted: 180,
                pre_order_cancellation_duration: 3600,
                allowed_refund_upto: 3600
            }
        },
        segment_enabled: {
            status: 'ENABLED',
            options: null
        },
        braze_enabled: {
            status: 'ENABLED',
            options: null
        },
        zoho_desk: {
            status: 'ENABLED',
            options: {
                appID: 'edbsnbe4298d4d82a6f67a2b0ea72270034332cb57c860d1a405b8fea60c944616d1e',
                departmentID: '354176000000006907'
            }
        },
        haptic_feedback: {
            status: 'ENABLED',
            options: {
                addon_added: 'impactLight',
                order_placed: 'notificationSuccess',
                item_added: 'impactMedium'
            }
        },
        takeaway_cuisine_list: {
            status: 'ENABLED',
            options: {
                cuisine_list_count: 20
            }
        },
        chat_bot_duration: {
            status: 'ENABLED',
            options: {
                duration: DEFAULT_CHAT_BOT_DURATION
            }
        },
        showPreChatForms: {
            status: 'ENABLED',
            enable: true
        },
        basket_items_reminder: {
            enable: false,
            schedule_mins: 5
        },
        orderTypeForCoupon: {
            enable: false
        },
        google_pay: {
            status: 'DISABLED',
            enable: true
        },
        google_pay_3ds: {
            status: 'ENABLED',
            options: {
                gateway: 'judo_pay'
            }
        },
        apple_pay: {
            status: 'ENABLED',
            options: {
                apple_review_takeaway: [816299, 811111],
                gateway: 'judo_pay'
            }
        },
        payment_google_pay: {
            status: 'ENABLED',
            options: {
                gateway: 'judo_pay'
            }
        },
        payment_apple_pay: {
            status: 'ENABLED',
            options: {
                apple_review_takeaway: [816299, 811111],
                gateway: 'judo_pay'
            }
        },
        referral_campaign: {
            status: 'ENABLED',
            enable: true
        },
        showTips_UI: {
            status: 'DISABLED',
            enable: false
        },
        campaign_enabled: {
            status: 'ENABLED',
            enable: true
        },
        order_type_toggle: {
            status: 'ENABLED',
            enable: true,
            options: {
                default: 'delivery'
            }
        },
        foodhub_logo: {
            status: 'ENABLED',
            options: {
                enable_black: false
            }
        },
        toolTipVisbleDistance: {
            distanceByMeter: 50
        }
    },
    '2': {
        discovery_screen_recent_orders: {
            status: 'ENABLED',
            options: null
        },
        hygiene_rating: {
            status: 'DISABLED',
            options: null
        },
        total_savings: {
            status: 'DISABLED',
            options: null
        },
        ada_chat_bot: {
            status: 'ENABLED',
            options: null
        },
        discovery_page_re_order: {
            status: 'ENABLED',
            options: null
        },
        takeaway_menu_recent_order: {
            status: 'ENABLED',
            options: null
        },
        show_recommendation: {
            status: 'ENABLED',
            options: null
        },
        show_play_store_rating_left_menu: {
            status: 'ENABLED',
            options: null
        },
        live_tracking: {
            status: 'ENABLED',
            options: null
        },
        native_app: {
            status: 'ENABLED',
            options: null
        },
        foodhub_wallet: {
            status: 'DISABLED',
            options: null
        },
        contactless_delivery: {
            status: 'DISABLED',
            options: null
        },
        saved_cards: {
            status: 'DISABLED',
            options: null
        },
        code_push_silent: {
            status: 'ENABLED',
            options: {
                '9.8': {
                    status: 'ENABLED'
                },
                '9.9': {
                    status: 'ENABLED'
                },
                '9.10': {
                    status: 'ENABLED'
                },
                '9.11': {
                    status: 'ENABLED'
                },
                '9.12': {
                    status: 'ENABLED'
                },
                '9.13': {
                    status: 'ENABLED'
                },
                '9.14': {
                    status: 'ENABLED'
                },
                '9.15': {
                    status: 'ENABLED'
                },
                '9.16': {
                    status: 'ENABLED'
                }
            }
        },
        basket_recommendation: {
            status: 'DISABLED',
            options: null
        },
        consumer_cancel_request: {
            status: 'ENABLED',
            options: {
                wait_time_after_order_accepted: 180,
                pre_order_cancellation_duration: 3600,
                allowed_refund_upto: 3600
            }
        },
        segment_enabled: {
            status: 'ENABLED',
            options: null
        },
        braze_enabled: {
            status: 'ENABLED',
            options: null
        },
        zoho_desk: {
            status: 'ENABLED',
            options: {
                appID: 'edbsnbe4298d4d82a6f67a2b0ea72270034332cb57c860d1a405b8fea60c944616d1e',
                departmentID: '354176000000006907'
            }
        },
        haptic_feedback: {
            status: 'ENABLED',
            options: {
                addon_added: 'impactLight',
                order_placed: 'notificationSuccess',
                item_added: 'impactMedium'
            }
        },
        takeaway_cuisine_list: {
            status: 'ENABLED',
            options: {
                cuisine_list_count: 20
            }
        },
        chat_bot_duration: {
            status: 'ENABLED',
            options: {
                duration: DEFAULT_CHAT_BOT_DURATION
            }
        },
        basket_items_reminder: {
            enable: true,
            schedule_mins: 5
        },
        orderTypeForCoupon: {
            enable: false
        },
        google_pay: {
            status: 'DISABLED',
            enable: false
        },
        google_pay_3ds: {
            status: 'DISABLED',
            options: {
                gateway: 'checkout'
            }
        },
        apple_pay: {
            status: 'DISABLED',
            options: {
                apple_review_takeaway: [816299, 811111],
                gateway: 'checkout'
            }
        },
        payment_google_pay: {
            status: 'DISABLED',
            options: {
                gateway: 'checkout'
            }
        },
        payment_apple_pay: {
            status: 'DISABLED',
            options: {
                apple_review_takeaway: [816299, 811111],
                gateway: 'checkout'
            }
        },
        referral_campaign: {
            status: 'DISABLED',
            enable: true
        },
        showTips_UI: {
            status: 'ENABLED',
            enable: true
        },
        campaign_enabled: {
            status: 'ENABLED',
            enable: true
        },
        foodhub_logo: {
            status: 'ENABLED',
            options: {
                enable_black: false
            }
        },
        order_type_toggle: {
            status: 'ENABLED',
            enable: true,
            options: {
                default: 'delivery'
            }
        },
        toolTipVisbleDistance: {
            distanceByMeter: 50
        }
    },
    '3': {
        discovery_screen_recent_orders: {
            status: 'ENABLED',
            options: null
        },
        hygiene_rating: {
            status: 'DISABLED',
            options: null
        },
        total_savings: {
            status: 'DISABLED',
            options: null
        },
        ada_chat_bot: {
            status: 'ENABLED',
            options: null
        },
        discovery_page_re_order: {
            status: 'ENABLED',
            options: null
        },
        takeaway_menu_recent_order: {
            status: 'ENABLED',
            options: null
        },
        show_recommendation: {
            status: 'ENABLED',
            options: null
        },
        show_play_store_rating_left_menu: {
            status: 'ENABLED',
            options: null
        },
        live_tracking: {
            status: 'ENABLED',
            options: null
        },
        native_app: {
            status: 'ENABLED',
            options: null
        },
        foodhub_wallet: {
            status: 'DISABLED',
            options: null
        },
        contactless_delivery: {
            status: 'DISABLED',
            options: null
        },
        saved_cards: {
            status: 'DISABLED',
            options: null
        },
        code_push_silent: {
            status: 'ENABLED',
            options: {
                '9.8': {
                    status: 'ENABLED'
                },
                '9.9': {
                    status: 'ENABLED'
                },
                '9.10': {
                    status: 'ENABLED'
                },
                '9.11': {
                    status: 'ENABLED'
                },
                '9.12': {
                    status: 'ENABLED'
                },
                '9.13': {
                    status: 'ENABLED'
                },
                '9.14': {
                    status: 'ENABLED'
                },
                '9.15': {
                    status: 'ENABLED'
                },
                '9.16': {
                    status: 'ENABLED'
                }
            }
        },
        basket_recommendation: {
            status: 'DISABLED',
            options: null
        },
        consumer_cancel_request: {
            status: 'ENABLED',
            options: {
                wait_time_after_order_accepted: 180,
                pre_order_cancellation_duration: 3600,
                allowed_refund_upto: 3600
            }
        },
        segment_enabled: {
            status: 'ENABLED',
            options: null
        },
        braze_enabled: {
            status: 'ENABLED',
            options: null
        },
        zoho_desk: {
            status: 'ENABLED',
            options: {
                appID: 'edbsnbe4298d4d82a6f67a2b0ea72270034332cb57c860d1a405b8fea60c944616d1e',
                departmentID: '354176000000006907'
            }
        },
        haptic_feedback: {
            status: 'ENABLED',
            options: {
                addon_added: 'impactLight',
                order_placed: 'notificationSuccess',
                item_added: 'impactMedium'
            }
        },
        takeaway_cuisine_list: {
            status: 'ENABLED',
            options: {
                cuisine_list_count: 20
            }
        },
        chat_bot_duration: {
            status: 'ENABLED',
            options: {
                duration: DEFAULT_CHAT_BOT_DURATION
            }
        },
        basket_items_reminder: {
            enable: true,
            schedule_mins: 5
        },
        orderTypeForCoupon: {
            enable: false
        },
        google_pay: {
            status: 'DISABLED',
            enable: false
        },
        google_pay_3ds: {
            status: 'DISABLED',
            options: {
                gateway: 'checkout'
            }
        },
        apple_pay: {
            status: 'DISABLED',
            options: {
                apple_review_takeaway: [816299, 811111],
                gateway: 'checkout'
            }
        },
        payment_google_pay: {
            status: 'DISABLED',
            options: {
                gateway: 'checkout'
            }
        },
        payment_apple_pay: {
            status: 'DISABLED',
            options: {
                apple_review_takeaway: [816299, 811111],
                gateway: 'checkout'
            }
        },
        referral_campaign: {
            status: 'DISABLED',
            enable: true
        },
        showTips_UI: {
            status: 'ENABLED',
            enable: true
        },
        campaign_enabled: {
            status: 'ENABLED',
            enable: true
        },
        order_type_toggle: {
            status: 'DISABLED',
            enable: false,
            options: {
                default: 'delivery'
            }
        },
        foodhub_logo: {
            status: 'ENABLED',
            options: {
                enable_black: false
            }
        },
        toolTipVisbleDistance: {
            distanceByMeter: 50
        }
    },
    '4': {
        discovery_screen_recent_orders: {
            status: 'ENABLED',
            options: null
        },
        hygiene_rating: {
            status: 'DISABLED',
            options: null
        },
        total_savings: {
            status: 'DISABLED',
            options: null
        },
        ada_chat_bot: {
            status: 'ENABLED',
            options: null
        },
        discovery_page_re_order: {
            status: 'ENABLED',
            options: null
        },
        takeaway_menu_recent_order: {
            status: 'ENABLED',
            options: null
        },
        show_recommendation: {
            status: 'ENABLED',
            options: null
        },
        show_play_store_rating_left_menu: {
            status: 'ENABLED',
            options: null
        },
        live_tracking: {
            status: 'ENABLED',
            options: null
        },
        native_app: {
            status: 'ENABLED',
            options: null
        },
        foodhub_wallet: {
            status: 'DISABLED',
            options: null
        },
        contactless_delivery: {
            status: 'DISABLED',
            options: null
        },
        saved_cards: {
            status: 'DISABLED',
            options: null
        },
        code_push_silent: {
            status: 'ENABLED',
            options: {
                '9.8': {
                    status: 'ENABLED'
                },
                '9.9': {
                    status: 'ENABLED'
                },
                '9.10': {
                    status: 'ENABLED'
                },
                '9.11': {
                    status: 'ENABLED'
                },
                '9.12': {
                    status: 'ENABLED'
                },
                '9.13': {
                    status: 'ENABLED'
                },
                '9.14': {
                    status: 'ENABLED'
                },
                '9.15': {
                    status: 'ENABLED'
                },
                '9.16': {
                    status: 'ENABLED'
                }
            }
        },
        basket_recommendation: {
            status: 'DISABLED',
            options: null
        },
        consumer_cancel_request: {
            status: 'ENABLED',
            options: {
                wait_time_after_order_accepted: 180,
                pre_order_cancellation_duration: 3600,
                allowed_refund_upto: 3600
            }
        },
        segment_enabled: {
            status: 'ENABLED',
            options: null
        },
        braze_enabled: {
            status: 'ENABLED',
            options: null
        },
        zoho_desk: {
            status: 'ENABLED',
            options: {
                appID: 'edbsnbe4298d4d82a6f67a2b0ea72270034332cb57c860d1a405b8fea60c944616d1e',
                departmentID: '354176000000006907'
            }
        },
        haptic_feedback: {
            status: 'ENABLED',
            options: {
                addon_added: 'impactLight',
                order_placed: 'notificationSuccess',
                item_added: 'impactMedium'
            }
        },
        takeaway_cuisine_list: {
            status: 'ENABLED',
            options: {
                cuisine_list_count: 20
            }
        },
        chat_bot_duration: {
            status: 'ENABLED',
            options: {
                duration: DEFAULT_CHAT_BOT_DURATION
            }
        },
        basket_items_reminder: {
            enable: true,
            schedule_mins: 5
        },
        orderTypeForCoupon: {
            enable: false
        },
        google_pay: {
            status: 'DISABLED',
            enable: false
        },
        google_pay_3ds: {
            status: 'DISABLED',
            options: {
                gateway: 'checkout'
            }
        },
        apple_pay: {
            status: 'DISABLED',
            options: {
                apple_review_takeaway: [816299, 811111],
                gateway: 'checkout'
            }
        },
        payment_google_pay: {
            status: 'DISABLED',
            options: {
                gateway: 'checkout'
            }
        },
        payment_apple_pay: {
            status: 'DISABLED',
            options: {
                apple_review_takeaway: [816299, 811111],
                gateway: 'checkout'
            }
        },
        referral_campaign: {
            status: 'DISABLED',
            enable: true
        },
        showTips_UI: {
            status: 'ENABLED',
            enable: true
        },
        campaign_enabled: {
            status: 'ENABLED',
            enable: true
        },
        order_type_toggle: {
            status: 'DISABLED',
            enable: false,
            options: {
                default: 'delivery'
            }
        },
        foodhub_logo: {
            status: 'ENABLED',
            options: {
                enable_black: false
            }
        },
        toolTipVisbleDistance: {
            distanceByMeter: 50
        }
    },
    '7': {
        discovery_screen_recent_orders: {
            status: 'ENABLED',
            options: null
        },
        hygiene_rating: {
            status: 'DISABLED',
            options: null
        },
        total_savings: {
            status: 'DISABLED',
            options: null
        },
        ada_chat_bot: {
            status: 'ENABLED',
            options: null
        },
        discovery_page_re_order: {
            status: 'ENABLED',
            options: null
        },
        takeaway_menu_recent_order: {
            status: 'ENABLED',
            options: null
        },
        show_recommendation: {
            status: 'ENABLED',
            options: null
        },
        show_play_store_rating_left_menu: {
            status: 'ENABLED',
            options: null
        },
        live_tracking: {
            status: 'ENABLED',
            options: null
        },
        native_app: {
            status: 'ENABLED',
            options: null
        },
        foodhub_wallet: {
            status: 'DISABLED',
            options: null
        },
        contactless_delivery: {
            status: 'DISABLED',
            options: null
        },
        saved_cards: {
            status: 'DISABLED',
            options: null
        },
        code_push_silent: {
            status: 'ENABLED',
            options: {
                '9.8': {
                    status: 'ENABLED'
                },
                '9.9': {
                    status: 'ENABLED'
                },
                '9.10': {
                    status: 'ENABLED'
                },
                '9.11': {
                    status: 'ENABLED'
                },
                '9.12': {
                    status: 'ENABLED'
                },
                '9.13': {
                    status: 'ENABLED'
                },
                '9.14': {
                    status: 'ENABLED'
                },
                '9.15': {
                    status: 'ENABLED'
                },
                '9.16': {
                    status: 'ENABLED'
                }
            }
        },
        basket_recommendation: {
            status: 'DISABLED',
            options: null
        },
        consumer_cancel_request: {
            status: 'ENABLED',
            options: {
                wait_time_after_order_accepted: 180,
                pre_order_cancellation_duration: 3600,
                allowed_refund_upto: 3600
            }
        },
        segment_enabled: {
            status: 'ENABLED',
            options: null
        },
        braze_enabled: {
            status: 'ENABLED',
            options: null
        },
        zoho_desk: {
            status: 'ENABLED',
            options: {
                appID: 'edbsnbe4298d4d82a6f67a2b0ea72270034332cb57c860d1a405b8fea60c944616d1e',
                departmentID: '354176000000006907'
            }
        },
        haptic_feedback: {
            status: 'ENABLED',
            options: {
                addon_added: 'impactLight',
                order_placed: 'notificationSuccess',
                item_added: 'impactMedium'
            }
        },
        takeaway_cuisine_list: {
            status: 'ENABLED',
            options: {
                cuisine_list_count: 20
            }
        },
        chat_bot_duration: {
            status: 'ENABLED',
            options: {
                duration: DEFAULT_CHAT_BOT_DURATION
            }
        },
        basket_items_reminder: {
            enable: true,
            schedule_mins: 5
        },
        orderTypeForCoupon: {
            enable: false
        },
        google_pay: {
            status: 'DISABLED',
            enable: true
        },
        google_pay_3ds: {
            status: 'DISABLED',
            options: {
                gateway: 'checkout'
            }
        },
        apple_pay: {
            status: 'DISABLED',
            options: {
                apple_review_takeaway: [816299, 811111],
                gateway: 'checkout'
            }
        },
        payment_google_pay: {
            status: 'ENABLED',
            options: {
                gateway: 'checkout'
            }
        },
        payment_apple_pay: {
            status: 'ENABLED',
            options: {
                apple_review_takeaway: [816299, 811111],
                gateway: 'checkout'
            }
        },
        referral_campaign: {
            status: 'DISABLED',
            enable: true
        },
        showTips_UI: {
            status: 'ENABLED',
            enable: true
        },
        campaign_enabled: {
            status: 'ENABLED',
            enable: true
        },
        order_type_toggle: {
            status: 'ENABLED',
            enable: true,
            options: {
                default: 'delivery'
            }
        },
        foodhub_logo: {
            status: 'ENABLED',
            options: {
                enable_black: false
            }
        },
        toolTipVisbleDistance: {
            distanceByMeter: 50
        }
    },
    '8': {
        discovery_screen_recent_orders: {
            status: 'ENABLED',
            options: null
        },
        hygiene_rating: {
            status: 'DISABLED',
            options: null
        },
        total_savings: {
            status: 'DISABLED',
            options: null
        },
        ada_chat_bot: {
            status: 'ENABLED',
            options: null
        },
        discovery_page_re_order: {
            status: 'ENABLED',
            options: null
        },
        takeaway_menu_recent_order: {
            status: 'ENABLED',
            options: null
        },
        show_recommendation: {
            status: 'ENABLED',
            options: null
        },
        show_play_store_rating_left_menu: {
            status: 'ENABLED',
            options: null
        },
        live_tracking: {
            status: 'ENABLED',
            options: null
        },
        native_app: {
            status: 'ENABLED',
            options: null
        },
        foodhub_wallet: {
            status: 'DISABLED',
            options: null
        },
        contactless_delivery: {
            status: 'DISABLED',
            options: null
        },
        saved_cards: {
            status: 'DISABLED',
            options: null
        },
        code_push_silent: {
            status: 'ENABLED',
            options: {
                '9.8': {
                    status: 'ENABLED'
                },
                '9.9': {
                    status: 'ENABLED'
                },
                '9.10': {
                    status: 'ENABLED'
                },
                '9.11': {
                    status: 'ENABLED'
                },
                '9.13': {
                    status: 'ENABLED'
                },
                '9.14': {
                    status: 'ENABLED'
                },
                '9.15': {
                    status: 'ENABLED'
                },
                '9.16': {
                    status: 'ENABLED'
                }
            }
        },
        basket_recommendation: {
            status: 'DISABLED',
            options: null
        },
        consumer_cancel_request: {
            status: 'ENABLED',
            options: {
                wait_time_after_order_accepted: 180,
                pre_order_cancellation_duration: 3600,
                allowed_refund_upto: 3600
            }
        },
        segment_enabled: {
            status: 'ENABLED',
            options: null
        },
        braze_enabled: {
            status: 'ENABLED',
            options: null
        },
        zoho_desk: {
            status: 'ENABLED',
            options: {
                appID: 'edbsnbe4298d4d82a6f67a2b0ea72270034332cb57c860d1a405b8fea60c944616d1e',
                departmentID: '354176000000006907'
            }
        },
        haptic_feedback: {
            status: 'ENABLED',
            options: {
                addon_added: 'impactLight',
                order_placed: 'notificationSuccess',
                item_added: 'impactMedium'
            }
        },
        takeaway_cuisine_list: {
            status: 'ENABLED',
            options: {
                cuisine_list_count: 20
            }
        },
        chat_bot_duration: {
            status: 'ENABLED',
            options: {
                duration: DEFAULT_CHAT_BOT_DURATION
            }
        },
        basket_items_reminder: {
            enable: true,
            schedule_mins: 5
        },
        orderTypeForCoupon: {
            enable: false
        },
        google_pay: {
            status: 'DISABLED',
            enable: false
        },
        google_pay_3ds: {
            status: 'DISABLED',
            options: {
                gateway: 'checkout'
            }
        },
        apple_pay: {
            status: 'DISABLED',
            options: {
                apple_review_takeaway: [816299, 811111],
                gateway: 'checkout'
            }
        },
        payment_google_pay: {
            status: 'DISABLED',
            options: {
                gateway: 'checkout'
            }
        },
        payment_apple_pay: {
            status: 'DISABLED',
            options: {
                apple_review_takeaway: [816299, 811111],
                gateway: 'checkout'
            }
        },
        referral_campaign: {
            status: 'DISABLED',
            enable: true
        },
        showTips_UI: {
            status: 'ENABLED',
            enable: true
        },
        campaign_enabled: {
            status: 'ENABLED',
            enable: true
        },
        order_type_toggle: {
            status: 'ENABLED',
            enable: true,
            options: {
                default: 'delivery'
            }
        },
        foodhub_logo: {
            status: 'ENABLED',
            options: {
                enable_black: false
            }
        },
        toolTipVisbleDistance: {
            distanceByMeter: 50
        }
    },
    '9': {
        discovery_screen_recent_orders: {
            status: 'ENABLED',
            options: null
        },
        hygiene_rating: {
            status: 'DISABLED',
            options: null
        },
        total_savings: {
            status: 'DISABLED',
            options: null
        },
        ada_chat_bot: {
            status: 'ENABLED',
            options: null
        },
        discovery_page_re_order: {
            status: 'ENABLED',
            options: null
        },
        takeaway_menu_recent_order: {
            status: 'ENABLED',
            options: null
        },
        show_recommendation: {
            status: 'ENABLED',
            options: null
        },
        show_play_store_rating_left_menu: {
            status: 'ENABLED',
            options: null
        },
        live_tracking: {
            status: 'ENABLED',
            options: null
        },
        native_app: {
            status: 'ENABLED',
            options: null
        },
        foodhub_wallet: {
            status: 'DISABLED',
            options: null
        },
        contactless_delivery: {
            status: 'DISABLED',
            options: null
        },
        saved_cards: {
            status: 'DISABLED',
            options: null
        },
        code_push_silent: {
            status: 'ENABLED',
            options: {
                '9.8': {
                    status: 'ENABLED'
                },
                '9.9': {
                    status: 'ENABLED'
                },
                '9.10': {
                    status: 'ENABLED'
                },
                '9.11': {
                    status: 'ENABLED'
                },
                '9.13': {
                    status: 'ENABLED'
                },
                '9.14': {
                    status: 'ENABLED'
                },
                '9.15': {
                    status: 'ENABLED'
                },
                '9.16': {
                    status: 'ENABLED'
                }
            }
        },
        basket_recommendation: {
            status: 'DISABLED',
            options: null
        },
        consumer_cancel_request: {
            status: 'ENABLED',
            options: {
                wait_time_after_order_accepted: 180,
                pre_order_cancellation_duration: 3600,
                allowed_refund_upto: 3600
            }
        },
        segment_enabled: {
            status: 'ENABLED',
            options: null
        },
        braze_enabled: {
            status: 'ENABLED',
            options: null
        },
        zoho_desk: {
            status: 'ENABLED',
            options: {
                appID: 'edbsnbe4298d4d82a6f67a2b0ea72270034332cb57c860d1a405b8fea60c944616d1e',
                departmentID: '354176000000006907'
            }
        },
        haptic_feedback: {
            status: 'ENABLED',
            options: {
                addon_added: 'impactLight',
                order_placed: 'notificationSuccess',
                item_added: 'impactMedium'
            }
        },
        takeaway_cuisine_list: {
            status: 'ENABLED',
            options: {
                cuisine_list_count: 20
            }
        },
        chat_bot_duration: {
            status: 'ENABLED',
            options: {
                duration: DEFAULT_CHAT_BOT_DURATION
            }
        },
        basket_items_reminder: {
            enable: true,
            schedule_mins: 5
        },
        orderTypeForCoupon: {
            enable: false
        },
        google_pay: {
            status: 'DISABLED',
            enable: false
        },
        google_pay_3ds: {
            status: 'DISABLED',
            options: {
                gateway: 'checkout'
            }
        },
        apple_pay: {
            status: 'DISABLED',
            options: {
                apple_review_takeaway: [816299, 811111],
                gateway: 'checkout'
            }
        },
        payment_google_pay: {
            status: 'DISABLED',
            options: {
                gateway: 'checkout'
            }
        },
        payment_apple_pay: {
            status: 'DISABLED',
            options: {
                apple_review_takeaway: [816299, 811111],
                gateway: 'checkout'
            }
        },
        referral_campaign: {
            status: 'DISABLED',
            enable: true
        },
        showTips_UI: {
            status: 'ENABLED',
            enable: true
        },
        campaign_enabled: {
            status: 'ENABLED',
            enable: true
        },
        order_type_toggle: {
            status: 'ENABLED',
            enable: true,
            options: {
                default: 'delivery'
            }
        },
        foodhub_logo: {
            status: 'ENABLED',
            options: {
                enable_black: false
            }
        },
        toolTipVisbleDistance: {
            distanceByMeter: 50
        }
    }
};
export const FRANCHISE_FEATURE_GATE_CONFIG = {
    '1': {
        discovery_screen_recent_orders: {
            status: 'ENABLED',
            options: null
        },
        hygiene_rating: {
            status: 'ENABLED',
            options: null
        },
        total_savings: {
            status: 'ENABLED',
            options: null
        },
        ada_chat_bot: {
            status: 'ENABLED',
            options: null
        },
        discovery_page_re_order: {
            status: 'ENABLED',
            options: null
        },
        takeaway_menu_recent_order: {
            status: 'ENABLED',
            options: null
        },
        show_recommendation: {
            status: 'ENABLED',
            options: null
        },
        show_play_store_rating_left_menu: {
            status: 'ENABLED',
            options: null
        },
        live_tracking: {
            status: 'ENABLED',
            options: null
        },
        native_app: {
            status: 'ENABLED',
            options: null
        },
        foodhub_wallet: {
            status: 'ENABLED',
            options: null
        },
        contactless_delivery: {
            status: 'DISABLED',
            options: null
        },
        saved_cards: {
            status: 'ENABLED',
            options: null
        },
        apple_pay: {
            status: 'ENABLED',
            options: {
                apple_review_takeaway: [816299, 811111]
            }
        },
        code_push_silent: {
            status: 'ENABLED',
            options: {
                '9.8': {
                    status: 'ENABLED'
                },
                '9.9': {
                    status: 'ENABLED'
                },
                '9.10': {
                    status: 'DISABLED'
                },
                '9.11': {
                    status: 'ENABLED'
                },
                '9.12': {
                    status: 'ENABLED'
                },
                '9.13': {
                    status: 'ENABLED'
                },
                '9.14': {
                    status: 'ENABLED'
                },
                '9.15': {
                    status: 'ENABLED'
                },
                '9.16': {
                    status: 'ENABLED'
                }
            }
        },
        basket_recommendation: {
            status: 'ENABLED',
            options: null
        },
        consumer_cancel_request: {
            status: 'ENABLED',
            options: {
                wait_time_after_order_accepted: 180,
                pre_order_cancellation_duration: 3600,
                allowed_refund_upto: 3600
            }
        },
        segment_enabled: {
            status: 'DISABLED',
            options: null
        },
        braze_enabled: {
            status: 'DISABLED',
            options: null
        },
        zoho_desk: {
            status: 'ENABLED',
            options: null
        },
        haptic_feedback: {
            status: 'ENABLED',
            options: {
                addon_added: 'impactLight',
                order_placed: 'notificationSuccess',
                item_added: 'impactMedium'
            }
        },
        takeaway_cuisine_list: {
            status: 'ENABLED',
            options: {
                cuisine_list_count: 20
            }
        },
        chat_bot_duration: {
            status: 'ENABLED',
            options: {
                duration: DEFAULT_CHAT_BOT_DURATION
            }
        },
        basket_items_reminder: {
            enable: true,
            schedule_mins: 5
        },
        orderTypeForCoupon: {
            enable: false
        },
        google_pay: {
            status: 'DISABLED',
            enable: false
        },
        google_pay_3ds: {
            status: 'DISABLED',
            enable: false
        },
        referral_campaign: {
            status: 'DISABLED',
            enable: false
        },
        showTips_UI: {
            status: 'DISABLED',
            enable: false
        },
        campaign_enabled: {
            status: 'DISABLED',
            enable: false
        },
        order_type_toggle: {
            status: 'ENABLED',
            enable: true,
            options: {
                default: 'delivery'
            }
        }
    },
    '2': {
        discovery_screen_recent_orders: {
            status: 'ENABLED',
            options: null
        },
        hygiene_rating: {
            status: 'DISABLED',
            options: null
        },
        total_savings: {
            status: 'DISABLED',
            options: null
        },
        ada_chat_bot: {
            status: 'ENABLED',
            options: null
        },
        discovery_page_re_order: {
            status: 'ENABLED',
            options: null
        },
        takeaway_menu_recent_order: {
            status: 'ENABLED',
            options: null
        },
        show_recommendation: {
            status: 'ENABLED',
            options: null
        },
        show_play_store_rating_left_menu: {
            status: 'ENABLED',
            options: null
        },
        live_tracking: {
            status: 'ENABLED',
            options: null
        },
        native_app: {
            status: 'ENABLED',
            options: null
        },
        foodhub_wallet: {
            status: 'DISABLED',
            options: null
        },
        contactless_delivery: {
            status: 'DISABLED',
            options: null
        },
        saved_cards: {
            status: 'DISABLED',
            options: null
        },
        apple_pay: {
            status: 'DISABLED',
            options: {
                apple_review_takeaway: [816299, 811111]
            }
        },
        code_push_silent: {
            status: 'ENABLED',
            options: {
                '9.8': {
                    status: 'ENABLED'
                },
                '9.9': {
                    status: 'ENABLED'
                },
                '9.10': {
                    status: 'DISABLED'
                },
                '9.11': {
                    status: 'ENABLED'
                },
                '9.12': {
                    status: 'ENABLED'
                },
                '9.13': {
                    status: 'ENABLED'
                },
                '9.14': {
                    status: 'ENABLED'
                },
                '9.15': {
                    status: 'ENABLED'
                },
                '9.16': {
                    status: 'ENABLED'
                }
            }
        },
        consumer_cancel_request: {
            status: 'ENABLED',
            options: {
                wait_time_after_order_accepted: 180,
                pre_order_cancellation_duration: 3600,
                allowed_refund_upto: 3600
            }
        },
        segment_enabled: {
            status: 'DISABLED',
            options: null
        },
        braze_enabled: {
            status: 'DISABLED',
            options: null
        },
        zoho_desk: {
            status: 'ENABLED',
            options: null
        },
        haptic_feedback: {
            status: 'ENABLED',
            options: {
                addon_added: 'impactLight',
                order_placed: 'notificationSuccess',
                item_added: 'impactMedium'
            }
        },
        takeaway_cuisine_list: {
            status: 'ENABLED',
            options: {
                cuisine_list_count: 20
            }
        },
        chat_bot_duration: {
            status: 'ENABLED',
            options: {
                duration: DEFAULT_CHAT_BOT_DURATION
            }
        },
        basket_items_reminder: {
            enable: true,
            schedule_mins: 5
        },
        orderTypeForCoupon: {
            enable: false
        },
        google_pay: {
            status: 'DISABLED',
            enable: false
        },
        google_pay_3ds: {
            status: 'DISABLED',
            enable: false
        },
        referral_campaign: {
            status: 'DISABLED',
            enable: false
        },
        showTips_UI: {
            status: 'DISABLED',
            enable: false
        },
        campaign_enabled: {
            status: 'DISABLED',
            enable: false
        },
        order_type_toggle: {
            status: 'ENABLED',
            enable: true,
            options: {
                default: 'delivery'
            }
        }
    },
    '3': {
        discovery_screen_recent_orders: {
            status: 'ENABLED',
            options: null
        },
        hygiene_rating: {
            status: 'DISABLED',
            options: null
        },
        total_savings: {
            status: 'DISABLED',
            options: null
        },
        ada_chat_bot: {
            status: 'ENABLED',
            options: null
        },
        discovery_page_re_order: {
            status: 'ENABLED',
            options: null
        },
        takeaway_menu_recent_order: {
            status: 'ENABLED',
            options: null
        },
        show_recommendation: {
            status: 'ENABLED',
            options: null
        },
        show_play_store_rating_left_menu: {
            status: 'ENABLED',
            options: null
        },
        live_tracking: {
            status: 'ENABLED',
            options: null
        },
        native_app: {
            status: 'ENABLED',
            options: null
        },
        foodhub_wallet: {
            status: 'DISABLED',
            options: null
        },
        contactless_delivery: {
            status: 'DISABLED',
            options: null
        },
        saved_cards: {
            status: 'DISABLED',
            options: null
        },
        apple_pay: {
            status: 'DISABLED',
            options: null
        },
        code_push_silent: {
            status: 'ENABLED',
            options: {
                '9.8': {
                    status: 'ENABLED'
                },
                '9.9': {
                    status: 'ENABLED'
                },
                '9.10': {
                    status: 'DISABLED'
                },
                '9.11': {
                    status: 'ENABLED'
                },
                '9.12': {
                    status: 'ENABLED'
                },
                '9.13': {
                    status: 'ENABLED'
                },
                '9.14': {
                    status: 'ENABLED'
                },
                '9.15': {
                    status: 'ENABLED'
                },
                '9.16': {
                    status: 'ENABLED'
                }
            }
        },
        consumer_cancel_request: {
            status: 'ENABLED',
            options: {
                wait_time_after_order_accepted: 180,
                pre_order_cancellation_duration: 3600,
                allowed_refund_upto: 3600
            }
        },
        segment_enabled: {
            status: 'DISABLED',
            options: null
        },
        braze_enabled: {
            status: 'DISABLED',
            options: null
        },
        zoho_desk: {
            status: 'ENABLED',
            options: null
        },
        haptic_feedback: {
            status: 'ENABLED',
            options: {
                addon_added: 'impactLight',
                order_placed: 'notificationSuccess',
                item_added: 'impactMedium'
            }
        },
        takeaway_cuisine_list: {
            status: 'ENABLED',
            options: {
                cuisine_list_count: 20
            }
        },
        chat_bot_duration: {
            status: 'ENABLED',
            options: {
                duration: DEFAULT_CHAT_BOT_DURATION
            }
        },
        basket_items_reminder: {
            enable: true,
            schedule_mins: 5
        },
        orderTypeForCoupon: {
            enable: false
        },
        google_pay: {
            status: 'DISABLED',
            enable: false
        },
        google_pay_3ds: {
            status: 'DISABLED',
            enable: false
        },
        referral_campaign: {
            status: 'DISABLED',
            enable: false
        },
        showTips_UI: {
            status: 'DISABLED',
            enable: false
        },
        campaign_enabled: {
            status: 'DISABLED',
            enable: false
        },
        order_type_toggle: {
            status: 'DISABLED',
            enable: false,
            options: {
                default: 'delivery'
            }
        }
    },
    '4': {
        discovery_screen_recent_orders: {
            status: 'ENABLED',
            options: null
        },
        hygiene_rating: {
            status: 'DISABLED',
            options: null
        },
        total_savings: {
            status: 'DISABLED',
            options: null
        },
        ada_chat_bot: {
            status: 'ENABLED',
            options: null
        },
        discovery_page_re_order: {
            status: 'ENABLED',
            options: null
        },
        takeaway_menu_recent_order: {
            status: 'ENABLED',
            options: null
        },
        show_recommendation: {
            status: 'ENABLED',
            options: null
        },
        show_play_store_rating_left_menu: {
            status: 'ENABLED',
            options: null
        },
        live_tracking: {
            status: 'ENABLED',
            options: null
        },
        native_app: {
            status: 'ENABLED',
            options: null
        },
        foodhub_wallet: {
            status: 'DISABLED',
            options: null
        },
        contactless_delivery: {
            status: 'DISABLED',
            options: null
        },
        saved_cards: {
            status: 'DISABLED',
            options: null
        },
        apple_pay: {
            status: 'DISABLED',
            options: null
        },
        code_push_silent: {
            status: 'ENABLED',
            options: {
                '9.8': {
                    status: 'ENABLED'
                },
                '9.9': {
                    status: 'ENABLED'
                },
                '9.10': {
                    status: 'DISABLED'
                },
                '9.11': {
                    status: 'ENABLED'
                },
                '9.12': {
                    status: 'ENABLED'
                },
                '9.13': {
                    status: 'ENABLED'
                },
                '9.14': {
                    status: 'ENABLED'
                },
                '9.15': {
                    status: 'ENABLED'
                },
                '9.16': {
                    status: 'ENABLED'
                }
            }
        },
        consumer_cancel_request: {
            status: 'ENABLED',
            options: {
                wait_time_after_order_accepted: 180,
                pre_order_cancellation_duration: 3600,
                allowed_refund_upto: 3600
            }
        },
        segment_enabled: {
            status: 'DISABLED',
            options: null
        },
        braze_enabled: {
            status: 'DISABLED',
            options: null
        },
        zoho_desk: {
            status: 'ENABLED',
            options: null
        },
        haptic_feedback: {
            status: 'ENABLED',
            options: {
                addon_added: 'impactLight',
                order_placed: 'notificationSuccess',
                item_added: 'impactMedium'
            }
        },
        takeaway_cuisine_list: {
            status: 'ENABLED',
            options: {
                cuisine_list_count: 20
            }
        },
        chat_bot_duration: {
            status: 'ENABLED',
            options: {
                duration: DEFAULT_CHAT_BOT_DURATION
            }
        },
        basket_items_reminder: {
            enable: true,
            schedule_mins: 5
        },
        orderTypeForCoupon: {
            enable: false
        },
        google_pay: {
            status: 'DISABLED',
            enable: false
        },
        google_pay_3ds: {
            status: 'DISABLED',
            enable: false
        },
        referral_campaign: {
            status: 'DISABLED',
            enable: false
        },
        showTips_UI: {
            status: 'DISABLED',
            enable: false
        },
        campaign_enabled: {
            status: 'DISABLED',
            enable: false
        },
        order_type_toggle: {
            status: 'DISABLED',
            enable: false,
            options: {
                default: 'delivery'
            }
        }
    },
    '7': {
        discovery_screen_recent_orders: {
            status: 'ENABLED',
            options: null
        },
        hygiene_rating: {
            status: 'DISABLED',
            options: null
        },
        total_savings: {
            status: 'DISABLED',
            options: null
        },
        ada_chat_bot: {
            status: 'ENABLED',
            options: null
        },
        discovery_page_re_order: {
            status: 'ENABLED',
            options: null
        },
        takeaway_menu_recent_order: {
            status: 'ENABLED',
            options: null
        },
        show_recommendation: {
            status: 'ENABLED',
            options: null
        },
        show_play_store_rating_left_menu: {
            status: 'ENABLED',
            options: null
        },
        live_tracking: {
            status: 'ENABLED',
            options: null
        },
        native_app: {
            status: 'ENABLED',
            options: null
        },
        foodhub_wallet: {
            status: 'DISABLED',
            options: null
        },
        contactless_delivery: {
            status: 'DISABLED',
            options: null
        },
        saved_cards: {
            status: 'DISABLED',
            options: null
        },
        apple_pay: {
            status: 'DISABLED',
            options: {
                apple_review_takeaway: [816299, 811111]
            }
        },
        code_push_silent: {
            status: 'ENABLED',
            options: {
                '9.8': {
                    status: 'ENABLED'
                },
                '9.9': {
                    status: 'ENABLED'
                },
                '9.10': {
                    status: 'DISABLED'
                },
                '9.11': {
                    status: 'ENABLED'
                },
                '9.12': {
                    status: 'ENABLED'
                },
                '9.13': {
                    status: 'ENABLED'
                },
                '9.14': {
                    status: 'ENABLED'
                },
                '9.15': {
                    status: 'ENABLED'
                },
                '9.16': {
                    status: 'ENABLED'
                }
            }
        },
        consumer_cancel_request: {
            status: 'ENABLED',
            options: {
                wait_time_after_order_accepted: 180,
                pre_order_cancellation_duration: 3600,
                allowed_refund_upto: 3600
            }
        },
        segment_enabled: {
            status: 'DISABLED',
            options: null
        },
        braze_enabled: {
            status: 'DISABLED',
            options: null
        },
        zoho_desk: {
            status: 'ENABLED',
            options: null
        },
        haptic_feedback: {
            status: 'ENABLED',
            options: {
                addon_added: 'impactLight',
                order_placed: 'notificationSuccess',
                item_added: 'impactMedium'
            }
        },
        takeaway_cuisine_list: {
            status: 'ENABLED',
            options: {
                cuisine_list_count: 20
            }
        },
        chat_bot_duration: {
            status: 'ENABLED',
            options: {
                duration: DEFAULT_CHAT_BOT_DURATION
            }
        },
        basket_items_reminder: {
            enable: true,
            schedule_mins: 5
        },
        orderTypeForCoupon: {
            enable: false
        },
        google_pay: {
            status: 'DISABLED',
            enable: false
        },
        google_pay_3ds: {
            status: 'ENABLED',
            enable: true
        },
        referral_campaign: {
            status: 'DISABLED',
            enable: false
        },
        showTips_UI: {
            status: 'DISABLED',
            enable: false
        },
        campaign_enabled: {
            status: 'DISABLED',
            enable: false
        },
        order_type_toggle: {
            status: 'ENABLED',
            enable: true,
            options: {
                default: 'delivery'
            }
        }
    },
    '8': {
        discovery_screen_recent_orders: {
            status: 'ENABLED',
            options: null
        },
        hygiene_rating: {
            status: 'DISABLED',
            options: null
        },
        total_savings: {
            status: 'DISABLED',
            options: null
        },
        ada_chat_bot: {
            status: 'ENABLED',
            options: null
        },
        discovery_page_re_order: {
            status: 'ENABLED',
            options: null
        },
        takeaway_menu_recent_order: {
            status: 'ENABLED',
            options: null
        },
        show_recommendation: {
            status: 'ENABLED',
            options: null
        },
        show_play_store_rating_left_menu: {
            status: 'ENABLED',
            options: null
        },
        live_tracking: {
            status: 'ENABLED',
            options: null
        },
        native_app: {
            status: 'ENABLED',
            options: null
        },
        foodhub_wallet: {
            status: 'DISABLED',
            options: null
        },
        contactless_delivery: {
            status: 'DISABLED',
            options: null
        },
        saved_cards: {
            status: 'DISABLED',
            options: null
        },
        apple_pay: {
            status: 'DISABLED',
            options: null
        },
        code_push_silent: {
            status: 'ENABLED',
            options: {
                '9.8': {
                    status: 'ENABLED'
                },
                '9.9': {
                    status: 'ENABLED'
                },
                '9.10': {
                    status: 'DISABLED'
                },
                '9.11': {
                    status: 'ENABLED'
                },
                '9.12': {
                    status: 'ENABLED'
                },
                '9.13': {
                    status: 'ENABLED'
                },
                '9.14': {
                    status: 'ENABLED'
                },
                '9.15': {
                    status: 'ENABLED'
                },
                '9.16': {
                    status: 'ENABLED'
                }
            }
        },
        consumer_cancel_request: {
            status: 'ENABLED',
            options: {
                wait_time_after_order_accepted: 180,
                pre_order_cancellation_duration: 3600,
                allowed_refund_upto: 3600
            }
        },
        segment_enabled: {
            status: 'DISABLED',
            options: null
        },
        braze_enabled: {
            status: 'DISABLED',
            options: null
        },
        zoho_desk: {
            status: 'ENABLED',
            options: null
        },
        haptic_feedback: {
            status: 'ENABLED',
            options: {
                addon_added: 'impactLight',
                order_placed: 'notificationSuccess',
                item_added: 'impactMedium'
            }
        },
        takeaway_cuisine_list: {
            status: 'ENABLED',
            options: {
                cuisine_list_count: 20
            }
        },
        chat_bot_duration: {
            status: 'ENABLED',
            options: {
                duration: DEFAULT_CHAT_BOT_DURATION
            }
        },
        basket_items_reminder: {
            enable: true,
            schedule_mins: 5
        },
        orderTypeForCoupon: {
            enable: false
        },
        google_pay: {
            status: 'DISABLED',
            enable: false
        },
        google_pay_3ds: {
            status: 'DISABLED',
            enable: false
        },
        referral_campaign: {
            status: 'DISABLED',
            enable: false
        },
        showTips_UI: {
            status: 'DISABLED',
            enable: false
        },
        campaign_enabled: {
            status: 'DISABLED',
            enable: false
        },
        order_type_toggle: {
            status: 'ENABLED',
            enable: true,
            options: {
                default: 'delivery'
            }
        }
    },
    '9': {
        discovery_screen_recent_orders: {
            status: 'ENABLED',
            options: null
        },
        hygiene_rating: {
            status: 'DISABLED',
            options: null
        },
        total_savings: {
            status: 'DISABLED',
            options: null
        },
        ada_chat_bot: {
            status: 'ENABLED',
            options: null
        },
        discovery_page_re_order: {
            status: 'ENABLED',
            options: null
        },
        takeaway_menu_recent_order: {
            status: 'ENABLED',
            options: null
        },
        show_recommendation: {
            status: 'ENABLED',
            options: null
        },
        show_play_store_rating_left_menu: {
            status: 'ENABLED',
            options: null
        },
        live_tracking: {
            status: 'ENABLED',
            options: null
        },
        native_app: {
            status: 'ENABLED',
            options: null
        },
        foodhub_wallet: {
            status: 'DISABLED',
            options: null
        },
        contactless_delivery: {
            status: 'DISABLED',
            options: null
        },
        saved_cards: {
            status: 'DISABLED',
            options: null
        },
        apple_pay: {
            status: 'DISABLED',
            options: null
        },
        code_push_silent: {
            status: 'ENABLED',
            options: {
                '9.8': {
                    status: 'ENABLED'
                },
                '9.9': {
                    status: 'ENABLED'
                },
                '9.10': {
                    status: 'DISABLED'
                },
                '9.11': {
                    status: 'ENABLED'
                },
                '9.12': {
                    status: 'ENABLED'
                },
                '9.13': {
                    status: 'ENABLED'
                },
                '9.14': {
                    status: 'ENABLED'
                },
                '9.15': {
                    status: 'ENABLED'
                },
                '9.16': {
                    status: 'ENABLED'
                }
            }
        },
        consumer_cancel_request: {
            status: 'ENABLED',
            options: {
                wait_time_after_order_accepted: 180,
                pre_order_cancellation_duration: 3600,
                allowed_refund_upto: 3600
            }
        },
        segment_enabled: {
            status: 'DISABLED',
            options: null
        },
        braze_enabled: {
            status: 'DISABLED',
            options: null
        },
        zoho_desk: {
            status: 'ENABLED',
            options: null
        },
        haptic_feedback: {
            status: 'ENABLED',
            options: {
                addon_added: 'impactLight',
                order_placed: 'notificationSuccess',
                item_added: 'impactMedium'
            }
        },
        takeaway_cuisine_list: {
            status: 'ENABLED',
            options: {
                cuisine_list_count: 20
            }
        },
        chat_bot_duration: {
            status: 'ENABLED',
            options: {
                duration: DEFAULT_CHAT_BOT_DURATION
            }
        },
        basket_items_reminder: {
            enable: true,
            schedule_mins: 5
        },
        orderTypeForCoupon: {
            enable: false
        },
        google_pay: {
            status: 'DISABLED',
            enable: false
        },
        google_pay_3ds: {
            status: 'DISABLED',
            enable: false
        },
        referral_campaign: {
            status: 'DISABLED',
            enable: false
        },
        showTips_UI: {
            status: 'DISABLED',
            enable: false
        },
        campaign_enabled: {
            status: 'DISABLED',
            enable: false
        },
        order_type_toggle: {
            status: 'ENABLED',
            enable: true,
            options: {
                default: 'delivery'
            }
        }
    }
};
export const CUSTOMER_FEATURE_GATE_CONFIG = {
    '1': {
        discovery_screen_recent_orders: {
            status: 'ENABLED',
            options: null
        },
        hygiene_rating: {
            status: 'ENABLED',
            options: null
        },
        total_savings: {
            status: 'ENABLED',
            options: null
        },
        ada_chat_bot: {
            status: 'ENABLED',
            options: null
        },
        discovery_page_re_order: {
            status: 'ENABLED',
            options: null
        },
        takeaway_menu_recent_order: {
            status: 'ENABLED',
            options: null
        },
        show_recommendation: {
            status: 'DISABLED',
            options: null
        },
        show_play_store_rating_left_menu: {
            status: 'ENABLED',
            options: null
        },
        live_tracking: {
            status: 'ENABLED',
            options: null
        },
        native_app: {
            status: 'ENABLED',
            options: null
        },
        foodhub_wallet: {
            status: 'DISABLED',
            options: null
        },
        contactless_delivery: {
            status: 'DISABLED',
            options: null
        },
        saved_cards: {
            status: 'ENABLED',
            options: null
        },
        apple_pay: {
            status: 'DISABLED',
            options: {
                apple_review_takeaway: [816299, 811111]
            }
        },
        code_push_silent: {
            status: 'ENABLED',
            options: {
                '9.8': {
                    status: 'ENABLED'
                },
                '9.9': {
                    status: 'ENABLED'
                },
                '9.10': {
                    status: 'DISABLED'
                },
                '9.11': {
                    status: 'ENABLED'
                },
                '9.12': {
                    status: 'ENABLED'
                },
                '9.13': {
                    status: 'ENABLED'
                },
                '9.14': {
                    status: 'ENABLED'
                },
                '9.15': {
                    status: 'ENABLED'
                },
                '9.16': {
                    status: 'ENABLED'
                }
            }
        },
        basket_recommendation: {
            status: 'DISABLED',
            options: null
        },
        consumer_cancel_request: {
            status: 'ENABLED',
            options: {
                wait_time_after_order_accepted: 180,
                pre_order_cancellation_duration: 3600,
                allowed_refund_upto: 3600
            }
        },
        segment_enabled: {
            status: 'DISABLED',
            options: null
        },
        braze_enabled: {
            status: 'DISABLED',
            options: null
        },
        zoho_desk: {
            status: 'ENABLED',
            options: null
        },
        haptic_feedback: {
            status: 'ENABLED',
            options: {
                addon_added: 'impactLight',
                order_placed: 'notificationSuccess',
                item_added: 'impactMedium'
            }
        },
        takeaway_cuisine_list: {
            status: 'ENABLED',
            options: {
                cuisine_list_count: 20
            }
        },
        chat_bot_duration: {
            status: 'ENABLED',
            options: {
                duration: DEFAULT_CHAT_BOT_DURATION
            }
        },
        basket_items_reminder: {
            enable: true,
            schedule_mins: 5
        },
        orderTypeForCoupon: {
            enable: false
        },
        google_pay: {
            status: 'DISABLED',
            enable: false
        },
        google_pay_3ds: {
            status: 'DISABLED',
            enable: false
        },
        referral_campaign: {
            status: 'DISABLED',
            enable: false
        },
        showTips_UI: {
            status: 'DISABLED',
            enable: false
        },
        campaign_enabled: {
            status: 'DISABLED',
            enable: false
        },
        order_type_toggle: {
            status: 'ENABLED',
            enable: true,
            options: {
                default: 'delivery'
            }
        },
        skip_store_status: {
            status: 'DISABLED',
            enable: false
        },
        log_close_takeaway: {
            status: 'DISABLED',
            enable: false
        },
        store_endpoint_hit_durations: {
            interval: 5
        },
        store_api_optimisation: {
            enable: false
        }
    },
    '2': {
        discovery_screen_recent_orders: {
            status: 'ENABLED',
            options: null
        },
        hygiene_rating: {
            status: 'DISABLED',
            options: null
        },
        total_savings: {
            status: 'DISABLED',
            options: null
        },
        ada_chat_bot: {
            status: 'ENABLED',
            options: null
        },
        discovery_page_re_order: {
            status: 'ENABLED',
            options: null
        },
        takeaway_menu_recent_order: {
            status: 'ENABLED',
            options: null
        },
        show_recommendation: {
            status: 'DISABLED',
            options: null
        },
        show_play_store_rating_left_menu: {
            status: 'ENABLED',
            options: null
        },
        live_tracking: {
            status: 'ENABLED',
            options: null
        },
        native_app: {
            status: 'ENABLED',
            options: null
        },
        foodhub_wallet: {
            status: 'DISABLED',
            options: null
        },
        contactless_delivery: {
            status: 'DISABLED',
            options: null
        },
        saved_cards: {
            status: 'DISABLED',
            options: null
        },
        apple_pay: {
            status: 'DISABLED',
            options: {
                apple_review_takeaway: [816299, 811111]
            }
        },
        code_push_silent: {
            status: 'ENABLED',
            options: {
                '9.8': {
                    status: 'ENABLED'
                },
                '9.9': {
                    status: 'ENABLED'
                },
                '9.10': {
                    status: 'DISABLED'
                },
                '9.11': {
                    status: 'ENABLED'
                },
                '9.12': {
                    status: 'ENABLED'
                },
                '9.13': {
                    status: 'ENABLED'
                },
                '9.14': {
                    status: 'ENABLED'
                },
                '9.15': {
                    status: 'ENABLED'
                },
                '9.16': {
                    status: 'ENABLED'
                }
            }
        },
        consumer_cancel_request: {
            status: 'ENABLED',
            options: {
                wait_time_after_order_accepted: 180,
                pre_order_cancellation_duration: 3600,
                allowed_refund_upto: 3600
            }
        },
        segment_enabled: {
            status: 'DISABLED',
            options: null
        },
        braze_enabled: {
            status: 'DISABLED',
            options: null
        },
        zoho_desk: {
            status: 'ENABLED',
            options: null
        },
        haptic_feedback: {
            status: 'ENABLED',
            options: {
                addon_added: 'impactLight',
                order_placed: 'notificationSuccess',
                item_added: 'impactMedium'
            }
        },
        takeaway_cuisine_list: {
            status: 'ENABLED',
            options: {
                cuisine_list_count: 20
            }
        },
        chat_bot_duration: {
            status: 'ENABLED',
            options: {
                duration: DEFAULT_CHAT_BOT_DURATION
            }
        },
        basket_items_reminder: {
            enable: true,
            schedule_mins: 5
        },
        orderTypeForCoupon: {
            enable: false
        },
        google_pay: {
            status: 'DISABLED',
            enable: false
        },
        google_pay_3ds: {
            status: 'DISABLED',
            enable: false
        },
        referral_campaign: {
            status: 'DISABLED',
            enable: false
        },
        showTips_UI: {
            status: 'DISABLED',
            enable: false
        },
        campaign_enabled: {
            status: 'DISABLED',
            enable: false
        },
        order_type_toggle: {
            status: 'ENABLED',
            enable: true,
            options: {
                default: 'delivery'
            }
        },
        skip_store_status: {
            status: 'DISABLED',
            enable: false
        },
        log_close_takeaway: {
            status: 'DISABLED',
            enable: false
        },
        store_endpoint_hit_durations: {
            interval: 5
        },
        store_api_optimisation: {
            enable: false
        }
    },
    '3': {
        discovery_screen_recent_orders: {
            status: 'ENABLED',
            options: null
        },
        hygiene_rating: {
            status: 'DISABLED',
            options: null
        },
        total_savings: {
            status: 'DISABLED',
            options: null
        },
        ada_chat_bot: {
            status: 'ENABLED',
            options: null
        },
        discovery_page_re_order: {
            status: 'ENABLED',
            options: null
        },
        takeaway_menu_recent_order: {
            status: 'ENABLED',
            options: null
        },
        show_recommendation: {
            status: 'DISABLED',
            options: null
        },
        show_play_store_rating_left_menu: {
            status: 'ENABLED',
            options: null
        },
        live_tracking: {
            status: 'ENABLED',
            options: null
        },
        native_app: {
            status: 'ENABLED',
            options: null
        },
        foodhub_wallet: {
            status: 'DISABLED',
            options: null
        },
        contactless_delivery: {
            status: 'DISABLED',
            options: null
        },
        saved_cards: {
            status: 'DISABLED',
            options: null
        },
        apple_pay: {
            status: 'DISABLED',
            options: null
        },
        code_push_silent: {
            status: 'ENABLED',
            options: {
                '9.8': {
                    status: 'ENABLED'
                },
                '9.9': {
                    status: 'ENABLED'
                },
                '9.10': {
                    status: 'DISABLED'
                },
                '9.11': {
                    status: 'ENABLED'
                },
                '9.12': {
                    status: 'ENABLED'
                },
                '9.13': {
                    status: 'ENABLED'
                },
                '9.14': {
                    status: 'ENABLED'
                },
                '9.15': {
                    status: 'ENABLED'
                },
                '9.16': {
                    status: 'ENABLED'
                }
            }
        },
        consumer_cancel_request: {
            status: 'ENABLED',
            options: {
                wait_time_after_order_accepted: 180,
                pre_order_cancellation_duration: 3600,
                allowed_refund_upto: 3600
            }
        },
        segment_enabled: {
            status: 'DISABLED',
            options: null
        },
        braze_enabled: {
            status: 'DISABLED',
            options: null
        },
        zoho_desk: {
            status: 'ENABLED',
            options: null
        },
        haptic_feedback: {
            status: 'ENABLED',
            options: {
                addon_added: 'impactLight',
                order_placed: 'notificationSuccess',
                item_added: 'impactMedium'
            }
        },
        takeaway_cuisine_list: {
            status: 'ENABLED',
            options: {
                cuisine_list_count: 20
            }
        },
        chat_bot_duration: {
            status: 'ENABLED',
            options: {
                duration: DEFAULT_CHAT_BOT_DURATION
            }
        },
        basket_items_reminder: {
            enable: true,
            schedule_mins: 5
        },
        orderTypeForCoupon: {
            enable: false
        },
        google_pay: {
            status: 'DISABLED',
            enable: false
        },
        google_pay_3ds: {
            status: 'DISABLED',
            enable: false
        },
        referral_campaign: {
            status: 'DISABLED',
            enable: false
        },
        showTips_UI: {
            status: 'DISABLED',
            enable: false
        },
        campaign_enabled: {
            status: 'DISABLED',
            enable: false
        },
        order_type_toggle: {
            status: 'DISABLED',
            enable: false,
            options: {
                default: 'delivery'
            }
        },
        skip_store_status: {
            status: 'DISABLED',
            enable: false
        },
        log_close_takeaway: {
            status: 'DISABLED',
            enable: false
        },
        store_endpoint_hit_durations: {
            interval: 5
        },
        store_api_optimisation: {
            enable: false
        }
    },
    '4': {
        discovery_screen_recent_orders: {
            status: 'ENABLED',
            options: null
        },
        hygiene_rating: {
            status: 'DISABLED',
            options: null
        },
        total_savings: {
            status: 'DISABLED',
            options: null
        },
        ada_chat_bot: {
            status: 'ENABLED',
            options: null
        },
        discovery_page_re_order: {
            status: 'ENABLED',
            options: null
        },
        takeaway_menu_recent_order: {
            status: 'ENABLED',
            options: null
        },
        show_recommendation: {
            status: 'DISABLED',
            options: null
        },
        show_play_store_rating_left_menu: {
            status: 'ENABLED',
            options: null
        },
        live_tracking: {
            status: 'ENABLED',
            options: null
        },
        native_app: {
            status: 'ENABLED',
            options: null
        },
        foodhub_wallet: {
            status: 'DISABLED',
            options: null
        },
        contactless_delivery: {
            status: 'DISABLED',
            options: null
        },
        saved_cards: {
            status: 'DISABLED',
            options: null
        },
        apple_pay: {
            status: 'DISABLED',
            options: null
        },
        code_push_silent: {
            status: 'ENABLED',
            options: {
                '9.8': {
                    status: 'ENABLED'
                },
                '9.9': {
                    status: 'ENABLED'
                },
                '9.10': {
                    status: 'DISABLED'
                },
                '9.11': {
                    status: 'ENABLED'
                },
                '9.12': {
                    status: 'ENABLED'
                },
                '9.13': {
                    status: 'ENABLED'
                },
                '9.14': {
                    status: 'ENABLED'
                },
                '9.15': {
                    status: 'ENABLED'
                },
                '9.16': {
                    status: 'ENABLED'
                }
            }
        },
        consumer_cancel_request: {
            status: 'ENABLED',
            options: {
                wait_time_after_order_accepted: 180,
                pre_order_cancellation_duration: 3600,
                allowed_refund_upto: 3600
            }
        },
        segment_enabled: {
            status: 'DISABLED',
            options: null
        },
        braze_enabled: {
            status: 'DISABLED',
            options: null
        },
        zoho_desk: {
            status: 'ENABLED',
            options: null
        },
        haptic_feedback: {
            status: 'ENABLED',
            options: {
                addon_added: 'impactLight',
                order_placed: 'notificationSuccess',
                item_added: 'impactMedium'
            }
        },
        takeaway_cuisine_list: {
            status: 'ENABLED',
            options: {
                cuisine_list_count: 20
            }
        },
        chat_bot_duration: {
            status: 'ENABLED',
            options: {
                duration: DEFAULT_CHAT_BOT_DURATION
            }
        },
        basket_items_reminder: {
            enable: true,
            schedule_mins: 5
        },
        orderTypeForCoupon: {
            enable: false
        },
        google_pay: {
            status: 'DISABLED',
            enable: false
        },
        google_pay_3ds: {
            status: 'DISABLED',
            enable: false
        },
        referral_campaign: {
            status: 'DISABLED',
            enable: false
        },
        showTips_UI: {
            status: 'DISABLED',
            enable: false
        },
        campaign_enabled: {
            status: 'DISABLED',
            enable: false
        },
        order_type_toggle: {
            status: 'DISABLED',
            enable: false,
            options: {
                default: 'delivery'
            }
        },
        skip_store_status: {
            status: 'DISABLED',
            enable: false
        },
        log_close_takeaway: {
            status: 'DISABLED',
            enable: false
        },
        store_endpoint_hit_durations: {
            interval: 5
        },
        store_api_optimisation: {
            enable: false
        }
    },
    '7': {
        discovery_screen_recent_orders: {
            status: 'ENABLED',
            options: null
        },
        hygiene_rating: {
            status: 'DISABLED',
            options: null
        },
        total_savings: {
            status: 'DISABLED',
            options: null
        },
        ada_chat_bot: {
            status: 'ENABLED',
            options: null
        },
        discovery_page_re_order: {
            status: 'ENABLED',
            options: null
        },
        takeaway_menu_recent_order: {
            status: 'ENABLED',
            options: null
        },
        show_recommendation: {
            status: 'DISABLED',
            options: null
        },
        show_play_store_rating_left_menu: {
            status: 'ENABLED',
            options: null
        },
        live_tracking: {
            status: 'ENABLED',
            options: null
        },
        native_app: {
            status: 'ENABLED',
            options: null
        },
        foodhub_wallet: {
            status: 'DISABLED',
            options: null
        },
        contactless_delivery: {
            status: 'DISABLED',
            options: null
        },
        saved_cards: {
            status: 'DISABLED',
            options: null
        },
        apple_pay: {
            status: 'DISABLED',
            options: {
                apple_review_takeaway: [816299, 811111]
            }
        },
        code_push_silent: {
            status: 'ENABLED',
            options: {
                '9.8': {
                    status: 'ENABLED'
                },
                '9.9': {
                    status: 'ENABLED'
                },
                '9.10': {
                    status: 'DISABLED'
                },
                '9.11': {
                    status: 'ENABLED'
                },
                '9.12': {
                    status: 'ENABLED'
                },
                '9.13': {
                    status: 'ENABLED'
                },
                '9.14': {
                    status: 'ENABLED'
                },
                '9.15': {
                    status: 'ENABLED'
                },
                '9.16': {
                    status: 'ENABLED'
                }
            }
        },
        consumer_cancel_request: {
            status: 'ENABLED',
            options: {
                wait_time_after_order_accepted: 180,
                pre_order_cancellation_duration: 3600,
                allowed_refund_upto: 3600
            }
        },
        segment_enabled: {
            status: 'DISABLED',
            options: null
        },
        braze_enabled: {
            status: 'DISABLED',
            options: null
        },
        zoho_desk: {
            status: 'ENABLED',
            options: null
        },
        haptic_feedback: {
            status: 'ENABLED',
            options: {
                addon_added: 'impactLight',
                order_placed: 'notificationSuccess',
                item_added: 'impactMedium'
            }
        },
        takeaway_cuisine_list: {
            status: 'ENABLED',
            options: {
                cuisine_list_count: 20
            }
        },
        chat_bot_duration: {
            status: 'ENABLED',
            options: {
                duration: DEFAULT_CHAT_BOT_DURATION
            }
        },
        basket_items_reminder: {
            enable: true,
            schedule_mins: 5
        },
        orderTypeForCoupon: {
            enable: false
        },
        google_pay: {
            status: 'DISABLED',
            enable: false
        },
        google_pay_3ds: {
            status: 'DISABLED',
            enable: false
        },
        referral_campaign: {
            status: 'DISABLED',
            enable: false
        },
        showTips_UI: {
            status: 'DISABLED',
            enable: false
        },
        campaign_enabled: {
            status: 'DISABLED',
            enable: false
        },
        order_type_toggle: {
            status: 'ENABLED',
            enable: true,
            options: {
                default: 'delivery'
            }
        },
        skip_store_status: {
            status: 'DISABLED',
            enable: false
        },
        log_close_takeaway: {
            status: 'DISABLED',
            enable: false
        },
        store_endpoint_hit_durations: {
            interval: 5
        },
        store_api_optimisation: {
            enable: false
        }
    },
    '8': {
        discovery_screen_recent_orders: {
            status: 'ENABLED',
            options: null
        },
        hygiene_rating: {
            status: 'DISABLED',
            options: null
        },
        total_savings: {
            status: 'DISABLED',
            options: null
        },
        ada_chat_bot: {
            status: 'ENABLED',
            options: null
        },
        discovery_page_re_order: {
            status: 'ENABLED',
            options: null
        },
        takeaway_menu_recent_order: {
            status: 'ENABLED',
            options: null
        },
        show_recommendation: {
            status: 'DISABLED',
            options: null
        },
        show_play_store_rating_left_menu: {
            status: 'ENABLED',
            options: null
        },
        live_tracking: {
            status: 'ENABLED',
            options: null
        },
        native_app: {
            status: 'ENABLED',
            options: null
        },
        foodhub_wallet: {
            status: 'DISABLED',
            options: null
        },
        contactless_delivery: {
            status: 'DISABLED',
            options: null
        },
        saved_cards: {
            status: 'DISABLED',
            options: null
        },
        apple_pay: {
            status: 'DISABLED',
            options: null
        },
        code_push_silent: {
            status: 'ENABLED',
            options: {
                '9.8': {
                    status: 'ENABLED'
                },
                '9.9': {
                    status: 'ENABLED'
                },
                '9.10': {
                    status: 'DISABLED'
                },
                '9.11': {
                    status: 'ENABLED'
                },
                '9.12': {
                    status: 'ENABLED'
                },
                '9.13': {
                    status: 'ENABLED'
                },
                '9.14': {
                    status: 'ENABLED'
                },
                '9.15': {
                    status: 'ENABLED'
                },
                '9.16': {
                    status: 'ENABLED'
                }
            }
        },
        consumer_cancel_request: {
            status: 'ENABLED',
            options: {
                wait_time_after_order_accepted: 180,
                pre_order_cancellation_duration: 3600,
                allowed_refund_upto: 3600
            }
        },
        segment_enabled: {
            status: 'DISABLED',
            options: null
        },
        braze_enabled: {
            status: 'DISABLED',
            options: null
        },
        zoho_desk: {
            status: 'ENABLED',
            options: null
        },
        haptic_feedback: {
            status: 'ENABLED',
            options: {
                addon_added: 'impactLight',
                order_placed: 'notificationSuccess',
                item_added: 'impactMedium'
            }
        },
        takeaway_cuisine_list: {
            status: 'ENABLED',
            options: {
                cuisine_list_count: 20
            }
        },
        chat_bot_duration: {
            status: 'ENABLED',
            options: {
                duration: DEFAULT_CHAT_BOT_DURATION
            }
        },
        basket_items_reminder: {
            enable: true,
            schedule_mins: 5
        },
        orderTypeForCoupon: {
            enable: false
        },
        google_pay: {
            status: 'DISABLED',
            enable: false
        },
        google_pay_3ds: {
            status: 'DISABLED',
            enable: false
        },
        referral_campaign: {
            status: 'DISABLED',
            enable: false
        },
        showTips_UI: {
            status: 'DISABLED',
            enable: false
        },
        campaign_enabled: {
            status: 'DISABLED',
            enable: false
        },
        order_type_toggle: {
            status: 'ENABLED',
            enable: true,
            options: {
                default: 'delivery'
            }
        },
        skip_store_status: {
            status: 'DISABLED',
            enable: false
        },
        log_close_takeaway: {
            status: 'DISABLED',
            enable: false
        },
        store_endpoint_hit_durations: {
            interval: 5
        },
        store_api_optimisation: {
            enable: false
        }
    },
    '9': {
        discovery_screen_recent_orders: {
            status: 'ENABLED',
            options: null
        },
        hygiene_rating: {
            status: 'DISABLED',
            options: null
        },
        total_savings: {
            status: 'DISABLED',
            options: null
        },
        ada_chat_bot: {
            status: 'ENABLED',
            options: null
        },
        discovery_page_re_order: {
            status: 'ENABLED',
            options: null
        },
        takeaway_menu_recent_order: {
            status: 'ENABLED',
            options: null
        },
        show_recommendation: {
            status: 'DISABLED',
            options: null
        },
        show_play_store_rating_left_menu: {
            status: 'ENABLED',
            options: null
        },
        live_tracking: {
            status: 'ENABLED',
            options: null
        },
        native_app: {
            status: 'ENABLED',
            options: null
        },
        foodhub_wallet: {
            status: 'DISABLED',
            options: null
        },
        contactless_delivery: {
            status: 'DISABLED',
            options: null
        },
        saved_cards: {
            status: 'DISABLED',
            options: null
        },
        apple_pay: {
            status: 'DISABLED',
            options: null
        },
        code_push_silent: {
            status: 'ENABLED',
            options: {
                '9.8': {
                    status: 'ENABLED'
                },
                '9.9': {
                    status: 'ENABLED'
                },
                '9.10': {
                    status: 'DISABLED'
                },
                '9.11': {
                    status: 'ENABLED'
                },
                '9.12': {
                    status: 'ENABLED'
                },
                '9.13': {
                    status: 'ENABLED'
                },
                '9.14': {
                    status: 'ENABLED'
                },
                '9.15': {
                    status: 'ENABLED'
                },
                '9.16': {
                    status: 'ENABLED'
                }
            }
        },
        consumer_cancel_request: {
            status: 'ENABLED',
            options: {
                wait_time_after_order_accepted: 180,
                pre_order_cancellation_duration: 3600,
                allowed_refund_upto: 3600
            }
        },
        segment_enabled: {
            status: 'DISABLED',
            options: null
        },
        braze_enabled: {
            status: 'DISABLED',
            options: null
        },
        zoho_desk: {
            status: 'ENABLED',
            options: null
        },
        haptic_feedback: {
            status: 'ENABLED',
            options: {
                addon_added: 'impactLight',
                order_placed: 'notificationSuccess',
                item_added: 'impactMedium'
            }
        },
        takeaway_cuisine_list: {
            status: 'ENABLED',
            options: {
                cuisine_list_count: 20
            }
        },
        chat_bot_duration: {
            status: 'ENABLED',
            options: {
                duration: DEFAULT_CHAT_BOT_DURATION
            }
        },
        basket_items_reminder: {
            enable: true,
            schedule_mins: 5
        },
        orderTypeForCoupon: {
            enable: false
        },
        google_pay: {
            status: 'DISABLED',
            enable: false
        },
        google_pay_3ds: {
            status: 'DISABLED',
            enable: false
        },
        referral_campaign: {
            status: 'DISABLED',
            enable: false
        },
        showTips_UI: {
            status: 'DISABLED',
            enable: false
        },
        campaign_enabled: {
            status: 'DISABLED',
            enable: false
        },
        order_type_toggle: {
            status: 'ENABLED',
            enable: true,
            options: {
                default: 'delivery'
            }
        },
        skip_store_status: {
            status: 'DISABLED',
            enable: true
        },
        log_close_takeaway: {
            status: 'DISABLED',
            enable: false
        },
        store_endpoint_hit_durations: {
            interval: 5
        },
        store_api_optimisation: {
            enable: false
        }
    }
};
