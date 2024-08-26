import { Injectable } from '@nestjs/common';

import Stripe from 'stripe';

import { ConfigService } from '@nestjs/config';
import { UserRepository } from 'src/user/user.repository';
import { FastifyRequest } from 'fastify';

@Injectable()
export class StripeService {
  private stripe;

  constructor(
    private configService: ConfigService,
    private userRepository: UserRepository,
  ) {
    this.stripe = new Stripe(
      this.configService.getOrThrow('STRIPE_SECRET_KEY'),
      {
        apiVersion: '2024-06-20',
      },
    );
  }

  async createCustomer(customerEmail: string) {
    const customer = await this.stripe.customers.create({
      email: customerEmail,
    });
    return customer;
  }

  async createCustomerIdForAllUsers() {
    let allUsers: any[] = await this.userRepository.findAll();
    allUsers.forEach(async (user) => {
      const customer = await this.stripe.customers.create({
        email: user.contactEmail,
        name: user.firstName,
        phone: user.phoneNumber,
      });
      console.log({ customer });

      await this.userRepository.setStripeCustomerId(customer.id, user.id);
    });

    return true;
  }

  async customerData(customerId: string) {
    console.log('customer id:', customerId);

    const customer = await this.stripe.customers.retrieve(customerId);
    console.log('customer:', customer);
    const customerSubscriptions = await this.stripe.subscriptions.list({
      customer: customer.id,
    });
    console.log('customerSubscriptions:', customerSubscriptions);
    console.log('customerSubscription:', customerSubscriptions.data[0]);
    console.log(
      'customerSubscriptionItems:',
      customerSubscriptions.data[0].items.data,
    );
    // console.log('customerSubscriptions.items:', customerSubscriptions[0].data);
    return true;
  }

  async sessionData(sessionId: string) {
    console.log('session id:', sessionId);
    const session = await this.stripe.checkout.sessions.retrieve(sessionId);
    console.log({ session });
    return true;
  }

  async successCheckoutSession(sessionId: number) {
    console.log('success checkout session id:', sessionId);
    return true;
  }

  async cancelCheckoutSession(sessionId: number) {
    console.log('cancel checkout session id:', sessionId);
    return true;
  }

  async getPortalSession(customerId: string) {
    // const checkoutSession =
    //   await this.stripe.checkout.sessions.retrieve(sessionId);

    let theCustomer =
      await this.stripe.customers.retrieve('cus_QhlTmuZCv89ZYO');

    console.log('customer:', theCustomer);

    // This is the url to which the customer will be redirected when they are done
    // managing their billing with the portal.
    const returnUrl = 'https://www.google.com/';

    const portalSession = await this.stripe.billingPortal.sessions.create({
      customer: theCustomer.id,
      return_url: returnUrl,
    });

    console.log('portalSession:', portalSession);

    return portalSession.url;
  }

  async webhookListen(req: FastifyRequest) {
    console.log('----webhook listen----');

    console.log('reqBody:', req.body);

    let event: any = req.body;

    // const endpointSecret = 'whsec_56FeRmvdtjGdWv4QWmYU5kmB7UUuD6Gr';

    // const signature = req.headers['stripe-signature'];
    // console.log('signature', signature);

    // let event: Stripe.Event = this.stripe.webhooks.constructEvent(
    //   reqBody,
    //   signature,
    //   endpointSecret,
    // );
    let subscription;
    let status;

    switch (event.type) {
      case 'customer.subscription.trial_will_end':
        subscription = event.data.object;
        status = subscription.status;
        console.log(`Subscription status is ${status}.`);
        // Then define and call a method to handle the subscription trial ending.
        // handleSubscriptionTrialEnding(subscription);
        break;
      case 'customer.subscription.deleted':
        subscription = event.data.object;
        status = subscription.status;
        console.log(`Subscription status is ${status}.`);
        // Then define and call a method to handle the subscription deleted.
        // handleSubscriptionDeleted(subscriptionDeleted);
        break;
      case 'customer.subscription.created':
        subscription = event.data.object;
        status = subscription.status;
        console.log(`Subscription status is ${status}.`);
        // Then define and call a method to handle the subscription created.
        // handleSubscriptionCreated(subscription);
        break;
      case 'customer.subscription.updated':
        subscription = event.data.object;
        status = subscription.status;
        console.log(`Subscription status is ${status}.`);
        // Then define and call a method to handle the subscription update.
        // handleSubscriptionUpdated(subscription);
        break;
      case 'entitlements.active_entitlement_summary.updated':
        subscription = event.data.object;
        console.log(`Active entitlement summary updated for ${subscription}.`);
        // Then define and call a method to handle active entitlement summary updated
        // handleEntitlementUpdated(subscription);
        break;
      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}.`);
    }

    return true;
  }

  async recordToken(stripeCustomerId) {
    const meterEvent = await this.stripe.billing.meterEvents.create({
      event_name: 'token_used',
      payload: {
        value: '5',
        stripe_customer_id: stripeCustomerId,
      },
      identifier: '222222444',
    });
    console.log('meterEvent:', meterEvent);

    return true;
  }

  async allPrices() {
    // const prices = await this.stripe.prices.list({
    //   // limit: 3,
    // });
    // return prices;

    const subscriptions = await this.stripe.subscriptions.list();
    return subscriptions;
  }

  async allProducts() {
    const products = await this.stripe.products.list();
    return products;
  }

  async allSubscriptions() {
    const subscriptions = await this.stripe.subscriptions.list();
    return subscriptions;
  }

  async createCheckoutSession(userId: number) {
    // const prices = await this.stripe.prices.list({
    // lookup_keys: [req.body.lookup_key],
    // expand: ['data.product'],
    // });
    // let theProduct = await this.stripe.products.retrieve(
    //   prices.data[0].product,
    // );
    // prices.data.forEach(async (price) => {
    //   let product = await this.stripe.products.retrieve(price.product);
    //   console.log('product:', product);
    // });
    // return prices;

    let theUser = await this.userRepository.findById(userId);

    const session = await this.stripe.checkout.sessions.create({
      customer: theUser.stripeCustomerId,
      billing_address_collection: 'auto',
      line_items: [
        {
          price: 'price_1PraTkHji5VpLEv2rBOlPjsD',
        },
      ],
      payment_method_types: ['card'],
      mode: 'subscription',
      success_url: `${this.configService.getOrThrow('MY_LOCAL_DOMAIN')}/v1/stripe/success-checkout?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${this.configService.getOrThrow('MY_LOCAL_DOMAIN')}/v1/stripe/cancel-checkout?session_id={CHECKOUT_SESSION_ID}`,
    });

    // const session = await this.stripe.customerSessions.create({
    //   customer: theUser.stripeCustomerId,
    //   components: {
    //     pricing_table: {
    //       enabled: true,
    //     },
    //   },
    // });

    console.log('----session checkout----');
    console.log(session);

    return session;
  }
}
