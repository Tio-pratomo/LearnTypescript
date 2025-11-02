# Integration, Tooling & Real-World Application

Setelah mempelajari semua konsep TypeScript, sekarang saatnya menerapkan knowledge tersebut dalam project real-world. Sesi ini akan membahas integrasi dengan tools modern, framework populer, testing, dan deployment strategies.

## Declaration Files (.d.ts)

Declaration files memberikan informasi tipe untuk JavaScript libraries yang tidak ditulis dalam TypeScript.

### Apa itu Declaration Files?

Declaration files adalah file dengan ekstensi `.d.ts` yang berisi **type declarations** tanpa implementasi:

```typescript
// math.d.ts
export declare function add(a: number, b: number): number;
export declare function subtract(a: number, b: number): number;
export declare const PI: number;

export interface Calculator {
  brand: string;
  calculate(a: number, b: number): number;
}

export declare class ScientificCalculator implements Calculator {
  brand: string;
  constructor(brand: string);
  calculate(a: number, b: number): number;
}
```

### Using Third-Party Libraries

Ketika menggunakan JavaScript library di TypeScript, kita butuh type definitions:

```typescript
// Tanpa types - TypeScript tidak tahu:
import _ from "lodash";
// ❌ Could not find a declaration file for module 'lodash'

// Dengan @types:
// npm install --save-dev @types/lodash
import _ from "lodash";
// ✅ Full TypeScript support!

const numbers = [1, 2, 3, 4, 5];
const doubled = _.map(numbers, (n) => n * 2); // Type-safe!
```

### DefinitelyTyped (@types)

**DefinitelyTyped** adalah repository komunitas untuk type definitions:

```bash
# Install types untuk popular libraries:
npm install --save-dev @types/node
npm install --save-dev @types/express
npm install --save-dev @types/react
npm install --save-dev @types/react-dom
npm install --save-dev @types/jest
```

### Writing Custom Declaration Files

Untuk libraries tanpa types di DefinitelyTyped:

```typescript
// src/types/my-library.d.ts
declare module "my-custom-library" {
  export interface Config {
    apiKey: string;
    baseUrl: string;
  }

  export function initialize(config: Config): void;
  export function getData(): Promise<any>;
}

// Usage:
import { initialize, getData } from "my-custom-library";

initialize({
  apiKey: "abc123",
  baseUrl: "https://api.example.com",
});

const data = await getData();
```

### Ambient Declarations

Global declarations yang tersedia di semua files:

```typescript
// src/types/global.d.ts
declare global {
  interface Window {
    myCustomProperty: string;
    myCustomFunction(): void;
  }

  const API_URL: string;
  const VERSION: string;
}

export {};

// Usage (no import needed):
console.log(window.myCustomProperty);
console.log(API_URL);
```

## ESLint + Prettier Setup (2025 Best Practices)

Modern development workflow dengan linting dan formatting:

### Installation

```bash
# ESLint + TypeScript support
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin

# Prettier
npm install --save-dev --save-exact prettier

# Integration plugins
npm install --save-dev eslint-plugin-prettier eslint-config-prettier
```

### ESLint Configuration (Flat Config 2025)

```javascript
// eslint.config.js (Modern flat config)
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-plugin-prettier/recommended";

export default tseslint.config([
  {
    ignores: ["dist/", "node_modules/", "*.config.js"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  prettierConfig,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // TypeScript specific
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/explicit-function-return-type": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
        },
      ],

      // General
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-const": "error",

      // Prettier
      "prettier/prettier": [
        "error",
        {
          singleQuote: true,
          semi: true,
          trailingComma: "es5",
          tabWidth: 2,
          printWidth: 100,
        },
      ],
    },
  },
]);
```

### Prettier Configuration

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "tabWidth": 2,
  "printWidth": 100,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

### VSCode Settings

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

### Package.json Scripts

```json
{
  "scripts": {
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx}\"",
    "type-check": "tsc --noEmit"
  }
}
```

