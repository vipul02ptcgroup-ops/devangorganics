# 🌿 Devang Organics — Next.js E-Commerce Frontend

A complete, production-ready **black & gold luxury** themed organic e-commerce frontend for **Devang Organics**.

---

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the store.

---

## 🔐 Admin Panel

Visit: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

---

## 📄 Pages Included

### Public Store
| Page | Route |
|------|-------|
| Home | `/` |
| All Products | `/products` |
| Product Detail | `/products/[id]` |
| About | `/about` |
| Contact | `/contact` |
| Login | `/login` |
| Register | `/register` |
| User Profile | `/profile` |
| Cart | `/cart` |
| Checkout | `/checkout` |
| Order Success | `/order-success` |

### Admin Panel (`/admin/...`)
| Page | Route |
|------|-------|
| Dashboard | `/admin` |
| Products | `/admin/products` |
| Orders | `/admin/orders` |
| Customers | `/admin/customers` |
| Categories | `/admin/categories` |
| Settings | `/admin/settings` |
| Login | `/admin/login` |

---

## 🛍️ Product Categories
- 🍵 Organic Tea
- 🌿 Natural Herbs
- 🧼 Natural Soaps
- 🫙 Pickles
- 💧 Essential Oils
- 💊 Herbal Supplements

---

## ✨ Features
- **Cart Drawer** — slide-in cart with live count
- **Wishlist** — toggle heart on any product
- **Filters** — category + price range filter on products page
- **Search bar** — in header
- **Multi-step Checkout** — Address → Payment → Review
- **Order Tracking** — visual timeline on success page
- **Admin CRUD** — add/edit/delete products via modal
- **Order status** — editable inline dropdown in admin
- **Responsive** — mobile-friendly across all pages

---

## 🎨 Design System
- **Primary:** Gold `#C9A84C` / `#E8C96A`
- **Background:** Black `#0A0A0A`
- **Cards:** `#161616`
- **Fonts:** Cinzel (headings), Raleway (body), Cormorant Garamond (accents)

---

## 🔧 Tech Stack
- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Lucide React** (icons)
- **React Context** (cart & wishlist state)

---

## 📦 To Connect a Backend
All data is currently in `/lib/data.ts`. Replace with API calls (e.g., `fetch('/api/products')`) to connect to any backend (Node.js, Django, Supabase, etc.).
