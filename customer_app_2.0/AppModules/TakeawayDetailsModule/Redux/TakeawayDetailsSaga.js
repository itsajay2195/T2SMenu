import { TAKEAWAY_DETAILS_TYPE } from './TakeawayDetailsType';
import { isValidElement } from 't2sbasemodule/Utils/helpers';
import { showErrorMessage } from 't2sbasemodule/Network/NetworkHelpers';
import { all, takeLatest, put, fork } from 'redux-saga/effects';
import { TakeawayDetailsNetwork } from '../Network/TakeawayDetailsNetwork';
import { apiCall } from 't2sbasemodule/Network/SessionManager/Network/SessionNetworkWrapper';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import { TYPES_CONFIG } from '../../../CustomerApp/Redux/Actions/Types';
import { appBase } from '../../../CustomerApp/Network/AppBaseNetwork';
import { logStoreConfigResponse } from '../../../CustomerApp/Saga/AppSaga';

function* makeGetGalleryImageListCall(action) {
    try {
        const imageResponse = yield apiCall(TakeawayDetailsNetwork.makeGetGalleryImageListCall, action);
        if (isValidElement(imageResponse)) {
            yield put({ type: TAKEAWAY_DETAILS_TYPE.IMAGE_GALLERY_SUCCESS, images: imageResponse.data });
        } else {
            showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
        }
    } catch (e) {
        // showErrorMessage(e);
    }
}

function* makeGetHygieneRatingCall(action) {
    try {
        const hygieneRatingResponse = yield apiCall(TakeawayDetailsNetwork.makeGetHygieneRatingCall, action);
        if (isValidElement(hygieneRatingResponse)) {
            yield put({ type: TAKEAWAY_DETAILS_TYPE.HYGIENE_RATING_SUCCESS, rating: hygieneRatingResponse });
        } else {
            showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
        }
    } catch (e) {
        //showErrorMessage(e);
    }
}

export function* makeStoreConfigCall(action) {
    try {
        const storeConfigResponse = yield apiCall(appBase.makeStoreConfigCall);
        if (isValidElement(storeConfigResponse)) {
            yield put({ type: TYPES_CONFIG.STORE_CONFIG_SUCCESS, payload: storeConfigResponse });
            yield fork(logStoreConfigResponse, storeConfigResponse);
        }
    } catch (e) {
        //showErrorMessage(e);
    }
}

function* TakeawayDetailsSaga() {
    yield all([
        takeLatest(TAKEAWAY_DETAILS_TYPE.IMAGE_GALLERY, makeGetGalleryImageListCall),
        takeLatest(TAKEAWAY_DETAILS_TYPE.HYGIENE_RATING, makeGetHygieneRatingCall),
        takeLatest(TAKEAWAY_DETAILS_TYPE.GET_STORE_CONFIG, makeStoreConfigCall)
    ]);
}

export default TakeawayDetailsSaga;
