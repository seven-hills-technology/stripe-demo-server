import {Server} from '@reperio/hapijs-starter';
import {Request, RequestEvent, ResponseToolkit} from 'hapi';
import {config} from './config';
import {routes} from './routes';
import {appLogger} from './log';
import {StripeService} from './services/stripeService';
import {AppServer} from './types/hapiGenericTypes';

export async function createServer() {
    const hapijsStarter = new Server({
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

    await hapijsStarter.configure();
    const server = hapijsStarter.server as AppServer;
    server.route(routes);

    server.events.on({ name: 'request', channels: ['error'] }, (request: Request, e: RequestEvent) => {
        const logger = request.server.app.appLogger;
        const correlationId = request.info.id;

        const errorWithCorrelationId = {...e, correlationId, stack: (e.error as Error).stack};

        logger.error('Request failed.', errorWithCorrelationId);
    });

    server.ext({
        type: 'onPreHandler',
        method: async (request, h) => {
            // (request.app as IRequestApplicationState).uows = [];
            //
            request.app.getStripeService = async () => {
                return new StripeService();
            };

            return h.continue;
        }
    });

    server.app.appLogger = appLogger;

    return hapijsStarter;
}
