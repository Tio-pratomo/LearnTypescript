# Generics & Type Constraints

Generics adalah fitur TypeScript yang memungkinkan kita membuat komponen yang dapat bekerja dengan berbagai macam tipe data, bukan hanya satu, sambil tetap mempertahankan **type safety**. Think of generics sebagai "parameters untuk tipe data".

## Masalah: Komponen yang Tidak Type-Safe atau Tidak Fleksibel

Bayangkan kita ingin membuat function `identity` yang menerima argumen dan mengembalikannya:

### Solusi 1: Menggunakan `any` (❌ Buruk)

```typescript
function identity(arg: any): any {
  return arg;
}

let output = identity("myString");
// 'output' bertipe 'any' - tidak ada type safety!
// output.toFixed(); // Tidak ada error saat compile, tapi error saat runtime!
```

**Masalah**: Kehilangan semua informasi tipe, tidak type-safe.

### Solusi 2: Function Overloading (⚠️ Tidak Scalable)

```typescript
function identity(arg: string): string;
function identity(arg: number): number;
function identity(arg: boolean): boolean;
function identity(arg: any): any {
  return arg;
}

// Harus define overload untuk setiap tipe - tidak praktis!
```

**Masalah**: Harus define manual untuk setiap tipe, tidak reusable.

### Solusi 3: Generics (✅ Perfect!)

```typescript
function identity<T>(arg: T): T {
  return arg;
}

let outputString = identity<string>("myString"); // Type: string
let outputNumber = identity<number>(42); // Type: number

// Type inference - TypeScript infer otomatis:
let output = identity("myString"); // TypeScript infer T = string
```

**Keuntungan**: Fleksibel + type-safe + reusable!

## Generic Functions

Sintaks dasar generic menggunakan angle brackets `<T>`:

```typescript
// T adalah "type parameter" atau "type variable"
function functionName<T>(param: T): T {
  return param;
}

// Contoh praktis - wrapper untuk array:
function getFirstElement<T>(arr: T[]): T | undefined {
  return arr;
}

const firstNumber = getFirstElement([1, 2, 3]); // Type: number
const firstString = getFirstElement(["a", "b", "c"]); // Type: string

// Multiple type parameters:
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

const result = pair("hello", 42); // Type: [string, number]
```

### Working with Arrays

Generics sangat berguna untuk array operations:

```typescript
function reverseArray<T>(arr: T[]): T[] {
  return arr.reverse();
}

const numbers = reverseArray([1, 2, 3]); // Type: number[]
const strings = reverseArray(["a", "b", "c"]); // Type: string[]

function getLastElement<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1];
}

const last = getLastElement([10, 20, 30]); // Type: number | undefined
```

## Generic Interfaces

Interface juga bisa menggunakan generics:

```typescript
interface Box<T> {
  content: T;
}

const stringBox: Box<string> = { content: "Hello" };
const numberBox: Box<number> = { content: 42 };
const boolBox: Box<boolean> = { content: true };

// Generic interface untuk API response:
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
}

// Reusable untuk berbagai data types:
const userResponse: ApiResponse<User> = {
  data: { id: 1, name: "Budi", email: "budi@example.com" },
  status: 200,
  message: "Success",
};

const productResponse: ApiResponse<Product[]> = {
  data: [
    { id: 1, name: "Laptop", price: 15000000 },
    { id: 2, name: "Mouse", price: 200000 },
  ],
  status: 200,
  message: "Success",
};
```

## Generic Classes

Classes dapat menggunakan generics untuk flexible data handling:

```typescript
class Storage<T> {
  private items: T[] = [];

  addItem(item: T): void {
    this.items.push(item);
  }

  removeItem(item: T): void {
    const index = this.items.indexOf(item);
    if (index > -1) {
      this.items.splice(index, 1);
    }
  }

  getItems(): T[] {
    return [...this.items];
  }

  getItem(index: number): T | undefined {
    return this.items[index];
  }
}

// Number storage:
const numberStorage = new Storage<number>();
numberStorage.addItem(10);
numberStorage.addItem(20);
console.log(numberStorage.getItems()); // [10, 20]

// String storage:
const textStorage = new Storage<string>();
textStorage.addItem("Hello");
textStorage.addItem("World");
console.log(textStorage.getItems()); // ["Hello", "World"]

// ❌ Type safety in action:
// numberStorage.addItem("text");  // Error: Argument of type 'string' is not assignable
```

### Real-World Example: Generic Repository Pattern

