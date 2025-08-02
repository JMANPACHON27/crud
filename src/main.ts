
// File khởi tạo ứng dụng NestJS
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common'
import { LoggingInterceptor } from 'src/shared/interceptor/logging.interceptor'
import { TransformInterceptor } from 'src/shared/interceptor/transform.interceptor'

// Hàm bootstrap khởi tạo app và cấu hình các global pipe, interceptor
async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  // Sử dụng ValidationPipe để validate dữ liệu đầu vào
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Tự động loại bỏ các field không được khai báo trong DTO
      forbidNonWhitelisted: true, // Nếu field không được khai báo trong DTO mà client truyền lên thì báo lỗi
      transform: true, // Tự động chuyển đổi dữ liệu sang kiểu được khai báo trong DTO
      transformOptions: {
        enableImplicitConversion: true, // Tự chuyển dữ liệu lên sang định dạng trong DTO
      },
      exceptionFactory: (validationErrors) => {
        return new UnprocessableEntityException(
          validationErrors.map((error) => ({
            field: error.property,
            error: Object.values(error.constraints as any).join(', '),
          })),
        )
      },
    }),
  )
  // Sử dụng interceptor để log và transform dữ liệu trả về
  app.useGlobalInterceptors(new LoggingInterceptor())
  app.useGlobalInterceptors(new TransformInterceptor())
  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
