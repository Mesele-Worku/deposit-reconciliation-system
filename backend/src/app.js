console.log("→ loading", __filename);
const express = require("express");
const cors = require("cors");

const path = require("path");

const routePath = require.resolve("./routes/reconciliationRoutes");

console.log("LOADING ROUTE FILE:");
console.log(routePath);

const reconciliationRoutes =
require("./routes/reconciliationRoutes");

console.log("ROUTE:", reconciliationRoutes);
const app = express();


app.use(cors());

app.use(express.json());


// Health check
app.get("/api/health", (req, res) => {

    res.json({
        status:"OK",
        message:"EDRMS API is running",
        timestamp:new Date()
    });

});


// Reconciliation API
app.use(
    "/api/reconciliation",
    reconciliationRoutes
);


module.exports = app;