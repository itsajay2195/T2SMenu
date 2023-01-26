import { setupServer } from 'msw/node';
import { APIHandlers } from './API/APIHandlers';

export const server = setupServer(...APIHandlers);

beforeAll(() =>
    server.listen({
        onUnhandledRequest(req) {
            console.error('Found an unhandled %s request to %s', req.method, req.url.href);
        }
    })
);

afterAll(() => server.close());
afterEach(() => server.resetHandlers());
