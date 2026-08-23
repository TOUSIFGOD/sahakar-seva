// Sahakar Seva - Client Application Controller

// Global App State
const state = {
  lang: "en",
  activePortal: "customer",
  activeUserId: "usr_cust_1",
  activeCategory: "All",
  searchQuery: "",
  services: [],
  workers: [],
  bookings: [],
  forecast: null,
  selectedWorkerForBooking: null,
  currentPendingBooking: null,
  currentRatingValue: 5,
  currentRatingBookingId: null,
  map: null,
  markers: [],
  opsChart: null,
  forecastChart: null
};

// DOM Content Loaded Initializer
document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

async function initApp() {
  await fetchAppData();
  initLeafletMap();
  renderWorkers();
  renderActiveBookings();
  renderWorkerPortal();
  renderAdminHub();
  applyLanguage(state.lang);
}

// Fetch all core data from REST API with local fallback
async function fetchAppData() {
  try {
    const [resServices, resWorkers, resBookings, resForecast] = await Promise.all([
      fetch("/api/services").then(r => r.json()),
      fetch("/api/workers").then(r => r.json()),
      fetch("/api/bookings").then(r => r.json()),
      fetch("/api/admin/forecast").then(r => r.json())
    ]);

    state.services = resServices;
    state.workers = resWorkers;
    state.bookings = resBookings;
    state.forecast = resForecast;
  } catch (err) {
    console.warn("Backend API offline or unreachable, using reactive client state:", err);
  }
}

// ----------------------------------------------------------------
// MULTILINGUAL & ROLE SWITCHER
// ----------------------------------------------------------------
function toggleLanguage() {
  state.lang = state.lang === "en" ? "hi" : "en";
  document.getElementById("langLabel").textContent = state.lang === "en" ? "हिन्दी" : "English";
  applyLanguage(state.lang);
  renderWorkers();
  renderActiveBookings();
  renderWorkerPortal();
  renderAdminHub();
}

function applyLanguage(lang) {
  const dict = translations[lang] || translations.en;
  
  const textMapping = {
    "txt-app-title": dict.app_title,
    "txt-role-lbl": dict.role_label,
    "txt-nav-customer": dict.nav_customer,
    "txt-nav-worker": dict.nav_worker,
    "txt-nav-admin": dict.nav_admin,
    "txt-pitch-btn": dict.nav_pitch,
    "txt-hero-title": dict.hero_title,
    "txt-hero-subtitle": dict.hero_subtitle,
    "txt-stat-workers": dict.stat_workers,
    "txt-stat-payout": dict.stat_payout,
    "txt-stat-welfare": dict.stat_welfare,
    "txt-stat-rating": dict.stat_rating,
    "txt-categories-title": dict.categories_title,
    "txt-all-cat": dict.all_categories,
    "txt-workers-near": dict.workers_near_you,
    "txt-map-title": dict.map_title,
    "txt-active-bookings": dict.active_bookings,
    "txt-earnings-ledger": dict.earnings_ledger,
    "txt-admin-tab-ops": dict.admin_tab_ops,
    "txt-admin-tab-workforce": dict.admin_tab_workforce,
    "txt-admin-tab-ai": dict.admin_tab_ai,
    "txt-total-gmv": dict.total_gmv,
    "txt-welfare-balance": dict.welfare_balance,
    "txt-ai-forecast-title": dict.ai_forecast_title,
    "txt-ai-alert-title": dict.ai_alert_title
  };

  for (const [id, val] of Object.entries(textMapping)) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  const searchInput = document.getElementById("serviceSearchInput");
  if (searchInput) searchInput.placeholder = dict.search_placeholder;
}

function switchPersona(userId) {
  state.activeUserId = userId;
  if (userId === "usr_cust_1" || userId === "usr_cust_2") {
    switchPortalView("customer");
  } else if (userId === "usr_wrk_1") {
    switchPortalView("worker");
  } else if (userId === "usr_admin_1") {
    switchPortalView("admin");
  }
}

