import { constructErrorObject, getGraphQlQuery } from 't2sbasemodule/Network/NetworkHelpers';
import { graphQlDetailedObj, graphQlEmptyObj, graphQlObject } from '../data';

describe('NetworkHelper Testing', () => {
    describe('constructErrorObject Testing', () => {
        test('constructErrorObject', () => {
            expect(constructErrorObject({})).toStrictEqual({});
            expect(constructErrorObject(null)).toStrictEqual({});
            expect(constructErrorObject({ error: { message: 'TEST' }, store_id: 12345 })).toStrictEqual({
                message: 'TEST',
                store_id: 12345,
                type: undefined
            });
            expect(
                constructErrorObject({
                    error: { message: 'TEST', type: 'API_ERROR' },
                    networkConfig: {},
                    profile: {
                        phone: '7446411868',
                        id: 123
                    }
                })
            ).toStrictEqual({
                customerId: 123,
                message: 'TEST',
                method: undefined,
                name: '',
                phone: '7446411868',
                store_id: undefined,
                type: 'API_ERROR',
                url: undefined
            });
            expect(
                constructErrorObject({
                    error: { message: 'TEST', type: 'API_ERROR' },
                    networkConfig: {
                        method: 'GET',
                        url: '/customer/offer/banner/original'
                    },
                    profile: {
                        phone: '7446411868',
                        id: 123,
                        first_name: 'TEST',
                        last_name: 'NAME'
                    },
                    store_id: 12345
                })
            ).toStrictEqual({
                customerId: 123,
                message: 'TEST',
                method: 'GET',
                name: 'TEST NAME',
                phone: '7446411868',
                store_id: 12345,
                type: 'API_ERROR',
                url: '/customer/offer/banner/original'
            });
        });
    });

    describe('getGraphQlQuery Testing', () => {
        test('getGraphQlQuery', () => {
            expect(getGraphQlQuery('API_ERROR', null, '003')).toStrictEqual(graphQlObject);
            expect(getGraphQlQuery()).toStrictEqual(graphQlEmptyObj);
            expect(
                getGraphQlQuery(
                    'API_ERROR',
                    {
                        error: { message: 'TEST', type: 'API_ERROR' },
                        networkConfig: {
                            method: 'GET',
                            url: '/customer/offer/banner/original'
                        },
                        profile: {
                            phone: '7446411868',
                            id: 123,
                            first_name: 'TEST',
                            last_name: 'NAME'
                        },
                        store_id: 12345
                    },
                    '003'
                )
            ).toStrictEqual(graphQlDetailedObj);
        });
    });
});
