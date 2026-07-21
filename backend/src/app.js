const express = require("express");
const cors = require("cors");

console.log("APP FILE STARTED");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
    res.json({
        status: "OK",
        message: "EDRMS API is running"
    });
});

console.log("Before export:", app);

module.exports = app;

console.log("After export:", module.exports);