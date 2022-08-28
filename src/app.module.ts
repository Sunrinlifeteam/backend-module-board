import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database.module';
import { NoticeModule } from './notice/notice.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env`],
    }),
    NoticeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
