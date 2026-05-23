---
title: Conditional Types dan Mapped Types
---

Sesi ini fokus pada **type transformations**: mengubah tipe yang sudah ada menjadi tipe baru. Kita akan belajar dua konsep penting: **Conditional Types** dan **Mapped Types**.

## Conditional Types

Conditional type bentuk seperti **ternary operator**, namun dipakai di dunia tipe. Bentuknya:

```typescript
SomeType extends OtherType ? TrueType : FalseType
```

Artinya: "Jika SomeType bisa menjadi OtherType, hasilnya adalah TrueType, sebaliknya FalseType".

### Kenapa Penting?

Biasanya kita pakai conditional types bersama **generics** untuk membuat logika tipe yang fleksibel.

Contoh sederhana:

```typescript
// Jika T adalah array, ambil tipe elemennya
// Jika bukan array, kembalikan T itu sendiri
type Elem<T> = T extends Array<infer Item> ? Item : T;

type A = Elem<string[]>; // string
type B = Elem<number>; // number
```

### Kata Kunci `infer`

**infer** digunakan untuk "menangkap" atau "mengambil" sebagian tipe. Pada contoh di atas, kita menangkap `Item` dari array.

### Distributive Conditional Types

Kalau inputnya **union**, conditional type akan otomatis dijalankan untuk setiap anggota union:

```typescript
type NonNullable2<T> = T extends null | undefined ? never : T;

type C = NonNullable2<string | null | number | undefined>;
// Hasilnya: string | number (null dan undefined ilang)
```

## Mapped Types

Mapped type adalah cara untuk **mengiterasi** semua property suatu object dan membuat object baru.

### Contoh Dasar

```typescript
// Buat semua property jadi optional
type Optionalize<T> = { [K in keyof T]?: T[K] };

type User = { id: string; name: string; age: number };
type UserPatch = Optionalize<User>;
// { id?: string; name?: string; age?: number }
```

Penjelasan:

- `keyof T` = semua nama property dari T
- `[K in keyof T]` = untuk setiap property
- `T[K]` = ambil tipe value property itu

### Mengubah Modifier

Kita bisa tambah atau hapus modifier seperti `readonly` dan `?`:

```typescript
// Hapus readonly
type Mutable<T> = { -readonly [K in keyof T]: T[K] };

// Hapus optional (?)
type Required2<T> = { [K in keyof T]-?: T[K] };
```

### Key Remapping (TypeScript 4.1+)

Kita bisa ganti nama property pakai `as`:

```typescript
// Ubah "id" jadi "getId", "name" jadi "getName", dst
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type UserGetters = Getters<User>;
// { getId: () => string; getName: () => string; getAge: () => number }
```

Kita juga bisa filter property:

```typescript
// Hapus property "kind"
type RemoveKind<T> = {
  [K in keyof T as Exclude<K, 'kind'>]: T[K];
};
```

## Kombinasi Conditional + Mapped Types

Utility types seperti `Partial`, `Required`, `Pick`, `Omit` dibangun dari kombinasi ini. Pemahaman kita akan memudahkan kita memahami utility types di sesi berikutnya.

## Praktik

Buat file `src/sesi-10-conditional-mapped.ts` lalu isi kode berikut:

### 1. Conditional type: ambil element type array

```typescript wrap
// 1) Conditional type: ambil element type array
type Elem<T> = T extends Array<infer Item> ? Item : T;

interface User {
  id: number;
  name: string;
}

// Fungsi tiruan untuk simulasi memproses respons API
function prosesResponsAPI<T>(data: T): Elem<T> {
  if (Array.isArray(data)) {
    return data[0];
  }
  return data as Elem<T>;
}

// === CARA PENGGUNAAN ===

const dataArrayDariAPI: User[] = [
  { id: 1, name: 'Alex' },
  { id: 2, name: 'John' },
];
const dataSingleDariAPI: User = { id: 3, name: 'Doe' };

const user1 = prosesResponsAPI(dataArrayDariAPI); // Tipenya otomatis: User
const user2 = prosesResponsAPI(dataSingleDariAPI); // Tipenya otomatis: User

console.log(user1.name); // Aman, autocomplete jalan karena tipenya 'User'
```

### 2. Distributive conditional: filter null/undefined

