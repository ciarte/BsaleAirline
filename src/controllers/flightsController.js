const express = require("express");
const router = express.Router();
const connection = require("../database/db.js");
const { sortFunc } = require("../services/index.js");

const getAllFlights = async (req, res) => {
  let [result] = await connection.query("SELECT * FROM seat");
  res.json(result);
};

const getFlightsByID = async (req, res) => {
  const idPassenger = req.params.id;
  const reservedSeat = [];
  const unAssings = [];

  try {
    const [resultFlight] = await connection.query(
      "SELECT * FROM flight WHERE flight_id=?",
      [idPassenger]
    );
    const [result] = await connection.query(
      "SELECT * FROM seat WHERE airplane_id = ?",
      [resultFlight[0].airplane_id]
    );

    const [boarding_pass] = await connection.query(
      "SELECT * FROM boarding_pass JOIN passenger ON boarding_pass.passenger_id = passenger.passenger_id WHERE flight_id=?",
      [idPassenger]
    );

    var resultFlights = {
      flightId: resultFlight[0].flight_id,
      takeoffDateTime: resultFlight[0].takeoff_date_time,
      takeoffAirport: resultFlight[0].takeoff_airport,
      landingDateTime: resultFlight[0].landing_date_time,
      landingAirport: resultFlight[0].landing_airport,
      airplaneId: resultFlight[0].airplane_id,
      passengers: [],
    };

    let allPassengers = boarding_pass.sort(
      (a, b) => a.purchase_id - b.purchase_id
    );

    allPassengers.forEach((s) => {
      if (s.seat_id !== null) {
        reservedSeat.push(s.seat_id);
        resultFlights.passengers.push(s);
      }
      unAssings.push(s);
    });

    let availableSeat = await result.filter(
      (pass) => !reservedSeat.includes(pass.seat_id)
    );

    let minors = allPassengers.filter((p) => p.age < 18 && p.seat_id == null);
    let adults = allPassengers.filter((p) => p.age >= 18 && p.seat_id == null);

    if (minors.length) {
      for (let i = 0; i < minors.length; i++) {
        let availableSeatsForMinor = availableSeat.filter(
          (seat) => seat.seat_type_id === minors[i].seat_type_id
        );
        if (availableSeatsForMinor.length > 0) {
          let seatForMinor = availableSeatsForMinor[0];
          minors[i].seat_id = seatForMinor.seat_id;
          resultFlights.passengers.push(minors[i]);
          let nextSeatColumn = String.fromCharCode(
            seatForMinor.seat_column.charCodeAt() + 1
          );
          let availableSeatForAdult = availableSeat.find(
            (seat) =>
              seat.seat_row === seatForMinor.seat_row &&
              seat.seat_column === nextSeatColumn
          );
          if (availableSeatForAdult) {
            let adult = adults.find(
              (adult) => adult.purchase_id === minors[i].purchase_id
            );
            // console.log(adult, minors.length,)
            if (adult) {
              adult.seat_id = availableSeatForAdult.seat_id;
              resultFlights.passengers.push(adult);
              availableSeat.splice(availableSeat.indexOf(seatForMinor), 1);
              availableSeat.splice(
                availableSeat.indexOf(availableSeatForAdult),
                1
              );
              adults.splice(adults.indexOf(adult), 1);
            }
          }
        }
      }
    }
    let restPassenger = adults;
    if (restPassenger.length) {
      for (let i = 0; i < restPassenger.length; i++) {
        let seatsAdult1 = availableSeat.filter(
          (seat) => seat.seat_type_id === restPassenger[i].seat_type_id
        );
        if (seatsAdult1.length > 0) {
          let seatForAdult = seatsAdult1[0];
          restPassenger[i].seat_id = seatForAdult.seat_id;
          resultFlights.passengers.push(restPassenger[i]);

          // let nextSeatColumn = String.fromCharCode(
          //   seatForAdult.seat_column.charCodeAt() + 1
          // );
          // let availableSeatForAdult = availableSeat.find(
          //   (seat) =>
          //     seat.seat_row === seatForAdult.seat_row &&
          //     seat.seat_column === nextSeatColumn
          // );
          // if (availableSeatForAdult) {
          //   let adult = restPassenger.find(
          //     (adult) =>
          //     adult.purchase_id ===  restPassenger[i].purchase_id
          //   );
          // if (adult) {
          //   adult.seat_id = availableSeatForAdult.seat_id;
          //   resultFlights.passengers.push(adult);
          availableSeat.splice(availableSeat.indexOf(seatForAdult), 1);
          // availableSeat.splice(availableSeat.indexOf(availableSeatForAdult), 1);
          //   adults.splice(adults.indexOf(adult), 1);
          // }
          // }
        }
      }
    }
    console.log(resultFlights.passengers.length, allPassengers.length);
    // resultFlights.passengers.sort((a,b)=> a.purchase_id - b.purchase_id);
    resultFlights.passengers = resultFlights.passengers
      .map((d) => 
        d = {
          passengerId: d.passenger_id,
          dni: d.dni,
          name: d.name,
          age: d.age,
          country: d.country,
          boardingPassId: d.boarding_pass_id,
          purchaseId: d.purchase_id,
          seatTypeId: d.seat_type_id,
          seatId: d.seat_id,
      }).sort(sortFunc);

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
