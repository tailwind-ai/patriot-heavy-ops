export const extractBearerToken = jest.fn()
export const verifyToken = jest.fn()
export const generateAccessToken = jest.fn()
export const generateRefreshToken = jest.fn()
export const hashPassword = jest.fn()
export const verifyPassword = jest.fn()
export const isTokenExpired = jest.fn()

export const JWT_CONFIG = {
  ACCESS_TOKEN_EXPIRY: "15m",
  REFRESH_TOKEN_EXPIRY: "7d",
  ISSUER: "patriot-heavy-ops",
  AUDIENCE: "mobile-app",
  EXPIRATION_BUFFER_SECONDS: 30,
}
