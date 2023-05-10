const connection = require("../database/db.js");
const express = require("express");
const router = express.Router();

const sortFunc = function compareAge(a, b) {
  if (a.purchaseId < b.purchaseId) {
    return -1;
  }
  if (a.purchaseId > b.purchaseId) {
    return 1;
  }
  return 0;
};
// const sortFunc = function compareAge(a, b) {
//   if (a.age < b.age) {
//     return -1;
//   }
//   if (a.age > b.age) {
//     return 1;
//   }
//   return 0;
// };

const getSeatByID = async function () {
  try {
    let [result] = connection.query("SELECT * FROM seat");
    return result;
  } catch (error) {
    console.log(error);
  }
};

const getFlightByID = async function (id) {
  try {
    let [resultFlight] = connection.query(
      "SELECT * FROM flight WHERE flight_id=?",
      [id]
    );
    return resultFlight;
  } catch (error) {
    console.log(error);
  }
};

const getBoardingPassByFligth = async function (id) {
  let [boarding_pass] = connection.query(
    "SELECT * FROM boarding_pass JOIN passenger ON boarding_pass.passenger_id = passenger.passenger_id WHERE flight_id=?",
    [id]
  );
  return boarding_pass;
};

const getSeatsByAirplane = async function (airplane) {
  let [result] = connection.query("SELECT * FROM seat WHERE airplane_id=?", [
    airplane,
  ]);
  return result;
};

module.exports = {
  sortFunc,
  getFlightByID,
  getBoardingPassByFligth,
  getSeatsByAirplane,
  getSeatByID,
};
