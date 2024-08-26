import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { ApiBody } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { join } from 'path';

@Controller({ path: 'stripe', version: '1' })
export class StripeController {
  constructor(private stripeService: StripeService) {}

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
      },
    },
  })
  @Post('/create-customer')
  async createCustomer(@Body() body: { email: string }) {
    return await this.stripeService.createCustomer(body.email);
  }

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        customerId: { type: 'string' },
      },
    },
  })
  @Post('/customer-data')
  async customerData(@Body() body: { customerId: string }) {
    return await this.stripeService.customerData(body.customerId);
  }

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        sessionId: { type: 'string' },
      },
    },
  })
  @Post('/session-data')
  async sessionData(@Body() body: { sessionId: string }) {
    return await this.stripeService.sessionData(body.sessionId);
  }

  @Post('/create-customer-for-all-users')
  async createCustomerIdsForAllUsers() {
    return await this.stripeService.createCustomerIdForAllUsers();
  }

  @Post('/create-checkout-session')
  async createCheckoutSession() {
    return await this.stripeService.createCheckoutSession(12);
  }

  @Get('/success-checkout')
  async successCheckoutSession(@Query() query: { session_id: number }) {
    return await this.stripeService.successCheckoutSession(query.session_id);
  }

  @Get('/cancel-checkout')
  async cancelCheckoutSession(@Query() query: { session_id: number }) {
    return await this.stripeService.cancelCheckoutSession(query.session_id);
  }

  @ApiBody({
    schema: { type: 'object', properties: { session_id: { type: 'number' } } },
  })
  @Post('/portal-session')
  async getPortalSession(@Body() body: { session_id: string }) {
    return await this.stripeService.getPortalSession(body.session_id);
  }

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        stripe_customer_id: { type: 'number' },
      },
    },
  })
  @Post('/record-token')
  async recordToken(@Body() body: { stripe_customer_id: string }) {
    return await this.stripeService.recordToken(body.stripe_customer_id);
  }

  @Post('/webhook')
  async webhookListen(@Req() req) {
    return await this.stripeService.webhookListen(req);
  }

  @Get('/prices')
  async allPrices() {
    return await this.stripeService.allPrices();
  }

  @Get('/products')
  async allProducts() {
    return await this.stripeService.allPrices();
  }

  @Get('/subscriptions')
  async allSubscriptions() {
    return await this.stripeService.allSubscriptions();
  }

  @Get('/stripeHtml')
  getHome(@Res() res: FastifyReply) {
    console.log('getHome');
    // return true;

    const filePath = join(
      __dirname,
      '../../../',
      'public',
      'views',
      'stripe.html',
    );
    // const stream = fs.createReadStream(resolvePath('index.html'));
    // return res.type('text/html').send(stream);

    // const filePath = join(__dirname, 'views', 'stripe.html');
    console.log(filePath);

    res.header('Content-Type', 'text/html');

    return res.send(filePath);

    res.sendFile(filePath);
  }
}
