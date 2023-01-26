import { ADDRESS_TYPE } from './AddressType';
import { POSTCODE_LOOKUP_API_STATUS } from '../Utils/AddressConstants';
import {
    extractDeliveryAddressFromAddressList,
    getPrimaryPostCode,
    addAddressLocally,
    getOrderTypeForBasket,
    isBasketOrder,
    getDefaultOrderType
} from '../Utils/AddressHelpers';
import { APP_ACTION_TYPE } from '../../../CustomerApp/Redux/Actions/Types';
import { ORDER_TYPE } from '../../BaseModule/BaseConstants';
import { isValidElement } from 't2sbasemodule/Utils/helpers';
import { BASKET_TYPE } from '../../BasketModule/Redux/BasketType';

const INITIAL_STATE = {
    addressResponse: null,
    postcodeLookupResponse: null,
    primaryAddressId: null,
    deliveryAddress: null,
    deliveryLookupResponse: null,
    addressFromLocation: null,
    selectedPostcode: null,
    selectedOrderType: null,
    postCodeLookupApiStatus: POSTCODE_LOOKUP_API_STATUS.NOT_TRIGGERED,
    deliveryFor: '',
    selectedAddressId: null,
    selectedInvalidAddressId: null,
    closeCheckoutAddressList: false,
    isLocationBeingFetched: false,
    currentLocation: null,
    fussySearchSuggestions: null,
    placesSuggestions: null,
    selectedTAOrderType: ORDER_TYPE.DELIVERY,
    nonBasketOrderType: null,
    defaultOrderType: ORDER_TYPE.DELIVERY,
    doorNoManual: null,
    flatNoByManual: null
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ADDRESS_TYPE.GET_ADDRESS_SUCCESS:
            return {
                ...state,
                addressResponse: action.payload,
                deliveryAddress: extractDeliveryAddressFromAddressList(state, state.selectedAddressId, action.payload),
                selectedPostcode: getPrimaryPostCode(state.selectedPostcode, action.payload)
            };
        case ADDRESS_TYPE.INTERNAL_ADD_ADDRESS:
            return {
                ...state,
                addressResponse: addAddressLocally(state.addressResponse, action.payload),
                deliveryAddress: extractDeliveryAddressFromAddressList(
                    state,
                    action.payload.id,
                    addAddressLocally(state.addressResponse, action.payload)
                )
            };
        case ADDRESS_TYPE.POSTCODE_LOOKUP_SUCCESS:
            return {
                ...state,
                postcodeLookupResponse: action.payload
            };
        case APP_ACTION_TYPE.APP_INITIAL_SETUP_ACTION:
            return {
                ...state,
                selectedOrderType: getOrderTypeForBasket(state.selectedOrderType, state.defaultOrderType),
                selectedTAOrderType: getDefaultOrderType(state.defaultOrderType),
                nonBasketOrderType: getDefaultOrderType(state.defaultOrderType),
                selectedPostcode: null,
                selectedAddressId: null,
                selectedInvalidAddressId: null,
                deliveryAddress: extractDeliveryAddressFromAddressList(state, null, state.addressResponse)
            };
        case ADDRESS_TYPE.UPDATE_PRIMARY_ADDRESS_SUCCESS:
            return {
                ...state,
                primaryAddressId: action.id
            };
        case ADDRESS_TYPE.DELIVERY_ADDRESS_SELECT:
            return {
                ...state,
                deliveryAddress: action.deliveryAddress
            };
        case ADDRESS_TYPE.DELIVERY_LOOKUP_SUCCESS:
            return {
                ...state,
                deliveryLookupResponse: action.payload,
                postCodeLookupApiStatus: POSTCODE_LOOKUP_API_STATUS.SUCCESS,
                deliveryFor: ''
            };
        case ADDRESS_TYPE.DELIVERY_LOOKUP_FAILURE:
            return {
                ...state,
                deliveryLookupResponse: null,
                postCodeLookupApiStatus: POSTCODE_LOOKUP_API_STATUS.FAILED
            };
        case ADDRESS_TYPE.RESET_DELIVERY_LOOKUP_SUCCESS:
            return {
                ...state,
                deliveryLookupResponse: null,
                postCodeLookupApiStatus: POSTCODE_LOOKUP_API_STATUS.NOT_TRIGGERED,
                deliveryFor: '',
                screenName: null
            };
        case ADDRESS_TYPE.GET_ADDRESS_FROM_LOCATION_SUCCESS:
            return {
                ...state,
                addressFromLocation: action.payload
            };
        case ADDRESS_TYPE.GET_ADDRESS_FROM_LAT_LONG_FAILURE:
            return {
                ...state,
                addressFromLocation: null
            };
        case ADDRESS_TYPE.UPDATE_SELECTED_ORDER_TYPE: {
            return {
                ...state,
                selectedOrderType: action.payload.isBasketChanged
                    ? action.payload.selectedOrderType
                    : getOrderTypeForBasket(state.selectedOrderType, state.defaultOrderType),
                nonBasketOrderType: !action.payload.isBasketChanged
                    ? action.payload.selectedOrderType
                    : getOrderTypeForBasket(state.nonBasketOrderType, state.defaultOrderType),
                selectedPostcode: action.payload.selectedPostcode,
                selectedAddressId: action.payload.selectedAddressId,
                selectedInvalidAddressId: null,
                deliveryAddress: extractDeliveryAddressFromAddressList(state, action.payload.selectedAddressId, state.addressResponse)
            };
        }
        case ADDRESS_TYPE.UPDATE_BASKET_ORDER_TYPE: {
            return {
                ...state,
                selectedOrderType: state.nonBasketOrderType
            };
        }
        case ADDRESS_TYPE.RESET_UPDATE_NON_BASKET_ORDER_TYPE: {
            let getOrderType = isBasketOrder(action.basketStoreId, action.storeId) ? state.selectedOrderType : state.nonBasketOrderType;
            return {
                ...state,
                nonBasketOrderType: isValidElement(action.basketStoreId) ? getOrderType : state.selectedOrderType
            };
        }
        case ADDRESS_TYPE.SELECTED_TA_ORDER_TYPE: {
            return {
                ...state,
                selectedTAOrderType: action.payload
            };
        }
        case ADDRESS_TYPE.UPDATE_NON_BASKET_ORDER_TYPE: {
            return {
                ...state,
                nonBasketOrderType: action.payload.selectedOrderType,
                selectedPostcode: action.payload.selectedPostcode,
                selectedAddressId: action.payload.selectedAddressId,
                selectedInvalidAddressId: null,
                deliveryAddress: extractDeliveryAddressFromAddressList(state, action.payload.selectedAddressId, state.addressResponse)
            };
        }
        case ADDRESS_TYPE.DELIVERY_FOR: {
            return {
                ...state,
                deliveryFor: action.payload
            };
        }
        case ADDRESS_TYPE.UPDATE_INVALID_ADDRESS_ID: {
            return {
                ...state,
                selectedInvalidAddressId: action.payload
            };
        }
        case ADDRESS_TYPE.RESET_ADDRESS_FROM_LOCATION: {
            return {
                ...state,
                addressFromLocation: null
            };
        }
        case ADDRESS_TYPE.UPDATE_CURRENT_LOCATION: {
            return {
                ...state,
                currentLocation: action.payload
            };
        }
        case ADDRESS_TYPE.RESET_CURRENT_LOCATION: {
            return {
                ...state,
                currentLocation: null
            };
        }
        case ADDRESS_TYPE.FUSSY_SEARCH_AUTOCOMPLETE_SUCCESS: {
            return {
                ...state,
                fussySearchSuggestions: action.payload
            };
        }

        case ADDRESS_TYPE.MANAGE_ADDRESS_GET_AUTO_COMPLETE_SUCCESS: {
            return {
                ...state,
                placesSuggestions: action.payload
            };
        }
        case ADDRESS_TYPE.RESET_MANAGE_ADDRESS_GET_AUTO_COMPLETE: {
            return {
                ...state,
                placesSuggestions: null
            };
        }
        case ADDRESS_TYPE.MANAGE_GET_ADDRESS_FROM_PLACE_ID_SUCCESS: {
            return {
                ...state,
                addressFromLocation: action.payload
            };
        }
        case ADDRESS_TYPE.MANAGE_GET_ADDRESS_FROM_PLACE_ID_FAILURE: {
            return {
                ...state,
                addressFromLocation: null
            };
        }
        case ADDRESS_TYPE.UPDATE_SEARCHED_ADDRESS: {
            return {
                ...state,
                deliveryAddress: action.address,
                selectedAddressId: isValidElement(action?.address?.id) ? action.address.id : null
            };
        }
        case BASKET_TYPE.RESET_BASKET: {
            return {
                ...state,
                selectedAddressId: null
            };
        }
        case ADDRESS_TYPE.SET_ADDRESS_FROM_LOCATION: {
            return {
                ...state,
                addressFromLocation: action.payload
            };
        }
        case ADDRESS_TYPE.UPDATE_DEFAULT_ORDER_TYPE: {
            return {
                ...state,
                defaultOrderType: getDefaultOrderType(action.defaultOrderType)
            };
        }
        case ADDRESS_TYPE.SET_MANUAL_DOORNO: {
            return {
                ...state,
                doorNoManual: action.payload
            };
        }
        case ADDRESS_TYPE.SET_MANUAL_FLATNO: {
            return {
                ...state,
                flatNoByManual: action.payload
            };
        }
        case ADDRESS_TYPE.RESET_MANUAL_ADDRESS: {
            return {
                ...state,
                doorNoManual: null,
                flatNoByManual: null
            };
        }
        default:
            return state;
    }
};
