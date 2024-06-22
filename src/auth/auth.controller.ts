import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { GetUser, Auth } from './decorators';
import { generateResponseObject } from '../common/helpers/transform-response.helper';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Auth('admin')
  async register(@Body() createUserDto: CreateUserDto ) {
    const user = await this.authService.createUser(createUserDto);
    return generateResponseObject( user, 200, 'User created succesfully');
  }

  @Post('login')
  async loginUser(@Body() loginUserDto:LoginUserDto){
    const loginData = await this.authService.loginUser(loginUserDto)
    return generateResponseObject( loginData, 200, 'User logged in succesfully');
  }

  @Get('check-status')
  @Auth()
  async  checkAuthStatus(
    @GetUser() user:User,
  ){
    const authStatus = await this.authService.checkAuthStatus(user);
    return generateResponseObject( authStatus, 200, 'User logged in succesfully');
  }
}
