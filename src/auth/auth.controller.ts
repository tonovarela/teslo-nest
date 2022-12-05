import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { throws } from 'assert';
import { AuthService } from './auth.service';
import { CreateUserDTO, LoginUserDTO } from './dto';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
   async create(@Body() createUserDTO:CreateUserDTO ) {
    return await this.authService.create(createUserDTO);    
  }
  @Post('login')
  async loginUser(@Body() loginUserDTO:LoginUserDTO){

    return await this.authService.login(loginUserDTO);

  }


}
