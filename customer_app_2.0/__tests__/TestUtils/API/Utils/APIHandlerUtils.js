import { rest } from 'msw';
import { isValidElement } from 't2sbasemodule/Utils/helpers';
import { API_URL } from '../../Sample';

export function ApiException(statusCode, response) {
    this.statusCode = statusCode;
    this.response = response;
}

export const apiRequest = (type, path, handler) => {
    if (!isValidElement(type) || !isValidElement(rest[type.toLowerCase()])) {
        throw Error(`Please provide a valid type, received ${type}`);
    }
    if (!isValidElement(path)) {
        throw Error(`Please provide a valid path, received ${path}`);
    }

    const ourHandler = mainHandler(handler);
    const _path = path.startsWith('http') ? path : `${API_URL}${path}`;
    switch (type) {
        case 'HEAD':
            return rest.head(_path, ourHandler);
        case 'GET':
            return rest.get(_path, ourHandler);
        case 'POST':
            return rest.post(_path, ourHandler);
        case 'PUT':
            return rest.put(_path, ourHandler);
        case 'DELETE':
            return rest.delete(_path, ourHandler);
        case 'PATCH':
            return rest.patch(_path, ourHandler);
        case 'OPTIONS':
            return rest.options(_path, ourHandler);
    }
};

export const router = {
    head: (...args) => apiRequest('HEAD', ...args),
    get: (...args) => apiRequest('GET', ...args),
    post: (...args) => apiRequest('POST', ...args),
    put: (...args) => apiRequest('PUT', ...args),
    delete: (...args) => apiRequest('DELETE', ...args),
    patch: (...args) => apiRequest('PATCH', ...args),
    options: (...args) => apiRequest('OPTIONS', ...args)
};

// it is a just adding a little value on top of MSW so we can use all the functionality if we want.
function mainHandler(handler) {
    function apiHandler(req, res, ctx) {
        try {
            const response = handler(req, res, ctx);
            if (isPromise(response)) {
                return response;
            } else {
                return res(ctx.json(response));
            }
        } catch (e) {
            if (e instanceof ApiException) {
                return res(ctx.status(e.statusCode), ctx.json(e.response));
            } else {
                return res(ctx.status(401), ctx.json({ message: e.toString() }));
            }
        }
    }

    return apiHandler;
}

function isPromise(value) {
    return value && value.then && typeof value.then === 'function';
}
