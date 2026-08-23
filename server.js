const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const seedData = require("./data/seed");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Serve static frontend files
app.use(express.static(path.join(__dirname, "public")));

// In-Memory Database (clone from seed data)
let db = {
  users: JSON.parse(JSON.stringify(seedData.users)),
  cooperatives: JSON.parse(JSON.stringify(seedData.cooperatives)),
  services: JSON.parse(JSON.stringify(seedData.services)),
  workers: JSON.parse(JSON.stringify(seedData.workers)),
  bookings: JSON.parse(JSON.stringify(seedData.bookings)),
  demandForecast: JSON.parse(JSON.stringify(seedData.demandForecast)),
  activeUserId: "usr_cust_1" // Default demo persona: Ananya Sharma
};

// Distance calculation helper (Haversine formula in KM)
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 2.5; // fallback
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "Sahakar Seva MVP API",
    version: "1.0.0",
    theme: "Ministry of Cooperation - SIH 2026",
    timestamp: new Date().toISOString()
  });
});

// Auth & Switch Demo Personas
app.get("/api/auth/roles", (req, res) => {
  const activeUser = db.users.find(u => u.id === db.activeUserId) || db.users[0];
  res.json({
    activeUserId: db.activeUserId,
    activeUser,
    personas: db.users
  });
});

app.post("/api/auth/switch-user", (req, res) => {
  const { userId } = req.body;
  const user = db.users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: "User persona not found" });
  }
  db.activeUserId = userId;
  res.json({ success: true, activeUser: user });
});

// Services Catalog
app.get("/api/services", (req, res) => {
  const { category } = req.query;
  let list = db.services;
  if (category && category !== "All") {
    list = list.filter(s => s.category.toLowerCase() === category.toLowerCase());
  }
  res.json(list);
});

