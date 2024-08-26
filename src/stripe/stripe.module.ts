import { Module } from '@nestjs/common';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [StripeController],
  providers: [StripeService],
  imports: [UserModule],
})
export class StripeModule {}
