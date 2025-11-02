# Utility Types & Type Transformations

TypeScript menyediakan utility types built-in yang membantu transformasi tipe umum. Types ini memungkinkan Anda membuat tipe baru berdasarkan tipe yang sudah ada tanpa menulis tipe kompleks dari awal.

## Utility Types untuk Memodifikasi Properti

### Partial\<T\>

Membuat semua properti dari tipe `T` menjadi **optional**:

```typescript
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

// Semua properties menjadi optional:
function updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>): Todo {
  return { ...todo, ...fieldsToUpdate };
}

const todo1: Todo = {
  title: "Belajar TypeScript",
  description: "Mempelajari Utility Types",
  completed: false,
};

// Hanya update sebagian field:
const updated = updateTodo(todo1, { completed: true });
// Tidak perlu provide semua fields!

// Real-world: React state updates
interface UserState {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

function updateUser(updates: Partial<UserState>): void {
  // Hanya update field yang diberikan
  setState((prev) => ({ ...prev, ...updates }));
}

updateUser({ name: "New Name" }); // ✅ OK
updateUser({ email: "new@email.com", isActive: true }); // ✅ OK
```

### Required\<T\>

Kebalikan dari `Partial`, membuat semua properti menjadi **required**:

```typescript
interface Props {
  title?: string;
  description?: string;
  completed?: boolean;
}

// Semua properties menjadi required:
type RequiredProps = Required<Props>;
// type RequiredProps = {
//   title: string;
//   description: string;
//   completed: boolean;
// }

const validProps: RequiredProps = {
  title: "Test",
  description: "Description",
  completed: true,
  // ❌ Missing any field will cause error
};

// Use case: Validation
function validateConfig(config: Partial<Config>): config is Required<Config> {
  return (
    config.apiKey !== undefined &&
    config.baseUrl !== undefined &&
    config.timeout !== undefined
  );
}
```

### Readonly\<T\>

Membuat semua properti menjadi **readonly** (tidak bisa diubah):

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

// Semua properties menjadi readonly:
type ReadonlyUser = Readonly<User>;

const user: ReadonlyUser = {
  id: 1,
  name: "Budi",
  email: "budi@example.com",
};

// user.name = "Andi";  // ❌ Error: Cannot assign to 'name' because it is read-only

// Use case: Immutable data structures
function processUser(user: Readonly<User>): void {
  // Tidak bisa modify user di sini
  console.log(user.name);
}

// Real-world: Redux state
type State = Readonly<{
  counter: number;
  users: readonly User[];
}>;
```

## Utility Types untuk Memilih/Mengecualikan Properti

### Pick\<T, K\>

Membuat tipe baru dengan hanya memilih **properti tertentu** dari tipe T:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

// Hanya ambil id, name, dan email:
type PublicUser = Pick<User, "id" | "name" | "email">;
// type PublicUser = {
//   id: number;
//   name: string;
//   email: string;
// }

function displayUser(user: PublicUser): void {
  console.log(`${user.name} (${user.email})`);
  // user.password tidak accessible - tidak ada di type!
}

// Use case: API responses
type UserResponse = Pick<User, "id" | "name" | "email">;

// Use case: Form data
type LoginForm = Pick<User, "email" | "password">;
```

### Omit\<T, K\>

Kebalikan dari `Pick`, membuat tipe baru dengan **mengecualikan** properti tertentu:

```typescript
// Exclude password dari User:
type UserWithoutPassword = Omit<User, "password">;
// type UserWithoutPassword = {
//   id: number;
//   name: string;
//   email: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

// Exclude multiple properties:
type BasicUser = Omit<User, "password" | "createdAt" | "updatedAt">;

// Use case: Create DTO (Data Transfer Object)
interface Product {
  id: number;
  name: string;
  price: number;
  cost: number; // Internal only
  supplierId: number; // Internal only
}

// Public API response - omit internal fields:
type PublicProduct = Omit<Product, "cost" | "supplierId">;

// Use case: Update operations (exclude readonly fields)
interface Entity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  description: string;
}

type UpdateEntity = Omit<Entity, "id" | "createdAt">;
```

## Utility Types untuk Mapping

### Record\<K, T\>

Membuat tipe object dengan **keys** bertipe K dan **values** bertipe T:

```typescript
// Sintaks: Record<Keys, ValueType>

// Simple example:
type UserRoles = Record<string, boolean>;
const roles: UserRoles = {
  admin: true,
  editor: false,
  viewer: true,
};

// With specific keys:
type Page = "home" | "about" | "contact";
type PageInfo = Record<Page, { title: string; content: string }>;

const pages: PageInfo = {
  home: { title: "Home", content: "Welcome" },
  about: { title: "About", content: "About us" },
  contact: { title: "Contact", content: "Contact us" },
  // ❌ Missing any page will cause error
};

// Use case: Configuration objects
type Environment = "development" | "staging" | "production";
type Config = Record<
  Environment,
  {
    apiUrl: string;
    debug: boolean;
  }
>;

const config: Config = {
  development: { apiUrl: "http://localhost:3000", debug: true },
  staging: { apiUrl: "https://staging.api.com", debug: true },
  production: { apiUrl: "https://api.com", debug: false },
};

// Use case: Cache/Map structures
type Cache<T> = Record<string, T>;

const userCache: Cache<User> = {
  "user-1": {
    id: 1,
    name: "Budi",
    email: "budi@example.com",
    password: "xxx",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  "user-2": {
    id: 2,
    name: "Andi",
    email: "andi@example.com",
    password: "xxx",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};
```

