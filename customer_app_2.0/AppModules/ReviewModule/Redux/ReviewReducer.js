import { REVIEW_TYPE } from './ReviewType';
import _ from 'lodash/array';

const INITIAL_STATE = {
    reviewResponse: null,
    reviewsList: [],
    isFetching: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case REVIEW_TYPE.GET_REVIEWS_SUCCESS:
            return {
                ...state,
                reviewResponse: action.payload,
                reviewsList: _.concat(state.reviewsList, action.payload.data),
                isFetching: false
            };
        case REVIEW_TYPE.CLEAR_REVIEWS:
            return {
                ...state,
                reviewsList: [],
                reviewResponse: null,
                isFetching: false
            };
        case REVIEW_TYPE.GET_REVIEWS:
            return {
                ...state,
                isFetching: true
            };
        case REVIEW_TYPE.GET_REVIEW_FAIL:
            return {
                ...state,
                isFetching: false
            };
        default:
            return state;
    }
};
