import { REVIEW_TYPE } from './ReviewType';
import { ReviewsNetwork } from '../Network/ReviewNetwork';
import { isCustomerApp, isFranchiseApp, isValidElement } from 't2sbasemodule/Utils/helpers';
import { Constants as T2SBaseConstants } from 't2sbasemodule/Utils/Constants';
import { showErrorMessage, showInfoMessage } from 't2sbasemodule/Network/NetworkHelpers';
import { all, put, takeLatest } from 'redux-saga/effects';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import { apiCall } from 't2sbasemodule/Network/SessionManager/Network/SessionNetworkWrapper';
import Config from 'react-native-config';
import { ORDER_MANAGEMENT_TYPE } from '../../OrderManagementModule/Redux/OrderManagementType';
import { REVIEW_DUPLICATE } from '../Utils/ReviewConstants';

function* makeGetReviewsCall(action) {
    try {
        const response = yield apiCall(
            isFranchiseApp() ? ReviewsNetwork.makeGetFranchiseReviewsCall : ReviewsNetwork.makeGetReviewsCall,
            action
        );
        if (isValidElement(response)) {
            yield put({ type: REVIEW_TYPE.GET_REVIEWS_SUCCESS, payload: response });
        } else {
            yield put({ type: REVIEW_TYPE.GET_REVIEW_FAIL });
            showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
        }
    } catch (e) {
        yield put({ type: REVIEW_TYPE.GET_REVIEW_FAIL });
        showErrorMessage(e);
    }
}

function* makePostReviewCall(action) {
    try {
        if (!isCustomerApp()) {
            action = {
                ...action,
                data: {
                    ...action.data,
                    portal: Config.APP_TYPE
                }
            };
        }
        yield put({ type: ORDER_MANAGEMENT_TYPE.UPDATE_REVIEW_LOCALLY, payload: action.data });
        const response = yield apiCall(ReviewsNetwork.makePostReviewCall, action);
        if (isValidElement(response) && isValidElement(response.outcome) && response.outcome === T2SBaseConstants.SUCCESS) {
            showInfoMessage(LOCALIZATION_STRINGS.POST_REVIEW_SUCCESS_MSG);
        } else {
            showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
        }
    } catch (e) {
        if (e.message === REVIEW_DUPLICATE) {
            showErrorMessage(LOCALIZATION_STRINGS.REVIEW_ALREADY_GIVEN);
        } else {
            showErrorMessage(e);
        }
    }
}

function* makeIgnoreReviewCall(action) {
    try {
        yield apiCall(ReviewsNetwork.makeIgnoreReviewCall, action.data);
    } catch (e) {}
}

function* ReviewSaga() {
    yield all([
        takeLatest(REVIEW_TYPE.GET_REVIEWS, makeGetReviewsCall),
        takeLatest(REVIEW_TYPE.POST_REVIEW, makePostReviewCall),
        takeLatest(REVIEW_TYPE.IGNORE_REVIEW, makeIgnoreReviewCall)
    ]);
}

export default ReviewSaga;
