import { TABLE_RESERVATION_TYPE } from './TableReservationType';

export const getTableReservationSlotsAction = (date) => {
    return {
        type: TABLE_RESERVATION_TYPE.GET_TABLE_RESERVATION_SLOTS,
        date: date // format should be YYYY-MM-DD
    };
};

export const postTableReservationAction = (firstname, lastname, date, time, phone, email, message, people) => {
    return {
        type: TABLE_RESERVATION_TYPE.POST_TABLE_RESERVATION,
        firstname: firstname,
        lastname: lastname,
        date: date, // format should be YYYY-MM-DD
        time: time, // format should be hh:mm a
        phone: phone,
        email: email,
        message: message,
        people: people
    };
};

export const resetTableBookedAction = () => {
    return {
        type: TABLE_RESERVATION_TYPE.RESET_TABLE_BOOKED
    };
};
