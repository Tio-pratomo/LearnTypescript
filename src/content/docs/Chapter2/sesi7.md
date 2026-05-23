---
title: Praktek I
---

Siap, kita masuk **Sesi 15**: praktik TypeScript untuk dua target sekaligus—mulai dari CLI/backend Node.js, lalu lanjut ke frontend bundler dengan Vite (DOM event + fetch + axios).

## CLI Node.js (TypeScript)

TypeScript bisa dipakai di sisi server/CLI karena hasil akhirnya tetap JavaScript yang dieksekusi Node.js, dan kerangka materi memang menempatkan “TypeScript + Node.js development” sebagai bagian penting.

Node.js 18 menyediakan `fetch` secara global (bawaan) sehingga request HTTP bisa dilakukan tanpa library tambahan (opsional tetap bisa pakai axios).

Langkah praktik (buat proyek CLI terpisah supaya tidak konflik dengan konfigurasi bundler):

1. Buat project

```bash
mkdir cli-ts
cd cli-ts
npm init -y
npm i -D typescript
npx tsc --init
mkdir src dist
```

2. Edit `tsconfig.json` minimal:

```jsonc
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "rootDir": "src",
    "outDir": "dist",
    "strict": true,
  },
}
```

3. Buat `src/index.ts` (CLI + HTTP via fetch):

```ts
type Pokemon = { name: string };

async function main() {
  const name = process.argv[2] ?? 'pikachu';
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const data = (await res.json()) as Pokemon;
  console.log(`Pokemon: ${data.name}`);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
```

4. Tambahkan script `package.json`:

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

5. Run:

```bash
npm run build
npm run start -- bulbasaur
```

Kalau mau versi axios (lebih umum di backend): axios mendukung generic untuk mengetik `data` hasil response, misalnya `axios.get<User[]>('/users')` agar `data` bertipe `User[]`.

## Frontend bundler (Vite + TS + DOM + fetch + axios)

Vite menyediakan template **vanilla-ts** sehingga project frontend TypeScript bisa di-bootstrap cepat.
Vite guide dan contoh pemakaian template menunjukkan perintah `npm create vite@latest ... -- --template vanilla-ts`.

Langkah praktik:

1. Buat project

```bash
mkdir web-ts
cd web-ts
npm create vite@latest . -- --template vanilla-ts
npm install
npm i axios
npm run dev
```

Perintah di atas membuat proyek Vite “vanilla + TypeScript” siap jalan.

2. Update `src/main.ts` (DOM event + fetch + axios)

```ts
import axios from 'axios';
import './style.css';

type Pokemon = { name: string };

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('Missing #app');

app.innerHTML = `
  <div>
    <h1>Vite + TypeScript</h1>
    <form id="form">
      <input id="name" placeholder="pikachu" />
      <button type="submit">Load</button>
    </form>
    <pre id="out"></pre>
  </div>
`;

const form = document.querySelector<HTMLFormElement>('#form')!;
const input = document.querySelector<HTMLInputElement>('#name')!;
const out = document.querySelector<HTMLPreElement>('#out')!;

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = (input.value || 'pikachu').trim();

  // fetch (native browser)
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  if (!res.ok) {
    out.textContent = `Fetch error: ${res.status}`;
    return;
  }
  const dataFetch = (await res.json()) as Pokemon;

  // axios (typed response via generic)
  const { data: dataAxios } = await axios.get<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${name}`);

  out.textContent = JSON.stringify({ fetch: dataFetch.name, axios: dataAxios.name }, null, 2);
});
```

Axios generic typing seperti `axios.get<T>()` adalah pola yang umum dipakai untuk membuat response `data` bertipe `T`.

## Sisa sesi dan next step

Setelah Sesi 15 ini, Sesi 16 (best practices + design patterns + strategi integrasi/migrasi TypeScript di proyek nyata).
