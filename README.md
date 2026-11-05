# Link Page — UMKM MUjahir-MUhajir (Ikan Mujair Mentah Segar)

Link in bio / halaman mini-katalog resmi untuk **UMKM MUjahir-MUhajir**, spesialis penyedia **ikan mujair mentah segar** langsung panen dari kolam air mengalir alami pegunungan di Sukabumi.

Melayani penjualan ikan mujair mentah kiloan (ukuran sedang & jumbo), ikan mentah bersih siap bumbui, partai grosir untuk warung makan/restoran, hingga bibit benih ikan hidup unggul.

Dikembangkan berdasarkan kurikulum **Web 101: Pertemuan 1 - 4 (Semantic HTML, Tailwind CSS, JavaScript DOM & State Management / Tiny React)**.

---

## 🐟 Karakteristik Produk (Khusus Ikan Mentah)

- **Murni Ikan Mentah Segar**: Tidak menjual makanan olahan/matang. Ikan dipanen langsung dari kolam air deras alami.
- **Kualitas Daging Terjamin**: Bebas bau lumpur/tanah karena sirkulasi air pegunungan yang jernih dan mengalir terus-menerus.
- **Layanan Pembersihan Gratis**: Pelanggan dapat meminta ikan mentah dikirim dalam kondisi hidup utuh, segar dingin dengan es batu, maupun bersih sisik dan jeroan (tanpa biaya tambahan).

---

## ✨ Fitur Unggulan

1. **Modal Detail & Cek Timbangan (Cegah Langsung ke WhatsApp):**
   - Mengklik kartu ikan mentah **tidak langsung membuka WhatsApp**.
   - Menampilkan popup interaktif berisi spesifikasi ukuran, isi per kg, harga resmi, dan kalkulator jumlah timbangan.
   - Pengunjung dapat memilih kondisi pengiriman (hidup, segar dingin es, atau bersih sisik) dan menambahkan catatan timbangan sebelum memutuskan menekan tombol *"Pesan ke WhatsApp"*.

2. **Desain Visual & Palet Warna Menarik (*Fresh Teal & Emerald*):**
   - Nuansa segar air kolam alami dengan tipografi jelas dan mudah dibaca oleh pembeli.
   - Responsif di berbagai ukuran layar (ponsel, tablet, desktop).

3. **Pola State & Render (Tiny React):**
   - Pengelolaan data satu pintu (`state`) dan fungsi render reaktif.
   - Pengambilan data dari `data/links.json` dengan penanganan status *loading*, *error*, dan *empty state*.

4. **Mode Gelap / Terang (Dark Mode):**
   - Toggle instan `🌙` / `☀️` tersimpan di `localStorage` tanpa kedipan (*flicker*).

---

## 📁 Struktur File

```text
linkpage_umkm/
├── index.html         # Struktur Semantic HTML5 & layout Tailwind CSS
├── script.js          # State Management, Modal Ikan Mentah, Filter, & Dark Mode
├── avatar.svg         # Logo/Avatar maskot Ikan Mujair UMKM
├── README.md          # Dokumentasi proyek
└── data/
    └── links.json     # Data katalog ikan mentah, kontak WhatsApp & sosmed
```

---

## 🚀 Cara Menjalankan

1. **Menggunakan VS Code Live Server:**
   - Buka folder `linkpage_umkm` di VS Code.
   - Klik kanan `index.html` → pilih **Open with Live Server**.

2. **Menggunakan XAMPP:**
   - Letakkan folder di `c:\xampp\htdocs\linkpage_umkm`.
   - Aktifkan Apache di XAMPP Control Panel.
   - Buka di browser: `http://localhost/linkpage_umkm/`.

---

© 2026 UMKM MUjahir-MUhajir · Ikan Mujair Mentah Segar Kolam
