import { BASE_API_CONFIG, BASE_PRODUCT_CONFIG } from 't2sbasemodule/Network/ApiConfig';
import DeviceInfo from 'react-native-device-info';
import { isFoodHubApp } from '../../Utils/helpers';
import { NETWORK_METHOD } from '../../Network/SessionManager/Network/SessionConst';

//API token is based on takeaway and has to be modified after OTP response.
//Device model has to be modified after Device info npm is integrated.
export const deviceRegistration = {
    makePostDeviceRegistrationCall: (params) => ({
        method: NETWORK_METHOD.POST,
        url: '/consumer/customer_device_registration?app_name=' + BASE_API_CONFIG.applicationName,
        data: {
            token: params.token,
            host: isFoodHubApp() ? undefined : params.host,
            device: BASE_PRODUCT_CONFIG.platform.toUpperCase(),
            device_model: DeviceInfo.getModel()
        }
    })
};