```typescript wrap
// Utility type untuk menghapus null/undefined
type NonNullable2<T> = T extends null | undefined ? never : T;

// Contoh penggunaan di real-world project

// 1. API Response Type
interface ApiResponse {
  data: string | null;
  error: string | undefined;
  status: number;
}

// Pastikan hasil API tidak mengandung null/undefined
type CleanApiResponse = NonNullable2<ApiResponse>;
// Hasil: { data: string; error: string; status: number }

// 2. Function yang memerlukan parameter non-null
function processUserData(user: NonNullable2<{ name: string | null; age: number | undefined }>) {
  console.log(`Name: ${user.name}, Age: ${user.age}`);
}

// 3. Array filtering dengan type guard
const results = [
  { id: 1, value: 'valid' as string | null },
  { id: 2, value: null as string | null },
  { id: 3, value: 'also valid' as string | null },
];

const validResults: NonNullable2<typeof results>[number][] = results
  .filter((item) => item.value !== null)
  .map((item) => ({ id: item.id, value: item.value! }));

// 4. Configuration object yang aman
type Config = {
  apiKey: string | null | undefined;
  timeout: number | null;
};

function initializeApp(config: NonNullable2<Config>) {
  // config.apiKey dan config.timeout sudah dipastikan tidak null/undefined
  console.log(`API Key: ${config.apiKey}`);
  console.log(`Timeout: ${config.timeout}ms`);
}
```

`NonNullable2` berguna untuk memastikan tipe data bersih di lingkungan production.

### 3. Mapped type: buat semua property optional

```ts wrap
// 1. Blueprint Mapped Type yang kamu buat
type Optionalize<T> = { [K in keyof T]?: T[K] };

// 2. Tipe data User asli (Semua field WAJIB diisi saat pertama kali dibuat)
type User = {
  id: string;
  name: string;
  age: number;
};

// 3. Tipe data untuk Update (Semua field otomatis jadi OPSIONAL/boleh kosong)
type UserPatch = Optionalize<User>;
// Hasilnya di background: { id?: string; name?: string; age?: number }

// ==========================================
// SIMULASI IMPLEMENTASI DI DUNIA NYATA
// ==========================================

// Anggap ini adalah database lokal kita
let databaseUser: User = {
  id: 'USR-101',
  name: 'Budi Santoso',
  age: 20,
};

/**
 * Fungsi untuk memperbarui data user.
 * @param dataBaru - Data yang mau diubah. Tipenya 'UserPatch' karena user boleh cuma kirim nama atau umur saja.
 */
function updateProfilUser(dataBaru: UserPatch): void {
  // Kita gabungkan data lama yang ada di database dengan data baru yang dikirim user
  databaseUser = {
    ...databaseUser, // Data lama (id: "USR-101", name: "Budi Santoso", age: 20)
    ...dataBaru, // Data baru yang menimpa data lama
  };

  console.log('Data di database berhasil diperbarui menjadi:', databaseUser);
}

// === CARA PENGGUNAAN (RUNTIME) ===

// Kasus 1: User HANYA ingin mengubah umur menjadi 21
updateProfilUser({ age: 21 });
// Output: { id: "USR-101", name: "Budi Santoso", age: 21 }

// Kasus 2: User HANYA ingin mengubah nama
updateProfilUser({ name: 'Budi Perkasa' });
// Output: { id: "USR-101", name: "Budi Perkasa", age: 21 }

// Kasus 3: User mengirim object kosong (tidak ada yang diubah)
updateProfilUser({}); // Tetap aman dan tidak error karena semua field opsional

// Kasus Eksperimen (Error yang disengaja untuk proteksi):
// updateProfilUser({ alamat: "Jakarta" });
// ERROR! TypeScript langsung protes karena properti 'alamat' tidak ada di tipe 'User'.
```

### 4. Mapped type modifiers: hapus readonly dan optional

Bayangkan Anda mengambil data konfigurasi aplikasi dari sebuah file atau API eksternal yang sifatnya _read-only_ (terkunci, tidak boleh diubah). Tapi, di dalam kode backend, Anda perlu memodifikasi data tersebut (misalnya menambahkan prefiks atau mengubah isinya) sebelum diproses lebih lanjut.

Di sinilah `Mutable` digunakan untuk "membuka gembok" properti tersebut.

