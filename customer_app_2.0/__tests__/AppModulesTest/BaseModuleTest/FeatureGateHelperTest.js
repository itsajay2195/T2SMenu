import { getLogCloseTakeawayEnabled } from 'appmodules/BaseModule/Utils/FeatureGateHelper';

describe('FeaturegateHelper', () => {
    function getFeatureGateData(key, enabled) {
        return {
            [key]: {
                status: enabled ? 'ENABLED' : 'DISABLED'
            }
        };
    }

    test('getLogCloseTakeawayEnabled', () => {
        expect(getLogCloseTakeawayEnabled(getFeatureGateData('log_close_takeaway', true))).toEqual(true);
        expect(getLogCloseTakeawayEnabled(getFeatureGateData('log_close_takeaway', false))).toEqual(false);
        expect(getLogCloseTakeawayEnabled(getFeatureGateData(undefined, true))).toEqual(false);
        expect(getLogCloseTakeawayEnabled(getFeatureGateData('a', true))).toEqual(false);
    });
});
