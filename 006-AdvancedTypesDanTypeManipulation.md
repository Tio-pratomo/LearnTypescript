# Advanced Types & Type Manipulation

Setelah memahami generics, sekarang kita akan menjelajahi fitur-fitur TypeScript yang lebih advanced untuk membuat sistem tipe yang lebih ekspresif dan powerful.

## Intersection Types (Tipe Irisan)

Intersection types menggabungkan beberapa tipe menjadi satu tipe baru yang memiliki **semua** properti dari semua tipe yang digabungkan:

### Sintaks dan Penggunaan Dasar

```typescript
// Sintaks: TypeA & TypeB
interface Person {
  name: string;
  age: number;
}

interface Employee {
  employeeId: string;
  department: string;
}

// Intersection: harus memiliki SEMUA properties
type PersonEmployee = Person & Employee;

const karyawan: PersonEmployee = {
  name: "Budi",
  age: 30,
  employeeId: "EMP001",
  department: "IT",
  // ❌ Missing any property will cause error
};
```

### Combining Multiple Types

```typescript
interface ContactInfo {
  email: string;
  phone: string;
}

interface Address {
  street: string;
  city: string;
  country: string;
}

interface Preferences {
  newsletter: boolean;
  notifications: boolean;
}

// Combine all three:
type CompleteProfile = Person & ContactInfo & Address & Preferences;

const profile: CompleteProfile = {
  name: "Andi",
  age: 28,
  email: "andi@example.com",
  phone: "+62812345678",
  street: "Jl. Sudirman No. 1",
  city: "Jakarta",
  country: "Indonesia",
  newsletter: true,
  notifications: false,
};
```

### Intersection vs Interface Extension

```typescript
// Using intersection:
type Manager = Employee & {
  teamSize: number;
  reports: string[];
};

// Using interface extension (similar result):
interface Manager extends Employee {
  teamSize: number;
  reports: string[];
}

// Intersection is more flexible for complex scenarios:
type FullTimeManager = Employee & Manager & { salary: number };
```

## Union Types (Advanced)

Union types memungkinkan nilai menjadi salah satu dari beberapa tipe:

### Basic Union Review

```typescript
let id: number | string;
id = 101; // ✅ OK
id = "USR-101"; // ✅ OK
// id = true;    // ❌ Error
```

### Discriminated Unions (Tagged Unions)

Pattern powerful untuk type-safe state management:

```typescript
// Each type has a literal "tag" field for discrimination:
interface Circle {
  kind: "circle"; // Discriminant/tag
  radius: number;
}

interface Rectangle {
  kind: "rectangle"; // Discriminant/tag
  width: number;
  height: number;
}

interface Triangle {
  kind: "triangle"; // Discriminant/tag
  base: number;
  height: number;
}

type Shape = Circle | Rectangle | Triangle;

// Type narrowing dengan discriminant:
function calculateArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      // TypeScript knows shape is Circle here
      return Math.PI * shape.radius ** 2;

    case "rectangle":
      // TypeScript knows shape is Rectangle here
      return shape.width * shape.height;

    case "triangle":
      // TypeScript knows shape is Triangle here
      return (shape.base * shape.height) / 2;
  }
}

const circle: Shape = { kind: "circle", radius: 5 };
console.log(calculateArea(circle)); // 78.54
```

### Real-World Example: API Response Handling

```typescript
interface SuccessResponse<T> {
  status: "success";
  data: T;
  timestamp: number;
}

interface ErrorResponse {
  status: "error";
  message: string;
  code: number;
}

interface LoadingResponse {
  status: "loading";
}

type ApiResponse<T> = SuccessResponse<T> | ErrorResponse | LoadingResponse;

function handleResponse<T>(response: ApiResponse<T>): void {
  switch (response.status) {
    case "success":
      // TypeScript knows response.data exists
      console.log("Data:", response.data);
      break;

    case "error":
      // TypeScript knows response.message and response.code exist
      console.error(`Error ${response.code}: ${response.message}`);
      break;

    case "loading":
      // TypeScript knows only status exists
      console.log("Loading...");
      break;
  }
}
```

## Type Guards (Penjaga Tipe)

