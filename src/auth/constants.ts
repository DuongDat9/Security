export const jwtConstants = {
  // Trong thực tế PHẢI lấy secret từ biến môi trường (.env), KHÔNG hardcode trong source code.
  secret:
    process.env.JWT_SECRET ||
    'CHANGE_THIS_SECRET_IN_PRODUCTION_AND_KEEP_IT_OUT_OF_SOURCE_CONTROL',
  expiresIn: process.env.JWT_EXPIRES_IN || '3600s',
};