## TypeScript with React (2025)

Best practices untuk React dengan TypeScript:

### Project Setup

```bash
# Vite (Recommended 2025)
npm create vite@latest my-app -- --template react-ts

# Or Next.js
npx create-next-app@latest --typescript
```

### Component Typing

```typescript
// Functional Component dengan Props
interface UserCardProps {
  user: {
    id: number;
    name: string;
    email: string;
  };
  onEdit?: (id: number) => void;
  className?: string;
}

export const UserCard: React.FC<UserCardProps> = ({
  user,
  onEdit,
  className,
}) => {
  return (
    <div className={className}>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      {onEdit && <button onClick={() => onEdit(user.id)}>Edit</button>}
    </div>
  );
};

// Atau tanpa React.FC (lebih direkomendasikan 2025):
export function UserCard({ user, onEdit, className }: UserCardProps) {
  // ...
}
```

### Hooks dengan TypeScript

```typescript
import { useState, useEffect, useRef, useCallback } from "react";

// useState with type inference
const [count, setCount] = useState(0); // Type: number

// useState with explicit type
const [user, setUser] = useState<User | null>(null);

// useState with initial state
interface FormState {
  email: string;
  password: string;
}

const [form, setForm] = useState<FormState>({
  email: "",
  password: "",
});

// useEffect
useEffect(() => {
  const fetchUser = async () => {
    const data = await getUserData();
    setUser(data);
  };
  fetchUser();
}, []);

// useRef
const inputRef = useRef<HTMLInputElement>(null);

useEffect(() => {
  inputRef.current?.focus();
}, []);

// useCallback with types
const handleSubmit = useCallback((data: FormState) => {
  console.log("Submitting:", data);
}, []);

// Custom hook
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}

// Usage:
const [user, setUser] = useLocalStorage<User>("user", defaultUser);
```

### Event Handlers

```typescript
// Mouse events
const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  console.log(event.currentTarget.name);
};

// Form events
const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  // ...
};

const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setEmail(event.target.value);
};

// Keyboard events
const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
  if (event.key === "Enter") {
    handleSubmit();
  }
};
```

### Context API with TypeScript

```typescript
import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // Login logic
    const userData = await api.login(email, password);
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook with type safety
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

// Usage:
function Profile() {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>{user?.name}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## Testing with TypeScript

Modern testing setup dengan Jest atau Vitest:

### Vitest Setup (Recommended 2025)

```bash
npm install --save-dev vitest @vitest/ui
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: ["node_modules/", "src/test/"],
    },
  },
});
```

### Test Examples

```typescript
// src/utils/math.test.ts
import { describe, it, expect } from "vitest";
import { add, subtract } from "./math";

describe("Math utilities", () => {
  it("should add two numbers", () => {
    expect(add(2, 3)).toBe(5);
  });

  it("should subtract two numbers", () => {
    expect(subtract(5, 3)).toBe(2);
  });
});

// Component testing
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { UserCard } from "./UserCard";

describe("UserCard", () => {
  const mockUser = {
    id: 1,
    name: "Budi",
    email: "budi@example.com",
  };

  it("renders user information", () => {
    render(<UserCard user={mockUser} />);

    expect(screen.getByText("Budi")).toBeInTheDocument();
    expect(screen.getByText("budi@example.com")).toBeInTheDocument();
  });

  it("calls onEdit when edit button is clicked", () => {
    const onEdit = vi.fn();
    render(<UserCard user={mockUser} onEdit={onEdit} />);

    fireEvent.click(screen.getByText("Edit"));
    expect(onEdit).toHaveBeenCalledWith(1);
  });
});

// Async testing
import { describe, it, expect, beforeEach, vi } from "vitest";

describe("UserService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches user data", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 1, name: "Budi" }),
    });
    global.fetch = mockFetch;

    const user = await fetchUser(1);

    expect(user.name).toBe("Budi");
    expect(mockFetch).toHaveBeenCalledWith("/api/users/1");
  });
});
```

### Package.json Test Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:watch": "vitest --watch"
  }
}
```

