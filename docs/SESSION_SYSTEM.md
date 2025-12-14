# Session System - Komplet Guide

## 📋 Oversigt

Vores session system består af to lag:
1. **Server-side session** (iron-session) - Sikker session lagring i cookies
2. **Client-side context** (React Context) - Global tilgang til session data i frontend

---

## 🏗️ Arkitektur

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT-SIDE (Browser)                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         SessionProvider (React Context)              │   │
│  │  - Holder session state                              │   │
│  │  - Fetcher fra /api/auth/session                     │   │
│  │  - Opdaterer automatisk ved events                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                        │                                     │
│                        ▼                                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              useSession() Hook                        │   │
│  │  - Tilgængelig i alle komponenter                    │   │
│  │  - Returnerer: user, isLoggedIn, isLoading, refetch  │   │
│  └─────────────────────────────────────────────────────┘   │
│                        │                                     │
│                        ▼                                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              useAuth() Hook                          │   │
│  │  - login() - Logger ind                              │   │
│  │  - logout() - Logger ud                              │   │
│  │  - Opdaterer session automatisk                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │ HTTP Requests
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                  SERVER-SIDE (Next.js)                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  /api/auth/session (GET)                             │   │
│  │  - Læser server-side session                         │   │
│  │  - Verificerer bruger hver 5. minut                  │   │
│  │  - Returnerer: { isLoggedIn, user }                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  /api/auth/login (POST)                              │   │
│  │  - Validerer credentials                              │   │
│  │  - Opretter server-side session                      │   │
│  │  - Gemmer i cookie                                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  /api/auth/logout (POST)                             │   │
│  │  - Destroyer server-side session                     │   │
│  │  - Sletter cookie                                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  getSession() (lib/session/session.ts)               │   │
│  │  - Henter iron-session fra cookies                   │   │
│  │  - Krypteret og sikker                                │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Flow Diagram

### Login Flow
```
1. Bruger indtaster email/password
   ↓
2. useAuth().login() kalder /api/auth/login
   ↓
3. Server validerer credentials
   ↓
4. Server opretter session med getSession()
   ↓
5. Session gemmes i krypteret cookie
   ↓
6. useAuth() kalder refetch() fra useSession()
   ↓
7. SessionContext fetcher fra /api/auth/session
   ↓
8. Alle komponenter der bruger useSession() opdateres automatisk
```

### Logout Flow
```
1. Bruger klikker "Logout"
   ↓
2. useAuth().logout() kalder /api/auth/logout
   ↓
3. Server destroyer session med session.destroy()
   ↓
4. Cookie slettes
   ↓
5. Bruger redirectes til /login
   ↓
6. Når /login loader → SessionContext fetcher automatisk session (ved mount)
   ↓
7. SessionContext opdateres til { isLoggedIn: false, user: null }
```

### Auto-Update Flow
```
1. Bruger logger ind i Tab 2
   ↓
2. Bruger skifter til Tab 1 (focus event)
   ↓
3. SessionContext lytter til 'focus' event
   ↓
4. Automatisk refetch() kaldt
   ↓
5. Session opdateres i Tab 1
```

---

## 📁 Filer og Deres Rolle

### 1. `lib/session/session.ts` - Server-side Session
**Rolle:** Konfigurerer og håndterer server-side session med iron-session

```typescript
// Hvad den gør:
- Konfigurerer session options (cookie navn, security)
- Eksporterer getSession() funktion
- Definerer SessionData interface
- Håndterer krypteret cookie storage
```

**Brug:**
```typescript
// I Server Components eller API routes
import { getSession } from "@/lib/session/session";

const session = await getSession();
if (session.user) {
  // Bruger er logget ind
  const userId = session.user.id;
}
```

---

### 2. `contexts/SessionContext.tsx` - Client-side Context
**Rolle:** Global state management for session i frontend

**Hvad den gør:**
- Holder session state (user, isLoggedIn, isLoading)
- Fetcher session fra `/api/auth/session`
- Opdaterer automatisk ved:
  - Initial mount
  - Window focus (tab switch)
  - Custom 'session-change' events
- Eksporterer `useSession()` hook

**State:**
```typescript
{
  isLoggedIn: boolean;
  user: UserWithCompany | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}
```

