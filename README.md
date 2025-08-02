# 🎮 Vizgames - Games Finder

**Vizgames** is a game search and exploration application built with **RAWG API** and **Supabase** integration. Users can search for games by title, genre, or platform, and save their favorite games to their personal account using Supabase authentication.

## 🚀 Key Features

- 🔍 Real-time game search using the [RAWG Video Games Database API](https://rawg.io/apidocs)
- 🗃️ Filter by genre, platform, and rating
- ❤️ Save favorite games (authenticated users only)
- 🕓 Recent search history
- 🔐 Login/Register with Supabase Auth
- 📦 Backend database powered by Supabase PostgreSQL
- ⚡ Built with React + Vite

## 🧰 Technologies Used

- ⚛️ **React + Vite** – High-performance interactive UI
- 🌐 **RAWG API** – Game data source (title, genre, rating, image, etc.)
- 🐘 **Supabase** – Auth, Realtime, and storage for favorites + recent searches
- 🧾 **Tailwind CSS** – Modern, responsive styling
- ☁️ **Vercel / Netlify** – For deployment (optional)

## 📦 Local Installation

1. **Clone the repository:**

```bash
git clone https://github.com/username/Vizgames-Games-Finder.git
cd Vizgames-Games-Finder
```

2. **Install dependencies:**

```bash
npm install
```

3. **Create environment file:**

```bash
cp .env.example .env
```

4. **Fill in the environment variables:**

```env
VITE_RAWG_API_KEY=your_rawg_api_key
VITE_SUPABASE_URL=https://xyzcompany.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

5. **Run the project:**

```bash
npm run dev
```

## 🛠️ Folder Structure

```
src/
├── components/        # UI Components
├── pages/             # Main pages (Home, Detail, Auth)
├── services/          # Supabase and RAWG API handlers
├── utils/             # Helper functions (formatting, auth guards)
├── assets/            # Logo and icons
└── App.jsx            # Root component
```

## 🔑 API & Supabase Setup

### RAWG API

- Register at [RAWG.io](https://rawg.io/apidocs)
- Generate your API key
- Add it to the `.env` file

### Supabase

- Create a project on [Supabase.io](https://app.supabase.com/)
- Enable **Authentication** (Email/Password)
- Create the following tables:

#### Table: `favorites`
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

#### Table: `recent`
```sql
create table recent (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  game_id text,
  game_title text,
  searched_at timestamp with time zone default now()
);
```

## 🖼️ Screenshots

> 📸 Screenshots will be added in the release version

## 📌 Upcoming Features

- 🔄 Infinite scroll and loading states
- 📱 Responsive mobile-first design
- 🧩 Game recommendation engine
- 🌙 Dark mode toggle

## 🤝 Contributions

Pull requests are welcome! Feel free to fork and help improve this project!

## 🧑‍💻 Developer

Made by **Muhammad Yusuf Aditiya (Myfza)**  
🔗 [GitHub](https://github.com/Myfza) | [LinkedIn](https://www.linkedin.com/in/myfza)
