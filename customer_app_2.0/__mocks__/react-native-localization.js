// https://github.com/stefalda/ReactNativeLocalization/issues/37
import _localization from 'react-localization';

export default class RNLocalization {
    _language = 'en-gb';

    constructor(props) {
        this.props = props;
        this._setLanguage(this._language);
    }

    _setLanguage(interfaceLanguage) {
        this._language = interfaceLanguage;
        if (this.props[interfaceLanguage]) {
            const localizedStrings = this.props[this._language];
            for (var key in localizedStrings) {
                // eslint-disable-next-line no-prototype-builtins
                if (localizedStrings.hasOwnProperty(key)) {
                    this[key] = localizedStrings[key];
                }
            }
        }
    }
    formatString(key, ...args) {
        return _localization.prototype.formatString(key, ...args);
    }
}
