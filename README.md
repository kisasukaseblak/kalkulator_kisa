# Kalkulator Modern

Aplikasi kalkulator lengkap dengan fitur-fitur canggih dan database untuk menyimpan riwayat perhitungan.

## Fitur Utama

### 🧮 Operasi Dasar
- Penjumlahan (+)
- Pengurangan (−)
- Perkalian (×)
- Pembagian (÷)
- Persentase (%)
- Akar kuadrat (√)

### 📐 Fungsi Matematika Lanjutan
- Fungsi trigonometri (sin, cos, tan)
- Logaritma (log, ln)
- Pangkat dua (x²)

### 💾 Database & Riwayat
- Penyimpanan otomatis semua perhitungan
- Riwayat perhitungan dengan timestamp
- Pencarian dalam riwayat
- Statistik penggunaan
- Database lokal menggunakan IndexedDB

### 🎨 Antarmuka Modern
- Desain responsif dan menarik
- Mode gelap/terang
- Animasi smooth
- Efek hover dan transisi
- Gradient background yang indah

### ⌨️ Kontrol
- Dukungan keyboard penuh
- Tombol touch-friendly
- Navigasi yang intuitif

## Teknologi yang Digunakan

- **HTML5** - Struktur aplikasi
- **CSS3** - Styling modern dengan gradient dan animasi
- **JavaScript ES6+** - Logika aplikasi dan interaksi
- **IndexedDB** - Database lokal untuk penyimpanan data
- **Font Awesome** - Ikon yang menarik
- **Google Fonts** - Typography yang elegan

## Cara Menggunakan

1. Buka file `index.html` di browser
2. Mulai melakukan perhitungan dengan mengklik tombol atau menggunakan keyboard
3. Lihat riwayat perhitungan di panel sebelah kanan
4. Toggle tema gelap/terang dengan tombol di header
5. Hapus riwayat dengan tombol trash di panel riwayat

## Fitur Database

### Penyimpanan Otomatis
- Setiap perhitungan disimpan secara otomatis
- Termasuk ekspresi, hasil, dan timestamp
- Data tersimpan lokal di browser

### Riwayat Interaktif
- Klik item riwayat untuk menggunakan hasil sebelumnya
- Pencarian dalam riwayat
- Statistik penggunaan

### Pengaturan Tersimpan
- Preferensi tema tersimpan
- Pengaturan lain dapat ditambahkan

## Struktur File

```
├── index.html          # File utama HTML
├── styles.css          # Styling dan tema
├── calculator.js       # Logika kalkulator utama
├── database.js         # Manajemen database IndexedDB
└── README.md          # Dokumentasi
```

## Fitur Keamanan

- Validasi input untuk mencegah error
- Penanganan pembagian dengan nol
- Validasi domain untuk fungsi matematika
- Error handling yang komprehensif

## Browser Support

- Chrome 50+
- Firefox 44+
- Safari 10+
- Edge 79+

## Pengembangan Selanjutnya

Fitur yang dapat ditambahkan:
- Export/import riwayat
- Kalkulator matriks
- Konversi unit
- Grafik fungsi
- Mode programmer (binary, hex)
- Kalkulator finansial

## Lisensi

Aplikasi ini dibuat untuk tujuan edukasi dan dapat digunakan secara bebas.

---

**Dibuat dengan ❤️ menggunakan teknologi web modern**