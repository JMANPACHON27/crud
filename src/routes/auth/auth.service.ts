import { ConflictException, Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common'
import { LoginBodyDTO, RegisterBodyDTO } from 'src/routes/auth/auth.dto'
import { isNotFoundPrismaError, isUniqueConstrainPrismaError } from 'src/shared/helpers'
import { HashingService } from 'src/shared/services/hashing.service'
import { PrismaService } from 'src/shared/services/prisma.service'
import { TokenService } from 'src/shared/services/token.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly prismaServices: PrismaService,
    private readonly tokenService: TokenService,
  ) {}
  async register(body: RegisterBodyDTO) {
    try {
      const hashPassword = await this.hashingService.hash(body.password)
      const user = await this.prismaServices.user.create({
        data: {
          email: body.email,
          password: hashPassword,
          name: body.name,
        },
      })
      return user
    } catch (error) {
      if (isUniqueConstrainPrismaError(error)) {
        throw new ConflictException('Email already exists')
      }
      throw error
    }
  }

  async login(body: LoginBodyDTO) {
    const user = await this.prismaServices.user.findUnique({
      where: {
        email: body.email,
      },
    })

    if (!user) {
      throw new UnauthorizedException('Account is not exist')
    }

    const isPasswordMatch = await this.hashingService.compare(body.password, user.password)

    if (!isPasswordMatch) {
      throw new UnprocessableEntityException([
        {
          field: 'password',
          error: 'Password is incorrect',
        },
      ])
    }

    const tokens = await this.generateTokens({ userId: user.id })
    return tokens
  }

  async generateTokens(payload: { userId: number }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken(payload),
      this.tokenService.signRefreshToken(payload),
    ])

    const decodeRefreshToken = await this.tokenService.verifyRefreshToken(refreshToken)
    await this.prismaServices.refreshToken.create({
      data: {
        token: refreshToken,
        userId: payload.userId,
        expiresAt: new Date(decodeRefreshToken.exp * 1000),
      },
    })
    return { accessToken, refreshToken }
  }

  async refreshToken(refreshToken: string) {
    try {
      //1. Kiểm tra token có đúng không
      const { userId } = await this.tokenService.verifyRefreshToken(refreshToken)

      //2.Kiểm tra refresh token có hợp lệ không
      await this.prismaServices.refreshToken.findFirstOrThrow({
        where: {
          token: refreshToken,
        },
      })

      // 3. Xóa refreshToken ro ken cũ
      await this.prismaServices.refreshToken.delete({
        where: {
          token: refreshToken,
        },
      })

      //4. Tạo refreshToken mới
      return this.generateTokens({ userId })
    } catch (error) {
      // Trường hợp đã refreshToken hãy thông báo cho user biết
      // refreshToken của chọ đã bị đánh cắp
      if (isNotFoundPrismaError(error)) {
        throw new UnauthorizedException('Resfresh token has ben revoked')
      }

      throw new UnauthorizedException()
    }
  }
}
