import { getTotalSavingsContent } from '../../../AppModules/TotalSavingsModule/Utils/TotalSavingsHelpers';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';

describe('TotalSavings Testing', () => {
    describe('getTotalSavingsContent Testing', () => {
        test('getTotalSavingsContent', () => {
            expect(getTotalSavingsContent(LOCALIZATION_STRINGS.SAVINGS_CONTENT_1, 'RestaurantName')).toBe(
                '\nThe above total shows the amount of savings* RestaurantName has allowed consumers to benefit from on a weekly basis.This figure continues to increase significantly on a daily basis and puts a real big smile on the faces of our consumers as well as ours.\n\nIt’s so satisfying knowing that we’re helping our consumers order, track and receive their delicious meals so easily and at the same time receive the very best deals that are on offer at their local takeaways and restaurants.\n\nRestaurantName doesn’t charge any of the businesses that are on their platform any commission at all, allowing them to pass on these great savings to their customers. That’s why you won’t find these types of exclusive discounts and offers our businesses are providing on any other online food ordering platform.\n'
            );
            expect(getTotalSavingsContent('TakeawayName', 'Foodhub')).toBe('Foodhub');
            expect(getTotalSavingsContent('', 'Foodhub')).toBe(undefined);
            expect(getTotalSavingsContent(null, 'Foodhub')).toBe(undefined);
        });
    });
});
