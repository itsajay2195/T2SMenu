import { isDifferentLatLongFromCurrentLocation } from 'appmodules/HomeAddressModule/Utils/Helpers';

describe('address helper testing', () => {
    const getLatLngObj = (lat, lng) => {
        return {
            latitude: lat,
            longitude: lng
        };
    };
    test('isDifferentLatLongFromCurrentLocation', () => {
        expect(
            isDifferentLatLongFromCurrentLocation(
                getLatLngObj(53.06175654472963, -2.2041752893961877),
                getLatLngObj(53.06175654472963, -2.2041752893961877)
            )
        ).toEqual(false);
        expect(
            isDifferentLatLongFromCurrentLocation(
                getLatLngObj(53.06175654472963, -2.2041752893961877),
                getLatLngObj(53.061917732811125, -2.2040438611490414)
            )
        ).toEqual(false);
        expect(
            isDifferentLatLongFromCurrentLocation(
                getLatLngObj(53.06175654472963, -2.2041752893961877),
                getLatLngObj(53.06175654472963, -2.2041752893961877)
            )
        ).toEqual(false);
        expect(
            isDifferentLatLongFromCurrentLocation(
                getLatLngObj(53.06194362441798, -2.204057517884627),
                getLatLngObj(53.06234175615535, -2.203676644188918)
            )
        ).toEqual(true);
        expect(
            isDifferentLatLongFromCurrentLocation(
                getLatLngObj(53.06194362441798, -2.204057517884627),
                getLatLngObj(53.0615020433377, -2.2044106149059175)
            )
        ).toEqual(true);
    });
});
