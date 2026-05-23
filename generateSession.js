/**
 * @module utility
 * @description - Untuk menghasilkan banyaknya sesi belajar
 */

/**
 * @param {number} sumOfSession - jumlah sesi
 * @param {string} folderSession - folder resource materi pembelajaran
 * @returns {string[]} - kumpulan rute materi pembelajaran
 */
export function generateSession(sumOfSession, folderSession) {
  const numberOfSession = [...Array(sumOfSession)].map((value, index) => value ?? ++index);
  return numberOfSession.map((number) => `${folderSession}/sesi${number}`);
}
