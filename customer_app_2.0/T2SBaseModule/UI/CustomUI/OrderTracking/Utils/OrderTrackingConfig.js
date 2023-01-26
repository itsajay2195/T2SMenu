import colors from 't2sbasemodule/Themes/Colors';

export const ORDER_STATUS_ENUM = Object.freeze({
    PLACED: 1,
    COOKING: 2,
    READY: 3,
    COLLECT: 3.5,
    DELIVERED: 4,
    OTHER: 0
});

export const ORDER_STATUS_ICON_ANIMATION_JSON = {
    COLLECTION_TYPE_WITH_STAGE_1: {
        PLACED: require('./OrderTrackingAnimation/placed_green'),
        COOKING: require('./OrderTrackingAnimation/Cooking_silver'),
        READY: require('./OrderTrackingAnimation/Collection_silver')
    },
    COLLECTION_TYPE_WITH_STAGE_2: {
        PLACED: require('./OrderTrackingAnimation/placed_green'),
        COOKING: require('./OrderTrackingAnimation/Cooking_orange'),
        READY: require('./OrderTrackingAnimation/Collection_silver')
    },
    COLLECTION_TYPE_WITH_STAGE_3: {
        PLACED: require('./OrderTrackingAnimation/placed_green'),
        COOKING: require('./OrderTrackingAnimation/Cooking_green'),
        READY: require('./OrderTrackingAnimation/Collection')
    },
    COLLECTION_TYPE_WITH_STAGE_4: {
        PLACED: require('./OrderTrackingAnimation/placed_green'),
        COOKING: require('./OrderTrackingAnimation/Cooking_green'),
        READY: require('./OrderTrackingAnimation/Collection_green')
    },
    DELIVERY_TYPE_WITH_STAGE_1: {
        PLACED: require('./OrderTrackingAnimation/placed_green'),
        COOKING: require('./OrderTrackingAnimation/Cooking_silver'),
        READY: require('./OrderTrackingAnimation/On_the_way_silver'),
        DELIVERED: require('./OrderTrackingAnimation/Delivered_silver')
    },
    DELIVERY_TYPE_WITH_STAGE_2: {
        PLACED: require('./OrderTrackingAnimation/placed_green'),
        COOKING: require('./OrderTrackingAnimation/Cooking_orange'),
        READY: require('./OrderTrackingAnimation/On_the_way_silver'),
        DELIVERED: require('./OrderTrackingAnimation/Delivered_silver')
    },
    DELIVERY_TYPE_WITH_STAGE_3: {
        PLACED: require('./OrderTrackingAnimation/placed_green'),
        COOKING: require('./OrderTrackingAnimation/Cooking_green'),
        READY: require('./OrderTrackingAnimation/On_the_way_orange'),
        DELIVERED: require('./OrderTrackingAnimation/Delivered_silver')
    },
    DELIVERY_TYPE_WITH_STAGE_4: {
        PLACED: require('./OrderTrackingAnimation/placed_green'),
        COOKING: require('./OrderTrackingAnimation/Cooking_green'),
        READY: require('./OrderTrackingAnimation/On_the_way_green'),
        DELIVERED: require('./OrderTrackingAnimation/Deliverd')
    }
};

export const DEFAULT_DISPLAY_PROPS = [
    {
        stageNo: ORDER_STATUS_ENUM.PLACED,
        isCompleted: false,
        textColor: colors.silver,
        stagePointColor: colors.silver,
        stageLinkColor: colors.silver,
        stageKey: 'PLACED'
    },
    {
        stageNo: ORDER_STATUS_ENUM.COOKING,
        isCompleted: false,
        textColor: colors.silver,
        stagePointColor: colors.silver,
        stageLinkColor: colors.silver,
        stageKey: 'COOKING'
    },
    {
        stageNo: ORDER_STATUS_ENUM.READY,
        isCompleted: false,
        textColor: colors.silver,
        stagePointColor: colors.silver,
        stageLinkColor: colors.silver,
        stageKey: 'READY'
    },
    {
        stageNo: ORDER_STATUS_ENUM.DELIVERED,
        isCompleted: false,
        textColor: colors.silver,
        stagePointColor: colors.silver,
        stageLinkColor: colors.silver,
        stageKey: 'DELIVERED'
    }
];

export const DEFAULT_DISPLAY_PROPS_COLLECTION = [
    {
        stageNo: ORDER_STATUS_ENUM.PLACED,
        isCompleted: false,
        textColor: colors.silver,
        stagePointColor: colors.silver,
        stageLinkColor: colors.silver,
        stageKey: 'PLACED'
    },
    {
        stageNo: ORDER_STATUS_ENUM.COOKING,
        isCompleted: false,
        textColor: colors.silver,
        stagePointColor: colors.silver,
        stageLinkColor: colors.silver,
        stageKey: 'COOKING'
    },
    {
        stageNo: ORDER_STATUS_ENUM.READY,
        isCompleted: false,
        textColor: colors.silver,
        stagePointColor: colors.silver,
        stageLinkColor: colors.silver,
        stageKey: 'READY'
    }
];
