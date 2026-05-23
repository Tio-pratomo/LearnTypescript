---
title: Project references + incremental build monorepo
---

Masuk **Sesi 18**: TypeScript _project references_ + _incremental build_ di monorepo. Targetnya: build jadi cepat, urutan build otomatis benar, dan IDE lebih “paham” relasi antar package.

## Materi: Konsep inti (project references + build mode)

Project references memungkinkan sebuah `tsconfig.json` “mereferensikan” proyek TypeScript lain, sehingga TypeScript tahu dependency graph antar package.

Untuk membangun semua proyek mengikuti graph tersebut, gunakan build mode: `tsc --build` (alias `tsc -b`) yang akan mencari semua referenced projects, mengecek mana yang sudah up-to-date, lalu membuild yang out-of-date dalam urutan yang benar.

Agar proyek bisa direferensikan dengan baik, praktik umumnya adalah menjadikannya _composite project_ (set `compilerOptions.composite: true`), karena itu membantu TypeScript mengelola metadata build dan incremental compilation.

## Materi: Incremental build itu apa

Incremental build berarti TypeScript menyimpan informasi build sebelumnya sehingga compile berikutnya hanya mengerjakan bagian yang berubah, bukan full rebuild terus-menerus.

Saat menggunakan `tsc -b`, TypeScript berperan seperti “build orchestrator”, jadi sangat cocok untuk monorepo (apps + packages) yang saling tergantung.

## Praktik: Upgrade monorepo sesi 17 jadi pakai project references

Asumsi struktur dari Sesi 17:

```
ts-monorepo/
  apps/cli
  apps/web
  packages/shared
```

### Tambah “solution tsconfig” di root

Buat `tsconfig.json` di root `ts-monorepo/`:

```jsonc
{
  "files": [],
  "references": [
    { "path": "./packages/shared" },
    { "path": "./apps/cli" },
    { "path": "./apps/web" },
  ],
}
```

`references` di tsconfig dipakai untuk mendeskripsikan dependency antar project.

### Jadikan `packages/shared` composite + declaration

Edit `packages/shared/tsconfig.json`:

```jsonc
{
  "compilerOptions": {
    "composite": true,
    "declaration": true,
    "declarationMap": true,

    "target": "ES2022",
    "module": "ES2022",
    "rootDir": "src",
    "outDir": "dist",
    "strict": true,
  },
  "include": ["src"],
}
```

Tujuan `declaration` adalah supaya project lain bisa mengonsumsi `.d.ts` hasil build shared dengan aman.

### Buat `apps/cli` mereferensikan shared

Edit `apps/cli/tsconfig.json`:

```jsonc
{
  "compilerOptions": {
    "composite": true,

    "target": "ES2022",
    "module": "ES2022",
    "rootDir": "src",
    "outDir": "dist",
    "strict": true,
  },
  "references": [{ "path": "../../packages/shared" }],
  "include": ["src"],
}
```

Dengan `references`, `tsc -b` akan tahu CLI harus build setelah `shared` jika ada perubahan.

### Untuk `apps/web` (Vite) gunakan tsconfig khusus build

Di Vite, TypeScript biasanya dipakai untuk typecheck dan transpile ditangani bundler, jadi kita pisahkan “tsconfig untuk Vite” vs “tsconfig untuk build refs”.

- Biarkan `apps/web/tsconfig.json` bawaan Vite untuk development.
- Tambahkan `apps/web/tsconfig.build.json` untuk project references:

```jsonc
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "composite": true,
    "noEmit": true,
  },
  "references": [{ "path": "../../packages/shared" }],
  "include": ["src"],
}
```

Ini membuat `web` ikut masuk dependency graph untuk typecheck lintas package, tanpa memaksa emit JS dari `tsc` (karena bundler yang handle).

Lalu ubah root `tsconfig.json` references untuk web menjadi:

```jsonc
{ "path": "./apps/web/tsconfig.build.json" }
```

agar `tsc -b` memakai config build tersebut.

## Praktik: Script build yang benar

Tambahkan/ubah script di root `package.json`:

```jsonc
{
  "scripts": {
    "build:ts": "tsc -b",
    "build:ts:watch": "tsc -b -w",
    "clean:ts": "tsc -b --clean",
  },
}
```

`tsc -b` (build mode) adalah kunci untuk incremental build lintas project references.

## Checklist sukses (yang harus kamu lihat)

- Jalankan `npm run build:ts` dua kali; run kedua harus jauh lebih cepat karena sebagian besar project “up-to-date”.
- Ubah `packages/shared/src/index.ts`, lalu build lagi; yang rebuild seharusnya minimal `shared` dan proyek yang mereferensikannya (mis. cli).

Kalau kamu kirim struktur file `tsconfig*` yang kamu pakai setelah mengikuti langkah di atas, bisa dicek apakah graph references-nya sudah optimal sebelum dipakai di CI/CD.