function switchPortalView(portalName) {
  state.activePortal = portalName;

  // Update tabs
  document.getElementById("tabCustomer").classList.toggle("active", portalName === "customer");
  document.getElementById("tabWorker").classList.toggle("active", portalName === "worker");
  document.getElementById("tabAdmin").classList.toggle("active", portalName === "admin");

  // Update views
  document.getElementById("viewCustomer").classList.toggle("active", portalName === "customer");
  document.getElementById("viewWorker").classList.toggle("active", portalName === "worker");
  document.getElementById("viewAdmin").classList.toggle("active", portalName === "admin");

  if (portalName === "customer") {
    setTimeout(() => {
      if (state.map) state.map.invalidateSize();
    }, 200);
  } else if (portalName === "admin") {
    setTimeout(() => {
      renderAdminOpsChart();
      renderAdminAiForecastChart();
    }, 200);
  }
}

// ----------------------------------------------------------------
// LEAFLET MAP & GEO-MATCHING
// ----------------------------------------------------------------
function initLeafletMap() {
  if (state.map) return;

  // Bhopal Center coordinates
  const bhopalCenter = [23.2200, 77.4200];
  state.map = L.map("workerMap").setView(bhopalCenter, 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(state.map);

  // Customer location marker (Blue)
  const customerIcon = L.divIcon({
    className: "custom-map-pin-cust",
    html: '<div style="background:#0284c7; color:#fff; padding:6px 10px; border-radius:20px; font-weight:800; font-size:11px; border:2px solid #fff; box-shadow:0 2px 8px rgba(0,0,0,0.3);"><i class="fa-solid fa-house"></i> You (Arera)</div>',
    iconSize: [100, 30],
    iconAnchor: [50, 15]
  });
  L.marker([23.2156, 77.4305], { icon: customerIcon }).addTo(state.map).bindPopup("<b>Your Location</b><br>Flat 402, Arera Colony");

  updateMapMarkers();
}

function updateMapMarkers() {
  if (!state.map) return;

  // Clear existing markers
  state.markers.forEach(m => state.map.removeLayer(m));
  state.markers = [];

  const filteredWorkers = getFilteredWorkers();

  filteredWorkers.forEach(w => {
    const isOnline = w.is_available;
    const pinColor = isOnline ? "#059669" : "#64748b";
    
    const workerIcon = L.divIcon({
      className: "custom-map-pin",
      html: `<div style="background:${pinColor}; color:#fff; padding:4px 8px; border-radius:16px; font-weight:700; font-size:11px; border:2px solid #fff; box-shadow:0 2px 8px rgba(0,0,0,0.25); cursor:pointer; display:flex; align-items:center; gap:4px;">
              <i class="fa-solid fa-user-check"></i> ${w.name.split(" ")[0]} (${w.distance_km || 1.4} km)
             </div>`,
      iconSize: [110, 26],
      iconAnchor: [55, 13]
    });

    const marker = L.marker([w.lat, w.lng], { icon: workerIcon }).addTo(state.map);
    
    const popupContent = `
      <div style="font-family:'Inter', sans-serif; font-size:12px; padding:2px;">
        <strong style="font-size:13px; color:#0f172a;">${w.name}</strong><br>
        <span style="color:#059669; font-weight:600;">${w.trade} (${w.experience_years} yrs exp)</span><br>
        <span style="color:#f59e0b;">★ ${w.rating}</span> • <strong>₹${w.hourly_rate}</strong><br>
        <small style="color:#475569;">${w.eshram_uan}</small><br>
        <button onclick="openBookingModal('${w.id}')" style="background:#059669; color:#fff; border:none; padding:4px 8px; border-radius:4px; margin-top:6px; cursor:pointer; font-weight:600; width:100%;">
          Book Worker (95% Pay)
        </button>
      </div>
    `;
    marker.bindPopup(popupContent);
    state.markers.push(marker);
  });
}

// ----------------------------------------------------------------
// WORKERS RENDERING & FILTERING
// ----------------------------------------------------------------
function filterCategory(category) {
  state.activeCategory = category;
  document.querySelectorAll(".category-pill").forEach(btn => {
    btn.classList.toggle("active", btn.textContent.includes(category) || (category === "All" && btn.textContent.includes("All")));
  });
  renderWorkers();
  updateMapMarkers();
}

function handleSearch(query) {
  state.searchQuery = query.trim().toLowerCase();
  renderWorkers();
  updateMapMarkers();
}

function getFilteredWorkers() {
  return state.workers.filter(w => {
    const matchesCat = state.activeCategory === "All" || w.trade.toLowerCase() === state.activeCategory.toLowerCase();
    const matchesSearch = !state.searchQuery || 
      w.name.toLowerCase().includes(state.searchQuery) ||
      w.trade.toLowerCase().includes(state.searchQuery) ||
      (w.name_hi && w.name_hi.includes(state.searchQuery));
    return matchesCat && matchesSearch;
  });
}

function renderWorkers() {
  const container = document.getElementById("workersListContainer");
  const filtered = getFilteredWorkers();

  document.getElementById("workerCountBadge").textContent = `${filtered.length} Workers`;

  if (!filtered.length) {
    container.innerHTML = `
      <div style="text-align:center; padding:2rem; color:var(--text-muted); background:#fff; border-radius:var(--radius-md);">
        <i class="fa-solid fa-user-slash" style="font-size:2rem; margin-bottom:0.5rem; color:#94a3b8;"></i>
        <p>No cooperative workers found for "${state.searchQuery || state.activeCategory}".</p>
      </div>
    `;
    return;
  }

  const isHindi = state.lang === "hi";

  container.innerHTML = filtered.map(w => `
    <div class="worker-card">
      <div class="worker-avatar-wrap">
        <img src="${w.avatar}" alt="${w.name}" class="worker-avatar">
        ${w.is_verified ? '<span class="verified-dot" title="e-Shram Verified"><i class="fa-solid fa-check"></i></span>' : ''}
      </div>
      <div class="worker-info-main">
        <div class="worker-top-row">
          <div>
            <div class="worker-name">${isHindi && w.name_hi ? w.name_hi : w.name}</div>
            <div class="worker-trade">${isHindi && w.trade_hi ? w.trade_hi : w.trade} • ${w.experience_years} ${isHindi ? 'वर्ष अनुभव' : 'yrs exp'}</div>
          </div>
          <div class="worker-rate">
            ₹${w.hourly_rate} <small>/ job</small>
          </div>
        </div>

        <div class="worker-badges-row">
          <span class="badge-tag badge-eshram">
            <i class="fa-solid fa-id-card"></i> ${w.eshram_uan}
          </span>
          <span class="badge-tag badge-skill">
            <i class="fa-solid fa-award"></i> ${w.skill_india_cert}
          </span>
          <span class="badge-tag badge-insurance">
            <i class="fa-solid fa-shield-heart"></i> ${w.insurance_scheme}
          </span>
        </div>

        <div class="worker-footer-row">
          <div class="worker-meta-stats">
            <span class="star-rating"><i class="fa-solid fa-star"></i> ${w.rating} (${w.reviews_count || 42})</span>
            <span><i class="fa-solid fa-route text-emerald-600"></i> ${w.distance_km || 1.4} km away</span>
            <span style="color: ${w.is_available ? '#059669' : '#64748b'}; font-weight:600;">
              <i class="fa-solid fa-circle" style="font-size:0.5rem;"></i> ${w.is_available ? (isHindi ? 'उपलब्ध' : 'Available') : (isHindi ? 'व्यस्त' : 'Busy')}
            </span>
          </div>

          <button class="btn-book" onclick="openBookingModal('${w.id}')">
            <i class="fa-solid fa-calendar-check"></i> ${isHindi ? 'बुक करें (95% श्रमिक आय)' : 'Book Cooperative Pro'}
          </button>
        </div>
      </div>
    </div>
  `).join("");
}

// ----------------------------------------------------------------
// ACTIVE BOOKINGS & LIFECYCLE
// ----------------------------------------------------------------
function renderActiveBookings() {
  const container = document.getElementById("activeBookingsContainer");
  if (!container) return;

  const myBookings = state.bookings.filter(b => b.customer_id === state.activeUserId || b.customer_name === "Ananya Sharma");

  if (!myBookings.length) {
    container.innerHTML = `
      <div style="text-align:center; padding:1.5rem; color:var(--text-muted); font-size:0.85rem;">
        <i class="fa-solid fa-clipboard-check" style="font-size:1.8rem; margin-bottom:0.4rem; color:#94a3b8;"></i>
        <p>No active bookings. Book a worker above!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = myBookings.map(b => `
    <div class="booking-item-card">
      <div class="booking-top-bar">
        <span class="booking-id">${b.id}</span>
        <span class="status-badge status-${b.status}">${b.status.replace("_", " ")}</span>
      </div>

      <div style="font-size:0.95rem; font-weight:700; color:var(--navy); margin-bottom:0.2rem;">
        ${b.service_title}
      </div>
      <div style="font-size:0.85rem; color:var(--primary); font-weight:600;">
        <i class="fa-solid fa-user"></i> Worker: ${b.worker_name}
      </div>

      <div class="booking-details-grid">
        <div><strong>Time Slot:</strong> ${b.scheduled_time}</div>
        <div><strong>Gross Amount:</strong> ₹${b.gross_amount}</div>
        <div><strong>Worker 95%:</strong> ₹${b.worker_payout}</div>
        <div><strong>Payment:</strong> <span style="color:#059669; font-weight:700;">Paid (${b.payment_method})</span></div>
      </div>

      <div class="booking-actions-row">
        <button class="btn-receipt" onclick="openInvoiceModal('${b.id}')">
          <i class="fa-solid fa-receipt"></i> View Cooperative Receipt
        </button>

        ${b.status === "completed" && !b.rating ? `
          <button class="btn-rate" onclick="openRatingModal('${b.id}', '${b.worker_name}')">
            <i class="fa-solid fa-star"></i> Rate Service
          </button>
        ` : ''}

        ${b.status === "in_progress" ? `
          <span style="font-size:0.75rem; color:#0369a1; font-weight:600;">
            <i class="fa-solid fa-spinner fa-spin"></i> Service Technician On-Site
          </span>
        ` : ''}
      </div>
    </div>
  `).join("");
}

// ----------------------------------------------------------------
// BOOKING FLOW & MODALS
// ----------------------------------------------------------------
function openBookingModal(workerId) {
  const worker = state.workers.find(w => w.id === workerId) || state.workers[0];
  state.selectedWorkerForBooking = worker;

  const gross = worker.hourly_rate || 350;
  const worker95 = (gross * 0.95).toFixed(2);
  const coop5 = (gross * 0.05).toFixed(2);

  document.getElementById("bookingWorkerSummary").innerHTML = `
    <img src="${worker.avatar}" style="width:50px; height:50px; border-radius:10px; object-fit:cover;">
    <div>
      <strong style="color:var(--navy); font-size:1.05rem;">${worker.name}</strong>
      <div style="color:var(--primary); font-size:0.85rem; font-weight:600;">${worker.trade} Specialist</div>
      <div style="font-size:0.75rem; color:var(--text-muted);">${worker.eshram_uan} • ${worker.cooperative_name}</div>
    </div>
  `;

  document.getElementById("modalWorkerShare").textContent = `₹${worker95}`;
  document.getElementById("modalCoopShare").textContent = `₹${coop5}`;
  document.getElementById("modalTotalAmount").textContent = `₹${gross}.00`;

  openModal("bookingModal");
}

function handleBookingSubmit(e) {
  e.preventDefault();
  closeModal("bookingModal");

  const worker = state.selectedWorkerForBooking;
  const slot = document.getElementById("bookSlotInput").value;
  const address = document.getElementById("bookAddressInput").value;
  const gross = worker.hourly_rate || 350;

  state.currentPendingBooking = {
    customer_id: state.activeUserId,
    customer_name: "Ananya Sharma",
    customer_phone: "+91 98260 12345",
    worker_id: worker.id,
    worker_name: worker.name,
    service_id: "srv_elec",
    service_title: `${worker.trade} Professional Service`,
    scheduled_time: slot,
    customer_address: address,
    amount: gross,
    payment_method: "UPI / PhonePe Sandbox"
  };

  document.getElementById("payModalAmount").textContent = `₹${gross}.00`;
  openModal("paymentModal");
}

async function confirmSandboxPayment() {
  closeModal("paymentModal");

  try {
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state.currentPendingBooking)
    });
    const data = await res.json();
    if (data.success) {
      state.bookings.unshift(data.booking);
      renderActiveBookings();
      renderWorkerPortal();
      renderAdminHub();
      openInvoiceModal(data.booking.id);
    }
  } catch (err) {
    // Client fallback
    const newBk = {
      ...state.currentPendingBooking,
      id: `BK-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      status: "confirmed",
      gross_amount: state.currentPendingBooking.amount,
      worker_payout: parseFloat((state.currentPendingBooking.amount * 0.95).toFixed(2)),
      cooperative_cut: parseFloat((state.currentPendingBooking.amount * 0.05).toFixed(2)),
      payment_status: "paid"
    };
    state.bookings.unshift(newBk);
    renderActiveBookings();
    renderWorkerPortal();
    renderAdminHub();
    openInvoiceModal(newBk.id);
  }
}

