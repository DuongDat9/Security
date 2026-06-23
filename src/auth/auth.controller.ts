import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  Session,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from '../users/dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ===================== Yêu cầu 3 =====================
  // POST /auth/register - đăng ký username/password, password được hash trước khi lưu CSDL
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // ===================== Yêu cầu 4 =====================
  // POST /auth/login - đăng nhập, trả về JWT access_token
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // GET /auth/profile - route được bảo vệ, chỉ truy cập được khi có JWT hợp lệ
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user: { userId: number; username: string }) {
    return user;
  }

  // ===================== Yêu cầu 1: Cookies =====================
  // GET /auth/cookie-demo - set một cookie tên "username" sau khi đăng nhập thành công
  @Get('cookie-demo')
  setCookieDemo(@Res({ passthrough: true }) response: Response) {
    response.cookie('demo_cookie', 'hello_from_nestjs', {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 ngày
    });
    return { message: 'Cookie "demo_cookie" đã được set' };
  }

  // GET /auth/read-cookie - đọc cookie vừa set ở trên
  @Get('read-cookie')
  readCookieDemo(@Req() request: Request) {
    return { cookies: request.cookies };
  }

  // ===================== Yêu cầu 2: Session =====================
  // GET /auth/session-demo - mỗi lần gọi, đếm số lượt truy cập lưu trong session
  @Get('session-demo')
  sessionDemo(@Session() session: Record<string, any>) {
    session.visits = session.visits ? session.visits + 1 : 1;
    return { message: 'Session hoạt động', visits: session.visits };
  }
}
