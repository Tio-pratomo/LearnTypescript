---
title: Variabel dan Type-Inferense
---

Sesi 5 membahas cara deklarasi variabel (`let`/`const`) dan bagaimana TypeScript
melakukan _Type-Inference_ agar kode ringkas tanpa kehilangan keamanan tipe.

## let, const, dan scope

TypeScript mendukung `let` dan `const`, dan keduanya direkomendasikan dibanding
`var` karena `var` memiliki perilaku scope yang lebih mudah memicu bug.

- `let` bersifat block-scoped dan nilainya boleh berubah (bisa di-assign ulang).
- `const` bersifat block-scoped dan tidak boleh di-assign ulang (reassign).

**Catatan penting:**

- `const` tidak membuat object/array otomatis immutable.
  Yang tidak boleh berubah adalah binding variabelnya, bukan isi object/array.

**Prinsip praktis:**

- Gunakan `const` sebagai default.
- Gunakan `let` hanya jika memang butuh assignment ulang.

## Type-Inference

TypeScript sering mengisi tipe secara otomatis ketika tidak ada anotasi tipe
yang ditulis secara eksplisit. Ini biasanya terjadi pada:

- Inisialisasi variabel.
- Parameter dengan default value.
- Return type function.

Untuk array yang berisi beberapa tipe, TypeScript mencari tipe terbaik yang
mewakili semua elemen. Jika tidak ada satu tipe yang cocok, hasilnya bisa berupa
union seperti `(number | null)[]`.

Ada juga _contextual typing_, yaitu tipe ekspresi bisa di-infer dari konteks
penempatannya (misalnya callback pada API tertentu akan “mewarisi” tipe dari
kontrak API tersebut).

## Type alias

Di TypeScript, keyword `type` digunakan untuk membuat nama untuk sebuah tipe.
Nama ini disebut _type alias_ (alias = nama lain).

**Type alias berguna untuk:**

- Merapikan kode agar tidak menulis tipe panjang berulang-ulang.
- Membuat maksud tipe lebih jelas (mudah dibaca).
- Membentuk union type atau menyusun tipe dari tipe lain.

Contoh sederhana:

```ts
type UserId = string;

const id: UserId = 'u_123';
```

`UserId` tetap `string`, tetapi nama `UserId` membuat konteksnya jelas:
string tersebut adalah “ID user”, bukan string bebas.

### Contoh type alias yang sering dipakai

**Union type:**

```ts
type Status = 'success' | 'failed';

let status: Status = 'success';
status = 'failed'; // OK
// status = "pending"; // Error
```

**Alias untuk object :**

```ts
type User = {
  name: string;
  role: 'admin' | 'user';
};

const u: User = { name: 'Ari', role: 'admin' };
```

**Alias dari hasil operator tipe:**

```ts {9}
// 1) Definisikan object routes sebagai value (runtime)
const routes = {
  home: '/',
  about: '/about',
  userDetail: '/users/:id',
} as const;

// 2) Ambil union dari seluruh key milik object routes
type RouteName = keyof typeof routes;

// 3) Pakai RouteName agar parameter hanya menerima key yang valid
function goTo(route: RouteName) {
  return routes[route];
}

// Benar
goTo('home');
goTo('userDetail');

// Salah (akan error di TypeScript)
// goTo("settings");
```

**Penjelasan kode di atas :**

Kenapa perlu keyword`typeof` setelah keyword `keyof`?

`keyof` hanya bisa bekerja pada “tipe”(type), bukan pada “value” langsung. Jadi, menulis `keyof routes` tidak valid karena `routes` adalah variabel runtime.

Dengan `typeof routes`, TypeScript mengambil bentuk tipe dari variabel itu,  
baru kemudian `keyof` bisa mengekstrak daftar key-nya.

Kemudan keyword `as const` membuat properti di `routes` menjadi literal dan read-only,
sehingga nilainya tetap spesifik (`"/about"` bukan `string`).

Ini sering dipakai agar mapping route tetap presisi saat dipakai bersama lookup `routes[route]`.

Penjelasan detailnya baca terus sampai sesi ini selesai.

**Catatan:**

- `type` hanya dipakai saat type-checking (compile time), bukan runtime JS.
- **Type alias tidak membuat value baru**. Itu hanya membantu TypeScript mengecek kode.

## Literal, widening, as const, satisfies

Disclaimer : Mungkin ini membingungkan tapi seiring pelajaran akan terbiasa.

Cobalah untuk praktek dan memahami dengan membaca referensi lain.

