import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Roles } from './decorators/roles.decorator';
import { UserRoles } from './enums/user-roles.enum';
import { RoleGuard } from './gurads/role.guard';
import { AuthGuard } from './gurads/auth.guard';
import { JwtService } from '@nestjs/jwt';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly jwtService: JwtService,
  ) {}

  @Get()
  // @Roles(UserRoles.CUSTOMER)
  // @UseGuards(AuthGuard, RoleGuard)
  getHello(): string {
    return this.appService.getHello();
  }

  // @Post()
  // async create(@Body() body) {
  //   console.log({ body });
  //   if (body.email == 'a@a.com' && body.password == 'qweasd') {
  //     const payload = {
  //       sub: '1',
  //       tokenType: 'normal',
  //     };
  //     let token = this.jwtService.sign(payload, {
  //       expiresIn: '30d',
  //     });
  //     console.log({ token });

  //     return token;
  //   }

  //   console.log(false);

  //   return false;
  // }
}
