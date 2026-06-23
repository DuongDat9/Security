import {
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class UsersService {
  // Số "vòng" (rounds) dùng cho bcrypt khi sinh salt - càng cao càng an toàn nhưng càng chậm
  private readonly SALT_ROUNDS = 10;

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * Đăng ký người dùng mới:
   * - Kiểm tra username đã tồn tại chưa
   * - Mã hóa (hash) password bằng bcrypt trước khi lưu
   * - Lưu username + password đã hash vào CSDL
   */
  async register(dto: RegisterDto): Promise<Omit<User, 'password'>> {
    const existed = await this.usersRepository.findOne({
      where: { username: dto.username },
    });
    if (existed) {
      throw new ConflictException('Username đã tồn tại');
    }

    // Mã hóa hàm băm (hashing) password - KHÔNG lưu plain text
    const hashedPassword = await bcrypt.hash(dto.password, this.SALT_ROUNDS);

    const user = this.usersRepository.create({
      username: dto.username,
      password: hashedPassword,
    });

    const saved = await this.usersRepository.save(user);

    // Loại bỏ trường password trước khi trả về cho client
    const { password, ...result } = saved;
    return result;
  }

  async findOne(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }
}
