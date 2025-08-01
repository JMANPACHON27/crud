
// Module gốc của ứng dụng, khai báo các module con, controller và provider
import { ClassSerializerInterceptor, Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PostsModule } from './routes/posts/posts.module'
import { SharedModule } from './shared/shared.module'
import { AuthModule } from './routes/auth/auth.module'
import { APP_INTERCEPTOR } from '@nestjs/core'

@Module({
  imports: [PostsModule, SharedModule, AuthModule], // Import các module con
  controllers: [AppController], // Khai báo controller gốc
  providers: [
    AppService, // Đăng ký AppService
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor, // Sử dụng interceptor để tự động serialize dữ liệu trả về
    },
  ],
})
export class AppModule {}
