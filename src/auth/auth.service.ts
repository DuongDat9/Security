import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from '../users/dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Yêu cầu 3: Đăng ký username/password
   * - Lấy username & password
   * - Hash password (bcrypt) trong UsersService
   * - Lưu vào CSDL
   */
  async register(dto: RegisterDto) {
    return this.usersService.register(dto);
  }

  /**
   * Yêu cầu 4: Đăng nhập & cấp JWT
   * - Tìm user theo username
   * - So sánh password nhập vào với password đã hash trong CSDL (bcrypt.compare)
   * - Nếu đúng -> sinh JWT access_token
   */
  async login(dto: LoginDto): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(dto.username);
    if (!user) {
      throw new UnauthorizedException('Sai username hoặc password');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Sai username hoặc password');
    }

    const payload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