// ----------------------------------------------------------------
// INVOICE / RECEIPT GENERATOR
// ----------------------------------------------------------------
function openInvoiceModal(bookingId) {
  const bk = state.bookings.find(b => b.id === bookingId) || state.bookings[0];
  if (!bk) return;

  document.getElementById("invNumber").textContent = `INV-${bk.id}`;
  document.getElementById("invCustomer").textContent = bk.customer_name;
  document.getElementById("invAddress").textContent = bk.customer_address || "Arera Colony, Bhopal, MP";
  document.getElementById("invWorker").textContent = `${bk.worker_name} (Certified Professional)`;
  document.getElementById("invServiceTitle").textContent = bk.service_title;
  document.getElementById("invGrossAmount").textContent = `₹${bk.gross_amount}.00`;
  document.getElementById("invWorkerShare").textContent = `₹${bk.worker_payout}`;
  document.getElementById("invCoopShare").textContent = `₹${bk.cooperative_cut || (bk.gross_amount * 0.05).toFixed(2)}`;

  openModal("invoiceModal");
}

// ----------------------------------------------------------------
// RATING & FEEDBACK
// ----------------------------------------------------------------
function openRatingModal(bookingId, workerName) {
  state.currentRatingBookingId = bookingId;
  document.getElementById("rateWorkerName").textContent = workerName;
  setStarRating(5);
  openModal("ratingModal");
}

