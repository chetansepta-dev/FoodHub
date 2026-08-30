# 🍔 FoodHub

A modern food ordering platform built with **Next.js** and **Supabase**. Order your favorite meals with an intuitive user interface and seamless authentication.

## ✨ Features

### User Features
- 🔐 **Authentication** - Secure sign up and login system
- 🍽️ **Menu Browsing** - Browse available food items with detailed product cards
- 🛒 **Shopping Cart** - Add items to cart and manage your orders
- 📦 **Order Management** - Place orders and track order history
- 👤 **User Profile** - View and manage profile information

### Admin Features
- 📊 **Admin Dashboard** - Centralized management hub
- 🍕 **Menu Management** - Add, edit, and manage food items
- 📋 **Order Tracking** - View and manage all customer orders

## 🛠️ Tech Stack

- **Frontend**: Next.js 14+ with TypeScript
- **Backend**: Supabase (PostgreSQL)
- **State Management**: React Context API
- **Styling**: CSS (Tailwind-ready structure)
- **Authentication**: Supabase Auth

## 📁 Project Structure

```
FoodHub/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── login/             # Login page
│   ├── signup/            # Sign up page
│   ├── menu/              # User menu browsing
│   ├── cart/              # Shopping cart
│   ├── orders/            # Order history
│   ├── profile/           # User profile
│   └── admin/             # Admin pages
│       ├── menu/          # Menu management
│       └── orders/        # Order management
├── components/            # Reusable React components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── FoodCard.tsx
│   └── Providers.tsx
├── context/              # React Context providers
│   ├── AuthContext.tsx
│   ├── CartContext.tsx
│   └── OrderContext.tsx
├── services/             # API service modules
│   ├── authService.ts
│   ├── menuService.ts
│   └── orderService.ts
├── lib/                  # Utilities
│   └── supabase.ts      # Supabase client setup
├── types/               # TypeScript type definitions
│   └── index.ts
├── public/              # Static assets
└── package.json         # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/FoodHub.git
cd FoodHub
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env.local` file in the root directory:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🗄️ Database Setup

Run the SQL scripts to initialize your database:

```bash
# Confirm existing users (if needed)
psql -d your_db -f confirm_users.sql

# Seed initial data
psql -d your_db -f seed.sql
```

Or use the Node.js seed script:
```bash
node seed.mjs
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔑 Key Services

### authService.ts
Handles user authentication, login, signup, and session management.

### menuService.ts
Fetches and manages food items and menu data.

### orderService.ts
Manages order creation, retrieval, and order history.

## 📦 Dependencies

- **Next.js** - React framework
- **TypeScript** - Type safety
- **Supabase** - Backend & Database
- **PostCSS** - CSS processing
- **ESLint** - Code linting

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

---

**Happy ordering! 🍕🍔🍜**
