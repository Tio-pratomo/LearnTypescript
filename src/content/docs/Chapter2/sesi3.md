---
title: Utility Types
---

Sesi 11 akan membekali kamu dengan Utility Types yang paling sering dipakai di proyek TypeScript sehari-hari. Fokusnya: bikin tipe turunan tanpa nulis ulang kontrak data.

## Materi

Utility Types adalah “alat bawaan” TypeScript untuk mentransformasi tipe, misalnya membuat semua properti opsional, memilih sebagian properti, atau membentuk union baru dari union lama.

Beberapa utility types utama yang perlu kamu kuasai dulu (urut dari yang paling sering dipakai) adalah berikut.

- **`Partial<T>`:** mengubah semua properti `T` menjadi optional, cocok untuk payload update/patch.
- **`Required<T>`:** membuat semua properti menjadi wajib, biasanya dipakai setelah validasi.
- **`Readonly<T>`:** membuat semua properti menjadi readonly (immutable secara type-checking).
- **`Pick<T, K>`:** mengambil sebagian properti dari `T` berdasarkan key `K`.
- **`Omit<T, K>`:** kebalikan `Pick`, membuang properti tertentu dari `T`.
- **`Record<K, T>`:** membuat “dictionary object” dengan key `K` dan value `T`.
- **`Exclude<Union, ExcludedMembers>`:** membuang anggota tertentu dari sebuah union.
- **`Extract<Union, Members>`:** mengambil anggota tertentu dari sebuah union.
- **`NonNullable<T>`:** menghapus `null | undefined` dari tipe.
- **`Parameters<F>` dan `ReturnType<F>`:** mengambil tipe parameter dan return dari function type.
- **`Awaited<T>`:** mengambil tipe hasil resolve dari Promise (berguna saat berurusan dengan async).

## Praktik

1. Buat file `src/sesi-11-utility-types.ts`, lalu tulis kontrak data “inti” (anggap ini model yang dipakai internal service).

```ts
type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
};
```

2. Turunkan tipe untuk kebutuhan API (DTO) tanpa nulis ulang.

```ts
// Response API: jangan pernah expose passwordHash
type UserPublic = Omit<User, 'passwordHash'>;

// Create payload: biasanya belum punya id/timestamps
type CreateUserBody = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

// Update payload: patch, jadi opsional semua
type UpdateUserBody = Partial<CreateUserBody>;
```

3. Latihan `Pick`, `Record`, dan union helpers untuk kasus nyata.

```ts
type UserListItem = Pick<User, 'id' | 'name' | 'email'>;

type Role = 'admin' | 'user' | 'guest';
type RolePermissions = Record<Role, readonly string[]>;

const permissions: RolePermissions = {
  admin: ['users:read', 'users:write'],
  user: ['profile:read'],
  guest: [],
} as const;

type RoleNonGuest = Exclude<Role, 'guest'>; // "admin" | "user"
type OnlyGuest = Extract<Role, 'guest'>; // "guest"
```

4. Latihan `Parameters`, `ReturnType`, `Awaited` untuk menjaga konsistensi function.

```ts
type FetchUser = (id: string) => Promise<UserPublic>;

type FetchUserArgs = Parameters<FetchUser>; // [string]
type FetchUserResult = Awaited<ReturnType<FetchUser>>; // UserPublic
```

5. Jalankan:

```bash
npm run typecheck
npm run build
```

Tugas kecil (wajib):

- Buat `type LoginBody = Pick<User, "email"> & { password: string }` lalu pastikan tidak ada cara “tidak sengaja” memasukkan `passwordHash` ke body.
- Buat `type UserMap = Record<User["id"], UserPublic>` dan isi satu contoh objectnya.