### Literal dan widening (const vs let)

Intinya: **TypeScript menebak tipe dari nilai awal.**

- `const` sering mempertahankan tipe yang lebih spesifik (tipe literal),
  karena variabelnya tidak bisa di-assign ulang.
- `let` cenderung “melebar” (_type widening_) ke tipe yang lebih umum,
  karena variabelnya bisa di-assign ulang.

Contoh:

```ts
const a = 'ok'; // tipe: "ok" (literal)
let b = 'ok'; // tipe: string (melebar)
```

`b` menjadi `string` karena ini valid:

```ts
let b = 'ok';
b = 'no'; // valid
```

### as const: mengunci literal sampai dalam

Gunakan `as const` jika ingin object/array literal “terkunci” lebih ketat:

- nilai string tetap literal (bukan `string`)
- properti menjadi `readonly`
- array bisa menjadi `readonly tuple` (tergantung bentuknya)

### Record: tipe object "dictionary"

`Record<K, T>` adalah cara cepat mendefinisikan object “key-value”.

- `K` adalah tipe key
- `T` adalah tipe value

**Contoh:**

```ts
type HeadersHTTP = Record<string, string>;

const headers: HeadersHTTP = {
  'content-type': 'application/json',
} as const;

console.log(headers['content-type']);
```

### satisfies: validasi shape tanpa mengubah inference

Kadang ingin:

- Data harus memenuhi aturan tipe tertentu (validasi/kontrak).
- Namun tipe hasil inference tetap detail (tidak dipaksa menjadi tipe umum).

Untuk itu gunakan operator `satisfies`:

- mengecek bahwa nilai cocok dengan tipe target
- tanpa memaksa tipe hasil inferensi berubah menjadi tipe target

**Contoh kode**

```ts
type Permission = 'read' | 'write';
type Role = 'admin' | 'staff' | 'guest';

const rolePermissions = {
  admin: ['read', 'write'],
  staff: ['read'],
  guest: ['read'],
  // geust: ["read"], // error: key salah (typo)
  // admin: ["delete"], // error: value bukan Permission
} satisfies Record<Role, readonly Permission[]>;
```

## Praktik

Buat file `src/sesi-5-variables-inference.ts` lalu isi contoh berikut.
Jalankan sambil memperhatikan error TypeScript-nya.

```ts
/**
 * Sesi 5: Variabel dan Type Inference
 *
 * Tujuan:
 * 1) Paham bedanya let vs const pada inference tipe.
 * 2) Paham union type dari array campuran.
 * 3) Paham "as const" untuk mengunci nilai object/array literal.
 * 4) Paham Record untuk tipe object “kamus”.
 * 5) Paham "satisfies" untuk validasi bentuk data tanpa mengubah inference.
 */

/* =========================================================
 * 1) let vs const (widening vs literal)
 * ========================================================= */

const statusConst = 'success'; // tipe: "success"
let statusLet = 'success'; // tipe: string

// statusConst = "failed"; // Error: const tidak boleh reassign
statusLet = 'failed'; // OK: let boleh berubah nilainya

/* =========================================================
 * 2) Array campuran -> union type
 * ========================================================= */

const mixed = [0, 1, null]; // tipe: (number | null)[]

/* =========================================================
 * 3) as const: mengunci literal sampai dalam (deep)
 * ========================================================= */

const routes = {
  home: '/',
  login: '/login',
  user: '/users/:id',
} as const;

type RouteName = keyof typeof routes;
// type RouteName = "home" | "login" | "user"

function goTo(route: RouteName) {
  console.log('Go to', routes[route]);
}

goTo('home'); // OK
// goTo("settings"); // Error: "settings" tidak ada di RouteName

/* =========================================================
 * 4) Record: kontrak object “kamus”
 * ========================================================= */

type Headers = Record<string, string>;

const headers = {
  'content-type': 'application/json',
} satisfies Headers;

/* =========================================================
 * 5) satisfies: validasi shape tanpa mengubah inference
 * ========================================================= */

type Palette = Record<string, string | readonly number[]>;

const palette = {
  primary: '#ff0000',
  secondary: 'blue',
} satisfies Palette;

// Contoh error jika tipe salah:
// const palette2 = { primary: true } satisfies Palette; // Error
```

Jalankan type-check dan compile:

```bash
npm run typecheck
npm run build
```

**Tugas kecil (wajib):**

Ubah `routes` tanpa `as const`, lalu lihat bedanya pada tipe `RouteName`
dan error yang muncul ketika memanggil `goTo`.
