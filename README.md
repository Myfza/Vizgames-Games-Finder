# 🎮 Vizgames - Games Finder

**Vizgames** adalah aplikasi pencarian dan eksplorasi game yang dibangun dengan integrasi **RAWG API** dan **Supabase**. Pengguna dapat mencari game berdasarkan judul, genre, atau platform, serta menyimpan game favorit mereka ke akun pribadi dengan autentikasi Supabase.

## 🚀 Fitur Utama

- 🔍 Pencarian game real-time menggunakan [RAWG Video Games Database API](https://rawg.io/apidocs)
- 🗃️ Filter berdasarkan genre, platform, dan rating
- ❤️ Simpan game favorit (authenticated user only)
- 🕓 Riwayat pencarian game terbaru (recent)
- 🔐 Login/Register dengan Supabase Auth
- 📦 Backend database menggunakan Supabase PostgreSQL
- ⚡ Built with React + Vite

## 🧰 Teknologi yang Digunakan

- ⚛️ **React + Vite** – UI interaktif dan performa tinggi
- 🌐 **RAWG API** – Sumber data game (title, genre, rating, image, dll)
- 🐘 **Supabase** – Auth, Realtime, dan penyimpanan game favorit + recent
- 🧾 **Tailwind CSS** – Styling modern dan responsif
- ☁️ **Vercel / Netlify** – Untuk deployment (opsional)

## 📦 Instalasi Lokal

1. **Clone repositori:**

```bash
git clone https://github.com/username/Vizgames-Games-Finder.git
cd Vizgames-Games-Finder
```

2. **Install dependencies:**

```bash
npm install
```

3. **Buat file environment:**

```bash
cp .env.example .env
```

4. **Isi environment variable:**

```env
VITE_RAWG_API_KEY=your_rawg_api_key
VITE_SUPABASE_URL=https://xyzcompany.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

5. **Jalankan proyek:**

```bash
npm run dev
```

## 🛠️ Struktur Folder

```
src/
├── components/        # Komponen UI
├── pages/             # Halaman utama (Home, Detail, Auth)
├── services/          # Supabase dan RAWG API handler
├── utils/             # Helper functions (formatting, auth guards)
├── assets/            # Logo dan icon
└── App.jsx            # Root component
```

## 🔑 API & Supabase Setup

### RAWG API

- Daftar di [RAWG.io](https://rawg.io/apidocs)
- Buat API key
- Masukkan ke dalam file `.env`

### Supabase

- Buat project di [Supabase.io](https://app.supabase.com/)
- Aktifkan fitur **Authentication** (Email/Password)
- Buat tabel berikut:

#### Tabel `favorites`
```sql
create table favorites (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  game_id text,
  game_title text,
  game_cover text,
  created_at timestamp with time zone default now()
);
```

#### Tabel `recent`
```sql
create table recent (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  game_id text,
  game_title text,
  searched_at timestamp with time zone default now()
);
```

## 🖼️ Tampilan

> 📸 Screenshot akan ditambahkan di versi rilis

## 📌 Rencana Fitur Selanjutnya

- 🔄 Infinite scroll dan loading state
- 📱 Responsif mobile-first design
- 🧩 Game recommendation engine
- 🌙 Dark mode toggle

## 🤝 Kontribusi

Pull request sangat terbuka! Jangan ragu untuk fork dan bantu kembangkan project ini!

## 🧑‍💻 Developer

Made by **Muhammad Yusuf Aditiya (Myfza)**  
🔗 [GitHub](https://github.com/Myfza) | [Linkedin](https://www.linkedin.com/in/myfza)
