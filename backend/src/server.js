console.log("→ loading", __filename);
require("dotenv").config();
// const startScheduler = require("./scheduler/reconciliationScheduler");
const app = require("./app");

const PORT = process.env.PORT || 7000;
const { startScheduler } = require("./services/schedulerEngine");

startScheduler();
app.listen(PORT, () => {
  console.log(`EDRMS Server running on port ${PORT}`);
  startScheduler();
});
