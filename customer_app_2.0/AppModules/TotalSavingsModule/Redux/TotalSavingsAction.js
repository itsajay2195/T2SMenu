import { TOTAL_SAVING_TYPE } from './TotalSavingsType';

export const makeGetTotalSavingsAction = () => {
    return {
        type: TOTAL_SAVING_TYPE.GET_TOTAL_SAVING
    };
};
export const refreshFoodhubHomeScreenUserData = () => {
    return {
        type: TOTAL_SAVING_TYPE.REFRESH_FH_HOME_SCREEN_USER_DATA
    };
};
