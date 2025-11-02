# Sesi 2: Tipe Data & Type System Fundamentals

## Pengantar Type System TypeScript

Type system TypeScript memiliki dua cara utama untuk menentukan tipe data variabel:

### Type Inference (Inferensi Tipe)

TypeScript secara otomatis mendeteksi tipe data berdasarkan nilai yang diberikan:

```typescript
let nama = "Sulis"; // TypeScript infer sebagai 'string'
let usia = 30; // TypeScript infer sebagai 'number'
let aktif = true; // TypeScript infer sebagai 'boolean'

// Error jika mencoba mengubah tipe:
// usia = "tiga puluh";    // ❌ Error: Type 'string' is not assignable to type 'number'
```

### Explicit Type Annotation (Anotasi Tipe Eksplisit)

Menentukan tipe data secara manual untuk kontrol yang lebih presisi:

```typescript
let nama: string = "Sulis";
let usia: number = 30;
let aktif: boolean = true;

// Lebih berguna saat deklarasi tanpa inisialisasi:
let alamat: string;
alamat = "Jakarta"; // ✅ Valid
// alamat = 123;           // ❌ Error
```

## Tipe Data Primitif

### 1. String

Tipe untuk data teks:

```typescript
let namaDepan: string = "Budi";
let namaBelakang: string = "Santoso";
let sapaan: string = `Halo, ${namaDepan}!`; // Template literal

// String methods tetap type-safe:
let panjang: number = namaDepan.length;
let upperCase: string = namaDepan.toUpperCase();
```

### 2. Number

Semua angka (integer, float, binary, hex, octal) menggunakan tipe `number`:

```typescript
let desimal: number = 42;
let float: number = 3.14;
let biner: number = 0b1010; // Binary: 10
let hex: number = 0xff; // Hexadecimal: 255
let octal: number = 0o744; // Octal: 484

// Mathematical operations:
let hasil: number = desimal + float;
```

### 3. Boolean

Nilai logika `true` atau `false`:

```typescript
let isActive: boolean = true;
let isCompleted: boolean = false;

// Sering digunakan untuk conditional logic:
if (isActive) {
  console.log("Status aktif");
}
```

### 4. Null dan Undefined

Dua tipe untuk menyatakan "tidak ada nilai":

```typescript
let tidakAda: null = null;
let belumDiisi: undefined = undefined;

// Dengan strictNullChecks: true, null dan undefined tidak bisa assign ke tipe lain:
let nama: string = "Budi";
// nama = null;              // ❌ Error: Type 'null' is not assignable to type 'string'

// Harus explicit:
let namaOpsional: string | null = null; // ✅ Valid
namaOpsional = "Budi"; // ✅ Valid
```

**Best Practice 2025**: Selalu aktifkan `strictNullChecks` untuk mencegah null/undefined bugs!

## Tipe Data Array dan Tuple

### Array

Koleksi data dengan tipe yang sama:

```typescript
// Dua cara penulisan:
let angka: number[] = [1, 2, 3, 4, 5];
let nama: Array<string> = ["Andi", "Budi", "Citra"];

// Array methods tetap type-safe:
angka.push(6); // ✅ Valid
// angka.push("tujuh");       // ❌ Error: Argument of type 'string'...

// Array dengan union types:
let campuran: (number | string)[] = [1, "dua", 3, "empat"];
```

### Tuple

Array dengan panjang tetap dan tipe setiap elemen yang spesifik:

```typescript
// Definisi tuple: [tipe1, tipe2, tipe3]
let koordinat: [number, number] = [10, 20];
let user: [string, number, boolean] = ["Budi", 25, true];

// Akses dengan index:
console.log(user.toUpperCase()); // "BUDI"
console.log(user + 5); // 30

// Error jika urutan atau jumlah tidak sesuai:
// let invalid: [string, number] = [25, "Budi"];  // ❌ Error
// user = ["Andi", 30];                           // ❌ Error: tupple length mismatch
```

**Use Case Tuple**: Return multiple values dari function:

```typescript
function getCoordinates(): [number, number] {
  return [latitude, longitude];
}

const [lat, lng] = getCoordinates(); // Destructuring
```

## Tipe Data Khusus

### 1. Any (⚠️ Hindari!)

Tipe yang menerima **segala jenis** nilai, menonaktifkan type checking:

```typescript
let data: any = "string";
data = 42; // ✅ No error
data = true; // ✅ No error
data.apapun(); // ✅ No compile error (runtime error!)

// ❌ JANGAN GUNAKAN 'any' - menghilangkan manfaat TypeScript!
```

**Mengapa any berbahaya**:

- Menonaktifkan type checking
- Menyebabkan runtime errors yang tidak terdeteksi
- Menghilangkan autocomplete dan refactoring tools