### Exclude\<T, U\>

Mengecualikan tipe dari union type:

```typescript
type AllTypes = string | number | boolean | null;

// Exclude null:
type NonNullableTypes = Exclude<AllTypes, null>;
// type NonNullableTypes = string | number | boolean

// Exclude multiple:
type PrimitiveOnly = Exclude<AllTypes, null | boolean>;
// type PrimitiveOnly = string | number

// Use case: Event types
type MouseEvent = "click" | "dblclick" | "mousedown" | "mouseup";
type KeyboardEvent = "keydown" | "keyup" | "keypress";
type AllEvents = MouseEvent | KeyboardEvent;

type OnlyMouseEvents = Exclude<AllEvents, KeyboardEvent>;
// type OnlyMouseEvents = "click" | "dblclick" | "mousedown" | "mouseup"
```

### Extract\<T, U\>

Kebalikan dari `Exclude`, hanya ambil tipe yang ada di U:

```typescript
type AllTypes = string | number | boolean | null;

// Extract hanya string dan number:
type StringOrNumber = Extract<AllTypes, string | number>;
// type StringOrNumber = string | number

// Use case: Filter specific types from union
type Event =
  | { type: "click"; x: number; y: number }
  | { type: "keypress"; key: string }
  | { type: "focus" }
  | { type: "blur" };

type ClickEvent = Extract<Event, { type: "click" }>;
// type ClickEvent = { type: "click"; x: number; y: number }
```

## Utility Types untuk Functions

### ReturnType\<T\>

Mengekstrak **return type** dari function type:

```typescript
function getUser() {
  return {
    id: 1,
    name: "Budi",
    email: "budi@example.com",
  };
}

// Extract return type:
type User = ReturnType<typeof getUser>;
// type User = { id: number; name: string; email: string }

// Use case: API functions
async function fetchProducts() {
  const response = await fetch("/api/products");
  return response.json() as Product[];
}

type Products = ReturnType<typeof fetchProducts>;
// type Products = Promise<Product[]>

// With generic function:
function createArray<T>(item: T): T[] {
  return [item];
}

type StringArray = ReturnType<typeof createArray<string>>;
// type StringArray = string[]
```

### Parameters\<T\>

Mengekstrak **parameter types** dari function sebagai tuple:

```typescript
function greet(name: string, age: number): string {
  return `Hello, ${name}! You are ${age} years old.`;
}

// Extract parameters:
type GreetParams = Parameters<typeof greet>;
// type GreetParams = [name: string, age: number]

// Use case: Function wrappers
function logExecution<T extends (...args: any[]) => any>(
  fn: T,
  ...args: Parameters<T>
): ReturnType<T> {
  console.log(`Calling ${fn.name} with args:`, args);
  return fn(...args);
}

logExecution(greet, "Budi", 25);

// Use case: Memoization
function memoize<T extends (...args: any[]) => any>(fn: T) {
  const cache = new Map<string, ReturnType<T>>();

  return (...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);
    if (!cache.has(key)) {
      cache.set(key, fn(...args));
    }
    return cache.get(key)!;
  };
}
```

### ConstructorParameters\<T\>

Mengekstrak parameter types dari constructor:

```typescript
class User {
  constructor(public id: number, public name: string, public email: string) {}
}

// Extract constructor parameters:
type UserParams = ConstructorParameters<typeof User>;
// type UserParams = [id: number, name: string, email: string]

// Use case: Factory functions
function createUser(...args: ConstructorParameters<typeof User>): User {
  return new User(...args);
}

const user = createUser(1, "Budi", "budi@example.com");
```

### InstanceType\<T\>

Mengekstrak instance type dari constructor function:

```typescript
class Product {
  constructor(public id: number, public name: string) {}
}

// Extract instance type:
type ProductInstance = InstanceType<typeof Product>;
// type ProductInstance = Product

// Use case: Generic factory
function createInstance<T extends new (...args: any[]) => any>(
  constructor: T,
  ...args: ConstructorParameters<T>
): InstanceType<T> {
  return new constructor(...args);
}

const product = createInstance(Product, 1, "Laptop");
```

## Utility Types untuk Async

### Awaited\<T\>

Mengekstrak tipe yang di-resolve dari Promise:

