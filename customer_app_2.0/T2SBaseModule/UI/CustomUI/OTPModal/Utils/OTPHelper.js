import { boolValue, isValidElement } from '../../../../Utils/helpers';
import { OTP_TYPE } from './OTPConstants';

export const isVerifyOtp = (accountVerified) => {
    const { verify } = isValidElement(accountVerified) && accountVerified;
    return boolValue(verify);
};

export const isExistingUser = (accountVerified) => {
    const { existing } = isValidElement(accountVerified) && accountVerified;
    return boolValue(existing);
};

export const getOTPType = (accountVerified) => {
    const { type } = isValidElement(accountVerified) && accountVerified;
    return isValidElement(type) ? type : OTP_TYPE.SMS;
};

export const isUserVerificationRequired = (accountVerified) => {
    const { verify } = isValidElement(accountVerified) && accountVerified;
    return boolValue(verify);
};
