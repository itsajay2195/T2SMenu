import { isValidElement } from 't2sbasemodule/Utils/helpers';

export const selectUserID = (state) => {
    const userProfile = selectUserProfile(state);
    if (isValidElement(userProfile) && isValidElement(userProfile.id)) {
        return userProfile.id;
    }
};
export const selectProfileResponseState = (state) => state.profileState.profileResponse;

export const selectUserProfile = (state) => {
    const profileState = selectProfileState(state);
    if (isValidElement(profileState) && isValidElement(profileState.profileResponse)) {
        return profileState.profileResponse;
    } else {
        return undefined;
    }
};

export const selectIsUpdateProfile = (state) => {
    const profileState = selectProfileState(state);
    if (isValidElement(profileState) && isValidElement(profileState.isUpdateProfile)) {
        return profileState.isUpdateProfile;
    } else {
        return false;
    }
};

export const selectReferralCode = (state) => {
    const profileState = selectProfileState(state);
    if (isValidElement(profileState?.referralCode)) {
        return profileState.referralCode;
    } else {
        return null;
    }
};

export const selectRecentPBLAction = (state) => {
    const profileState = selectProfileState(state);
    if (isValidElement(profileState) && isValidElement(profileState.recentPayByLinkAction)) {
        return profileState.recentPayByLinkAction;
    } else {
        return null;
    }
};

export const selectIsPBLProfileUpdate = (state) => {
    const profileState = selectProfileState(state);
    if (isValidElement(profileState) && isValidElement(profileState.isFromPayByLink)) {
        return profileState.isFromPayByLink;
    } else {
        return null;
    }
};

export const selectProfileState = (state) => state.profileState;
