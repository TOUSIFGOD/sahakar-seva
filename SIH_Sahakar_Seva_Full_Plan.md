# SIH 2026 — Full Execution Plan (Refined & Enhanced)
## Cooperative Gig Services Platform for Household & Community Services
**Working Name: Sahakar Seva** ("Sahakar" = cooperation, "Seva" = service)

**Organization:** Ministry of Cooperation | **Department:** National Council for Cooperative Training (NCCT) | **Theme:** Smart Automation | **Category:** Software

---

## 1. Market Research & Positioning

### 1.1 Competitive Positioning Matrix

| Feature | Urban Company | eShram Portal | WhatsApp / Contractors | **Sahakar Seva** |
|:---|:---:|:---:|:---:|:---:|
| **Digital Booking Marketplace** | ✅ | ❌ | ❌ | **✅ Live on Web & Mobile** |
| **Worker Ownership & Equity** | ❌ (Extractive) | ❌ | ❌ | **✅ Cooperative Federations** |
| **Commission Rate** | 15% – 30% cut | N/A | Variable / High | **5% (Cooperative Welfare Fund only)** |
| **Direct Worker Take-Home** | 70% – 85% | N/A | Uncertain | **95% Guaranteed Immediate Payout** |
| **Govt Credential Integration** | ❌ (Private KYC) | ✅ (Database only) | ❌ (Unverified) | **✅ e-Shram & Skill India Digital** |
| **Default Worker Welfare & Insurance** | ❌ (Optional add-on) | ❌ | ❌ | **✅ PMJJBY / PMSBY / PM-JAY Linked** |
| **Predictive AI Demand Planning** | ✅ (Proprietary) | ❌ | ❌ | **✅ Proactive Local Allocation** |
| **Tier-2 / Tier-3 & Rural Reach** | ❌ (Metro-centric) | ✅ | ✅ | **✅ Multi-State Cooperative Roots** |
| **Federation Governance Hierarchy** | ❌ | ❌ | ❌ | **✅ State Fed ➔ Local Society ➔ Worker** |

### 1.2 Existing Solutions in the Market

| Player | Model | Relevant to this problem? |
|---|---|---|
| **Urban Company** | Private aggregator, gig workers, commission-heavy (15–30% cut) | Closest private competitor; fully profit-driven with worker strikes over commissions |
| **Housejoy / Zimmber (defunct)** | Private aggregators, folded due to unit economics | Demonstrates that high customer acquisition cost without worker retention fails |
| **NoBroker Services** | Private, add-on to real estate portal | Narrow service list, urban-only focus |
| **Local WhatsApp / Contractor Middlemen** | Informal, unverified intermediaries | Dominates 80%+ of Tier-2/3 cities and rural India — zero trust layer & price gouging |
| **Labour Cooperative Societies (under State Acts)** | Offline, manual job allocation, no digital presence | High-skill workforce (~8.5 lakh registered societies), but completely undigitized |
| **Government Portals (eShram, Skill India)** | Worker registration & certification repository | Crucial data layer, but lacks a transactional marketplace storefront |

### 1.3 Quantified Gaps & Unmet Needs
- **Worker side:** Private platforms extract **15% to 30%** of worker revenue, impose punitive rating algorithms, and lack institutional health insurance or pension linkages.
- **Customer side:** Over **72%** of households in Tier-2/3 cities report trust deficits with unverified informal contractors, suffering from price volatility and no-show risks.
- **Cooperative side:** Out of India's **~8.5 lakh registered cooperative societies**, fewer than **1%** have digital booking or scheduling capabilities, leaving millions of trained workers underutilized.
- **Systemic gap:** No existing platform connects (a) cooperative ownership, (b) verified government e-Shram credentials, (c) 95% worker earnings retention, and (d) AI-driven seasonal demand allocation.

### 1.4 Regulatory & Policy Tailwinds
- **Multi-State Cooperative Societies (Amendment) Act, 2023:** Mandates modernization, transparency, and digital enablement of cooperative societies.
- **National Cooperative Policy & "Sahkar se Samriddhi":** The Ministry of Cooperation's mission to leverage digital infrastructure to empower grassroots cooperative federations.
- **e-Shram Digital Highway:** Over **30 Crore** unorganized workers registered with Universal Account Numbers (UAN), providing verified identities ready for marketplace integration.
- **UPI Digital Stack:** Over **16+ Billion** monthly UPI transactions enabling zero-cost, instant milestone payouts directly to worker bank accounts.

---

## 2. Minimum Viable Product (MVP) Scope & Priority Tiers

### 2.1 Feature Prioritization

