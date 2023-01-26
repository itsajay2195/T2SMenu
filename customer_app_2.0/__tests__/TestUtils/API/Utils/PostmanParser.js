import { Collection, Property } from 'postman-collection';
import { ApiException, apiRequest } from './APIHandlerUtils';
import _ from 'lodash';

export function readFromPostmanCollection(postmanCollectionJson) {
    const myCollection = new Collection(postmanCollectionJson);
    const apis = [];
    const requests = allRequests(myCollection);
    requests?.forEach((request) => {
        const api = generateAPI(request, myCollection);
        if (api) {
            apis.push(api);
        }
    });
    return apis;
}

function generateAPI(item, collection) {
    if (item) {
        const { request } = item;
        return apiRequest(
            request.method,
            Property.replaceSubstitutions(request.url.getHost() + request.url.getPath(), collection.variables),
            generateHandler(item, collection)
        );
    } else {
        console.log('Received invalid request');
    }
}

function generateHandler(item, collection) {
    function handler(req, resp, ctx) {
        if (item.responses) {
            const filteredResponses = item.responses.filter((response) => {
                const { originalRequest } = response;
                // query
                if ((originalRequest?.url?.query?.count() ?? 0) > 0) {
                    const query = req.url.searchParams;
                    const failedResponse = originalRequest.url.query.filter(({ key, value }) => {
                        if (key.endsWith('[]')) {
                            return !query.getAll(key).includes(Property.replaceSubstitutions(value, collection.variables));
                        } else {
                            return query.get(key) !== Property.replaceSubstitutions(value, collection.variables);
                        }
                    });
                    if (failedResponse.length > 0) {
                        return false;
                    }
                }
                // body
                if (originalRequest.body && originalRequest.body.raw) {
                    const body = Property.replaceSubstitutions(response.originalRequest.body.raw, collection.variables);
                    if (!_.isEqual(JSON.parse(body), req.body)) {
                        return false;
                    }
                }
                return true;
            });
            if (filteredResponses.length > 0) {
                if (filteredResponses[0].code === 200) {
                    return JSON.parse(filteredResponses[0].body);
                }
                throw new ApiException(filteredResponses[0].code, JSON.parse(filteredResponses[0].body));
            }
            throw new ApiException(404, { message: 'response not found' });
        }
    }

    return handler;
}

// Loops through all collection and folder to fetch all request
function allRequests(collection) {
    const requests = [];
    function findRequests(items) {
        if (items.items && items.items.count() > 0) {
            items.items.each((item) => {
                findRequests(item);
            });
        } else {
            requests.push(items);
        }
    }

    findRequests(collection);
    return requests;
}