Type guards adalah expressions yang melakukan runtime checking dan mempengaruhi tipe di scope tertentu:

### Built-in Type Guards

```typescript
// 1. typeof type guard:
function processValue(value: string | number): void {
  if (typeof value === "string") {
    // TypeScript knows value is string
    console.log(value.toUpperCase());
  } else {
    // TypeScript knows value is number
    console.log(value.toFixed(2));
  }
}

// 2. instanceof type guard:
class Dog {
  bark() {
    console.log("Woof!");
  }
}

class Cat {
  meow() {
    console.log("Meow!");
  }
}

function makeSound(animal: Dog | Cat): void {
  if (animal instanceof Dog) {
    animal.bark();
  } else {
    animal.meow();
  }
}

// 3. 'in' operator type guard:
interface Fish {
  swim: () => void;
}

interface Bird {
  fly: () => void;
}

function move(animal: Fish | Bird): void {
  if ("swim" in animal) {
    animal.swim();
  } else {
    animal.fly();
  }
}
```

### Custom Type Guards (Type Predicates)

Buat custom type checking functions:

```typescript
// Type predicate: parameter is Type
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNumber(value: unknown): value is number {
  return typeof value === "number";
}

function processInput(input: unknown): void {
  if (isString(input)) {
    // TypeScript knows input is string
    console.log(input.toUpperCase());
  } else if (isNumber(input)) {
    // TypeScript knows input is number
    console.log(input.toFixed(2));
  }
}

// Complex type guard:
interface User {
  id: number;
  name: string;
  email: string;
}

function isUser(obj: any): obj is User {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.id === "number" &&
    typeof obj.name === "string" &&
    typeof obj.email === "string"
  );
}

function greetUser(data: unknown): void {
  if (isUser(data)) {
    // TypeScript knows data is User
    console.log(`Hello, ${data.name}!`);
  } else {
    console.log("Invalid user data");
  }
}
```

### Assertion Functions

Functions yang throw jika condition tidak terpenuhi:

```typescript
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== "string") {
    throw new Error("Value is not a string");
  }
}

function processText(input: unknown): void {
  assertIsString(input);
  // After this point, TypeScript knows input is string
  console.log(input.toUpperCase());
}

// Assert non-null:
function assertIsDefined<T>(value: T): asserts value is NonNullable<T> {
  if (value === null || value === undefined) {
    throw new Error("Value is null or undefined");
  }
}

function getLength(value: string | null): number {
  assertIsDefined(value);
  // TypeScript knows value is not null here
  return value.length;
}
```

## Exhaustiveness Checking

Memastikan semua cases di discriminated union telah dihandle:

```typescript
type Action =
  | { type: "INCREMENT"; payload: number }
  | { type: "DECREMENT"; payload: number }
  | { type: "RESET" };

function reducer(state: number, action: Action): number {
  switch (action.type) {
    case "INCREMENT":
      return state + action.payload;

    case "DECREMENT":
      return state - action.payload;

    case "RESET":
      return 0;

    default:
      // Exhaustiveness checking dengan never:
      const exhaustiveCheck: never = action;
      throw new Error(`Unhandled action: ${exhaustiveCheck}`);
  }
}

// Jika menambahkan action baru tanpa handle, TypeScript akan error:
// type Action = ... | { type: "MULTIPLY"; payload: number };
// ❌ Error: Type '{ type: "MULTIPLY"; ... }' is not assignable to type 'never'
```

### Helper Function untuk Exhaustiveness

```typescript
function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${JSON.stringify(value)}`);
}

type Status = "idle" | "loading" | "success" | "error";

function handleStatus(status: Status): string {
  switch (status) {
    case "idle":
      return "Not started";
    case "loading":
      return "Loading...";
    case "success":
      return "Completed!";
    case "error":
      return "Failed";
    default:
      return assertNever(status);
  }
}
```

## Mapped Types

Membuat tipe baru dengan transform properti dari tipe lain:

### Basic Mapped Types

```typescript
// Sintaks: { [K in Keys]: Type }

type ReadonlyType<T> = {
  readonly [K in keyof T]: T[K];
};

interface User {
  id: number;
  name: string;
  email: string;
}

