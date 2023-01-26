import { getCurrency, getCurrencyFromBasketResponse } from 'appmodules/BaseModule/GlobalAppHelper';
import { selectCurrencyFromBasket } from 't2sbasemodule/Utils/AppSelectors';

describe('Globalisation helper testing', () => {
    test('getCurrency', () => {
        expect(getCurrency('$')).toEqual('$');
        expect(getCurrency(null)).toEqual('');
        expect(getCurrency(undefined)).toEqual('');
    });
    test('selectCurrencyFromBasket', () => {
        expect(
            selectCurrencyFromBasket({
                basketState: {
                    viewBasketResponse: {
                        currency_symbol: '$'
                    }
                }
            })
        ).toEqual('$');
        expect(selectCurrencyFromBasket({})).toEqual('');
        expect(
            selectCurrencyFromBasket({
                basketState: {
                    viewBasketResponse: null
                }
            })
        ).toEqual('');
    });

    test('getCurrencyFromBasketResponse', () => {
        expect(getCurrencyFromBasketResponse(1, '$')).toEqual('£');
        expect(getCurrencyFromBasketResponse(undefined, '$')).toEqual('$');
        expect(getCurrencyFromBasketResponse(null, undefined)).toEqual('');
        expect(getCurrencyFromBasketResponse(1000, '$')).toEqual('$');
        expect(getCurrencyFromBasketResponse(null)).toEqual('');
    });
});
