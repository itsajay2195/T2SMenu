import {
    getReviewDateFormat,
    isCloseToBottom,
    getOverallDashboardReview,
    getTrimmedReviewResponse,
    checkIsValidReviewResponse,
    getTotalReviewsCount
} from 'appmodules/ReviewModule/Utils/ReviewHelper';
import { nativeElement, review, takeawayListResponse } from '../data';

describe('ReviewHelper tTesting', () => {
    describe('getReviewDateFormat Testing', () => {
        test('getReviewDateFormat', () => {
            expect(getReviewDateFormat('2021-05-14 23:40:44')).toBe('14 May 2021');
            expect(getReviewDateFormat('2021-05-14')).toBe('14 May 2021');
            expect(getReviewDateFormat('')).toBe('');
            expect(getReviewDateFormat(null)).toBe('');
            expect(getReviewDateFormat(undefined)).toBe('');
        });
    });

    describe('isCloseToBottom Testing', () => {
        test('isCloseToBottom', () => {
            expect(isCloseToBottom(nativeElement[0])).toBe(false);
            expect(isCloseToBottom(nativeElement[1])).toBe(true);
        });
    });

    describe('getOverallDashboardReview Testing', () => {
        test('getOverallDashboardReview', () => {
            expect(getOverallDashboardReview(review)).toEqual(review);
            expect(getOverallDashboardReview(review).length).toBe(3);
            expect(getOverallDashboardReview(null)).toEqual([]);
            expect(getOverallDashboardReview([])).toEqual([]);
            expect(getOverallDashboardReview(undefined)).toEqual([]);
        });
    });

    describe('getTrimmedReviewResponse Testing', () => {
        test('getTrimmedReviewResponse', () => {
            expect(getTrimmedReviewResponse(review[0])).toBe('test');
            expect(getTrimmedReviewResponse(review[1])).toBe('');
            expect(getTrimmedReviewResponse(review[2])).toBe('');
        });
    });

    describe('checkIsValidReviewResponse Testing', () => {
        test('checkIsValidReviewResponse', () => {
            expect(checkIsValidReviewResponse('Good quality food highly recommend ')).toBe(true);
            expect(checkIsValidReviewResponse('  ')).toBe(false);
            expect(checkIsValidReviewResponse(null)).toBe(false);
            expect(checkIsValidReviewResponse(undefined)).toBe(false);
        });
    });

    describe('getTotalReviewsCount Testing', () => {
        test('getTotalReviewsCount', () => {
            expect(getTotalReviewsCount(takeawayListResponse.data[0].total_reviews)).toBe(111);
            expect(getTotalReviewsCount(null)).toBe(0);
            expect(getTotalReviewsCount(undefined)).toBe(0);
        });
    });
});
