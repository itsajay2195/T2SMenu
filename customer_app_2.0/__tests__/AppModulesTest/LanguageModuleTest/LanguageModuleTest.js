import { getDescriptionText } from '../../../AppModules/LanguageModule/Utils/helpers';

describe('LanguageModule Testing', () => {
    describe('getDescriptionText Testing', () => {
        test('getDescriptionText', () => {
            expect(
                getDescriptionText(
                    {
                        name: 'Espanol (Spanish)',
                        code: 'es',
                        title: 'Spanish'
                    },
                    {
                        name: 'English (United Kingdom)',
                        code: 'en-gb',
                        default: true,
                        title: 'English (United Kingdom)'
                    }
                )
            ).toBe('Spanish ');
            expect(
                getDescriptionText(null, {
                    name: 'English (United Kingdom)',
                    code: 'en-gb',
                    default: true,
                    title: 'English (United Kingdom)'
                })
            ).toBe(null);
            expect(
                getDescriptionText(
                    ({
                        name: 'Espanol (Spanish)',
                        code: 'es',
                        title: 'Spanish'
                    },
                    null)
                )
            ).toBe(null);
            expect(
                getDescriptionText(undefined, {
                    name: 'English (United Kingdom)',
                    code: 'en-gb',
                    default: true,
                    title: 'English (United Kingdom)'
                })
            ).toBe(null);
            expect(
                getDescriptionText(
                    {
                        name: 'Espanol (Spanish)',
                        code: 'es',
                        title: 'Spanish'
                    },
                    undefined
                )
            ).toBe('Spanish ');
            expect(
                getDescriptionText('', {
                    name: 'English (United Kingdom)',
                    code: 'en-gb',
                    default: true,
                    title: 'English (United Kingdom)'
                })
            ).toBe(null);
            expect(
                getDescriptionText(
                    {
                        name: 'Espanol (Spanish)',
                        code: 'es',
                        title: 'Spanish'
                    },
                    ''
                )
            ).toBe('Spanish ');
            expect(
                getDescriptionText(
                    {
                        name: 'Espanol (Spanish)',
                        code: 'es',
                        title: 'Spanish'
                    },
                    {}
                )
            ).toBe('Spanish ');
            expect(
                getDescriptionText(
                    {},
                    {
                        name: 'English (United Kingdom)',
                        code: 'en-gb',
                        default: true,
                        title: 'English (United Kingdom)'
                    }
                )
            ).toBe(null);
            expect(getDescriptionText(null, null)).toBe(null);
            expect(getDescriptionText(undefined, undefined)).toBe(null);
            expect(getDescriptionText('', '')).toBe(null);
            expect(getDescriptionText({}, {})).toBe(null);
        });
    });
});
