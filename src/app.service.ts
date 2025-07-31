import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getHello(): string {
    console.log(process.env.DATABASE_URL)
    const now = new Date()
    return 'Hello World! ' + now.toDateString()
  }
}
