import _ from 'lodash';
import { boolValue, getDateStr, isArrayNonEmpty, isValidElement, isValidString } from 't2sbasemodule/Utils/helpers';
import { DATE_FORMAT } from 't2sbasemodule/Utils/DateUtil';
import { isIOS } from '../../BaseModule/Helper';

export const getNotificationList = (stateList, notificationList, currentPage) => {
    let itemList = [];
    if (currentPage === 1) {
        itemList = notificationList ?? [];
    } else {
        itemList = [...(stateList ?? []), ...(notificationList ?? [])];
    }
    return itemList;
};
export const deleteFilterNotificationList = (stateList, itemID) => stateList?.filter((item) => item.id !== itemID) ?? [];

export const getAllNotificationList = (notificationList, brazeList) => {
    if (isValidElement(brazeList) && isValidElement(notificationList)) {
        const returnList = [...notificationList, ...brazeList];
        return _.orderBy(
            returnList,
            [
                (obj) => {
                    return obj.created_at;
                }
            ],
            ['desc']
        );
    }
};

export const convertArrayToObject = (inputList) => {
    let resultantObj = {};
    if (isArrayNonEmpty(inputList)) {
        inputList.forEach((item) => {
            if (isValidString(item?.id)) {
                resultantObj[item.id.toString()] = item;
            } else return;
        });
        return resultantObj;
    }
    return null;
};

export const saveCampaignNotificationPayload = (brazeNotifications, data) => {
    if (isValidElement(data)) {
        const { textContent, payload, campaignId, receivedTime } = data;
        let checkNotificationExists = false;
        let isiOS = isIOS(); //Payload content differs for ios and android
        if (
            isValidElement(brazeNotifications) &&
            isValidString(campaignId?.toString()) &&
            isValidElement(brazeNotifications[campaignId.toString()]) &&
            brazeNotifications[campaignId.toString()]
        ) {
            checkNotificationExists = true;
        }

        let content = isiOS ? payload?.moengage : payload;
        if (isValidElement(content) && !checkNotificationExists) {
            let displayNotification = isiOS ? content.screenData?.display : content.display;
            let createdTime = isValidString(receivedTime) ? receivedTime : new Date();
            if (boolValue(displayNotification)) {
                let responseData = {
                    id: campaignId.toString(),
                    title: textContent?.title ?? '',
                    message: textContent?.message ?? '',
                    host: '',
                    app_name: 'FOODHUB',
                    created_at: getDateStr(createdTime, DATE_FORMAT.YYYY_MM_DD_HH_MM_SS),
                    status: 'BRAZE',
                    moengageData: data //this object is required to delete moengage notification as per their documentation
                };
                return responseData;
            }
        }
    }
    return null;
};