```typescript
// Basic usage:
type PromiseString = Promise<string>;
type ResolvedString = Awaited<PromiseString>;
// type ResolvedString = string

// With nested promises:
type NestedPromise = Promise<Promise<number>>;
type ResolvedNumber = Awaited<NestedPromise>;
// type ResolvedNumber = number (unwraps all levels!)

// Use case: API functions
async function fetchUser(): Promise<User> {
  const response = await fetch("/api/user");
  return response.json();
}

type UserData = Awaited<ReturnType<typeof fetchUser>>;
// type UserData = User (not Promise<User>!)

// Use case: Generic async utilities
async function retry<T>(fn: () => Promise<T>): Promise<T> {
  // ... retry logic
  return fn();
}

type Result = Awaited<ReturnType<typeof retry<string>>>;
// type Result = string

// Real-world example:
interface ApiResponse<T> {
  data: T;
  status: number;
}

async function fetchData<T>(url: string): Promise<ApiResponse<T>> {
  const response = await fetch(url);
  return response.json();
}

type UserApiData = Awaited<ReturnType<typeof fetchData<User>>>;
// type UserApiData = ApiResponse<User>

type ActualUser = UserApiData["data"];
// type ActualUser = User
```

## Utility Types untuk Strings

### Uppercase\<T\>, Lowercase\<T\>, Capitalize\<T\>, Uncapitalize\<T\>

String manipulation utilities:

```typescript
type Greeting = "hello world";

type Uppercase = Uppercase<Greeting>; // "HELLO WORLD"
type Lowercase = Lowercase<Greeting>; // "hello world"
type Capitalize = Capitalize<Greeting>; // "Hello world"
type Uncapitalize = Uncapitalize<Greeting>; // "hello world"

// Use case: Event handlers
type EventName = "click" | "focus" | "blur";
type EventHandler = `on${Capitalize<EventName>}`;
// type EventHandler = "onClick" | "onFocus" | "onBlur"

// Use case: API endpoints
type Method = "get" | "post" | "put" | "delete";
type ApiMethod = Uppercase<Method>;
// type ApiMethod = "GET" | "POST" | "PUT" | "DELETE"
```

## NonNullable\<T\>

Mengecualikan `null` dan `undefined` dari tipe:

```typescript
type MaybeString = string | null | undefined;
type DefinitelyString = NonNullable<MaybeString>;
// type DefinitelyString = string

// Use case: Filter arrays
function filterNullish<T>(arr: (T | null | undefined)[]): NonNullable<T>[] {
  return arr.filter((item): item is NonNullable<T> => item != null);
}

const mixed = [1, null, 2, undefined, 3];
const numbers = filterNullish(mixed); // Type: number[]

// Use case: Safe property access
interface Config {
  apiKey?: string;
  timeout?: number;
}

function requireConfig<K extends keyof Config>(
  config: Config,
  key: K
): NonNullable<Config[K]> {
  const value = config[key];
  if (value == null) {
    throw new Error(`Missing required config: ${key}`);
  }
  return value;
}
```

## Combining Utility Types

Utility types bisa dikombinasikan untuk transformasi kompleks:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

// Combine multiple utilities:
type UpdateUserDTO = Partial<Omit<User, "id" | "createdAt" | "updatedAt">>;
// Optional fields, tanpa id dan timestamps

type ReadonlyPublicUser = Readonly<Pick<User, "id" | "name" | "email">>;
// Readonly + hanya public fields

// Complex transformation:
type ApiUser = Required<Pick<User, "id" | "name" | "email">> & {
  readonly role: string;
  readonly isActive: boolean;
};

// Real-world: Form state
type FormState<T> = {
  values: Partial<T>;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
};

type UserFormState = FormState<User>;
```

## Best Practices

**Use Built-in Utilities** — Jangan reinvent the wheel, gunakan utility types yang sudah ada.

**Combine for Complex Types** — Stack multiple utilities untuk transformasi kompleks.

**Document Intent** — Gunakan type aliases dengan nama yang jelas.

**Prefer Pick over Omit** — `Pick` lebih explicit tentang apa yang di-expose.

**Awaited for Async** — Selalu gunakan `Awaited` untuk extract promise types.

## Ringkasan

**Property Modifiers** — `Partial`, `Required`, `Readonly` untuk memodifikasi properties.

**Property Selectors** — `Pick`, `Omit` untuk memilih/exclude properties.

**Type Constructors** — `Record`, `Exclude`, `Extract` untuk membuat types baru.

**Function Utilities** — `ReturnType`, `Parameters` untuk extract function types.

**Async Utilities** — `Awaited` untuk unwrap promise types.

**String Utilities** — `Uppercase`, `Lowercase`, etc untuk string manipulation.

## Latihan Praktik

Buat file `src/utility-types-practice.ts`:

```typescript
// 1. Buat type untuk Update User DTO:
//    - Gunakan Partial untuk optional fields
//    - Omit id, createdAt, updatedAt
//    - Add updatedBy: number field

// 2. Buat type-safe cache system:
//    - Gunakan Record<K, V>
//    - Keys: string IDs
//    - Values: bisa any entity type

// 3. Buat function wrapper dengan logging:
//    - Extract parameters dengan Parameters<T>
//    - Extract return type dengan ReturnType<T>
//    - Log before/after execution

// 4. Buat type untuk API response:
//    - Generic type Response<T>
//    - Use Awaited untuk extract dari async functions

// 5. Buat readonly configuration object:
//    - Use Record untuk structure
//    - Use Readonly untuk immutability
//    - Different configs untuk different environments

// Test semua implementation!
```
