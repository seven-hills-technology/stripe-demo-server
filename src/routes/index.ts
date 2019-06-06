import {ServerRoute} from 'hapi';

import {routes as testRoutes} from './testRoutes';

export const routes: ServerRoute[] = [
    ...testRoutes
];
