export interface TokenPayload {
  userId: number
  exp: number
  iat: number
}

export interface RefreshTokenPayload {
  userId: number
  exp: number
  iat: number
  jti: string // JWT ID for refresh token
}