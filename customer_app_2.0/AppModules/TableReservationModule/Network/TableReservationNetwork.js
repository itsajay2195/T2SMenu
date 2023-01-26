import { BASE_API_CONFIG } from 't2sbasemodule/Network/ApiConfig';
import { NETWORK_METHOD } from 't2sbasemodule/Network/SessionManager/Network/SessionConst';

export const TableReservationNetwork = {
    makeGetTableReservationSlotsCall: (params) => ({
        method: NETWORK_METHOD.POST,
        url: '/consumer/table_booking/slots?app_name=' + BASE_API_CONFIG.applicationName,
        data: {
            date: params.date //TODO format should be YYYY-MM-DD
        },
        isAuthRequired: false
    }),
    makePostTableReservationCall: (params) => ({
        method: NETWORK_METHOD.POST,
        url: '/consumer/table_booking?app_name=' + BASE_API_CONFIG.applicationName,
        data: {
            firstname: params.firstname,
            lastname: params.lastname,
            date: params.date, //TODO format should be YYYY-MM-DD
            time: params.time, //TODO format should be HH:mm a
            phone: params.phone,
            email: params.email,
            notes: params.message,
            people: params.people
        },
        isAuthRequired: false
    })
};
