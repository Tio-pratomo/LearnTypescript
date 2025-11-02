# Modules & Code Organization

Seiring bertambahnya ukuran aplikasi, mengelola kode menjadi semakin kompleks. **Modules** adalah cara fundamental di TypeScript untuk mengorganisir kode ke dalam unit-unit terpisah yang dapat digunakan kembali.

## Mengapa Modules Penting?

Sebelum modules, semua variabel dan fungsi di level teratas sebuah file JavaScript berada di **global scope**. Ini menyebabkan masalah:

**Konflik Penamaan** — Dua file bisa mendeklarasikan variabel dengan nama sama, saling menimpa.

**Ketergantungan Tersembunyi** — Sulit mengetahui dependensi sebuah file.

**Sulit Dimaintain** — Kode menjadi sulit diorganisir dan diuji.

Modules menyelesaikan masalah ini dengan menciptakan **scope** sendiri untuk setiap file.

## ES6 Modules (ESM)

TypeScript menggunakan ES6 module syntax, yang merupakan standar modern JavaScript:

### Export: Mengekspos Kode

**Named Exports** — Export multiple items dari file:

```typescript
// math.ts
export function add(a: number, b: number): number {
  return a + b;
}

export function subtract(a: number, b: number): number {
  return a - b;
}

export const PI = 3.14159;

export interface Calculator {
  brand: string;
  model: string;
}

export class ScientificCalculator implements Calculator {
  constructor(public brand: string, public model: string) {}

  calculate(operation: string, a: number, b: number): number {
    // ...
  }
}
```

**Default Export** — Export satu item utama dari file:

```typescript
// logger.ts
export default class Logger {
  log(message: string): void {
    console.log(`[LOG] ${message}`);
  }

  error(message: string): void {
    console.error(`[ERROR] ${message}`);
  }
}

// Atau dengan function:
// config.ts
export default {
  apiUrl: "https://api.example.com",
  timeout: 5000,
};
```

### Import: Menggunakan Kode dari Module Lain

**Named Imports** — Import specific items:

```typescript
// main.ts
import { add, subtract, PI } from "./math";

console.log(add(5, 3)); // 8
console.log(subtract(10, 4)); // 6
console.log(PI); // 3.14159

// Import dengan alias:
import { add as tambah, subtract as kurang } from "./math";

console.log(tambah(5, 3)); // 8

// Import semua dengan namespace:
import * as MathUtils from "./math";

console.log(MathUtils.add(5, 3));
console.log(MathUtils.PI);
```

**Default Imports** — Import default export:

```typescript
// app.ts
import Logger from "./logger";
import config from "./config";

const logger = new Logger();
logger.log("Application started");
console.log(config.apiUrl);
```

**Mixed Imports** — Combine default dan named imports:

```typescript
// utils.ts
export default function formatDate(date: Date): string {
  return date.toISOString();
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString();
}

// Usage:
import formatDate, { formatTime } from "./utils";

console.log(formatDate(new Date()));
console.log(formatTime(new Date()));
```

## Module Resolution

TypeScript menggunakan strategi untuk menemukan file module:

### Relative vs Non-Relative Imports

**Relative Imports** — Dimulai dengan `./`, `../`, atau `/`:

```typescript
// Relative imports:
import { User } from "./models/User"; // Same directory
import { config } from "../config"; // Parent directory
import { Logger } from "./utils/logger"; // Subdirectory

// File structure:
// src/
// ├── app.ts
// ├── models/
// │   └── User.ts
// ├── utils/
// │   └── logger.ts
// └── config.ts
```

**Non-Relative Imports** — Tidak dimulai dengan path relatif:

```typescript
// Non-relative imports (dari node_modules):
import express from "express";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

// Custom path mapping (via tsconfig.json):
import { User } from "@models/User";
import { Logger } from "@utils/logger";
```

### Module Resolution Strategies

TypeScript memiliki 2 strategi utama:

**Node Resolution** (Recommended) — Mengikuti cara Node.js resolve modules:

```json
// tsconfig.json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "module": "commonjs"
  }
}
```

Untuk `import { User } from './models/User'`, TypeScript mencari:

1. `./models/User.ts`
2. `./models/User.tsx`
3. `./models/User.d.ts`
4. `./models/User/index.ts`
5. `./models/User/index.tsx`

**Classic Resolution** (Legacy) — Strategi lama untuk backward compatibility:

```json
{
  "compilerOptions": {
    "moduleResolution": "classic"
  }
}
```

⚠️ **Best Practice 2025**: Selalu gunakan `"moduleResolution": "node"` atau `"bundler"` untuk project modern.

### Path Mapping

