import Joi from '@hapi/joi';
import {AppServerRoute} from '../types/hapiGenericTypes';

export const routes: AppServerRoute[] = [
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
            const chargeRequest = request.payload as {chargeAmount: number, stripeTokenId: string};
            const stripeService = await request.app.getStripeService();
            const stripeCustomer = await stripeService.assertAndRetrieveStripeCustomerForEmail('seanprice@sevenhillstechnology.com', {source: chargeRequest.stripeTokenId});
            await stripeService.createInvoiceItem(stripeCustomer.id, 'test charge', chargeRequest.chargeAmount * 100);
            const invoice = await stripeService.createInvoice(stripeCustomer.id);
            return invoice;
        }
    },
    {
        method: 'POST',
        path: '/stripe/checkout-session',
        options: {
            auth: false
        },
        handler: async (request, h) => {
            const stripeService = await request.app.getStripeService();
            const stripeCheckoutSession = await stripeService.createStripeCheckoutSession();
            return stripeCheckoutSession;
        }
    }
];
