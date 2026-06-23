import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as fs from 'fs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity';

@Module({
  imports: [
    // Cấu hình kết nối CSDL bằng TypeORM.
    // Lưu ý: ở môi trường thực tế (local/Codespaces) nên dùng driver
    // 'better-sqlite3' / 'postgres' / 'mysql' thay cho 'sqljs'.
    // Ở đây dùng 'sqljs' (SQLite chạy bằng WebAssembly, thuần JavaScript)
    // để tránh phụ thuộc build native, đồng thời vẫn lưu dữ liệu xuống file thật
    // mỗi khi có thay đổi (insert/update/delete) thông qua autoSaveCallback.
    TypeOrmModule.forRoot({
      type: 'sqljs',
      autoSave: true,
      location: 'database.sqlite',
      autoSaveCallback: (database: Uint8Array) => {
        fs.writeFileSync('database.sqlite', Buffer.from(database));
      },
      entities: [User],
      synchronize: true, // tự tạo bảng theo Entity - chỉ nên dùng cho dev/demo
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
