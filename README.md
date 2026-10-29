# FoodRescue AI — Smart Surplus Food Management Platform

**Production-Grade, AI-Powered Food Waste Reduction & Redistribution System**

---

## 🌟 Executive Summary & Mission Directive

Every day, restaurants, hotels, grocery chains, and banquet kitchens discard millions of kilograms of wholesome, edible food. Simultaneously, food banks, shelters, and community soup kitchens struggle to source enough meals to alleviate local hunger.

**FoodRescue AI** eliminates this disconnect by deploying **Google Gemini AI** and **geospatial matching** to convert unpredictable surplus food into an urgent, structured, and auditable redistribution pipeline.

### Core Capabilities:
- **Gemini AI Spoilage & Urgency Modeling**: Assesses food category, temperature holding condition, elapsed preparation time, and packaging integrity to calculate microbial spoilage risk, time-to-distribute countdowns, and safe handling procedures.
- **Geospatial & Capacity Matching**: Uses the Haversine formula, dietary limits, and intake capacity to proactively connect surplus donations with the closest verified non-profit organizations.
- **Race-Condition-Proof Atomic Reservations**: PostgreSQL database functions (`reserve_food_quantity`) guarantee that concurrent requests never over-allocate inventory.
- **Verified Handover & ESG Impact Accounting**: Dual-party confirmation (donor handover + recipient collection) generates immutable impact records converting saved kilograms into meals provided, CO₂-equivalent landfill emissions avoided, and virtual water conserved.
- **Multi-Role Governance**: Tailored dashboards and workflows for **Food Donors**, **Recipient Charities**, and **Platform Administrators**.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, TypeScript, React Router v7, Tailwind CSS, TanStack Query, React Hook Form, Zod, Lucide React |
| **Backend** | Node.js, Express.js, TypeScript, REST API, Zod Validation, JWT Authentication |
| **Database** | PostgreSQL, Supabase (with migrations, RLS policies, atomic functions, check constraints) |
| **AI Integration** | Official `@google/genai` SDK (`gemini-2.5-flash`), structured JSON outputs, deterministic FDA Food Code fallback heuristics |
| **Testing** | Vitest, Supertest, Unit & Integration suites |

---

## 📂 Project Architecture

```
buildship/
├── package.json                          # Workspace orchestration
├── .env.example                          # Environment variable template
├── supabase/
│   ├── migrations/
│   │   └── 20261030000000_foodrescue_schema.sql  # Complete PostgreSQL schema, RLS, functions
│   └── seed.sql                          # Production seed dataset (donors, charities, listings)
├── server/                               # Backend API Service (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── config/                       # Environment variables & Supabase/Gemini clients
│   │   ├── controllers/                  # Auth, Listings, Requests, Advisories, Matching, Impact, Admin
│   │   ├── db/                           # Database repository & in-memory atomic persistence store
│   │   ├── middleware/                   # JWT & Supabase auth verification, RBAC guards
│   │   ├── routes/                       # Express REST endpoints
│   │   ├── schemas/                      # Zod validation schemas
│   │   ├── services/                     # GeminiService, MatchingEngine, ImpactCalculator
│   │   ├── types/                        # Domain interfaces
│   │   └── index.ts                      # Server entry point
│   ├── tests/                            # Vitest automated test suite
│   ├── package.json
│   └── tsconfig.json
├── client/                               # Frontend Single Page App (React 19 + Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/ProtectedRoute.tsx   # Role-based route guard
│   │   │   ├── layout/                   # Navbar, Footer, Sidebar, DashboardLayout
│   │   │   └── ui/                       # UrgencyBadge, SpoilageBadge, MetricCard, AIAdvisoryCard
│   │   ├── context/                      # AuthContext, ThemeContext
│   │   ├── lib/                          # API client with token injector, Supabase client
│   │   ├── pages/
│   │   │   ├── public/                   # Landing, Login, Register, Forgot/Reset Password, About, FoodSafety
│   │   │   ├── donor/                    # Dashboard, Listings, ListingNew (Live AI preview), Detail, Edit, Requests, Impact, Profile
│   │   │   ├── recipient/                # Dashboard, BrowseFood, Detail, Requests, ReceivedHistory, Impact, Profile
│   │   │   ├── admin/                    # Dashboard, OrganizationVerifications, Moderation, Users, Reports, Settings
│   │   │   └── shared/                   # Notifications, Settings, Unauthorized (403), NotFound (404)
│   │   ├── types/                        # Client domain types
│   │   ├── App.tsx                       # Full route tree
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── tsconfig.json
└── README.md
```

