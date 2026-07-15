# MoodBuddy — AI-Powered Mood Check-In & Companion

MoodBuddy is a lightweight, full-stack web application designed for students and users to quickly check in on their moods, reflect, receive encouraging support from an AI, and practice mindfulness through playful calming exercises. 

MoodBuddy is a supportive exercise companion and **not a clinical diagnostic tool**. It is built using **React (Vite)** on the frontend and **Node.js (Express)** with raw **PostgreSQL** SQL connections on the backend.

---

## Key Features

1. **Interactive Mood Check-In**: A 5-step checklist (Mood card selection, color palette picker, multi-select tag chips, optional 200-char note).
2. **AI Streaming Feedback (SSE)**: The backend prompts the Google Gemini API with strict non-clinical validation guidelines and streams the response token-by-token using Server-Sent Events. Includes a mock-streaming fallback if no API key is provided!
3. **Calming Mini-Activities**:
   - **Breathing Rainbow**: A visual 16-second box-breathing cycle guide (Breathe In → Hold → Breathe Out → Hold).
   - **Music Suggestions**: Embedded Spotify players covering Lo-Fi, Rain, Piano, Ocean, Forest, and Nature.
   - **Mood Doodle**: HTML5 Canvas sketchpad supporting custom brush size, preset & custom color selectors, eraser, undo actions, and local image downloads.
   - **Color Match Rush**: A reflex mini-game instructing the user to tap specific color dots. Gets faster with levels, tracks high scores, and uses the **Web Audio API** to generate sound effects dynamically.
4. **Dashboard & History**: Displays user metrics (streaks, total check-ins) and a Line Trend Chart (Chart.js) plotting mood scores over the last 30 entries.

---

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Lucide Icons, Chart.js, Canvas Confetti.
- **Backend**: Node.js, Express, pg (native PostgreSQL client), CORS, Helmet (security headers).
- **Database**: PostgreSQL (Raw SQL table setup with automatic database initialization on startup).
- **AI Integration**: Google Gemini API SDK (`@google/generative-ai` streaming endpoint).

---

## Project Structure

```text
MoodBuddy/
  ├── frontend/
  │   ├── public/
  │   ├── src/
  │   │   ├── components/      # BreathingRainbow, MusicSuggestions, MoodDoodle, ColorMatchRush, Navbar
  │   │   ├── pages/           # Landing, Dashboard, MoodCheck, MoodResult, Activities, Profile
  │   │   ├── services/        # api.js (SSE stream parser & fetch client)
  │   │   ├── index.css        # Tailwind and claymorphism utilities
  │   │   ├── App.jsx          # Router paths
  │   │   └── main.jsx
  │   ├── index.html
  │   ├── package.json
  │   ├── vite.config.js
  │   └── tailwind.config.js
  │
  ├── backend/
  │   ├── src/
  │   │   ├── database/
  │   │   │   └── db.js        # PostgreSQL pool configuration & DDL table creator
  │   │   ├── routes/          # Express routing (mood, profile)
  │   │   ├── controllers/     # Controller handlers (SSE stream & history)
  │   │   ├── services/        # geminiService.js (Gemini API & Mock Fallback)
  │   │   ├── middleware/      # errorHandler.js, validator.js
  │   │   ├── app.js           # Server configuration & security setup
  │   │   └── server.js        # Server start scripts
  │   ├── package.json
  │   └── .env.example
  │
  ├── README.md
  └── .gitignore
```

---

## Local Setup Instructions

### Prerequisite 1: PostgreSQL Setup via pgAdmin
1. Open **pgAdmin** and connect to your local PostgreSQL server.
2. Right-click on **Databases** → **Create** → **Database...**.
3. Name your database `moodbuddy` and click **Save**.
4. Keep pgAdmin open to inspect tables once you start the server!

### Prerequisite 2: Environment Variables
Create a `.env` file in the **backend** and **frontend** directories by copying the provided `.env.example` templates.

#### Backend Env (`backend/.env`)
Create `backend/.env` with the following variables:
```env
PORT=5000
DATABASE_URL=postgresql://<username>:<password>@localhost:5432/moodbuddy
GEMINI_API_KEY=your_actual_gemini_api_key
CLIENT_URL=http://localhost:5173
```
*Note: Replace `<username>` and `<password>` with your PostgreSQL server connection details (default username is usually `postgres`). If you do not have a Gemini API key, leave the placeholder or leave it empty, and MoodBuddy will automatically activate its smart mock-streaming fallback so the app remains fully functional!*

#### Frontend Env (`frontend/.env`)
Create `frontend/.env` with the following variable:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

### Step 3: Run the Backend Server
Open a terminal in the root directory, navigate to `backend/`, and start the dev server:
```bash
cd backend
npm install
npm run dev
```
On startup, the server will connect to PostgreSQL, run the SQL script to create tables (`mood_entries`, `user_profiles`), and seed a default profile.

### Step 4: Run the Frontend Client
Open a second terminal in the root directory, navigate to `frontend/`, and start the Vite dev server:
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to experience MoodBuddy!

---

## Disclaimer
MoodBuddy is a supportive, college project web application designed for relaxation. It is **not** a clinical diagnostic tool or medical therapy app. It does not provide medical advice. If you or someone you know is in a mental health crisis, please consult professional healthcare providers or national helplines.