type ReadonlyUser = ReadonlyType<User>;
// Equivalent to:
// type ReadonlyUser = {
//   readonly id: number;
//   readonly name: string;
//   readonly email: string;
// }

const user: ReadonlyUser = {
  id: 1,
  name: "Budi",
  email: "budi@example.com",
};

// user.name = "Andi";  // ❌ Error: Cannot assign to 'name'
```

### Optional Mapped Type

```typescript
type Optional<T> = {
  [K in keyof T]?: T[K];
};

type OptionalUser = Optional<User>;
// All properties become optional:
// type OptionalUser = {
//   id?: number;
//   name?: string;
//   email?: string;
// }

const partialUser: OptionalUser = {
  name: "Budi",
  // id and email are optional
};
```

### Mapping with Transformation

```typescript
// Convert all properties to string:
type Stringify<T> = {
  [K in keyof T]: string;
};

type StringifiedUser = Stringify<User>;
// type StringifiedUser = {
//   id: string;
//   name: string;
//   email: string;
// }

// Convert to Promise:
type Promisify<T> = {
  [K in keyof T]: Promise<T[K]>;
};

type AsyncUser = Promisify<User>;
// type AsyncUser = {
//   id: Promise<number>;
//   name: Promise<string>;
//   email: Promise<string>;
// }
```

## Conditional Types

Tipe yang depend pada condition (seperti ternary):

### Basic Conditional Types

```typescript
// Sintaks: T extends U ? X : Y
type IsString<T> = T extends string ? true : false;

type A = IsString<string>; // true
type B = IsString<number>; // false

// Extract certain types from union:
type NonNullable<T> = T extends null | undefined ? never : T;

type C = NonNullable<string | null>; // string
type D = NonNullable<number | undefined>; // number
```

### Infer Keyword

Extract types dari structures:

```typescript
// Extract return type from function:
type ReturnTypeOf<T> = T extends (...args: any[]) => infer R ? R : never;

function getUser() {
  return { id: 1, name: "Budi" };
}

type User = ReturnTypeOf<typeof getUser>;
// type User = { id: number; name: string; }

// Extract parameter types:
type Parameters<T> = T extends (...args: infer P) => any ? P : never;

function greet(name: string, age: number) {}

type GreetParams = Parameters<typeof greet>;
// type GreetParams = [name: string, age: number]

// Extract array element type:
type ArrayElement<T> = T extends (infer U)[] ? U : never;

type StringArray = ArrayElement<string[]>; // string
type NumberArray = ArrayElement<number[]>; // number
```

### Distributive Conditional Types

Conditional types distribute over unions:

```typescript
type ToArray<T> = T extends any ? T[] : never;

type StringOrNumber = string | number;
type Result = ToArray<StringOrNumber>;
// Result = string[] | number[] (distributes!)

// Practical example - extract specific types:
type ExtractString<T> = T extends string ? T : never;

type Mixed = string | number | boolean;
type OnlyStrings = ExtractString<Mixed>; // never (no string literals)

type Literals = "hello" | 42 | true;
type OnlyStringLiterals = ExtractString<Literals>; // "hello"
```

## Template Literal Types

String types dengan template literal syntax:

### Basic Template Literals

```typescript
// Sintaks: `string ${Type} string`
type Greeting = `Hello, ${string}!`;

const greeting1: Greeting = "Hello, World!"; // ✅ OK
const greeting2: Greeting = "Hello, TypeScript!"; // ✅ OK
// const invalid: Greeting = "Hi, World!";        // ❌ Error

// Combine with literal unions:
type Color = "red" | "green" | "blue";
type ColorName = `${Color}-color`;
// type ColorName = "red-color" | "green-color" | "blue-color"

const color: ColorName = "red-color"; // ✅ OK
```

### Building Complex Types

```typescript
// API endpoint typing:
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type ApiEndpoint = `/api/${string}`;
type ApiCall = `${HttpMethod} ${ApiEndpoint}`;

const validCall: ApiCall = "GET /api/users"; // ✅ OK
const validCall2: ApiCall = "POST /api/products"; // ✅ OK
// const invalid: ApiCall = "PATCH /api/users";   // ❌ Error

