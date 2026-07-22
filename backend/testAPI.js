const axios = require("axios");

axios
  .get("http://localhost:7000/api/reconciliation/status")
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.log(error.response.data);
  });