function setStarRating(stars) {
  state.currentRatingValue = stars;
  const starIcons = document.querySelectorAll("#starRatingRow i");
  starIcons.forEach((icon, idx) => {
    if (idx < stars) {
      icon.className = "fa-solid fa-star";
    } else {
      icon.className = "fa-regular fa-star";
    }
  });
}

async function submitRating() {
  const review = document.getElementById("rateReviewText").value;
  closeModal("ratingModal");

  try {
    await fetch(`/api/bookings/${state.currentRatingBookingId}/rate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating: state.currentRatingValue, review })
    });
  } catch (err) {
    console.log("Offline rate fallback");
  }

  const bk = state.bookings.find(b => b.id === state.currentRatingBookingId);
  if (bk) {
    bk.rating = state.currentRatingValue;
    bk.review = review;
  }
  renderActiveBookings();
  alert("Thank you! Your rating has been recorded in the Cooperative Ledger.");
}

// ----------------------------------------------------------------
// WORKER PORTAL RENDERING & LIFECYCLE
// ----------------------------------------------------------------
function renderWorkerPortal() {
  const gigsContainer = document.getElementById("workerGigsContainer");
  if (!gigsContainer) return;

  const assignedGigs = state.bookings.filter(b => b.worker_name.includes("Ramesh") && b.status !== "completed");

  if (!assignedGigs.length) {
    gigsContainer.innerHTML = `
      <div style="text-align:center; padding:2rem; color:var(--text-muted);">
        <i class="fa-solid fa-circle-check" style="font-size:2rem; color:#10b981; margin-bottom:0.5rem;"></i>
        <p>All assigned tasks are completed. You are on standby for new customer requests.</p>
      </div>
    `;
    return;
  }

  gigsContainer.innerHTML = assignedGigs.map(g => `
    <div style="background:#fff; border:1px solid var(--border); border-left:4px solid var(--saffron); border-radius:var(--radius-md); padding:1.25rem; margin-bottom:1rem;">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
        <div>
          <span class="booking-id">${g.id}</span>
          <h4 style="font-size:1.1rem; color:var(--navy); margin:0.2rem 0;">${g.service_title}</h4>
          <div style="font-size:0.85rem; color:var(--text-muted);">
            <i class="fa-solid fa-user"></i> Citizen: <strong>${g.customer_name}</strong> (${g.customer_phone || "+91 98260 12345"})
          </div>
          <div style="font-size:0.85rem; color:var(--text-muted); margin-top:0.2rem;">
            <i class="fa-solid fa-location-dot text-emerald-600"></i> Address: <strong>${g.customer_address}</strong>
          </div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:1.3rem; font-weight:800; color:var(--primary); font-family:'Outfit';">₹${g.worker_payout}</div>
          <small style="color:var(--text-muted); font-size:0.75rem;">Your 95% Take-Home</small>
        </div>
      </div>

      <div style="display:flex; justify-content:flex-end; gap:0.75rem; margin-top:1rem; padding-top:0.75rem; border-top:1px dashed var(--border);">
        ${g.status === "confirmed" ? `
          <button class="btn-pitch" onclick="updateGigStatus('${g.id}', 'in_progress')">
            <i class="fa-solid fa-play"></i> Start Work / Mark On-Site
          </button>
        ` : ''}
        ${g.status === "in_progress" ? `
          <button class="btn-book" style="background:#059669;" onclick="updateGigStatus('${g.id}', 'completed')">
            <i class="fa-solid fa-check-double"></i> Complete Job & Settle ₹${g.worker_payout}
          </button>
        ` : ''}
      </div>
    </div>
  `).join("");
}

async function updateGigStatus(bookingId, newStatus) {
  try {
    await fetch(`/api/bookings/${bookingId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus })
    });
  } catch (err) {
    console.log("Offline update");
  }

  const bk = state.bookings.find(b => b.id === bookingId);
  if (bk) bk.status = newStatus;

  renderActiveBookings();
  renderWorkerPortal();
  renderAdminHub();
}

