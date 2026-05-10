# Zustand Migration Guide

Auth state management has been migrated from React Context to **Zustand** for better performance and simpler code.

## ✅ What Changed

### Before (React Context)
```typescript
import { useAuth } from "@/context/AuthContext"
import { AuthProvider } from "@/context/AuthContext"

// In root layout
<AuthProvider>
  <App />
</AuthProvider>

// In components
const { user, login } = useAuth()
```

### After (Zustand)
```typescript
import { useAuth } from "@/hooks/useAuth"

// No provider needed!

// In components - same API
const { user, login } = useAuth()
```

**No changes needed in your component code!** The API is identical.

---

## 🎯 Benefits

### Performance ✅
- **No context re-renders** - Only components using the specific state re-render
- **Smaller bundle** - Zustand is 2KB vs React Context
- **Faster updates** - Direct state mutations vs immutable updates
- **Better DevTools** - Built-in Redux DevTools integration

### Developer Experience ✅
- **Simpler syntax** - No providers, no useContext confusion
- **Easier testing** - Store can be reset/mocked easily
- **Better TypeScript** - Full type inference
- **Subscriptions** - Can subscribe to specific state slices

### Scalability ✅
- **Multiple stores** - Easy to add more Zustand stores
- **Middleware** - Built-in persist, immer, devtools
- **No provider hell** - No nested providers
- **Code splitting** - Stores can be lazy-loaded

---

## 📁 File Structure

### New Files
```
src/
├── store/
│   └── authStore.ts       # Zustand store with all auth logic
└── hooks/
    └── useAuth.ts         # Hook wrapping the store (same API)
```

### Removed Files
```
src/context/AuthContext.tsx  # ❌ No longer needed (kept for now)
```

### Updated Files
```
src/routes/
├── __root.tsx             # Removed AuthProvider
├── create-account.tsx     # Updated import
├── login.tsx              # Updated import
├── verify-phone.tsx       # Updated import
└── forgot-password.tsx    # Updated import
```

---

## 🔍 How It Works

### The Store (`src/store/authStore.ts`)
```typescript
export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // State
        user: null,
        isLoading: false,
        error: null,

        // Actions
        login: async (email, password) => {
          set({ isLoading: true })
          // ... API call
          set({ user, isLoading: false })
        },

        // ... more actions
      }),
      { name: "auth-store" } // Persists to localStorage
    ),
    { name: "AuthStore" } // DevTools integration
  )
)
```

### The Hook (`src/hooks/useAuth.ts`)
```typescript
export function useAuth() {
  const user = useAuthStore((state) => state.user)
  const login = useAuthStore((state) => state.login)
  
  return { user, login, ... }
}
```

### In Components
```typescript
const { user, login, isLoading, error } = useAuth()

// Or subscribe to specific state
const user = useAuthStore((state) => state.user)  // Only re-renders when user changes
```

---

## 🚀 Usage Examples

### Basic Login
```typescript
import { useAuth } from "@/hooks/useAuth"

function LoginPage() {
  const { login, isLoading, error } = useAuth()

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password)
      navigate("/dashboard")
    } catch (err) {
      // Error already in store
    }
  }

  return (
    <>
      {error && <Alert>{error}</Alert>}
      <button onClick={() => handleLogin(...)} disabled={isLoading}>
        {isLoading ? "Loading..." : "Login"}
      </button>
    </>
  )
}
```

### Accessing User
```typescript
import { useAuth } from "@/hooks/useAuth"

function Dashboard() {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) return <Redirect to="/login" />

  return <div>Welcome, {user?.first_name}!</div>
}
```

### Performance-Optimized
```typescript
import { useAuthStore } from "@/store/authStore"

// Only re-render when user changes, not on every auth state update
function UserCard() {
  const user = useAuthStore((state) => state.user)
  return <div>{user?.email}</div>
}

// Only re-render when loading changes
function LoadingIndicator() {
  const isLoading = useAuthStore((state) => state.isLoading)
  return isLoading ? <Spinner /> : null
}
```

---

## 🔄 Persistence

The store automatically persists to localStorage:

```typescript
persist(
  (set, get) => ({ ... }),
  {
    name: "auth-store",
    partialize: (state) => ({
      user: state.user,
      isAuthenticated: state.isAuthenticated,
    })
  }
)
```

**What's saved:**
- ✅ User data
- ✅ Authentication status
- ❌ Loading state (transient)
- ❌ Error messages (transient)

When app loads, user data is automatically restored!

---

## 🛠️ Advanced: Selector Hooks

