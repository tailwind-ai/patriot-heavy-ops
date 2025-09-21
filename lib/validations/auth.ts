import * as z from "zod"

// Common words and patterns to reject
const COMMON_WORDS = [
  'password', 'admin', 'user', 'login', 'welcome', 'qwerty', 'abc123',
  'letmein', 'iloveyou', 'monkey', 'dragon', 'princess', 'football',
  '123456', '111111', 'sunshine', 'master', 'shadow', 'michael',
  'jennifer', 'joshua', 'hunter', 'basketball', 'jordan', 'tigger',
  'superman', 'harley', 'ranger', 'buster'
]

const KEYBOARD_PATTERNS = [
  'qwerty', 'asdf', 'zxcv', '654321', 'abcdef', 'fedcba'
]

export const userAuthSchema = z.object({
  email: z.string().email(),
})

export const userRegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email(),
  password: z.string()
    .min(12, "Password must be at least 12 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter") 
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[!@#$%\^&*()_+=\[\]{}|;:,.<>?-]/, "Password must contain at least one special character")
    .refine((password) => {
      const lowerPassword = password.toLowerCase()
      return !COMMON_WORDS.some(word => lowerPassword.includes(word))
    }, "Password cannot contain common words")
    .refine((password) => {
      const lowerPassword = password.toLowerCase()
      return !KEYBOARD_PATTERNS.some(pattern => lowerPassword.includes(pattern))
    }, "Password cannot contain keyboard patterns")
    .refine((password) => !/(.)\1{2,}/.test(password), "Password cannot have 3+ repeated characters in a row"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
})
