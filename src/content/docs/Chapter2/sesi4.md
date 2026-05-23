---
title: Object-Oriented Programming (OOP)
---

Sesi 12 kita fokus ke Object-Oriented Programming (OOP) di TypeScript: class, interface, inheritance, dan access modifier. Ini pondasi penting untuk menulis kode skala besar yang rapi dan mudah di-maintain.

## Materi: Konsep OOP di TypeScript

TypeScript sepenuhnya mendukung paradigma OOP: kamu bisa membuat class, meng-implement interface, memakai inheritance, dan mengatur visibilitas anggota dengan access modifier.

Dalam OOP, object mengenkapsulasi data (field/properti) dan perilaku (method), sehingga struktur kode lebih modular dan mudah dikembangkan bertahap.

## Materi: Class, field, dan access modifier

Class di TypeScript adalah blueprint object yang berisi field, constructor, dan method, dan akan ditranspile menjadi JavaScript class atau function tergantung `target`.

Access modifier `public`, `private`, dan `protected` mengontrol siapa yang boleh mengakses field/method; ini membantu menjaga **invariants** dan mencegah akses sembarangan ke detail internal.

Ada juga `readonly` untuk field yang hanya boleh diisi di constructor, serta “parameter properties” di constructor untuk mendeklarasikan dan menginisialisasi properti dalam satu langkah.

### Praktik: class dasar

Buat `src/sesi-12-oop.ts`:

```ts
// Kontrak data (interface)
interface Identifiable {
  id: string;
}

interface Timestamps {
  createdAt: Date;
  updatedAt: Date;
}

// Class dasar dengan enkapsulasi
class User implements Identifiable, Timestamps {
  public readonly id: string;
  public name: string;
  private passwordHash: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(id: string, name: string, passwordHash: string) {
    this.id = id;
    this.name = name;
    this.passwordHash = passwordHash;
    const now = new Date();
    this.createdAt = now;
    this.updatedAt = now;
  }

  public checkPassword(raw: string): boolean {
    // Pseudo-logic: biasanya pakai bcrypt/argon2
    return this.passwordHash === `hash(${raw})`;
  }

  public rename(newName: string): void {
    this.name = newName;
    this.touch();
  }

  protected touch(): void {
    this.updatedAt = new Date();
  }
}
```

Jalankan `npm run typecheck && npm run build` lalu `node dist/sesi-12-oop.js` untuk memastikan class berfungsi.

## Materi: Inheritance, abstract, dan polymorphism

TypeScript mendukung inheritance dengan `extends`, sehingga class turunan bisa mewarisi field/method dari base class dan menambahkan perilaku khusus.

Abstract class memungkinkan kamu mendefinisikan kontrak method yang wajib diimplementasikan subclass, sekaligus menyediakan implementasi bersama untuk logic umum.

Polymorphism muncul ketika kode kamu bekerja dengan tipe base (misal `Shape`) tetapi perilaku nyata diambil dari implementasi subclass saat runtime.

### Praktik: hierarchy OOP mini

Lanjutkan di file yang sama:

```ts
abstract class Shape {
  constructor(public readonly name: string) {}

  abstract area(): number;

  describe(): string {
    return `Shape: ${this.name}, area=${this.area()}`;
  }
}

class Rectangle extends Shape {
  constructor(
    public width: number,
    public height: number
  ) {
    super('rectangle');
  }

  area(): number {
    return this.width * this.height;
  }
}

class Circle extends Shape {
  constructor(public radius: number) {
    super('circle');
  }

  area(): number {
    return Math.PI * this.radius ** 2;
  }
}

// Polymorphism: array berisi berbagai Shape
const shapes: Shape[] = [new Rectangle(10, 20), new Circle(5)];

for (const s of shapes) {
  console.log(s.describe());
}
```

Jalankan lagi `npm run typecheck && npm run build && node dist/sesi-12-oop.js` untuk melihat output `describe` dari berbagai bentuk.

Tugas kecil:

- Tambahkan class `AdminUser extends User` dengan field `permissions: string[]` dan buat method `can(permission: string): boolean`.
- Buat function `printSummary(entity: Identifiable & Timestamps)` yang menerima object apa pun yang punya `id`, `createdAt`, dan `updatedAt`, lalu coba kirim instance `User` dan object literal lain yang memenuhi kontrak tersebut.