For even better performance, use pre-built selectors:

```typescript
import { useAuthUser, useAuthLoading, useIsAuthenticated } from "@/store/authStore"

// In components
const user = useAuthUser()              // Only re-render when user changes
const isLoading = useAuthLoading()      // Only re-render when loading changes
const isAuth = useIsAuthenticated()     // Only re-render when auth status changes
```

---

## 🧪 Testing

Zustand stores are easier to test:

```typescript
import { useAuthStore } from "@/store/authStore"

beforeEach(() => {
  // Reset store state
  useAuthStore.setState({ user: null, error: null })
})

test("should login user", async () => {
  await useAuthStore.getState().login("test@example.com", "password")
  expect(useAuthStore.getState().user).toBeDefined()
})
```

---

## 🔄 Comparing to React Context

| Feature | React Context | Zustand |
|---------|---------------|---------|
| **Bundle Size** | Included in React | 2KB |
| **Provider Required** | ✅ Yes | ❌ No |
| **Re-renders** | All consumers | Only subscribed |
| **DevTools** | External | Built-in |
| **Persistence** | Manual | Built-in |
| **TypeScript** | Good | Excellent |
| **Learning Curve** | Familiar | Very gentle |
| **Performance** | Decent | Great |

---

## 📊 Performance Comparison

### React Context
```
Component tree change → Provider updates → All consumers re-render
⚠️  Could cause unnecessary re-renders
```

### Zustand
```
Store state change → Only components using that state selector re-render
✅ Only affected components re-render
```

**Example:**
```typescript
// React Context - ALL components re-render when ANY state changes
<AuthContext.Provider value={{ user, loading, error }}>
  <App /> // Re-renders when loading changes, even if only using user
</AuthContext.Provider>

// Zustand - ONLY components using that selector re-render
const user = useAuthStore((state) => state.user) // Only re-renders when user changes
const loading = useAuthStore((state) => state.loading) // Separate subscription
```

---

## 🚫 Migration Checklist

- [x] Zustand store created (`src/store/authStore.ts`)
- [x] useAuth hook created (`src/hooks/useAuth.ts`)
- [x] AuthProvider removed from root layout
- [x] All route imports updated to use new hook
- [x] localStorage persistence enabled
- [x] DevTools integration enabled
- [ ] Test all auth flows
- [ ] Verify localStorage is persisting user data
- [ ] Check DevTools for store state (optional)

---

## 🆘 Troubleshooting

### "useAuth is not defined"
```typescript
// ❌ Wrong
import { useAuth } from "@/context/AuthContext"

// ✅ Correct
import { useAuth } from "@/hooks/useAuth"
```

### "Store not persisting"
1. Check localStorage in DevTools
2. Verify app loads and closes properly
3. Check browser allows localStorage
4. Hard refresh (Ctrl+Shift+R)

### "Components not re-rendering"
```typescript
// Make sure you're using the hook
const { user } = useAuth()  // ✅ Correct

// Not just getting store
const store = useAuthStore  // ❌ This won't trigger re-render
```

### "Need to clear store"
```typescript
// Reset store state
useAuthStore.setState({ user: null, error: null, isLoading: false })

// Or via logout
useAuthStore.getState().logout()
```

---

## 🎯 Next Steps

1. **Install Zustand** (if not already):
   ```bash
   pnpm add zustand
   ```

2. **Test the app**:
   ```bash
   pnpm dev
   # Try signup → verify → login
   ```

3. **Check DevTools**:
   - Open Redux DevTools (if installed)
   - Look for "AuthStore" tab
   - See state changes in real-time

4. **Verify localStorage**:
   - Open DevTools → Application → Local Storage
   - Should see `auth-store` key after login

---

## 📚 Resources

- **Zustand Docs:** https://zustand.docs.pmnd.rs/
- **Zustand GitHub:** https://github.com/pmndrs/zustand
- **Redux DevTools:** Browser extension for debugging
- **Zustand Middleware:** persist, devtools, immer, etc.

---

## 💡 Summary

| Aspect | Change |
|--------|--------|
| **Dependency** | React Context → Zustand |
| **API** | Identical (useAuth) |
| **Components** | No changes needed |
| **Performance** | ⬆️ Better (selective re-renders) |
| **Bundle Size** | ⬇️ Smaller (Zustand is 2KB) |
| **Persistence** | Automatic via middleware |
| **DevTools** | Built-in support |
| **Testing** | ⬆️ Easier |

**Result:** Same great auth system, but faster, simpler, and easier to maintain! 🚀
