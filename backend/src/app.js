const express = require("express");
const cors = require("cors");

const app = express();

// =====================================================
// CORS
// =====================================================

app.use(
  cors({
    // origin: "http://localhost:8090",
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// =====================================================
// BODY PARSERS
// =====================================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================================================
// ROUTES
// =====================================================

const authRoutes = require("./routes/authRoutes");
const usersRoutes = require("./routes/userRoute");
const reconciliationRoutes = require("./routes/reconciliationRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const jobRoutes = require("./routes/jobRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const dashboardEventRoutes = require("./routes/dashboardEventRoutes");

// Authentication
app.use("/api/auth", authRoutes);

// Users
app.use("/api/users", usersRoutes);

// Reconciliation
app.use("/api/reconciliation", reconciliationRoutes);

// Scheduler
app.use("/api/schedule", scheduleRoutes);

// Jobs
app.use("/api/jobs", jobRoutes);

// Dashboard
app.use("/api/dashboard", dashboardRoutes);

// Notifications
app.use("/api/notifications", notificationRoutes);

// Email test
app.use("/api/test", require("./routes/testEmailRoutes"));

// =====================================================
// DASHBOARD REAL-TIME REFRESH
// =====================================================

app.use("/api/dashboardRefresh", dashboardEventRoutes);

// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "EDRMS API is running",
    timestamp: new Date(),
  });
});

// =====================================================
// 404 HANDLER
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// =====================================================
// ERROR HANDLER
// =====================================================

app.use((err, req, res, next) => {
  console.error("Express Error:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

module.exports = app;
