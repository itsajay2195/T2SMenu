import { SELECTED_TAKEAWAY } from '../Sample';
import { router } from './Utils/APIHandlerUtils';

export const APIHandlers = [
    // router.post('/auth/otp', (req, res, ctx) => {
    //     const phone = req.body.phone;
    //     if (phone === USER.phoneNumber) {
    //         return { message: 'success' };
    //     }
    //
    //     throw new ApiException(404, require('../../Resource/Error/otp_invalid_phone_number_404.json'));
    // }),
    router.get('/settings', (req, res, ctx) => {
        const apiToken = req.url.searchParams.get('api_token');
        if (apiToken === SELECTED_TAKEAWAY.license_key) {
            return res(ctx.json(require('../../Resource/settings_200.json')));
        }

        return res(ctx.status(401), ctx.json(require('../../Resource/unauthorized_401.json.json')));
    }),
    router.get('/devices', (req, res, ctx) => {
        const apiToken = req.url.searchParams.get('api_token');
        const licenseKey = req.url.searchParams.get('license_key');
        if (apiToken === SELECTED_TAKEAWAY.license_key && apiToken === licenseKey) {
            return res(ctx.json(require('../../Resource/devices_200.json')));
        }

        return res(ctx.status(401), ctx.json(require('../../Resource/unauthorized_401.json.json')));
    }),
    router.post('/printers', (req, res, ctx) => {
        const apiToken = req.url.searchParams.get('api_token');
        if (apiToken === SELECTED_TAKEAWAY.license_key) {
            return res(ctx.json(require('../../Resource/success_200.json')));
        }

        return res(ctx.status(401), ctx.json(require('../../Resource/unauthorized_401.json.json')));
    }),
    router.get('/printers', (req, res, ctx) => {
        const apiToken = req.url.searchParams.get('api_token');
        if (apiToken === SELECTED_TAKEAWAY.license_key) {
            return res(ctx.json(require('../../Resource/printers_200.json')));
        }

        return res(ctx.status(401), ctx.json(require('../../Resource/unauthorized_401.json.json')));
    })
];
