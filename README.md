# Divyaputri Tradex LLP — MERN Website 🚀

A fully responsive, modern, and AI-powered full-stack website built for **Divyaputri Tradex LLP** (Nano Technology & Multi-Category Products).

This project features a complete React frontend with advanced UI/UX and an Express/MongoDB backend for handling user data, contact forms, and AI integrations.

## ✨ Key Features

*   **📱 Fully Responsive Design:** Optimized for Desktop, Tablet, and Mobile views (Cards, Tables, and Grids adapt beautifully).
*   **🤖 AI-Powered Tools:**
    *   **AI Product Scanner:** Upload a photo of machinery/equipment to get the best product recommendations.
    *   **AI Market Analyzer:** Select an industry (Electronics, Medical, etc.) to get real-time market trends and strategic insights.
    *   **AI Document Reader:** Upload PDFs or Images for instant AI analysis.
*   **🔐 Admin Dashboard:**
    *   Secure admin login.
    *   View real-time stats (Contacts, Users, Chat Messages).
    *   Manage Contact Submissions with an optimized mobile Card View.
    *   Generate AI Business Insights and Competitor Analysis.
*   **🎨 Modern UI/UX:** Built with Framer Motion for smooth animations, custom dark mode support, and a premium feel.

## 🛠️ Tech Stack

**Frontend:**
*   React.js (Vite)
*   CSS3 (Custom Variables & Media Queries)
*   Framer Motion (Animations)
*   React Icons
*   React Markdown

**Backend:**
*   Node.js
*   Express.js
*   MongoDB (Mongoose)
*   JWT (Authentication)
*   Multer (File Uploads)

## 📂 Folder Structure

```text
divyaputri-tradex-india/
├── client/          # React Frontend (Vite)
│   ├── src/
│   │   ├── components/  # Reusable UI Components
│   │   ├── pages/       # Page Layouts (Home, Admin, etc.)
│   │   └── assets/      # Images & Styles
│   └── package.json
├── server/          # Express Backend
│   ├── models/      # MongoDB Schemas
│   ├── routes/      # API Endpoints
│   ├── controllers/ # Logic
│   └── package.json
└── README.md
🚀 Getting Started
Prerequisites
Node.js (v18 or higher)

MongoDB Atlas Account (or local MongoDB)

API Keys for AI features (OpenAI / Gemini / Claude)

Installation
Clone the repository:

bash
git clone https://github.com/iamdeveloper17/divyaputri-tradex-india.git
cd divyaputri-tradex-india
Setup the Backend (Server):

bash
cd server
npm install
Create a .env file in the server folder and add the following:

env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
AI_API_KEY=your_openai_or_gemini_api_key
Start the server:

bash
npm run dev
Setup the Frontend (Client):
Open a new terminal window.

bash
cd client
npm install
Create a .env file in the client folder and add the API URL:

env
VITE_API_URL=http://localhost:5000
Start the frontend:

bash
npm run dev
Access the App:

Frontend: http://localhost:5173

Backend: http://localhost:5000

👨‍💻 Author
Amit Kumar

GitHub: @iamdeveloper17

Project Link: Divyaputri Tradex India

Made with ❤️ for Divyaputri Tradex LLP.