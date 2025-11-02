# Functions & Async Programming

Functions adalah blok bangunan fundamental dalam aplikasi JavaScript/TypeScript. TypeScript meningkatkan functions dengan menambahkan type safety untuk parameter dan return values, membuat kode lebih andal dan mudah dipahami.

## Function Type Annotations

### Mendefinisikan Tipe Parameter dan Return Value

Tentukan tipe data untuk setiap parameter dan nilai kembalian function:

```typescript
// Sintaks dasar:
function namaFunction(param1: TipeData1, param2: TipeData2): TipeKembalian {
  return nilai_dengan_TipeKembalian;
}

// Contoh konkret:
function tambah(a: number, b: number): number {
  return a + b;
}

let hasil: number = tambah(5, 10); // ✅ 15
// tambah("5", 10);                 // ❌ Error: Argument of type 'string'...
```

### Function Tanpa Return Value

Gunakan `void` untuk functions yang tidak mengembalikan nilai:

```typescript
function logMessage(message: string): void {
  console.log(message);
  // Tidak ada return statement
}

function greet(name: string): void {
  console.log(`Hello, ${name}!`);
}

greet("Budi");
```

### Type Inference untuk Return Value

TypeScript bisa infer return type otomatis:

```typescript
// TypeScript infer return type sebagai 'number'
function multiply(x: number, y: number) {
  return x * y;
}

// Explicit type annotation lebih direkomendasikan untuk function publik:
function divide(x: number, y: number): number {
  return x / y;
}
```

## Optional dan Default Parameters

### Optional Parameters

Parameter yang tidak wajib diisi, ditandai dengan `?`:

```typescript
function greet(name: string, greeting?: string): string {
  if (greeting) {
    return `${greeting}, ${name}!`;
  }
  return `Hello, ${name}!`;
}

console.log(greet("Budi")); // "Hello, Budi!"
console.log(greet("Budi", "Selamat pagi")); // "Selamat pagi, Budi!"

// ⚠️ Optional parameters harus di akhir:
// function invalid(opt?: string, required: string) {}  // ❌ Error
```

### Default Parameters

Parameter dengan nilai default jika tidak diisi:

```typescript
function calculatePrice(price: number, tax: number = 0.1): number {
  return price + price * tax;
}

console.log(calculatePrice(1000)); // 1100 (tax = 0.1)
console.log(calculatePrice(1000, 0.15)); // 1150 (tax = 0.15)

// Default parameters otomatis optional:
function createUser(name: string, role: string = "user"): object {
  return { name, role };
}
```

### Optional vs Default

```typescript
// Optional: undefined jika tidak diisi
function optionalParam(value?: number): void {
  console.log(value); // bisa undefined
}

optionalParam(); // undefined

// Default: ada nilai pasti
function defaultParam(value: number = 0): void {
  console.log(value); // tidak akan undefined
}

defaultParam(); // 0
```

## Rest Parameters

Menerima jumlah argumen yang tidak terbatas:

```typescript
// Rest parameter harus array:
function sum(...numbers: number[]): number {
  return numbers.reduce((total, num) => total + num, 0);
}

console.log(sum(1, 2, 3)); // 6
console.log(sum(10, 20, 30, 40)); // 100

// Rest parameter dengan parameter biasa:
function logWithPrefix(prefix: string, ...messages: string[]): void {
  messages.forEach((msg) => console.log(`${prefix}: ${msg}`));
}

logWithPrefix("INFO", "App started", "Database connected", "Server running");
// INFO: App started
// INFO: Database connected
// INFO: Server running
```

## Function Overloading

Mendefinisikan multiple signatures untuk satu function:

```typescript
// Overload signatures:
function formatValue(value: string): string;
function formatValue(value: number): string;
function formatValue(value: boolean): string;

// Implementation signature:
function formatValue(value: string | number | boolean): string {
  if (typeof value === "string") {
    return value.toUpperCase();
  } else if (typeof value === "number") {
    return value.toFixed(2);
  } else {
    return value ? "YES" : "NO";
  }
}

console.log(formatValue("hello")); // "HELLO"
console.log(formatValue(42)); // "42.00"
console.log(formatValue(true)); // "YES"
```

**Use Case Real-World**: DOM manipulation

```typescript
function createElement(tag: "div"): HTMLDivElement;
function createElement(tag: "span"): HTMLSpanElement;
function createElement(tag: "button"): HTMLButtonElement;

function createElement(tag: string): HTMLElement {
  return document.createElement(tag);
}

const divElement = createElement("div"); // Type: HTMLDivElement
const spanElement = createElement("span"); // Type: HTMLSpanElement
```

## Arrow Functions

Syntax modern untuk mendefinisikan functions:

