import {IServerApplicationState as HapijsStarterServerApplicationState} from '@reperio/hapijs-starter/dist/models/serverApplicationState';
import {appLogger} from '../log';

export interface IServerApplicationState extends HapijsStarterServerApplicationState {
    appLogger: typeof appLogger
}