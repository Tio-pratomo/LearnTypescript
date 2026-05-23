# Kursus TypeScript

Website pembelajaran interaktif untuk mempelajari TypeScript dari dasar hingga mahir, dibangun dengan Astro dan Starlight.

## Deskripsi

Kursus ini menyediakan panduan komprehensif untuk belajar TypeScript melalui pendekatan bertahap dan praktis. Setiap sesi menyertakan penjelasan teori dan latihan praktis untuk memperkuat pemahaman konsep TypeScript.

## Struktur Proyek

```
/src/content/docs/
├── index.mdx           # Halaman utama kursus
├── Chapter1/           # Bab I - Dasar TypeScript
│   ├── sesi1.mdx       # Sesi pembelajaran pertama
│   ├── sesi2.mdx
│   └── ...
├── Chapter2/           # Bab II - Lanjutan TypeScript
│   ├── sesi1.mdx       # Sesi pembelajaran pertama
│   ├── sesi2.mdx
│   └── ...
```

## Struktur Kurikulum

### Bab I - Dasar TypeScript
1. **Sesi 1-3**: Pengantar TypeScript, cara kerja compiler, dan program pertama
2. **Sesi 4-6**: Type annotations, sistem tipe, dan konsep dasar
3. **Sesi 7-8**: Interfaces dan advanced types

### Bab II - Lanjutan TypeScript
1. **Sesi 1-4**: Generics dan pola-pola lanjutan
2. **Sesi 5-8**: Utility types dan conditional types
3. **Sesi 9-10**: Teknik-teknik lanjutan dan best practices

## Teknologi

- [Astro](https://astro.build/) - Framework web modern
- [Starlight](https://starlight.astro.build/) - Tema dokumentasi untuk Astro
- TypeScript - Bahasa sumber untuk konten dan pengembangan

## Instalasi

1. Clone atau fork repositori ini
2. Instal dependensi:
   ```bash
   pnpm install
   ```
3. Jalankan situs dalam mode development:
   ```bash
   pnpm dev
   ```
4. Buka http://localhost:4321 di browser Anda

## Menambahkan Sesi Baru

Untuk menambahkan sesi baru:

1. Buat file `.md` atau `.mdx` di direktori yang sesuai (`/src/content/docs/Chapter1/` atau `/src/content/docs/Chapter2/`)
2. Gunakan format penamaan `sesi{nomor}.md(x)`
3. Tambahkan frontmatter dengan judul:
   ```markdown
   ---
   title: Judul Sesi
   ---
   ```
4. Perbarui sidebar.js jika perlu (saat ini sesi dibuat secara dinamis)

## Format Konten

File konten menggunakan format MDX yang mendukung:
- Frontmatter YAML untuk metadata
- Komponen React/Astro (dalam file .mdx)
- Markdown biasa untuk konten
- Syntax highlighting untuk kode
- Komponen Starlight seperti `<Steps>` dan `<Card>`

Contoh struktur umum:
```markdown
---
title: Contoh Judul Sesi
---

## Materi: Pengetahuan & Konsep

Deskripsi teori dan konsep...

## Praktik

<Steps>
1. Langkah pertama...
2. Langkah kedua...
</Steps>

```code`
Kode contoh
```code`
```

## Kontribusi

1. Fork repositori ini
2. Buat branch fitur (`git checkout -b fitur/NamaFitur`)
3. Commit perubahan Anda (`git commit -m 'Tambah NamaFitur'`)
4. Push ke branch (`git push origin fitur/NamaFitur`)
5. Buka Pull Request

## Lisensi

Proyek ini dilisensikan di bawah lisensi MIT.