```typescript
// Sintaks dasar:
const functionName = (param: Type): ReturnType => {
  return value;
};

// Single line (implicit return):
const square = (x: number): number => x * x;

// Multiple parameters:
const add = (a: number, b: number): number => a + b;

// No parameters:
const getRandomNumber = (): number => Math.random();

// Object literal return (perlu parentheses):
const createUser = (name: string): { name: string; id: number } => ({
  name,
  id: Date.now(),
});
```

### Arrow Function vs Regular Function

```typescript
// Regular function:
function regularGreet(name: string): string {
  return `Hello, ${name}`;
}

// Arrow function (lebih concise):
const arrowGreet = (name: string): string => `Hello, ${name}`;

// ⚠️ Perbedaan utama: 'this' binding
class Counter {
  count: number = 0;

  // Regular function: 'this' dinamis
  incrementRegular() {
    setTimeout(function () {
      // this.count++;  // ❌ Error: 'this' refers to wrong context
    }, 1000);
  }

  // Arrow function: 'this' lexical (dari parent scope)
  incrementArrow() {
    setTimeout(() => {
      this.count++; // ✅ Works! 'this' refers to Counter instance
    }, 1000);
  }
}
```

## Type Aliases untuk Function Signatures

Mendefinisikan type untuk function signatures:

```typescript
// Type alias untuk function:
type MathOperation = (x: number, y: number) => number;

const add: MathOperation = (x, y) => x + y;
const subtract: MathOperation = (x, y) => x - y;
const multiply: MathOperation = (x, y) => x * y;

// Callback dengan type alias:
type Callback = (message: string) => void;

function processData(data: string[], callback: Callback): void {
  data.forEach((item) => callback(item));
}

processData(["A", "B", "C"], (msg) => console.log(msg));
```

## Async Programming dengan TypeScript

JavaScript adalah **single-threaded**, tapi operasi I/O (network requests, file operations, timers) berjalan secara asynchronous. TypeScript memberikan type safety untuk async operations.

### Promises

Promise adalah objek yang merepresentasikan penyelesaian (atau kegagalan) eventual dari operasi asynchronous:

```typescript
// Promise dengan tipe generic:
const fetchUser = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = Math.random() > 0.5;
      if (success) {
        resolve("User data fetched");
      } else {
        reject(new Error("Failed to fetch user"));
      }
    }, 1000);
  });
};

// Consume promise dengan .then() dan .catch():
fetchUser()
  .then((data) => {
    console.log(data); // TypeScript knows data is string
  })
  .catch((error) => {
    console.error(error.message);
  });
```

### Typing Promises

Promise menerima **generic type** untuk menentukan tipe data yang di-resolve:

```typescript
// Promise<T> di mana T adalah tipe data yang di-resolve:
interface User {
  id: number;
  name: string;
  email: string;
}

function fetchUserById(id: number): Promise<User> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        id,
        name: "Budi Santoso",
        email: "budi@example.com",
      });
    }, 1000);
  });
}

// TypeScript tahu return type adalah Promise<User>:
fetchUserById(1).then((user) => {
  console.log(user.name.toUpperCase()); // Type-safe!
});
```

### Async/Await: Modern Promise Syntax

`async`/`await` adalah syntactic sugar untuk Promises yang membuat async code lebih mudah dibaca:

```typescript
// Function dengan 'async' keyword otomatis return Promise:
async function fetchData(): Promise<string> {
  return "Data fetched"; // Otomatis wrapped dalam Promise
}

// 'await' menunggu Promise resolve:
async function getUserData(id: number): Promise<User> {
  // await hanya bisa digunakan dalam async function
  const response = await fetchUserById(id);
  return response;
}

// Calling async function:
getUserData(1).then((user) => {
  console.log(user.name);
});

// Atau dengan await (dalam async context):
async function main() {
  const user = await getUserData(1);
  console.log(user.name);
}
```

### Error Handling dengan Try-Catch

Handle errors dalam async/await menggunakan `try-catch`:

```typescript
async function fetchUserSafe(id: number): Promise<User | null> {
  try {
    const user = await fetchUserById(id);
    console.log("User fetched successfully");
    return user;
  } catch (error) {
    // TypeScript 4.0+: error type adalah 'unknown'
    if (error instanceof Error) {
      console.error("Error fetching user:", error.message);
    }
    return null;
  }
}

// Best practice: Always wrap await in try-catch
async function processUser(id: number): Promise<void> {
  try {
    const user = await fetchUserSafe(id);
    if (user) {
      console.log(`Processing ${user.name}`);
    }
  } catch (error) {
    // Handle error gracefully
    console.error("Failed to process user");
  }
}
```

### Custom Error Classes

Buat custom error types untuk error handling yang lebih spesifik:

```typescript
// Custom error class:
class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public endpoint: string
  ) {
    super(message);
    this.name = "ApiError";
    // Restore prototype chain:
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

class ValidationError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = "ValidationError";
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

// Throwing custom errors:
async function fetchApi(endpoint: string): Promise<any> {
  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new ApiError("API request failed", response.status, endpoint);
  }

  return response.json();
}

// Catching specific error types:
async function handleApiRequest() {
  try {
    const data = await fetchApi("/api/users");
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(`API Error [${error.statusCode}] at ${error.endpoint}`);
    } else if (error instanceof ValidationError) {
      console.error(`Validation Error in field: ${error.field}`);
    } else {
      console.error("Unknown error:", error);
    }
  }
}
```

### Parallel Async Operations

Jalankan multiple promises secara paralel dengan `Promise.all()`:

```typescript
async function fetchMultipleUsers(ids: number[]): Promise<User[]> {
  // Promise.all menjalankan semua promises secara paralel:
  const promises = ids.map((id) => fetchUserById(id));
  const users = await Promise.all(promises);
  return users;
}

// Sequential vs Parallel:
async function sequentialFetch(): Promise<void> {
  const user1 = await fetchUserById(1); // Wait
  const user2 = await fetchUserById(2); // Wait
  const user3 = await fetchUserById(3); // Wait
  // Total time: ~3 seconds
}

async function parallelFetch(): Promise<void> {
  const [user1, user2, user3] = await Promise.all([
    fetchUserById(1),
    fetchUserById(2),
    fetchUserById(3),
  ]);
  // Total time: ~1 second (all run concurrently)
}
```

### Promise Utility Methods

```typescript
// Promise.race: resolve dengan promise pertama yang selesai
async function fetchWithTimeout(url: string, timeout: number): Promise<any> {
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Timeout")), timeout)
  );

  const fetchPromise = fetch(url).then((res) => res.json());

  return Promise.race([fetchPromise, timeoutPromise]);
}

// Promise.allSettled: tunggu semua promise (baik resolve/reject)
async function fetchAllUsers(ids: number[]): Promise<void> {
  const results = await Promise.allSettled(ids.map((id) => fetchUserById(id)));

  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      console.log(`User ${ids[index]}:`, result.value);
    } else {
      console.error(`Failed to fetch user ${ids[index]}:`, result.reason);
    }
  });
}
```

### Real-World Example: API Data Fetching

```typescript
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  inStock: boolean;
}

// Generic async function dengan error handling:
async function fetchFromApi<T>(endpoint: string): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`https://api.example.com${endpoint}`);

    if (!response.ok) {
      throw new ApiError("Request failed", response.status, endpoint);
    }

    const data = await response.json();

    return {
      data,
      status: response.status,
      message: "Success",
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error("Network error");
  }
}

// Usage:
async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetchFromApi<Product[]>("/products");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

// Dengan retry logic:
async function fetchWithRetry<T>(
  endpoint: string,
  maxRetries: number = 3
): Promise<ApiResponse<T>> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fetchFromApi<T>(endpoint);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      console.log(`Retry ${i + 1}/${maxRetries}...`);
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  throw new Error("Max retries exceeded");
}
```

## Best Practices

**Explicit Return Types** — Selalu define return type untuk function publik.

**Use Async/Await** — Lebih readable daripada `.then()` chains.

**Always Try-Catch** — Wrap semua await dalam try-catch.

**Custom Errors** — Buat error classes untuk error handling yang lebih precise.

**Type Unknown Errors** — Di TypeScript 4.0+, catch errors as `unknown` dan narrow dengan type guards.

**Parallel When Possible** — Gunakan `Promise.all()` untuk independent async operations.

## Ringkasan

**Function Typing** — Parameter types + return type untuk type safety.

**Optional & Default** — `?` untuk optional, `= value` untuk default parameters.

**Rest Parameters** — `...args: Type[]` untuk variable-length arguments.

**Async/Await** — Modern syntax untuk Promises, lebih readable.

**Error Handling** — Always use try-catch dengan custom error classes.

**Promise Utilities** — `Promise.all()`, `Promise.race()`, `Promise.allSettled()` untuk advanced patterns.

## Latihan Praktik

Buat file `src/async-practice.ts`:

```typescript
// 1. Buat function simulasi API call dengan delay:
// - fetchProductById(id: number): Promise<Product>
// - Product interface: { id, name, price, stock }
// - Simulate 1 second delay dengan setTimeout

// 2. Buat function dengan error handling:
// - getProduct(id: number) yang handle jika id tidak valid (<= 0)
// - Throw custom ValidationError jika invalid

// 3. Buat function untuk fetch multiple products parallel:
// - fetchMultipleProducts(ids: number[]): Promise<Product[]>
// - Gunakan Promise.all()

// 4. Buat function dengan retry logic:
// - fetchWithRetry(id: number, maxRetries: number)
// - Retry jika error, dengan delay 1 detik antar retry

// 5. Test semua functions dengan async main():
async function main() {
  // Test code here
}

main();
```
