import {Server, ServerRoute} from 'hapi';
import {IServerApplicationState} from './serverApplicationState';
import {IRequestApplicationState} from './requestApplicationState';

export type AppServer = Server<IServerApplicationState, IRequestApplicationState>;
export type AppServerRoute = ServerRoute<IServerApplicationState, IRequestApplicationState>;