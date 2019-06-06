import {Server} from '@reperio/hapijs-starter';
import {Request, RequestEvent, ResponseToolkit} from 'hapi';
import {config} from './config';
import {routes} from './routes';
import {appLogger} from './log';
import {IRequestApplicationState} from './types/requestApplicationState';
import {IServerApplicationState} from './types/serverApplicationState';
import {StripeService} from './services/stripeService';

export async function createServer() {
    const server = new Server({
        host: config.host,
        port: config.port,
        defaultRoute: true,
        statusMonitor: true,
        cors: true,
        corsOrigins: ['*'],
        authEnabled: true,
        authSecret: config.jwtSecret,
        logAutoTraceLogging: false,
    });

    await server.configure();
    server.server.route(routes);

    server.server.events.on({ name: 'request', channels: ['error'] }, (request: Request, e: RequestEvent) => {
        const logger = (request.server.app as IServerApplicationState).appLogger;
        const correlationId = request.info.id;

        const errorWithCorrelationId = {...e, correlationId, stack: (e.error as Error).stack};

        logger.error('Request failed.', errorWithCorrelationId);
    });

    server.server.ext({
        type: 'onPreHandler',
        method: async (request, h) => {
            // (request.app as IRequestApplicationState).uows = [];
            //
            (request.app as IRequestApplicationState).getStripeService = async () => {
                return new StripeService();
            };

            return h.continue;
        }
    });

    (server.app as IServerApplicationState).appLogger = appLogger;

    return server;
}
