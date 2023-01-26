/***
 * Usage :
 * import { ZendeskChat } from 'Zendesk'
 */
import { NativeModules } from 'react-native';
export const ZohoSupport = NativeModules.ZohoSupport;
export const FHMigration = NativeModules.FHMigration;
export const T2SNativeModule = NativeModules.T2SNativeModule;
export const ApplePay = NativeModules.ApplePayToken;
/***

 ZendeskChat.setup('31fYjIWofUwQW05byDgna9MNu13qgAqz');

 showZendeskSupport() {
        ZendeskChat.start({ name: 'Nalin Chhajer', email: 'nalin.chhajer@touch2success.com', phone: '8056039074' });
    }

 //Listen for event `CHAT_NOTIFICATION_COUNT` to get `count` params

 **/
