---
title: Object Types dan Interface
---

Sesi 7 membahas cara TypeScript mendeskripsikan “bentuk” object dengan **object types** dan `interface`, termasuk optional/readonly property, extend, index signature, dan “excess property checks”.

## Materi: Object types dan interface

Di TypeScript, data paling sering dibawa lewat object, dan TypeScript merepresentasikannya sebagai _object types_ (bisa anonymous inline, bisa dinamai).

Object type bisa dinamai dengan `interface` atau `type alias`, dan keduanya bisa dipakai untuk kontrak parameter function (misalnya `greet(person: Person)`).

Type checking di TypeScript berfokus pada “shape” (structural typing), jadi object dianggap cocok jika minimal punya properti yang dibutuhkan dengan tipe yang benar.

## Materi: Property modifiers

Properti bisa dibuat optional dengan tanda `?`, artinya properti boleh tidak ada, tetapi kalau ada harus sesuai tipe.

Dengan `strictNullChecks`, membaca optional property akan menghasilkan tipe `T | undefined`, jadi biasanya perlu default value atau pengecekan `undefined`.

Properti bisa dibuat `readonly` untuk mencegah penulisan ulang saat type-checking, dan bedanya dengan `const` adalah `const` untuk variabel sedangkan `readonly` untuk properti.

## Materi: Excess property checks dan index signature

Object literal yang langsung dipassing/di-assign ke target type akan melewati _excess property checking_ sehingga properti “typo” atau ekstra yang tidak dikenal akan dianggap sebagai bug.

Jika memang object boleh punya properti tambahan (misalnya option bag extensible), kamu bisa menambahkan index signature seperti `[key: string]: unknown` (atau tipe yang lebih ketat) agar tambahan key diizinkan.

Cara “mengakali” excess property checks dengan type assertion itu ada, tetapi untuk opsi/kontrak publik biasanya lebih aman memperbaiki type declaration agar sesuai kebutuhan.

## Praktik

Buat file `src/sesi-6-objects-interfaces.ts` lalu isi ini.

```ts
// 1) Interface dasar + optional + readonly
interface User {
  readonly id: string;
  name: string;
  email?: string; // optional
}

function printUser(u: User): void {
  // email bisa undefined, jadi perlu fallback
  const email = u.email ?? '(no-email)';
  console.log(`${u.id} ${u.name} ${email}`);
}

const user1: User = { id: 'u-1', name: 'Alya' };
printUser(user1);

// user1.id = "u-99"; // ERROR: readonly

// 2) Extending interface (reuse kontrak)
interface Admin extends User {
  role: 'admin';
  permissions: string[];
}

const admin1: Admin = {
  id: 'a-1',
  name: 'Bima',
  role: 'admin',
  permissions: ['users:read', 'users:write'],
};

// 3) Excess property checks (sengaja buat error)
function updateUser(u: User) {
  return u;
}

// updateUser({ id: "u-2", name: "Caca", emial: "c@x.com" });
//            ^ ERROR: typo "emial" harusnya "email"

// 4) Index signature untuk object “dictionary”
interface FeatureFlags {
  [flagName: string]: boolean;
}

const flags: FeatureFlags = {
  newCheckout: true,
  betaProfile: false,
};

console.log(flags['newCheckout']);
```

Jalankan:

```bash
npm run typecheck
npm run build
```

Ini akan memastikan kontrak object kamu dicek oleh TypeScript sebelum jadi JavaScript.

Tugas kecil:

1. Tambahkan `interface Guest extends User` yang hanya boleh punya `role: "guest"` dan tidak boleh punya `permissions`.
2. Ubah `FeatureFlags` agar key yang valid wajib diawali `ff_` (nanti akan dipakai lagi saat sesi advanced types).

Kalau sudah, kirim error (jika ada) dari baris “typo email” dan jelaskan kenapa TypeScript menolaknya menurut pemahaman kamu.
