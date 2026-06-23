import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

/**
 * User Entity
 * - Quản lý thông tin username và password của người dùng.
 * - Trường `password` LUÔN LƯU GIÁ TRỊ ĐÃ ĐƯỢC MÃ HÓA (hash bằng bcrypt),
 *   KHÔNG bao giờ lưu plain text.
 */
@Entity('users')
@Unique(['username'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  username: string;

  // Lưu password đã được hash (bcrypt) - không lưu plain text
  @Column({ type: 'varchar', length: 255 })
  password: string;

  @CreateDateColumn()
  createdAt: Date;
}
