<div align="center">

# 🏥 MediAssist AI

### Intelligent Medical Triage & Diagnostics Dashboard

**AI-powered preliminary clinical evaluations, medical report simplification, and smart hospital recommendations — all in one premium glassmorphic dashboard.**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Google Gemini](https://img.shields.io/badge/Google-Gemini_2.5_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)

> ⚠️ **Disclaimer:** MediAssist AI is for informational triage purposes only. It is NOT a replacement for professional medical diagnosis or advice. In case of emergency, contact local emergency services immediately.

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **AI Symptom Triage** | Enter symptoms, age, gender & pain level → Get risk assessment, probable conditions & dietary advice powered by Gemini 2.5 Flash |
| 🏥 **Smart Hospital Finder** | Uses your geolocation to recommend nearby specialist hospitals via AI |
| 📄 **Medical Report Simplification** | Upload a PDF/image of any medical report → AI translates complex jargon into plain English |
| 💬 **AI Chatbot** | Floating symptom-detection overlay chat assistant |
| 📊 **BMI Calculator** | Instant health classification with WHO-standard visual reference |
| 🔐 **Google SSO Auth** | Secure one-click Google Sign-In via Firebase Authentication |
| 🎨 **Glassmorphic UI** | Premium 3D parallax landing page with Framer Motion animations |

---

## 🛠️ Tech Stack

### Frontend (`medical-dashboard/`)
- **React 19** + **Vite 7** — Fast, modern frontend build
- **Tailwind CSS 4** — Utility-first styling with dark mode
- **Framer Motion** — 3D parallax scroll, spring animations, card tilt effects
- **Firebase SDK** — Google Sign-In authentication
- **Lucide React** — Clean, consistent iconography

### Backend (`medical-backend/`)
- **Node.js** + **Express** — RESTful API server
- **Google Generative AI SDK** — Gemini 2.5 Flash model integration
- **Multer** — Medical file/report uploads
- **SQLite3** — Local medical conditions database
- **dotenv** — Secure environment variable management

---

## 🗺️ System Architecture

```
[User Browser]
     │
     │  Google SSO
     ▼
[Landing Page (3D Parallax)]
     │
     │  Firebase Auth → Authenticated
     ▼
[MediAssist Dashboard]
     │           │              │
     ▼           ▼              ▼
[Symptom    [Report         [BMI
 Triage]     Upload]       Calculator]
     │           │
     └─────┬─────┘
           │  HTTP POST
           ▼
   [Express API Server]
           │
           ▼
   [Google Gemini 2.5 Flash]
           │
           ▼
   [Structured JSON Response]
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js v18+
- A Google Gemini API key → [Get one free at Google AI Studio](https://aistudio.google.com/)
- A Firebase project → [Firebase Console](https://console.firebase.google.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/mitul0427/Mediassit.git
cd Mediassit
```

### 2. Set Up the Backend

```bash
cd medical-backend
npm install
```

Create a `.env` file inside `medical-backend/`:

```env
PORT=3000
GEMINI_API_KEY=your_google_gemini_api_key_here
```

Seed the database and start the server:

```bash
node seed.js
node server.js
```
> Backend runs on `http://localhost:3000`

### 3. Set Up the Frontend

```bash
cd medical-dashboard
npm install
```

Create a `.env` file inside `medical-dashboard/`:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

Start the frontend:

```bash
npm run dev
```
> Frontend runs on `http://localhost:5173`

---

## 🌐 API Reference

### `POST /api/analyze`
Accepts patient demographics & symptoms, returns structured triage analysis.

**Request:**
```json
{
  "symptoms": ["fever", "cough", "fatigue"],
  "age": "28",
  "gender": "Female",
  "painLevel": 5
}
```

**Response:**
```json
{
  "riskLevel": "MODERATE",
  "alert": "Clinical Evaluation Recommended",
  "analysis": "...",
  "probableConditions": [{ "name": "Viral Infection", "percentage": 78 }],
  "dietaryAdvice": { "foodsToEat": ["Ginger tea"], "foodsToAvoid": ["Caffeine"] },
  "specialist": { "role": "General Physician" }
}
```

### `POST /api/analyze-report`
Accepts a medical report file (PDF/image), returns plain-English explanation.

**Request:** `multipart/form-data` with field `report`

### `POST /api/find-hospitals`
Returns nearby hospital recommendations based on coordinates and conditions.

---

## 📁 Project Structure

```
Mediassit/
├── medical-dashboard/          # ✅ ACTIVE — React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── LandingPage.jsx     # 3D Parallax Entry Portal
│   │   │   └── Chatbot.jsx         # Floating AI Symptom Chatbot
│   │   ├── App.jsx                 # Main Dashboard (Triage, Reports, BMI)
│   │   ├── MedicalApp.jsx          # Core layout container
│   │   └── firebase.config.js      # Firebase Auth setup
│   ├── .env.example                # Environment variable template
│   └── package.json
│
├── medical-backend/            # ✅ ACTIVE — Node.js Backend
│   ├── server.js                   # Express API + Gemini AI integration
│   ├── seed.js                     # Database seeding script
│   ├── uploads/                    # Temporary medical report uploads
│   ├── .env.example                # Environment variable template
│   └── package.json
│
├── client/                     # Legacy (RateMyFlick movie app - inactive)
├── server/                     # Legacy (RateMyFlick movie app - inactive)
└── README.md
```

---

## 🔐 Environment Variables

See `.env.example` files in each directory for the full list of required variables. Never commit real `.env` files — they are git-ignored by default.

| Variable | Location | Description |
|---|---|---|
| `GEMINI_API_KEY` | `medical-backend/.env` | Google Gemini AI API key |
| `PORT` | `medical-backend/.env` | Backend server port (default: 3000) |
| `VITE_FIREBASE_*` | `medical-dashboard/.env` | Firebase project credentials |

---

## 🤝 Contributing

Contributions, issues and feature requests are welcome. Feel free to open a PR or issue.

---

## 📜 License

This project is licensed under the MIT License.

---

<div align="center">

**Built with ❤️ for healthcare accessibility**

*MediAssist AI — Bridging patients and clinical insights through AI*

</div>
