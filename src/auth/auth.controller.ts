import { Controller, Get, Post, Body, UseGuards, } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { Auth, GetRawHeaders, GetUser } from './decorators';
import { RoleProtected } from './decorators/role-protected/role-protected.decorator';
import { CreateUserDTO, LoginUserDTO } from './dto';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { ValidRoles } from 'src/auth/interfaces';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags("Auth")
export class AuthController {
  constructor(private readonly authService: AuthService) { }


  @Get('check-status')
  @Auth()  
  CheckAuthStatus(@GetUser() user: User) {
    return this.authService.checkStatus(user)
  }

  @Post('register')
  async create(@Body() createUserDTO: CreateUserDTO) {
    return await this.authService.create(createUserDTO);
  }


  @Post('login')
  async loginUser(@Body() loginUserDTO: LoginUserDTO) {
    return await this.authService.login(loginUserDTO);
  }

  //@SetMetadata('roles',['admin','superuser'])  
  @Get('private2')
  @RoleProtected(ValidRoles.superUser, ValidRoles.user)
  @UseGuards(AuthGuard(), UserRoleGuard)
  async getUser(@GetUser() user: User) {
    return {
      ok: true,
      user
    }
  }

  @Get('private3')
  @Auth(ValidRoles.superUser, ValidRoles.admin)
  async getUser3(@GetUser() user: User) {
    return {
      ok: true,
      user
    }
  }


  @Get('private')
  @UseGuards(AuthGuard())
  async testing(
    //@Req() request: Express.Request,
    @GetUser() user: User,
    @GetRawHeaders() rawHeaders: string[],
    @GetUser('email') userEmail: string
  ) {
    return {
      ok: true,
      message: 'testing',
      user,
      userEmail,
    }
  }


}
