import moment from 'moment-timezone';
import Config from 'react-native-config';
var MockDate = require('mockdate');

export const TIME_ZONE = {
    UK: 'Europe/London',
    US: 'America/Los_Angeles',
    AUS: 'Australia/Sydney'
};

let _time = '2022-04-06T11:01:58.135Z';
let _timeZone = TIME_ZONE.UK;
let defaultAppType = Config.APP_TYPE;

// // I use a timestamp to make sure the date stays fixed to the ms
beforeAll(() => {
    resetDeviceTime();
});

export function setDeviceTime(time = _time, timeZone = _timeZone) {
    MockDate.set(moment.tz(time, timeZone).toDate());
}

export function setDeviceTimeZone(timeZone = _timeZone) {
    moment.tz.setDefault(timeZone);
}

export function resetDeviceTime() {
    setDeviceTimeZone(_timeZone);
    setDeviceTime(_time);
}

export function setAppType(type = Config.APP_TYPE) {
    Config.APP_TYPE = type;
}

export function resetAppType() {
    setAppType(defaultAppType);
}
