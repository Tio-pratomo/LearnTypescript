/**
 * Sidebar untuk materi belajar
 * edit disini untuk menambah sesi belajar
 */

import { generateSession } from './generateSession';

/** @type {any[]} - kumpulan pembelajaran via sidebar */
export const sidebar = [
  {
    label: 'Chapter I',
    collapsed: true,
    items: generateSession(8, 'chapter1'),
  },
  {
    label: 'Chapter II',
    collapsed: true,
    items: generateSession(10, 'chapter2'),
  },
];
