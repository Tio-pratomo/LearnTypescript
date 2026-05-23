---
title: TypeScript Generic
---

Sesi kali ini, kamu akan belajar **Generics** agar bisa membuat function/type yang reusable untuk banyak tipe data, tanpa jatuh ke `any`.

## Apa itu generics

Bayangkan Anda punya cetakan kue berbentuk bintang. Dengan cetakan itu, Anda bisa membuat kue dari adonan apa saja: cokelat, vanila, stroberi, dll.

Hasilnya tetap berbentuk bintang (strukturnya sama), tapi rasanya berbeda tergantung adonan yang Anda masukkan.

Generics dalam pemrograman itu seperti cetakan kue:

- Anda tulis satu fungsi/class (satu cetakan)
- Fungsi itu bisa bekerja dengan tipe data apa pun (adonan apa pun)
- Tapi hubungan antar tipe tetap terjaga (bentuknya tetap bintang)

Misal Anda butuh fungsi menggabungkan dua benda.

- Jika benda itu angka (2 dan 3) → hasilnya 23 (penggabungan string) atau 5 (penjumlahan)? Tergantung aturan.
- Jika benda itu teks ("Halo" dan "Dunia") → hasilnya "HaloDunia".
- Jika benda itu kotak (Kotak A dan Kotak B) → hasilnya Kotak gabungan.

Tanpa generics: Anda harus buat fungsi terpisah untuk angka, teks, kotak, dll.

Dengan generics: Anda buat satu fungsi yang bisa menerima benda apa pun, asalkan tipe benda pertama sama dengan tipe benda kedua. Hasilnya juga sama tipenya.

Jadi, **Generics adalah teknik membuat kode yang fleksibel (bisa dipakai untuk berbagai tipe data) tetapi tetap aman (tipe data yang keluar sudah dipastikan cocok dengan yang masuk).**

---

### 1. Generic di Function

```typescript
// Definisi
function namaFungsi<T>(parameter: T): T {
  // kode
  return parameter;
}

// Contoh
function identitas<T>(nilai: T): T {
  return nilai;
}

// Pemanggilan
identitas<string>('Halo'); // eksplisit <string>
identitas(123); // otomatis T = number
```

**Bentuk arrow function:**

```typescript
const identitas = <T>(nilai: T): T => nilai;
```

---

### 2. Generic di Class

```typescript
// Definisi
class NamaKelas<T> {
  properti: T;
  constructor(properti: T) {
    this.properti = properti;
  }
  metode(): T {
    return this.properti;
  }
}

// Contoh
class Kotak<T> {
  isi: T;
  constructor(isi: T) {
    this.isi = isi;
  }
  ambil(): T {
    return this.isi;
  }
}

// Pemakaian
const kotakAngka = new Kotak<number>(100);
const kotakString = new Kotak<string>('Buku');
console.log(kotakAngka.ambil()); // 100 (number)
```

---

### 3. Generic di Interface

```typescript
// Definisi
interface NamaInterface<T> {
  properti: T;
  metode(nilai: T): T;
}

// Contoh
interface Pasangan<K, V> {
  kunci: K;
  nilai: V;
}

// Pemakaian
const data: Pasangan<string, number> = {
  kunci: 'usia',
  nilai: 25,
};
```

---

### 4. Generic di Type Alias

```typescript
// Definisi
type NamaAlias<T> = {
  properti: T;
  array: T[];
};

// Contoh
type Hasil<T> = {
  sukses: boolean;
  data?: T;
  error?: string;
};

// Pemakaian
const response: Hasil<string[]> = {
  sukses: true,
  data: ['a', 'b', 'c'],
};
```

---

### 5. Multiple Generic Parameters

Bisa pakai lebih dari satu parameter, dipisah koma:

```typescript
function pasangkan<T, U>(pertama: T, kedua: U): [T, U] {
  return [pertama, kedua];
}

const hasil = pasangkan<string, number>('umur', 17);
// hasil: ["umur", 17]
```

