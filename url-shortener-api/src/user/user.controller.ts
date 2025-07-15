import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login-dto';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * API to sign up a new user
   * @param createUserDto - The user data
   * @returns The user data, along with the access token
   */
  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.userService.signUp(createUserDto);
  }

  /**
   * API to login a user
   * @param loginDto - The user data, containing the email and password
   * @returns The user data, along with the access token
   */
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }
}
