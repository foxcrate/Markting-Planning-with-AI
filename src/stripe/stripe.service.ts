import {
  Injectable,
  InternalServerErrorException,
  Res,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';

import Stripe from 'stripe';

import { ConfigService } from '@nestjs/config';
import { UserRepository } from 'src/user/user.repository';
import { FastifyRequest } from 'fastify';
import moment from 'moment';
import { join } from 'path';
import * as fs from 'fs';
import { FastifyReply } from 'fastify';
import { SettingService } from 'src/settings/setting.service';
import { SettingsEnum } from 'src/enums/settings.enum';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class StripeService {
  private stripe;

  constructor(
    private configService: ConfigService,
    private userRepository: UserRepository,
    private config: ConfigService,
    private settingService: SettingService,
    private readonly jwtService: JwtService,
  ) {
    this.stripe = new Stripe(
      this.configService.getOrThrow('STRIPE_SECRET_KEY'),
      {
        apiVersion: '2024-06-20',
      },
    );
  }

  async createCustomer(name?: string, email?: string, phone?: string) {
    const customer = await this.stripe.customers.create({
      name: name,
      email: email,
      phone: phone,
    });
    return customer;
  }

  async customerSubscriptions(customerId: string): Promise<[]> {
    const subscriptions = await this.stripe.subscriptions.list({
      customer: customerId,
    });
    return subscriptions;
  }

  async createCustomerIdForAllUsers() {
    let allUsers: any[] = await this.userRepository.findAll(null);
    allUsers.forEach(async (user) => {
      const customer = await this.stripe.customers.create({
        email: user.contactEmail,
        name: user.firstName,
        phone: user.phoneNumber,
      });
      // console.log({ customer });

      await this.userRepository.setStripeCustomerId(customer.id, user.id);
    });

    return true;
  }

  async customerData(customerId: string) {
    console.log('customer id:', customerId);

    const customer = await this.stripe.customers.retrieve(customerId);
    // console.log('customer:', customer);
    const customerSubscriptions = await this.stripe.subscriptions.list({
      customer: customer.id,
    });
    console.log('----------------------');

    console.log(
      'customerSubscriptions:',
      JSON.stringify(customerSubscriptions),
    );
    return true;
  }

  async meterData(meterId: string, customerId: string) {
    // const meter = await this.stripe.billing.meters.retrieve(meterId);
    // console.log('meter:', meter);
    // let customerId = 'cus_QjJIDRyYbz9ig3';

    let fromTimestamp = moment().startOf('day').unix();
    let toTimestamp = moment().add(1, 'months').endOf('month').unix();

    console.log('fromTimestamp:', fromTimestamp);
    console.log('toTimestamp:', toTimestamp);

    const meterEvent = await this.stripe.billing.meters.listEventSummaries(
      meterId,
      {
        customer: customerId,
        start_time: fromTimestamp,
        end_time: toTimestamp,
        // value_grouping_window: 'month',
      },
    );

    console.log('meterEvent:', meterEvent);

    return meterEvent;
  }

  async subsItemData(subsItemId: string) {
    console.log('subsItemId:', subsItemId);

    const subsItem =
      await this.stripe.subscriptionItems.listUsageRecordSummaries(subsItemId);

    console.log('subsItem:', subsItem);

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

  async webhookListen(req: FastifyRequest) {
    console.log('----webhook listen----');

    // console.log('reqBody:', req.body);

    let event: any = req.body;

    // const endpointSecret = 'whsec_56FeRmvdtjGdWv4QWmYU5kmB7UUuD6Gr';

    // const signature = req.headers['stripe-signature'];
    // console.log('signature', signature);

    // let event: Stripe.Event = this.stripe.webhooks.constructEvent(
    //   reqBody,
    //   signature,
    //   endpointSecret,
    // );

    switch (event.type) {
      case 'invoice.payment_succeeded':
        console.log('event', event);
        console.log('-------------');

        let subscriptionId = event.data.object.subscription;

        let customerId = event.data.object.customer;

        const theSubscription =
          await this.stripe.subscriptions.retrieve(subscriptionId);

        console.log('theSubscription:', theSubscription);

        let item = theSubscription.items.data[0];

        console.log('item:', item);

        let priceCredits = item.price.metadata.credits;

        if (!priceCredits) {
          console.error('priceCredits not found');
          break;
        }

        let theCredits = priceCredits;
        console.log('theCredits:', theCredits);

        // let productId = item.price.product;

        // const theProduct = await this.stripe.products.retrieve(productId);

        // console.log('thProduct:', theProduct);

        // let theCredits = theProduct.metadata.credits;
        // console.log('theCredits:', theCredits);

        let theUser =
          await this.userRepository.findByStripeCustomerId(customerId);

        if (!theUser) {
          throw new UnprocessableEntityException(
            'Stripe Administration Error, User not found',
          );
        }

        await this.userRepository.update(
          {
            credits: Number(theUser.credits) + Number(theCredits),
          },
          theUser.id,
        );

        break;
      default:
      // Unexpected event type
      // console.log(`Unhandled event type ${event.type}.`);
    }

    return true;
  }

  async recordToken(stripeCustomerId) {
    const meterEvent = await this.stripe.billing.meterEvents.create({
      event_name: 'token_used',
      payload: {
        value: '10',
        stripe_customer_id: stripeCustomerId,
      },
    });
    console.log('meterEvent:', meterEvent);

    return true;
  }

  async allPrices() {
    const prices = await this.stripe.prices.list({
      active: true,
      // limit: 10,
      expand: ['data.product'],
    });
    return prices;

    // const subscriptions = await this.stripe.subscriptions.list();
    // return subscriptions;
  }

  async allProducts() {
    const products = await this.stripe.products.list({
      active: true,
      // limit: 10,
      expand: ['data.price'],
    });
    return products;
  }

  async getOneProduct(productId: String) {
    const product = await this.stripe.products.retrieve(productId);
    return product;
  }

  async allSubscriptions() {
    const subscriptions = await this.stripe.subscriptions.list();
    return subscriptions;
  }

  async createCheckoutSession(customerId: string) {
    //////////////////////
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
    //////////////

    const session = await this.stripe.checkout.sessions.create({
      // customer: theUser.stripeCustomerId,
      customer: customerId,
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

    console.log('----session checkout----');
    console.log(session);

    return session;
  }

  async createCustomerSession(userId: number) {
    let theUser = await this.userRepository.findById(userId);
    const session = await this.stripe.customerSessions.create({
      customer: theUser.stripeCustomerId,
      components: {
        pricing_table: {
          enabled: true,
        },
      },
    });
    console.log('----session----');
    console.log(session);
    return session;
  }

  async getPortalSession(customerId: string) {
    let theCustomer = await this.stripe.customers.retrieve(customerId);

    // console.log('customer:', theCustomer);

    const returnUrl = 'https://www.google.com/';

    const portalSession = await this.stripe.billingPortal.sessions.create({
      customer: theCustomer.id,
      return_url: returnUrl,
    });

    // console.log('portalSession:', portalSession);

    return portalSession.url;
  }

  async getPricingTable(userToken: string, @Res() res: FastifyReply) {
    // console.log('getPricingTable');

    let decoded = this.verifyUserToken(userToken);

    // console.log('decoded:', decoded);

    let userId = decoded.userId;

    let theUser = await this.userRepository.findById(userId);

    const customerSession = await this.stripe.customerSessions.create({
      customer: theUser.stripeCustomerId,
      components: {
        pricing_table: {
          enabled: true,
        },
      },
    });

    let clientSecret = customerSession.client_secret;

    let pricingTable = await this.settingService.getOneByName(
      SettingsEnum.PRICING_TABLE_ID,
    );

    const filePath = join(
      __dirname,
      '../../../',
      'public',
      'views',
      'stripe.html',
    );

    let html = `
    <script async src="https://js.stripe.com/v3/pricing-table.js"></script>
    <stripe-pricing-table
      pricing-table-id="${pricingTable.value}"
      publishable-key="${this.configService.getOrThrow('STRIPE_PUBLISHABLE_KEY')}"
      customer-session-client-secret= "${clientSecret}"
    >
    </stripe-pricing-table>
    `;

    fs.writeFile(filePath, html, (err) => {
      if (err) {
        throw new InternalServerErrorException('Error in writing to the file');
      } else {
        const stream = fs.createReadStream(filePath);
        return res.type('text/html').send(stream);
      }
    });
  }

  async generalPayment(userId: number) {
    let theUser = await this.userRepository.findById(userId);
    let stripeCustomerId = theUser.stripeCustomerId;
    let userSubscriptionsObject: any =
      await this.customerSubscriptions(stripeCustomerId);

    let userSubscriptions = userSubscriptionsObject.data;

    if (userSubscriptions.length === 0) {
      console.log('no subscriptions');

      let userToken = await this.createUserToken(userId);

      const encodedUserToken = encodeURIComponent(userToken);

      return `${this.config.get('APP_DOMAIN')}/v1/stripe/pricing-table?userToken=${encodedUserToken}`;
    } else {
      // userSubscriptions.forEach((subscription) => {
      //   //log subscription
      //   console.log('---------------------');

      //   console.log('subscription:', subscription);
      // });

      // return true;

      if (userSubscriptions.length > 1) {
        console.log('more than one subscriptions');

        throw new UnprocessableEntityException(
          `Stripe Administration Error, user should have only one subscription`,
        );
      }

      let items = userSubscriptions[0].items.data;

      if (items.length > 1) {
        console.log('more than one item in a subscription');

        throw new UnprocessableEntityException(
          `Stripe Administration Error, subscription should have only one item`,
        );
      }

      let price = items[0].price;

      let product = await this.getOneProduct(price.product);

      // console.log('product:', product);

      let credits = product.metadata.credits;

      // console.log('credits:', credits);

      return await this.getPortalSession(stripeCustomerId);
    }
  }

  private createUserToken(userId: number) {
    const payload = {
      userId: userId,
    };
    return this.jwtService.sign(payload, {
      expiresIn: '1h',
    });
  }

  private verifyUserToken(userToken) {
    try {
      const decoded = this.jwtService.verify(
        userToken,
        this.config.get('JWT_SECRET'),
      );
      // console.log({ decoded });

      return decoded;
    } catch (error) {
      // console.log('error in userToken in stripe controller:', error);
      throw new UnauthorizedException('Invalid userToken to Stripe');
    }
  }
}
