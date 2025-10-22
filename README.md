# 🛍️ T-STORE — User-Friendly Product Management App

A full-stack web application that allows users to register, log in, and manage their own products.  
The project is divided into two parts: **frontend** and **backend**.

---

## 🚀 Features

### 👤 Users

- Sign up and sign in (JWT authentication)
- Password reset via email link
- Edit personal profile data (`My Profile` page)

### 🛒 Products

- Product list on the `Dashboard` page
- Filtering and search (search + filter + pagination work together)
- Add and edit products (only your own)
- Product owner indicator in the list
- Detailed product view (`Product Details` page)

### ❤️ Likes

- Any registered user can like or unlike products
- Likes are saved locally for guests (before login)
- When a guest logs in, their local likes are automatically merged with the ones from their account

---

## 🧱 Technologies Used

### Frontend

- React + TypeScript
- Effector (State Management)
- Pure CSS
- Custom Hooks
- Reusable API handler
- Custom StoryBook

### Backend

- Node.js + Express
- PostgreSQL + Sequelize ORM
- JWT Authentication
- Nodemailer (email reset link)
- TypeScript
- Docker Compose

---

## 🧰 Setup & Run

A) Using Docker (recommended)

1. Create .env files
   cp backend/.env_example backend/.env
   cp frontend/.env_example frontend/.env

2. Start all services
   docker compose up --build

3. Open
   Frontend: http://localhost:5173
   Backend: http://localhost:3000
   Storybook: http://localhost:6006

B) Run locally (without Docker)

1. Install dependencies
   cd backend && npm install
   cd ../frontend && npm install

2. Create .env files
   cp backend/.env_example backend/.env
   cp frontend/.env_example frontend/.env

3. Create database & run migrations
   CREATE DATABASE t-store;

cd backend
npm run db:migrate

4. Run apps

# Backend

cd backend
npm run dev

# Frontend (another cmd)

cd frontend
npm run dev

# Storybook

npm run storybook -- --no-open --host 0.0.0.0 -p 6006

## 📄 All pages

/ - Home
/products - Store
/products/new - Add product
/products/dd34-221ew-4... - Product detail
/products/dd34-221ew-4.../edit - Product edit
/account - My profile
/login- Sign in
/registration - Sign up
/forgot-password - Forgot password
/reset-password?token=eyJhbGci... - Reset password