| Tier | Feature | Description | Implementation Status |
|:---:|:---|:---|:---:|
| **P0** | **Multi-Role Auth & Quick Switcher** | Customer, Worker, and Cooperative Admin role access | Built & Functional |
| **P0** | **Service Catalog & Booking Flow** | Categorized services, date/time slot selection, real-time booking lifecycle | Built & Functional |
| **P0** | **Cooperative Admin Operations Hub** | GMV counters, 95% worker payout metrics, 5% welfare fund tracker | Built & Functional |
| **P1** | **Worker Profile & Govt Verification** | e-Shram UAN badge, Skill India level, PMJJBY insurance coverage status | Built & Functional |
| **P1** | **Interactive Geo-Matching & Proximity** | Dynamic distance calculation & Leaflet map worker radius visualization | Built & Functional |
| **P1** | **Transparent 95%-5% Payout Engine** | Clear fee breakdown on worker & customer receipts vs 25% private platform cut | Built & Functional |
| **P1** | **Feedback & 5-Star Review Engine** | Post-service rating, customer review feed, and worker aggregate score | Built & Functional |
| **P2** | **Sandbox Payment & Cooperative Invoice** | Simulated Razorpay / UPI flow with instant printable cooperative invoice | Built & Functional |
| **P2** | **AI Demand Forecasting Engine** | Time-series projection of seasonal service surges with allocation advice | Built & Functional |
| **P2** | **Bilingual Toggle (English + हिन्दी)** | Seamless UI localization for Tier-2/3 accessibility | Built & Functional |

---

## 3. Unique Selling Propositions (USPs)

1. **"Profit Stays With the People Who Do the Work" (95% Take-Home):**
   - 95% goes directly to the worker immediately upon job completion.
   - 5% goes into the Cooperative Society Welfare & Training Fund (pensions, tool subsidization, emergency loans).
   - Zero private equity dividend extraction.

2. **Government-Linked Trust Architecture:**
   - Worker profiles display verified **e-Shram UAN**, **Skill India Digital Certification (NSQF)**, and **Aadhaar-linked police clearance badges**.

3. **Welfare-by-Default:**
   - Instant verification of coverage under **PMJJBY** (Life Insurance), **PMSBY** (Accident Insurance), and **Ayushman Bharat PM-JAY** (Health).

4. **AI-Driven Proactive Workforce Mobilization:**
   - Time-series demand forecasting warns local societies ahead of seasonal peaks (e.g., monsoon electrical/roofing surge, Diwali deep cleaning surge) to pre-allocate apprentices.

5. **Built for Bharat First:**
   - Native bilingual English/Hindi interface, simplified one-touch booking, low-bandwidth optimization, and offline-resilient architecture.

---

## 4. Technical Architecture (Option 1: Production-Ready Node.js + SQL)

### 4.1 System Components
- **Frontend:** Semantic HTML5, Vanilla CSS3 (Custom Design System with Glassmorphism & High-Contrast Tri-Color Accents), Modern ES6+ JavaScript, Leaflet.js Maps, Chart.js Analytics.
- **Backend:** Node.js + Express.js REST API Server.
- **Database:** Relational Data Model (PostgreSQL / SQLite compatible schema with in-memory persistence for live demo).
- **AI Forecasting Engine:** Node.js Time-Series Regression & Seasonal Trend Analysis Module.
- **Payment Sandbox:** Simulated Razorpay & UPI Intent Simulator with HTML/PDF printable Cooperative Receipts.

### 4.2 Database Schema

```sql
-- Users and Authentication Roles
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(15) UNIQUE NOT NULL,
  role VARCHAR(20) CHECK (role IN ('customer', 'worker', 'coop_admin', 'federation_admin')),
  language_preference VARCHAR(10) DEFAULT 'en',
  address TEXT,
  lat DECIMAL(10, 6),
  lng DECIMAL(10, 6),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cooperative Societies
CREATE TABLE cooperatives (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  registration_no VARCHAR(50) UNIQUE NOT NULL,
  state VARCHAR(50) NOT NULL,
  district VARCHAR(50) NOT NULL,
  total_workers INT DEFAULT 0,
  welfare_fund_balance DECIMAL(12, 2) DEFAULT 0.00,
  admin_user_id VARCHAR(36) REFERENCES users(id)
);

-- Worker Profiles & Government Credentials
CREATE TABLE worker_profiles (
  user_id VARCHAR(36) PRIMARY KEY REFERENCES users(id),
  cooperative_id VARCHAR(36) REFERENCES cooperatives(id),
  trade VARCHAR(50) NOT NULL,
  experience_years INT DEFAULT 1,
  hourly_rate DECIMAL(8, 2) NOT NULL,
  eshram_uan VARCHAR(20),
  skill_india_cert_id VARCHAR(50),
  is_verified BOOLEAN DEFAULT FALSE,
  insurance_active BOOLEAN DEFAULT TRUE,
  insurance_scheme VARCHAR(100) DEFAULT 'PMJJBY + PMSBY Covered',
  rating DECIMAL(3, 2) DEFAULT 5.00,
  total_jobs_completed INT DEFAULT 0,
  is_available BOOLEAN DEFAULT TRUE
);

-- Services Catalog
CREATE TABLE services (
  id VARCHAR(36) PRIMARY KEY,
  category VARCHAR(50) NOT NULL,
  title VARCHAR(100) NOT NULL,
  title_hi VARCHAR(100) NOT NULL,
  base_rate DECIMAL(8, 2) NOT NULL,
  unit VARCHAR(30) DEFAULT 'per job',
  description TEXT
);

-- Bookings & Transparent Payout Ledger
CREATE TABLE bookings (
  id VARCHAR(36) PRIMARY KEY,
  customer_id VARCHAR(36) REFERENCES users(id),
  worker_id VARCHAR(36) REFERENCES users(id),
  service_id VARCHAR(36) REFERENCES services(id),
  status VARCHAR(20) CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  scheduled_time TIMESTAMP NOT NULL,
  customer_address TEXT NOT NULL,
  gross_amount DECIMAL(10, 2) NOT NULL,
  worker_payout DECIMAL(10, 2) NOT NULL,      -- 95%
  cooperative_welfare_cut DECIMAL(10, 2) NOT NULL, -- 5%
  payment_method VARCHAR(20) DEFAULT 'UPI',
  payment_status VARCHAR(20) DEFAULT 'paid',
  rating INT,
  feedback TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4.3 REST API Endpoints

```
-- Authentication & Demo State
GET    /api/auth/roles               - Retrieve switchable demo personas
POST   /api/auth/switch-user         - Switch active session role

