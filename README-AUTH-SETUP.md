# 🔐 Authentication & Setup Guide

This document outlines the complete authentication flow and setup instructions for the **Divyaputri Tradex LLP** project. 

## 🔑 Key Authentication Features
*   **Secure Sign In / Sign Up:** Required before accessing the main website.
*   **Email Verification (OTP):** 6-digit OTP sent via SMTP email to verify email ownership.
*   **Password Hashing:** Passwords are securely hashed using `bcrypt` before saving to the database.
*   **JWT Sessions:** JSON Web Tokens (JWT) are used for secure login sessions.
*   **Separate Admin Portal:** A dedicated `/admin` login route.
*   **Role-Based Access Control:** Backend APIs are strictly protected; only admins can access the dashboard, view registered users, and read contact enquiries.
*   **Admin Dashboard:** Complete control panel to view stats and manage the platform.

---

## ⚙️ 1. Environment Configuration

You need to configure environment variables for both the backend and frontend.

### Backend (`server/.env`)
Create or open the `.env` file inside the `server` directory and fill in the following details:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_google_app_password
SMTP_FROM="Divyaputri Tradex <your_email@gmail.com>"
💡 Gmail Users Note: If you are using Gmail for SMTP, you must generate a Google App Password. Do not use your normal Gmail login password. You can generate an App Password from your Google Account Security settings.

Frontend (client/.env)
Create or open the .env file inside the client directory:

env
VITE_API_URL=http://localhost:5000
(If your backend is deployed, replace http://localhost:5000 with your deployed API URL, e.g., https://api.yourdomain.com)

👑 2. Admin Account Setup
A default admin account is configured for initial setup.

Default Credentials:

Email: admin@divyaputritradex.com

Password: ChangeThisToAStrongPassword123!

⚠️ CRITICAL WARNING: You MUST change the ADMIN_PASSWORD in your server/.env file before making the website public. Never use the default password in production.

Seeding the Admin Account
To create the admin user in your MongoDB database, run the following commands in the server terminal:

bash
cd server
npm install
npm run seed:admin
🚀 3. Running the Project Locally
Start the Backend
bash
cd server
npm run dev
Start the Frontend
Open a new terminal window:

bash
cd client
npm install
npm run dev
The frontend will run on http://localhost:5173 and the backend on http://localhost:5000.