import { SAVED_CARDS_TYPE } from './SavedCardsType';

const INITIAL_STATE = {
    allCardsDeleted: null //TODO it's boolean. Once it true hide the saved cards view
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SAVED_CARDS_TYPE.DELETE_ALL_SAVED_CARDS_SUCCESS:
            return {
                ...state,
                accountDeleted: action.accountDeleted
            };
        default:
            return state;
    }
};