**Best Practice 2025**: Hindari `any` sebisa mungkin!

### 2. Unknown (✅ Gunakan ini, bukan any!)

Tipe yang **type-safe** untuk nilai yang tidak diketahui:

```typescript
let input: unknown = getUserInput(); // Data dari API/user

// ❌ Tidak bisa langsung digunakan:
// input.toUpperCase();  // Error: Object is of type 'unknown'

// ✅ Harus di-check dulu (type narrowing):
if (typeof input === "string") {
  console.log(input.toUpperCase()); // Safe!
}

if (typeof input === "number") {
  console.log(input.toFixed(2));
}
```

**Perbandingan any vs unknown**:

| Aspek            | `any`                      | `unknown`                                |
| ---------------- | -------------------------- | ---------------------------------------- |
| **Type Safety**  | ❌ Tidak ada               | ✅ Enforces checks                       |
| **Operations**   | Semua operasi allowed      | Hanya setelah type narrowing             |
| **Assignment**   | Bisa assign ke/dari apapun | Hanya ke `any`/`unknown`                 |
| **Use Case**     | ❌ Legacy code migration   | ✅ External data (API, JSON, user input) |
| **Runtime Risk** | Tinggi                     | Rendah                                   |

**Best Practice 2025**: Gunakan `unknown` untuk data eksternal, lalu narrow dengan type guards!

### 3. Void

Tipe untuk function yang **tidak mengembalikan nilai**:

```typescript
function log(message: string): void {
  console.log(message);
  // Tidak ada return statement
}

function sayHello(): void {
  console.log("Hello!");
  // return; // ✅ Valid (return tanpa value)
  // return 123; // ❌ Error: Type 'number' is not assignable to type 'void'
}
```

### 4. Never

Tipe untuk nilai yang **tidak akan pernah terjadi**:

```typescript
// Function yang melempar error (tidak pernah return):
function throwError(message: string): never {
  throw new Error(message);
}

// Function dengan infinite loop:
function infiniteLoop(): never {
  while (true) {
    // Tidak pernah berhenti
  }
}
```

**Use Case 1: Exhaustive Type Checking**

```typescript
type Status = "pending" | "approved" | "rejected";

function handleStatus(status: Status): string {
  switch (status) {
    case "pending":
      return "Menunggu persetujuan";
    case "approved":
      return "Disetujui";
    case "rejected":
      return "Ditolak";
    default:
      // Jika ada status baru yang belum dihandle, TypeScript akan error:
      const exhaustiveCheck: never = status;
      throw new Error(`Unhandled status: ${status}`);
  }
}
```

**Use Case 2: Unreachable Code Detection**

```typescript
function processValue(value: string | number) {
  if (typeof value === "string") {
    console.log("String:", value.toUpperCase());
  } else if (typeof value === "number") {
    console.log("Number:", value.toFixed(2));
  } else {
    // Code ini unreachable - TypeScript akan error:
    const unreachable: never = value;
  }
}
```

**Void vs Never**:

| Aspek        | `void`                                   | `never`                           |
| ------------ | ---------------------------------------- | --------------------------------- |
| **Meaning**  | Function completes, tapi no return value | Function tidak pernah complete    |
| **Example**  | `console.log()`                          | `throw Error()`, infinite loop    |
| **Use Case** | Side effects                             | Error handlers, exhaustive checks |

## Union Types

Variabel yang bisa memiliki **salah satu** dari beberapa tipe:

```typescript
let id: number | string;
id = 101; // ✅ Valid
id = "USR-101"; // ✅ Valid
// id = true;      // ❌ Error

// Function dengan union parameter:
function printId(id: number | string): void {
  console.log(`ID: ${id}`);
}

printId(101);
printId("USR-101");

// Type narrowing untuk operasi spesifik:
function processId(id: number | string): void {
  if (typeof id === "string") {
    console.log(id.toUpperCase()); // String method
  } else {
    console.log(id.toFixed(2)); // Number method
  }
}
```

## Literal Types

Tipe yang hanya menerima **nilai spesifik**:

```typescript
// String literal:
let arah: "utara" | "selatan" | "timur" | "barat";
arah = "utara"; // ✅ Valid
// arah = "atas";   // ❌ Error: Type '"atas"' is not assignable to type...

// Number literal:
let dadu: 1 | 2 | 3 | 4 | 5 | 6;
dadu = 3; // ✅ Valid
// dadu = 7;        // ❌ Error

// Boolean literal (jarang digunakan):
let alwaysTrue: true = true;

// Kombinasi dengan union:
type Status = "success" | "error" | "loading";
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

function request(url: string, method: HttpMethod): void {
  console.log(`${method} ${url}`);
}

request("/api/users", "GET"); // ✅ Valid
// request("/api/users", "PATCH"); // ❌ Error
```

