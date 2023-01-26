import {
    convertArrayToObject,
    deleteFilterNotificationList,
    getNotificationList,
    saveCampaignNotificationPayload
} from 'appmodules/NotificationModule/Utils/NotificationHelper';
import { campaignNotifications, campaignResponseData, notificationData } from '../data';

describe('NotificationHelper Testing', () => {
    describe('getNotificationList testing', () => {
        test('getNotificationList', () => {
            expect(getNotificationList([notificationData[0]], [notificationData[1]], 1)).toEqual([notificationData[1]]);
            expect(getNotificationList([notificationData[0]], [notificationData[1]], 2)).toEqual(notificationData);
            expect(getNotificationList(undefined, [notificationData[1]], 1)).toEqual([notificationData[1]]);
            expect(getNotificationList([notificationData[0]], undefined, 1)).toEqual([]);
            expect(getNotificationList([notificationData[0]], undefined, 2)).toEqual([notificationData[0]]);
            expect(getNotificationList([notificationData[0]], null, 1)).toEqual([]);
            expect(getNotificationList([notificationData[0]], null, 2)).toEqual([notificationData[0]]);
            expect(getNotificationList(undefined, [notificationData[1]], 2)).toEqual([notificationData[1]]);
            expect(getNotificationList([notificationData[0]], [notificationData[1]], undefined)).toEqual(notificationData);
            expect(getNotificationList(undefined, undefined, 1)).toEqual([]);
            expect(getNotificationList(undefined, undefined, 2)).toEqual([]);
            expect(getNotificationList(null, null, 1)).toEqual([]);
            expect(getNotificationList(null, null, 2)).toEqual([]);
            expect(getNotificationList([], [notificationData[1]], 1)).toEqual([notificationData[1]]);
            expect(getNotificationList([notificationData[0]], [], 2)).toEqual([notificationData[0]]);
            expect(getNotificationList([], [notificationData[1]], 2)).toEqual([notificationData[1]]);
            expect(getNotificationList([], [], 1)).toEqual([]);
        });
    });

    describe('deleteFilterNotificationList testing', () => {
        test('deleteFilterNotificationList', () => {
            expect(deleteFilterNotificationList(notificationData, 7604)).toEqual([notificationData[1]]);
            expect(deleteFilterNotificationList(notificationData, 7594)).toEqual([notificationData[0]]);
            expect(deleteFilterNotificationList([], 7594)).toEqual([]);
            expect(deleteFilterNotificationList(notificationData, null)).toEqual(notificationData);
            expect(deleteFilterNotificationList(notificationData, undefined)).toEqual(notificationData);
            expect(deleteFilterNotificationList(undefined, 7594)).toEqual([]);
            expect(deleteFilterNotificationList(null, 7594)).toEqual([]);
        });
    });

    describe('convertArrayToObject Testing', () => {
        test('convertArrayToObject', () => {
            expect(convertArrayToObject({})).toBe(null);
            expect(convertArrayToObject([])).toBe(null);
            expect(convertArrayToObject(null)).toBe(null);
            expect(convertArrayToObject(undefined)).toBe(null);
            expect(
                convertArrayToObject([
                    { id: 1, name: 'TEST 1' },
                    { id: 2, name: 'TEST 2' }
                ])
            ).toStrictEqual({ '1': { id: 1, name: 'TEST 1' }, '2': { id: 2, name: 'TEST 2' } });
            expect(convertArrayToObject([{ name: 'TEST 1' }])).toStrictEqual({});
        });
    });

    describe('saveCampaignNotificationPayload Testing', () => {
        test('saveCampaignNotificationPayload', () => {
            expect(
                saveCampaignNotificationPayload(
                    {
                        '61517931_L_D': { id: '61517931_L_D', name: 'TEST 1' },
                        '000000002': { id: '000000002', name: 'TEST 2' }
                    },
                    campaignNotifications.messages[0]
                )
            ).toStrictEqual(campaignResponseData);
            expect(
                saveCampaignNotificationPayload(
                    {
                        '000000000000000061517931_L_0': {
                            id: '000000000000000061517931_L_0',
                            name: 'TEST 1'
                        },
                        '2': { id: '2', name: 'TEST 2' }
                    },
                    campaignNotifications.messages[0]
                )
            ).toBe(null);
            expect(
                saveCampaignNotificationPayload(
                    {
                        '000000000000000061518933_L_0': {
                            id: '000000000000000061518933_L_0',
                            name: 'TEST 1'
                        },
                        '2': { id: '2', name: 'TEST 2' }
                    },
                    campaignNotifications.messages[0]
                )
            ).toStrictEqual(campaignResponseData);
            expect(saveCampaignNotificationPayload(notificationData, null)).toBe(null);
        });
    });
});