function toggleWorkerOnline(isOnline) {
  const lbl = document.getElementById("workerAvailStatusText");
  if (lbl) {
    lbl.textContent = isOnline ? "Available for Gigs" : "Off-Duty / Unavailable";
    lbl.style.color = isOnline ? "var(--primary-dark)" : "var(--text-muted)";
  }
}

// ----------------------------------------------------------------
// ADMIN DASHBOARD & 3 CONSOLIDATED SCREENS
// ----------------------------------------------------------------
function switchAdminTab(tabKey) {
  document.getElementById("adminTabOps").classList.toggle("active", tabKey === "ops");
  document.getElementById("adminTabWorkforce").classList.toggle("active", tabKey === "workforce");
  document.getElementById("adminTabAi").classList.toggle("active", tabKey === "ai");

  document.getElementById("adminSubOps").classList.toggle("active", tabKey === "ops");
  document.getElementById("adminSubWorkforce").classList.toggle("active", tabKey === "workforce");
  document.getElementById("adminSubAi").classList.toggle("active", tabKey === "ai");

  if (tabKey === "ops") renderAdminOpsChart();
  if (tabKey === "ai") renderAdminAiForecastChart();
}

function renderAdminHub() {
  renderAdminMetrics();
  renderAdminBookingsTable();
  renderAdminWorkersTable();
  renderAiRecommendations();
}

