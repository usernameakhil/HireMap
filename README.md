# 🗺️ HireMap - AI-Powered Career Intelligence SaaS Platform

HireMap is a complete AI-driven SaaS platform designed to bridge the gap between candidates and recruiters. It empowers students with intelligent career tools—such as ATS resume scoring, job-fit analyzers, resume comparison battles, and automated job discovery—while providing recruiters with advanced candidate filtering and verification dashboards.

The platform operates on a secure, transactional credit-based economy powered by Redis caching and Razorpay integrations.

---

## 🏗️ Complete SaaS Architecture & Connection Flow

The diagram below details the architecture, request flows, data persistence, cache sync, and external API integrations of the HireMap SaaS ecosystem:

![HireMap SaaS Platform Architecture](./hiremap_architecture.jpg)

```mermaid
graph TD
    %% Define User Roles
    subgraph Client-Side (Vite React App)
        FE[React Frontend]
        AuthContext[Auth Context / State]
        CoinStore[Coin Store UI]
    end

    subgraph Backend Server (Node.js Express App)
        Middleware[Auth Middleware & JWT Guard]
        Controllers[API Controllers]
        GeminiService[Google Generative AI Service]
        PaymentService[Razorpay Signature Verification]
        EmailService[Resend API Handler]
    end

    subgraph Databases & Caching
        MongoDB[(MongoDB Database)]
        Redis[(Redis Cache)]
    end

    subgraph External APIs & Services
        Gemini[Google Gemini 2.5 Flash]
        Razorpay[Razorpay Gateway]
        Resend[Resend Email API]
    end

    %% Client Frontend Request Flows
    FE -->|1. Actions / Uploads / Auth| Middleware
    AuthContext -->|Local Session state| FE
    
    %% Middleware Auth Checks
    Middleware -->|JWT Verification| Controllers
    Middleware -.->|Check Session Cache| Redis

    %% Database Flows
    Controllers -->|Read / Write| MongoDB
    Controllers -->|Read / Write Cache| Redis
    MongoDB <-->|Cache-Aside Sync| Redis

    %% Controllers calling Third-Party Services
    Controllers -->|Resume Analysis, Fit & Battle Requests| GeminiService
    GeminiService -->|Generate JSON response| Gemini
    Gemini -.->|Parsed Resume & Scores| GeminiService
    
    Controllers -->|Generate payment order / Verify payload| PaymentService
    PaymentService -->|Verify cryptographic SHA256| Razorpay
    
    Controllers -->|Send system mail / OTP verification| EmailService
    EmailService -->|Deliver SMTP / API mail| Resend

    %% Credit-System Logic Flow
    CoinStore -->|Purchase Coins Request| Controllers
    Controllers -->|Atomic credit increment| MongoDB
    Controllers -->|Immediate Cache-aside invalidate/update| Redis
    
    %% AI actions requiring credits
    Controllers -->|HireFit / Job Discovery (-2 Credits)| MongoDB
```

---

## 🛠️ Technology Stack Breakdown

### Frontend (Client App)
* **Framework**: React (v19) configured via Vite (v7) for optimal Hot Module Replacement (HMR).
* **Styling**: Tailwind CSS (v4) with Custom CSS variables for modern dark-mode glassmorphism and animations.
* **State Management**: React Context (`AuthContext`) for distributed session tracking.
* **Routing**: React Router DOM (v7) managing authenticated pages under a unified `DashboardLayout`.
* **Animations**: Framer Motion (v12) for smooth UI transitions and micro-interactions.
* **PDF Utility**: `pdfjs-dist` (v5) and `jspdf` (v4) for frontend-side PDF reading and previews.

### Backend (Server API)
* **Runtime**: Node.js with Express framework.
* **Security & Auth**: JSON Web Tokens (`jsonwebtoken`) + Passport.js (Google OAuth 2.0).
* **Database Object Modeling**: Mongoose for structuring schemas.
* **Caching & Session Cache**: Redis client for ultra-fast profile retrieval and database read-reduction.
* **File Upload Processing**: Multer middleware storing local PDF binaries.

### Third-Party Services
* **AI Orchestrator**: `GoogleGenerativeAI` SDK targeting `gemini-2.5-flash` for high-speed deterministic JSON generation.
* **Payment Gateway**: `Razorpay` SDK for credit packages purchase.
* **Transactional Email**: `Resend` SDK for registering OTPs, contact submissions, and recruiter collaboration alerts.

---

## 🌟 Core Features & Execution Mechanics

### 1. AI Resume Parser & ATS Scoring Engine (`ResumeAI`)
* **How it works**: The user uploads their resume PDF. Express routes the file to Gemini 2.5 Flash with a dynamic rubric prompt. 
* **The Parsing Rubric**: Gemini automatically infers the candidate's professional domain (e.g., Software Engineering, Data Science, HR) and applies strict mathematical validation:
  * Contact Info (Max 8 pts)
  * Skills Relevance matching inferred domain (Max 25 pts)
  * Experience quality/role progression (Max 22 pts)
  * Education credentials (Max 15 pts)
  * Quantified impact bullets (Max 15 pts)
  * Single-column formatting alignment (Max 10 pts)
  * Penalties for missing dates or layout graphics.
* **Output**: Writes the extracted resume details and calculated score directly to MongoDB.

