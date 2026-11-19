# FumiMKS2 GitHub Pages PWA — REV270.2.7

Paket ini adalah **launcher PWA GitHub Pages** untuk membuka aplikasi Google Apps Script REV270.2.7.
Backend, autentikasi, dan database tetap berada di Google Apps Script; paket ini tidak menggantikan source GAS.

## URL aplikasi GAS yang ditanam pada launcher

https://script.google.com/a/macros/rentokil-initial.com/s/AKfycbxHeNimIA21ezcmn2I2GSISwLjVIzLvLkmqiU6Qrw-SQ0cXMuwjqxoguQRzOUFIILOm8w/exec

## Isi paket
- `index.html` — PWA launcher dengan tampilan standalone dan iframe GAS.
- `manifest.json` — identitas dan metadata instalasi PWA.
- `sw.js` — cache terbatas untuk app shell GitHub Pages. Tidak meng-cache request/response GAS.
- `offline.html` — halaman fallback saat launcher tidak dapat diambil dari jaringan.
- `logo-192.png`, `logo-512.png` — ikon PWA hasil resize logo yang diberikan.

## Cara menerapkan ke GitHub Pages
1. Buat backup/branch dari repository GitHub Pages saat ini.
2. Periksa apakah repository saat ini memiliki file penting yang harus dipertahankan.
3. Unggah file dalam paket ini ke root repository yang menjadi sumber GitHub Pages.
4. Pastikan GitHub Pages tetap menggunakan branch/folder yang benar.
5. Tunggu deployment GitHub Pages selesai.
6. Buka URL GitHub Pages melalui Chrome Android.
7. Uji buka aplikasi, login, navigasi, upload/preview file, dan refresh.
8. Uji instalasi melalui menu browser jika opsi instalasi tersedia.

## Catatan penting
- `display: standalone` meminta browser menjalankan PWA dalam mode aplikasi setelah diinstal; perilaku instalasi tetap bergantung pada dukungan browser/perangkat.
- Service worker hanya menangani aset statis pada origin GitHub Pages. Request ke `script.google.com` dan domain Google lainnya sengaja tidak di-cache.
- Launcher menampilkan indikator pemuatan dan fallback setelah 35 detik. Karena iframe lintas-origin, launcher tidak dapat membaca isi halaman atau memastikan status autentikasi GAS.
- `iframe` diizinkan oleh source REV270.2.7 melalui `XFrameOptionsMode.ALLOWALL`; pengujian nyata tetap diperlukan untuk memastikan kebijakan akun/domain dan browser.
- Paket ini belum di-deploy ke repository GitHub dan belum menjalani runtime UAT.
- Jangan menimpa file repository sebelum backup dan pemeriksaan isi repository.
