const express = require("express");
const router = express.Router();
const connection = require("../database/db.js");
const {
  sortFunc,
  boardingPassByPurchase,
  boardingPassBySeat,
} = require("../services/index.js");

const getAllFlights = async (req, res) => {
  let [result] = await connection.query("SELECT * FROM seat");
  res.json(result);
};

const getFlightsByID = async (req, res) => {
  const idPassenger = req.params.id;
  // let assignedSeats;
  // let lastAssignedSeat = 0;

  let availableSeats = [];
  try {
    const [resultFlight] = await connection.query(
      "SELECT * FROM flight WHERE flight_id=?",
      [idPassenger]
    );
    const [boarding_pass] = await connection.query(
      "SELECT * FROM boarding_pass JOIN passenger ON boarding_pass.passenger_id = passenger.passenger_id WHERE flight_id=?",
      [idPassenger]
    );

    var resultFlights = {
      flightId: resultFlight[0].flight_id,
      takeoffDateTime: resultFlight[0].takeoff_date_time,
      takeoffAirport: resultFlight[0].landing_airport,
      landingDateTime: resultFlight[0].landing_date_time,
      landingAirport: resultFlight[0].landing_airport,
      airplaneId: resultFlight[0].airplane_id,
      passengers: [],
    };

    await boarding_pass.forEach((d) => {
      resultFlights.passengers.sort(sortFunc).push({
        passengerId: d.passenger_id,
        dni: d.dni,
        name: d.name,
        age: d.age,
        country: d.country,
        boardingPassId: d.boarding_pass_id,
        purchaseId: d.purchase_id,
        seatTypeId: d.seat_type_id,
        seatId: d.seat_id,
      });
    });
    const boardingPassByPurchases = boardingPassByPurchase(
      resultFlights.passengers
    );
   
    const boardingPassBySeats = boardingPassBySeat(result);
    
    resultFlights.passengers.forEach((s) => {
      if (s.seatId !== null) {
        availableSeats.push(s.seatId);
      }
    });
    const asientos = boardingPassBySeat.filter(
      (pass) => !availableSeats.includes(pass.seat_id)
    );

    console.log(asientos);

    if (resultFlight.length >= 0) {
      res.status(200).json({
        code: 200,
        data: resultFlights,
      });
    } else
      res.status(404).json({
        code: 404,
        data: {},
      });
  } catch (error) {
    res.status(400).json({
      code: 400,
      error: "could not connect to db",
    });
  }
};

module.exports = {
  getAllFlights,
  getFlightsByID,
};
