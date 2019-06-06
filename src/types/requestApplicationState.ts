import {IRequestApplicationState as HapijsStarterRequestApplicationState} from '@reperio/hapijs-starter/dist/models/requestApplicationState';
import {StripeService} from '../services/stripeService';

export interface IRequestApplicationState extends HapijsStarterRequestApplicationState {
    getStripeService: () => Promise<StripeService>;
}