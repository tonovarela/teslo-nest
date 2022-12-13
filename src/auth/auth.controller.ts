import { Controller, Get, Post, Body, Req, UseGuards, Headers, SetMetadata} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { GetRawHeaders, GetUser } from './decorators';
import { CreateUserDTO, LoginUserDTO } from './dto';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role/user-role.guard';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  async create(@Body() createUserDTO: CreateUserDTO) {
    return await this.authService.create(createUserDTO);
  }
  @Post('login')
  async loginUser(@Body() loginUserDTO: LoginUserDTO) {
    return await this.authService.login(loginUserDTO);
  }

  @Get('private2')
  @SetMetadata('roles',['admin','superuser'])
  @UseGuards(AuthGuard(),UserRoleGuard)
  async getUser(@GetUser() user:User){
    return {
      ok:true,
      user
    }
  }

  @Get('private')
  @UseGuards(AuthGuard())

  async testing(
    //@Req() request: Express.Request,
    @GetUser() user: User,
    @GetRawHeaders() rawHeaders:string[],
    @GetUser('email') userEmail: string) {
    //console.log(rawHeaders);
    
    return {
      ok: true,
      message: 'testing',
      user,
      userEmail,
    }
  }


}