```typescript
interface Entity {
  id: number;
}

class Repository<T extends Entity> {
  private data: Map<number, T> = new Map();

  create(item: T): T {
    this.data.set(item.id, item);
    return item;
  }

  findById(id: number): T | undefined {
    return this.data.get(id);
  }

  findAll(): T[] {
    return Array.from(this.data.values());
  }

  update(id: number, updates: Partial<T>): T | undefined {
    const item = this.data.get(id);
    if (item) {
      const updated = { ...item, ...updates };
      this.data.set(id, updated);
      return updated;
    }
    return undefined;
  }

  delete(id: number): boolean {
    return this.data.delete(id);
  }
}

// Usage with different entities:
interface User extends Entity {
  name: string;
  email: string;
}

interface Product extends Entity {
  name: string;
  price: number;
}

const userRepo = new Repository<User>();
userRepo.create({ id: 1, name: "Budi", email: "budi@example.com" });

const productRepo = new Repository<Product>();
productRepo.create({ id: 1, name: "Laptop", price: 15000000 });
```

## Generic Constraints dengan `extends`

Constraints membatasi tipe apa saja yang bisa digunakan dengan generic:

### Basic Constraints

```typescript
// Without constraint:
function logLength<T>(item: T): void {
  // console.log(item.length);  // ❌ Error: Property 'length' doesn't exist on type 'T'
}

// With constraint - T must have 'length' property:
function logLength<T extends { length: number }>(item: T): void {
  console.log(item.length); // ✅ Safe! We know 'length' exists
}

logLength("Hello"); // ✅ Works (string has length)
logLength([1, 2, 3]); // ✅ Works (array has length)
logLength({ length: 10 }); // ✅ Works (object has length)
// logLength(123);           // ❌ Error: number doesn't have length
```

### Constraining to Specific Types

```typescript
// Only allow string, number, or boolean:
function compare<T extends string | number | boolean>(a: T, b: T): boolean {
  return a === b;
}

compare(5, 10); // ✅ OK
compare("hello", "hi"); // ✅ OK
// compare({}, {});       // ❌ Error: object not allowed
```

### Constraining to Objects

```typescript
// Must be an object type:
function merge<T extends object, U extends object>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}

const merged = merge({ name: "Budi" }, { age: 25 });
// Type: { name: string } & { age: number }
console.log(merged.name); // "Budi"
console.log(merged.age); // 25

// merge("string", { age: 25 });  // ❌ Error: string is not object
```

### Using `keyof` Constraint

Sangat powerful untuk type-safe property access:

```typescript
// T must be an object, K must be a key of T:
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = {
  id: 1,
  name: "Budi",
  email: "budi@example.com",
};

const userName = getProperty(user, "name"); // Type: string
const userId = getProperty(user, "id"); // Type: number
// const invalid = getProperty(user, "age");  // ❌ Error: "age" is not key of user

// Real-world example: type-safe object update:
function updateProperty<T, K extends keyof T>(obj: T, key: K, value: T[K]): T {
  return { ...obj, [key]: value };
}

const updatedUser = updateProperty(user, "name", "Andi");
// updatedUser is still type-safe!
// updateProperty(user, "name", 123);  // ❌ Error: number not assignable to string
```

### Interface Constraints

```typescript
interface HasName {
  name: string;
}

interface HasAge {
  age: number;
}

// T must implement HasName interface:
function greet<T extends HasName>(obj: T): string {
  return `Hello, ${obj.name}!`;
}

greet({ name: "Budi", age: 25 }); // ✅ Works
greet({ name: "Andi" }); // ✅ Works
// greet({ age: 25 });                  // ❌ Error: missing 'name'

// Multiple constraints:
function introduce<T extends HasName & HasAge>(person: T): string {
  return `${person.name} is ${person.age} years old`;
}

introduce({ name: "Budi", age: 25 }); // ✅ Works
// introduce({ name: "Budi" });         // ❌ Error: missing 'age'
```

## Default Type Parameters

Memberikan default type jika tidak dispesifikkan:

```typescript
interface ApiResponse<T = unknown> {
  data: T;
  status: number;
}

// With explicit type:
const userResponse: ApiResponse<User> = {
  data: { id: 1, name: "Budi", email: "budi@example.com" },
  status: 200,
};

// Without type - uses default (unknown):
const genericResponse: ApiResponse = {
  data: "anything",
  status: 200,
};

// Multiple defaults:
class Collection<T = string, U = number> {
  constructor(public items: T[], public count: U) {}
}

const strings = new Collection(["a", "b"], 2); // <string, number>
const numbers = new Collection<number>([1, 2], 2); // <number, number>
const mixed = new Collection<boolean, string>([true], "1"); // <boolean, string>
```

