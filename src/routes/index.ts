import {ServerRoute} from 'hapi';

import {routes as stripeRoutes} from './stripeRoutes';
import {routes as testRoutes} from './testRoutes';

export const routes: ServerRoute[] = [
    ...stripeRoutes,
    ...testRoutes
];
