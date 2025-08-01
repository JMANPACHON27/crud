
// Đánh dấu class này là Injectable để có thể inject vào các nơi khác
import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  // Hàm trả về chuỗi Hello World kèm ngày hiện tại
  getHello(): string {
    console.log(process.env.DATABASE_URL)
    const now = new Date()
    return 'Hello World! ' + now.toDateString()
  }
}
