# Sahakar Seva (सहकार सेवा) 🇮🇳
### Cooperative Gig Services Platform for Household & Community Services
**Theme:** Smart Automation | **Ministry:** Ministry of Cooperation | **Department:** National Council for Cooperative Training (NCCT) | **Hackathon:** Smart India Hackathon 2026

---

## 🌟 Overview
**Sahakar Seva** is a digitized, government-linked cooperative marketplace designed to empower grassroots service workers (electricians, plumbers, caregivers, cleaners, etc.) across India's Tier-2, Tier-3, and rural clusters.

Unlike private gig platforms that extract **15% to 30%** commissions from workers, Sahakar Seva operates on a **Cooperative Ownership Model**:
- **95% Direct Worker Payout** immediately upon job completion.
- **5% Cooperative Welfare & Insurance Pool** (PMJJBY / PMSBY / PM-JAY and emergency loans).
- **Government Credential Integration**: Native verification for **e-Shram Universal Account Numbers (UAN)** and **Skill India Digital (NSQF)**.
- **AI Demand Forecasting**: Proactive seasonal workload planning for local cooperative federations.

---

## 🚀 Key Features

| Role / Feature | Capabilities |
|---|---|
| **👤 Customer Portal** | Service discovery, interactive **Leaflet.js** live GPS proximity map, verified e-Shram worker badges, booking scheduler, sandbox UPI checkout, live status tracker & 5-star reviews. |
| **⚡ Worker Portal** | Online/Offline availability toggle, assigned gig dispatcher ("Start Work" & "Complete"), and **Transparent 95% Earnings Ledger** with side-by-side comparison against private platform cuts. |
| **🏛️ Cooperative Admin Hub** | **3 Consolidated Screens**: (1) Operations & GMV Hub, (2) Workforce & e-Shram KYC Queue with 1-click approvals, (3) AI Seasonal Demand Forecasting curves (**Chart.js**). |
| **🌐 Multilingual** | Instant toggle between **English** and **हिन्दी** for Tier-2/3 accessibility. |
| **📄 Cooperative Invoicing** | Auto-generated digital service receipts with transparent 95%-5% fee breakdowns. |

---

## 🛠️ Tech Stack
- **Frontend:** HTML5, Vanilla CSS3 (Custom Design System, Glassmorphism, Tri-color Accents), ES6+ JavaScript, [Leaflet.js](https://leafletjs.com/), [Chart.js](https://www.chartjs.org/)
- **Backend:** Node.js, Express.js
- **Data & APIs:** RESTful JSON Architecture, Geo-matching calculations (Haversine Formula), Time-Series Regression

---

## 📦 Quick Start & Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- npm (v8 or higher)

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/your-username/sahakar-seva.git
cd sahakar-seva

# 2. Install dependencies
npm install

# 3. Start the server
npm start
```

Open your browser and navigate to:
```
http://localhost:3000
```

---

## 📊 Competitive Positioning Matrix

| Feature | Urban Company | e-Shram Portal | Local Contractors | **Sahakar Seva** |
|:---|:---:|:---:|:---:|:---:|
| **Digital Booking App** | ✅ | ❌ (Data Silo) | ❌ | **✅ Web & Mobile** |
| **Worker Ownership** | ❌ (Extractive) | ❌ | ❌ | **✅ Cooperative Owned** |
| **Platform Commission** | 15% – 30% cut | N/A | Variable Markup | **5% (Welfare Pool Only)** |
| **Direct Worker Take-Home** | 70% – 85% | N/A | Uncertain | **95% Guaranteed** |
| **Govt Credential Integration** | ❌ (Private KYC) | ✅ (Database) | ❌ | **✅ e-Shram & NSQF Linked** |
| **Default Insurance Link** | ❌ (Add-on) | ❌ | ❌ | **✅ PMJJBY / PMSBY Covered** |
| **AI Demand Forecasting** | ✅ (Private) | ❌ | ❌ | **✅ Proactive Local Allocation** |

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).

---

## 👥 Disclaimer
*This project was developed as a submission prototype for Smart India Hackathon (SIH 2026). All demonstration worker identities, Universal Account Numbers (UAN), and transaction IDs are synthetic/illustrative.*