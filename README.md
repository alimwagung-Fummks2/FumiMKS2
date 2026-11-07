# FumiMKS2 — 224.5.1-M1.3.4

## Paket revisi

Paket ini merupakan hasil hardening statis terhadap enam file sumber yang diberikan.

### File deployment

| File | Tujuan |
|---|---|
| `Index.html` | HTML untuk project Google Apps Script (nama file Apps Script peka huruf besar/kecil) |
| `index.html` | Salinan HTML untuk hosting statis/GitHub Pages |
| `Code.gs` | Backend Google Apps Script |
| `manifest.json` | Metadata instalasi PWA |
| `sw.js` | Service Worker cache shell |
| `README.md` | Catatan revisi dan batasan deployment |

`Index.html` dan `index.html` harus identik. `manifest.json` harus menggunakan ejaan tepat tersebut; file sumber yang diberikan pada percakapan memiliki nama unggahan `mnifest.json`, sehingga pastikan nama di repository diperbaiki menjadi `manifest.json`.

## Perubahan M1.3.4

- Memperkuat escaping data antrean sebelum dirender ke HTML dan atribut event.
- Mengganti render daftar formulir dari interpolasi `innerHTML` menjadi pembuatan elemen DOM dan `textContent`.
- Memvalidasi URL Drive sebelum membuka tautan PDF.
- Menghindari interpolasi nama modul dan alamat email ke HTML.
- Menambahkan lockout OTP 15 menit setelah lima kegagalan verifikasi dan menggunakan UUID Apps Script sebagai sumber OTP.
- Menyimpan hash SHA-256 token Trusted Device. Token plaintext lama di-upgrade ke hash saat perangkat lama berhasil diverifikasi.
- Memvalidasi struktur header sheet `Trusted_Devices`.
- Memperketat validasi Notice: tanggal, datetime-local, panjang teks, struktur shipment, enclosure, kontainer, dan signature PNG.
- Memastikan pratinjau Notice hanya dibuat untuk ID dokumen yang ada di antrean.
- Memperbaiki proses ubah ID dokumen agar JSON divalidasi sebelum penulisan dan baris dipulihkan jika penulisan lanjutan gagal.
- Menampilkan pesan keterbatasan backend dan menonaktifkan tombol autentikasi pada hosting statis yang tidak menyediakan `google.script.run`.
- Menambahkan manifest link dan registrasi Service Worker pada hosting statis, serta melewati host Google Apps Script.
- Menaikkan cache Service Worker ke v8 dan memperbaiki fallback cache saat jaringan gagal atau server mengembalikan respons non-2xx.

## Validasi statis

Pemeriksaan yang dijalankan:
- `node --check` untuk JavaScript inline HTML, `Code.gs`, dan `sw.js`.
- Parse JSON `manifest.json`.
- Parse struktur HTML.
- Parse CSS.
- Perbandingan byte-identik HTML Apps Script dan GitHub Pages.

Pemeriksaan tersebut bukan pengganti uji runtime.

## Batasan penting deployment

### GitHub Pages belum menjadi backend operasional

HTML saat ini menggunakan `google.script.run` untuk autentikasi OTP, trusted device, antrean, autosave, Notice, PDF, email, dan monitoring. API tersebut hanya disediakan oleh Google Apps Script HtmlService.

GitHub Pages adalah hosting statis dan tidak menyediakan `google.script.run`. Pada HTML yang diaudit tidak ditemukan adapter `fetch()` atau URL Web App GAS, sedangkan backend hanya menyediakan `doGet()` dan belum menyediakan API `doPost()`/endpoint JSON untuk dipanggil dari hosting statis.

Karena itu:
- `Index.html` pada deployment Google Apps Script adalah jalur aplikasi operasional yang didukung oleh arsitektur saat ini.
- `index.html` pada GitHub Pages dapat menyajikan shell dan aset PWA, tetapi **tidak dapat menjalankan alur backend operasional secara mandiri** sampai dibuat API adapter yang aman.
- Registrasi manifest dan Service Worker tidak mengatasi keterbatasan API tersebut.

Jangan menyatakan GitHub Pages sebagai deployment operasional penuh sebelum API adapter dan CORS/authentication diuji.

### Pemeriksaan yang masih wajib sebelum produksi

1. Verifikasi `FOLDER_ID_GCC` benar-benar menunjuk folder arsip GCC produksi.
2. Uji login OTP, batas percobaan, lockout, pendaftaran trusted device baru, dan migrasi token perangkat lama.
3. Uji autosave dua perangkat dan konflik revision.
4. Uji semua variasi Notice QPS/Non-QPS, sasaran Ruang, tanggal/waktu, enclosure, kontainer, preview, dan PDF final.
5. Uji penerbitan PDF, rollback, pengiriman email, dan perubahan status menggunakan folder Drive produksi.
6. Uji PWA di GitHub Pages pada HTTPS dan uji offline/online pada Android.
7. Pastikan hak akses Google Sheet dan folder Drive hanya diberikan kepada pihak yang berwenang.

Tidak ada pengujian langsung ke Spreadsheet, Drive, MailApp, deployment Apps Script, atau perangkat Android yang diklaim telah dilakukan dalam audit ini.