async function renderAdminMetrics() {
  try {
    const res = await fetch("/api/admin/metrics");
    const m = await res.json();
    document.getElementById("adminGmvVal").textContent = `₹${m.total_gmv.toLocaleString("en-IN")}`;
    document.getElementById("adminPayoutVal").textContent = `₹${m.total_worker_payouts.toLocaleString("en-IN")}`;
    document.getElementById("adminWelfareVal").textContent = `₹${m.total_welfare_fund.toLocaleString("en-IN")}`;
    document.getElementById("adminActiveJobsVal").textContent = `${m.active_bookings} Active`;
  } catch (err) {
    // fallback
  }
}

function renderAdminBookingsTable() {
  const tbody = document.getElementById("adminBookingsTbody");
  if (!tbody) return;

  tbody.innerHTML = state.bookings.map(b => `
    <tr>
      <td><strong>${b.id}</strong></td>
      <td>${b.customer_name}</td>
      <td>${b.worker_name}</td>
      <td>${b.service_title}</td>
      <td>₹${b.gross_amount}</td>
      <td style="color:#059669; font-weight:700;">₹${b.worker_payout}</td>
      <td style="color:#065f46; font-weight:700;">₹${b.cooperative_cut || (b.gross_amount * 0.05).toFixed(2)}</td>
      <td><span class="status-badge status-${b.status}">${b.status}</span></td>
      <td>
        <button class="btn-receipt" onclick="openInvoiceModal('${b.id}')" style="padding:2px 6px; font-size:11px;">
          <i class="fa-solid fa-eye"></i> Receipt
        </button>
      </td>
    </tr>
  `).join("");
}

