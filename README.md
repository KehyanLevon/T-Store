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

---

### 1) Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install

2) Create .env files

You can copy the contents from .env_example and fill in your PostgreSQL and email credentials(you can use env_example email credentials).

3) Create PostgreSQL database
CREATE DATABASE t-store;

cd backend
npm run db:migrate
```

4. Run backend and frontend

# Backend

cd backend
npm run dev

# Frontend

cd ../frontend
npm run dev

# Story book

npm run storybook

5. All pages
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

//TODO: What about docker or deploy the project?
