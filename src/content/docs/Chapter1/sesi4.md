---
title: Union, literal, intersection, narrowing
---

Sesi 4 adalah titik penting:

- Kamu akan menggabungkan tipe dengan union/intersection,
- Memakai literal types sebagai “kontrak nilai”,
- Lalu melakukan narrowing supaya kode tetap aman saat memproses union.

## Materi: Union dan literal

Union type (`A | B`) artinya sebuah value boleh salah satu dari beberapa tipe, dan ini sangat umum untuk data dari API, input user, atau state yang punya beberapa kemungkinan bentuk.

Literal types (mis. `"success"` atau `200`) membuat nilai menjadi sangat spesifik, dan jika digabung dengan union akan membentuk pilihan yang ketat (mis. `"draft" | "published"`).

Pola paling kuat adalah “tagged/discriminated union”: siapkan satu field tag bertipe literal (mis. `kind: "circle" | "square"`) agar TypeScript bisa men-_narrow_ otomatis.

## Materi: Intersection

Intersection type (`A & B`) artinya satu value harus memenuhi semua properti dari beberapa tipe sekaligus (anggap seperti “gabung kontrak”).

Intersection sering dipakai saat kamu ingin menggabungkan data profil + metadata, atau menambah capability pada object tanpa mengubah type awal.

## Materi: Narrowing dan type guards

Narrowing adalah cara TypeScript mempersempit union menjadi tipe yang lebih spesifik setelah ada pengecekan runtime seperti `typeof`, `instanceof`, atau pemeriksaan properti.

Pengecekan `in` juga berfungsi sebagai narrowing untuk union object: branch `true` akan mengarah ke tipe yang punya properti tersebut (opsional atau wajib).

Untuk memastikan semua kasus union ditangani, pola umum adalah exhaustive check dengan `never` di `default`/cabang terakhir agar compiler memaksa kamu menambah handling jika union bertambah.

## Praktik

Buat file `src/sesi-4-union-intersection-narrowing.ts`, lalu isi dan jalankan contoh berikut.

```ts
// 1) Union + narrowing via typeof
function normalizeId(id: number | string): string {
  if (typeof id === 'number') return `id:${id}`;
  return `id:${id.trim()}`;
}

// 2) Discriminated union (tag: kind)
type Circle = { kind: 'circle'; radius: number };
type Square = { kind: 'square'; size: number };
type Shape = Circle | Square;

function area(s: Shape): number {
  switch (s.kind) {
    case 'circle':
      return Math.PI * s.radius ** 2;
    case 'square':
      return s.size ** 2;
    default: {
      // Exhaustive check: kalau suatu hari Shape ditambah,
      // TypeScript akan memaksa kamu handle di sini.
      const _never: never = s;
      return _never;
    }
  }
}

// 3) Intersection: gabungkan beberapa kontrak
type HasId = { id: string };
type HasTimestamps = { createdAt: Date; updatedAt: Date };
type Entity = HasId & HasTimestamps;

const e: Entity = {
  id: 'u-1',
  createdAt: new Date(),
  updatedAt: new Date(),
};

// 4) Narrowing pakai "in" untuk union object
type ApiOk = { ok: true; data: { name: string } };
type ApiErr = { ok: false; error: { message: string } };
type ApiResp = ApiOk | ApiErr;

function getMessage(resp: ApiResp): string {
  if ('data' in resp) return `Hello ${resp.data.name}`;
  return `Error: ${resp.error.message}`;
}

console.log(normalizeId('  123  '));
console.log(area({ kind: 'square', size: 10 }));
console.log(getMessage({ ok: false, error: { message: 'Bad Request' } }));
```

Jalankan:

```bash
npm run typecheck
npm run build
node dist/sesi-4-union-intersection-narrowing.js
```

`tsc` akan melakukan type-checking sehingga narrowing dan union handling kamu tervalidasi sebelum kode menjadi JavaScript.

Tugas kecil (biar naik level):

- Tambahkan `type Triangle = { kind: "triangle"; base: number; height: number }` ke `Shape`, lalu lihat error yang muncul sampai kamu menambah handling di `area`.

- Ubah `ApiResp` agar punya `status: 200 | 400 | 500` (literal union), lalu gunakan itu untuk menentukan message tanpa `if` yang panjang.

Kalau kamu kirim hasil `npm run typecheck` dan isi file sesi 7, nanti dicek apakah narrowing-mu sudah optimal sebelum masuk Sesi 8 (type alias vs interface + kapan pakainya).