// Workers List with Geo-Proximity Matching
app.get("/api/workers", (req, res) => {
  const { trade, lat, lng, search } = req.query;
  const customerLat = parseFloat(lat) || 23.2156;
  const customerLng = parseFloat(lng) || 77.4305;

  let results = db.workers.map(w => {
    const distanceKm = calculateDistanceKm(customerLat, customerLng, w.lat, w.lng);
    return {
      ...w,
      distance_km: distanceKm
    };
  });

  if (trade && trade !== "All") {
    results = results.filter(w => w.trade.toLowerCase() === trade.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(
      w =>
        w.name.toLowerCase().includes(q) ||
        w.trade.toLowerCase().includes(q) ||
        w.name_hi.includes(q)
    );
  }

  // Sort by verified first, then nearest distance
  results.sort((a, b) => {
    if (a.is_verified && !b.is_verified) return -1;
    if (!a.is_verified && b.is_verified) return 1;
    return a.distance_km - b.distance_km;
  });

  res.json(results);
});

// Single Worker details
app.get("/api/workers/:id", (req, res) => {
  const worker = db.workers.find(w => w.id === req.params.id || w.user_id === req.params.id);
  if (!worker) {
    return res.status(404).json({ error: "Worker not found" });
  }
  res.json(worker);
});

// Admin Toggle Worker Verification (e-Shram / Skill India KYC)
app.patch("/api/workers/:id/verify", (req, res) => {
  const worker = db.workers.find(w => w.id === req.params.id);
  if (!worker) {
    return res.status(404).json({ error: "Worker not found" });
  }
  worker.is_verified = req.body.is_verified !== undefined ? req.body.is_verified : !worker.is_verified;
  res.json({ success: true, worker });
});

// Worker Toggle Online Availability
app.patch("/api/workers/:id/availability", (req, res) => {
  const worker = db.workers.find(w => w.id === req.params.id || w.user_id === req.params.id);
  if (!worker) {
    return res.status(404).json({ error: "Worker not found" });
  }
  worker.is_available = req.body.is_available !== undefined ? req.body.is_available : !worker.is_available;
  res.json({ success: true, worker });
});

// Bookings List (role-aware)
app.get("/api/bookings", (req, res) => {
  const { role, userId } = req.query;
  let list = db.bookings;

  if (role === "customer" && userId) {
    list = list.filter(b => b.customer_id === userId);
  } else if (role === "worker" && userId) {
    list = list.filter(b => b.worker_id === userId || b.worker_name.includes("Ramesh"));
  }

  res.json(list);
});

// Create New Booking (with instant 95%-5% cooperative split)
app.post("/api/bookings", (req, res) => {
  const {
    customer_id,
    customer_name,
    customer_phone,
    worker_id,
    service_id,
    scheduled_time,
    customer_address,
    payment_method,
    amount
  } = req.body;

  const worker = db.workers.find(w => w.id === worker_id) || db.workers[0];
  const service = db.services.find(s => s.id === service_id) || db.services[0];
  const grossAmount = parseFloat(amount) || service.base_rate;

  // Cooperative transparent split: 95% Worker / 5% Cooperative Fund
  const workerPayout = parseFloat((grossAmount * 0.95).toFixed(2));
  const cooperativeCut = parseFloat((grossAmount * 0.05).toFixed(2));

  const newBooking = {
    id: `BK-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    customer_id: customer_id || db.activeUserId,
    customer_name: customer_name || "Ananya Sharma",
    customer_phone: customer_phone || "+91 98260 12345",
    worker_id: worker.id,
    worker_name: worker.name,
    service_id: service.id,
    service_title: service.title,
    status: "confirmed",
    scheduled_time: scheduled_time || "Today, within 45 mins",
    customer_address: customer_address || "Arera Colony, Bhopal",
    gross_amount: grossAmount,
    worker_payout: workerPayout,
    cooperative_cut: cooperativeCut,
    payment_method: payment_method || "UPI Sandbox (Zero Transaction Fee)",
    payment_status: "paid",
    transaction_id: `UPI-BPL-${Date.now().toString().slice(-8)}`,
    rating: null,
    review: null,
    created_at: new Date().toISOString()
  };

  db.bookings.unshift(newBooking);

  // Update cooperative fund balance
  const coop = db.cooperatives[0];
  if (coop) {
    coop.welfare_fund_balance += cooperativeCut;
  }

  // Update worker stats
  worker.total_jobs_completed += 1;
  worker.total_earnings += workerPayout;

  res.status(201).json({
    success: true,
    booking: newBooking,
    breakdown: {
      gross_amount: grossAmount,
      worker_share_95: workerPayout,
      cooperative_welfare_5: cooperativeCut,
      private_competitor_cut_25_comparison: (grossAmount * 0.25).toFixed(2),
      worker_extra_savings: (grossAmount * 0.2).toFixed(2)
    }
  });
});

// Update Booking Status
app.patch("/api/bookings/:id/status", (req, res) => {
  const booking = db.bookings.find(b => b.id === req.params.id);
  if (!booking) {
    return res.status(404).json({ error: "Booking not found" });
  }

  const { status } = req.body;
  if (!["pending", "confirmed", "in_progress", "completed", "cancelled"].includes(status)) {
    return res.status(400).json({ error: "Invalid status value" });
  }

  booking.status = status;
  if (status === "completed" && !booking.completed_time) {
    booking.completed_time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  res.json({ success: true, booking });
});

// Rate Booking (Customer Feedback)
app.post("/api/bookings/:id/rate", (req, res) => {
  const booking = db.bookings.find(b => b.id === req.params.id);
  if (!booking) {
    return res.status(404).json({ error: "Booking not found" });
  }

  const { rating, review } = req.body;
  booking.rating = parseInt(rating) || 5;
  booking.review = review || "Great cooperative professional service!";

  // Recalculate worker average rating
  const worker = db.workers.find(w => w.id === booking.worker_id || w.name === booking.worker_name);
  if (worker) {
    worker.reviews_count += 1;
  }

  res.json({ success: true, booking });
});

// Cooperative Admin Dashboard Metrics
app.get("/api/admin/metrics", (req, res) => {
  const totalWorkers = db.workers.length;
  const verifiedWorkers = db.workers.filter(w => w.is_verified).length;
  const activeBookings = db.bookings.filter(b => ["confirmed", "in_progress"].includes(b.status)).length;
  const completedBookings = db.bookings.filter(b => b.status === "completed").length;

  const totalGMV = db.bookings.reduce((sum, b) => sum + (b.gross_amount || 0), 0);
  const totalWorkerPayouts = db.bookings.reduce((sum, b) => sum + (b.worker_payout || 0), 0);
  const totalWelfareFund = db.cooperatives.reduce((sum, c) => sum + (c.welfare_fund_balance || 0), 0);

  res.json({
    total_workers: totalWorkers,
    verified_workers: verifiedWorkers,
    active_bookings: activeBookings,
    completed_bookings: completedBookings,
    total_gmv: totalGMV + 185000.00, // include historical baseline
    total_worker_payouts: totalWorkerPayouts + 175750.00, // 95%
    total_welfare_fund: totalWelfareFund,
    cooperative_name: db.cooperatives[0].name,
    district: "Bhopal, Madhya Pradesh",
    recent_bookings: db.bookings.slice(0, 6)
  });
});

// AI Demand Forecast
app.get("/api/admin/forecast", (req, res) => {
  res.json(db.demandForecast);
});

// Cooperatives Directory
app.get("/api/cooperatives", (req, res) => {
  res.json(db.cooperatives);
});

// Start Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` Sahakar Seva MVP Server Running!`);
  console.log(` URL: http://localhost:${PORT}`);
  console.log(` Theme: Ministry of Cooperation - Smart Automation`);
  console.log(`====================================================`);
});
