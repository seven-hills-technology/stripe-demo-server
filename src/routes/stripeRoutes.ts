import {ServerRoute} from 'hapi';
import Joi from '@hapi/joi';
import {IRequestApplicationState} from '../types/requestApplicationState';
import {ChargeRequest} from '../models/chargeRequest';

export const routes: ServerRoute[] = [
    {
        method: 'POST',
        path: '/stripe/charge',
        options: {
            auth: false,
            validate: {
                payload: {
                    chargeAmount: Joi.number().required(),
                    stripeTokenId: Joi.string().required()
                }
            }
        },
        handler: async (request, h) => {
            const chargeRequest = request.payload as ChargeRequest;
            const stripeService = await (request.app as IRequestApplicationState).getStripeService();
            const stripeCustomer = await stripeService.assertAndRetrieveStripeCustomerForEmail('seanprice@sevenhillstechnology.com', {source: chargeRequest.stripeTokenId});
            await stripeService.createInvoiceItem(stripeCustomer.id, 'test charge', chargeRequest.chargeAmount * 100);
            const invoice = await stripeService.createInvoice(stripeCustomer.id);
            return invoice;
        }
    }
];