// CSS class naming:
type Size = "sm" | "md" | "lg";
type Variant = "primary" | "secondary" | "danger";
type ButtonClass = `btn-${Size}-${Variant}`;

const btnClass: ButtonClass = "btn-md-primary"; // ✅ OK
```

### String Manipulation with Template Literals

TypeScript provides built-in utilities for string transformation:

```typescript
// Uppercase:
type Uppercase<T extends string> = intrinsic;

type Shout = Uppercase<"hello">; // "HELLO"

// Lowercase:
type Lowercase<T extends string> = intrinsic;

type Whisper = Lowercase<"HELLO">; // "hello"

// Capitalize:
type Capitalize<T extends string> = intrinsic;

type Title = Capitalize<"hello world">; // "Hello world"

// Uncapitalize:
type Uncapitalize<T extends string> = intrinsic;

type Lower = Uncapitalize<"Hello">; // "hello"

// Practical example - event handlers:
type EventName = "click" | "focus" | "blur";
type EventHandler = `on${Capitalize<EventName>}`;
// type EventHandler = "onClick" | "onFocus" | "onBlur"

interface Events {
  onClick: () => void;
  onFocus: () => void;
  onBlur: () => void;
}
```

### Type-Safe Object Keys

```typescript
// Generate getter method names:
interface User {
  name: string;
  age: number;
  email: string;
}

type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type UserGetters = Getters<User>;
// type UserGetters = {
//   getName: () => string;
//   getAge: () => number;
//   getEmail: () => string;
// }

class UserClass implements User, UserGetters {
  constructor(public name: string, public age: number, public email: string) {}

  getName() {
    return this.name;
  }
  getAge() {
    return this.age;
  }
  getEmail() {
    return this.email;
  }
}
```

## Index Access Types

Mengakses tipe dari property:

```typescript
interface User {
  id: number;
  name: string;
  profile: {
    bio: string;
    avatar: string;
  };
}

// Access specific property type:
type UserId = User["id"]; // number
type UserName = User["name"]; // string
type Profile = User["profile"]; // { bio: string; avatar: string; }

// Access nested property:
type Bio = User["profile"]["bio"]; // string

// Access union of properties:
type UserInfo = User["name" | "id"]; // string | number

// Access all property types:
type AllUserTypes = User[keyof User];
// number | string | { bio: string; avatar: string; }
```

## Best Practices

**Use Discriminated Unions** — For state management and variant data.

**Implement Exhaustiveness Checking** — Always handle all cases dengan never type.

**Prefer Type Predicates** — For reusable type guards.

**Template Literals for APIs** — Type-safe string patterns untuk endpoints, CSS classes, etc.

**Keep Types Simple** — Jangan over-engineer, balance between type safety dan readability.

## Ringkasan

**Intersection Types** — Combine multiple types dengan `&`.

**Discriminated Unions** — Tagged unions untuk type-safe branching.

**Type Guards** — Runtime checks yang influence TypeScript's type narrowing.

**Exhaustiveness Checking** — Ensure all union cases handled dengan `never`.

**Mapped Types** — Transform properties dari existing types.

**Conditional Types** — Type logic dengan ternary-like syntax.

**Template Literals** — Type-safe string patterns dan manipulation.

## Latihan Praktik

Buat file `src/advanced-types-practice.ts`:

```typescript
// 1. Buat discriminated union untuk Form State:
//    - { status: "idle" }
//    - { status: "submitting" }
//    - { status: "success"; data: any }
//    - { status: "error"; error: string }
//    Implement function handleFormState dengan exhaustiveness checking

// 2. Buat custom type guard:
//    - isValidEmail(value: unknown): value is string
//    - Check valid email format

// 3. Buat mapped type DeepReadonly<T> yang:
//    - Membuat semua properties (including nested) readonly

// 4. Buat template literal type untuk:
//    - HTTP routes: "/users/:id" | "/products/:id" | "/orders/:id"
//    - Combine dengan HTTP methods

// 5. Buat conditional type ExtractPromise<T>:
//    - Jika T extends Promise<infer U>, return U
//    - Else return T

// Test semua implementation!
```