Configure alias untuk import paths yang lebih bersih:

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@models/*": ["models/*"],
      "@utils/*": ["utils/*"],
      "@services/*": ["services/*"],
      "@types/*": ["types/*"]
    }
  }
}
```

Sekarang bisa import dengan alias:

```typescript
// Sebelum (relative paths):
import { User } from "../../../models/User";
import { Logger } from "../../utils/Logger";

// Sesudah (dengan path mapping):
import { User } from "@models/User";
import { Logger } from "@utils/Logger";
```

## Barrel Exports Pattern

Barrel files (`index.ts`) consolidate exports dari multiple modules:

### Basic Barrel Pattern

```typescript
// models/User.ts
export interface User {
  id: number;
  name: string;
  email: string;
}

// models/Product.ts
export interface Product {
  id: number;
  name: string;
  price: number;
}

// models/Order.ts
export interface Order {
  id: number;
  userId: number;
  products: number[];
  total: number;
}

// models/index.ts (Barrel file)
export * from "./User";
export * from "./Product";
export * from "./Order";

// Or with explicit re-exports:
export { User } from "./User";
export { Product } from "./Product";
export { Order } from "./Order";
```

**Usage** — Import dari barrel file:

```typescript
// Sebelum (multiple imports):
import { User } from "./models/User";
import { Product } from "./models/Product";
import { Order } from "./models/Order";

// Sesudah (single import):
import { User, Product, Order } from "./models";
```

### Barrel Best Practices

**Do**: Gunakan untuk utility folders dengan banyak small modules:

```typescript
// utils/index.ts
export { formatDate, formatTime } from "./date";
export { validateEmail, validatePhone } from "./validation";
export { capitalize, truncate } from "./string";
```

**Don't**: Hindari barrel files yang terlalu besar atau circular dependencies:

```typescript
// ❌ Bad: Barrel yang terlalu besar
// index.ts - re-exports 50+ modules
export * from "./module1";
export * from "./module2";
// ... 48 more exports
```

**Type-Only Exports** — Gunakan `type` keyword untuk reduce bundle size:

```typescript
// models/index.ts
export type { User } from "./User";
export type { Product } from "./Product";
export { createUser, updateUser } from "./userService";

// Usage:
import type { User, Product } from "@models";
import { createUser } from "@models";
```

## Project Structure Best Practices

### Feature-Based Organization

Organize code berdasarkan **features**, bukan **file types**:

```
src/
├── users/
│   ├── User.ts              # Type/Interface
│   ├── UserService.ts       # Business logic
│   ├── UserRepository.ts    # Data access
│   ├── userValidation.ts    # Validation logic
│   └── index.ts             # Barrel export
├── products/
│   ├── Product.ts
│   ├── ProductService.ts
│   ├── ProductRepository.ts
│   └── index.ts
├── orders/
│   ├── Order.ts
│   ├── OrderService.ts
│   ├── OrderRepository.ts
│   └── index.ts
├── shared/
│   ├── types/               # Shared types
│   ├── utils/               # Shared utilities
│   └── constants/           # Shared constants
└── index.ts                 # Main entry point
```

### Layered Architecture

Organize dengan **separation of concerns**:

```
src/
├── domain/                  # Business entities
│   ├── models/
│   │   ├── User.ts
│   │   ├── Product.ts
│   │   └── index.ts
│   └── interfaces/
│       └── repositories/
├── application/             # Use cases/services
│   ├── services/
│   │   ├── UserService.ts
│   │   └── ProductService.ts
│   └── dtos/                # Data Transfer Objects
│       ├── CreateUserDto.ts
│       └── UpdateUserDto.ts
├── infrastructure/          # External concerns
│   ├── database/
│   │   ├── repositories/
│   │   └── migrations/
│   └── external/
│       └── api/
└── presentation/            # UI/API layer
    ├── controllers/
    ├── routes/
    └── middleware/
```

## Namespace (Legacy)

⚠️ Namespaces adalah fitur legacy, **gunakan modules** untuk code baru:

```typescript
// ❌ Old way (Namespace):
namespace Utils {
  export function formatDate(date: Date): string {
    return date.toISOString();
  }
}

// Usage:
Utils.formatDate(new Date());

// ✅ Modern way (Module):
// utils.ts
export function formatDate(date: Date): string {
  return date.toISOString();
}

// Usage:
import { formatDate } from "./utils";
formatDate(new Date());
```

**Kapan gunakan Namespace?**

- Ambient declarations (`.d.ts` files)
- Global type definitions
- Legacy code maintenance

## Dynamic Imports

Import modules secara **lazy** untuk code splitting:

```typescript
// Static import (loaded immediately):
import { heavyFunction } from "./heavy-module";

// Dynamic import (loaded on-demand):
async function loadHeavyModule() {
  const module = await import("./heavy-module");
  module.heavyFunction();
}

// Use case: Conditional loading
async function loadLocale(language: string) {
  if (language === "id") {
    const locale = await import("./locales/id");
    return locale.default;
  } else {
    const locale = await import("./locales/en");
    return locale.default;
  }
}

// Use case: Route-based code splitting
async function loadRoute(route: string) {
  switch (route) {
    case "/users":
      const UsersModule = await import("./pages/Users");
      return UsersModule.default;
    case "/products":
      const ProductsModule = await import("./pages/Products");
      return ProductsModule.default;
    default:
      const HomeModule = await import("./pages/Home");
      return HomeModule.default;
  }
}
```

## Module Augmentation

Extend existing modules dengan tambahan declarations:

```typescript
// Augment built-in module:
declare global {
  interface Array<T> {
    firstOrDefault(): T | undefined;
  }
}

Array.prototype.firstOrDefault = function () {
  return this.length > 0 ? this : undefined;
};

// Usage:
const numbers = [1, 2, 3];
console.log(numbers.firstOrDefault()); // 1

// Augment third-party module:
import "express";

declare module "express" {
  interface Request {
    user?: {
      id: number;
      name: string;
    };
  }
}

// Now Request has user property:
app.get("/profile", (req, res) => {
  if (req.user) {
    res.json(req.user);
  }
});
```

## Real-World Example: Complete Module Structure

```typescript
// src/users/types.ts
export interface User {
  id: number;
  name: string;
  email: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
}

// src/users/repository.ts
import type { User } from "./types";

export class UserRepository {
  private users: Map<number, User> = new Map();

  async findById(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async create(user: User): Promise<User> {
    this.users.set(user.id, user);
    return user;
  }
}

// src/users/service.ts
import type { User, CreateUserDto, UpdateUserDto } from "./types";
import { UserRepository } from "./repository";

export class UserService {
  constructor(private repository: UserRepository) {}

  async getUser(id: number): Promise<User | undefined> {
    return this.repository.findById(id);
  }

  async createUser(dto: CreateUserDto): Promise<User> {
    const user: User = {
      id: Date.now(),
      name: dto.name,
      email: dto.email,
    };
    return this.repository.create(user);
  }
}

// src/users/index.ts (Barrel)
export type { User, CreateUserDto, UpdateUserDto } from "./types";
export { UserRepository } from "./repository";
export { UserService } from "./service";

// src/app.ts
import { UserService, UserRepository } from "./users";

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

async function main() {
  const user = await userService.createUser({
    name: "Budi",
    email: "budi@example.com",
    password: "secret123",
  });
  console.log(user);
}

main();
```

## Best Practices

**Use ES6 Modules** — Avoid namespaces untuk code baru.

**Feature-Based Structure** — Organize berdasarkan features, bukan file types.

**Path Mapping** — Configure aliases untuk cleaner imports.

**Barrel Files** — Gunakan dengan bijak, hindari yang terlalu besar.

**Type-Only Imports** — Gunakan `import type` untuk types.

**Dynamic Imports** — Untuk code splitting dan lazy loading.

**Node Resolution** — Selalu gunakan `moduleResolution: "node"` atau `"bundler"`.

## Ringkasan

**ES6 Modules** — Named exports, default exports, mixed imports.

**Module Resolution** — Node strategy (recommended), path mapping untuk aliases.

**Barrel Exports** — Consolidate exports dengan `index.ts`, gunakan dengan bijak.

**Project Structure** — Feature-based atau layered architecture.

**Dynamic Imports** — On-demand loading untuk optimization.

## Latihan Praktik

Buat struktur project dengan modules:

```
src/
├── products/
│   ├── Product.ts           # Interface
│   ├── ProductService.ts    # Business logic
│   ├── ProductRepository.ts # Data access
│   └── index.ts             # Barrel
├── orders/
│   ├── Order.ts
│   ├── OrderService.ts
│   ├── OrderRepository.ts
│   └── index.ts
├── shared/
│   ├── utils/
│   │   ├── validation.ts
│   │   ├── formatting.ts
│   │   └── index.ts
│   └── types/
│       └── common.ts
└── app.ts

// Task:
// 1. Implement Product dan Order modules dengan CRUD operations
// 2. Setup barrel exports di setiap folder
// 3. Configure path mapping di tsconfig.json (@products, @orders, @shared)
// 4. Implement OrderService yang depend on ProductService
// 5. Test semua imports di app.ts
```
