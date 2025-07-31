import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class PostsService {
  constructor(private readonly prismaService: PrismaService) {}
  getPosts() {
    return this.prismaService.post.findMany({})
  }

  createPost(body: { title: string; content: string }) {
    const userID: number = 1
    return this.prismaService.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: userID,
      },
    })
  }

  getPost(id: string) {
    return {
      id,
      title: 'news',
    }
  }

  updatePost(id: string, body: any) {
    return `Update PUT ${id}`
  }

  deletePost(id: string) {
    return `Delete PUT ${id}`
  }
}
