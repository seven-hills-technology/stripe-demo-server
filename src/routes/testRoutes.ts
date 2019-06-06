import {ServerRoute} from 'hapi';

export const routes: ServerRoute[] = [
    {
        method: 'GET',
        path: '/hello',
        options: {
            auth: false
        },
        handler: async (request, h) => {
            return {message: 'hello'};
        }
    },
    {
        method: 'GET',
        path: '/teapot',
        options: {
            auth: false
        },
        handler: async (request, h) => {
            return h.response('').code(418);
        }
    }
];
