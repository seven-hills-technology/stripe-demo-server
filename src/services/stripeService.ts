import Stripe, {customers, invoiceItems, invoices, IOptionsMetadata} from 'stripe';
import {config} from '../config';

export class StripeService {
    private stripe: Stripe;

    constructor() {
        this.stripe = new Stripe(config.stripeSecretKey);
    }

    async assertAndRetrieveStripeCustomerForEmail(email: string, customerParameters?: customers.ICustomerUpdateOptions): Promise<customers.ICustomer> {
        let stripeCustomer: customers.ICustomer | null = null;
        try {
            const matchingStripeCustomers = await this.stripe.customers.list({
                email
            });
            stripeCustomer = matchingStripeCustomers != null && matchingStripeCustomers.total_count != null && matchingStripeCustomers.total_count > 0 ? matchingStripeCustomers.data[0] : null;
        } catch (e) {
            stripeCustomer = null;
        }

        if (stripeCustomer != null) {
            if (customerParameters != null) {
                const updatedStripeCustomer = await this.stripe.customers.update(stripeCustomer.id, customerParameters);
                return updatedStripeCustomer;
            } else {
                return stripeCustomer;
            }
        } else {
            const newStripeCustomer = await this.stripe.customers.create({
                email,
                ...(customerParameters || {})
            });

            return newStripeCustomer;
        }
    }

    async createInvoiceItem(stripeCustomerId: string, description: string, amount: number, metadata?: IOptionsMetadata): Promise<invoiceItems.InvoiceItem> {
        return await this.stripe.invoiceItems.create({
            customer: stripeCustomerId,
            currency: "usd",
            amount,
            description,
            ...(metadata != null ? {metadata} : {})
        });
    }

    async createInvoice(stripeCustomerId: string): Promise<invoices.IInvoice> {
        return await this.stripe.invoices.create({
            customer: stripeCustomerId
        })
    }
}