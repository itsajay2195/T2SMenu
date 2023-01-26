import { TABLE_RESERVATION_TYPE } from './TableReservationType';
import { isValidElement } from 't2sbasemodule/Utils/helpers';

const INITIAL_STATE = {
    timeSlots: [],
    no_of_people: 0,
    errorMsg: '',
    tableReserved: false //TODO it's boolean. Once it true show the success view if needed in new design
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case TABLE_RESERVATION_TYPE.GET_TABLE_RESERVATION_SLOTS_SUCCESS:
            return {
                ...state,
                timeSlots: isValidElement(action.payload.slots) ? action.payload.slots : [],
                no_of_people: action.payload.no_of_people,
                errorMsg: ''
            };
        case TABLE_RESERVATION_TYPE.GET_TABLE_RESERVATION_SLOTS_FAILURE:
            return {
                ...state,
                timeSlots: [],
                no_of_people: 0,
                errorMsg: action.errorMsg
            };
        case TABLE_RESERVATION_TYPE.POST_TABLE_RESERVATION_SUCCESS:
            return {
                ...state,
                tableReserved: action.tableReserved
            };
        case TABLE_RESERVATION_TYPE.RESET_TABLE_BOOKED:
            return {
                ...INITIAL_STATE
            };
        default:
            return state;
    }
};