```ts wrap
type Mutable<T> = { -readonly [K in keyof T]: T[K] };
type Required2<T> = { [K in keyof T]-?: T[K] };

type Locked = { readonly id: string; name?: string };

type Unlocked = Mutable<Locked>; // id tidak lagi readonly, name tetap opsional
type LockedFull = Required2<Locked>; // id tetap readonly, name wajib diisi

// === IMPLEMENTASI MUTABLE ===

const configAplikasi: Locked = {
  id: 'APP_99',
  name: 'Server Utama',
};

// baris di bawah ini akan ERROR jika dipaksa jalan:
// configAplikasi.id = "APP_100"; // Error: Cannot assign to 'id' because it is a read-only property.

/**
 * Fungsi tiruan untuk memperbarui konfigurasi secara dinamis di memori
 */
function ubahConfig(configLama: Locked): Unlocked {
  // Kita salin datanya ke objek baru, lalu kita cast (ubah tipenya) menjadi Unlocked
  const configBaru = { ...configLama } as Unlocked;

  // Sekarang kita BEBAS mengubah nilai 'id' karena tipenya sudah menjadi Unlocked (-readonly)
  configBaru.id = 'APP_NEW_VERSION';
  configBaru.name = 'Server Produksi';

  return configBaru;
}

const hasilConfig = ubahConfig(configAplikasi);
console.log(hasilConfig.id); // Output: "APP_NEW_VERSION"

/**
 Bayangkan Anda membuat sebuah form profil. Di form tersebut, input `name` sifatnya opsional (boleh kosong). 
 
 Namun, saat data tersebut mau disimpan ke dalam database, sistem mewajibkan semua data harus lengkap dan terisi, tidak boleh ada yang kosong (`undefined`).
 */

// Anggap data ini datang dari input form yang belum lengkap (name tidak diisi)
const inputFormSatu: Locked = { id: 'USR-01' };
const inputFormDua: Locked = { id: 'USR-02', name: 'Rian' };

/**
 * Fungsi untuk menyimpan data ke database.
 * Fungsi ini MENUNTUT objek yang masuk harus lengkap (Required2)
 */
function simpanKeDatabase(data: LockedFull) {
  // Karena tipenya 'LockedFull', TypeScript menjamin 'data.name' PASTI ada (string), bukan undefined.
  console.log(`Menyimpan user dengan ID: ${data.id} dan Nama: ${data.name.toUpperCase()}`);
}

// === CARA PENGGUNAAN ===

// 1. Ini akan ERROR jika langsung dimasukkan ke fungsi simpan:
// simpanKeDatabase(inputFormSatu);
// Error: Property 'name' is missing in type 'Locked' but required in type 'Required2<Locked>'.

// 2. Ini AMAN karena datanya kebetulan lengkap:
simpanKeDatabase(inputFormDua as LockedFull);

// 3. Cara penanganan yang benar di dunia nyata:
function prosesForm(input: Locked) {
  if (!input.name) {
    // Beri nilai default jika user tidak mengisi nama, agar memenuhi syarat 'Required2'
    input.name = 'Anonymous';
  }

  // Setelah dipastikan 'name' tidak kosong, aman untuk di-cast menjadi LockedFull
  simpanKeDatabase(input as LockedFull);
}

prosesForm(inputFormSatu); // Aman, otomatis tersimpan dengan nama "Anonymous"
```

### 5. Key remapping: buat getter dari object

```typescript wrap
// 1. Blueprint Utility
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

// 2. Data Master (User)
type User = {
  id: string;
  name: string;
  age: number;
};

// Hasil dari Getters<User> adalah tipe data objek yang isinya fungsi:
// { getId: () => string; getName: () => string; getAge: () => number; }
type UserGetters = Getters<User>;

// ==========================================
// SIMULASI IMPLEMENTASI DI DUNIA NYATA
// ==========================================

/**
 * Fungsi untuk otomatis membuat fungsi 'getter' dari objek biasa.
 * Kita menggunakan JavaScript ES6 Proxy / Object Methods untuk membuat kodenya dinamis.
 */
function buatGetterOtomatis<T extends object>(objekData: T): Getters<T> {
  const hasilGetter: any = {};

  // Kita looping semua properti (key) dari objek asli di runtime JavaScript
  for (const key of Object.keys(objekData)) {
    // Mengubah nama dari 'name' menjadi 'getName'
    const namaGetter = `get${key.charAt(0).toUpperCase()}${key.slice(1)}`;

    // Kita buatkan fungsinya secara dinamis
    hasilGetter[namaGetter] = () => {
      return (objekData as any)[key];
    };
  }

  // Kita paksa kembalikan sebagai tipe 'Getters<T>' agar TypeScript melacaknya dengan benar
  return hasilGetter as Getters<T>;
}

// === CARA PENGGUNAAN ===

// Data mentah dari database/API
const dataBudi: User = {
  id: 'USR-007',
  name: 'Budi',
  age: 25,
};

// Kita bungkus data mentah tadi lewat fungsi generator kita
const userStore: UserGetters = buatGetterOtomatis(dataBudi);

// SEKARANG, fungsi getter Anda bisa langsung dipanggil!
const idUser = userStore.getId(); // Otomatis bertipe: string
const namaUser = userStore.getName(); // Otomatis bertipe: string
const umurUser = userStore.getAge(); // Otomatis bertipe: number

console.log(idUser); // Output: "USR-007"
console.log(namaUser); // Output: "Budi"
console.log(umurUser); // Output: 25

// KEUNTUNGAN DI EDITOR (VS CODE):
// Saat Anda mengetik `userStore.`, VS Code akan langsung memunculkan autocomplete
// pilihan: `getId()`, `getName()`, dan `getAge()`. Sangat aman dari typo!
```

