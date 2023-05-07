const express = require("express");
const app = express();
const dotenv = require("dotenv");
const PORT = process.env.PORT || "3000";
const v1Router = require("./v1/routes");

dotenv.config();

app.use("/flights/", v1Router);

app.listen(PORT, () => {
  console.log(`server listening on ${PORT}`);
});
