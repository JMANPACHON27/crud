
// Import SetMetadata để tạo custom decorator trong NestJS
import { SetMetadata } from '@nestjs/common'
// Import các kiểu dữ liệu liên quan đến xác thực
import { AuthTypeType, ConditionGuardType } from 'src/shared/constants/auth.constant'


// Khóa metadata dùng để lưu thông tin loại xác thực
export const AUTH_TYPE_KEY = 'authType'

// Định nghĩa kiểu dữ liệu cho payload của decorator Auth
export type AuthTypeDecoratorPayload = {
  authType: AuthTypeType[]; // Danh sách các loại xác thực áp dụng
  options: {
    condition: ConditionGuardType; // Điều kiện kiểm tra guard
  }
}

/**
 * Custom decorator cho phép gán metadata về loại xác thực và điều kiện guard cho route handler
 * @param authType Danh sách các loại xác thực áp dụng
 * @param options Tuỳ chọn, bao gồm điều kiện guard
 * @returns Decorator function sử dụng SetMetadata
 */
export const Auth = (
  authType: AuthTypeType[],
  options: { condition: ConditionGuardType }
) => {
  return SetMetadata(AUTH_TYPE_KEY, { authType, options })
}