---

### 3. `useSession()` Hook
**Rolle:** Hook eksporteret direkte fra SessionContext

**Brug:**
```typescript
import { useSession } from "@/contexts/SessionContext";

function MyComponent() {
  const { user, isLoggedIn, isLoading, refetch } = useSession();
  
  if (isLoading) return <div>Loading...</div>;
  if (!isLoggedIn) return <div>Not logged in</div>;
  
  return <div>Hello {user?.firstName}</div>;
}
```

---

### 4. `hooks/useAuth.ts` - Authentication Hook
**Rolle:** Håndterer login/logout

**Funktioner:**
- `login(data)` - Logger ind og opdaterer session automatisk
- `logout()` - Logger ud og redirecter (session opdateres automatisk når /login loader)
- `isLoading` - Loading state

**Brug:**
```typescript
import { useAuth } from "@/hooks/useAuth";

function LoginForm() {
  const { login, isLoading } = useAuth();
  
  const handleSubmit = async (data) => {
    await login(data);
    // Session er automatisk opdateret!
  };
}
```

**Logout detaljer:**
- Ved logout redirecter vi til `/login`
- SessionContext fetcher automatisk session når `/login` loader (ved mount)
- Dette forhindrer "flash" af tom session data på dashboard siden

---

### 5. `app/api/auth/session/route.ts` - Session API
**Rolle:** Endpoint der returnerer nuværende session status

**Hvad den gør:**
- Læser server-side session
- Verificerer bruger eksisterer (hver 5. minut)
- Returnerer `{ isLoggedIn, user }`

**Response:**
```json
{
  "isLoggedIn": true,
  "user": {
    "id": "...",
    "firstName": "John",
    "email": "john@example.com",
    "role": "ADMIN",
    "companyId": "...",
    "company": { ... }
  }
}
```

---

### 6. `app/api/auth/login/route.ts` - Login API
**Rolle:** Håndterer login og opretter session

**Flow:**
1. Validerer email/password
2. Tjekker bruger eksisterer
3. Verificerer password
4. Opretter session med `getSession()`
5. Gemmer session i cookie
6. Returnerer user data

---

### 7. `app/api/auth/logout/route.ts` - Logout API
**Rolle:** Håndterer logout og destroyer session

**Flow:**
1. Henter session
2. Kalder `session.destroy()`
3. Sletter cookie
4. Returnerer success

---

## 💻 Hvordan Man Bruger Det

### Setup (Allerede gjort)
SessionProvider er allerede sat op i `app/layout.tsx`:
```tsx
<SessionProvider>
  {children}
</SessionProvider>
```

### 1. Få Session Data i Komponenter

```tsx
"use client";

import { useSession } from "@/contexts/SessionContext";

export function MyComponent() {
  const { user, isLoggedIn, isLoading } = useSession();
  
  if (isLoading) return <div>Loading...</div>;
  if (!isLoggedIn) return <div>Please log in</div>;
  
  return (
    <div>
      <h1>Welcome, {user?.firstName}!</h1>
      <p>Role: {user?.role}</p>
      <p>Company: {user?.company?.name}</p>
    </div>
  );
}
```

### 2. Login/Logout

```tsx
"use client";

import { useAuth } from "@/hooks/useAuth";

export function LoginButton() {
  const { login, logout, isLoading } = useAuth();
  
  const handleLogin = async () => {
    await login({
      email: "user@example.com",
      password: "password123"
    });
    // Session opdateres automatisk!
  };
  
  const handleLogout = async () => {
    await logout();
    // Session opdateres automatisk!
  };
  
  return (
    <div>
      <button onClick={handleLogin} disabled={isLoading}>
        Login
      </button>
      <button onClick={handleLogout} disabled={isLoading}>
        Logout
      </button>
    </div>
  );
}
```

### 3. Manuelt Opdatere Session

```tsx
import { useSession } from "@/contexts/SessionContext";

export function UpdateProfileButton() {
  const { refetch } = useSession();
  
  const handleUpdate = async () => {
    // Opdater profil i database
    await fetch("/api/user/profile", {
      method: "PATCH",
      body: JSON.stringify({ firstName: "New Name" })
    });
    
    // Opdater session manuelt
    await refetch();
    
    // Eller dispatch event (virker også)
    window.dispatchEvent(new Event("session-change"));
  };
  
  return <button onClick={handleUpdate}>Update Profile</button>;
}
```