function renderAdminWorkersTable() {
  const tbody = document.getElementById("adminWorkersTbody");
  if (!tbody) return;

  tbody.innerHTML = state.workers.map(w => `
    <tr>
      <td>
        <div style="display:flex; align-items:center; gap:8px;">
          <img src="${w.avatar}" style="width:32px; height:32px; border-radius:6px; object-fit:cover;">
          <strong>${w.name}</strong>
        </div>
      </td>
      <td>${w.trade}</td>
      <td><code>${w.eshram_uan}</code></td>
      <td><small>${w.skill_india_cert}</small></td>
      <td><span class="badge-tag badge-insurance">${w.insurance_scheme}</span></td>
      <td>${w.total_jobs_completed}</td>
      <td><span style="color:#f59e0b; font-weight:700;">★ ${w.rating}</span></td>
      <td>
        <span class="badge-tag ${w.is_verified ? 'badge-eshram' : 'badge-skill'}">
          ${w.is_verified ? '<i class="fa-solid fa-circle-check"></i> Verified' : '<i class="fa-solid fa-clock"></i> Audit Queue'}
        </span>
      </td>
      <td>
        <button class="btn-action-sm ${w.is_verified ? 'btn-unverify' : 'btn-verify'}" onclick="toggleWorkerVerification('${w.id}')">
          ${w.is_verified ? '<i class="fa-solid fa-xmark"></i> Revoke' : '<i class="fa-solid fa-check"></i> Approve KYC'}
        </button>
      </td>
    </tr>
  `).join("");
}