### 2. Resume Battle (`ResumeBattle`)
* **How it works**: Compares two PDF resumes head-to-head for a specific tech/business role.
* **AI Logic**: Gemini grades both inputs, compiles detailed score breakdowns (Impact, Skills, Formatting), details strengths/weaknesses for both, and outputs a clean JSON verdict declaring a clear winner.

### 3. HireFit Analyzer (`HireFit`)
* **How it works**: Scores a candidate's resume match against a user-submitted Job Description.
* **Payment Safeguard**: Costs **2 credits**. The system performs an atomic check-and-deduct query on MongoDB before invoking the AI, then synchronizes the updated balance with the Redis cache.
* **AI Logic**: Returns a matching percentage, skill gaps, critical missing keywords, and specific profile recommendations to improve suitability.

### 4. Job Discovery & Deep Linking (`JobDiscovery`)
* **How it works**: Uses location, target role, experience levels, and work preferences to find the best platforms.
* **AI Logic**: Costs **2 credits**. Google Gemini queries and builds exact encoded deep-search URLs for popular regional job boards (such as LinkedIn, Indeed, Glassdoor) pre-filtered for the student's profile.

### 5. Secure Coin Store & Transaction Log (`CoinStore`)
* **How it works**: Students purchase coin packages (e.g., 50 coins for ₹99).
* **Security Protocol**:
  1. Frontend submits order request to `/api/payments/create-order`.
  2. Server registers a transaction with a unique ID and requests a corresponding order from Razorpay.
  3. User completes payment on the client via Razorpay's Checkout popup.
  4. Razorpay returns token credentials to `/api/payments/verify`.
  5. The server calculates the SHA256 HMAC of the payload using `RAZORPAY_KEY_SECRET`. 
  6. On successful match, the user's coins are atomically updated in MongoDB, and the Redis cache-aside is updated to reflect the new wallet balance instantly.

---

## 🚀 Local Deployment Guide

Follow these steps to run the complete SaaS platform locally.

### 📋 Prerequisites
* **Node.js** (v18 or higher recommended)
* **MongoDB** (Local instance or MongoDB Atlas URI)
* **Redis** (Local Redis server running on default port `6379`, or a cloud Redis URL instance)

---

### ⚙️ Step 1: Set Up Environment Variables

#### 💻 Server Environment File
Create a `.env` file inside the `server/` directory:
```bash
touch server/.env
```
Populate the file with the following variables:
```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/hiremap
REDIS_URL=redis://127.0.0.1:6379
JWT_SECRET=YOUR_SUPER_SECRET_JWT_KEY
GEMINI_API_KEY=YOUR_GOOGLE_GEMINI_API_KEY
GOOGLE_CLIENT_ID=YOUR_GOOGLE_OAUTH_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_OAUTH_CLIENT_SECRET
CLIENT_URL=http://localhost:5173
RAZORPAY_KEY_ID=YOUR_RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_RAZORPAY_KEY_SECRET
RESEND_API_KEY=YOUR_RESEND_API_KEY
ADMIN_EMAIL=your-support-email@domain.com
INTERNAL_URL=http://localhost:5001
```

#### 🌐 Client Environment File
Create a `.env` file inside the `client/01/` directory:
```bash
touch client/01/.env
```
Populate the file with the following variables:
```env
VITE_API_URL=http://localhost:5001
VITE_RAZORPAY_KEY_ID=YOUR_RAZORPAY_KEY_ID
```

---

### 📦 Step 2: Install Dependencies

#### 1. Install Server Dependencies:
```bash
cd server
npm install
```

#### 2. Install Client Dependencies:
```bash
cd ../client/01
npm install
```

---

### 🔌 Step 3: Run the Application

Start your local MongoDB and Redis instances first. Then, open two separate terminal instances:

#### Terminal 1: Start Backend API
```bash
cd server
npm run dev
```
*The server will start listening on port `5001` (or the PORT defined in your `.env`). It will connect to MongoDB, verify environment variables, set up Google OAuth, and connect to your Redis client instance.*

#### Terminal 2: Start Client App
```bash
cd client/01
npm run dev
```
*The client app will launch a Vite development server, usually on `http://localhost:5173`.*

Open your browser and navigate to `http://localhost:5173` to explore HireMap!

---

## ⚡ Keep-Alive / Health Check Configuration (Free Hosting Tiers)

Free hosting services (like Render, Koyeb, Glitch, etc.) put servers to sleep after a period of inactivity (usually 15-30 minutes). To prevent this, the backend exposes a health check endpoint:

* **Endpoint**: `GET /api/health`
* **Response**: `{ "status": "UP", "timestamp": "...", "uptime": ... }`

### How to set up a Cron Job to keep it alive:

1. **Option A: UptimeRobot / Cron-Job.org (Recommended)**
   * Register on a free ping service (like [cron-job.org](https://cron-job.org/) or [UptimeRobot](https://uptimerobot.com/)).
   * Add a new monitor targeting your deployed backend API URL (e.g., `https://your-hiremap-api.onrender.com/api/health`).
   * Set the interval to check every **14 minutes**.

2. **Option B: GitHub Actions Cron**
   Create a `.github/workflows/keepalive.yml` workflow file:
   ```yaml
   name: Keep-Alive
   on:
     schedule:
       - cron: '*/14 * * * *' # Run every 14 minutes
   jobs:
     ping:
       runs-on: ubuntu-latest
       steps:
         - name: Ping Health Endpoint
           run: curl -s https://your-hiremap-api.onrender.com/api/health
   ```