---

## 🚀 Quick Start & Installation

### 1. Prerequisites
- **Node.js** v18+ or v20+ installed
- **npm** v9+ installed

### 2. Install Dependencies
```bash
# In the server folder:
cd server
npm install

# In the client folder:
cd ../client
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root or `server/` directory:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Optional: Supabase PostgreSQL credentials
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional: Google Gemini API Key (defaults to deterministic FDA Food Code rules if empty)
GEMINI_API_KEY=your-google-gemini-api-key

JWT_SECRET=super-secret-jwt-key-foodrescue-2026
```

### 4. Running the Platform
Open two terminals or run simultaneously:

```bash
# Terminal 1: Backend API
cd server
npm run dev

# Terminal 2: Frontend Client
cd client
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## ⚡ Instant One-Click Reviewer Personas

For seamless evaluation, FoodRescue AI includes a built-in demo persona switcher on the top navigation bar and login screen:

| Persona Role | User Name | Organization | Focus Capabilities |
|---|---|---|---|
| **Food Donor** | Chef David Chen | Grand Plaza Hotel Catering | Create surplus listings with live Gemini AI analysis, track incoming requests, confirm handover. |
| **Recipient Charity** | Sister Teresa | Hope Metro Food Bank | Search surplus food with distance/urgency filters, submit intake requests, confirm collections. |
| **Platform Admin** | Elena Rostova | FoodRescue Operations | Review pending charity verifications, moderate listings, view ESG compliance reports. |

---

## 🤖 Gemini AI Advisory & Food Safety Architecture

### Spoilage Risk & Urgency Classification
1. **Urgency Levels**: `CRITICAL` (&lt;4 hr window), `HIGH` (&lt;12 hr window), `MEDIUM` (&lt;24 hr window), `LOW` (&gt;48 hr window).
2. **Spoilage Risk**: `LOW`, `MODERATE`, `HIGH`, `UNKNOWN`.
3. **Food Microbiology Rules**:
   - Cooked meals kept in hot-holding (&ge;60°C / 140°F) enter `CRITICAL` urgency to prevent bacterial multiplication in the temperature danger zone (4°C – 60°C).
   - Dairy approaching sell-by date receives `HIGH` urgency with mandatory unbroken cold chain requirements (&le;4°C).
   - Whole fresh produce and hermetically sealed pantry grains receive `LOW` urgency and longer redistribution windows.

### Mandatory Responsible AI Safeguards:
- The system **never** certifies food as 100% safe based solely on an AI prediction.
- Models emphasize uncertainty and mandate sensory, visual, packaging, and probe thermometer verification by trained intake volunteers.
- Comprehensive food safety guidelines and legal protections (including the **Bill Emerson Good Samaritan Food Donation Act**) are built into the platform.

---

## 🧪 Automated Testing

Run the automated backend test suite:
```bash
cd server
npm test
```

### Verified Test Cases:
- ✅ Haversine geodesic distance accuracy (km)
- ✅ Intelligent multi-factor matching engine and ranking
- ✅ Environmental impact formulas (EPA WARM & UN FAO factors)
- ✅ Spoilage risk and urgency classification heuristic
- ✅ Atomic quantity reservation preventing over-allocation
- ✅ Full request lifecycle and dual-party confirmation workflow

---

## 📄 License
MIT License. Built for zero food waste and community nourishment.

