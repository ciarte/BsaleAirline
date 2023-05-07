const express = require("express");
const router = express.Router();

const { getAllFlights, getFlightsByID } = require("../../controllers/flightsController");

router
  .get("/", getAllFlights)

  .get("/:id/passengers", getFlightsByID);

module.exports = router;
