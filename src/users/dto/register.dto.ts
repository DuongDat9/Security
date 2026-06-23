import { IsNotEmpty, IsString, MinLength } from 'class-validator';

/**
 * DTO dùng cho API đăng ký (POST /auth/register)
 * Dùng để lấy username và password từ người dùng (Yêu cầu 3).
 */
export class RegisterDto {
  @IsString()
  @IsNotEmpty({ message: 'username không được để trống' })
  username: string;

  @IsString()
  @MinLength(6, { message: 'password phải có ít nhất 6 ký tự' })
  password: string;
}
