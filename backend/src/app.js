// console.log("→ loading", __filename);
// const express = require("express");
// const cors = require("cors");

// const path = require("path");

// const routePath = require.resolve("./routes/reconciliationRoutes");

// // console.log("LOADING ROUTE FILE:");
// // console.log(routePath);

// const reconciliationRoutes = require("./routes/reconciliationRoutes");

// console.log("ROUTE:", reconciliationRoutes);

// const authRoutes = require("./routes/authRoutes");
// const app = express();
// app.use("/api/auth", authRoutes);

// app.use(cors());

// app.use(express.json());

// // Health check
// app.get("/api/health", (req, res) => {
//   res.json({
//     status: "OK",
//     message: "EDRMS API is running",
//     timestamp: new Date(),
//   });
// });

// // Reconciliation API
// app.use("/api/reconciliation", reconciliationRoutes);

// module.exports = app;

const express = require("express");
const cors = require("cors");

const app = express();

// Allow React frontend

app.use(
  cors({
    origin: "http://localhost:5173",

    methods: ["GET", "POST", "PUT", "DELETE"],

    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes

const authRoutes = require("./routes/authRoutes");
const usersRoutes = require("./routes/userRoute");
const reconciliationRoutes = require("./routes/reconciliationRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const jobRoutes = require("./routes/jobRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/reconciliation", reconciliationRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/test", require("./routes/testEmailRoutes"));
module.exports = app;
