# Auth Integration Guide

This document describes the clean, type-safe authentication implementation for Agromart frontend.

## Architecture Overview

### 1. **API Layer** (`/src/api/`)
- **`types.ts`** - Type definitions for all API requests/responses
- **`client.ts`** - Axios instance with request/response interceptors
  - Automatically adds auth tokens to requests
  - Handles token refresh on 401 errors
  - Formats error responses consistently
- **`auth.ts`** - Auth API endpoints wrapper

### 2. **Service Layer** (`/src/services/`)
- **`auth.ts`** - Business logic for auth operations
  - Handles API calls and token management
  - Stores user data in localStorage
  - Clean, testable functions

### 3. **State Management** (`/src/context/`)
- **`AuthContext.tsx`** - Global auth state & hooks
  - User state
  - Loading & error states
  - All auth actions (login, register, verify, etc.)
  - Auto-logout on 401

### 4. **Validation** (`/src/validations/`)
- **`auth.ts`** - Yup validation schemas
  - Password strength validation (8+ chars, uppercase, lowercase, number, special)
  - Email validation
  - OTP validation (6 digits)
  - Real-time field validation

### 5. **Utilities**
- **`/src/utils/storage.ts`** - Token storage management
- **`/src/hooks/useAuthForm.ts`** - Form state + Yup validation hook

## How to Use

### Basic Login Example

```tsx
import { useAuth } from "@/context/AuthContext"
import { useAuthForm } from "@/hooks/useAuthForm"
import { loginSchema } from "@/validations/auth"

function LoginPage() {
  const { login, isLoading, error } = useAuth()
  const form = useAuthForm({ email: "", password: "" }, loginSchema)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!await form.validateForm()) return

    try {
      await login(form.values.email, form.values.password)
      // Navigate to dashboard
    } catch (err) {
      // Error handled by useAuth hook
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={form.values.email}
        onChange={(e) => form.setValue("email", e.target.value)}
        onBlur={() => form.setTouched("email", true)}
      />
      {form.touched.email && form.errors.email && (
        <span>{form.errors.email}</span>
      )}
      <button disabled={isLoading}>{isLoading ? "Logging in..." : "Login"}</button>
      {error && <div>{error}</div>}
    </form>
  )
}
```

### Access Current User

```tsx
function Dashboard() {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) return <Redirect to="/login" />

  return <div>Welcome, {user?.first_name}!</div>
}
```

### Protected Routes

```tsx
import { useAuth } from "@/context/AuthContext"

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return <LoadingSpinner />
  if (!isAuthenticated) return <Redirect to="/login" />

  return children
}
```

## API Endpoints Implemented

| Method | Endpoint | Status |
|--------|----------|--------|
| POST | `/auth/register` | ✅ Implemented |
| POST | `/auth/verify-email` | ✅ Implemented |
| POST | `/auth/resend-verification` | ✅ Implemented |
| POST | `/auth/login` | ✅ Implemented |
| POST | `/auth/forgot-password` | ✅ Implemented |
| POST | `/auth/reset-password` | ✅ Implemented |
| POST | `/auth/refresh` | ✅ Auto-handled |
| POST | `/auth/complete-invite` | ✅ Implemented |
| GET | `/auth/me` | ✅ Implemented |

## Current Implementation Details

### Pages Updated
- ✅ **Login** - Email/password with error handling
- ✅ **Register** - Full form with password strength checker
- ✅ **Verify Email** - 6-digit OTP verification with resend
- ✅ **Forgot Password** - 2-step: request code, then reset

### Features
- ✅ Type-safe with TypeScript
- ✅ Yup validation with custom rules
- ✅ Token refresh on 401
- ✅ Auto-logout on unauthorized
- ✅ User data caching
- ✅ Error handling & user feedback
- ✅ Loading states
- ✅ Password strength indication

## Best Practices & UX Improvements

### 🎯 Immediate Improvements (Ready to Implement)

#### 1. **Email Verification Flow**
```
Current: User sees generic "Email verified" message
Better: 
- Show success animation
- Auto-redirect after 2s with countdown
- Capture user's name after verification
- Option to complete profile immediately
```

#### 2. **Password Reset UX**
```
Current: Two separate steps
Better:
- Show which email we're resetting for
- Let user change email if needed
- Show password strength as they type
- Suggest stronger password if needed
- Success message with auto-login option
```

#### 3. **Error Messages**
```
Current: Generic backend error messages
Better:
- Friendly, actionable messages
- "Email already registered? Try logging in"
- "Password too weak? Try: Caps + Numbers + Symbols"
- Contact support option for repeated failures
```

#### 4. **Loading States**
```
Current: Button shows "Loading..."
Better:
- Disable form while submitting
- Show spinner animation
- Disable page transitions
- Show progress for slow connections
```

#### 5. **Form Validation**
```
Current: Validates on blur
Better:
- Real-time validation feedback
- Green checkmark for valid fields
- Password strength meter with tips
- Clear field labels with requirements
- Helper text for complex fields
```

### 💡 Suggested Enhancements

#### 1. **Social Login Integration**
```typescript
// Add to auth context
async socialLogin(provider: 'google' | 'facebook' | 'apple') {
  // Integrate OAuth flow
  // Map social profile to user object
  // Store tokens
}
```

#### 2. **Remember Me**
```typescript
// In login form
const [rememberMe, setRememberMe] = useState(false)

// After successful login
if (rememberMe) {
  localStorage.setItem('remembered_email', email)
}

// Pre-fill email on login page
const savedEmail = localStorage.getItem('remembered_email')
```

