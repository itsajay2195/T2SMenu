import { TAKEAWAY_DETAILS_TYPE } from './TakeawayDetailsType';
import { isValidURL } from 't2sbasemodule/Utils/helpers';

const INITIAL_STATE = {
    images: [],
    rating: {}
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case TAKEAWAY_DETAILS_TYPE.IMAGE_GALLERY_SUCCESS:
            return {
                ...state,
                images: action.images.filter((item) => isValidURL(item.image))
            };
        case TAKEAWAY_DETAILS_TYPE.HYGIENE_RATING_SUCCESS:
            return {
                ...state,
                rating: action.rating
            };
        default:
            return state;
    }
};