async function toggleWorkerVerification(workerId) {
  const worker = state.workers.find(w => w.id === workerId);
  if (!worker) return;

  const newStatus = !worker.is_verified;
  worker.is_verified = newStatus;

  try {
    await fetch(`/api/workers/${workerId}/verify`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_verified: newStatus })
    });
  } catch (err) {}

  renderWorkers();
  renderAdminWorkersTable();
  updateMapMarkers();
}

function renderAiRecommendations() {
  const container = document.getElementById("aiRecommendationsContainer");
  if (!container || !state.forecast) return;

  container.innerHTML = state.forecast.ai_recommendations.map(r => `
    <div class="ai-recommendation-card">
      <div class="ai-rec-header">
        <span><i class="fa-solid fa-chart-line text-emerald-600"></i> ${r.trade}</span>
        <span class="ai-confidence-badge"><i class="fa-solid fa-brain"></i> AI Confidence: ${r.confidence}</span>
      </div>
      <div style="font-size:0.85rem; font-weight:700; color:var(--saffron); margin-bottom:0.2rem;">
        Trend: ${r.trend}
      </div>
      <p style="font-size:0.85rem; color:var(--navy);">
        <strong>Actionable Recommendation:</strong> ${r.action}
      </p>
    </div>
  `).join("");
}

// ----------------------------------------------------------------
// CHART.JS ANALYTICS
// ----------------------------------------------------------------
function renderAdminOpsChart() {
  const ctx = document.getElementById("adminOpsChart");
  if (!ctx) return;

  if (state.opsChart) state.opsChart.destroy();

  state.opsChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "95% Direct Worker Payouts (₹)",
          data: [24500, 28000, 26000, 31000, 35000, 42000, 39000],
          backgroundColor: "#059669"
        },
        {
          label: "5% Cooperative Welfare Pool (₹)",
          data: [1225, 1400, 1300, 1550, 1750, 2100, 1950],
          backgroundColor: "#d97706"
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { stacked: true },
        y: { stacked: true }
      }
    }
  });
}

function renderAdminAiForecastChart() {
  const ctx = document.getElementById("aiForecastChart");
  if (!ctx || !state.forecast) return;

  if (state.forecastChart) state.forecastChart.destroy();

  const labels = state.forecast.forecast_series.map(s => s.week);
  const electricalData = state.forecast.forecast_series.map(s => s.electrical);
  const plumbingData = state.forecast.forecast_series.map(s => s.plumbing);
  const cleaningData = state.forecast.forecast_series.map(s => s.cleaning);
  const paintingData = state.forecast.forecast_series.map(s => s.painting);

  state.forecastChart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Electrical & AC (Pre-Monsoon & Summer Surge)",
          data: electricalData,
          borderColor: "#059669",
          backgroundColor: "rgba(5, 150, 105, 0.1)",
          tension: 0.35,
          fill: true
        },
        {
          label: "Cleaning & Sanitization (Pre-Festive Spike)",
          data: cleaningData,
          borderColor: "#8b5cf6",
          tension: 0.35
        },
        {
          label: "Wall Painting & Waterproofing (Festive Demand)",
          data: paintingData,
          borderColor: "#d97706",
          tension: 0.35
        },
        {
          label: "Plumbing (Standard Baseload)",
          data: plumbingData,
          borderColor: "#0284c7",
          tension: 0.35
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "Predictive Seasonal Demand Index by Trade"
        }
      }
    }
  });
}

// ----------------------------------------------------------------
// MODAL CONTROLS
// ----------------------------------------------------------------
function openModal(modalId) {
  const m = document.getElementById(modalId);
  if (m) m.classList.add("active");
}

function closeModal(modalId) {
  const m = document.getElementById(modalId);
  if (m) m.classList.remove("active");
}

function openPitchModal() {
  openModal("pitchModal");
}
