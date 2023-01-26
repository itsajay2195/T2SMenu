import { convertToMoeDate, convertToMoeProperties } from '../../../AppModules/AnalyticsModule/Braze';
import moment from 'moment-timezone';

describe('AnalyticalHelper Testing', () => {
    test('convertToMoeProperties', () => {
        expect(convertToMoeProperties({ key: 'value' }).generalAttributes.key).toEqual('value');
        expect(convertToMoeProperties({ key: 4 }).generalAttributes.key).toEqual(4);
        expect(convertToMoeProperties({ key: 3.25 }).generalAttributes.key).toEqual(3.25);
        expect(convertToMoeProperties({ key: true }).generalAttributes.key).toEqual(true);
        expect(convertToMoeProperties({ key: new Date() }).dateTimeAttributes.key).not.toEqual(undefined);

        expect(moment('2022-04-25 18:27:32').format('YYYY-MM-DDTHH:mm:ssZ')).toEqual('2022-04-25T18:27:32+05:30');
    });

    test('convertToMoeDate', () => {
        expect(convertToMoeDate('2022-08-01 11:56:53')).toEqual('2022-08-01T06:26:53.000Z');
    });
});
