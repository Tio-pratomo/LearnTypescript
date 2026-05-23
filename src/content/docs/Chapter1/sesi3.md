---
title: Basic Types
---

Masuk **Sesi 3**, kamu akan belajar tipe data dasar TypeScript dan kapan masing-masing dipakai agar code kamu aman dari bug sejak compile-time.

## Materi: Pengetahuan & Konsep

TypeScript menyediakan tipe-tipe yang sama seperti JavaScript (number, string, boolean, array, object) dan menambah beberapa konsep penting seperti `tuple`, `enum`, `unknown`, `never` untuk kebutuhan aplikasi skala besar.

**_Static typing_** artinya kamu bisa mendeskripsikan tipe value untuk variable, parameter, return function, dan properti object sehingga error bisa ditangkap lebih cepat.

Perbedaan besar yang wajib paham sejak awal yaitu **`unknown` itu “aman tapi harus dicek dulu”, sedangkan `any` itu “bebas tapi menghilangkan type safety”.**

## Basic Types yang wajib

- `boolean`: nilai `true/false`.
- `number` dan `bigint`: angka (floating point) dan bilangan besar dengan akhiran `n`.
- `string`: teks termasuk template string pakai backtick dan interpolasi `${...}`.
- `array`:

  `number[]` atau `Array<number>`.

  Contoh di atas artinya, array tersebut berisi elemen yang value-nya harus number.
  Seperti `[1,2,3]`

- `tuple`: array dengan **jumlah elemen tetap** dan tipe per indeks jelas.
- `enum`:

  Kumpulan konstanta bernama, ada numeric enum dan string enum, dengan perbedaan perilaku runtime (numeric enum punya reverse mapping, string enum tidak).

  Sekilas info, **reverse mapping** merupakan akses bidirectional di mana Anda bisa mengakses `Enum[key]` -> **value** dan `Enum[value]` -> **key**. Contohnya :

  ```ts
  enum Status {
    Aktif = 1,
    NonAktif = 0,
  }

  let namaStatus = Status[1]; // Hasil: "Aktif" (Reverse Mapping)
  let nilaiStatus = Status.Aktif; // Hasil: 1
  ```

  TypeScript enum bukan hanya tipe, tapi juga menghasilkan representasi nilai saat runtime (bukan sekadar hilang seperti type-only).​

  Itulah sebabnya `Role.Admin` (lihat kode dipraktek), bisa dipakai sebagai value dan hasilnya berupa angka untuk numeric enum.

- `void`: biasanya untuk return function yang tidak mengembalikan nilai.
- `null` dan `undefined`: dengan `strictNullChecks`, keduanya jadi lebih ketat penempatannya sehingga menghindari banyak error umum.
- `never`: untuk kasus “tidak mungkin terjadi”, misalnya function yang selalu throw atau loop tak berujung.
- `unknown` vs `any`:

  `unknown` memaksa narrowing (cek tipe) sebelum dipakai.

  Sedangkan `any` membiarkan akses properti apa pun tanpa dicek.

## Praktik

Buat file `src/sesi-3-types.ts` lalu isi ini (sengaja dibuat ringkas tapi mencakup tipe-tipe utama):

```ts
// boolean
const isActive: boolean = true;

// number & bigint
const port: number = 3000;
const bigId: bigint = 100n;

// string + template string
const name: string = 'Alya';
const greet: string = `Halo, ${name}. Port: ${port}`;

// array (dua gaya)
const scores1: number[] = [10, 20, 30];
const scores2: Array<number> = [40, 50];

// tuple (fixed shape)
const point: [number, number] = [10, 20];

// enum (numeric)
enum Role {
  User = 1,
  Admin,
}
const myRole: Role = Role.Admin; // hasil 2 (auto-increment)

// enum (string)
enum Direction {
  Up = 'UP',
  Down = 'DOWN',
}
const dir: Direction = Direction.Up;

// unknown (wajib narrowing)
const payload: unknown = Math.random() > 0.5 ? 'ok' : 123;

if (typeof payload === 'string') {
  console.log(payload.toUpperCase());
} else {
  console.log(payload);
}

// any (hindari kalau tidak perlu)
const legacyData: any = { x: 1 };
legacyData.thisCanExplodeAtRuntime?.();

// void: return function tanpa nilai
function logMessage(msg: string): void {
  console.log(msg);
}

// never: function yang tidak pernah return normal
function fail(message: string): never {
  throw new Error(message);
}
```

Lalu jalankan:

```bash
npm run typecheck
npm run build
```

`tsc` akan melakukan type-checking dan compile TS ke JS sesuai konfigurasi project kamu.

Kalau sudah, jawab 2 hal ini (tanpa perlu panjang):

1.  Kira-kira, kamu masih bingung di bagian mana: `unknown vs any`, `tuple`, `enum`, atau `null/undefined`?.

    Silahkan lihat https://www.w3schools.com/typescript/ sebagai referensi untuk memahami lebih dalam.

2.  Apakah `strict` sudah aktif di `tsconfig.json` kamu?