### 4. Protected Routes (Server Components)

```tsx
import { getSession } from "@/lib/session/session";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const session = await getSession();
  
  if (!session.user) {
    redirect("/login");
  }
  
  return <div>Protected content for {session.user.firstName}</div>;
}
```

### 5. Protected Routes (Client Components)

**Note:** Vi bruger primært Server Components til protected routes, da de er hurtigere og bedre for SEO. Hvis du har brug for en Client Component, kan du bruge `useSession()` direkte:

```tsx
"use client";

import { useSession } from "@/contexts/SessionContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedPage() {
  const { isLoggedIn, isLoading, user } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push("/login");
    }
  }, [isLoading, isLoggedIn, router]);
  
  if (isLoading) return <div>Loading...</div>;
  if (!isLoggedIn) return null; // Will redirect
  
  return <div>Protected content for {user?.firstName}</div>;
}
```

### 6. Check User Role

```tsx
import { useSession } from "@/contexts/SessionContext";
import { Role } from "@/generated/prisma/enums";

export function AdminOnlyButton() {
  const { user } = useSession();
  
  if (user?.role !== Role.ADMIN) {
    return null;
  }
  
  return <button>Admin Only Action</button>;
}
```

---

## 🔄 Automatiske Opdateringer

Session opdateres automatisk i disse situationer:

1. **Ved mount** - Når appen loader første gang (SessionContext fetcher automatisk)
2. **Efter login** - Når `useAuth().login()` kalder `refetch()`
3. **Efter logout** - Når brugeren redirecter til `/login`, fetcher SessionContext automatisk session (ved mount)
4. **Ved tab switch** - Når brugeren skifter tilbage til tabben (focus event) - kun hvis logget ind
5. **Ved custom events** - Når `session-change` event dispatches

---

## 🛡️ Sikkerhed

### Server-side
- Session gemmes i **krypteret cookie** (iron-session)
- Cookie er **httpOnly** (ikke tilgængelig fra JavaScript)
- Cookie er **secure** i production (kun HTTPS)
- Session verificeres hver 5. minut mod database

### Client-side
- Session data er **read-only** i frontend
- Ingen sensitive data (fx passwords) sendes til client
- Session opdateres automatisk ved ændringer

---

## 🐛 Troubleshooting

### Session opdateres ikke efter login
- Tjek at `useAuth()` kalder `refetch()` efter login
- Tjek browser console for errors
- Tjek at SessionProvider er wrapper i layout.tsx

### Session er null selvom jeg er logget ind
- Tjek at cookie er sat korrekt
- Tjek at `/api/auth/session` returnerer korrekt data
- Tjek browser DevTools > Application > Cookies

### Session opdateres ikke ved tab switch
- Tjek at focus event listener er sat op
- Tjek browser console for errors

### "useSession must be used within a SessionProvider"
- Sørg for at SessionProvider wrapper din app i `layout.tsx`
- Sørg for at komponenten er en Client Component (`"use client"`)

---

## 📝 Best Practices

1. **Brug `useSession()` i Client Components** - For interaktivitet
2. **Brug `getSession()` i Server Components** - For initial data fetching og protected routes
3. **Brug `refetch()` efter mutations** - Når du opdaterer user data (fx efter login)
4. **Check `isLoading` først** - Før du bruger session data
5. **Server Components for protected routes** - Brug `getSession()` og `redirect()` i Server Components (hurtigere end client-side)
6. **Logout flow** - Ved logout redirecter vi først, og SessionContext opdaterer automatisk når `/login` loader

---

## 🔗 Relaterede Filer

- `lib/session/session.ts` - Server-side session
- `contexts/SessionContext.tsx` - Client-side context (eksporterer `useSession()`)
- `hooks/useAuth.ts` - Auth hook (login/logout)
- `app/api/auth/session/route.ts` - Session API
- `app/api/auth/login/route.ts` - Login API
- `app/api/auth/logout/route.ts` - Logout API