---

### 6. Memberi Batasan (Constraint) pada Generic

Agar generic hanya bisa berupa tipe tertentu (misal harus memiliki properti `length`):

```typescript
function panjang<T extends { length: number }>(item: T): number {
  return item.length;
}

panjang('hello'); // ✅ string punya length
panjang([1, 2, 3]); // ✅ array punya length
// panjang(123);     // ❌ error, number tidak punya length
```

---

### Ringkasan Pola Umum

| Tempat     | Sintaks Definisi         | Contoh Pemanggilan               |
| ---------- | ------------------------ | -------------------------------- |
| Function   | `fn<T>(arg: T): T`       | `fn<string>("x")` atau `fn("x")` |
| Class      | `class C<T> { ... }`     | `new C<number>(5)`               |
| Interface  | `interface I<T> { ... }` | `const obj: I<string> = {...}`   |
| Type Alias | `type A<T> = { ... }`    | `const x: A<boolean> = {...}`    |

**Ingat:** Nama generic (`T`, `U`, dll) bebas, tapi konvensi pakai satu huruf kapital. Gunakan `<>` saat mendefinisikan, bisa tidak pakai `<>` saat memanggil jika TypeScript bisa menebak sendiri.

## Generic function + inference

Generic function biasanya ditulis dengan `<T>` lalu `T` dipakai di parameter dan return type agar TypeScript bisa menginfer tipe secara otomatis saat function dipanggil.

Kalau `T` hanya muncul sekali di signature, biasanya generics tidak memberi nilai tambah (lebih baik langsung tulis tipenya), ini sering disebut aturan praktis agar generics tidak berlebihan. Contohnya :

```ts
function acak<T>(angka: number): T {
  // bahaya, karena T bisa apa saja, tapi kita tidak punya hubungan dengan input
}
```

Mari kita lihat efeknya saat dipanggil oleh developer lain:

1. **`acak<number>(5)`**

- _Ekspektasi:_ Mengembalikan angka.
- _Kenyataan:_ Aman secara tipe data, tapi fungsi generik ini jadi mubazir karena dari awal inputnya sudah angka.

2. **`acak<string>(5)`**

- _Ekspektasi:_ Mengembalikan teks (`string`).
- _Kenyataan:_ **Kacau.** TypeScript percaya fungsi ini menghasilkan teks. Padahal di dalam fungsinya, kamu tidak punya kode untuk mengubah angka `5` menjadi kata `"lima"`. Saat aplikasi dijalankan (_runtime_), aplikasi bisa _crash_ karena tipe data aslinya bohong.

Artinya, **Tipe data `T` tidak ada hubungannya sama sekali dengan input `angka`**. Itu yang dimaksud dengan _"T ini unconstrained (tanpa batasan / bisa apa saja) dan tidak punya hubungan dengan input"_.

FYI, **Signature** adalah bagian dari kode yang mendeklarasikan nama fungsi, parameter apa saja yang diterima, dan tipe data apa yang dikembalikan.

Bayangkan seperti **identitas sebuah fungsi**. Saat Anda melihat signature, Anda langsung tahu:

- Namanya apa
- Butuh masukan (parameter) apa saja, dengan tipe data apa
- Keluarannya (return value) bertipe apa

Kenapa disebut "signature"?

Karena seperti tanda tangan seseorang yang unik, signature fungsi juga membedakan fungsi satu dengan yang lain, meskipun nama fungsinya sama tapi parameter/return beda, maka signature-nya berbeda.

## Constraints dan `keyof`

Generic constraints membatasi tipe yang boleh dipakai untuk `T` menggunakan `extends`, misalnya `T extends { length: number }` agar properti tertentu aman diakses.

Ketika kita menggunakan generic `T extends { length: number }` kita membatasi, supaya tipe T hanya boleh berupa objek yang memiliki properti length, bertipe number. Contoh:

```ts
function getLength<T extends { length: number }>(item: T): number {
  return item.length; // aman, karena T pasti punya length
}
```

Contoh pemanggilan:

```ts
getLength('hello'); // ✅ string punya length
getLength([1, 2, 3]); // ✅ array punya length
getLength({ length: 10 }); // ✅ objek dengan length
getLength(123); // ❌ error, number tidak punya length
```

Jika tidak ada constraint, TypeScript tidak tahu apakah T punya properti length, sehingga akses item.length akan error.

Pola penting lain adalah `Key extends keyof Type` untuk memastikan parameter `key` hanya boleh salah satu properti dari object yang diberikan, sehingga akses `obj[key]` tetap aman.

Pola ini memastikan bahwa Key, hanya bisa berupa salah satu properti dari tipe Type. Contoh:

```ts
function getValue<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]; // aman, karena key pasti valid
}
```

Contoh pemanggilan:

```ts
const person = { name: 'Budi', age: 20 };
getValue(person, 'name'); // ✅
getValue(person, 'age'); // ✅
getValue(person, 'address'); // ❌ error, 'address' bukan key dari person
```

Di sini:

- `keyof T` menghasilkan union type dari semua key yang ada di T (dalam contoh: "name" | "age").
- `K extends keyof T` membatasi K agar hanya bisa salah satu key tersebut.
- Return `type T[K]` otomatis mengetahui tipe dari properti tersebut (string untuk name, number untuk age).

Jadi intinya:

- T extends SomeType → membatasi tipe generic agar mengikuti struktur tertentu.
- K extends keyof T → membatasi key agar hanya properti yang ada di objek tersebut, sehingga akses `obj[key]` aman dan type-safe.

## Default generic parameter

Generic parameter boleh punya default type seperti `<T = DefaultType>` supaya pemakaian lebih ergonomis ketika pemanggil tidak memberikan type argument.

**Aturannya:** type parameter yang punya default dianggap opsional, default harus memenuhi constraint jika ada, dan parameter wajib tidak boleh diletakkan setelah yang opsional.

## Praktik

Buat file `src/sesi-9-generics.ts` dan isi kode ini.

```ts
// 1) Generic function paling dasar: input menentukan output
function identity<T>(value: T): T {
  return value;
}

const n = identity(123); // inferred T = number
const s = identity('hello'); // inferred T = string

// 2) Generic + constraint: hanya tipe yang punya length
function loggingIdentity<T extends { length: number }>(arg: T): T {
  console.log(arg.length);
  return arg;
}

loggingIdentity('abc');
loggingIdentity([1, 2, 3]);

// 3) Generic + keyof constraint: key harus valid
function getProperty<Type, Key extends keyof Type>(obj: Type, key: Key) {
  return obj[key];
}

const user = { id: 'u1', name: 'Alya', age: 20 };

const userName = getProperty(user, 'name');
// const wrong = getProperty(user, "email"); // ERROR (key tidak valid)

// 4) Generic type alias + default generic parameter
type ApiResponse<TData = unknown> =
  | { ok: true; data: TData }
  | { ok: false; error: { message: string } };

const ok1: ApiResponse<{ id: string }> = { ok: true, data: { id: 'x' } };
const ok2: ApiResponse = { ok: true, data: { anything: 123 } }; // TData default = unknown
```

Jalankan:

```bash
npm run typecheck
npm run build
node dist/sesi-9-generics.js
```

`tsc` akan memastikan hubungan tipe pada generics (mis. `getProperty`) tervalidasi sebelum runtime.

Tugas kecil:

1. Buat `function wrap<T>(value: T): { value: T }` lalu pastikan `T` terinfer tanpa menulis `<T>` saat pemanggilan.
2. Ubah `ApiResponse<TData = unknown>` menjadi punya constraint `TData extends object = Record<string, unknown>` dan lihat perbedaan error ketika `TData` bukan object.