Kenapa Teknik Ini Sangat Powerfull?

Bayangkan jika besok bos Anda minta menambahkan 10 properti baru di tipe User (seperti email, address, phoneNumber, dll).

Tanpa kode di atas, Anda harus menulis fungsi getEmail(), getAddress() satu per satu secara manual sebanyak 10 kali di file TypeScript Anda.

Dengan kombinasi `Getters<T>` di TypeScript dan fungsi looping di JavaScript tersebut, 10 fungsi getter baru akan tercipta secara otomatis tanpa Anda perlu menulis kode tambahan sedikit pun.

### 6. Filter key via never: hapus property "kind"

`RemoveKind<T>` adalah utility type TypeScript yang menghilangkan properti `'kind'` dari sebuah tipe.

```typescript
type RemoveKind<T> = {
  [K in keyof T as Exclude<K, 'kind'>]: T[K];
};

type Circle = { kind: 'circle'; radius: number };
type Square = { kind: 'square'; side: number };

// Kita buat Union Type yang utuh
type Shape = Circle | Square;

// TypeScript otomatis mendistribusikan RemoveKind ke semua anggota Union!
type ShapeClean = RemoveKind<Shape>;
// Hasilnya otomatis menjadi: { radius: number } | { side: number }

/**
 * Fungsi getArea yang menerima data "bersih" tanpa metadata 'kind'
 */
function getArea(shape: ShapeClean): number {
  // Karena 'kind' sudah tidak ada, kita gunakan operator 'in' untuk deteksi fitur objeknya
  if ('radius' in shape) {
    return Math.PI * shape.radius ** 2; // Otomatis tahu ini eks-Circle
  }

  return shape.side ** 2; // Otomatis tahu ini eks-Square
}
```

**Kenapa Pola RemoveKind Ini Sangat Berguna di Backend/API?**

Untuk melengkapi contoh dunia nyata Anda, pola RemoveKind (atau versi umumnya `Omit<T, 'kind'>`) sangat sering dipakai saat kita ingin memisahkan data yang disimpan di Database dengan data yang dikirim ke Client/Frontend.

Contoh Skenario: Payload API Modul Logistik

```ts wrap
type Ekspedisi = {
  kind: 'pengiriman'; // Metadata internal backend / DB
  resi: string;
  ongkir: number;
  status: string;
};

// Frontend tidak butuh field 'kind', mereka cuma butuh data resi dan ongkir
type EkspedisiResponseForm = RemoveKind<Ekspedisi>;

function kirimDataKeFrontend(data: Ekspedisi) {
  // Kita buang properti 'kind' sebelum dikirim lewat API
  const { kind, ...dataBersih } = data;

  // dataBersih di bawah ini tipenya otomatis menjadi EkspedisiResponseForm
  return dataBersih;
}
```

Jalankan perintah berikut untuk memastikan semua kode benar:

```bash
npm run typecheck
```

### Tugas

1. Buat `type FunctionKeys<T>` yang menghasilkan union key yang value-nya function
2. Buat `type DeepReadonly<T>` untuk object 1 level, lalu terapkan ke `User`

Jawaban:

```typescript
// 1) FunctionKeys: ambil key yang value-nya function
type FunctionKeys<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];

// 2) DeepReadonly: buat semua property readonly
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K];
};

type ReadonlyUser = DeepReadonly<User>;
```

Kirim isi file `src/sesi-10-conditional-mapped.ts` versi kamu, lalu lanjut sesi 11 (utility types).