## Build & Deployment

Production-ready configuration:

### Optimized tsconfig.json

```json
{
  "compilerOptions": {
    /* Language */
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "jsx": "react-jsx",

    /* Module Resolution */
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowImportingTsExtensions": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@utils/*": ["src/utils/*"]
    },

    /* Emit */
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "removeComments": true,

    /* Type Checking - STRICT MODE */
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,

    /* Interop */
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,

    /* Performance */
    "skipLibCheck": true,
    "incremental": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

### Build Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "build:prod": "tsc --noEmit && vite build --mode production",
    "preview": "vite preview",
    "clean": "rm -rf dist"
  }
}
```

## Project Structure (Production-Ready)

```
my-app/
├── src/
│   ├── api/                  # API clients
│   │   ├── client.ts
│   │   └── endpoints/
│   ├── components/           # React components
│   │   ├── common/
│   │   ├── features/
│   │   └── layouts/
│   ├── hooks/                # Custom hooks
│   │   └── useAuth.ts
│   ├── types/                # Type definitions
│   │   ├── api.ts
│   │   ├── models.ts
│   │   └── global.d.ts
│   ├── utils/                # Utilities
│   │   ├── validation.ts
│   │   └── formatting.ts
│   ├── services/             # Business logic
│   │   └── UserService.ts
│   ├── store/                # State management
│   │   └── index.ts
│   ├── App.tsx
│   └── main.tsx
├── tests/
│   ├── unit/
│   └── integration/
├── public/
├── .vscode/
│   └── settings.json
├── eslint.config.js
├── .prettierrc
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
└── package.json
```

## Best Practices Summary

**Strict Mode Always** — Enable `"strict": true` di tsconfig.

**Path Aliases** — Configure untuk cleaner imports.

**ESLint + Prettier** — Gunakan flat config modern.

**Vitest > Jest** — Untuk project baru, Vitest lebih fast.

**React Typing** — Hindari `React.FC`, type props explicitly.

**Declaration Files** — Untuk libraries tanpa types.

**Test Coverage** — Aim for 80%+ coverage untuk critical paths.

## Ringkasan

**Declaration Files** — `.d.ts` untuk type definitions dari JS libraries.

**Tooling** — ESLint + Prettier dengan flat config 2025.

**React Integration** — Type-safe components, hooks, dan context.

**Testing** — Vitest untuk modern testing dengan TypeScript support.

**Production Build** — Optimized tsconfig dan build scripts.

**Project Structure** — Feature-based organization dengan clear separation.

## Final Project: Full-Stack TypeScript App

Buat complete application dengan semua konsep yang dipelajari:

```typescript
// Project: Task Management API + React Frontend

// Backend (Express + TypeScript)
// - User authentication
// - CRUD tasks dengan validation
// - TypeScript types untuk request/response
// - Jest/Vitest tests

// Frontend (React + TypeScript)
// - Login/Register forms
// - Task list dengan CRUD operations
// - Custom hooks (useAuth, useTasks)
// - Context API untuk state
// - React Testing Library tests

// Requirements:
// 1. Strict TypeScript configuration
// 2. ESLint + Prettier setup
// 3. Full type safety dari API ke UI
// 4. 80%+ test coverage
// 5. Production-ready build
```

---

**🎉 Selamat!** Anda telah menyelesaikan **10 Sesi TypeScript**! di situs ini.

Anda sekarang memiliki pengetahuan dari fundamental hingga advanced concepts, siap untuk membangun production-ready applications dengan TypeScript.

**Next Steps:**

- Build real projects untuk practice
- Contribute ke open-source TypeScript projects
- Explore TypeScript dengan framework lain (Vue, Angular, Node.js)
- Stay updated dengan TypeScript releases dan features baru

**Keep coding dan selamat berkarya!** 🚀
