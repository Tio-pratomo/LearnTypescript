---
title: Function pada Typescript
---

Sesi 6 fokus ke function di TypeScript:

- cara memberi tipe pada parameter/return,
- membuat parameter optional/default, rest parameter,
- sampai **overload** untuk API yang fleksibel tapi tetap type-safe.

## Materi: Pengetahuan & Konsep

Function adalah “unit” utama untuk membuat kode reusable dan maintainable, dan TypeScript menambah nilai besar lewat pengetikan parameter serta return type agar bug terdeteksi sebelum runtime.

TypeScript mendukung optional parameter (pakai `?`) dan default parameter untuk membuat API yang fleksibel saat pemanggilan function.

Selain itu, TypeScript punya rest parameters (`...args`) untuk menerima jumlah argumen yang tidak terbatas, dan tipe rest parameter selalu berupa array.

## Pola typing function

- **Parameter & return type:** tulis tipe di setiap parameter penting dan pada return type untuk menjaga kontrak function tetap jelas.

- **Optional parameter:** gunakan `param?: T` ketika argumen boleh tidak dikirim, lalu lakukan pengecekan (mis. `typeof param !== "undefined"`) sebelum dipakai.

- **Default parameter:** isi default akan dipakai bila argumen tidak dikirim atau bernilai `undefined`.

- **Function type (variabel berisi function):** TypeScript bisa mendeskripsikan “shape” function melalui signature `(a: A, b: B) => R`.

- **Overload:** kamu bisa mendefinisikan beberapa “overload signatures” di atas 1 implementation untuk membuat kontrak pemanggilan yang lebih presisi.

## Arrow function dan `this`

Arrow function (ES6+) memberi syntax ringkas dan biasanya dipakai untuk callback, dan ia mengambil `this` secara lexical dari scope luar (bukan membuat `this` sendiri).

Karena itu arrow function sering dipilih untuk callback (mis. `setTimeout`, handler), supaya `this` tidak berubah secara tak terduga.

Namun untuk method object/class, tetap pahami perbedaan ini karena function biasa vs arrow bisa memengaruhi binding `this`.

## Praktik

Buat file `src/sesi-6-functions.ts`, lalu isi contoh-contoh ini dan amati error TypeScript saat kamu mengubah pemanggilannya.

```ts
// 1) Parameter & return type
function add(a: number, b: number): number {
  return a + b;
}

// 2) Optional + default parameter
function formatName(first: string, last?: string, title: string = 'Mr/Ms'): string {
  // last? => perlu dicek sebelum dipakai
  const full = last ? `${first} ${last}` : first;
  return `${title}. ${full}`;
}

// 3) Rest parameter
function sumAll(...nums: number[]): number {
  return nums.reduce((acc, n) => acc + n, 0);
}

// 4) Function type
type StringMapper = (input: string) => string;

const upper: StringMapper = (s) => s.toUpperCase();

// 5) Overload signatures + 1 implementation
function toId(value: number): string;
function toId(value: string): string;
function toId(value: number | string): string {
  return typeof value === 'number' ? `id:${value}` : `id:${value.trim()}`;
}

// Coba-coba pemanggilan
console.log(add(1, 2));
console.log(formatName('Alya'));
console.log(formatName('Alya', 'Putri', 'Dr'));
console.log(sumAll(1, 2, 3, 4));
console.log(upper('hello'));
console.log(toId(123));
console.log(toId('  abc  '));
```

**Jalankan:**

```bash
npm run typecheck
npm run build
node dist/sesi-6-functions.js
```

`tsc` akan melakukan type-checking dan emit JavaScript dari file TypeScript kamu.

**Tugas kecil (biar “nempel di kepala”):**

1. Ubah `sumAll(...nums: number[])` menjadi menerima campuran `number | string`, lalu paksa hasilnya tetap `number` (pakai narrowing `typeof`).
2. Buat overload baru untuk `toId(value: { id: number }): string` dan sesuaikan implementasinya supaya tetap aman.
