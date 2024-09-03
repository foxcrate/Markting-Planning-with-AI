import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class PaginationGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: any = context.switchToHttp().getRequest();
    const { page, limit } = request.query;

    let pageNumber = parseInt(page as string, 10);
    let limitNumber = parseInt(limit as string, 10);

    if (!page) {
      pageNumber = 1;
    }

    if (!limit) {
      limitNumber = 20;
    }

    if (
      pageNumber < 1 ||
      limitNumber < 1 ||
      isNaN(pageNumber) ||
      isNaN(limitNumber)
    ) {
      throw new BadRequestException('Page and limit must be valid numbers.');
    }

    let offset: number = (pageNumber - 1) * limitNumber;

    // Attach the validated and parsed pagination parameters to the request object
    request.pagination = {
      page: pageNumber,
      limit: limitNumber,
      offset: offset,
    };

    return true;
  }
}