#### 3. **Session Timeout**
```typescript
// Add to AuthContext
useEffect(() => {
  let timeout: NodeJS.Timeout
  
  const resetTimeout = () => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      logout() // Auto-logout after 30 mins of inactivity
    }, 30 * 60 * 1000)
  }

  window.addEventListener('mousemove', resetTimeout)
  window.addEventListener('keydown', resetTimeout)

  return () => {
    clearTimeout(timeout)
    window.removeEventListener('mousemove', resetTimeout)
    window.removeEventListener('keydown', resetTimeout)
  }
}, [logout])
```

#### 4. **Biometric Authentication**
```typescript
// For mobile apps / secure devices
async biometricLogin() {
  // Use WebAuthn or device-specific APIs
  // Fallback to regular login if not available
}
```

#### 5. **Rate Limiting Feedback**
```typescript
// Show user they're trying too frequently
if (error.includes('too many attempts')) {
  setError('Too many login attempts. Try again in 5 minutes.')
  setRetryAfter(300) // seconds
}
```

#### 6. **Account Security**
```typescript
// Add after login
- Show login location and device
- Option to logout other sessions
- Recent activity log
- Security alerts for unusual activity
```

#### 7. **Progressive Profile Completion**
```typescript
// After email verification
async completeProfile(data: {
  phone: string
  avatar?: File
  address?: string
}) {
  // Let users complete profile later
  // Not required during signup
}
```

#### 8. **Email Verification Reminders**
```typescript
// If user closes without verifying
useEffect(() => {
  if (!user?.is_email_verified) {
    // Show banner after 5 minutes
    // Resend OTP option every 30 seconds
    // Show countdown timer
  }
}, [user])
```

### 🚀 Advanced Features for Later

#### 1. **Two-Factor Authentication (2FA)**
```typescript
// SMS-based 2FA
async login2FA(email: string, password: string) {
  const response = await apiClient.post('/auth/login', { email, password })
  if (response.requires2FA) {
    // Redirect to 2FA verification
    // Send SMS with code
  }
}
```

#### 2. **OAuth/SSO Integration**
- Google Sign-In
- Microsoft/LinkedIn for B2B
- Industry-specific providers

#### 3. **Passwordless Authentication**
- Magic link via email
- Passkeys (WebAuthn)
- Biometrics

#### 4. **Account Linking**
```typescript
// Allow users to link multiple providers
async linkAccount(provider: string, credentials: any) {
  // Link new provider to existing account
}
```

## Testing

### Unit Tests
```typescript
// Example: Test login validation
describe('Login Validation', () => {
  test('should reject invalid email', async () => {
    const schema = loginSchema
    expect(() => schema.validateSync({ email: 'invalid', password: '123' }))
      .toThrow()
  })
})
```

### Integration Tests
```typescript
// Example: Test full login flow
describe('Login Flow', () => {
  test('should login user and store tokens', async () => {
    const { result } = renderHook(() => useAuth(), { 
      wrapper: AuthProvider 
    })
    
    await act(async () => {
      await result.current.login('test@example.com', 'password')
    })
    
    expect(result.current.user).toBeDefined()
  })
})
```

## Security Considerations

- ✅ Tokens stored in localStorage (consider httpOnly cookies for extra security)
- ✅ Token refresh on 401
- ✅ Password validation on frontend (server validates too)
- ✅ CORS configured
- ✅ HTTPS enforced

### Recommendations:
1. Implement CSRF tokens if needed
2. Add request signing for sensitive operations
3. Use httpOnly + Secure cookies for tokens (requires backend changes)
4. Implement rate limiting
5. Add request timeout handling
6. Monitor suspicious login attempts

## Troubleshooting

### "Token undefined"
- Check localStorage for `access_token`
- Verify AuthProvider wraps your app
- Check API_BASE_URL in `.env`

### "CORS error"
- Verify backend is running
- Check `Access-Control-Allow-Origin` header
- Ensure credentials are included in requests

### "Validation errors not showing"
- Ensure `form.setTouched('field', true)` is called
- Check if errors exist: `console.log(form.errors)`
- Verify schema is passed to `useAuthForm`

## Environment Variables

```bash
# Required
VITE_API_BASE_URL=https://api-agromart.thebuidl.xyz

# Optional (for future features)
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_ENABLE_2FA=false
VITE_SESSION_TIMEOUT_MINUTES=30
```

## File Structure Summary

```
src/
├── api/
│   ├── types.ts          # Type definitions
│   ├── client.ts         # Axios instance
│   └── auth.ts           # API endpoints
├── services/
│   └── auth.ts           # Business logic
├── context/
│   └── AuthContext.tsx   # Global state
├── validations/
│   └── auth.ts           # Yup schemas
├── hooks/
│   └── useAuthForm.ts    # Form hook
├── utils/
│   └── storage.ts        # Token storage
└── routes/
    ├── __root.tsx        # App wrapper (with AuthProvider)
    ├── login.tsx         # ✅ Login page
    ├── create-account.tsx # ✅ Register page
    ├── verify-phone.tsx  # ✅ Email verification
    └── forgot-password.tsx # ✅ Password reset
```

## Next Steps

1. **Test the implementation**
   - Try signup → verify email → login flow
   - Test password reset
   - Test form validation

2. **Implement suggested improvements**
   - Better UX for verification
   - Loading states with animations
   - Friendly error messages

3. **Add protected routes**
   - Create ProtectedRoute component
   - Wrap dashboard/admin routes
   - Handle token refresh on route change

4. **Monitor in production**
   - Log auth errors
   - Track failed login attempts
   - Monitor token refresh failures

## Support

For questions or issues:
1. Check the TypeScript error messages
2. Review validation schemas in `src/validations/auth.ts`
3. Check API response in browser DevTools Network tab
4. Verify environment variables in `.env`
5. Test with Postman: `POST https://api-agromart.thebuidl.xyz/auth/login`
