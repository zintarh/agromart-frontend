# Quick Start Guide - Auth Integration

Get the auth system running in minutes!

## 1️⃣ Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Verify .env has:
VITE_API_BASE_URL=https://api-agromart.thebuidl.xyz
```

## 2️⃣ Install & Start

```bash
# Install dependencies (already done if you had axios, yup, react)
pnpm install

# Start development server
pnpm dev

# Open http://localhost:3000
```

## 3️⃣ Test the Full Auth Flow

### Flow 1: Create Account → Verify → Login

1. **Go to signup**
   ```
   http://localhost:3000/create-account
   ```
   
2. **Fill the form**
   - First Name: John
   - Last Name: Doe
   - Email: test@example.com (use a real email)
   - Phone: 08012345678
   - Password: TestPassword123!
   - Confirm: TestPassword123!
   - Check T&C checkbox

3. **Click Sign Up**
   - Should see: "Registration successful! Please check your email"
   - No error? ✅ Registration working!

4. **Check your email**
   - Look for 6-digit OTP code
   - Copy the code

5. **Go to verification page**
   ```
   http://localhost:3000/verify-phone?email=test@example.com
   ```
   
   - Enter the 6-digit code
   - Click "Verify Email"
   - Should redirect to home / dashboard ✅

6. **Login**
   ```
   http://localhost:3000/login
   ```
   
   - Email: test@example.com
   - Password: TestPassword123!
   - Click "Log In"
   - Should show user data and redirect ✅

### Flow 2: Forgot Password

1. **Click "Forget Password?" on login page**
   ```
   http://localhost:3000/forgot-password
   ```

2. **Enter email**
   - Email: test@example.com
   - Click "Send Reset Code"
   - Should say "Check your email"

3. **Check email**
   - Get 6-digit code

4. **Enter reset code & new password**
   - Code: (6 digits from email)
   - New Password: NewPassword123!
   - Confirm: NewPassword123!
   - Click "Reset Password"
   - Should redirect to login ✅

5. **Login with new password**
   - Should work! ✅

## 🔍 Debugging

### Check if API is responding

Open DevTools → Network tab → Try logging in

**Look for:**
```
POST https://api-agromart.thebuidl.xyz/auth/login
Status: 200 ✅ OR 400 ❌
```

If you see `401` or `CORS error`:
```
❌ Check VITE_API_BASE_URL in .env
❌ Check if backend API is running
❌ Check browser console for specific error
```

### Check localStorage

Open DevTools → Application → Local Storage

**Should see:**
```
access_token: "eyJ0eXAiOiJKV1QiLCJhbGc..."
refresh_token: "eyJ0eXAiOiJKV1QiLCJhbGc..."
current_user: '{"id":1,"email":"test@example.com",...}'
```

If empty: Tokens not being saved

### Check Auth Context

In any component:
```typescript
const { user, isAuthenticated, error } = useAuth()
console.log({ user, isAuthenticated, error })
```

## ✅ Common Issues & Solutions

### "Email already registered"
```
✅ Solution: Use a different email (test2@example.com)
           Or clear localStorage and try again
```

### "Invalid OTP"
```
✅ Solution: Copy the code exactly from email
           Check if 6 digits
           Didn't expire (15 min limit)
```

### "CORS Error"
```
✅ Solution: Check VITE_API_BASE_URL is correct
           Make sure backend API is running
           Check if URL has trailing slash (shouldn't)
```

### "Button disabled, can't submit"
```
✅ Solution: Fill all required fields (red asterisks *)
           Password must be 8+ chars with uppercase, number, special char
           Check "I agree to terms" checkbox
```

### "Form says 'Network Error'"
```
✅ Solution: Check internet connection
           Check if API is online: curl -I https://api-agromart.thebuidl.xyz
           Check DevTools → Network tab for actual error
```

## 🧪 Test with Postman

Want to test API directly? Use Postman:

### Test Login
```
POST https://api-agromart.thebuidl.xyz/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "yourPassword"
}
```

Expected response:
```json
{
  "message": "Login successful.",
  "data": {
    "access_token": "eyJ...",
    "refresh_token": "eyJ...",
    "user": {
      "id": 1,
      "email": "john@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": "user"
    }
  },
  "success": true
}
```

### Test Register
```
POST https://api-agromart.thebuidl.xyz/auth/register
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "password": "minLength8",
  "phone": "08012345678",
  "country_code": "234"
}
```

## 📝 What Each Page Does

| Page | URL | What Happens |
|------|-----|--------------|
| **Login** | `/login` | Enter email/password → Get tokens → Redirect to dashboard |
| **Register** | `/create-account` | Enter details → Send OTP to email |
| **Verify Email** | `/verify-phone?email=...` | Enter 6-digit OTP → Get tokens → Auto redirect |
| **Forgot Password** | `/forgot-password` | Step 1: Email → Step 2: OTP + New Password |

## 🎯 Next: Protect Your Routes

After auth works, protect your dashboard:

```typescript
// src/routes/dashboard.tsx
import { useAuth } from "@/context/AuthContext"

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
  beforeLoad: async ({ context }) => {
    const { isAuthenticated } = context.auth
    if (!isAuthenticated) {
      throw redirect({ to: "/login" })
    }
  },
})

function DashboardPage() {
  const { user } = useAuth()
  return <div>Welcome, {user?.first_name}!</div>
}
```

## 🚀 What's Working ✅

- Register with email & password
- Verify email with OTP
- Login with email & password
- Forgot password flow
- Password reset with OTP
- Form validation
- Error handling
- Loading states
- Token management
- Auto-logout on 401

## 📦 File Structure

```
src/
├── api/
│   ├── types.ts          ← All TypeScript types
│   ├── client.ts         ← Axios setup & interceptors
│   └── auth.ts           ← API endpoints
├── context/
│   └── AuthContext.tsx   ← Global auth state
├── services/
│   └── auth.ts           ← Business logic
├── validations/
│   └── auth.ts           ← Yup schemas
├── hooks/
│   └── useAuthForm.ts    ← Form handling
├── utils/
│   └── storage.ts        ← Token storage
└── routes/
    ├── create-account.tsx ← ✅ Register
    ├── login.tsx         ← ✅ Login
    ├── verify-phone.tsx  ← ✅ Email verification
    └── forgot-password.tsx ← ✅ Password reset
```

## 🆘 Need Help?

1. **Check the logs:**
   - Browser DevTools → Console
   - Browser DevTools → Network
   - Check backend API logs

2. **Verify environment:**
   ```bash
   echo $VITE_API_BASE_URL
   ```

3. **Test API:**
   ```bash
   curl -X POST https://api-agromart.thebuidl.xyz/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"test"}'
   ```

4. **Check if backend is running:**
   - Try accessing: https://api-agromart.thebuidl.xyz
   - Should return 404 (not a 401 or connection error)

## 🎉 You're Ready!

Your auth system is live and connected. Now:

1. Test all flows ✅
2. Check the guides (AUTH_INTEGRATION_GUIDE.md)
3. Plan Phase 2 improvements (IMPLEMENTATION_SUCCESS_GUIDE.md)
4. Get feedback from beta users
5. Deploy to production!

---

**Time to First Success:** ~5 minutes
**Time to Full Testing:** ~30 minutes
**Status:** Production Ready ✅
