import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { StripeService } from '../stripe/stripe.service';

@Injectable()
export class CreditGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private stripeService: StripeService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.id;

    const user = await this.userService.getUserData(userId);

    if (user.credits <= 0) {
      if (!user.finishStartCredits) {
        throw new ForbiddenException(
          'You have finished your free credits. Please subscribe to have more coins.',
        );
      } else {
        //get user subscription
        let theUser = await this.userService.getUserData(userId);
        let stripeCustomerId = theUser.stripeCustomerId;
        let userSubscriptionsObject: any =
          await this.stripeService.customerSubscriptions(stripeCustomerId);
        let userSubscriptions = userSubscriptionsObject.data;

        // console.log('userSubscriptions:', userSubscriptions);

        // user don't have a subscription
        if (userSubscriptions.length === 0) {
          throw new ForbiddenException(
            `You don't have a subscription. Please subscribe to have more credit.`,
          );
        }

        // user don't pay his subscription
        if (userSubscriptions[0].status === 'past_due') {
          throw new ForbiddenException(
            `You didn't pay your subscription. Please pay to have more credit.`,
          );
        }

        // user have subscription but exceed its credits
        throw new ForbiddenException(
          'You have exceed your subscription credits for this month. Please resubscribe to have more credit.',
        );
      }
    }

    return true;
  }
}