## Type Aliases

Memberikan **nama custom** untuk tipe data kompleks:

```typescript
// Alias untuk primitive:
type ID = number | string;
type Username = string;

// Alias untuk object shape:
type User = {
  id: ID;
  username: Username;
  email: string;
  isActive: boolean;
};

// Alias untuk function signature:
type Callback = (message: string) => void;

// Penggunaan:
let currentUser: User = {
  id: 1,
  username: "budi123",
  email: "budi@example.com",
  isActive: true,
};

function processCallback(cb: Callback): void {
  cb("Processing complete!");
}
```

## Enum (Enumerasi)

Kumpulan konstanta yang diberi nama:

```typescript
// Numeric enum (default):
enum Direction {
  Up, // 0
  Down, // 1
  Left, // 2
  Right, // 3
}

let playerDirection: Direction = Direction.Up;
console.log(playerDirection); // 0

// String enum (lebih eksplisit):
enum Status {
  Pending = "PENDING",
  Approved = "APPROVED",
  Rejected = "REJECTED",
}

let orderStatus: Status = Status.Pending;
console.log(orderStatus); // "PENDING"

// Enum dengan custom values:
enum HttpStatus {
  OK = 200,
  Created = 201,
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,
}

function handleResponse(status: HttpStatus): void {
  if (status === HttpStatus.OK) {
    console.log("Success!");
  }
}
```

**Best Practice 2025**: Pertimbangkan menggunakan **union of string literals** daripada enum untuk type safety lebih baik:

```typescript
// Lebih direkomendasikan:
type Status = "pending" | "approved" | "rejected";

// Daripada:
enum Status {
  Pending = "PENDING",
  Approved = "APPROVED",
  Rejected = "REJECTED",
}
```

## Object Types

Mendefinisikan **shape** dari object:

```typescript
// Inline object type:
let user: {
  name: string;
  age: number;
  email: string;
} = {
  name: "Budi",
  age: 25,
  email: "budi@example.com",
};

// Optional properties dengan '?':
let product: {
  id: number;
  name: string;
  description?: string; // Optional
} = {
  id: 1,
  name: "Laptop",
  // description tidak wajib
};

// Readonly properties:
let config: {
  readonly apiKey: string;
  readonly baseUrl: string;
} = {
  apiKey: "abc123",
  baseUrl: "https://api.example.com",
};

// config.apiKey = "xyz";  // ❌ Error: Cannot assign to 'apiKey' because it is a read-only property
```

## Type Assertions (Type Casting)

Memberitahu TypeScript tentang tipe yang lebih spesifik:

```typescript
// Syntax 1: as
let someValue: unknown = "Hello TypeScript";
let strLength: number = (someValue as string).length;

// Syntax 2: angle bracket (tidak bisa digunakan di JSX/TSX)
let strLength2: number = (<string>someValue).length;

// Use case: DOM manipulation
const inputElement = document.getElementById("username") as HTMLInputElement;
inputElement.value = "Budi"; // Safe!

// ⚠️ Hati-hati: Type assertion tidak mengubah runtime value!
let num: any = "123";
let actualNum = num as number;
console.log(actualNum + 5); // "1235" bukan 128! (runtime error)
```

**Best Practice**: Gunakan type guards daripada type assertions jika memungkinkan.

## Ringkasan

**Type Inference vs Explicit**: TypeScript bisa infer tipe otomatis, tapi explicit typing lebih jelas.

**Primitive Types**: `string`, `number`, `boolean`, `null`, `undefined`.

**Special Types**: Hindari `any`, gunakan `unknown` untuk external data, `void` untuk no-return functions, `never` untuk impossible values.

**Array & Tuple**: Array untuk homogenous data, tuple untuk fixed-length heterogenous data.

**Union & Literal**: Union untuk multiple possible types, literal untuk specific values only.

**Type Aliases**: Beri nama custom untuk tipe kompleks.

## Latihan Praktik

Buat file `src/types-practice.ts`:

```typescript
// 1. Buat type alias untuk User dengan properties:
// - id (number atau string)
// - username (string)
// - email (string)
// - age (number)
// - isActive (boolean)
// - role (hanya bisa "admin", "user", atau "guest")

// 2. Buat function processUser yang:
// - Menerima parameter user dengan type User
// - Return string dengan format: "User [username] is [age] years old and has role [role]"

// 3. Buat function parseInput yang:
// - Menerima parameter input dengan type unknown
// - Check tipe input, jika string return uppercase, jika number return squared
// - Jika tipe lain, throw error

// 4. Buat enum untuk Priority (Low, Medium, High, Critical)
// Dan function yang menerima priority dan return message

// Test semua function yang dibuat!
```
