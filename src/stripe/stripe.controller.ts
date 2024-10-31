import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { join } from 'path';
import * as fs from 'fs';
import { AuthGuard } from 'src/gurads/auth.guard';
import { UserId } from 'src/decorators/user-id.decorator';
import { UserTokenDto } from './dtos/user-token.dto';

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
  @ApiTags('Stripe: Create Customer')
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
  @ApiTags('Stripe: Customer Data')
  async customerData(@Body() body: { customerId: string }) {
    console.log('aloo');

    return await this.stripeService.customerData(body.customerId);
  }

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        meterId: { type: 'string' },
        customerId: { type: 'string' },
      },
    },
  })
  @ApiTags('Stripe: Meter Data')
  @Post('/meter-data')
  async meterData(@Body() body: { meterId: string; customerId: string }) {
    return await this.stripeService.meterData(body.meterId, body.customerId);
  }

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        subsItemId: { type: 'string' },
      },
    },
  })
  @Post('/subsItem-data')
  @ApiTags('Stripe: Subscription Item Data')
  async subsItemData(@Body() body: { subsItemId: string }) {
    return await this.stripeService.subsItemData(body.subsItemId);
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
  @ApiTags('Stripe: Session Data')
  async sessionData(@Body() body: { sessionId: string }) {
    return await this.stripeService.sessionData(body.sessionId);
  }

  @Post('/create-stripe-customer-for-all-users')
  @ApiTags('Stripe: Create Stripe Customer For All Users')
  async createCustomerIdsForAllUsers() {
    return await this.stripeService.createCustomerIdForAllUsers();
  }

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        customerId: { type: 'string' },
      },
    },
  })
  @Post('/create-checkout-session')
  @ApiTags('Stripe: Create Checkout Session')
  async createCheckoutSession(@Body() body: { customerId: string }) {
    return await this.stripeService.createCheckoutSession(body.customerId);
  }

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'number' },
      },
    },
  })
  @Post('/create-customer-session')
  @ApiTags('Stripe: Create Stripe Customer Session')
  async createCustomerSession(@Body() body: { userId: number }) {
    return await this.stripeService.createCustomerSession(body.userId);
  }

  @ApiQuery({ name: 'session_id', required: true })
  @Get('/success-checkout')
  @ApiTags('Stripe: Success Checkout')
  async successCheckoutSession(@Query() query: { session_id: number }) {
    return await this.stripeService.successCheckoutSession(query.session_id);
  }

  @ApiQuery({ name: 'session_id', required: true })
  @Get('/cancel-checkout')
  @ApiTags('Stripe: Cancel Checkout')
  async cancelCheckoutSession(@Query() query: { session_id: number }) {
    return await this.stripeService.cancelCheckoutSession(query.session_id);
  }

  @ApiBody({
    schema: { type: 'object', properties: { customerId: { type: 'string' } } },
  })
  @Post('/portal-session')
  @ApiTags('Stripe: Portal Session')
  async getPortalSession(@Body() body: { customerId: string }) {
    return await this.stripeService.getPortalSession(body.customerId);
  }

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        stripe_customer_id: { type: 'string' },
      },
    },
  })
  @Post('/record-token')
  @ApiTags('Stripe: Record Token')
  async recordToken(@Body() body: { stripe_customer_id: string }) {
    return await this.stripeService.recordToken(body.stripe_customer_id);
  }

  @Post('/webhook')
  @ApiTags('Stripe: Webhook')
  async webhookListen(@Req() req) {
    return await this.stripeService.webhookListen(req);
  }

  @Get('/prices')
  @ApiTags('Stripe: Prices')
  async allPrices() {
    return await this.stripeService.allPrices();
  }

  @Get('/products')
  @ApiTags('Stripe: Products')
  async allProducts() {
    return await this.stripeService.allProducts();
  }

  @Get('/subscriptions')
  @ApiTags('Stripe: Subscriptions')
  async allSubscriptions() {
    return await this.stripeService.allSubscriptions();
  }

  @ApiQuery({ name: 'userToken' })
  @Get('/pricing-table')
  @ApiTags('Stripe: Pricing Table')
  async getPricingTable(
    @Res() res: FastifyReply,
    @Query() query: UserTokenDto,
  ) {
    return await this.stripeService.getPricingTable(query.userToken, res);
  }

  @UseGuards(AuthGuard)
  @Get('/general-payments')
  @ApiTags('Stripe: General Payments')
  @ApiBearerAuth()
  async generalPayments(@UserId() userId: number) {
    return await this.stripeService.generalPayment(userId);
  }

  @Get('/test-pricing-table')
  async testGetPricingTable(@Res() res: FastifyReply) {
    // return true;

    const filePath = join(
      __dirname,
      '../../../',
      'public',
      'views',
      'stripe.html',
    );
    const stream = fs.createReadStream(filePath);
    return res.type('text/html').send(stream);
  }
}
