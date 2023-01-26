import { getFormattedMessage, preorderTakeawayOpenTime } from '../../../FoodHubApp/TakeawayListModule/Utils/Helper';
import { VIEW_ID } from '../../../FoodHubApp/TakeawayListModule/Utils/Constants';

describe('TakeawayListModule helper', () => {
    test('preorderTakeawayOpenTime', () => {
        // expect(preorderTakeawayOpenTime('2022-04-06 08:08:00', 'Europe/London', VIEW_ID.CLOSED_MESSAGE, false)).toEqual(
        //     "Sorry, We're currently closed and will open Tomorrow at "
        // );
        expect(preorderTakeawayOpenTime('2022-04-06 08:08:00', 'Europe/London', VIEW_ID.OPENING_TIME_TEXT, false)).toEqual('08:08 AM');
        expect(preorderTakeawayOpenTime('2022-04-07 08:08:00', 'Europe/London', VIEW_ID.OPENING_TIME_TEXT, false)).toEqual('08:08 AM');
    });
    test('getFormattedMessage', () => {
        expect(getFormattedMessage('2022-04-06', '2022-04-07', '2022-04-07', false)).toEqual(
            "Sorry, We're currently closed and will open Tomorrow at "
        );
    });
});