## Generic Utility Functions

Contoh praktis generic functions yang reusable:

### Array Utilities

```typescript
// Filter array dengan type preservation:
function filterArray<T>(arr: T[], predicate: (item: T) => boolean): T[] {
  return arr.filter(predicate);
}

const numbers = [1, 2, 3, 4, 5];
const evenNumbers = filterArray(numbers, (n) => n % 2 === 0);
// Type: number[]

// Map dengan type transformation:
function mapArray<T, U>(arr: T[], transform: (item: T) => U): U[] {
  return arr.map(transform);
}

const strings = mapArray([1, 2, 3], (n) => n.toString());
// Type: string[]

// Find first match:
function findFirst<T>(
  arr: T[],
  predicate: (item: T) => boolean
): T | undefined {
  return arr.find(predicate);
}
```

### Promise Utilities

```typescript
// Retry async operation:
async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3
): Promise<T> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxAttempts - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  throw new Error("Max attempts exceeded");
}

// Type-safe memoization:
function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map();

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

const expensiveCalculation = memoize((a: number, b: number) => {
  console.log("Computing...");
  return a + b;
});

console.log(expensiveCalculation(5, 10)); // Computing... 15
console.log(expensiveCalculation(5, 10)); // 15 (from cache)
```

### Object Utilities

```typescript
// Type-safe object keys:
function keys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}

const user = { id: 1, name: "Budi", age: 25 };
const userKeys = keys(user); // Type: ("id" | "name" | "age")[]

// Deep clone:
function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

const clonedUser = deepClone(user); // Type: { id: number; name: string; age: number }
```

## Generic Type Inference

TypeScript sangat pintar dalam menginfer generic types:

```typescript
// Explicit type:
const result1 = identity<string>("hello");

// Type inference (recommended):
const result2 = identity("hello"); // TypeScript infers T = string

// Complex inference:
function createPair<T, U>(first: T, second: U) {
  return { first, second };
}

const pair = createPair("hello", 42);
// TypeScript infers: { first: string, second: number }

// Array inference:
function toArray<T>(...items: T[]): T[] {
  return items;
}

const numbers = toArray(1, 2, 3); // Type: number[]
const strings = toArray("a", "b", "c"); // Type: string[]
const mixed = toArray(1, "a", true); // Type: (string | number | boolean)[]
```

## Best Practices

**Use Meaningful Names** — Gunakan `T` untuk single type, `K` dan `V` untuk key-value, atau nama deskriptif.

```typescript
// ✅ Good:
function getProperty<T, K extends keyof T>(obj: T, key: K) {}
function createMap<Key, Value>(entries: [Key, Value][]) {}

// ❌ Less clear:
function getProperty<A, B extends keyof A>(obj: A, key: B) {}
```

**Add Constraints When Needed** — Jangan terlalu generic, gunakan constraints untuk type safety.

**Prefer Type Inference** — Biarkan TypeScript infer types kecuali perlu explicit.

**Use Generics for Reusability** — Jika function/class hanya untuk satu tipe, tidak perlu generic.

**Combine with Utility Types** — Generics + utility types = powerful combinations.

## Ringkasan

**Generics** — Type parameters yang membuat code reusable + type-safe.

**Syntax** — `<T>` untuk single, `<T, U>` untuk multiple type parameters.

**Constraints** — `T extends SomeType` untuk limit types yang allowed.

**keyof** — `K extends keyof T` untuk type-safe property access.

**Type Inference** — TypeScript pintar infer types, tidak selalu perlu explicit.

**Use Cases** — Collections, API responses, repositories, utility functions.

## Latihan Praktik

Buat file `src/generics-practice.ts`:

```typescript
// 1. Buat generic function 'swap' yang:
//    - Menerima tuple [T, U]
//    - Return [U, T]

// 2. Buat generic class 'Queue<T>' dengan methods:
//    - enqueue(item: T): void
//    - dequeue(): T | undefined
//    - peek(): T | undefined
//    - size(): number

// 3. Buat generic function 'pluck' yang:
//    - Menerima array of objects dan property key
//    - Return array of property values
//    - Gunakan constraint dengan keyof
//    - Example: pluck([{name: "A", age: 20}], "name") => ["A"]

// 4. Buat generic interface 'Result<T, E>' untuk:
//    - Success: { success: true, data: T }
//    - Error: { success: false, error: E }

// 5. Buat generic async function 'fetchWithType' yang:
//    - Menerima URL
//    - Return Promise<T>
//    - Type-safe untuk different response types

// Test semua implementation!
```
