import API from '../../ApiConfig';

export const SessionManagerNetwork = {
    registerPublicSession: (params) => {
        return API.post('oauth/client', params);
    },
    resetRefreshToken: (params) => {
        return API.post(
            'oauth/token/refresh',
            {
                refresh_token: params.refresh_token
            },
            {
                headers: {
                    Authorization: params.userAccessToken,
                    passport: '1'
                }
            }
        );
    }
};
