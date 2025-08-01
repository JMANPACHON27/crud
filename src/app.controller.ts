
// Import các decorator và service cần thiết từ NestJS
import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'


// Controller gốc của ứng dụng
@Controller()
export class AppController {
  // Inject AppService để sử dụng các logic nghiệp vụ
  constructor(private readonly appService: AppService) {}

  // Định nghĩa route GET / trả về chuỗi Hello World!
  @Get()
  getHello(): string {
    return this.appService.getHello()
  }
}
