---
title: Async Await TypeScript
---

Masuk **Sesi 14**: kita fokus ke async programming di TypeScript (Promise, `async/await`, dan konsep lanjutannya) karena ini kepakai di backend (Node.js) dan frontend (browser) setiap hari.

## Materi: Pengetahuan & Konsep

Asynchronous programming memungkinkan aplikasi tetap responsif dengan menjalankan operasi yang “menunggu” (I/O, network) tanpa memblokir eksekusi utama.

Di TypeScript, topik inti async dimulai dari Promise dan `async/await`, lalu bisa berkembang ke async iterators/generators untuk menangani aliran data (stream) dengan lebih terkontrol.

Kerangka juga menekankan bahwa async sering terkait interaksi API eksternal (mis. Fetch API / XMLHttpRequest di web), dan bisa juga menyentuh parallelism seperti Web Workers.

## Materi: Pola penting yang wajib dikuasai

- Gunakan `async/await` untuk membuat kode async lebih “linear” dan mudah dibaca dibanding chaining `.then()`.
- Pastikan error ditangani: `try/catch` untuk `await`, atau `.catch()` untuk Promise chain, agar failure tidak “silent”.
- Pahami concurrency: menunggu secara berurutan vs paralel (mis. `await` satu-per-satu vs `Promise.all`) karena ini memengaruhi performa aplikasi.

## Praktik: Node.js + Frontend mindset

Buat file `src/sesi-14-async.ts` dan jalankan sebagai latihan type-safety async (contoh ini bisa kamu pakai di Node maupun browser karena hanya mensimulasikan async).

```ts
type ApiOk<T> = { ok: true; data: T };
type ApiErr = { ok: false; error: { message: string } };
type ApiResp<T> = ApiOk<T> | ApiErr;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Simulasi fetch async (anggap ini fetch API/HTTP client)
async function fetchUser(id: string): Promise<ApiResp<{ id: string; name: string }>> {
  await delay(200);

  if (id.trim() === '') {
    return { ok: false, error: { message: 'Invalid id' } };
  }

  return { ok: true, data: { id, name: 'Alya' } };
}

async function main() {
  try {
    const resp = await fetchUser('u-1');

    // Narrowing union response
    if (!resp.ok) {
      console.error(resp.error.message);
      return;
    }

    console.log(resp.data.name);

    // Contoh paralel (concurrency)
    const results = await Promise.all([fetchUser('u-2'), fetchUser('u-3')]);
    console.log(results);
  } catch (err) {
    // err di TS biasanya unknown; lakukan narrowing bila mau diproses detail
    console.error('Unexpected error', err);
  }
}

main();
```

Jalankan:

```bash
npm run typecheck
npm run build
node dist/sesi-14-async.js
```

`tsc` tetap mengecek union typing + return type async function sebelum kode dijalankan.
