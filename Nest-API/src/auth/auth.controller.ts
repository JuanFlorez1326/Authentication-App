import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { AuthGuard } from './guards/auth.guard';
import { LoginResponse } from './interfaces/login-response';
import { CreateUserDto, LoginDto, RegisterUserDto, UpdateAuthDto } from './dto';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('/login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('/register')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @UseGuards( AuthGuard )
  @Get()
  findAll(@Request() req: Request ) {
    return this.authService.findAll();
  }

  @UseGuards( AuthGuard )
  @Get('check-token')
  checkToken(@Request() req: Request): LoginResponse {
    const user = req['user'] as User;
    return { user, token: this.authService.generateJwt({ id: user._id }) }
  }
}