-- Services & Workers
GET    /api/services                 - List service catalog with category filtering
GET    /api/workers                  - List verified workers with geo coordinates & skills
GET    /api/workers/:id              - Get worker details with e-Shram credentials
PATCH  /api/workers/:id/verify       - Admin verification toggle for worker credentials
PATCH  /api/workers/:id/availability - Worker availability toggle

-- Bookings & Payments
GET    /api/bookings                 - Get bookings list (filtered by role)
POST   /api/bookings                 - Create booking with instant geo-matching & 95/5 split
PATCH  /api/bookings/:id/status      - Advance booking status (Confirmed -> In Progress -> Completed)
POST   /api/bookings/:id/rate        - Submit customer rating and review

-- Cooperative Administration & AI
GET    /api/admin/metrics            - Real-time federation stats: GMV, 95% Payouts, Welfare Pool
GET    /api/admin/forecast           - AI Demand Forecasting curves by trade and season
GET    /api/cooperatives             - Cooperative societies directory
```

---

## 5. Admin Panel — Consolidated 3-Screen Specification

1. **Screen 1: Federation Operations & GMV Hub**
   - Key Performance Cards: Total Registered Workers, Live Active Gigs, Gross Transaction Value (GTV), 95% Worker Direct Payouts, 5% Cooperative Welfare Fund accumulated.
   - 7-Day Gig Volume Chart & Live Booking Stream with status controls.

2. **Screen 2: Workforce Management & e-Shram Verification Queue**
   - Filterable table of cooperative workers displaying trade, e-Shram UAN, insurance status, and rating.
   - One-click credential approval, document audit modal, and society affiliation tools.

3. **Screen 3: AI Demand Forecasting & Proactive Workforce Allocation**
   - Interactive seasonal demand curves projecting volume spikes by trade across upcoming weeks.
   - Proactive society alerts (e.g., *"Anticipate 45% increase in Electrician demand in Zone 2 next week due to pre-monsoon checks — dispatch 6 apprentice workers"*).

---

## 6. Pre-Seeded 3-Minute SIH Demo Script

1. **Minute 1 — Customer Booking Experience:**
   - Switch to **Customer Persona (Ananya Sharma)**.
   - Browse catalog -> Select "Electrical Repair" -> View nearest e-Shram verified worker (**Ramesh Kumar**, 1.4 km away on Leaflet map).
   - Book appointment -> Complete instant Sandbox UPI checkout -> View generated Cooperative Receipt showing 95% to Ramesh and 5% to the Bhopal Welfare Fund.

2. **Minute 2 — Worker Experience & Payout Transparency:**
   - Switch to **Worker Persona (Ramesh Kumar)**.
   - View new gig notification with customer address -> Click "Start Job" -> "Mark Completed".
   - Open Earnings Ledger -> Highlight immediate ₹475 direct credit from ₹500 fee (contrast with ₹350 from private apps).

3. **Minute 3 — Cooperative Admin Dashboard & AI Forecasting:**
   - Switch to **Cooperative Admin Persona (Bhopal Labour Federation)**.
   - Inspect aggregated GMV, see the 5% welfare pool growth, verify a newly registered plumber.
   - Open AI Demand Forecasting chart to demonstrate smart automation and seasonal allocation.
   - Toggle to **हिन्दी** to demonstrate Tier-2/3 digital inclusion.
